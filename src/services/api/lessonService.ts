import { axiosClient } from './axiosClient';

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
    return (await axiosClient.get(`/lessons/chapter/${chapterId}`)) as unknown as LessonBackendModel[];
  },

  // Create Lesson
  async createLesson(payload: CreateLessonPayload): Promise<LessonBackendModel> {
    return (await axiosClient.post('/lessons', payload)) as unknown as LessonBackendModel;
  },

  // Update Lesson
  async updateLesson(id: string, payload: UpdateLessonPayload): Promise<LessonBackendModel> {
    return (await axiosClient.patch(`/lessons/${id}`, payload)) as unknown as LessonBackendModel;
  },

  // Delete Lesson
  async deleteLesson(id: string): Promise<{ message: string }> {
    return (await axiosClient.delete(`/lessons/${id}`)) as unknown as { message: string };
  },
};
