<?php
require_once 'Database.php';
// filepath: /c:/xampp/htdocs/ECFMVC/model/PizzaModel.php
class PizzaModel {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getPizzas() {
        try {
            $stmt = $this->db->query('SELECT * FROM pizza');
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            if ($e->getCode() == '42S02') { // Table not found
                throw new Exception('Table "pizza" does not exist in the database.');
            } else {
                throw $e;
            }
        }
    }

    public function addOrder($order) {
        $db = Database::getInstance();
        $stmt = $db ->prepare("INSERT INTO orders (details) VALUES (:details)");
        $stmt->bindParam(':details', json_encode($order));
        $stmt->execute();
    }
}