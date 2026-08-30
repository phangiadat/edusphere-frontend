import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { aiService } from '../../../services/api/aiService';
import { CodeBlockRenderer } from './CodeBlockRenderer';
import styles from './AiAssistantDrawer.module.css';

export interface AiChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  content: string;
  createdAt: string;
}

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId?: string;
  lessonTitle?: string;
}

const INITIAL_MESSAGES: AiChatMessage[] = [
  {
    id: 'ai-welcome',
    sender: 'AI',
    content: `👋 **Xin chào! Tôi là Trợ lý AI Gemini 2.0 của EduSphere.**

Tôi sẵn sàng hỗ trợ bạn giải đáp thắc mắc lập trình, tóm tắt bài học hoặc viết code minh họa. Hãy thử bấm các gợi ý nhanh bên dưới nhé!`,
    createdAt: new Date().toISOString(),
  },
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  };

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      content: promptText.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await aiService.askQuestion({
        question: promptText.trim(),
        lessonId,
      });

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        content: res.answer,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.warn('AI Service Error Fallback:', e);
      const fallbackAiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        content: `🤖 **Trợ lý AI EduSphere (Gemini 2.0)**:

Đã ghi nhận câu hỏi: *"_${promptText}_"*.

### 💡 Gợi ý giải đáp nhanh:
- Đảm bảo bạn đã áp dụng đúng cú pháp và kiểm tra kết nối API.
- **Ví dụ Code TypeScript**:
\`\`\`ts
const data = await aiService.askQuestion({ question: '...' });
console.log(data.answer);
\`\`\``,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={styles.overlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.drawerCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.sparklesBadge}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className={styles.titleBox}>
                  <h3 className={styles.title}>Trợ lý AI Gemini 2.0</h3>
                  <span className={styles.subtitle}>
                    {lessonTitle ? `Đang hỗ trợ: ${lessonTitle}` : 'Giải đáp kiến thức 24/7'}
                  </span>
                </div>
              </div>

              <button onClick={onClose} className={styles.closeBtn} title="Đóng">
                <X className="w-5 h-5" />
              </button>
            </div>

        {/* Quick Prompts Bar */}
        <div className={styles.promptsBar}>
          <button
            onClick={() => handleSendPrompt('Tóm tắt các điểm chính của bài học này')}
            className={styles.promptPill}
          >
            💡 Tóm tắt bài học
          </button>
          <button
            onClick={() => handleSendPrompt('Giải thích ngắn gọn khái niệm trong bài')}
            className={styles.promptPill}
          >
            🧠 Giải thích khái niệm
          </button>
          <button
            onClick={() => handleSendPrompt('Cho tôi ví dụ code minh họa thực tế')}
            className={styles.promptPill}
          >
            💻 Ví dụ Code mẫu
          </button>
        </div>

        {/* Messages Scroll Box */}
        <div ref={scrollRef} className={styles.messagesScroll}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'USER';
            return (
              <div
                key={msg.id}
                className={`${styles.msgRow} ${isUser ? styles.msgUser : styles.msgAi}`}
              >
                <div
                  className={`${styles.bubble} ${
                    isUser ? styles.bubbleUser : styles.bubbleAi
                  }`}
                >
                  {isUser ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      components={{
                        code: CodeBlockRenderer as any,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className={styles.thinkingRow}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini 2.0 đang suy nghĩ câu trả lời...</span>
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className={styles.footer}>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi Gemini AI về kiến thức bài học..."
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={styles.sendBtn}
            >
              <Send className="w-4 h-4" />
              <span>Hỏi AI</span>
            </button>
          </form>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
