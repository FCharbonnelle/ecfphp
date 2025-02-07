<?php
// filepath: /c:/xampp/htdocs/ECFMVC/controller/PizzaController.php
require_once 'model/PizzaModel.php';

class PizzaController {
    private $model;

    public function __construct() {
        $this->model = new PizzaModel();
    }

    public function handleRequest() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->addOrder();
        } else {
            $this->showPizzas();
        }
    }

    private function showPizzas() {
        $pizzas = $this->model->getPizzas();
        include 'view/ecf.html';
    }

    private function addOrder() {
        $order = json_decode(file_get_contents('php://input'), true);
        $this->model->addOrder($order);
        echo json_encode(['status' => 'success']);
    }
}