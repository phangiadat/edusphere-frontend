import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  GraduationCap, 
  FileCheck2, 
  MessageSquare, 
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './InstructorSidebar.module.css';

export const InstructorSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
    { label: 'Khóa học của tôi', path: '/instructor/courses', icon: GraduationCap },
    { label: 'Bài tập', path: '/instructor/assignments', icon: FileCheck2 },
    { label: 'Kênh Chat', path: '/instructor/chat', icon: MessageSquare },
    { label: 'Cài đặt tài khoản', path: '/instructor/settings', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className={styles.brandTitle}>EduSphere</div>
            <div className={styles.brandBadge}>INSTRUCTOR STUDIO</div>
          </div>
        </div>

        {/* Navigation Group */}
        <div className={styles.navContainer}>
          <div className={styles.navGroupLabel}>QUẢN LÝ GIẢNG DẠY</div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer with Instructor Info */}
      <div className={styles.sidebarFooter}>
        <div className={styles.instructorCard}>
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            }
            alt={user?.fullName || 'Giảng viên'}
            className={styles.avatar}
          />
          <div className="min-w-0 flex-1">
            <div className={styles.instructorName}>
              {user?.fullName || 'Phan Gia Đạt'}
            </div>
            <div className={styles.instructorRole}>Giảng viên Chuyên nghiệp</div>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
