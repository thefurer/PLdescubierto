import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';
interface AccessibilityButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}
const AccessibilityButton = ({
  isExpanded,
  onToggle,
  compact = false
}: AccessibilityButtonProps) => {
  if (compact) {
    return <Button variant="ghost" size="sm" onClick={onToggle} aria-expanded={isExpanded} aria-controls="accessibility-options" aria-label={isExpanded ? 'Ocultar opciones de accesibilidad' : 'Mostrar opciones de accesibilidad'} className="bg-slate-300 hover:bg-slate-200">
        <Settings className={`h-4 w-4 ${isExpanded ? "text-ocean" : "text-gray-700 hover:text-ocean"}`} aria-hidden="true" />
        <span className={`text-sm font-medium ${isExpanded ? "text-ocean" : "text-gray-700"}`}>Accesibilidad</span>
      </Button>;
  }
  return <Button variant="outline" size="sm" onClick={onToggle} className="w-full flex items-center justify-between mb-2" aria-expanded={isExpanded} aria-controls="accessibility-options" aria-label={isExpanded ? 'Ocultar opciones de accesibilidad' : 'Mostrar opciones de accesibilidad'}>
      <div className="flex items-center">
        <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
        <span>Accesibilidad</span>
      </div>
      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>;
};
export default AccessibilityButton;