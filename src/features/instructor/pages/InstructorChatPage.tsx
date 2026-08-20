import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ConversationList } from '../components/chat/ConversationList';
import type { ConversationItemModel } from '../components/chat/ConversationList';
import { ChatWindow } from '../components/chat/ChatWindow';
import type { MessageModel } from '../components/chat/ChatWindow';
import { StudentInfoDrawer } from '../components/chat/StudentInfoDrawer';
import { chatService } from '../../../services/api/chatService';
import styles from './InstructorChatPage.module.css';

// Initial Mock Seed Data
const INITIAL_CONVERSATIONS: ConversationItemModel[] = [
  {
    id: 'conv-1',
    studentId: 'student-1',
    studentName: 'Nguyễn Văn Hải',
    studentEmail: 'hai.nguyen@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    courseTitle: 'NestJS & Microservices Masterclass',
    lastMessage: 'Em vừa nộp link GitHub bài tập auth ạ!',
    lastMessageTime: '14:30',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'conv-2',
    studentId: 'student-2',
    studentName: 'Trần Thị Thu Hà',
    studentEmail: 'ha.tran@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    courseTitle: 'NestJS & Microservices Masterclass',
    lastMessage: 'Cảm ơn thầy đã chấm bài 9.5 điểm cho em ạ!',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'conv-3',
    studentId: 'student-3',
    studentName: 'Lê Hoàng Minh',
    studentEmail: 'minh.le@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    courseTitle: 'React 18 & Next.js 14 Masterclass',
    lastMessage: 'Thầy cho em hỏi phần Server Components với ạ.',
    lastMessageTime: '18/08',
    unreadCount: 0,
    isOnline: true,
  },
];

const INITIAL_MESSAGES: Record<string, MessageModel[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversationId: 'conv-1',
      senderId: 'student-1',
      content: 'Chào thầy, em đang làm bài tập AuthModule trong Chương 1 ạ.',
      createdAt: '2026-08-19T14:20:00Z',
    },
    {
      id: 'm-2',
      conversationId: 'conv-1',
      senderId: 'instructor-1',
      content: 'Chào Hải, em gặp vướng mắc ở phần Passport JWT Strategy hay Bcrypt password?',
      createdAt: '2026-08-19T14:25:00Z',
    },
    {
      id: 'm-3',
      conversationId: 'conv-1',
      senderId: 'student-1',
      content: 'Em vừa nộp link GitHub bài tập auth ạ! Thầy giúp em xem qua nhé.',
      createdAt: '2026-08-19T14:30:00Z',
    },
  ],
};

export const InstructorChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationItemModel[]>(INITIAL_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItemModel | null>(
    INITIAL_CONVERSATIONS[0]
  );
  const [messagesMap, setMessagesMap] = useState<Record<string, MessageModel[]>>(INITIAL_MESSAGES);
  const [socket, setSocket] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const currentUserId = 'instructor-1'; // Instructor User ID

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
        if (isMounted && backendConvs && backendConvs.length > 0) {
          const mapped: ConversationItemModel[] = backendConvs.map((c) => {
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
              lastMessageTime: 'Mới xong',
              unreadCount: c.unreadCount || 0,
              isOnline: true,
            };
          });
          setConversations(mapped);
          if (mapped.length > 0 && !selectedConversation) {
            setSelectedConversation(mapped[0]);
          }
        }
      } catch (err) {
        console.warn('Backend REST API Chat fallback to seed conversations:', err);
      }
    }

    fetchConversations();
    return () => {
      isMounted = false;
    };
  }, []);

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
