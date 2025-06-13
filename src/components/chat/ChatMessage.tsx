
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageContent = (content: string) => {
    // Sanitize content first - remove any script tags and potentially dangerous HTML
    const sanitized = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');

    // Convert safe markdown-style formatting to HTML
    let formatted = sanitized
      // Bold text - only allow simple ** formatting
      .replace(/\*\*([\w\s.,!?áéíóúñü]+?)\*\*/g, '<strong>$1</strong>')
      // Italic text - only allow simple * formatting  
      .replace(/\*([\w\s.,!?áéíóúñü]+?)\*/g, '<em>$1</em>')
      // Bullet points - sanitize content
      .replace(/^• (.*$)/gim, (match, text) => {
        const safeText = text.replace(/[<>]/g, '');
        return `<div class="flex items-start gap-2 my-1"><span class="text-ocean">•</span><span>${safeText}</span></div>`;
      })
      // Numbered lists - sanitize content
      .replace(/^(\d+)\. (.*$)/gim, (match, num, text) => {
        const safeText = text.replace(/[<>]/g, '');
        return `<div class="flex items-start gap-2 my-1"><span class="text-ocean font-semibold">${num}.</span><span>${safeText}</span></div>`;
      })
      // Line breaks
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div
      className={`flex gap-2 ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'bot' && (
        <div className="w-6 h-6 bg-gradient-to-br from-ocean to-ocean-dark rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={12} className="text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-ocean to-ocean-dark text-white rounded-br-md shadow-md'
            : 'bg-gray-50 text-gray-800 rounded-bl-md border border-gray-100 shadow-sm'
        }`}
      >
        {message.type === 'bot' ? (
          <div 
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content) 
            }}
          />
        ) : (
          // For user messages, use text content only (no HTML)
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        <p className={`text-xs mt-2 ${
          message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.type === 'user' && (
        <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User size={12} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
