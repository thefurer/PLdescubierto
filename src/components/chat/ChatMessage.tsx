
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

  return (
    <div
      className={`flex gap-2 ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {message.type === 'bot' && (
        <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[70%] p-3 rounded-lg text-sm ${
          message.type === 'user'
            ? 'bg-ocean text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${
          message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
