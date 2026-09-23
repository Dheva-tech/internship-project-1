-- ==========================================================
-- Infygrid Screening Task: Full-Stack Management System
-- Database Schema: student_management (MySQL / MariaDB)
-- Compatible with: XAMPP, WAMP, LAMP, Laragon, phpMyAdmin
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `student_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `student_management`;

-- --------------------------------------------------------
-- Table structure for table `departments`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `departments` (`id`, `code`, `name`) VALUES
(1, 'CSE', 'Computer Science & Engineering'),
(2, 'IT', 'Information Technology'),
(3, 'ECE', 'Electronics & Communication'),
(4, 'MECH', 'Mechanical Engineering'),
(5, 'CIVIL', 'Civil Engineering'),
(6, 'MGMT', 'Management & HR');

-- --------------------------------------------------------
-- Table structure for table `courses`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `department_id` INT NOT NULL,
  `duration_years` INT DEFAULT 4,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `courses` (`id`, `code`, `name`, `department_id`, `duration_years`) VALUES
(1, 'BTECH-CS', 'B.Tech Computer Science', 1, 4),
(2, 'BTECH-AI', 'B.Tech AI & Data Science', 1, 4),
(3, 'BTECH-IT', 'B.Tech Information Technology', 2, 4),
(4, 'BTECH-EC', 'B.Tech Electronics & Communication', 3, 4),
(5, 'BTECH-ME', 'B.Tech Mechanical Engineering', 4, 4),
(6, 'MBA', 'Master of Business Administration', 6, 2);

-- --------------------------------------------------------
-- Table structure for table `students` (Option A)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `enrollment_no` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(15) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `course` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `status` ENUM('Active', 'Inactive', 'Graduated') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_student_email` (`email`),
  INDEX `idx_student_dept` (`department`),
  INDEX `idx_student_enroll` (`enrollment_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial student sample records
INSERT INTO `students` (`enrollment_no`, `name`, `email`, `phone`, `date_of_birth`, `course`, `department`, `address`, `status`) VALUES
('STU-2024-001', 'Aarav Sharma', 'aarav.sharma@example.com', '9876543210', '2003-05-14', 'B.Tech Computer Science', 'Computer Science & Engineering', 'Flat 402, Green Glen Layout, Bellandur, Bengaluru', 'Active'),
('STU-2024-002', 'Priya Patel', 'priya.patel@example.com', '9823456781', '2004-02-20', 'B.Tech AI & Data Science', 'Computer Science & Engineering', '12, Shanti Nagar, SG Highway, Ahmedabad', 'Active'),
('STU-2024-003', 'Rohan Verma', 'rohan.verma@example.com', '9712345678', '2002-11-09', 'B.Tech Information Technology', 'Information Technology', 'Plot 88, Sector 15, Rohini, New Delhi', 'Active'),
('STU-2024-004', 'Sneha Iyer', 'sneha.iyer@example.com', '9445123456', '2003-08-30', 'B.Tech Electronics & Communication', 'Electronics & Communication', '34/B, 3rd Seaward Road, Valmiki Nagar, Chennai', 'Active'),
('STU-2024-005', 'Vikramaditya Rao', 'vikram.rao@example.com', '9988776655', '2001-09-17', 'Master of Business Administration', 'Management & HR', 'B-12, Banjara Hills Road No. 12, Hyderabad', 'Graduated'),
('STU-2024-006', 'Ananya Deshmukh', 'ananya.d@example.com', '9822012345', '2004-06-25', 'B.Tech Computer Science', 'Computer Science & Engineering', '702, Skyline Residency, Kothrud, Pune', 'Active'),
('STU-2024-007', 'Karthik Raja', 'karthik.raja@example.com', '9443218765', '2003-01-12', 'B.Tech Mechanical Engineering', 'Mechanical Engineering', '15, Crosscut Road, Gandhipuram, Coimbatore', 'Active'),
('STU-2024-008', 'Meera Nair', 'meera.nair@example.com', '9847123987', '2002-12-04', 'B.Tech Civil Engineering', 'Civil Engineering', 'TC 14/120, Sasthamangalam, Thiruvananthapuram', 'Inactive');

-- --------------------------------------------------------
-- Table structure for table `employees` (Option B)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(15) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `joining_date` DATE NOT NULL,
  `address` TEXT NOT NULL,
  `status` ENUM('Active', 'On Leave', 'Resigned') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_emp_email` (`email`),
  INDEX `idx_emp_dept` (`department`),
  INDEX `idx_emp_code` (`employee_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial employee sample records
INSERT INTO `employees` (`employee_code`, `name`, `email`, `phone`, `designation`, `department`, `salary`, `joining_date`, `address`, `status`) VALUES
('EMP-2023-101', 'Dr. Rajesh Sundaram', 'rajesh.sundaram@infygrid.in', '9840123456', 'Senior Professor & HOD', 'Computer Science & Engineering', 125000.00, '2021-06-15', '45, Anna Nagar West, Chennai', 'Active'),
('EMP-2023-102', 'Kavitha Swaminathan', 'kavitha.s@infygrid.in', '9841234567', 'Associate Professor', 'Information Technology', 95000.00, '2022-03-01', '12, TTK Road, Alwarpet, Chennai', 'Active'),
('EMP-2023-103', 'Aditya Sen', 'aditya.sen@infygrid.in', '9830129876', 'Senior Systems Engineer', 'Computer Science & Engineering', 85000.00, '2022-09-10', 'Block C, Salt Lake Sector V, Kolkata', 'Active'),
('EMP-2023-104', 'Tanvi Mathur', 'tanvi.m@infygrid.in', '9811223344', 'HR Operations Lead', 'Management & HR', 72000.00, '2023-01-16', 'D-40, South Extension Part 2, New Delhi', 'Active'),
('EMP-2023-105', 'Gautam Menon', 'gautam.menon@infygrid.in', '9744556677', 'Assistant Professor', 'Mechanical Engineering', 68000.00, '2023-07-20', '22, Panampilly Nagar, Kochi', 'Active'),
('EMP-2023-106', 'Shweta Kulkarni', 'shweta.k@infygrid.in', '9821098765', 'Lab Technical Officer', 'Electronics & Communication', 55000.00, '2024-02-01', '104, Viman Nagar, Pune', 'On Leave');
