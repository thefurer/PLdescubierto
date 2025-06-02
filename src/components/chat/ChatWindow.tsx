
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
      fixed z-40 bg-white rounded-lg shadow-xl border flex flex-col
      ${isMobile 
        ? 'bottom-20 left-2 right-2 h-[70vh] max-h-[500px]'
        : 'bottom-20 right-4 sm:bottom-24 sm:right-6 w-80 sm:w-96 h-[500px] sm:h-[600px]'
      }
    `}>
      {/* Header */}
      <div className="bg-ocean text-white p-3 sm:p-4 rounded-t-lg flex items-center gap-2">
        <Bot size={18} className="sm:w-5 sm:h-5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">Asistente de Soporte</h3>
          <p className="text-xs opacity-90 truncate">Puerto López Descubierto</p>
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
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
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
