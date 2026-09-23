# Infygrid Screening Task — Full-Stack Student & Employee Management System

> **Candidate Submission:** DHEVADHARSHAN G  
> **Contact Email:** dhevadharshangd@gmail.com  
> **Submission To:** contact@infygrid.in  
> **Position:** 30-Day Web Developer Internship (Remote)  

---

## 1. Project Overview

This project is a production-ready, full-stack **Student & Employee Management System** developed strictly in accordance with the **Infygrid Web Developer Internship Screening Task Guidelines**.

It features complete **CRUD Operations** (Create, Read, Update, Delete), strict **Frontend and Backend Validation**, duplicate email detection, responsive UI built with Tailwind CSS, an integrated **MySQL Database Schema Exporter**, interactive SQL viewer, and full dual support for:
- **Option A:** Student Management System (Name, Email, Phone, DOB, Course, Department, Address, Status, Enrollment No)
- **Option B:** Employee Management System (Name, Email, Phone, Designation, Department, Salary, Joining Date, Address, Status, Employee Code)

---

## 2. Technologies Used

| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite |
| **Backend** | Dual Backend Architecture: <br>1. **PHP 8.x (PDO)** REST API for XAMPP / WAMP / Laragon<br>2. **Node.js / Express** REST API with server-side validation |
| **Database** | MySQL 8.x / MariaDB (InnoDB, Foreign Keys, Unique Indexes, Prepared Statements) |
| **Tools** | XAMPP / WAMP / Laragon, phpMyAdmin, Git / GitHub, Postman |

---

## 3. Database Schema & Architecture

The database is named `student_management` and is fully normalized:

### Tables
1. **`students`**: Primary key `id` (AUTO_INCREMENT), `enrollment_no` (UNIQUE), `name`, `email` (UNIQUE), `phone`, `date_of_birth`, `course`, `department`, `address`, `status`, `created_at`, `updated_at`.
2. **`employees`**: Primary key `id` (AUTO_INCREMENT), `employee_code` (UNIQUE), `name`, `email` (UNIQUE), `phone`, `designation`, `department`, `salary`, `joining_date`, `address`, `status`, `created_at`, `updated_at`.
3. **`departments`**: Reference master table for academic/corporate departments.
4. **`courses`**: Degree/program listings associated with department foreign keys.

The full SQL dump with seed records is provided in `/php-backend/database.sql` and can also be exported with 1-click directly from the web application's **"Database & SQL"** tab.

---

## 4. Local Server Setup Instructions

### Option 1: Running with XAMPP / WAMP / Laragon (PHP + MySQL)

