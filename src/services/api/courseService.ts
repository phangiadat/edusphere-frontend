import { axiosClient } from './axiosClient';

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
    return (await axiosClient.get('/courses', {
      params: { page, limit },
    })) as unknown as PaginatedCoursesResponse;
  },

  // Get Single Course Detail (Instructor)
  async getCourseById(id: string): Promise<CourseBackendModel> {
    return (await axiosClient.get(`/courses/${id}`)) as unknown as CourseBackendModel;
  },

  // Create Course
  async createCourse(payload: CreateCoursePayload): Promise<CourseBackendModel> {
    return (await axiosClient.post('/courses', payload)) as unknown as CourseBackendModel;
  },

  // Update Course
  async updateCourse(id: string, payload: UpdateCoursePayload): Promise<CourseBackendModel> {
    return (await axiosClient.patch(`/courses/${id}`, payload)) as unknown as CourseBackendModel;
  },

  // Delete Course
  async deleteCourse(id: string): Promise<{ message: string }> {
    return (await axiosClient.delete(`/courses/${id}`)) as unknown as { message: string };
  },

  // Upload Thumbnail File (Multipart Form Data)
  async uploadThumbnail(id: string, file: File): Promise<CourseBackendModel> {
    const formData = new FormData();
    formData.append('file', file);

    return (await axiosClient.post(`/courses/${id}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })) as unknown as CourseBackendModel;
  },

  // Submit Course for Admin Review
  async submitForReview(id: string): Promise<CourseBackendModel> {
    return (await axiosClient.post(`/courses/${id}/submit-review`)) as unknown as CourseBackendModel;
  },
};
