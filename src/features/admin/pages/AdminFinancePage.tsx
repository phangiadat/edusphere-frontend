import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PieChart, 
  Loader2, 
  CheckCircle2, 
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../../services/api/adminService';
import type { AdminTransactionItem } from '../../../services/api/adminService';

export const AdminFinancePage: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getTransactions(page, 10);
      setTransactions(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setGrossRevenue(res.meta?.grossRevenue || 0);
    } catch (err) {
      console.warn('Lỗi nạp dữ liệu báo cáo tài chính:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  // Compute Financial Splits (Platform 20%, Instructor 80%)
  const platformFeeNet = Math.round(grossRevenue * 0.2);
  const instructorPayoutShare = Math.round(grossRevenue * 0.8);

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.user?.fullName.toLowerCase().includes(q) ||
      t.user?.email.toLowerCase().includes(q) ||
      t.course?.title.toLowerCase().includes(q) ||
      t.course?.instructor?.fullName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Báo cáo Tài chính & Doanh thu Nền tảng
        </h1>
        <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
          Theo dõi tổng doanh thu giao dịch, hoa hồng nền tảng và đối soát chi trả cho Giảng viên
        </p>
      </div>

      {/* Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Gross Revenue Card */}
        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tổng Doanh thu</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">
              {grossRevenue.toLocaleString('vi-VN')} đ
            </h2>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Thự tế
            </span>
          </div>
        </div>

        {/* Platform Net Revenue Card (20%) */}
        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Hoa hồng EduSphere (20%)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {platformFeeNet.toLocaleString('vi-VN')} đ
            </h2>
            <span className="text-xs font-semibold text-purple-500">Thu phí sàn</span>
          </div>
        </div>

        {/* Instructor Payout Share Card (80%) */}
        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tiền Giảng viên (80%)</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {instructorPayoutShare.toLocaleString('vi-VN')} đ
            </h2>
            <span className="text-xs font-semibold text-indigo-500">Đối soát chi trả</span>
          </div>
        </div>

        {/* Total Transactions Count */}
        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Giao dịch Thành công</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">
              {transactions.length}
            </h2>
            <span className="text-xs font-semibold text-blue-500">Đã ghi nhận</span>
          </div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên học viên, Tên khóa học hoặc Giảng viên..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Đang tải lịch sử giao dịch từ Database...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" />
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">Chưa có giao dịch thanh toán nào</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Dữ liệu giao dịch từ học viên sẽ tự động hiển thị tại đây sau khi thanh toán qua Stripe / Direct Enroll.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--neutral-bg)] text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Học viên Thanh toán</th>
                  <th className="py-3.5 px-6">Khóa học Đã mua</th>
                  <th className="py-3.5 px-6">Giảng viên Thụ hưởng</th>
                  <th className="py-3.5 px-6">Số tiền (Giá bán)</th>
                  <th className="py-3.5 px-6">Ngày giao dịch</th>
                  <th className="py-3.5 px-6 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm">
                {filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--neutral-surface-hover)] transition">
                    <td className="py-4 px-6 font-bold text-[var(--text-primary)]">
                      <div>
                        <div>{item.user?.fullName || 'Học viên'}</div>
                        <div className="text-xs font-normal text-[var(--text-secondary)]">{item.user?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-[var(--text-primary)] max-w-xs truncate">
                      {item.course?.title}
                    </td>
                    <td className="py-4 px-6 font-medium text-[var(--text-secondary)]">
                      {item.course?.instructor?.fullName || 'Giảng viên'}
                    </td>
                    <td className="py-4 px-6 font-black text-purple-600 dark:text-purple-400 whitespace-nowrap">
                      {item.pricePaid ? `${item.pricePaid.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                    </td>
                    <td className="py-4 px-6 text-xs text-[var(--text-secondary)] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-xs font-extrabold uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                      </span>
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

    </div>
  );
};
