
import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';
import QuickOptions from './QuickOptions';
import CompactQuickOptions from './CompactQuickOptions';

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
    <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl border z-40 flex flex-col">
      {/* Header */}
      <div className="bg-ocean text-white p-4 rounded-t-lg flex items-center gap-2">
        <Bot size={20} />
        <div>
          <h3 className="font-semibold">Asistente de Soporte</h3>
          <p className="text-xs opacity-90">Puerto López Descubierto</p>
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
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
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
