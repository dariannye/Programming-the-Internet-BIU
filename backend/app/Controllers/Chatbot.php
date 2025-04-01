<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProductoModel;

class Chatbot extends ResourceController {
    private $apiKey;
    private $productoModel;

    public function __construct() {
        $this->apiKey = getenv('OPENAI_API_KEY');
        $this->productoModel = new ProductoModel();  // Cargar el modelo de productos
    }

    public function obtener_respuesta() {
        $json = json_decode($this->request->getBody());
        $mensaje = $json->mensaje ?? '';

        if (!$mensaje) {
            return $this->respond(['error' => 'No se recibió el mensaje'], 400);
        }

        $mensajeLower = strtolower($mensaje);

        // Detectar si se está preguntando por productos en una categoría
        if (strpos($mensajeLower, 'productos en la categoría') !== false || strpos($mensajeLower, 'productos de la categoría') !== false) {
            return $this->obtenerProductosPorCategoria($mensajeLower);
        }

        // Detectar si el mensaje es una pregunta sobre un producto específico
        $producto = $this->extraerNombreProducto($mensaje);

        if ($producto) {
            return $this->procesarConsultaProducto($producto, $mensaje);
        } else {
            return $this->consultarOpenAI($mensaje);
        }
    }

    // Función para extraer el nombre del producto desde el mensaje
    private function extraerNombreProducto($mensaje) {
        $regex = '/\b(el|la|los|las)\s([a-zA-Z0-9áéíóúÁÉÍÓÚüÜ]+)\b/';
        if (preg_match($regex, $mensaje, $matches)) {
            return $matches[2];
        }
        return null;
    }

    // Procesar consulta relacionada con productos (stock, precio, categoría)
    private function procesarConsultaProducto($producto, $mensaje) {
        $productoInfo = $this->productoModel->where('nombre', $producto)->first();

        if (!$productoInfo) {
            return $this->respond(['error' => 'Producto no encontrado'], 404);
        }

        log_message('info', "Producto encontrado: " . json_encode($productoInfo));

        if (strpos($mensaje, 'cuesta') !== false) {
            return $this->respond([
                'respuesta' => "El precio del producto {$producto} es {$productoInfo['precio']}."
            ]);
        }

        if (strpos($mensaje, 'categoría') !== false) {
            return $this->respond([
                'respuesta' => "El producto {$producto} pertenece a la categoría {$productoInfo['categoria']}."
            ]);
        }

        if (strpos($mensaje, 'stock') !== false || strpos($mensaje, 'disponible') !== false || strpos($mensaje, 'queda') !== false) {
            return $this->respond([
                'respuesta' => "Actualmente hay {$productoInfo['stock']} unidades de {$producto} en stock."
            ]);
        }

        return $this->respond([
            'respuesta' => "Lo siento, no pude entender tu pregunta sobre {$producto}."
        ]);
    }

    // Obtener productos por categoría
    private function obtenerProductosPorCategoria($mensaje) {
        preg_match('/categoría\s+([a-zA-Z0-9áéíóúÁÉÍÓÚüÜ]+)/', $mensaje, $matches);
        $categoria = $matches[1] ?? null;

        if ($categoria) {
            $productosCategoria = $this->productoModel->where('categoria', $categoria)->findAll();
            if (!empty($productosCategoria)) {
                $nombresProductos = array_map(fn($p) => $p['nombre'], $productosCategoria);
                return $this->respond([
                    'respuesta' => "Los productos en la categoría {$categoria} son: " . implode(', ', $nombresProductos) . "."
                ]);
            } else {
                return $this->respond(['respuesta' => "No hay productos en la categoría {$categoria}."]);
            }
        }

        return $this->respond(['error' => 'No se pudo determinar la categoría'], 400);
    }

    // Consultar OpenAI si la pregunta no es sobre productos
    private function consultarOpenAI($mensaje) {
        $url = 'https://api.openai.com/v1/chat/completions';

        $data = [
            'model' => 'gpt-3.5-turbo',
            'messages' => [['role' => 'user', 'content' => $mensaje]],
            'temperature' => 0.7,
            'max_tokens' => 150
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . trim($this->apiKey)
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (!$response) {
            return $this->respond(['error' => 'Error al conectar con OpenAI'], 500);
        }

        $decodedResponse = json_decode($response, true);
        $respuestaTexto = $decodedResponse['choices'][0]['message']['content'] ?? 'Error al obtener respuesta';

        return $this->respond(['respuesta' => $respuestaTexto], $http_code);
    }
}


