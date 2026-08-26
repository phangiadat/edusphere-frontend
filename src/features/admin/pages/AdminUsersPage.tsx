import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Ban, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../../services/api/adminService';
import type { AdminUserItem } from '../../../services/api/adminService';
import toast from 'react-hot-toast';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Role Change state
  const [selectedUserForRole, setSelectedUserForRole] = useState<AdminUserItem | null>(null);
  const [newRole, setNewRole] = useState<'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>('STUDENT');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search: searchQuery || undefined,
        role: selectedRole !== 'ALL' ? selectedRole : undefined,
      });

      setUsers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.warn('Lỗi nạp danh sách người dùng:', err);
      toast.error('Không thể nạp danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole]);

  // Handle ESC key press to close role modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedUserForRole) {
        setSelectedUserForRole(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUserForRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUserForRole) return;
    setIsUpdatingRole(true);
    try {
      await adminService.updateUserRole(selectedUserForRole.id, newRole);
      toast.success(`Đã cập nhật vai trò của ${selectedUserForRole.fullName} thành ${newRole}`);
      setSelectedUserForRole(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật vai trò người dùng');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleToggleStatus = async (user: AdminUserItem) => {
    const nextStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    const actionText = nextStatus === 'BANNED' ? 'khóa' : 'mở khóa';

    try {
      await adminService.updateUserStatus(user.id, nextStatus);
      toast.success(`Đã ${actionText} tài khoản ${user.fullName}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Không thể ${actionText} tài khoản`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Quản lý Người dùng & Phân quyền
          </h1>
          <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
            Xem danh sách, tìm kiếm, cấp quyền và quản lý trạng thái tài khoản hệ thống
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên hoặc Email người dùng..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
          />
        </form>

        {/* Role Select Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap">Vai trò:</span>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
            className="px-3.5 py-2.5 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="STUDENT">Học viên (STUDENT)</option>
            <option value="INSTRUCTOR">Giảng viên (INSTRUCTOR)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Đang tải danh sách người dùng...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" />
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">Không tìm thấy người dùng</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Không tìm thấy người dùng nào phù hợp với từ khóa hoặc bộ lọc hiện tại.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRole('ALL'); setPage(1); fetchUsers(); }}
              className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 transition cursor-pointer"
            >
              Xóa bộ lọc & Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--neutral-bg)] text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Người dùng</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Vai trò</th>
                  <th className="py-3.5 px-6">Trạng thái</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--neutral-surface-hover)] transition">
                    <td className="py-4 px-6 font-bold text-[var(--text-primary)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt={u.fullName}
                          className="w-9 h-9 rounded-xl object-cover border border-[var(--border-color)]"
                        />
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[var(--text-secondary)]">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-600'
                          : u.role === 'INSTRUCTOR'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {u.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-950 text-red-600 text-xs font-bold">
                          <Ban className="w-3.5 h-3.5" /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => { setSelectedUserForRole(u); setNewRole(u.role); }}
                        className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-purple-500 text-xs font-bold text-[var(--text-primary)] transition"
                      >
                        Đổi Vai trò
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Khóa TK' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Trang {page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-xl border border-[var(--border-color)] disabled:opacity-50 text-[var(--text-primary)]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl border border-[var(--border-color)] disabled:opacity-50 text-[var(--text-primary)]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {selectedUserForRole && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Thay đổi Vai trò Người dùng</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Cập nhật vai trò cho người dùng <strong className="text-[var(--text-primary)]">{selectedUserForRole.fullName}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Chọn vai trò mới:</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              >
                <option value="STUDENT">STUDENT - Học viên</option>
                <option value="INSTRUCTOR">INSTRUCTOR - Giảng viên</option>
                <option value="ADMIN">ADMIN - Quản trị viên hệ thống</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedUserForRole(null)}
                className="px-4 py-2 bg-[var(--neutral-bg)] text-xs font-bold text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-primary)] transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isUpdatingRole}
                onClick={handleConfirmRoleChange}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
              >
                {isUpdatingRole && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
