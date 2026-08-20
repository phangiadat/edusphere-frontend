import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageSquare, 
  X, 
  Minus, 
  ChevronLeft, 
  Search, 
  Send, 
  Loader2 
} from 'lucide-react';
import { chatService } from '../../../services/api/chatService';
import styles from './StudentChatWidget.module.css';

export interface InstructorModel {
  id: string;
  conversationId: string;
  instructorName: string;
  instructorAvatar: string;
  courseTitle: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface WidgetMessageModel {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

// Initial Mock Seed Instructors for Enrolled Courses
const INITIAL_INSTRUCTORS: InstructorModel[] = [
  {
    id: 'instructor-1',
    conversationId: 'conv-1',
    instructorName: 'Nguyễn Văn Giảng Viên',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    courseTitle: 'NestJS & Microservices Masterclass',
    lastMessage: 'Chào em, thầy đã nhận được bài tập AuthModule của em rồi!',
    lastMessageTime: '14:25',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'instructor-2',
    conversationId: 'conv-figma',
    instructorName: 'Trần Thị Mỹ Linh',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    courseTitle: 'Thiết kế UI/UX Figma 2026',
    lastMessage: 'Em nhớ nộp Prototype phiên bản Dark Mode trước thứ 6 nhé.',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
    isOnline: true,
  },
];

const INITIAL_MESSAGES: Record<string, WidgetMessageModel[]> = {
  'conv-1': [
    {
      id: 'wm-1',
      conversationId: 'conv-1',
      senderId: 'student-1',
      content: 'Chào thầy, em vừa nộp link GitHub bài tập AuthModule ạ!',
      createdAt: '2026-08-19T14:20:00Z',
    },
    {
      id: 'wm-2',
      conversationId: 'conv-1',
      senderId: 'instructor-1',
      content: 'Chào em, thầy đã nhận được bài tập AuthModule của em rồi!',
      createdAt: '2026-08-19T14:25:00Z',
    },
  ],
};

export const StudentChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'LIST' | 'CHAT'>('LIST');
  const [instructors, setInstructors] = useState<InstructorModel[]>(INITIAL_INSTRUCTORS);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorModel | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, WidgetMessageModel[]>>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isInstructorTyping, setIsInstructorTyping] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [socket, setSocket] = useState<any>(null);

  const currentStudentId = 'student-1'; // Mock Student User ID
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Total Unread Messages for Floating Button Badge
  const totalUnreadCount = instructors.reduce((sum, inst) => sum + (inst.unreadCount || 0), 0);

  // Initialize WebSockets
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

