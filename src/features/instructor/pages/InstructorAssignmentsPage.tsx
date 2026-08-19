import React from 'react';
import { FileCheck2 } from 'lucide-react';

export const InstructorAssignmentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-h2-bold text-[var(--text-primary)]">Quản lý Bài tập & Chấm điểm</h1>
            <p className="text-p2-regular text-[var(--text-secondary)]">Xem bài nộp của học viên, nhận xét và chấm điểm tự động.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
