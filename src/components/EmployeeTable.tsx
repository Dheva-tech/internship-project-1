import React, { useState } from 'react';
import { 
  Search, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Briefcase,
  Banknote,
  LayoutGrid,
  List
} from 'lucide-react';
import { Employee, Department } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  departments: Department[];
  search: string;
  onSearchChange: (q: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (dept: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onOpenAddModal: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  total,
  page,
  limit,
  totalPages,
  departments,
  search,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onEditEmployee,
  onDeleteEmployee,
  onOpenAddModal
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const exportCSV = () => {
    const headers = ['ID', 'Employee Code', 'Name', 'Email', 'Phone', 'Designation', 'Department', 'Salary', 'Joining Date', 'Address', 'Status'];
    const rows = employees.map((e) => [
      e.id,
      `"${e.employee_code}"`,
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.phone}"`,
      `"${e.designation}"`,
      `"${e.department}"`,
      e.salary,
      e.joining_date,
      `"${e.address.replace(/"/g, '""')}"`,
      e.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'infygrid_employees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Resigned':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Employee Roster
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold tabular-nums">
              {total} Staff Members
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Option B — Manage staff designations, corporate payroll, and employment statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by employee name, designation, email, code..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>

          <div className="flex border border-stone-200 rounded-lg bg-stone-50 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-700' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-700' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Table / Grid */}
      {employees.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">No Employee Records Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search terms or register a new team member.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50/80 text-stone-700 uppercase font-semibold text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3.5">Employee / Code</th>
                  <th className="px-4 py-3.5">Role &amp; Department</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Salary (Monthly)</th>
                  <th className="px-4 py-3.5">Joining Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 leading-tight">{emp.name}</p>
                          <span className="font-mono text-[10px] text-stone-400">{emp.employee_code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-medium text-stone-900">{emp.designation}</p>
                      <p className="text-[11px] text-stone-500">{emp.department}</p>
                    </td>

                    <td className="px-4 py-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[170px]">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="tabular-nums">+91 {emp.phone}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-stone-900 tabular-nums">
                        ₹{Number(emp.salary).toLocaleString('en-IN')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span className="tabular-nums">
                          {new Date(emp.joining_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 text-stone-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          title="Edit Employee"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug">{emp.name}</h4>
                      <span className="font-mono text-[10px] text-stone-400">{emp.employee_code}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(emp.status)}`}>
                    {emp.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{emp.designation} ({emp.department})</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Banknote className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-bold text-stone-900 tabular-nums">₹{Number(emp.salary).toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400">
                  Joined: {new Date(emp.joining_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="p-1.5 text-stone-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp)}
                    className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800">{employees.length}</strong> of{' '}
            <strong className="text-stone-800">{total}</strong> staff members
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  p === page
                    ? 'bg-indigo-700 text-white'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
