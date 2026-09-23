import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database State (Initial Seed Data matching database.sql)
interface StudentRecord {
  id: number;
  enrollment_no: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  course: string;
  department: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  created_at: string;
  updated_at?: string;
}

interface EmployeeRecord {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  salary: number;
  joining_date: string;
  address: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  created_at: string;
  updated_at?: string;
}

const DEPARTMENTS = [
  { id: 1, code: 'CSE', name: 'Computer Science & Engineering' },
  { id: 2, code: 'IT', name: 'Information Technology' },
  { id: 3, code: 'ECE', name: 'Electronics & Communication' },
  { id: 4, code: 'MECH', name: 'Mechanical Engineering' },
  { id: 5, code: 'CIVIL', name: 'Civil Engineering' },
  { id: 6, code: 'MGMT', name: 'Management & HR' }
];

const COURSES = [
  { id: 1, code: 'BTECH-CS', name: 'B.Tech Computer Science', department_id: 1, duration_years: 4 },
  { id: 2, code: 'BTECH-AI', name: 'B.Tech AI & Data Science', department_id: 1, duration_years: 4 },
  { id: 3, code: 'BTECH-IT', name: 'B.Tech Information Technology', department_id: 2, duration_years: 4 },
  { id: 4, code: 'BTECH-EC', name: 'B.Tech Electronics & Communication', department_id: 3, duration_years: 4 },
  { id: 5, code: 'BTECH-ME', name: 'B.Tech Mechanical Engineering', department_id: 4, duration_years: 4 },
  { id: 6, code: 'MBA', name: 'Master of Business Administration', department_id: 6, duration_years: 2 }
];

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 1,
    enrollment_no: 'STU-2024-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    date_of_birth: '2003-05-14',
    course: 'B.Tech Computer Science',
    department: 'Computer Science & Engineering',
    address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru',
    status: 'Active',
    created_at: '2024-08-10T09:30:00Z'
  },
  {
    id: 2,
    enrollment_no: 'STU-2024-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '9823456781',
    date_of_birth: '2004-02-20',
    course: 'B.Tech AI & Data Science',
    department: 'Computer Science & Engineering',
    address: '12, Shanti Nagar, SG Highway, Ahmedabad',
    status: 'Active',
    created_at: '2024-08-11T10:15:00Z'
  },
  {
    id: 3,
    enrollment_no: 'STU-2024-003',
    name: 'Rohan Verma',
    email: 'rohan.verma@example.com',
    phone: '9712345678',
    date_of_birth: '2002-11-09',
    course: 'B.Tech Information Technology',
    department: 'Information Technology',
    address: 'Plot 88, Sector 15, Rohini, New Delhi',
    status: 'Active',
    created_at: '2024-08-12T11:00:00Z'
  },
  {
    id: 4,
    enrollment_no: 'STU-2024-004',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    phone: '9445123456',
    date_of_birth: '2003-08-30',
    course: 'B.Tech Electronics & Communication',
    department: 'Electronics & Communication',
    address: '34/B, 3rd Seaward Road, Valmiki Nagar, Chennai',
    status: 'Active',
    created_at: '2024-08-13T14:20:00Z'
  },
  {
    id: 5,
    enrollment_no: 'STU-2024-005',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@example.com',
    phone: '9988776655',
    date_of_birth: '2001-09-17',
    course: 'Master of Business Administration',
    department: 'Management & HR',
    address: 'B-12, Banjara Hills Road No. 12, Hyderabad',
    status: 'Graduated',
    created_at: '2023-07-01T08:00:00Z'
  },
  {
    id: 6,
    enrollment_no: 'STU-2024-006',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    phone: '9822012345',
    date_of_birth: '2004-06-25',
    course: 'B.Tech Computer Science',
    department: 'Computer Science & Engineering',
    address: '702, Skyline Residency, Kothrud, Pune',
    status: 'Active',
    created_at: '2024-08-14T16:45:00Z'
  },
  {
    id: 7,
    enrollment_no: 'STU-2024-007',
    name: 'Karthik Raja',
    email: 'karthik.raja@example.com',
    phone: '9443218765',
    date_of_birth: '2003-01-12',
    course: 'B.Tech Mechanical Engineering',
    department: 'Mechanical Engineering',
    address: '15, Crosscut Road, Gandhipuram, Coimbatore',
    status: 'Active',
    created_at: '2024-08-15T09:00:00Z'
  },
  {
    id: 8,
    enrollment_no: 'STU-2024-008',
    name: 'Meera Nair',
    email: 'meera.nair@example.com',
    phone: '9847123987',
    date_of_birth: '2002-12-04',
    course: 'B.Tech Civil Engineering',
    department: 'Civil Engineering',
    address: 'TC 14/120, Sasthamangalam, Thiruvananthapuram',
    status: 'Inactive',
    created_at: '2024-08-16T13:10:00Z'
  }
];

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 1,
    employee_code: 'EMP-2023-101',
    name: 'Dr. Rajesh Sundaram',
    email: 'rajesh.sundaram@infygrid.in',
    phone: '9840123456',
    designation: 'Senior Professor & HOD',
    department: 'Computer Science & Engineering',
    salary: 125000,
    joining_date: '2021-06-15',
    address: '45, Anna Nagar West, Chennai',
    status: 'Active',
    created_at: '2021-06-15T09:00:00Z'
  },
  {
    id: 2,
    employee_code: 'EMP-2023-102',
    name: 'Kavitha Swaminathan',
    email: 'kavitha.s@infygrid.in',
    phone: '9841234567',
    designation: 'Associate Professor',
    department: 'Information Technology',
    salary: 95000,
    joining_date: '2022-03-01',
    address: '12, TTK Road, Alwarpet, Chennai',
    status: 'Active',
    created_at: '2022-03-01T09:00:00Z'
  },
  {
    id: 3,
    employee_code: 'EMP-2023-103',
    name: 'Aditya Sen',
    email: 'aditya.sen@infygrid.in',
    phone: '9830129876',
    designation: 'Senior Systems Engineer',
    department: 'Computer Science & Engineering',
    salary: 85000,
    joining_date: '2022-09-10',
    address: 'Block C, Salt Lake Sector V, Kolkata',
    status: 'Active',
    created_at: '2022-09-10T09:00:00Z'
  },
  {
    id: 4,
    employee_code: 'EMP-2023-104',
    name: 'Tanvi Mathur',
    email: 'tanvi.m@infygrid.in',
    phone: '9811223344',
    designation: 'HR Operations Lead',
    department: 'Management & HR',
    salary: 72000,
    joining_date: '2023-01-16',
    address: 'D-40, South Extension Part 2, New Delhi',
    status: 'Active',
    created_at: '2023-01-16T09:00:00Z'
  },
  {
    id: 5,
    employee_code: 'EMP-2023-105',
    name: 'Gautam Menon',
    email: 'gautam.menon@infygrid.in',
    phone: '9744556677',
    designation: 'Assistant Professor',
    department: 'Mechanical Engineering',
    salary: 68000,
    joining_date: '2023-07-20',
    address: '22, Panampilly Nagar, Kochi',
    status: 'Active',
    created_at: '2023-07-20T09:00:00Z'
  },
  {
    id: 6,
    employee_code: 'EMP-2023-106',
    name: 'Shweta Kulkarni',
    email: 'shweta.k@infygrid.in',
    phone: '9821098765',
    designation: 'Lab Technical Officer',
    department: 'Electronics & Communication',
    salary: 55000,
    joining_date: '2024-02-01',
    address: '104, Viman Nagar, Pune',
    status: 'On Leave',
    created_at: '2024-02-01T09:00:00Z'
  }
];

