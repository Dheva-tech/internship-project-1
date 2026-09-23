import { 
  Student, 
  Employee, 
  Department, 
  Course, 
  SystemStats, 
  StudentFormData, 
  EmployeeFormData 
} from './types';

// Helper for API calls
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error: any = new Error(data.message || 'API request failed');
    error.errors = data.errors || {};
    error.status = response.status;
    throw error;
  }

  return data;
}

// 1. STUDENTS API
export async function fetchStudents(params: {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<{ data: Student[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.department && params.department !== 'all') query.set('department', params.department);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  return request(`/api/students?${query.toString()}`);
}

export async function fetchStudentById(id: number): Promise<{ data: Student }> {
  return request(`/api/students/${id}`);
}

export async function createStudent(data: StudentFormData): Promise<{ data: Student; message: string }> {
  return request('/api/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStudent(id: number, data: StudentFormData): Promise<{ data: Student; message: string }> {
  return request(`/api/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(id: number): Promise<{ message: string; data: Student }> {
  return request(`/api/students/${id}`, {
    method: 'DELETE',
  });
}

// 2. EMPLOYEES API
export async function fetchEmployees(params: {
  search?: string;
  department?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}): Promise<{ data: Employee[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.department && params.department !== 'all') query.set('department', params.department);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  return request(`/api/employees?${query.toString()}`);
}

export async function fetchEmployeeById(id: number): Promise<{ data: Employee }> {
  return request(`/api/employees/${id}`);
}

export async function createEmployee(data: EmployeeFormData): Promise<{ data: Employee; message: string }> {
  return request('/api/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateEmployee(id: number, data: EmployeeFormData): Promise<{ data: Employee; message: string }> {
  return request(`/api/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteEmployee(id: number): Promise<{ message: string; data: Employee }> {
  return request(`/api/employees/${id}`, {
    method: 'DELETE',
  });
}

// 3. STATS & REFERENCE MASTERS
export async function fetchDepartments(): Promise<{ data: Department[] }> {
  return request('/api/departments');
}

export async function fetchCourses(): Promise<{ data: Course[] }> {
  return request('/api/courses');
}

export async function fetchStats(): Promise<{ data: SystemStats }> {
  return request('/api/stats');
}

export async function resetDatabase(): Promise<{ message: string }> {
  return request('/api/database/reset', {
    method: 'POST',
  });
}

export function getExportSqlUrl(): string {
  return '/api/database/export-sql';
}
