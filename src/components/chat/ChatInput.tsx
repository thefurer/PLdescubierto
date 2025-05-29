
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
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
          className="bg-ocean hover:bg-ocean-dark"
        >
          <Send size={16} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Presiona Enter para enviar
      </p>
    </div>
  );
};

export default ChatInput;