let studentsDatabase = JSON.parse(JSON.stringify(INITIAL_STUDENTS)) as StudentRecord[];
let employeesDatabase = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES)) as EmployeeRecord[];
let nextStudentId = 9;
let nextEmployeeId = 7;

// --- VALIDATION HELPERS ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

function validateStudent(data: any, excludeId?: number): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.name = 'Full Name is required (at least 2 characters).';
  }

  if (!data.email || !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'A valid email address is required (e.g. student@example.com).';
  } else {
    const cleanEmail = data.email.trim().toLowerCase();
    const duplicate = studentsDatabase.find(
      (s) => s.email.toLowerCase() === cleanEmail && (!excludeId || s.id !== excludeId)
    );
    if (duplicate) {
      errors.email = 'This email address is already registered in the system.';
    }
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (!PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Phone number must be a valid 10-digit number.';
  }

  if (!data.date_of_birth) {
    errors.date_of_birth = 'Date of Birth is required.';
  } else {
    const dob = new Date(data.date_of_birth);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      errors.date_of_birth = 'Date of birth cannot be in the future.';
    }
  }

  if (!data.course || data.course.trim() === '') {
    errors.course = 'Please select a course.';
  }

  if (!data.department || data.department.trim() === '') {
    errors.department = 'Please select a department.';
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Full address is required (minimum 5 characters).';
  }

  return errors;
}

