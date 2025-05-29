
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
    // Convert markdown-style formatting to HTML
    let formatted = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Bullet points
      .replace(/^• (.*$)/gim, '<div class="flex items-start gap-2 my-1"><span class="text-ocean">•</span><span>$1</span></div>')
      // Numbered lists
      .replace(/^(\d+)\. (.*$)/gim, '<div class="flex items-start gap-2 my-1"><span class="text-ocean font-semibold">$1.</span><span>$2</span></div>')
      // Line breaks
      .replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div
      className={`flex gap-3 ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'bot' && (
        <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[75%] p-4 rounded-lg text-sm leading-relaxed ${
          message.type === 'user'
            ? 'bg-ocean text-white rounded-br-none'
            : 'bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100'
        }`}
      >
        {message.type === 'bot' ? (
          <div 
            className="whitespace-pre-wrap space-y-2"
            dangerouslySetInnerHTML={{ 
              __html: formatMessageContent(message.content) 
            }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        <p className={`text-xs mt-3 ${
          message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
