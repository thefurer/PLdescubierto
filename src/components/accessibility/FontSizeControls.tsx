
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface FontSizeControlsProps {
  compact?: boolean;
}

const FontSizeControls = ({ compact = false }: FontSizeControlsProps) => {
  const { settings, increaseFontSize, decreaseFontSize } = useAccessibility();

  const getFontSizeLabel = () => {
    const labels = {
      small: 'S',
      medium: 'M',
      large: 'L',
      'extra-large': 'XL'
    };
    return labels[settings.fontSize];
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={decreaseFontSize}
          className="h-6 w-6 p-0"
          aria-label="Disminuir tamaño de fuente"
          disabled={settings.fontSize === 'small'}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Badge variant="secondary" className="h-6 min-w-[24px] text-xs">
          {getFontSizeLabel()}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={increaseFontSize}
          className="h-6 w-6 p-0"
          aria-label="Aumentar tamaño de fuente"
          disabled={settings.fontSize === 'extra-large'}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tamaño de fuente</label>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={decreaseFontSize}
          aria-label="Disminuir tamaño de fuente"
          disabled={settings.fontSize === 'small'}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Badge variant="secondary" className="mx-2">
          {getFontSizeLabel()}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={increaseFontSize}
          aria-label="Aumentar tamaño de fuente"
          disabled={settings.fontSize === 'extra-large'}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FontSizeControls;
