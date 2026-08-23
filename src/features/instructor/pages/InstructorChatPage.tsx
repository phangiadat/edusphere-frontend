import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ConversationList } from '../components/chat/ConversationList';
import type { ConversationItemModel } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import type { MessageModel } from '../components/chat/ChatWindow';
import { StudentInfoDrawer } from '../components/chat/StudentInfoDrawer';
import { chatService } from '../../../services/api/chatService';
import styles from './InstructorChatPage.module.css';

import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const InstructorChatPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || '';

  const [conversations, setConversations] = useState<ConversationItemModel[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItemModel | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, MessageModel[]>>({});
  const [socket, setSocket] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // WebSockets Setup with NestJS ChatGateway
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || '';
    const newSocket = io('http://localhost:3000/chat', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch conversations from Backend REST API
  useEffect(() => {
    let isMounted = true;
    async function fetchConversations() {
      try {
        const backendConvs = await chatService.getMyConversations();
        if (isMounted && Array.isArray(backendConvs)) {
          const mapped: ConversationItemModel[] = backendConvs.map((c: any) => {
            const student = c.user1Id === currentUserId ? c.user2 : c.user1;
            return {
              id: c.id,
              studentId: student?.id || '',
              studentName: student?.fullName || 'Học viên',
              studentEmail: student?.email || '',
              studentAvatar:
                student?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              lastMessage: c.lastMessage?.content || 'Chưa có tin nhắn nào',
              lastMessageTime: 'Vừa xong',
              unreadCount: c.unreadCount || 0,
              isOnline: true,
            };
          });
          setConversations(mapped);
          if (mapped.length > 0) {
            setSelectedConversation(mapped[0]);
          } else {
            setSelectedConversation(null);
          }
        }
      } catch (err) {
        console.warn('Lỗi khi nạp danh sách trò chuyện từ Backend:', err);
        if (isMounted) {
          setConversations([]);
          setSelectedConversation(null);
        }
      }
    }

    fetchConversations();
    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  // Handle Fetching History with Pagination (Infinite Scroll support)
  const handleFetchOlderMessages = async (page: number) => {
    if (!selectedConversation) return;

    try {
      const response = await chatService.getChatHistory(selectedConversation.id, page, 30);
      if (response && response.data && response.data.length > 0) {
        const olderMapped: MessageModel[] = response.data.map((m) => ({
          id: m.id,
          conversationId: m.conversationId,
          senderId: m.senderId,
          content: m.content,
          createdAt: m.createdAt,
        }));

        setMessagesMap((prev) => {
          const currentList = prev[selectedConversation.id] || [];
          return {
            ...prev,
            [selectedConversation.id]: [...olderMapped, ...currentList],
          };
        });
      }
    } catch (e) {
      console.warn('Failed API fetch older messages:', e);
    }
  };

  const handleSelectConversation = (conv: ConversationItemModel) => {
    setSelectedConversation(conv);
    // Clear unread count on select
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMsg: MessageModel = {
      id: `m-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
    };

    // Update Local Messages state
    setMessagesMap((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg],
    }));

    // Update Conversation Last Message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: content, lastMessageTime: 'Vừa xong' }
          : c
      )
    );

    // Emit WebSockets Event to NestJS ChatGateway
    if (socket) {
      socket.emit('send_message', {
        conversationId: selectedConversation.id,
        content,
      });
    }
  };

  const currentMessages = selectedConversation
    ? messagesMap[selectedConversation.id] || []
    : [];

  if (conversations.length === 0) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Chưa có cuộc trò chuyện nào</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Kênh Chat WebSockets đã sẵn sàng! Khi học viên gửi tin nhắn hoặc câu hỏi, cuộc hội thoại sẽ tự động xuất hiện tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Left Column: Conversation List */}
      <div className={styles.leftColumn}>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id || null}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Right Column: Chat Window */}
      <div className={styles.rightColumn}>
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={currentUserId}
          socket={socket}
          initialMessages={currentMessages}
          hasMoreOlder={true}
          onFetchOlderMessages={handleFetchOlderMessages}
          onSendMessage={handleSendMessage}
          onOpenInfo={() => setIsDrawerOpen(true)}
        />
      </div>

      {/* Student Info Slide-out Drawer */}
      <StudentInfoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        student={selectedConversation}
      />
    </div>
  );
};
