<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

require_once 'controller/PizzaController.php';

$controller = new PizzaController();
$controller->handleRequest();