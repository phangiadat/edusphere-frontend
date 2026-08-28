import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const AuthModalContainer: React.FC = () => {
  const { authModalMode } = useAuth();

  if (!authModalMode) return null;

  if (authModalMode === 'login') {
    return <LoginModal />;
  }

  if (authModalMode === 'register') {
    return <RegisterModal />;
  }

  if (authModalMode === 'forgot' || authModalMode === 'reset') {
    return <ForgotPasswordModal />;
  }

  return null;
};
