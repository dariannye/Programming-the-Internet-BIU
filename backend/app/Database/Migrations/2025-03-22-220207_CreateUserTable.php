<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUserTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 5, 'unsigned' => true, 'auto_increment' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 100, 'UNIQUE'],
            'password'  => ['type' => 'VARCHAR', 'constraint' => 255],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->createTable('usuarios');
    }

    public function down()
    {
        //
    }
}
