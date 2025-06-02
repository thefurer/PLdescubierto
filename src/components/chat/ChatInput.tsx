
import { Send } from 'lucide-react';
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
    <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="flex-1 bg-white border-gray-200 focus:border-ocean focus:ring-ocean/20 rounded-lg text-sm"
        />
        <Button
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
          className="bg-gradient-to-r from-ocean to-ocean-dark hover:from-ocean-dark hover:to-ocean rounded-lg w-9 h-9 shadow-md"
        >
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
