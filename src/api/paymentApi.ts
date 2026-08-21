import { axiosClient } from './axiosClient';

export interface MyCourseItem {
  enrollmentId: string;
  progress: number;
  purchaseAt: string;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
    instructor: {
      fullName: string;
      avatarUrl: string | null;
    };
  };
}

export interface LearnLesson {
  id: string;
  title: string;
  content?: string | null;
  videoUrl?: string | null;
  duration: number;
  order: number;
}

export interface LearnChapter {
  id: string;
  title: string;
  order: number;
  lessons: LearnLesson[];
}

export interface LearnCourseData {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    instructor: {
      fullName: string;
      avatarUrl: string | null;
    };
    chapters: LearnChapter[];
  };
  completedLessonIds: string[];
  progress: number;
}

export interface CertificateData {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  progress: number;
}

export const paymentApi = {
  /**
   * Tạo Stripe Checkout Session cho khóa học (POST /enrollments/checkout/:courseId)
   */
  async createCheckoutSession(courseId: string): Promise<{ checkoutUrl: string }> {
    const response = await axiosClient.post(`/enrollments/checkout/${courseId}`);
    return response.data;
  },

  /**
   * Lấy danh sách khóa học học viên đã mua (GET /enrollments/my-courses)
   */
  async getMyCourses(page = 1, limit = 10): Promise<{
    data: MyCourseItem[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const response = await axiosClient.get('/enrollments/my-courses', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Lấy dữ liệu trình học bài giảng khóa học đã mua (GET /enrollments/courses/:courseId/learn)
   */
  async getCourseLearnData(courseId: string): Promise<LearnCourseData> {
    const response = await axiosClient.get(`/enrollments/courses/${courseId}/learn`);
    return response.data;
  },

  /**
   * Đánh dấu bài học đã hoàn thành (POST /enrollments/lessons/:lessonId/complete)
   */
  async markLessonComplete(lessonId: string): Promise<{
    lessonId: string;
    isCompleted: boolean;
    progress: number;
    isCourseCompleted: boolean;
  }> {
    const response = await axiosClient.post(`/enrollments/lessons/${lessonId}/complete`);
    return response.data;
  },

  /**
   * Lấy thông tin chứng chỉ hoàn thành (GET /enrollments/courses/:courseId/certificate)
   */
  async getCertificateData(courseId: string): Promise<CertificateData> {
    const response = await axiosClient.get(`/enrollments/courses/${courseId}/certificate`);
    return response.data;
  },
};
