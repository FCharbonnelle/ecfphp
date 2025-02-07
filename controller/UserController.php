<?php
require_once __DIR__ . '/../model/UserModel.php';

class UserController {
    private $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    public function register($username, $password) {
        try {
            $this->userModel->register($username, $password);
            echo 'Registration successful.';
        } catch (Exception $e) {
            echo 'Registration failed: ' . $e->getMessage();
        }
    }

    public function login($username, $password) {
        try {
            $user = $this->userModel->login($username, $password);
            echo 'Login successful. Welcome, ' . $user['username'] . '!';
        } catch (Exception $e) {
            echo 'Login failed: ' . $e->getMessage();
        }
    }
}
