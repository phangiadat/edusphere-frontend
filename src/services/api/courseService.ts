import { axiosClient } from '../../api/axiosClient';

export interface CreateCoursePayload {
  title: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  categoryId?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  description?: string;
  price?: number;
  thumbnail?: string;
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  categoryId?: string;
}

export interface CourseBackendModel {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  instructorId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  chapters?: any[];
  enrollments?: any[];
}

export interface PaginatedCoursesResponse {
  data: CourseBackendModel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const courseService = {
  // Get Instructor's courses
  async getCourses(page = 1, limit = 10): Promise<PaginatedCoursesResponse> {
    const response = await axiosClient.get('/courses', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get Single Course Detail (Instructor)
  async getCourseById(id: string): Promise<CourseBackendModel> {
    const response = await axiosClient.get(`/courses/${id}`);
    return response.data;
  },

  // Create Course (NestJS returns { message, data: CourseModel })
  async createCourse(payload: CreateCoursePayload): Promise<CourseBackendModel> {
    const response = await axiosClient.post('/courses', payload);
    return response.data?.data || response.data;
  },

  // Update Course
  async updateCourse(id: string, payload: UpdateCoursePayload): Promise<CourseBackendModel> {
    const response = await axiosClient.patch(`/courses/${id}`, payload);
    return response.data;
  },

  // Delete Course
  async deleteCourse(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/courses/${id}`);
    return response.data;
  },

  // Upload Thumbnail File (Multipart Form Data)
  async uploadThumbnail(id: string, file: File): Promise<{ message: string; data: { thumbnail: string } }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post(`/courses/${id}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Submit Course for Admin Review
  async submitForReview(id: string): Promise<CourseBackendModel> {
    const response = await axiosClient.post(`/courses/${id}/submit-review`);
    return response.data;
  },
};
