import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RoleGuard } from '../features/auth/components/RoleGuard';
import { InstructorLayout } from '../features/instructor/layout/InstructorLayout';
import { InstructorDashboardPage } from '../features/instructor/pages/InstructorDashboardPage';
import { InstructorCoursesPage } from '../features/instructor/pages/InstructorCoursesPage';
import { InstructorCourseDetailPage } from '../features/instructor/pages/InstructorCourseDetailPage';
import { InstructorAssignmentsPage } from '../features/instructor/pages/InstructorAssignmentsPage';
import { InstructorChatPage } from '../features/instructor/pages/InstructorChatPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { AdminLayout } from '../features/admin/layout/AdminLayout';
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage';
import { AdminCoursesPage } from '../features/admin/pages/AdminCoursesPage';
import { AdminCategoriesPage } from '../features/admin/pages/AdminCategoriesPage';
import { AdminFinancePage } from '../features/admin/pages/AdminFinancePage';
import App from '../App';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Auth Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      {/* 2. Protected Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <RoleGuard allowedRoles={['INSTRUCTOR']}>
            <InstructorLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/instructor/dashboard" replace />} />
        <Route path="dashboard" element={<InstructorDashboardPage />} />
        <Route path="courses" element={<InstructorCoursesPage />} />
        <Route path="courses/:courseId" element={<InstructorCourseDetailPage />} />
        <Route path="assignments" element={<InstructorAssignmentsPage />} />
        <Route path="chat" element={<InstructorChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 3. Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={['ADMIN']}>
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="finance" element={<AdminFinancePage />} />
      </Route>

      {/* 4. Student Application Root (Fallback) */}
      <Route path="/*" element={<App />} />
    </Routes>
  );
};
