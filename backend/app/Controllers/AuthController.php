<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use App\Models\UserModel;


class AuthController extends ResourceController {
    public function login()
    {
        //$data = $this->request->getPost(); 
        $data = json_decode($this->request->getBody(), true);
    
        $email = $data['email'] ?? '';   
        $password = $data['password'] ?? ''; 

        log_message('debug', 'Datos recibidos: ' . json_encode($data));
    
        if (empty($email) || empty($password)) {
            log_message('debug', 'Error: Credenciales vacías email: ' .$email);
            log_message('debug', 'Error: Credenciales vacías password: ' .$password);
            return $this->response->setJSON(['status' => 401, 'error' => 'Credenciales vacias']);
        }

        log_message('debug', 'Email ingresado: ' . $email);
    
        $userModel = new UserModel();
        $user = $userModel->findUserByEmail($email); 

        log_message('debug', 'Usuario encontrado: ' . json_encode($user));

        if ($user) {
           
            log_message('debug', "Contraseña ingresada: " . $password);  
            log_message('debug', "Contraseña hasheada en la base de datos: " . $user['password']);  
        }

        if (!$user) {
            error_log("No se encontró el usuario con email: " . $email);
            return $this->response->setJSON(['status' => 401, 'error' => 'Usuario incorrecto']);
        }
        if ($data['password'] !== $user['password']) {
            error_log("Contraseña incorrecta para el usuario con email: " . $email);
            return $this->response->setJSON(['status' => 401, 'error' => 'Password incorrecta']);
        }
    
       /* if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setJSON(['status' => 401, 'error' => 'Credenciales incorrectas']);
        }*/
    
        
        $token = $this->generateToken($user);
    
        return $this->response->setJSON(['status' => 200, 'token' => $token]);
    }

    private function generateToken($user) {
        $key = getenv('JWT_SECRET');
        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'iat' => time(),  
            'exp' => time() + 3600  
        ];
        
        return JWT::encode($payload, $key, 'HS256');
    }
    
    
}
