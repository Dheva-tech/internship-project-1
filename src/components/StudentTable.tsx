import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  List
} from 'lucide-react';
import { Student, Department } from '../types';

interface StudentTableProps {
  students: Student[];
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
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onOpenAddModal: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
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
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const exportCSV = () => {
    const headers = ['ID', 'Enrollment No', 'Name', 'Email', 'Phone', 'DOB', 'Course', 'Department', 'Address', 'Status'];
    const rows = students.map((s) => [
      s.id,
      `"${s.enrollment_no}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      s.date_of_birth,
      `"${s.course}"`,
      `"${s.department}"`,
      `"${s.address.replace(/"/g, '""')}"`,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'infygrid_students_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Graduated':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Inactive':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Student Directory
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold tabular-nums">
              {total} Total
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Manage student admissions, departmental allocations, and contact records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title="Export directory as CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student name, email, phone, enrollment ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentFilterChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-stone-200 rounded-lg bg-stone-50 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-blue-700' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-700' : 'text-stone-400 hover:text-stone-700'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">No Student Records Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No students match your filter criteria. Try clearing search filters or click "Add Student" to create a record.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onDepartmentFilterChange('all');
              onStatusFilterChange('all');
            }}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50/80 text-stone-700 uppercase font-semibold text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3.5">Student / ID</th>
                  <th className="px-4 py-3.5">Contact Details</th>
                  <th className="px-4 py-3.5">Course &amp; Dept</th>
                  <th className="px-4 py-3.5">Date of Birth</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-stone-50/60 transition-colors">
                    
                    {/* Name & Enrollment */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 leading-tight">
                            {student.name}
                          </p>
                          <span className="font-mono text-[10px] text-stone-400">
                            {student.enrollment_no}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-stone-700">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="tabular-nums">+91 {student.phone}</span>
                      </div>
                    </td>

                    {/* Course & Department */}
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-stone-900">{student.course}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[200px]">{student.department}</p>
                    </td>

                    {/* DOB */}
                    <td className="px-4 py-3.5 text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span className="tabular-nums">
                          {new Date(student.date_of_birth).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(student.status)}`}>
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Student"
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
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm leading-snug">{student.name}</h4>
                      <span className="font-mono text-[10px] text-stone-400">{student.enrollment_no}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(student.status)}`}>
                    {student.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="tabular-nums">+91 {student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{student.course}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-500 text-[11px] pt-1">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{student.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-stone-400">
                  DOB: {new Date(student.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditStudent(student)}
                    className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteStudent(student)}
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

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800">{students.length}</strong> of{' '}
            <strong className="text-stone-800">{total}</strong> records (Page {page} of {totalPages})
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
                    ? 'bg-blue-700 text-white'
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
