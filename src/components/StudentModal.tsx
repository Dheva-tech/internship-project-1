import React, { useState, useEffect } from 'react';
import { X, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';
import { Student, Department, Course, StudentFormData } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: Student | null;
  departments: Department[];
  courses: Course[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments,
  courses
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '2004-01-01',
    course: 'B.Tech Computer Science',
    department: 'Computer Science & Engineering',
    address: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        date_of_birth: initialData.date_of_birth,
        course: initialData.course,
        department: initialData.department,
        address: initialData.address,
        status: initialData.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '2004-01-01',
        course: 'B.Tech Computer Science',
        department: 'Computer Science & Engineering',
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Frontend validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full Name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g. name@domain.com).';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.date_of_birth) {
      errs.date_of_birth = 'Date of Birth is required.';
    } else {
      const dob = new Date(formData.date_of_birth);
      if (isNaN(dob.getTime()) || dob > new Date()) {
        errs.date_of_birth = 'Date of birth cannot be in the future.';
      }
    }

    if (!formData.course) {
      errs.course = 'Please select a course.';
    }

    if (!formData.department) {
      errs.department = 'Please select an academic department.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Complete address is required (minimum 5 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setErrors(err.errors);
      } else {
        setServerError(err.message || 'Failed to save student record.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // When department changes, sync with default course in that department
  const handleDepartmentChange = (deptName: string) => {
    const matchedDept = departments.find((d) => d.name === deptName);
    const relatedCourse = matchedDept ? courses.find((c) => c.department_id === matchedDept.id) : null;

    setFormData((prev) => ({
      ...prev,
      department: deptName,
      course: relatedCourse ? relatedCourse.name : prev.course
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 z-10 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {initialData ? 'Edit Student Record' : 'Register New Student'}
              </h2>
              <p className="text-xs text-stone-500">
                {initialData ? `Updating record for ${initialData.enrollment_no}` : 'Option A — Infygrid Screening Task'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2 font-medium border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-blue-600'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="student@example.com"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-blue-600'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>

          {/* Row 2: Phone & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (10 digits) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="9876543210"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors tabular-nums ${
                  errors.phone ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-blue-600'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => {
                  setFormData({ ...formData, date_of_birth: e.target.value });
                  if (errors.date_of_birth) setErrors({ ...errors, date_of_birth: '' });
                }}
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.date_of_birth ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-blue-600'
                }`}
              />
              {errors.date_of_birth && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.date_of_birth}</p>}
            </div>
          </div>

          {/* Row 3: Department & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Degree / Course <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Residential Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: '' });
              }}
              placeholder="Door No, Street Name, Locality, City, State"
              className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                errors.address ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-blue-600'
              }`}
            />
            {errors.address && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.address}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Enrollment Status
            </label>
            <div className="flex items-center gap-4">
              {(['Active', 'Inactive', 'Graduated'] as const).map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="student_status"
                    value={st}
                    checked={formData.status === st}
                    onChange={() => setFormData({ ...formData, status: st })}
                    className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating &amp; Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Save Changes' : 'Create Student Record'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
