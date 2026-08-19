import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { InstructorSidebar } from './InstructorSidebar';
import { InstructorTopbar } from './InstructorTopbar';
import styles from './InstructorLayout.module.css';

export const InstructorLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={styles.layoutContainer}>
      {/* 1. Sidebar (Trái) */}
      <InstructorSidebar />

      {/* 2. Main Area (Phải) */}
      <div className={styles.mainArea}>
        {/* Topbar (Trên) */}
        <InstructorTopbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        {/* Main Content Area (Outlet render trang con) */}
        <main className={styles.contentBody}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
