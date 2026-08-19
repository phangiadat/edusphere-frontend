import React from 'react';
import styles from './RecentActivity.module.css';

interface ActivityItem {
  id: string;
  userName: string;
  avatarUrl: string;
  actionText: string;
  targetTitle: string;
  timeAgo: string;
}

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-1',
    userName: 'Nguyễn Văn Hải',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    actionText: 'vừa mua khóa học',
    targetTitle: 'Lập trình NestJS & Microservices',
    timeAgo: '10 phút trước',
  },
  {
    id: 'act-2',
    userName: 'Trần Thị Bình',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    actionText: 'vừa nộp bài tập',
    targetTitle: 'Chapter 2: Prisma ORM Schema',
    timeAgo: '45 phút trước',
  },
  {
    id: 'act-3',
    userName: 'Lê Hoàng Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    actionText: 'vừa đánh giá ⭐⭐⭐⭐⭐ cho khóa học',
    targetTitle: 'React 18 & Next.js 14 Masterclass',
    timeAgo: '2 giờ trước',
  },
  {
    id: 'act-4',
    userName: 'Phạm Minh Tuấn',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    actionText: 'vừa đặt câu hỏi trong kênh Chat 1-1',
    targetTitle: 'Hỗ trợ bài tập Microservices',
    timeAgo: '4 giờ trước',
  },
  {
    id: 'act-5',
    userName: 'Đặng Thu Hà',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    actionText: 'vừa hoàn thành 100% khóa học và nhận Chứng chỉ',
    targetTitle: 'Thiết kế UI/UX Figma 2026',
    timeAgo: '6 giờ trước',
  },
];

export const RecentActivity: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hoạt động Gần đây</h3>
        <span className={styles.countBadge}>5 mới nhất</span>
      </div>

      <div className={styles.activityList}>
        {ACTIVITIES_DATA.map((item) => (
          <div key={item.id} className={styles.activityItem}>
            <img
              src={item.avatarUrl}
              alt={item.userName}
              className={styles.avatar}
            />
            <div className={styles.contentBox}>
              <p className={styles.userText}>
                <span className={styles.userName}>{item.userName}</span>{' '}
                {item.actionText}{' '}
                <span className={styles.courseHighlight}>"{item.targetTitle}"</span>
              </p>
              <span className={styles.timestamp}>{item.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
