import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Minus,
  RotateCcw,
  Send,
  Compass,
  ChevronDown,
  Bot,
} from 'lucide-react';
import useChatbot from '../hooks/useChatbot';
import ChatMessage from './ChatMessage';

export const ChatbotWidget = () => {
  const {
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
  } = useChatbot();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (text) => {
    // Strip leading emojis from prompt for clean processing if needed
    const cleanText = text.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(cleanText || text);
  };

  return (
    <aside aria-label="Trợ lý ảo AI TravelTrail">
      {/* 1. Floating Action Button (FAB) when chat is closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Tooltip Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-sky-100 text-xs font-semibold text-slate-800 animate-bounce duration-1000">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Tư vấn du lịch 24/7</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Mở Chatbot AI Tư vấn Du lịch"
            aria-label="Mở Chatbot AI Tư vấn Du lịch"
          >
            {/* Ping effect ring */}
            <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-40 group-hover:animate-ping -z-10" />

            <Bot className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />

            {/* Notification Green Dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      )}

      {/* 2. Minimized Header Bar */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between w-72 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-sky-200">
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-1"
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">TravelTrail AI</p>
              <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Trực tuyến
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Phóng to"
            >
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Full Chatbox Window */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-80px)] flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800 transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-4 py-3 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-sky-600 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  TravelTrail AI
                  <span className="bg-white/20 text-sky-100 text-[10px] px-1.5 py-0.2 rounded-full font-medium">
                    Beta
                  </span>
                </h3>
                <p className="text-[11px] text-sky-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block animate-pulse"></span>
                  Trợ lý tư vấn du lịch thông minh
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:text-white"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:text-white"
                title="Thu nhỏ"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white hover:text-white"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-slate-50/50">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg}
                onSelectCard={() => {
                  // Optional: minimize on click to let user browse
                }}
              />
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2.5 my-3 items-center justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    TravelTrail AI đang tìm dữ liệu & soạn tư vấn...
                  </span>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions && suggestions.length > 0 && (
            <div className="bg-white border-t border-slate-100 px-3 py-2 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-500" />
                <span>Gợi ý câu hỏi phổ biến:</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.text)}
                    disabled={loading}
                    className="shrink-0 text-left bg-sky-50 hover:bg-sky-100 border border-sky-200/70 text-sky-800 text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-150 active:scale-95 disabled:opacity-50"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Footer */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all"
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi AI về điểm đến, giá tour, lịch trình..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] text-slate-800 placeholder-slate-400 py-1 max-h-24 leading-snug"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
              <span>Nhấn Enter để gửi, Shift+Enter xuống dòng</span>
              <span>Dữ liệu thực tế từ TravelTrail</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default ChatbotWidget;
