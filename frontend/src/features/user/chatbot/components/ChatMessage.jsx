import React from 'react';
import { Bot, User, Sparkles } from 'lucide-react';
import TourCard from './TourCard';
import DestinationCard from './DestinationCard';

/**
 * Format markdown text with bold, italic, lists, and line breaks
 */
const formatContent = (content) => {
  if (!content) return null;

  const lines = content.split('\n');

  return lines.map((line, idx) => {
    // Empty line
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    // Parse bold text **something**
    const parseLine = (text) => {
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={pIdx} className="italic text-slate-700">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });
    };

    // List item (e.g. - item or * item)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const bulletText = line.trim().substring(2);
      return (
        <div key={idx} className="flex items-start gap-1.5 my-1 pl-1 text-[13px] leading-relaxed">
          <span className="text-sky-500 font-bold shrink-0">•</span>
          <span className="text-slate-700">{parseLine(bulletText)}</span>
        </div>
      );
    }

    // Numbered list item (e.g. 1. item)
    if (/^\d+\.\s/.test(line.trim())) {
      const numMatch = line.trim().match(/^(\d+\.)\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 pl-1 text-[13px] leading-relaxed">
            <span className="text-sky-600 font-bold text-xs shrink-0">{numMatch[1]}</span>
            <span className="text-slate-700">{parseLine(numMatch[2])}</span>
          </div>
        );
      }
    }

    // Regular paragraph line
    return (
      <p key={idx} className="text-[13px] leading-relaxed text-slate-700 mb-1">
        {parseLine(line)}
      </p>
    );
  });
};

export const ChatMessage = ({ message, onSelectCard }) => {
  const isUser = message.sender === 'user';
  const timeString = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex gap-2.5 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
      )}

      {/* Message Bubble & Cards Container */}
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Text Bubble */}
        <div
          className={`p-3.5 rounded-2xl shadow-sm text-left ${
            isUser
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-tr-xs shadow-sky-500/10'
              : 'bg-white border border-slate-100/90 text-slate-800 rounded-tl-xs shadow-slate-200/50'
          }`}
        >
          {isUser ? (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-sm max-w-none">{formatContent(message.content)}</div>
          )}
        </div>

        {/* Suggested Tours Carousel/List */}
        {!isUser && message.suggestedTours && message.suggestedTours.length > 0 && (
          <div className="mt-3 w-full">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span>Tour du lịch đề xuất phù hợp:</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {message.suggestedTours.map((tour) => (
                <TourCard key={tour._id || tour.id} tour={tour} onSelect={onSelectCard} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Destinations */}
        {!isUser && message.suggestedDestinations && message.suggestedDestinations.length > 0 && (
          <div className="mt-2.5 w-full">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Điểm đến nổi bật:</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {message.suggestedDestinations.map((dest) => (
                <DestinationCard key={dest._id || dest.id} destination={dest} onSelect={onSelectCard} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {timeString}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
