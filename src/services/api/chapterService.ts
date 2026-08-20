import { axiosClient } from './axiosClient';

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
    return (await axiosClient.get(`/chapters/course/${courseId}`)) as unknown as ChapterBackendModel[];
  },

  // Create Chapter
  async createChapter(payload: CreateChapterPayload): Promise<ChapterBackendModel> {
    return (await axiosClient.post('/chapters', payload)) as unknown as ChapterBackendModel;
  },

  // Update Chapter
  async updateChapter(id: string, payload: UpdateChapterPayload): Promise<ChapterBackendModel> {
    return (await axiosClient.patch(`/chapters/${id}`, payload)) as unknown as ChapterBackendModel;
  },

  // Delete Chapter
  async deleteChapter(id: string): Promise<{ message: string }> {
    return (await axiosClient.delete(`/chapters/${id}`)) as unknown as { message: string };
  },
};
