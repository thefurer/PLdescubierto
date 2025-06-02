
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
      className={`
        fixed bottom-4 right-4 z-50 
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        animate-bounce hover:animate-none
        ${isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-ocean hover:bg-ocean-dark'
        }
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${isOpen ? 'focus:ring-red-300' : 'focus:ring-ocean-light'}
      `}
      size="icon"
      aria-label={isOpen ? "Cerrar chat" : "Abrir chat de soporte"}
    >
      {isOpen ? (
        <X size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      ) : (
        <MessageCircle size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      )}
      
      {/* Pulse indicator when closed */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-ocean/30 animate-ping"></div>
      )}
    </Button>
  );
};

export default ChatButton;
