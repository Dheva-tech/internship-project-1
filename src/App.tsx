import React, { useState, useEffect, useCallback } from 'react';
import { 
  Student, 
  Employee, 
  Department, 
  Course, 
  SystemStats, 
  ActiveTab, 
  ToastMessage, 
  StudentFormData, 
  EmployeeFormData 
} from './types';
import { 
  fetchStudents, 
  fetchEmployees, 
  fetchDepartments, 
  fetchCourses, 
  fetchStats, 
  createStudent, 
  updateStudent, 
  deleteStudent, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  resetDatabase 
} from './api';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { StudentTable } from './components/StudentTable';
import { StudentModal } from './components/StudentModal';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeModal } from './components/EmployeeModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DatabaseViewer } from './components/DatabaseViewer';
import { InterviewGuide } from './components/InterviewGuide';
import { ToastContainer } from './components/Toast';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Students State
  const [students, setStudents] = useState<Student[]>([]);
  const [studentTotal, setStudentTotal] = useState(0);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotalPages, setStudentTotalPages] = useState(1);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');

  // Employees State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [employeePage, setEmployeePage] = useState(1);
  const [employeeTotalPages, setEmployeeTotalPages] = useState(1);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState('all');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('all');

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: 'student' | 'employee';
    id: number;
    title: string;
    identifier: string;
    subtext?: string;
  }>({
    isOpen: false,
    type: 'student',
    id: 0,
    title: '',
    identifier: ''
  });

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Reference Masters and Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  }, []);

  const loadReferenceData = useCallback(async () => {
    try {
      const [deptRes, courseRes] = await Promise.all([fetchDepartments(), fetchCourses()]);
      setDepartments(deptRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error('Failed to load reference metadata', err);
    }
  }, []);

  // Load Students
  const loadStudents = useCallback(async () => {
    try {
      const res = await fetchStudents({
        search: studentSearch,
        department: studentDeptFilter,
        status: studentStatusFilter,
        page: studentPage,
        limit: 8
      });
      setStudents(res.data);
      setStudentTotal(res.total);
      setStudentTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  }, [studentSearch, studentDeptFilter, studentStatusFilter, studentPage]);

  // Load Employees
  const loadEmployees = useCallback(async () => {
    try {
      const res = await fetchEmployees({
        search: employeeSearch,
        department: employeeDeptFilter,
        status: employeeStatusFilter,
        page: employeePage,
        limit: 8
      });
      setEmployees(res.data);
      setEmployeeTotal(res.total);
      setEmployeeTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  }, [employeeSearch, employeeDeptFilter, employeeStatusFilter, employeePage]);

  useEffect(() => {
    loadReferenceData();
    loadStats();
  }, [loadReferenceData, loadStats]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // STUDENT CRUD HANDLERS
  const handleSaveStudent = async (formData: StudentFormData) => {
    if (editingStudent) {
      const res = await updateStudent(editingStudent.id, formData);
      addToast('success', res.message || 'Student updated successfully');
    } else {
      const res = await createStudent(formData);
      addToast('success', res.message || 'Student registered successfully');
    }
    await Promise.all([loadStudents(), loadStats()]);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handlePromptDeleteStudent = (student: Student) => {
    setDeleteDialog({
      isOpen: true,
      type: 'student',
      id: student.id,
      title: 'Confirm Student Deletion',
      identifier: `${student.name} (${student.enrollment_no})`,
      subtext: `${student.course} · ${student.email}`
    });
  };

  // EMPLOYEE CRUD HANDLERS
  const handleSaveEmployee = async (formData: EmployeeFormData) => {
    if (editingEmployee) {
      const res = await updateEmployee(editingEmployee.id, formData);
      addToast('success', res.message || 'Employee record updated successfully');
    } else {
      const res = await createEmployee(formData);
      addToast('success', res.message || 'Employee record created successfully');
    }
    await Promise.all([loadEmployees(), loadStats()]);
  };

  const handleOpenEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const handlePromptDeleteEmployee = (employee: Employee) => {
    setDeleteDialog({
      isOpen: true,
      type: 'employee',
      id: employee.id,
      title: 'Confirm Employee Deletion',
      identifier: `${employee.name} (${employee.employee_code})`,
      subtext: `${employee.designation} · ${employee.department}`
    });
  };

  // DELETE CONFIRMATION EXECUTOR
  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === 'student') {
        const res = await deleteStudent(deleteDialog.id);
        addToast('success', res.message || 'Student record deleted');
        await Promise.all([loadStudents(), loadStats()]);
      } else {
        const res = await deleteEmployee(deleteDialog.id);
        addToast('success', res.message || 'Employee record deleted');
        await Promise.all([loadEmployees(), loadStats()]);
      }
    } catch (err: any) {
      addToast('error', err.message || 'Failed to delete record');
    }
  };

  // RESET DATABASE HANDLER
  const handleResetDatabase = async () => {
    const res = await resetDatabase();
    addToast('info', res.message);
    await Promise.all([loadStudents(), loadEmployees(), loadStats()]);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans flex flex-col antialiased">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddStudent={() => {
          setEditingStudent(null);
          setIsStudentModalOpen(true);
        }}
        onOpenAddEmployee={() => {
          setEditingEmployee(null);
          setIsEmployeeModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardStats
            stats={stats}
            onNavigate={setActiveTab}
            onOpenAddStudent={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
            onOpenAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
          />
        )}

        {activeTab === 'students' && (
          <StudentTable
            students={students}
            total={studentTotal}
            page={studentPage}
            limit={8}
            totalPages={studentTotalPages}
            departments={departments}
            search={studentSearch}
            onSearchChange={(q) => {
              setStudentSearch(q);
              setStudentPage(1);
            }}
            departmentFilter={studentDeptFilter}
            onDepartmentFilterChange={(dept) => {
              setStudentDeptFilter(dept);
              setStudentPage(1);
            }}
            statusFilter={studentStatusFilter}
            onStatusFilterChange={(status) => {
              setStudentStatusFilter(status);
              setStudentPage(1);
            }}
            onPageChange={setStudentPage}
            onEditStudent={handleOpenEditStudent}
            onDeleteStudent={handlePromptDeleteStudent}
            onOpenAddModal={() => {
              setEditingStudent(null);
              setIsStudentModalOpen(true);
            }}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeTable
            employees={employees}
            total={employeeTotal}
            page={employeePage}
            limit={8}
            totalPages={employeeTotalPages}
            departments={departments}
            search={employeeSearch}
            onSearchChange={(q) => {
              setEmployeeSearch(q);
              setEmployeePage(1);
            }}
            departmentFilter={employeeDeptFilter}
            onDepartmentFilterChange={(dept) => {
              setEmployeeDeptFilter(dept);
              setEmployeePage(1);
            }}
            statusFilter={employeeStatusFilter}
            onStatusFilterChange={(status) => {
              setEmployeeStatusFilter(status);
              setEmployeePage(1);
            }}
            onPageChange={setEmployeePage}
            onEditEmployee={handleOpenEditEmployee}
            onDeleteEmployee={handlePromptDeleteEmployee}
            onOpenAddModal={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseViewer
            onResetDatabase={handleResetDatabase}
            studentCount={studentTotal}
            employeeCount={employeeTotal}
          />
        )}

        {activeTab === 'guide' && <InterviewGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Infygrid Web Developer Internship Screening Submission · <strong>DHEVADHARSHAN G</strong> (dhevadharshangd@gmail.com)
          </p>
          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>MySQL 8.x / MariaDB</span>
            <span>PHP PDO REST API</span>
            <span>React 19 + TypeScript</span>
          </div>
        </div>
      </footer>

      {/* Modals & Popups */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        initialData={editingStudent}
        departments={departments}
        courses={courses}
      />

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleSaveEmployee}
        initialData={editingEmployee}
        departments={departments}
      />

      <DeleteConfirmModal
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteDialog.title}
        itemIdentifier={deleteDialog.identifier}
        itemSubtext={deleteDialog.subtext}
      />

      {/* Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
export default App;
