import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

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
  const t = useTranslations();

  if (compact) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-2"
      aria-expanded={isExpanded}
      aria-controls="accessibility-options"
      aria-label={isExpanded ? t.accessibilityHideOptions : t.accessibilityShowOptions}
    >
      <div className="flex items-center">
        <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
        <span>{t.accessibility}</span>
      </div>
      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>
  );
};

export default AccessibilityButton;
