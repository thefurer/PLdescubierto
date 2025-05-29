
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 transition-all duration-300 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-ocean hover:bg-ocean-dark'
      }`}
      size="icon"
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </Button>
  );
};

export default ChatButton;
