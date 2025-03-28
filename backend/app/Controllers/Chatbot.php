<?php
namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;

class Chatbot extends ResourceController {
    private $apiKey;
    public function __construct() {
        $this->apiKey = getenv('OPENAI_API_KEY'); 
    }

    public function obtener_respuesta() {
        //$json = $this->request->getJSON();
        $json = json_decode($this->request->getBody());
        $mensaje = $json->mensaje ?? '';

        if (!$mensaje) {
            return $this->respond(['error' => 'No se recibió el mensaje'], 400);
        }

        // URL de la API de OpenAI
        $url = 'https://api.openai.com/v1/chat/completions';

        // Datos de la solicitud
        $data = [
            'model' => 'gpt-3.5-turbo', // Modelo de OpenAI
            'messages' => [['role' => 'user', 'content' => $mensaje]],
            'temperature' => 0.7,
            'max_tokens' => 150
        ];

        // Configuración de la solicitud cURL
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
        $error = curl_error($ch);
        curl_close($ch);
        log_message('debug', "Respuesta de OpenAI: " . $response);

        /*if (!$response) {
            return $this->respond(['error' => 'Error al conectar con OpenAI'], 500);
        }*/
        if (!$response) {
            return $this->respond([
                'error' => 'Error al conectar con OpenAI',
                'detalle' => $error 
            ], 500);
        }

        $decodedResponse = json_decode($response, true);
        $respuestaTexto = $decodedResponse['choices'][0]['message']['content'] ?? 'Error al obtener respuesta';
        ////return $this->respond(['debug' => $decodedResponse], 200);
        return $this->respond(['respuesta' => $respuestaTexto], $http_code);
    }
}
