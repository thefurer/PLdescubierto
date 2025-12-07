import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatInput = ({ inputValue, isLoading, onInputChange, onSend, onKeyPress }: ChatInputProps) => {
  return (
    <div className="relative p-3 bg-white/60 backdrop-blur-sm border-t border-white/60 rounded-b-3xl">
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Escribe a Ballenita..."
            disabled={isLoading}
            className="w-full bg-white/80 border-gray-200/60 focus:border-cyan-400 focus:ring-cyan-400/30 rounded-full pl-4 pr-10 py-2.5 text-sm placeholder:text-gray-400 transition-all duration-300 focus:bg-white shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-cyan-500 rounded-full"
              disabled
            >
              <Mic size={14} />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
          className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
        >
          <Send size={16} className={`text-white ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>
      
      {/* Powered by badge */}
      <div className="flex justify-center mt-2">
        <span className="text-[9px] text-gray-400">
          Impulsado por IA 🐋
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
