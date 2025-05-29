
import { Bot } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className="flex gap-2 justify-start">
      <div className="w-8 h-8 bg-ocean rounded-full flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
