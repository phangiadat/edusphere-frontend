import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole?: 'INSTRUCTOR' | 'STUDENT' | 'ADMIN';
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRole = 'INSTRUCTOR' }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Smooth Anti-flickering Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-semibold text-slate-300">Đang kiểm tra quyền truy cập hệ thống...</p>
      </div>
    );
  }

  // 2. Redirect to /login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check role mismatch
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
