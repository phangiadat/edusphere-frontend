import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { InstructorSidebar } from './InstructorSidebar';
import { InstructorTopbar } from './InstructorTopbar';
import styles from './InstructorLayout.module.css';

export const InstructorLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edusphere_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edusphere_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edusphere_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* 1. Sidebar (Trái) */}
      <InstructorSidebar />

      {/* 2. Main Area (Phải) */}
      <div className={styles.mainArea}>
        {/* Topbar (Trên) */}
        <InstructorTopbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        {/* Main Content Area (Outlet render trang con với hiệu ứng mượt) */}
        <main className={styles.contentBody}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
