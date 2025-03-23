<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

#$routes->resource('productos');
$routes->get('productos', 'Productos::index');      
$routes->post('productos', 'Productos::create');     
$routes->get('productos/(:num)', 'Productos::show/$1'); 
$routes->put('productos/(:num)', 'Productos::update/$1');
$routes->delete('productos/(:num)', 'Productos::delete/$1'); 
$routes->group('', ['filter' => 'cors'], static function (RouteCollection $routes): void {
    $routes->resource('product');

    $routes->options('product', static function () {
        $response = response();
        $response->setStatusCode(204);
        $response->setHeader('Allow:', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

        return $response;
    });
    $routes->options('product/(:any)', static function () {});
});



