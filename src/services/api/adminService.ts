import { axiosClient } from '../../api/axiosClient';

export interface AdminUserItem {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
}

export interface AdminUsersResponse {
  data: AdminUserItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  coursesCount?: number;
  createdAt?: string;
}

export interface AdminPendingCourseItem {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  thumbnail?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  instructor: {
    id?: string;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export interface AdminTransactionItem {
  id: string;
  pricePaid: number;
  progress: number;
  status: string;
  paymentIntentId?: string | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
    instructor: {
      id: string;
      fullName: string;
      email: string;
    };
  };
}

export const adminService = {
  // 1. Fetch all users for Admin with filters (GET /users)
  async getUsers(params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<AdminUsersResponse> {
    const response = await axiosClient.get('/users', { params });
    const res = response.data;
    if (res && Array.isArray(res.data)) {
      return res;
    }
    return {
      data: Array.isArray(res) ? res : [],
      meta: { total: res?.length || 0, page: params?.page || 1, limit: params?.limit || 10, totalPages: 1 },
    };
  },

  // 2. Change user role (PATCH /users/:id/role)
  async updateUserRole(targetUserId: string, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'): Promise<AdminUserItem> {
    const response = await axiosClient.patch(`/users/${targetUserId}/role`, { role });
    return response.data;
  },

  // 3. Change user account status Ban/Unban (PATCH /users/:id/status)
  async updateUserStatus(targetUserId: string, status: 'ACTIVE' | 'BANNED'): Promise<AdminUserItem> {
    const response = await axiosClient.patch(`/users/${targetUserId}/status`, { status });
    return response.data;
  },

  // 4. Fetch all categories (GET /categories)
  async getCategories(): Promise<AdminCategoryItem[]> {
    const response = await axiosClient.get('/categories');
    const res = response.data;
    return Array.isArray(res) ? res : res?.data || [];
  },

  // 5. Create category (POST /categories)
  async createCategory(dto: { name: string; description?: string; icon?: string }): Promise<AdminCategoryItem> {
    const response = await axiosClient.post('/categories', dto);
    return response.data;
  },

  // 6. Update category (PATCH /categories/:id)
  async updateCategory(categoryId: string, dto: { name?: string; description?: string; icon?: string }): Promise<AdminCategoryItem> {
    const response = await axiosClient.patch(`/categories/${categoryId}`, dto);
    return response.data;
  },

  // 7. Delete category (DELETE /categories/:id)
  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // 8. Fetch pending courses for approval (GET /courses/admin/pending)
  async getPendingCourses(): Promise<AdminPendingCourseItem[]> {
    const response = await axiosClient.get('/courses/admin/pending');
    const res = response.data;
    return Array.isArray(res) ? res : res?.data || [];
  },

  // 9. Review course approve/reject (PATCH /courses/admin/:id/review)
  async reviewCourse(courseId: string, status: 'PUBLISHED' | 'REJECTED', feedback?: string): Promise<any> {
    const response = await axiosClient.patch(`/courses/admin/${courseId}/review`, { status, feedback });
    return response.data;
  },

  // 10. Fetch financial transactions for Admin (GET /enrollments/admin/transactions)
  async getTransactions(page = 1, limit = 20): Promise<{
    data: AdminTransactionItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      grossRevenue: number;
    };
  }> {
    const response = await axiosClient.get('/enrollments/admin/transactions', {
      params: { page, limit },
    });
    return response.data;
  },
};
