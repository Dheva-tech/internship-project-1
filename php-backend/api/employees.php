<?php
/**
 * Employee CRUD REST API (PHP PDO)
 * Infygrid Screening Task - Option B
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        handleGet($db, $id);
        break;
    case 'POST':
        handlePost($db);
        break;
    case 'PUT':
        handlePut($db, $id);
        break;
    case 'DELETE':
        handleDelete($db, $id);
        break;
    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

function handleGet($db, $id) {
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM employees WHERE id = ?");
        $stmt->execute([$id]);
        $employee = $stmt->fetch();

        if ($employee) {
            echo json_encode(["status" => "success", "data" => $employee]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Employee not found"]);
        }
    } else {
        $search = isset($_GET['search']) ? '%' . trim($_GET['search']) . '%' : null;
        $department = isset($_GET['department']) ? trim($_GET['department']) : null;
        $status = isset($_GET['status']) ? trim($_GET['status']) : null;

        $sql = "SELECT * FROM employees WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (name LIKE ? OR email LIKE ? OR employee_code LIKE ? OR designation LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        if ($department && $department !== 'all') {
            $sql .= " AND department = ?";
            $params[] = $department;
        }

        if ($status && $status !== 'all') {
            $sql .= " AND status = ?";
            $params[] = $status;
        }

        $sql .= " ORDER BY id DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $employees = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "count" => count($employees),
            "data" => $employees
        ]);
    }
}

function handlePost($db) {
    $data = json_decode(file_get_contents("php://input"), true);

    $errors = validateEmployeeData($db, $data);
    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(["status" => "error", "message" => "Validation failed", "errors" => $errors]);
        return;
    }

    $empCode = !empty($data['employee_code']) ? $data['employee_code'] : 'EMP-' . date('Y') . '-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);

    $stmt = $db->prepare("INSERT INTO employees (employee_code, name, email, phone, designation, department, salary, joining_date, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $success = $stmt->execute([
        $empCode,
        trim($data['name']),
        trim($data['email']),
        trim($data['phone']),
        trim($data['designation']),
        trim($data['department']),
        floatval($data['salary']),
        $data['joining_date'],
        trim($data['address']),
        isset($data['status']) ? $data['status'] : 'Active'
    ]);

    if ($success) {
        $newId = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Employee record created successfully",
            "id" => $newId,
            "employee_code" => $empCode
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save employee record"]);
    }
}

function handlePut($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Employee ID is required"]);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $errors = validateEmployeeData($db, $data, $id);
    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(["status" => "error", "message" => "Validation failed", "errors" => $errors]);
        return;
    }

    $stmt = $db->prepare("UPDATE employees SET name = ?, email = ?, phone = ?, designation = ?, department = ?, salary = ?, joining_date = ?, address = ?, status = ? WHERE id = ?");
    
    $success = $stmt->execute([
        trim($data['name']),
        trim($data['email']),
        trim($data['phone']),
        trim($data['designation']),
        trim($data['department']),
        floatval($data['salary']),
        $data['joining_date'],
        trim($data['address']),
        $data['status'],
        $id
    ]);

    if ($success) {
        echo json_encode(["status" => "success", "message" => "Employee record updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update employee record"]);
    }
}

function handleDelete($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Employee ID is required"]);
        return;
    }

    $stmt = $db->prepare("DELETE FROM employees WHERE id = ?");
    $success = $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Employee record deleted successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Record not found"]);
    }
}

function validateEmployeeData($db, $data, $excludeId = null) {
    $errors = [];

    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors['name'] = "Name is required (minimum 2 characters).";
    }

    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "A valid work email address is required.";
    } else {
        $sql = "SELECT id FROM employees WHERE email = ?";
        $params = [trim($data['email'])];
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        $checkStmt = $db->prepare($sql);
        $checkStmt->execute($params);
        if ($checkStmt->fetch()) {
            $errors['email'] = "This employee email is already registered.";
        }
    }

    if (empty($data['phone']) || !preg_match("/^[0-9]{10}$/", preg_replace('/\D/', '', $data['phone']))) {
        $errors['phone'] = "Phone must be a valid 10-digit number.";
    }

    if (empty($data['designation'])) {
        $errors['designation'] = "Designation is required.";
    }

    if (empty($data['department'])) {
        $errors['department'] = "Department is required.";
    }

    if (!isset($data['salary']) || floatval($data['salary']) <= 0) {
        $errors['salary'] = "Valid positive monthly salary is required.";
    }

    if (empty($data['joining_date'])) {
        $errors['joining_date'] = "Joining date is required.";
    }

    if (empty($data['address']) || strlen(trim($data['address'])) < 5) {
        $errors['address'] = "Address is required (minimum 5 characters).";
    }

    return $errors;
}
