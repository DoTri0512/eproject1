import { useState, useEffect, useRef, useCallback } from 'react';
import chatbotApi from '../../../../api/chatbotApi';

const SESSION_STORAGE_KEY = 'traveltrail_chat_session_id';

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sessionId, setSessionId] = useState('');

  const messagesEndRef = useRef(null);

  // Initialize or load sessionId from storage
  useEffect(() => {
    let storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSessionId) {
      storedSessionId = 'session_' + Math.random().toString(36).substring(2, 11) + Date.now();
      localStorage.setItem(SESSION_STORAGE_KEY, storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Fetch quick suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await chatbotApi.getSuggestions();
        if (res?.data) {
          setSuggestions(res.data);
        }
      } catch (err) {
        // Fallback default suggestions
        setSuggestions([
          { id: '1', text: '🏖️ Gợi ý tour biển 3N2Đ dưới 5 triệu' },
          { id: '2', text: '⛰️ Mùa này nên đi du lịch ở đâu đẹp nhất?' },
          { id: '3', text: '🗺️ Lên lịch trình khám phá Đà Nẵng cho gia đình' },
          { id: '4', text: '🏕️ Tour săn mây Sa Pa hay Hà Giang' },
        ]);
      }
    };
    fetchSuggestions();
  }, []);

  // Listen for global open-chatbot event
  useEffect(() => {
    const handleOpenChatbot = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e?.detail?.query) {
        setInput(e.detail.query);
      }
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  // Load existing session history when sessionId is set
  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      try {
        const res = await chatbotApi.getSession(sessionId);
        if (res?.data?.messages && res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          // Welcome greeting if new session
          setMessages([
            {
              sender: 'assistant',
              content: `Xin chào quý khách! 👋 Em là **Trợ lý du lịch TravelTrail AI**.

Rất vui được đồng hành cùng bạn! Bạn có thể hỏi em bất cứ điều gì về du lịch Việt Nam:
- 🏖️ **Tư vấn điểm đến & mùa du lịch đẹp nhất**
- 💰 **Gợi ý tour trọn gói theo ngân sách** (ví dụ: dưới 3 triệu, 5 triệu)
- 🗺️ **Lên lịch trình thông minh chi tiết** (2N1Đ, 3N2Đ, 4N3Đ)

Bạn muốn bắt đầu chuyến đi tới đâu, hãy nhắn tin hoặc chọn các gợi ý bên dưới nhé!`,
              suggestedTours: [],
              suggestedDestinations: [],
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadHistory();
  }, [sessionId]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  // Send message
  const sendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotApi.sendMessage({
        sessionId,
        message: text,
      });

      if (res?.data) {
        const botMsg = {
          sender: 'assistant',
          content: res.data.reply,
          suggestedTours: res.data.suggestedTours || [],
          suggestedDestinations: res.data.suggestedDestinations || [],
          timestamp: res.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('Error sending message to chatbot:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          content: 'Xin lỗi bạn, em đang gặp sự cố kết nối tạm thời. Vui lòng thử lại sau giây lát nhé!',
          suggestedTours: [],
          suggestedDestinations: [],
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset / Clear chat
  const clearChat = async () => {
    if (!sessionId) return;
    try {
      await chatbotApi.clearSession(sessionId);
    } catch (err) {
      console.warn('Failed to clear session on server:', err);
    }

    // Generate new sessionId
    const newSessionId = 'session_' + Math.random().toString(36).substring(2, 11) + Date.now();
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    setSessionId(newSessionId);

    setMessages([
      {
        sender: 'assistant',
        content: 'Cuộc trò chuyện đã được làm mới. Em có thể giúp gì tiếp theo cho chuyến du lịch của bạn?',
        suggestedTours: [],
        suggestedDestinations: [],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    messages,
    loading,
    input,
    setInput,
    suggestions,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
};

export default useChatbot;
