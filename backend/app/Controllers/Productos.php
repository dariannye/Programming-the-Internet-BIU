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

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            header("HTTP/1.1 200 OK");
            exit();
        }
    }

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function showByName($nombre)
    {
        $producto = $this->model->where('nombre', $nombre)->first();
        return $producto ? $this->respond($producto) : $this->failNotFound('Producto no encontrado');
    }

    // Método para obtener productos por categoría
    public function showByCategoria($categoria)
    {
        log_message('debug', "Buscando productos en la categoría: {$categoria}");
        $productos = $this->model->where('categoria', $categoria)->findAll();

        if (!$productos) {
            return $this->failNotFound("No se encontraron productos en la categoría {$categoria}");
        }

        return $this->respond($productos);
    }


      // POST: Crear producto
      public function create() {

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
        //$data = $this->request->getJSON(true);
        $data = json_decode($this->request->getBody(), true);

        log_message('debug', 'Datos recibidos en update: ' . json_encode($data));
        if (!$data) {
            log_message('error', 'Los datos están vacíos o nulos.');
            return $this->failValidationErrors('Datos nulos o vacíos.');
        }
    
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondUpdated(['message' => 'Producto actualizado']);


        /*if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondUpdated(['message' => 'Producto actualizado']);*/
    }


    // DELETE: Eliminar producto
    public function delete($id = null) {
        if (!$this->model->delete($id)) {
            return $this->failNotFound('Producto no encontrado');
        }
        return $this->respondDeleted(['message' => 'Producto eliminado']);
    }




}
