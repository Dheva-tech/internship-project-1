import React, { useState, useEffect } from 'react';
import { X, Users, AlertCircle, Loader2 } from 'lucide-react';
import { Employee, Department, EmployeeFormData } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  departments: Department[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Computer Science & Engineering',
    salary: 75000,
    joining_date: '2023-01-15',
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
        designation: initialData.designation,
        department: initialData.department,
        salary: initialData.salary,
        joining_date: initialData.joining_date,
        address: initialData.address,
        status: initialData.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: 'Computer Science & Engineering',
        salary: 75000,
        joining_date: new Date().toISOString().split('T')[0],
        address: '',
        status: 'Active'
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full Name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Valid corporate email address is required.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation/Title is required.';
    }

    if (!formData.department) {
      errs.department = 'Department is required.';
    }

    const sal = Number(formData.salary);
    if (isNaN(sal) || sal <= 0) {
      errs.salary = 'Please enter a valid positive salary.';
    }

    if (!formData.joining_date) {
      errs.joining_date = 'Joining date is required.';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Residential address is required (minimum 5 characters).';
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
        setServerError(err.message || 'Failed to save employee record.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 z-10 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {initialData ? 'Edit Employee Details' : 'Onboard New Employee'}
              </h2>
              <p className="text-xs text-stone-500">
                {initialData ? `Record ID: ${initialData.employee_code}` : 'Option B — Infygrid Screening Task'}
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
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
                placeholder="Dr. Rajesh Sundaram"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Corporate Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="employee@infygrid.in"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>

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
                placeholder="9840123456"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors tabular-nums ${
                  errors.phone ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Designation / Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => {
                  setFormData({ ...formData, designation: e.target.value });
                  if (errors.designation) setErrors({ ...errors, designation: '' });
                }}
                placeholder="Associate Professor / Senior Engineer"
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                  errors.designation ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
                }`}
              />
              {errors.designation && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.designation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Monthly Salary (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                value={formData.salary}
                onChange={(e) => {
                  setFormData({ ...formData, salary: e.target.value });
                  if (errors.salary) setErrors({ ...errors, salary: '' });
                }}
                className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors tabular-nums ${
                  errors.salary ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
                }`}
              />
              {errors.salary && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.joining_date}
                onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

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
              placeholder="Door No, Street, City, State"
              className={`w-full px-3 py-2 text-xs bg-stone-50 border rounded-lg focus:outline-none focus:bg-white transition-colors ${
                errors.address ? 'border-red-500 focus:border-red-600' : 'border-stone-200 focus:border-indigo-600'
              }`}
            />
            {errors.address && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Employment Status
            </label>
            <div className="flex items-center gap-4">
              {(['Active', 'On Leave', 'Resigned'] as const).map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="emp_status"
                    value={st}
                    checked={formData.status === st}
                    onChange={() => setFormData({ ...formData, status: st })}
                    className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

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
              className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating &amp; Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Save Changes' : 'Save Employee Record'}</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
