
import { Loader2, Sparkles } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-700">Cargando contenido...</p>
        <p className="text-sm text-gray-500">Preparando el editor para ti</p>
      </div>
    </div>
  );
};

export default LoadingState;
