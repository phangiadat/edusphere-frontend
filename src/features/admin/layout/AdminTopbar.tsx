import React, { useState } from 'react';
import { Search, Moon, Sun, Shield } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { NotificationDropdown } from '../../../components/common/NotificationDropdown/NotificationDropdown';

interface AdminTopbarProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  darkMode = false,
  onToggleDarkMode,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 bg-[var(--neutral-surface)] border-b border-[var(--border-color)] px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Search Input Bar */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm người dùng, khóa học hoặc danh mục..."
          className="w-full pl-10 pr-4 py-2 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500 placeholder:text-[var(--text-muted)] transition"
        />
      </div>

      {/* Action Controls & Admin Avatar */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-10 h-10 rounded-xl bg-[var(--neutral-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-purple-500 transition"
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon Dropdown */}
        <NotificationDropdown />

        {/* Admin Profile Badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-color)]">
          <div className="relative">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user?.fullName || 'Admin'}
              className="w-9 h-9 rounded-xl object-cover border border-purple-500/50"
            />
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-purple-600 text-white rounded-full">
              <Shield className="w-2.5 h-2.5" />
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[var(--text-primary)] leading-tight truncate max-w-[140px]">
              {user?.fullName || 'Quản trị viên'}
            </div>
            <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              System Admin
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
