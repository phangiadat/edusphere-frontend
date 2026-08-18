import { axiosClient } from './axiosClient';

export interface PublicCourseFilter {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const courseApi = {
  /**
   * Lấy danh sách khóa học public (GET /courses/public/all)
   */
  async getPublicCourses(params?: PublicCourseFilter) {
    const response = await axiosClient.get('/courses/public/all', { params });
    return response.data;
  },

  /**
   * Xem chi tiết khóa học public (GET /courses/public/:id)
   */
  async getCourseDetailPublic(courseId: string) {
    const response = await axiosClient.get(`/courses/public/${courseId}`);
    return response.data;
  },
};
