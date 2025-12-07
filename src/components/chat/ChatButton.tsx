import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WhaleAvatar from './WhaleAvatar';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ChatButton = ({ isOpen, onClick }: ChatButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Ripple effects */}
      {!isOpen && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse opacity-30" style={{ animationDelay: '0.5s' }} />
        </>
      )}
      
      <Button
        onClick={onClick}
        className={`
          relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl
          transition-all duration-500 ease-out
          hover:scale-110 active:scale-95
          ${isOpen 
            ? 'bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 rotate-90' 
            : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700'
          }
          focus:outline-none focus:ring-4 focus:ring-cyan-300/50
          overflow-hidden
        `}
        size="icon"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con Ballenita"}
      >
        {isOpen ? (
          <X size={24} className="text-white transition-transform duration-300" />
        ) : (
          <WhaleAvatar size="md" animated={false} className="bg-transparent" />
        )}
        
        {/* Shimmer effect */}
        {!isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        )}
      </Button>
      
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm">
          ¡Hola! Soy Ballenita 🐋
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900/90" />
        </div>
      )}
    </div>
  );
};

export default ChatButton;
