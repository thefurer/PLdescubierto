
import React from 'react';
import { Button } from '@/components/ui/button';

const SkipToContent = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <Button
      onClick={skipToMain}
      className="absolute top-2 left-2 z-50 bg-green-primary text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-light transform -translate-y-16 focus:translate-y-0 transition-transform"
      aria-label="Saltar al contenido principal"
    >
      Saltar al contenido principal
    </Button>
  );
};

export default SkipToContent;
