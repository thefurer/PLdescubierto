
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
            "p-2 rounded-full transition-all duration-300 group",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95",
            isScrolled 
              ? "bg-ocean text-white hover:bg-ocean-dark" 
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30",
            "focus:outline-none focus:ring-2 focus:ring-green-light focus:ring-opacity-50",
            "shadow-sm hover:shadow-md"
          )}
          aria-label="Customize"
          aria-expanded={isOpen}
        >
          <Settings 
            size={20} 
            className="transition-transform group-hover:rotate-45" 
          />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="bg-green-primary text-white rounded-md px-3 py-1"
      >
        Personalizar tema
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomizeThemeButton;
