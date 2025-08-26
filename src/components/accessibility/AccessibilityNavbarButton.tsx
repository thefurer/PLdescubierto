import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import AccessibilityControls from './AccessibilityControls';

interface AccessibilityNavbarButtonProps {
  scrolled: boolean;
}

const AccessibilityNavbarButton = ({ scrolled }: AccessibilityNavbarButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { config } = useVisualConfig();

  return (
    <div className="relative">
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`
                p-2.5 rounded-full transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                hover:scale-105 active:scale-95
                ${scrolled 
                  ? 'bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }
              `}
              aria-label={isExpanded ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad'}
              aria-expanded={isExpanded}
            >
              <Eye 
                size={18} 
                className="transition-transform duration-300"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className="bg-slate-800 text-white rounded-lg px-3 py-2"
          >
            <p>Herramientas de accesibilidad</p>
            <p className="text-xs text-slate-300">Mejora tu experiencia de navegación</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Panel desplegable */}
      {isExpanded && (
        <Card className="absolute top-12 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-xl border-2 border-blue-200 min-w-[320px] animate-slide-down">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800">Herramientas de Accesibilidad</h3>
            </div>
            <AccessibilityControls compact />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessibilityNavbarButton;