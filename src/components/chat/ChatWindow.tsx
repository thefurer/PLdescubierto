
import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';
import QuickOptions from './QuickOptions';
import CompactQuickOptions from './CompactQuickOptions';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onQuickOption: (message: string) => void;
}

const ChatWindow = ({ 
  messages, 
  isLoading, 
  inputValue, 
  onInputChange, 
  onSend, 
  onKeyPress,
  onQuickOption
}: ChatWindowProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const showFullOptions = messages.length <= 1;
  const showCompactOptions = messages.length > 1;

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`
      fixed z-40 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 flex flex-col
      ${isMobile 
        ? 'bottom-20 left-3 right-3 h-[75vh] max-h-[550px]'
        : 'bottom-20 right-4 sm:bottom-24 sm:right-6 w-80 sm:w-[22rem] h-[520px] sm:h-[580px]'
      }
    `}>
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean to-ocean-dark text-white p-3 rounded-t-xl flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">Asistente Puerto López</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs opacity-90">En línea</p>
          </div>
        </div>
      </div>

      {/* Compact Quick Options - Show after first interaction */}
      {showCompactOptions && (
        <CompactQuickOptions onOptionClick={onQuickOption} />
      )}

      {/* Full Quick Options - Show only at the beginning */}
      {showFullOptions && (
        <QuickOptions onOptionClick={onQuickOption} />
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingIndicator />}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        inputValue={inputValue}
        isLoading={isLoading}
        onInputChange={onInputChange}
        onSend={onSend}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default ChatWindow;
