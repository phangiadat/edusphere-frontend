import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  BookOpen, 
  Award, 
  MessageSquare, 
  DollarSign, 
  Info,
  ExternalLink 
} from 'lucide-react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { notificationApi, type NotificationModel } from '../../../api/notificationApi';
import { useAuth } from '../../../hooks/useAuth';

export const NotificationDropdown: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Unread Count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 1. Fetch initial notifications from REST API
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    let isMounted = true;
    async function loadNotifications() {
      try {
        const list = await notificationApi.getNotifications();
        if (isMounted && Array.isArray(list)) {
          setNotifications(list);
        }
      } catch (err) {
        console.warn('Lỗi nạp thông báo:', err);
      }
    }

    loadNotifications();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // 2. WebSockets Realtime Listener for new_notification
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken') || '';
    const socket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('new_notification', (newNotif: NotificationModel) => {
      setNotifications((prev) => [newNotif, ...prev]);
      toast.success(`🔔 ${newNotif.title}: ${newNotif.message.substring(0, 45)}...`, {
        duration: 5000,
        position: 'top-right',
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  // 3. Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (notif: NotificationModel) => {
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (err) {
        console.warn('Lỗi đánh dấu đã đọc:', err);
      }
    }

    if (notif.link) {
      window.location.href = notif.link;
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      try {
        await notificationApi.markAsRead(n.id);
      } catch (e) {
        // ignore
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc!');
  };

  const getIconForType = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'ENROLLMENT':
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'ASSIGNMENT':
        return <Award className="w-4 h-4 text-indigo-500" />;
      case 'REVIEW':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'CHAT':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'Vừa xong';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} phút trước`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffSeconds / 86400)} ngày trước`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)] transition-all focus:outline-none"
        title="Thông báo hệ thống"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-[var(--border-color)] flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h4 className="font-bold text-sm text-[var(--text-primary)]">Thông báo hệ thống</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Đọc tất cả
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif)}
                  className={`p-3.5 flex gap-3 items-start cursor-pointer transition ${
                    notif.isRead
                      ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-50/80 dark:hover:bg-purple-950/40 font-medium'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-[var(--border-color)] flex-shrink-0 shadow-sm">
                    {getIconForType(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[var(--text-secondary)] flex-shrink-0">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-1 font-medium">
                        <span>Xem chi tiết</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-[var(--text-secondary)] opacity-40 mx-auto" />
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Chưa có thông báo nào
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
