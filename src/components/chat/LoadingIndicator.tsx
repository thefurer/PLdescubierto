
import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex gap-2 justify-start">
      <div className="w-6 h-6 bg-gradient-to-br from-ocean to-ocean-dark rounded-full flex items-center justify-center flex-shrink-0">
        <Bot size={12} className="text-white" />
      </div>
      <div className="bg-gray-50 px-3 py-2 rounded-xl rounded-bl-md border border-gray-100 shadow-sm">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
