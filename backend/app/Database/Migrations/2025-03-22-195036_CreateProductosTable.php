<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProductosTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
             'id' => ['type' => 'INT', 'constraint' => 5, 'unsigned' => true, 'auto_increment' => true],
             'nombre' => ['type' => 'VARCHAR', 'constraint' => 255],
             'categoria' => ['type' => 'VARCHAR', 'constraint' => 255],
             'precio'  => ['type' => 'DECIMAL', 'constraint' => '10,2'],
             'stock'  => ['type' => 'INT'],
             ]);
             $this->forge->addKey('id', true);
             $this->forge->createTable('productos');
            
    }

    public function down()
    {
        //
    }
}