  // Scroll to bottom helper
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesScrollRef.current) {
        messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
      }
    });
  };

  // =========================================================================
  // PATCH 1 & UX MARK-AS-READ: WEBSOCKETS LISTENERS & CLEANUP
  // =========================================================================
  useEffect(() => {
    if (!socket || !selectedInstructor?.conversationId) return;

    socket.emit('join_conversation', selectedInstructor.conversationId);

    const handleReceiveMessage = (incomingMsg: WidgetMessageModel) => {
      const convId = selectedInstructor.conversationId;

      setMessagesMap((prev) => {
        const currentList = prev[convId] || [];
        if (currentList.some((m) => m.id === incomingMsg.id)) return prev;
        return { ...prev, [convId]: [...currentList, incomingMsg] };
      });

      // UX MARK-AS-READ LOGIC:
      // If widget is OPEN and currently viewing this instructor's chat, auto mark as read!
      if (isOpen && activeView === 'CHAT') {
        // Do NOT increment unread count
      } else {
        // Increment unread count for this instructor
        setInstructors((prev) =>
          prev.map((inst) =>
            inst.conversationId === convId
              ? { ...inst, unreadCount: (inst.unreadCount || 0) + 1 }
              : inst
          )
        );
      }

      scrollToBottom();
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === selectedInstructor.id) {
        setIsInstructorTyping(data.isTyping);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    // CLEANUP FUNCTION TO PREVENT MEMORY LEAKS
    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, selectedInstructor?.id, selectedInstructor?.conversationId, isOpen, activeView]);

  // Handle Clicking an Instructor from View 1
  const handleSelectInstructor = (inst: InstructorModel) => {
    setSelectedInstructor(inst);
    setActiveView('CHAT');
    setIsInstructorTyping(false);

    // Mark as read when opening chat
    setInstructors((prev) =>
      prev.map((i) => (i.id === inst.id ? { ...i, unreadCount: 0 } : i))
    );

    scrollToBottom();
  };

  // Handle Back to Instructors List View 1
  const handleBackToList = () => {
    setActiveView('LIST');
  };

  // Infinite Scroll Handler (onScroll to top)
  const handleScrollMessages = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop === 0 && !isLoadingOlder && selectedInstructor) {
      const previousScrollHeight = container.scrollHeight;
      setIsLoadingOlder(true);

      try {
        const nextPage = currentPage + 1;
        const response = await chatService.getChatHistory(selectedInstructor.conversationId, nextPage, 30);
        if (response && response.data && response.data.length > 0) {
          const olderMapped: WidgetMessageModel[] = response.data.map((m) => ({
            id: m.id,
            conversationId: m.conversationId,
            senderId: m.senderId,
            content: m.content,
            createdAt: m.createdAt,
          }));

          setMessagesMap((prev) => ({
            ...prev,
            [selectedInstructor.conversationId]: [...olderMapped, ...(prev[selectedInstructor.conversationId] || [])],
          }));

          setCurrentPage(nextPage);

          requestAnimationFrame(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - previousScrollHeight;
            }
          });
        }
      } catch (err) {
        console.warn('Failed API fetch older messages in widget:', err);
      } finally {
        setIsLoadingOlder(false);
      }
    }
  };

  // Typing Input Change with Debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socket && selectedInstructor?.conversationId) {
      socket.emit('typing', { conversationId: selectedInstructor.conversationId, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId: selectedInstructor.conversationId, isTyping: false });
      }, 1500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedInstructor) return;

    const content = inputText.trim();
    const newMsg: WidgetMessageModel = {
      id: `wm-${Date.now()}`,
      conversationId: selectedInstructor.conversationId,
      senderId: currentStudentId,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedInstructor.conversationId]: [...(prev[selectedInstructor.conversationId] || []), newMsg],
    }));

    setInputText('');
    scrollToBottom();

    if (socket && selectedInstructor.conversationId) {
      socket.emit('send_message', {
        conversationId: selectedInstructor.conversationId,
        content,
      });
      socket.emit('stop_typing', { conversationId: selectedInstructor.conversationId, isTyping: false });
    }
  };

  const currentMessages = selectedInstructor
    ? messagesMap[selectedInstructor.conversationId] || []
    : [];

  const filteredInstructors = instructors.filter((inst) =>
    inst.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.widgetWrapper}>
      {/* 1. POPUP CHAT WINDOW (Shown when isOpen === true) */}
      {isOpen && (
        <div className={styles.popupCard}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {activeView === 'CHAT' ? (
                <>
                  <button onClick={handleBackToList} className={styles.backBtn} title="Quay lại danh sách Giảng viên">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={selectedInstructor?.instructorAvatar}
                    alt={selectedInstructor?.instructorName}
                    className={styles.instructorAvatar}
                  />
                  <div className={styles.headerTitleBox}>
                    <h4 className={styles.headerTitle}>{selectedInstructor?.instructorName}</h4>
                    <span className={styles.statusText}>● Đang trực tuyến</span>
                  </div>
                </>
              ) : (
                <div className={styles.headerTitleBox}>
                  <h4 className={styles.headerTitle}>Hỏi đáp với Giảng viên</h4>
                  <span className="text-xs text-slate-500 font-medium">Chọn giảng viên để nhắn tin</span>
                </div>
              )}
            </div>

            {/* Header Window Actions (Minimize & Close) */}
            <div className={styles.headerActions}>
              <button onClick={() => setIsOpen(false)} className={styles.actionIconBtn} title="Thu nhỏ">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className={styles.actionIconBtn} title="Đóng">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW 1: INSTRUCTORS LIST */}
          {activeView === 'LIST' && (
            <div className={styles.viewListBody}>
              <div className={styles.searchBox}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm giảng viên..."
                  className={styles.searchInput}
                />
              </div>

              {filteredInstructors.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => handleSelectInstructor(inst)}
                  className={styles.instructorRow}
                >
                  <div className={styles.avatarWrapper}>
                    <img
                      src={inst.instructorAvatar}
                      alt={inst.instructorName}
                      className={styles.rowAvatar}
                    />
                    {inst.isOnline && <div className={styles.onlineDot} />}
                  </div>

                  <div className={styles.rowInfo}>
                    <div className={styles.rowNameRow}>
                      <span className={styles.rowName}>{inst.instructorName}</span>
                      {inst.unreadCount ? (
                        <span className={styles.unreadBadge}>{inst.unreadCount}</span>
                      ) : null}
                    </div>
                    <span className={styles.rowCourse}>{inst.courseTitle}</span>
                    <span className={styles.rowLastMsg}>{inst.lastMessage || 'Chưa có tin nhắn'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW 2: CHAT DETAIL VIEW */}
          {activeView === 'CHAT' && (
            <>
              {/* Messages Scroll Box */}
              <div
                ref={messagesScrollRef}
                onScroll={handleScrollMessages}
                className={styles.messagesScroll}
              >
                {isLoadingOlder && (
                  <div className={styles.loadingOlder}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" />
                    Đang tải thêm tin nhắn cũ...
                  </div>
                )}

                {currentMessages.map((msg) => {
                  const isSentByStudent = msg.senderId === currentStudentId;
                  return (
                    <div
                      key={msg.id}
                      className={`${styles.msgRow} ${
                        isSentByStudent ? styles.msgSent : styles.msgReceived
                      }`}
                    >
                      <div
                        className={`${styles.bubble} ${
                          isSentByStudent ? styles.bubbleSent : styles.bubbleReceived
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className={styles.msgTime}>14:30</span>
                    </div>
                  );
                })}

                {/* Animated Typing Indicator */}
                {isInstructorTyping && (
                  <div className={styles.typingBubble} title="Giảng viên đang gõ...">
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                    <div className={styles.typingDot} />
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className={styles.footer}>
                <form onSubmit={handleSendMessage} className={styles.inputForm}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Nhập nội dung nhắn tin hỏi bài..."
                    className={styles.input}
                  />
                  <button type="submit" className={styles.sendBtn} title="Gửi tin nhắn">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. FLOATING BUBBLE BUTTON (Always Fixed at Bottom-Right) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.floatingBtn} ${isOpen ? styles.floatingBtnActive : ''}`}
        title="Trò chuyện với Giảng viên"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

        {!isOpen && totalUnreadCount > 0 && (
          <span className={styles.totalUnreadBadge}>{totalUnreadCount}</span>
        )}
      </button>
    </div>
  );
};
