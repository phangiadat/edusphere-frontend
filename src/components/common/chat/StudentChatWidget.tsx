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
import { paymentApi } from '../../../api/paymentApi';
import { useAuth } from '../../../context/AuthContext';
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

interface StudentChatWidgetProps {
  isAuthenticated?: boolean;
  userRole?: string;
}

export const StudentChatWidget: React.FC<StudentChatWidgetProps> = ({
  isAuthenticated: propIsAuth,
  userRole: propUserRole,
}) => {
  const auth = useAuth();
  const user = auth?.user;
  const isAuthCtx = auth?.isAuthenticated ?? false;

  // Read token & user_info from localStorage as fallback
  const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken');
  const storedUserRaw = localStorage.getItem('user_info');
  let storedRole = 'STUDENT';
  if (storedUserRaw) {
    try {
      const parsed = JSON.parse(storedUserRaw);
      if (parsed?.role) storedRole = parsed.role;
    } catch {}
  }

  const isAuth = propIsAuth ?? (isAuthCtx || Boolean(token));
  const role = propUserRole ?? (user?.role || storedRole);

  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'LIST' | 'CHAT'>('LIST');
  const [instructors, setInstructors] = useState<InstructorModel[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorModel | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, WidgetMessageModel[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isInstructorTyping, setIsInstructorTyping] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [socket, setSocket] = useState<any>(null);

  const currentStudentId = user?.id || '';
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Total Unread Messages for Floating Button Badge
  const totalUnreadCount = instructors.reduce((sum, inst) => sum + (inst.unreadCount || 0), 0);

  // 1. Load enrolled instructors dynamically from PostgreSQL DB (Enrolled courses ONLY)
  useEffect(() => {
    if (!isAuth) {
      setInstructors([]);
      return;
    }

    let isMounted = true;
    async function loadEnrolledInstructors() {
      setIsLoadingList(true);
      try {
        const myCoursesRes = await paymentApi.getMyCourses(1, 50);
        const courseList = Array.isArray(myCoursesRes) ? myCoursesRes : (myCoursesRes?.data || []);

        if (!isMounted) return;

        if (courseList.length === 0) {
          setInstructors([]);
          setIsLoadingList(false);
          return;
        }

        // Filter distinct instructors from student's enrolled courses
        const instructorMap = new Map<string, { instructor: any; courseTitle: string }>();
        courseList.forEach((enrollment: any) => {
          const inst = enrollment.course?.instructor;
          if (inst && inst.id && !instructorMap.has(inst.id)) {
            instructorMap.set(inst.id, {
              instructor: inst,
              courseTitle: enrollment.course.title,
            });
          }
        });

        // Find or create conversation with each enrolled instructor
        const fetchedList: InstructorModel[] = [];
        for (const [instructorId, info] of instructorMap.entries()) {
          try {
            const conv = await chatService.startConversation(instructorId);
            if (conv && conv.id) {
              fetchedList.push({
                id: instructorId,
                conversationId: conv.id,
                instructorName: info.instructor.fullName || 'Giảng viên',
                instructorAvatar:
                  info.instructor.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                courseTitle: info.courseTitle,
                lastMessage: conv.lastMessage?.content || 'Chưa có tin nhắn nào',
                lastMessageTime: 'Vừa xong',
                unreadCount: conv.unreadCount || 0,
                isOnline: true,
              });
            }
          } catch (err) {
            console.warn(`Lỗi nạp cuộc hội thoại với giảng viên (${instructorId}):`, err);
          }
        }

        if (isMounted) {
          setInstructors(fetchedList);
        }
      } catch (err) {
        console.warn('Lỗi nạp danh sách giảng viên đã mua khóa học:', err);
        if (isMounted) setInstructors([]);
      } finally {
        if (isMounted) setIsLoadingList(false);
      }
    }

    loadEnrolledInstructors();
  }, [isAuth]);

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
  const handleSelectInstructor = async (inst: InstructorModel) => {
    setSelectedInstructor(inst);
    setActiveView('CHAT');
    setIsInstructorTyping(false);
    setCurrentPage(1);

    // Mark as read when opening chat
    setInstructors((prev) =>
      prev.map((i) => (i.id === inst.id ? { ...i, unreadCount: 0 } : i))
    );

    // Fetch initial chat history from NestJS Backend API
    try {
      const response = await chatService.getChatHistory(inst.conversationId, 1, 30);
      if (response && response.data) {
        const historyMapped: WidgetMessageModel[] = response.data
          .map((m: any) => ({
            id: m.id,
            conversationId: m.conversationId,
            senderId: m.senderId,
            content: m.content,
            createdAt: m.createdAt,
          }))
          .reverse();

        setMessagesMap((prev) => ({
          ...prev,
          [inst.conversationId]: historyMapped,
        }));
      }
    } catch (err) {
      console.warn('Lỗi nạp lịch sử tin nhắn:', err);
    }

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

  // 🔒 AUTH ROLE GATE FIX: Strictly hide widget if Guest (not logged in) or Instructor/Admin
  if (!isAuth || (role && role.toUpperCase() !== 'STUDENT')) {
    return null;
  }

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

              {isLoadingList ? (
                <div className="p-8 text-center space-y-2 my-auto">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto" />
                  <p className="text-xs text-[var(--text-secondary)] font-medium">Đang nạp Giảng viên từ khóa học đã mua...</p>
                </div>
              ) : filteredInstructors.length === 0 ? (
                <div className="p-6 text-center space-y-3 my-auto">
                  <MessageSquare className="w-10 h-10 text-purple-400 mx-auto opacity-60" />
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Chưa có Giảng viên nào</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Bạn chỉ có thể trò chuyện với Giảng viên sau khi đăng ký khóa học của họ. Hãy chọn khóa học yêu thích và bắt đầu học ngay!
                  </p>
                </div>
              ) : (
                filteredInstructors.map((inst) => (
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
                ))
              )}
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
