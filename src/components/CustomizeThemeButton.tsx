
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomizeThemeButtonProps {
  isScrolled: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const CustomizeThemeButton = ({ isScrolled, isOpen, onClick }: CustomizeThemeButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "p-3 rounded-full smooth-transition group relative",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95",
            isScrolled 
              ? "bg-green-primary text-white hover:bg-green-dark shadow-lg hover:shadow-xl" 
              : "glass-card text-white hover:bg-white/30",
            "focus:outline-none focus:ring-2 focus:ring-green-light focus:ring-opacity-50"
          )}
          aria-label="Customize"
          aria-expanded={isOpen}
        >
          <Settings 
            size={20} 
            className="smooth-transition group-hover:rotate-45" 
          />
          {/* Pulse indicator when active */}
          {isOpen && (
            <div className="absolute inset-0 rounded-full bg-green-primary/20 animate-ping"></div>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="glass-card text-white rounded-lg px-3 py-2 border-green-light/20"
      >
        Personalizar tema
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomizeThemeButton;
