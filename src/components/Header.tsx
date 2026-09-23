import React from 'react';
import { 
  GraduationCap, 
  Users, 
  LayoutDashboard, 
  Database, 
  BookOpen, 
  Plus, 
  UserCheck
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenAddEmployee: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddStudent,
  onOpenAddEmployee
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Wordmark & Candidate Kicker */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 tracking-tight text-base sm:text-lg">
                  Infygrid
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-100 hidden sm:inline">
                  Screening Task
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block">
                Full-Stack Student &amp; Employee Management System · Dhevadharshan G
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('students')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students</span>
            </button>

            <button
              onClick={() => onTabChange('employees')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'employees'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </button>

            <button
              onClick={() => onTabChange('database')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="hidden md:inline">Database &amp; SQL</span>
            </button>

            <button
              onClick={() => onTabChange('guide')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-blue-50 text-blue-800'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">README &amp; Demo</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {activeTab === 'employees' ? (
              <button
                onClick={onOpenAddEmployee}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