1. **Install XAMPP / WAMP:**
   - Download and install XAMPP from [apachefriends.org](https://www.apachefriends.org/).
   - Open the **XAMPP Control Panel** and start **Apache** and **MySQL**.

2. **Import Database in phpMyAdmin:**
   - Open your browser and navigate to `http://localhost/phpmyadmin/`.
   - Click **New** and create a database named `student_management`.
   - Go to the **Import** tab.
   - Choose the file `php-backend/database.sql` from this repository.
   - Click **Go** / **Import**. Tables `students`, `employees`, `departments`, and `courses` will be created with initial records.

3. **Deploy Backend API:**
   - Copy the folder `php-backend/` to your web server root:
     - For XAMPP: `C:/xampp/htdocs/student_management_api/`
     - For WAMP: `C:/wamp64/www/student_management_api/`
     - For Laragon: `C:/laragon/www/student_management_api/`
   - Check `config/database.php` to verify your database credentials (default `root` with empty password).

4. **Verify PHP REST API Endpoints:**
   - `GET http://localhost/student_management_api/api/students.php`
   - `GET http://localhost/student_management_api/api/employees.php`

---

### Option 2: Running with Node.js Full-Stack Server

1. **Prerequisites:**
   - Node.js (v18 or higher) and npm installed.

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will start immediately on `http://localhost:3000`.

---

## 5. CRUD Operations Demonstration

1. **CREATE:**
   - Click the **"+ Add New Student"** or **"+ Add New Employee"** button in the header.
   - Real-time frontend validation ensures phone numbers match 10 digits, email conforms to RFC regex, and dates are valid.
   - When submitted, the backend validates for duplicate emails and returns structured field errors or creates the record with an automated enrollment/employee code.

2. **READ:**
   - Responsive data table with sorting by name, enrollment date, or department.
   - Live search bar queries across name, email, phone, and ID codes.
   - Department and status dropdown filters with count badges.
   - Toggle between **Table View** and **Card Grid View**.

3. **UPDATE:**
   - Click the **Edit** action icon on any record.
   - Modal opens pre-populated with current values.
   - On save, backend checks uniqueness excluding the current record ID.

4. **DELETE:**
   - Click the **Delete** icon.
   - A modal requires deliberate confirmation showing the student's/employee's name to prevent accidental data loss.

---

## 6. How Frontend Communicates with Backend

1. **Standardized REST Endpoints:**
   - `GET /api/students` — List all or search/filter
   - `GET /api/students/:id` — Retrieve single record
   - `POST /api/students` — Create new student
   - `PUT /api/students/:id` — Update student
   - `DELETE /api/students/:id` — Delete student

2. **Error Handling & Feedback:**
   - Server returns standard HTTP codes:
     - `200 OK` / `201 Created`
     - `400 Bad Request`
     - `404 Not Found`
     - `422 Unprocessable Entity` (Field validation errors)
   - Visual notification toast system provides immediate user feedback on success and failure.

---

## 7. Project Structure

```
├── php-backend/
│   ├── config/
│   │   └── database.php       # PDO MySQL Connection for WAMP/XAMPP
│   ├── api/
│   │   ├── students.php       # Student CRUD REST API (GET, POST, PUT, DELETE)
│   │   └── employees.php      # Employee CRUD REST API (GET, POST, PUT, DELETE)
│   └── database.sql           # Complete MySQL schema & seed data
├── server.ts                  # Express REST API + Vite full-stack server
├── src/
│   ├── components/
│   │   ├── Header.tsx         # App brand, view switchers, and quick actions
│   │   ├── DashboardStats.tsx # Analytics KPI metrics & department distribution
│   │   ├── StudentTable.tsx   # Student listing with search, filters & pagination
│   │   ├── StudentModal.tsx   # Add/Edit Student form with validation
│   │   ├── EmployeeTable.tsx  # Employee listing with search, filters & salary metrics
│   │   ├── EmployeeModal.tsx  # Add/Edit Employee form with validation
│   │   ├── DeleteConfirmModal.tsx # Safe deletion dialog
│   │   ├── DatabaseViewer.tsx # Interactive SQL viewer, schema inspector & exporter
│   │   └── InterviewGuide.tsx # Demonstration script & Infygrid submission guide
│   ├── types.ts               # Shared TypeScript data models
│   ├── api.ts                 # Frontend API client library
│   ├── App.tsx                # Main application orchestrator
│   └── index.css              # Tailwind styling & animations
├── package.json
└── README.md                  # Complete screening task documentation
```

---

## 8. Screening Interview Presentation Guide

During the interview demonstration meeting:
1. **Start Server:** Show terminal running `npm run dev` or XAMPP Apache + MySQL.
2. **Demonstrate CRUD:**
   - Add a student with an invalid email or short phone number to demonstrate validation errors.
   - Correct the input and submit to show successful creation and auto-generated ID.
   - Show duplicate email rejection.
   - Search by name, filter by department, edit a record, and delete with confirmation.
3. **Show Database:**
   - Open the **"Database & SQL"** tab inside the app or open phpMyAdmin to show the raw tables and explain primary keys and indexes.
4. **Code Walk-through:**
   - Explain PDO prepared statements preventing SQL injection in `php-backend/api/students.php`.
   - Explain validation layer and state management in React.

---

## 9. Submission Email

**To:** `contact@infygrid.in`  
**Subject:** Web Developer Internship Screening Task Submission — Dhevadharshan G  
**Body:**
> Dear Infygrid Evaluation Team,
>
> I have completed the Full-Stack Student/Employee Management System screening task for the 30-Day Web Developer Internship.
>
> **GitHub Repository:** [Insert Repository URL]  
> **Candidate Name:** Dhevadharshan G  
> **Contact Email:** dhevadharshangd@gmail.com  
>
> The project includes complete CRUD operations, frontend & backend validation, MySQL database schema export (`database.sql`), dual PHP (PDO) and Express REST API backends, and full documentation for local setup on XAMPP/WAMP.
>
> I look forward to the project demonstration meeting.
>
> Sincerely,  
> Dhevadharshan G
