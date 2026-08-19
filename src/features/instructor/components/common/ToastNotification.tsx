import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './ToastNotification.module.css';

export type ToastType = 'success' | 'info' | 'error';

interface ToastNotificationProps {
  message: string | null;
  type?: ToastType;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
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
