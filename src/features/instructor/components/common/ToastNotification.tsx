import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastNotification.module.css';

export type ToastType = 'success' | 'info' | 'error';

interface ToastNotificationProps {
  message: string | null;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  // Auto dismiss toast after duration (default 3000ms = 3s)
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const getToastClass = () => {
    switch (type) {
      case 'info':
        return styles.toastInfo;
      case 'error':
        return styles.toastError;
      default:
        return styles.toastSuccess;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      default:
        return <CheckCircle2 className={styles.icon} />;
    }
  };

  return (
    <div className={styles.toastContainer}>
      <div className={`${styles.toast} ${getToastClass()}`}>
        <div className={styles.contentRow}>
          {getIcon()}
          <span className={styles.message}>{message}</span>
        </div>

        <button onClick={onClose} className={styles.closeBtn} title="Đóng thông báo">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