function validateEmployee(data: any, excludeId?: number): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.name = 'Full Name is required (at least 2 characters).';
  }

  if (!data.email || !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'A valid corporate email address is required.';
  } else {
    const cleanEmail = data.email.trim().toLowerCase();
    const duplicate = employeesDatabase.find(
      (e) => e.email.toLowerCase() === cleanEmail && (!excludeId || e.id !== excludeId)
    );
    if (duplicate) {
      errors.email = 'This employee email is already registered in the system.';
    }
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (!PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Phone number must be a valid 10-digit number.';
  }

  if (!data.designation || data.designation.trim() === '') {
    errors.designation = 'Designation/Title is required.';
  }

  if (!data.department || data.department.trim() === '') {
    errors.department = 'Department selection is required.';
  }

  const salaryNum = Number(data.salary);
  if (isNaN(salaryNum) || salaryNum <= 0) {
    errors.salary = 'Please enter a valid positive salary amount.';
  }

  if (!data.joining_date) {
    errors.joining_date = 'Joining Date is required.';
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = 'Address is required (minimum 5 characters).';
  }

  return errors;
}

// ==========================================
// 1. STUDENTS API (CRUD)
// ==========================================

// READ: List with search, filters, sorting and pagination
app.get('/api/students', (req: Request, res: Response) => {
  try {
    let result = [...studentsDatabase];
    const { search, department, status, sortBy = 'id', sortOrder = 'desc', page = '1', limit = '10' } = req.query;

    // Search filter across name, email, phone, enrollment_no
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.enrollment_no.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.course.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (department && department !== 'all' && typeof department === 'string') {
      result = result.filter((s) => s.department === department);
    }

    // Status filter
    if (status && status !== 'all' && typeof status === 'string') {
      result = result.filter((s) => s.status === status);
    }

    // Sorting
    result.sort((a: any, b: any) => {
      let valA = a[sortBy as string];
      let valB = b[sortBy as string];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    res.json({
      status: 'success',
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: paginatedItems
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// READ: Single Student
app.get('/api/students/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const student = studentsDatabase.find((s) => s.id === id);
  if (!student) {
    return res.status(404).json({ status: 'error', message: 'Student not found' });
  }
  res.json({ status: 'success', data: student });
});

// CREATE: Add new student
app.post('/api/students', (req: Request, res: Response) => {
  const errors = validateStudent(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed. Please correct the highlighted fields.',
      errors
    });
  }

  const enrollmentNo =
    req.body.enrollment_no ||
    `STU-${new Date().getFullYear()}-${String(nextStudentId).padStart(3, '0')}`;

  const cleanPhone = req.body.phone.replace(/\D/g, '');

  const newStudent: StudentRecord = {
    id: nextStudentId++,
    enrollment_no: enrollmentNo,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: cleanPhone,
    date_of_birth: req.body.date_of_birth,
    course: req.body.course.trim(),
    department: req.body.department.trim(),
    address: req.body.address.trim(),
    status: req.body.status || 'Active',
    created_at: new Date().toISOString()
  };

  studentsDatabase.unshift(newStudent);

  res.status(201).json({
    status: 'success',
    message: 'Student registered successfully',
    data: newStudent
  });
});

// UPDATE: Edit student
app.put('/api/students/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = studentsDatabase.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Student not found' });
  }

  const errors = validateStudent(req.body, id);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed. Please correct the highlighted fields.',
      errors
    });
  }

  const existing = studentsDatabase[studentIndex];
  const cleanPhone = req.body.phone.replace(/\D/g, '');

  const updatedStudent: StudentRecord = {
    ...existing,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: cleanPhone,
    date_of_birth: req.body.date_of_birth,
    course: req.body.course.trim(),
    department: req.body.department.trim(),
    address: req.body.address.trim(),
    status: req.body.status || existing.status,
    updated_at: new Date().toISOString()
  };

  studentsDatabase[studentIndex] = updatedStudent;

  res.json({
    status: 'success',
    message: 'Student record updated successfully',
    data: updatedStudent
  });
});

