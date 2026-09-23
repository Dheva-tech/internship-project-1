/**
 * Shared TypeScript Definitions for Infygrid Student & Employee Management System
 */

export interface Student {
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

export interface Employee {
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

export interface Department {
  id: number;
  code: string;
  name: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department_id: number;
  duration_years: number;
}

export interface SystemStats {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  totalEmployees: number;
  activeEmployees: number;
  totalMonthlyPayroll: number;
  departmentsCount: number;
  departmentDistribution: { department: string; students: number; employees: number }[];
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  course: string;
  department: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Graduated';
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  salary: number | string;
  joining_date: string;
  address: string;
  status: 'Active' | 'On Leave' | 'Resigned';
}

export type ActiveTab = 'dashboard' | 'students' | 'employees' | 'database' | 'guide';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
