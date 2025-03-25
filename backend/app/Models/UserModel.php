<?php
namespace App\Models;
use CodeIgniter\Model;

class UserModel extends Model {
    protected $table = 'usuarios';
    protected $allowedFields = ['email', 'password'];
    protected $primaryKey = 'id';


    public function findUserByEmail($email) {
        return $this->where('email', $email)->first();
    }
}

