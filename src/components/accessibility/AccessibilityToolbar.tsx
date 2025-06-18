
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AccessibilityButton from './AccessibilityButton';
import AccessibilityControls from './AccessibilityControls';

interface AccessibilityToolbarProps {
  compact?: boolean;
}

const AccessibilityToolbar = ({ compact = false }: AccessibilityToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (compact) {
    return (
      <div className="relative" role="toolbar" aria-label="Herramientas de accesibilidad">
        <AccessibilityButton
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
          compact
        />

        {isExpanded && (
          <Card className="absolute top-10 left-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-green-primary min-w-[300px]">
            <CardContent className="p-3">
              <AccessibilityControls compact />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Version original para pantallas grandes o usos específicos
  return (
    <div className="fixed top-20 right-4 z-50" role="toolbar" aria-label="Herramientas de accesibilidad">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-green-primary">
        <CardContent className="p-3">
          <AccessibilityButton
            isExpanded={isExpanded}
            onToggle={toggleExpanded}
          />

          {isExpanded && (
            <AccessibilityControls />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityToolbar;
