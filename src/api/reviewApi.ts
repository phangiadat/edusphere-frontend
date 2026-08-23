import { axiosClient } from './axiosClient';

export interface CreateReviewDto {
  rating: number;
  comment: string;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    fullName: string;
    avatarUrl?: string;
  };
}

export interface ReviewListResponse {
  data: ReviewItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
}

export const reviewApi = {
  /**
   * Tạo hoặc Cập nhật đánh giá khóa học (Dành cho học viên sở hữu khóa học)
   */
  async createOrUpdateReview(courseId: string, payload: CreateReviewDto): Promise<ReviewItem> {
    const response = await axiosClient.post<ReviewItem>(`/reviews/course/${courseId}`, payload);
    return response.data;
  },

  /**
   * Lấy danh sách đánh giá của khóa học (Public)
   */
  async getCourseReviews(courseId: string, page: number = 1, limit: number = 10): Promise<ReviewListResponse> {
    const response = await axiosClient.get<ReviewListResponse>(`/reviews/course/${courseId}/list`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Lấy thống kê điểm đánh giá trung bình của khóa học (Public)
   */
  async getCourseStats(courseId: string): Promise<ReviewStatsResponse> {
    const response = await axiosClient.get<ReviewStatsResponse>(`/reviews/course/${courseId}/stats`);
    return response.data;
  },
};