// DELETE: Remove student
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = studentsDatabase.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Student record not found' });
  }

  const deleted = studentsDatabase.splice(studentIndex, 1)[0];

  res.json({
    status: 'success',
    message: `Student "${deleted.name}" (${deleted.enrollment_no}) deleted successfully.`,
    data: deleted
  });
});

// ==========================================
// 2. EMPLOYEES API (CRUD)
// ==========================================

// READ: Employees list
app.get('/api/employees', (req: Request, res: Response) => {
  try {
    let result = [...employeesDatabase];
    const { search, department, status, sortBy = 'id', sortOrder = 'desc', page = '1', limit = '10' } = req.query;

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employee_code.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.designation.toLowerCase().includes(q)
      );
    }

    if (department && department !== 'all' && typeof department === 'string') {
      result = result.filter((e) => e.department === department);
    }

    if (status && status !== 'all' && typeof status === 'string') {
      result = result.filter((e) => e.status === status);
    }

    result.sort((a: any, b: any) => {
      let valA = a[sortBy as string];
      let valB = b[sortBy as string];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    res.json({
      status: 'success',
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      data: paginatedItems
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// READ: Single Employee
app.get('/api/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const employee = employeesDatabase.find((e) => e.id === id);
  if (!employee) {
    return res.status(404).json({ status: 'error', message: 'Employee not found' });
  }
  res.json({ status: 'success', data: employee });
});

// CREATE: Add new employee
app.post('/api/employees', (req: Request, res: Response) => {
  const errors = validateEmployee(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed. Please correct the highlighted fields.',
      errors
    });
  }

  const empCode =
    req.body.employee_code ||
    `EMP-${new Date().getFullYear()}-${String(100 + nextEmployeeId)}`;

  const cleanPhone = req.body.phone.replace(/\D/g, '');

  const newEmployee: EmployeeRecord = {
    id: nextEmployeeId++,
    employee_code: empCode,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: cleanPhone,
    designation: req.body.designation.trim(),
    department: req.body.department.trim(),
    salary: parseFloat(req.body.salary),
    joining_date: req.body.joining_date,
    address: req.body.address.trim(),
    status: req.body.status || 'Active',
    created_at: new Date().toISOString()
  };

  employeesDatabase.unshift(newEmployee);

  res.status(201).json({
    status: 'success',
    message: 'Employee record created successfully',
    data: newEmployee
  });
});

// UPDATE: Edit employee
app.put('/api/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const employeeIndex = employeesDatabase.findIndex((e) => e.id === id);

  if (employeeIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Employee not found' });
  }

  const errors = validateEmployee(req.body, id);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      status: 'error',
      message: 'Validation failed. Please correct the highlighted fields.',
      errors
    });
  }

  const existing = employeesDatabase[employeeIndex];
  const cleanPhone = req.body.phone.replace(/\D/g, '');

  const updatedEmployee: EmployeeRecord = {
    ...existing,
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: cleanPhone,
    designation: req.body.designation.trim(),
    department: req.body.department.trim(),
    salary: parseFloat(req.body.salary),
    joining_date: req.body.joining_date,
    address: req.body.address.trim(),
    status: req.body.status || existing.status,
    updated_at: new Date().toISOString()
  };

  employeesDatabase[employeeIndex] = updatedEmployee;

  res.json({
    status: 'success',
    message: 'Employee record updated successfully',
    data: updatedEmployee
  });
});

