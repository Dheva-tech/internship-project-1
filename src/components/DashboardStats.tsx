import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Banknote, 
  Building2, 
  ArrowUpRight, 
  Plus, 
  Database, 
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { SystemStats, ActiveTab } from '../types';

interface DashboardStatsProps {
  stats: SystemStats | null;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenAddEmployee: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  onNavigate,
  onOpenAddStudent,
  onOpenAddEmployee
}) => {
  if (!stats) return null;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Infygrid 30-Day Web Developer Internship Screening Task</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Full-Stack Management System Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
            Candidate submission by <strong className="text-white">DHEVADHARSHAN G</strong>. Built with complete CRUD operations, frontend &amp; backend validation, MySQL database schema, and dual PHP &amp; Express REST backends.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2 bg-white hover:bg-blue-50 text-blue-900 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll New Student</span>
            </button>
            <button
              onClick={onOpenAddEmployee}
              className="px-4 py-2 bg-blue-700/80 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all border border-blue-500/50 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard Employee</span>
            </button>
            <button
              onClick={() => onNavigate('database')}
              className="px-4 py-2 bg-indigo-950/60 hover:bg-indigo-900 text-blue-100 rounded-lg text-xs font-medium transition-all border border-blue-400/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>View SQL &amp; phpMyAdmin Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Students</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 tabular-nums">
              {stats.totalStudents}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {stats.activeStudents} Active
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 flex items-center justify-between">
            <span>{stats.graduatedStudents} Graduated</span>
            <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </p>
        </div>

        {/* Card 2: Employees */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Employees</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 tabular-nums">
              {stats.totalEmployees}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {stats.activeEmployees} On-Duty
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 flex items-center justify-between">
            <span>Faculty &amp; Corporate Staff</span>
            <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </p>
        </div>

        {/* Card 3: Monthly Payroll */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Payroll</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">
              ₹{stats.totalMonthlyPayroll.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Verified aggregate monthly compensation
          </p>
        </div>

        {/* Card 4: Departments */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Departments</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-stone-900 tabular-nums">
              {stats.departmentsCount}
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
              CSE, IT, ECE, MECH...
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Normalized master relationship table
          </p>
        </div>

      </div>

      {/* Distribution Chart & Quick Feature Validation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Roster Distribution */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Department Distribution Roster
              </h3>
              <p className="text-xs text-stone-500">
                Enrolled students and assigned faculty per academic wing
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {stats.departmentDistribution.map((item) => {
              const totalInDept = item.students + item.employees;
              return (
                <div key={item.department} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800">{item.department}</span>
                    <span className="text-stone-500 tabular-nums">
                      <strong className="text-blue-700">{item.students} Students</strong> ·{' '}
                      <strong className="text-indigo-700">{item.employees} Staff</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${Math.min(100, item.students * 15)}%` }}
                    />
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${Math.min(100, item.employees * 15)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Screening Task Compliance Checklist */}
        <div className="lg:col-span-4 bg-stone-50 p-6 rounded-xl border border-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <FileCode2 className="w-4 h-4 text-blue-700" />
            <span>Infygrid Criteria Check</span>
          </div>

          <ul className="space-y-2.5 text-xs text-stone-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full CRUD: Create, Read, Update, Delete with confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Frontend validation + robust Backend validation with field errors</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Duplicate email prevention across both Students and Employees</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>MySQL schema (<code className="text-[11px] font-bold text-stone-800">database.sql</code>) with export</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>PHP PDO backend ready for XAMPP, WAMP, and Laragon</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Detailed README.md with setup and interview demonstration script</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={() => onNavigate('guide')}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer text-center"
            >
              Open Interview Presentation Script
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
