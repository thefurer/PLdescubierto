import { User } from 'lucide-react';
import DOMPurify from 'dompurify';
import WhaleAvatar from './WhaleAvatar';

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
    // Format markdown-like syntax
    const formatted = content
      .replace(/\*\*([\w\s.,!?áéíóúñü]+?)\*\*/g, '<strong class="text-cyan-700">$1</strong>')
      .replace(/\*([\w\s.,!?áéíóúñü]+?)\*/g, '<em>$1</em>')
      .replace(/^• (.*$)/gim, (match, text) => {
        return `<div class="flex items-start gap-2 my-1"><span class="text-cyan-500">•</span><span>${text}</span></div>`;
      })
      .replace(/^(\d+)\. (.*$)/gim, (match, num, text) => {
        return `<div class="flex items-start gap-2 my-1"><span class="text-cyan-600 font-semibold">${num}.</span><span>${text}</span></div>`;
      })
      .replace(/\n/g, '<br/>');

    // Sanitize with DOMPurify to prevent XSS
    return DOMPurify.sanitize(formatted, {
      ALLOWED_TAGS: ['strong', 'em', 'div', 'span', 'br'],
      ALLOWED_ATTR: ['class']
    });
  };

  const isBot = message.type === 'bot';

  return (
    <div className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {isBot && (
        <WhaleAvatar size="sm" animated={false} className="mt-1 shadow-md" />
      )}
      
      <div className={`max-w-[78%] relative group`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isBot
              ? 'bg-white/80 text-gray-700 rounded-2xl rounded-tl-md border border-gray-100/80 shadow-sm'
              : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isBot ? (
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: formatMessageContent(message.content) 
              }}
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        {/* Timestamp */}
        <p className={`text-[10px] mt-1 px-1 ${
          isBot ? 'text-gray-400' : 'text-right text-gray-400'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      {!isBot && (
        <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
          <User size={12} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
