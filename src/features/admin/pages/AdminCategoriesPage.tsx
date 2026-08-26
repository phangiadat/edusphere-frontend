import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../../services/api/adminService';
import type { AdminCategoryItem } from '../../../services/api/adminService';
import toast from 'react-hot-toast';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('Code');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCategories();
      setCategories(res);
    } catch (err) {
      console.warn('Lỗi nạp danh sách danh mục:', err);
      toast.error('Không thể nạp danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDesc('');
    setCategoryIcon('Code');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: AdminCategoryItem) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setCategoryIcon(cat.icon || 'Code');
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Tên danh mục không được để trống!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, {
          name: categoryName.trim(),
          description: categoryDesc.trim(),
          icon: categoryIcon,
        });
        toast.success(`Đã cập nhật danh mục: ${categoryName}`);
      } else {
        await adminService.createCategory({
          name: categoryName.trim(),
          description: categoryDesc.trim(),
          icon: categoryIcon,
        });
        toast.success(`Đã tạo danh mục mới: ${categoryName}`);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể lưu danh mục');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: AdminCategoryItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) return;

    try {
      await adminService.deleteCategory(cat.id);
      toast.success(`Đã xóa danh mục: ${cat.name}`);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Quản lý Danh mục Khóa học
          </h1>
          <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
            Thêm, sửa, xóa các chủ đề và danh mục phân loại khóa học hệ thống
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Danh mục mới</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Đang tải danh sách danh mục...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FolderTree className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" />
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">Chưa có danh mục nào</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Hãy tạo danh mục đầu tiên để phân loại các khóa học trên hệ thống.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-500 transition shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md">
                      Slug: {cat.slug}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">
                      {cat.coursesCount || 0} khóa học
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[var(--text-primary)] leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {cat.description || 'Chưa có mô tả danh mục.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 rounded-lg border border-[var(--border-color)] hover:border-purple-500 text-[var(--text-primary)] transition"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit3 className="w-4 h-4 text-purple-500" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 rounded-lg border border-[var(--border-color)] hover:border-red-500 text-red-500 transition"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmitModal}
            className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">
                {editingCategory ? 'Chỉnh sửa Danh mục' : 'Tạo Danh mục mới'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Nhập thông tin tên và mô tả cho danh mục khóa học
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Tên danh mục:</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="VD: Lập trình Web, AI & Gemini, UI/UX..."
                  className="w-full px-3.5 py-2.5 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Mô tả danh mục:</label>
                <textarea
                  rows={3}
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  placeholder="Mô tả ngắn gọn về danh mục khóa học này..."
                  className="w-full p-3 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[var(--neutral-bg)] text-xs font-bold text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-primary)] transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
