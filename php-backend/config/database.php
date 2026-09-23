<?php
/**
 * Database Configuration for WAMP / XAMPP / Laragon / LAMP
 * Infygrid Screening Task - Student & Employee Management System
 */

class Database {
    private $host = "localhost";
    private $db_name = "student_management";
    private $username = "root";
    private $password = ""; // Default empty in XAMPP/WAMP
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            header('Content-Type: application/json');
            echo json_encode([
                "status" => "error",
                "message" => "Database Connection Error: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