// DELETE: Remove employee
app.delete('/api/employees/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const employeeIndex = employeesDatabase.findIndex((e) => e.id === id);

  if (employeeIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Employee record not found' });
  }

  const deleted = employeesDatabase.splice(employeeIndex, 1)[0];

  res.json({
    status: 'success',
    message: `Employee "${deleted.name}" (${deleted.employee_code}) removed successfully.`,
    data: deleted
  });
});

// ==========================================
// 3. COMMON & METRIC APIS
// ==========================================

// Reference Masters
app.get('/api/departments', (_req: Request, res: Response) => {
  res.json({ status: 'success', data: DEPARTMENTS });
});

app.get('/api/courses', (_req: Request, res: Response) => {
  res.json({ status: 'success', data: COURSES });
});

// System Analytics KPI
app.get('/api/stats', (_req: Request, res: Response) => {
  const totalStudents = studentsDatabase.length;
  const activeStudents = studentsDatabase.filter((s) => s.status === 'Active').length;
  const graduatedStudents = studentsDatabase.filter((s) => s.status === 'Graduated').length;

  const totalEmployees = employeesDatabase.length;
  const activeEmployees = employeesDatabase.filter((e) => e.status === 'Active').length;
  const totalMonthlyPayroll = employeesDatabase.reduce((acc, e) => acc + (e.salary || 0), 0);

  const deptMap: Record<string, { students: number; employees: number }> = {};
  DEPARTMENTS.forEach((d) => {
    deptMap[d.name] = { students: 0, employees: 0 };
  });

  studentsDatabase.forEach((s) => {
    if (deptMap[s.department]) deptMap[s.department].students++;
  });

  employeesDatabase.forEach((e) => {
    if (deptMap[e.department]) deptMap[e.department].employees++;
  });

  const departmentDistribution = Object.keys(deptMap).map((dept) => ({
    department: dept,
    students: deptMap[dept].students,
    employees: deptMap[dept].employees
  }));

  res.json({
    status: 'success',
    data: {
      totalStudents,
      activeStudents,
      graduatedStudents,
      totalEmployees,
      activeEmployees,
      totalMonthlyPayroll,
      departmentsCount: DEPARTMENTS.length,
      departmentDistribution
    }
  });
});

// SQL File Export Download
app.get('/api/database/export-sql', (_req: Request, res: Response) => {
  try {
    const sqlPath = path.join(process.cwd(), 'php-backend', 'database.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="student_management.sql"');
      return res.send(sqlContent);
    }
    res.status(404).json({ status: 'error', message: 'SQL schema file not found' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Reset Database to Seed State
app.post('/api/database/reset', (_req: Request, res: Response) => {
  studentsDatabase = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
  employeesDatabase = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
  nextStudentId = 9;
  nextEmployeeId = 7;

  res.json({
    status: 'success',
    message: 'Database reset to initial sample seed records.'
  });
});

// ==========================================
// 4. VITE MIDDLEWARE & SERVER STARTUP
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Infygrid Student/Employee Management Server running on port ${PORT}`);
  });
}

startServer();
