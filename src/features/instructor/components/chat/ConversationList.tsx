import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import styles from './ConversationList.module.css';

export interface ConversationItemModel {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  courseTitle?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface ConversationListProps {
  conversations: ConversationItemModel[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: ConversationItemModel) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <aside className={styles.sidebar}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Tin nhắn Học viên</h2>
          {totalUnread > 0 && <span className={styles.unreadPill}>{totalUnread} mới</span>}
        </div>

        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc email học viên..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Conversation List Scroll */}
      <div className={styles.listScroll}>
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isSelected = item.id === selectedConversationId;
            return (
              <div
                key={item.id}
                onClick={() => onSelectConversation(item)}
                className={`${styles.itemRow} ${isSelected ? styles.itemRowSelected : ''}`}
              >
                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                  <img
                    src={item.studentAvatar}
                    alt={item.studentName}
                    className={styles.avatar}
                  />
                  {item.isOnline && <div className={styles.onlineBadge} />}
                </div>

                {/* Info */}
                <div className={styles.itemInfo}>
                  <div className={styles.nameRow}>
                    <span className={styles.studentName}>{item.studentName}</span>
                    {item.lastMessageTime && (
                      <span className={styles.timeText}>{item.lastMessageTime}</span>
                    )}
                  </div>

                  {item.courseTitle && (
                    <span className={styles.courseTag}>{item.courseTitle}</span>
                  )}

                  <div className={styles.lastMessageRow}>
                    <span className={styles.lastMessageText}>
                      {item.lastMessage || 'Chưa có tin nhắn nào'}
                    </span>
                    {item.unreadCount ? (
                      <span className={styles.unreadBadge}>{item.unreadCount}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p>Không tìm thấy cuộc hội thoại nào</p>
          </div>
        )}
      </div>
    </aside>
  );
};
