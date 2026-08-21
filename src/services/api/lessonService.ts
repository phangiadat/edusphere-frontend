import { axiosClient } from '../../api/axiosClient';

export interface CreateLessonPayload {
  title: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  duration?: number;
  isPublished?: boolean;
  isFreePreview?: boolean;
  chapterId: string;
}

export interface UpdateLessonPayload {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  duration?: number;
  isPublished?: boolean;
  isFreePreview?: boolean;
}

export interface LessonBackendModel {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  duration: number;
  isPublished: boolean;
  isFreePreview: boolean;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
}

export const lessonService = {
  // Get Lessons by Chapter
  async getLessonsByChapter(chapterId: string): Promise<LessonBackendModel[]> {
    const response = await axiosClient.get(`/lessons/chapter/${chapterId}`);
    return response.data;
  },

  // Create Lesson
  async createLesson(payload: CreateLessonPayload): Promise<LessonBackendModel> {
    const response = await axiosClient.post('/lessons', payload);
    return response.data;
  },

  // Update Lesson
  async updateLesson(id: string, payload: UpdateLessonPayload): Promise<LessonBackendModel> {
    const response = await axiosClient.patch(`/lessons/${id}`, payload);
    return response.data;
  },

  // Delete Lesson
  async deleteLesson(id: string): Promise<{ message: string }> {
    const response = await axiosClient.delete(`/lessons/${id}`);
    return response.data;
  },
};
