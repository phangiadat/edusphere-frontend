import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, Loader2 } from 'lucide-react';
import type { ConversationItemModel } from './ConversationList';
import styles from './ChatWindow.module.css';

export interface MessageModel {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  conversation: ConversationItemModel | null;
  currentUserId: string;
  socket: any; // Socket.io instance
  initialMessages: MessageModel[];
  hasMoreOlder?: boolean;
  onFetchOlderMessages?: (page: number) => Promise<void>;
  onSendMessage: (content: string) => void;
  onOpenInfo: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  socket,
  initialMessages,
  hasMoreOlder = false,
  onFetchOlderMessages,
  onSendMessage,
  onOpenInfo,
}) => {
  const [messages, setMessages] = useState<MessageModel[]>(initialMessages);
  const [newMessageText, setNewMessageText] = useState('');
  const [isStudentTyping, setIsStudentTyping] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initialMessages when conversation changes
  useEffect(() => {
    setMessages(initialMessages);
    setCurrentPage(1);
    setIsStudentTyping(false);
    scrollToBottom();
  }, [conversation?.id, initialMessages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    });
  };

  // =========================================================================
  // PATCH 1: WEBSOCKETS MEMORY LEAK CLEANUP & REALTIME EVENT LISTENERS
  // =========================================================================
  useEffect(() => {
    if (!socket || !conversation?.id) return;

    // Join WebSockets conversation room
    socket.emit('join_conversation', conversation.id);

    // Event Handlers
    const handleReceiveMessage = (incomingMsg: MessageModel) => {
      setMessages((prev) => {
        // Prevent duplicate message ids
        if (prev.some((m) => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
      scrollToBottom();
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        setIsStudentTyping(data.isTyping);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    // MANDATORY CLEANUP FUNCTION TO PREVENT MEMORY LEAKS & DUPLICATE LISTENERS
    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, conversation?.id, currentUserId]);

  // =========================================================================
  // PATCH 2: INFINITE SCROLL ON SCROLL TO TOP
  // =========================================================================
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop === 0 && hasMoreOlder && !isLoadingOlder && onFetchOlderMessages) {
      const previousScrollHeight = container.scrollHeight;
      setIsLoadingOlder(true);

      try {
        const nextPage = currentPage + 1;
        await onFetchOlderMessages(nextPage);
        setCurrentPage(nextPage);

        // Restore scroll position after prepending older messages so user scroll doesn't jump
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - previousScrollHeight;
          }
        });
      } catch (err) {
        console.warn('Failed to load older chat messages:', err);
      } finally {
        setIsLoadingOlder(false);
      }
    }
  };

  // =========================================================================
  // PATCH 3: TYPING INDICATOR EMISSION WITH DEBOUNCE
  // =========================================================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessageText(e.target.value);

    if (socket && conversation?.id) {
      socket.emit('typing', { conversationId: conversation.id, isTyping: true });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId: conversation.id, isTyping: false });
      }, 1500);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const content = newMessageText.trim();
    onSendMessage(content);
    setNewMessageText('');

    if (socket && conversation?.id) {
      socket.emit('stop_typing', { conversationId: conversation.id, isTyping: false });
    }
  };

  const formatMsgTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  if (!conversation) {
    return (
      <div className={styles.emptyWindow}>
        <MessageCircle className="w-12 h-12 text-purple-500" />
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
          Chọn một cuộc hội thoại để bắt đầu nhắn tin
        </h3>
        <p className="text-xs max-w-sm">
          Trò chuyện trực tiếp và hỗ trợ giải đáp thắc mắc cho Học viên theo thời gian thực.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            src={conversation.studentAvatar}
            alt={conversation.studentName}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <span className={styles.studentName}>{conversation.studentName}</span>
            <span className={styles.statusText}>● Đang hoạt động (Online)</span>
          </div>
        </div>

        <button onClick={onOpenInfo} className={styles.infoBtn}>
          <User className="w-4 h-4" />
          <span>Thông tin học viên</span>
        </button>
      </div>

      {/* Messages Scroll Area with Infinite Scroll */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={styles.messagesScroll}
      >
        {isLoadingOlder && (
          <div className={styles.loadingOlderIndicator}>
            <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
            Đang tải thêm tin nhắn cũ hơn...
          </div>
        )}

        {messages.map((msg) => {
          const isSentByInstructor = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${
                isSentByInstructor ? styles.messageRowSent : styles.messageRowReceived
              }`}
            >
              <div
                className={`${styles.bubble} ${
                  isSentByInstructor ? styles.bubbleSent : styles.bubbleReceived
                }`}
              >
                {msg.content}
              </div>
              <span className={styles.messageTime}>{formatMsgTime(msg.createdAt)}</span>
            </div>
          );
        })}

        {/* Patch 3: Animated Student Typing Indicator Bubble */}
        {isStudentTyping && (
          <div className={styles.typingBubble} title="Học viên đang gõ tin nhắn...">
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
          </div>
        )}
      </div>

      {/* Input Footer */}
      <div className={styles.footer}>
        <form onSubmit={handleSend} className={styles.inputForm}>
          <input
            type="text"
            value={newMessageText}
            onChange={handleInputChange}
            placeholder="Nhập nội dung tin nhắn tư vấn / trả lời học viên..."
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn}>
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>
      </div>
    </div>
  );
};
