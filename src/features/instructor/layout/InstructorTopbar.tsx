import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import styles from './InstructorTopbar.module.css';

interface InstructorTopbarProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

import { NotificationDropdown } from '../../../components/common/NotificationDropdown/NotificationDropdown';

export const InstructorTopbar: React.FC<InstructorTopbarProps> = ({
  darkMode = false,
  onToggleDarkMode,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.topbar}>
      {/* Search Input Bar */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for anything..."
          className={styles.searchInput}
        />
      </div>

      {/* Action Controls & Instructor Avatar */}
      <div className={styles.actionsGroup}>
        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className={styles.iconBtn}
          title="Chuyển đổi giao diện sáng tối"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Icon Dropdown */}
        <NotificationDropdown />

        {/* Settings Shortcut Button */}
        <button 
          onClick={() => navigate('/instructor/settings')}
          className={styles.iconBtn} 
          title="Cài đặt tài khoản Giảng viên"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Instructor Profile Badge */}
        <div 
          onClick={() => navigate('/instructor/settings')} 
          className={`${styles.profileBox} cursor-pointer hover:opacity-80 transition`}
          title="Xem thông tin tài khoản Giảng viên"
        >
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={user?.fullName || 'Giảng viên'}
            className={styles.profileAvatar}
          />
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              {user?.fullName || 'Phan Gia Đạt'}
            </span>
            <span className={styles.profileRoleBadge}>INSTRUCTOR</span>
          </div>
        </div>
      </div>
    </header>
  );
};
