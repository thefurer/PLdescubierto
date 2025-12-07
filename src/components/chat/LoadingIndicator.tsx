import WhaleAvatar from './WhaleAvatar';

const LoadingIndicator = () => {
  return (
    <div className="flex gap-2.5 justify-start animate-fade-in">
      {/* Swimming whale animation */}
      <div className="relative mt-1">
        <WhaleAvatar size="sm" animated={false} className="shadow-md animate-whale-swim" />
        {/* Bubbles */}
        <div className="absolute -right-1 top-1/2 flex flex-col gap-0.5">
          <span className="w-1 h-1 bg-cyan-300/60 rounded-full animate-bubble-1" />
          <span className="w-0.5 h-0.5 bg-cyan-300/40 rounded-full animate-bubble-2" />
          <span className="w-1.5 h-1.5 bg-cyan-300/50 rounded-full animate-bubble-3" />
        </div>
      </div>
      
      <div className="bg-white/80 border border-gray-100/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-gray-400 ml-1">Nadando hacia la respuesta...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
