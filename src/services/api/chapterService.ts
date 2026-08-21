import { axiosClient } from '../../api/axiosClient';

export interface CreateChapterPayload {
  title: string;
  order?: number;
  courseId: string;
  isPublished?: boolean;
}

export interface UpdateChapterPayload {
  title?: string;
  order?: number;
  isPublished?: boolean;
}

export interface ChapterBackendModel {
  id: string;
  title: string;
  order: number;
  isPublished: boolean;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  lessons?: any[];
  assignments?: any[];
}

export const chapterService = {
  // Get Chapters by Course
  async getChaptersByCourse(courseId: string): Promise<ChapterBackendModel[]> {
    const response = await axiosClient.get(`/chapters/course/${courseId}`);
    return response.data;
  },

  // Create Chapter
  async createChapter(payload: CreateChapterPayload): Promise<ChapterBackendModel> {
    const response = await axiosClient.post('/chapters', payload);
    return response.data;
  },

  // Update Chapter
  async updateChapter(id: string, payload: UpdateChapterPayload): Promise<ChapterBackendModel> {
    const response = await axiosClient.patch(`/chapters/${id}`, payload);
    return response.data;
  },

  // Delete Chapter
  async deleteChapter(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/chapters/${id}`);
    return response.data;
  },
};
