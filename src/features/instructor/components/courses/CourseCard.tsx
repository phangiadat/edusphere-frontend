import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Users, Star } from 'lucide-react';
import styles from './CourseCard.module.css';

export type CourseStatusType = 'PUBLISHED' | 'DRAFT' | 'PENDING' | 'REJECTED';

export interface CourseItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  thumbnail?: string;
  status: CourseStatusType;
  categoryName: string;
  studentCount?: number;
  rating?: number;
}

interface CourseCardProps {
  course: CourseItem;
  onEdit: (course: CourseItem) => void;
  onDelete: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
}) => {
  const getStatusBadgeClass = () => {
    switch (course.status) {
      case 'PUBLISHED':
        return styles.statusPublished;
      case 'PENDING':
        return styles.statusPending;
      default:
        return styles.statusDraft;
    }
  };

  const getStatusLabel = () => {
    switch (course.status) {
      case 'PUBLISHED':
        return 'Đang bán';
      case 'PENDING':
        return 'Chờ duyệt';
      default:
        return 'Bản nháp';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={styles.card}
    >
      {/* Thumbnail Container */}
      <div className={styles.thumbContainer}>
        <img
          src={
            course.thumbnail ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
          }
          alt={course.title}
          className={styles.thumbnail}
        />
        <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Content Area */}
      <div className={styles.content}>
        <span className={styles.categoryPill}>{course.categoryName}</span>
        <h3 className={styles.title} title={course.title}>
          {course.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            {course.studentCount ?? 120} học viên
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {course.rating ?? 4.8}
          </span>
        </div>

        {/* Price Row */}
        <div className={styles.priceRow}>
          {course.price > 0 ? (
            <span className={styles.price}>
              {course.price.toLocaleString('vi-VN')} ₫
            </span>
          ) : (
            <span className={styles.priceFree}>Miễn phí</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionsRow}>
        <button
          onClick={() => onEdit(course)}
          className={styles.editBtn}
          title="Chỉnh sửa thông tin khóa học"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Sửa</span>
        </button>

        <button
          onClick={() => onDelete(course.id)}
          className={styles.deleteBtn}
          title="Xóa khóa học"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa</span>
        </button>
      </div>
    </motion.div>
  );
};
