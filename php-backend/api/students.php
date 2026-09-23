<?php
/**
 * Student CRUD REST API (PHP PDO)
 * Infygrid Screening Task - Option A
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle CORS Pre-flight request
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

/**
 * READ Operations (Single or List with search & filters)
 */
function handleGet($db, $id) {
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$id]);
        $student = $stmt->fetch();

        if ($student) {
            echo json_encode(["status" => "success", "data" => $student]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Student not found"]);
        }
    } else {
        $search = isset($_GET['search']) ? '%' . trim($_GET['search']) . '%' : null;
        $department = isset($_GET['department']) ? trim($_GET['department']) : null;
        $status = isset($_GET['status']) ? trim($_GET['status']) : null;

        $sql = "SELECT * FROM students WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (name LIKE ? OR email LIKE ? OR enrollment_no LIKE ? OR phone LIKE ?)";
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
        $students = $stmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "count" => count($students),
            "data" => $students
        ]);
    }
}

/**
 * CREATE Operation with Backend Validation
 */
function handlePost($db) {
    $data = json_decode(file_get_contents("php://input"), true);

    $errors = validateStudentData($db, $data);
    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(["status" => "error", "message" => "Validation failed", "errors" => $errors]);
        return;
    }

    $enrollmentNo = !empty($data['enrollment_no']) ? $data['enrollment_no'] : 'STU-' . date('Y') . '-' . str_pad(rand(100, 999), 3, '0', STR_PAD_LEFT);

    $stmt = $db->prepare("INSERT INTO students (enrollment_no, name, email, phone, date_of_birth, course, department, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $success = $stmt->execute([
        $enrollmentNo,
        trim($data['name']),
        trim($data['email']),
        trim($data['phone']),
        $data['date_of_birth'],
        trim($data['course']),
        trim($data['department']),
        trim($data['address']),
        isset($data['status']) ? $data['status'] : 'Active'
    ]);

    if ($success) {
        $newId = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Student registered successfully",
            "id" => $newId,
            "enrollment_no" => $enrollmentNo
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save student record"]);
    }
}

/**
 * UPDATE Operation with Validation
 */
function handlePut($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Student ID is required for update"]);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $errors = validateStudentData($db, $data, $id);
    if (!empty($errors)) {
        http_response_code(422);
        echo json_encode(["status" => "error", "message" => "Validation failed", "errors" => $errors]);
        return;
    }

    $stmt = $db->prepare("UPDATE students SET name = ?, email = ?, phone = ?, date_of_birth = ?, course = ?, department = ?, address = ?, status = ? WHERE id = ?");
    
    $success = $stmt->execute([
        trim($data['name']),
        trim($data['email']),
        trim($data['phone']),
        $data['date_of_birth'],
        trim($data['course']),
        trim($data['department']),
        trim($data['address']),
        $data['status'],
        $id
    ]);

    if ($success) {
        echo json_encode(["status" => "success", "message" => "Student record updated successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update student record"]);
    }
}

/**
 * DELETE Operation with Safety Confirmation
 */
function handleDelete($db, $id) {
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Student ID is required for deletion"]);
        return;
    }

    $stmt = $db->prepare("DELETE FROM students WHERE id = ?");
    $success = $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Student record deleted successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Record not found or already deleted"]);
    }
}

/**
 * Validation Helper
 */
function validateStudentData($db, $data, $excludeId = null) {
    $errors = [];

    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors['name'] = "Name is required and must be at least 2 characters.";
    }

    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "A valid email address is required.";
    } else {
        // Check for duplicate email
        $sql = "SELECT id FROM students WHERE email = ?";
        $params = [trim($data['email'])];
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        $checkStmt = $db->prepare($sql);
        $checkStmt->execute($params);
        if ($checkStmt->fetch()) {
            $errors['email'] = "This email address is already registered.";
        }
    }

    if (empty($data['phone']) || !preg_match("/^[0-9]{10}$/", preg_replace('/\D/', '', $data['phone']))) {
        $errors['phone'] = "Phone must be a valid 10-digit number.";
    }

    if (empty($data['date_of_birth'])) {
        $errors['date_of_birth'] = "Date of Birth is required.";
    }

    if (empty($data['course'])) {
        $errors['course'] = "Course selection is required.";
    }

    if (empty($data['department'])) {
        $errors['department'] = "Department selection is required.";
    }

    if (empty($data['address']) || strlen(trim($data['address'])) < 5) {
        $errors['address'] = "Address is required (minimum 5 characters).";
    }

    return $errors;
}
