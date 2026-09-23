import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Mail, 
  Copy, 
  Check, 
  CheckCircle2, 
  Server, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const InterviewGuide: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);

  const emailContent = `To: contact@infygrid.in
Subject: Web Developer Internship Screening Task Submission — Dhevadharshan G

Dear Infygrid Evaluation Team,

I have completed the Full-Stack Student & Employee Management System screening task for the 30-Day Web Developer Internship.

Candidate Details:
• Name: Dhevadharshan G
• Email: dhevadharshangd@gmail.com
• Submission Repository: [Insert your GitHub Repository Link here]

Key Deliverables Included:
1. Complete CRUD Operations (Create, Read, Update, Delete with confirmation modal)
2. Dual System Modules: Option A (Students) & Option B (Employees)
3. Strict Multi-Tier Validation: Frontend form checks + Backend 422 JSON validation + Duplicate email rejection
4. MySQL / MariaDB Database: Schema script (database.sql) with normalized tables (students, employees, departments, courses)
5. Dual Backend Architecture: Production-ready PHP 8.x PDO REST APIs (for XAMPP/WAMP/Laragon) + Node/Express server
6. Complete README.md documentation with local setup and demonstration steps

I am ready for the project demonstration meeting to walk through the codebase, database, and CRUD workflows.

Sincerely,
Dhevadharshan G`;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailContent);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Screening Task Submission &amp; Viva Guide
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
            contact@infygrid.in
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Complete project explanation, local server instructions, and technical walk-through script for the interview
        </p>
      </div>

      {/* 1. Ready-to-Send Email Submission */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-stone-900 text-sm">
              Official Submission Email Draft (Section 13)
            </h3>
          </div>
          <button
            onClick={copyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-blue-200"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Submission Email'}</span>
          </button>
        </div>

        <pre className="p-4 bg-stone-50 rounded-lg text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed border border-stone-200">
          {emailContent}
        </pre>
      </div>

      {/* 2. Step-by-Step Local Server Setup (XAMPP / WAMP) */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-700" />
          <h3 className="font-bold text-stone-900 text-sm">
            Local Server Setup Guide (XAMPP / WAMP / Laragon)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">1</span>
              <span>Start XAMPP</span>
            </span>
            <p className="text-stone-600">
              Open XAMPP Control Panel and start <strong>Apache</strong> and <strong>MySQL</strong>. Open <code className="bg-white px-1 py-0.5 rounded border border-stone-200">http://localhost/phpmyadmin/</code> in your browser.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">2</span>
              <span>Import database.sql</span>
            </span>
            <p className="text-stone-600">
              Create a new database named <code className="bg-white px-1 py-0.5 rounded border border-stone-200">student_management</code>. Click <strong>Import</strong> and upload <code className="bg-white px-1 py-0.5 rounded border border-stone-200">php-backend/database.sql</code>.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[10px]">3</span>
              <span>Deploy Backend</span>
            </span>
            <p className="text-stone-600">
              Copy the <code className="bg-white px-1 py-0.5 rounded border border-stone-200">php-backend/</code> folder to your <code className="bg-white px-1 py-0.5 rounded border border-stone-200">htdocs/</code> directory. Test endpoints via browser or Postman.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Interview Demonstration Talking Points */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-700" />
          <h3 className="font-bold text-stone-900 text-sm">
            Technical Interview Demonstration Script (What to Say)
          </h3>
        </div>

        <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
          
          <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
            <strong className="text-indigo-950 block mb-1">
              Q: "How does the frontend communicate with the backend?"
            </strong>
            <p>
              "The React frontend communicates with the backend using standard HTTP RESTful requests through the Fetch API. For example, creating a student sends a <code>POST</code> request with a JSON payload to <code>/api/students</code>. The backend verifies the payload using prepared validation logic. If valid, it commits the record to the database and returns a <code>201 Created</code> response with the new record. If validation fails, it returns a <code>422 Unprocessable Entity</code> status code along with a mapped errors object, which the frontend displays beneath each respective field."
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
            <strong className="text-indigo-950 block mb-1">
              Q: "How did you design the database and handle data integrity?"
            </strong>
            <p>
              "I created the database <code>student_management</code> with four normalized tables: <code>students</code>, <code>employees</code>, <code>departments</code>, and <code>courses</code>. The primary key for each table is an auto-incrementing integer <code>id</code> for fast B-Tree indexing. I also applied unique index constraints on <code>email</code>, <code>enrollment_no</code>, and <code>employee_code</code> to prevent duplicate records at both the database and application levels. In the PHP backend, I used PDO prepared statements with parameter binding to guarantee protection against SQL injection."
            </p>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100">
            <strong className="text-indigo-950 block mb-1">
              Q: "How are CRUD operations implemented?"
            </strong>
            <p>
              "All four operations are fully implemented:
              1. <strong>Create:</strong> Form with phone regex, DOB check, and email validation.
              2. <strong>Read:</strong> Multi-column search, department and status filters, and pagination.
              3. <strong>Update:</strong> Pre-filled edit modal that updates existing records with uniqueness checks excluding current ID.
              4. <strong>Delete:</strong> Safety confirmation modal displaying the student's or employee's name before deletion."
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
