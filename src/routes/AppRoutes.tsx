import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RoleGuard } from '../features/auth/components/RoleGuard';
import { InstructorLayout } from '../features/instructor/layout/InstructorLayout';
import { InstructorDashboardPage } from '../features/instructor/pages/InstructorDashboardPage';
import { InstructorCoursesPage } from '../features/instructor/pages/InstructorCoursesPage';
import { InstructorAssignmentsPage } from '../features/instructor/pages/InstructorAssignmentsPage';
import { InstructorChatPage } from '../features/instructor/pages/InstructorChatPage';
import App from '../App';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Auth Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Protected Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <RoleGuard allowedRole="INSTRUCTOR">
            <InstructorLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/instructor/dashboard" replace />} />
        <Route path="dashboard" element={<InstructorDashboardPage />} />
        <Route path="courses" element={<InstructorCoursesPage />} />
        <Route path="assignments" element={<InstructorAssignmentsPage />} />
        <Route path="chat" element={<InstructorChatPage />} />
      </Route>

      {/* 3. Student Application Root (Fallback) */}
      <Route path="/*" element={<App />} />
    </Routes>
  );
};
