import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '../../../types/auth';

interface RoleGuardProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedRole?: UserRole;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  allowedRole,
}) => {
  const { user, isLoading, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Combine allowed roles into a single normalized array
  const roles = allowedRoles || (allowedRole ? [allowedRole] : undefined);

  // 1. Anti-flickering Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-sm font-semibold text-slate-300">Đang kiểm tra quyền truy cập hệ thống...</p>
      </div>
    );
  }

  // 2. Redirect to /login if not authenticated
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check role authorization
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Render children or Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};
