import React from 'react';
import { MessageSquare } from 'lucide-react';

export const InstructorChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-h2-bold text-[var(--text-primary)]">Kênh Chat Realtime với Học viên</h1>
            <p className="text-p2-regular text-[var(--text-secondary)]">Giải đáp thắc mắc 1-1 trực tiếp với học viên trong các khóa học.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
