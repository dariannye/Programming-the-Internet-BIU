<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\ProductoModel;


class Productos extends ResourceController
{
    protected $modelName = 'App\Models\ProductoModel';
    protected $format = 'json';
    public function __construct() {
        // Permitir CORS para todas las solicitudes
        header("Access-Control-Allow-Origin: http://localhost:4200/"); 
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
        
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit();
        }
    }

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

      // POST: Crear producto
      public function create() {
        header("Access-Control-Allow-Origin: http://localhost:4200/"); 
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");

        $data = $this->request->getJSON(true);
        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondCreated(['message' => 'Producto creado']);

    }

      // GET: Mostrar un producto
      public function show($id = null) {
        $producto = $this->model->find($id);
        return $producto ? $this->respond($producto) : $this->failNotFound('Producto no encontrado');
    }

     // PUT: Actualizar producto
     public function update($id = null) {
        $data = $this->request->getJSON(true);
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondUpdated(['message' => 'Producto actualizado']);
    }


    // DELETE: Eliminar producto
    public function delete($id = null) {
        if (!$this->model->delete($id)) {
            return $this->failNotFound('Producto no encontrado');
        }
        return $this->respondDeleted(['message' => 'Producto eliminado']);
    }




}
