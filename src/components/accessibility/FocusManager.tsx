
import React, { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface FocusManagerProps {
  children: React.ReactNode;
}

const FocusManager: React.FC<FocusManagerProps> = ({ children }) => {
  const { settings } = useAccessibility();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Navegación con teclado mejorada
      if (event.key === 'Tab') {
        // Asegurar que el foco sea visible
        if (settings.focusIndicators) {
          document.body.classList.add('keyboard-navigation');
        }
      }

      // Escape para cerrar modales/menús
      if (event.key === 'Escape') {
        const openDialogs = document.querySelectorAll('[role="dialog"]');
        const openMenus = document.querySelectorAll('[role="menu"][aria-expanded="true"]');
        
        if (openDialogs.length > 0) {
          const lastDialog = openDialogs[openDialogs.length - 1] as HTMLElement;
          const closeButton = lastDialog.querySelector('[aria-label*="cerrar"], [aria-label*="close"]') as HTMLElement;
          closeButton?.click();
        } else if (openMenus.length > 0) {
          const lastMenu = openMenus[openMenus.length - 1] as HTMLElement;
          const trigger = document.querySelector(`[aria-controls="${lastMenu.id}"]`) as HTMLElement;
          trigger?.click();
        }
      }
    };

    const handleMousedown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    };
  }, [settings.focusIndicators]);

  return <>{children}</>;
};

export default FocusManager;
