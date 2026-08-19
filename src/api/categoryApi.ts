import { axiosClient } from './axiosClient';

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  _count?: {
    courses: number;
  };
}

export const categoryApi = {
  /**
   * Lấy danh sách danh mục khóa học (GET /categories)
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await axiosClient.get('/categories');
    return response.data;
  },
};
