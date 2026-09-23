import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Table, 
  Key, 
  Layers, 
  FileCode, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getExportSqlUrl } from '../api';

interface DatabaseViewerProps {
  onResetDatabase: () => Promise<void>;
  studentCount: number;
  employeeCount: number;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  onResetDatabase,
  studentCount,
  employeeCount
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'sql' | 'er'>('schema');
  const [selectedTable, setSelectedTable] = useState<'students' | 'employees' | 'departments' | 'courses'>('students');
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const rawSql = `-- ==========================================================
-- Infygrid Screening Task: Full-Stack Management System
-- Database Schema: student_management (MySQL / MariaDB)
-- Compatible with: XAMPP, WAMP, LAMP, Laragon, phpMyAdmin
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`student_management\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`student_management\`;

-- 1. Table structure for table \`departments\`
CREATE TABLE \`departments\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(10) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table structure for table \`courses\`
CREATE TABLE \`courses\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`department_id\` INT NOT NULL,
  \`duration_years\` INT DEFAULT 4,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`department_id\`) REFERENCES \`departments\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table structure for table \`students\` (Option A)
CREATE TABLE \`students\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`enrollment_no\` VARCHAR(30) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(15) NOT NULL,
  \`date_of_birth\` DATE NOT NULL,
  \`course\` VARCHAR(100) NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`status\` ENUM('Active', 'Inactive', 'Graduated') DEFAULT 'Active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_student_email\` (\`email\`),
  INDEX \`idx_student_dept\` (\`department\`),
  INDEX \`idx_student_enroll\` (\`enrollment_no\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table structure for table \`employees\` (Option B)
CREATE TABLE \`employees\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`employee_code\` VARCHAR(30) NOT NULL UNIQUE,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(15) NOT NULL,
  \`designation\` VARCHAR(100) NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`salary\` DECIMAL(10,2) NOT NULL,
  \`joining_date\` DATE NOT NULL,
  \`address\` TEXT NOT NULL,
  \`status\` ENUM('Active', 'On Leave', 'Resigned') DEFAULT 'Active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_emp_email\` (\`email\`),
  INDEX \`idx_emp_dept\` (\`department\`),
  INDEX \`idx_emp_code\` (\`employee_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const copySql = () => {
    navigator.clipboard.writeText(rawSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = async () => {
    if (window.confirm('Reset database records to initial seed data?')) {
      setResetting(true);
      try {
        await onResetDatabase();
        setMessage('Database records successfully reset to initial seed state.');
        setTimeout(() => setMessage(null), 4000);
      } finally {
        setResetting(false);
      }
    }
  };

  const schemaDefinitions = {
    students: {
      name: 'students',
      description: 'Stores student admission records (Option A)',
      primaryKey: 'id (INT AUTO_INCREMENT)',
      columns: [
        { field: 'id', type: 'INT', null: 'NO', key: 'PRI', extra: 'AUTO_INCREMENT', desc: 'Unique record identifier' },
        { field: 'enrollment_no', type: 'VARCHAR(30)', null: 'NO', key: 'UNI', extra: '', desc: 'Unique student admission code (e.g. STU-2024-001)' },
        { field: 'name', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Full student name' },
        { field: 'email', type: 'VARCHAR(150)', null: 'NO', key: 'UNI', extra: '', desc: 'Unique student email address' },
        { field: 'phone', type: 'VARCHAR(15)', null: 'NO', key: '', extra: '', desc: '10-digit contact mobile number' },
        { field: 'date_of_birth', type: 'DATE', null: 'NO', key: '', extra: '', desc: 'Date of birth' },
        { field: 'course', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Degree program name' },
        { field: 'department', type: 'VARCHAR(100)', null: 'NO', key: 'MUL', extra: '', desc: 'Assigned academic department' },
        { field: 'address', type: 'TEXT', null: 'NO', key: '', extra: '', desc: 'Residential address' },
        { field: 'status', type: 'ENUM', null: 'YES', key: '', extra: "'Active'", desc: 'Active | Inactive | Graduated' },
        { field: 'created_at', type: 'TIMESTAMP', null: 'YES', key: '', extra: 'CURRENT_TIMESTAMP', desc: 'Record insertion timestamp' },
        { field: 'updated_at', type: 'TIMESTAMP', null: 'YES', key: '', extra: 'ON UPDATE', desc: 'Last modification timestamp' }
      ]
    },
    employees: {
      name: 'employees',
      description: 'Stores staff and faculty records (Option B)',
      primaryKey: 'id (INT AUTO_INCREMENT)',
      columns: [
        { field: 'id', type: 'INT', null: 'NO', key: 'PRI', extra: 'AUTO_INCREMENT', desc: 'Unique record identifier' },
        { field: 'employee_code', type: 'VARCHAR(30)', null: 'NO', key: 'UNI', extra: '', desc: 'Unique employee ID (e.g. EMP-2023-101)' },
        { field: 'name', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Full employee name' },
        { field: 'email', type: 'VARCHAR(150)', null: 'NO', key: 'UNI', extra: '', desc: 'Corporate email address' },
        { field: 'phone', type: 'VARCHAR(15)', null: 'NO', key: '', extra: '', desc: '10-digit contact phone number' },
        { field: 'designation', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Designation / Job title' },
        { field: 'department', type: 'VARCHAR(100)', null: 'NO', key: 'MUL', extra: '', desc: 'Department affiliation' },
        { field: 'salary', type: 'DECIMAL(10,2)', null: 'NO', key: '', extra: '', desc: 'Monthly gross compensation' },
        { field: 'joining_date', type: 'DATE', null: 'NO', key: '', extra: '', desc: 'Date of joining organization' },
        { field: 'address', type: 'TEXT', null: 'NO', key: '', extra: '', desc: 'Residential address' },
        { field: 'status', type: 'ENUM', null: 'YES', key: '', extra: "'Active'", desc: 'Active | On Leave | Resigned' },
        { field: 'created_at', type: 'TIMESTAMP', null: 'YES', key: '', extra: 'CURRENT_TIMESTAMP', desc: 'Creation timestamp' }
      ]
    },
    departments: {
      name: 'departments',
      description: 'Reference table for academic and administrative departments',
      primaryKey: 'id (INT AUTO_INCREMENT)',
      columns: [
        { field: 'id', type: 'INT', null: 'NO', key: 'PRI', extra: 'AUTO_INCREMENT', desc: 'Department ID' },
        { field: 'code', type: 'VARCHAR(10)', null: 'NO', key: 'UNI', extra: '', desc: 'Short code (CSE, IT, ECE, MECH)' },
        { field: 'name', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Full department name' },
        { field: 'created_at', type: 'TIMESTAMP', null: 'YES', key: '', extra: 'CURRENT_TIMESTAMP', desc: 'Creation timestamp' }
      ]
    },
    courses: {
      name: 'courses',
      description: 'Academic degree and program master table with foreign key to departments',
      primaryKey: 'id (INT AUTO_INCREMENT)',
      columns: [
        { field: 'id', type: 'INT', null: 'NO', key: 'PRI', extra: 'AUTO_INCREMENT', desc: 'Course ID' },
        { field: 'code', type: 'VARCHAR(20)', null: 'NO', key: 'UNI', extra: '', desc: 'Course Code (BTECH-CS, MBA)' },
        { field: 'name', type: 'VARCHAR(100)', null: 'NO', key: '', extra: '', desc: 'Degree / Program name' },
        { field: 'department_id', type: 'INT', null: 'NO', key: 'MUL', extra: 'FK to departments.id', desc: 'Foreign key to departments' },
        { field: 'duration_years', type: 'INT', null: 'YES', key: '', extra: '4', desc: 'Duration in years' }
      ]
    }
  };

  const currentSchema = schemaDefinitions[selectedTable];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              MySQL / MariaDB Database Inspector
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
              student_management
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Screening Task Requirement #9 — Relational Schema, Primary Keys, and phpMyAdmin SQL Export
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getExportSqlUrl()}
            download="student_management.sql"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download database.sql</span>
          </a>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-blue-600' : 'text-stone-500'}`} />
            <span>Reset Seed Data</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('schema')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'schema'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Table Schema &amp; Fields</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sql')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'sql'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Raw SQL DDL Script</span>
        </button>

        <button
          onClick={() => setActiveSubTab('er')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeSubTab === 'er'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ER Relationships &amp; Architecture</span>
        </button>
      </div>

      {/* Subtab 1: Table Schema Viewer */}
      {activeSubTab === 'schema' && (
        <div className="space-y-4">
          
          {/* Table Switcher Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 mr-1">Select Table:</span>
            {(['students', 'employees', 'departments', 'courses'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTable === t
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <code>{t}</code>
                <span className="ml-1.5 opacity-75 tabular-nums text-[11px]">
                  {t === 'students' ? `(${studentCount})` : t === 'employees' ? `(${employeeCount})` : ''}
                </span>
              </button>
            ))}
          </div>

          {/* Table Details */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-mono font-bold text-stone-900 text-sm">
                  TABLE `{currentSchema.name}`
                </h3>
                <p className="text-xs text-stone-500">{currentSchema.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-white px-2.5 py-1 rounded border border-stone-200 font-mono">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Primary Key: {currentSchema.primaryKey}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-700 uppercase font-semibold text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Column Name</th>
                    <th className="px-4 py-3">Data Type</th>
                    <th className="px-4 py-3">Null</th>
                    <th className="px-4 py-3">Key / Index</th>
                    <th className="px-4 py-3">Default / Extra</th>
                    <th className="px-4 py-3">Purpose &amp; Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono text-[11px]">
                  {currentSchema.columns.map((col) => (
                    <tr key={col.field} className="hover:bg-stone-50/70">
                      <td className="px-4 py-2.5 font-bold text-stone-900">{col.field}</td>
                      <td className="px-4 py-2.5 text-blue-700">{col.type}</td>
                      <td className="px-4 py-2.5 text-stone-500">{col.null}</td>
                      <td className="px-4 py-2.5">
                        {col.key === 'PRI' ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">PRIMARY KEY</span>
                        ) : col.key === 'UNI' ? (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">UNIQUE</span>
                        ) : col.key === 'MUL' ? (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800">INDEX</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-stone-500">{col.extra || '-'}</td>
                      <td className="px-4 py-2.5 font-sans text-stone-600">{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 2: Raw SQL */}
      {activeSubTab === 'sql' && (
        <div className="bg-stone-900 rounded-xl p-5 text-stone-200 shadow-md space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 font-sans">
            <div>
              <h3 className="font-bold text-white text-sm">php-backend/database.sql</h3>
              <p className="text-[11px] text-stone-400">
                Ready to paste into phpMyAdmin or MySQL CLI: <code className="text-amber-300 font-mono">mysql -u root -p &lt; database.sql</code>
              </p>
            </div>
            <button
              onClick={copySql}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="overflow-x-auto p-3 bg-stone-950 rounded-lg text-[11px] text-emerald-400 leading-relaxed max-h-96">
            {rawSql}
          </pre>
        </div>
      )}

      {/* Subtab 3: ER Explanation */}
      {activeSubTab === 'er' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900">
              Relational Architecture &amp; Database Design Explanation
            </h3>
            <p className="text-xs text-stone-500">
              Be prepared to explain this to the Infygrid evaluation panel during the project demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-600" />
                <span>Primary Keys &amp; Uniqueness Constraints</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Every table uses an auto-incrementing surrogate primary key (`id`) for optimal B-Tree index lookup speed. In addition, natural unique keys (`email`, `enrollment_no`, `employee_code`) prevent business duplication at the database engine level (InnoDB).
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Foreign Key Relationships &amp; Cascades</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                The `courses` table maintains a formal foreign key relationship referencing `departments(id) ON DELETE CASCADE`. This enforces referential integrity: a course cannot be created without a parent department.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-blue-600" />
                <span>SQL Injection Defense &amp; Prepared Statements</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                In <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">php-backend/api/students.php</code>, all SQL operations utilize PDO parameter binding with prepared statements. User input is safely passed via parameters, neutralizing SQL injection vectors.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Dual Backend Support</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                To satisfy the task requirements completely, we provide both the Node/Express server (live in this workspace) and standard PHP PDO scripts in `/php-backend/` for local deployment in XAMPP/WAMP/Laragon.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
