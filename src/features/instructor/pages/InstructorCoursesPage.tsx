import React from 'react';
import { GraduationCap } from 'lucide-react';

export const InstructorCoursesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-h2-bold text-[var(--text-primary)]">Quản lý Khóa học của Giảng viên</h1>
            <p className="text-p2-regular text-[var(--text-secondary)]">Danh sách tất cả các khóa học bạn đang giảng dạy trên hệ thống EduSphere Academy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
