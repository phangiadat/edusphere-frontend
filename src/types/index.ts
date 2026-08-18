export interface Course {
  id: string;
  title: string;
  slug?: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
    role: string;
  };
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  price: number;
  originalPrice?: number;
  badge?: 'Bán chạy' | 'Nổi bật' | 'Mới ra mắt' | 'Giảm giá';
  thumbnail: string;
  lessonsCount: number;
  duration: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  coursesCount: number;
  color: string;
  description: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  courseTitle: string;
  rating: number;
  content: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
