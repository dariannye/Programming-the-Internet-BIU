<?php
namespace App\Filters;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;

class AuthFilter implements FilterInterface {
    public function before(RequestInterface $request, $arguments = null) {
        $token = $request->getHeaderLine('Authorization');

        if (!$token) {
            return response()->setJSON(['error' => 'Acceso no autorizado'])->setStatusCode(401);
        }

        try {
            $key = getenv('JWT_SECRET');
            JWT::decode(str_replace('Bearer ', '', $token), $key, ['HS256']);
        } catch (\Exception $e) {
            return response()->setJSON(['error' => 'Token inválido'])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null) {}
}
