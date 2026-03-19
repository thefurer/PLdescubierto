import { useRef, useEffect } from 'react';
import { Trash2, Waves, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';
import ChatInput from './ChatInput';
import NavigationGuide from './NavigationGuide';
import WhaleAvatar from './WhaleAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslations } from '@/hooks/useTranslations';

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
  onClearConversation: () => void;
}

const ChatWindow = ({ 
  messages, isLoading, inputValue, onInputChange, onSend, onKeyPress, onQuickOption, onClearConversation
}: ChatWindowProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const showFullOptions = messages.length <= 1;
  const t = useTranslations();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  const handleNavigate = (section: string, message: string) => {
    if (section) {
      const element = document.getElementById(section);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    onQuickOption(message);
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  return (
    <div className={`
      fixed z-40 flex flex-col overflow-hidden
      ${isMobile ? 'bottom-20 left-3 right-3 h-[65vh] max-h-[500px]' : 'bottom-24 right-4 w-[360px] h-[520px]'}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-cyan-50/90 to-blue-50/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-cyan-500/20" />
      
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-indigo-300/20 to-purple-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex flex-col h-full">
        <div className="relative p-4 flex items-center gap-3">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
          <WhaleAvatar size="lg" animated={false} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 text-lg">Ballenita</h3>
              <Sparkles size={14} className="text-yellow-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <Waves size={12} className="text-cyan-500 animate-pulse" />
              <p className="text-xs text-cyan-600 font-medium">{t.chatYourGuide}</p>
            </div>
          </div>
          
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearConversation}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 h-9 w-9 rounded-full transition-colors"
              aria-label={t.chatClearConversation}
              title={t.chatClearConversation}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>

        <div className="relative border-y border-white/60 bg-gradient-to-b from-cyan-50/50 to-transparent">
          <NavigationGuide onNavigate={handleNavigate} variant={showFullOptions ? 'full' : 'compact'} />
        </div>

        <ScrollArea ref={scrollAreaRef} className="flex-1 px-3">
          <div className="space-y-3 py-3">
            {messages.map((message) => (<ChatMessage key={message.id} message={message} />))}
            {isLoading && <LoadingIndicator />}
          </div>
        </ScrollArea>

        <ChatInput inputValue={inputValue} isLoading={isLoading} onInputChange={onInputChange} onSend={onSend} onKeyPress={onKeyPress} />
      </div>
    </div>
  );
};

export default ChatWindow;
