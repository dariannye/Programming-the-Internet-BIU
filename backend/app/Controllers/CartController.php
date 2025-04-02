<?php
namespace App\Controllers;
use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class CartController extends ResourceController {
    protected $modelName = 'App\Models\ProductoModel';
    protected $format    = 'json';

    public function addToCart() {
        $request = $this->request->getJSON();
        $productId = $request->productId;
        $quantity = $request->quantity;
    
        $product = $this->model->find($productId);
        if (!$product || $product['stock'] < $quantity) {
            return $this->fail("Stock insuficiente");
        }
    
        // Reducir stock y actualizar
        $newStock = $product['stock'] - $quantity;
        $this->model->update($productId, ['stock' => $newStock]);
    
        // Devolver la respuesta con el nuevo stock y detalles del producto
        return $this->respond([
            "message" => "Producto agregado al carrito",
            "newStock" => $newStock,
            "product" => [
                'id' => $product['id'],
                'nombre' => $product['nombre'],
                'precio' => $product['precio'],
                'stock' => $newStock,
                'cantidad' => $quantity
            ]
        ]);
    }
    
}
