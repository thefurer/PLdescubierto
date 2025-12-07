import WhaleAvatar from './WhaleAvatar';

const LoadingIndicator = () => {
  return (
    <div className="flex gap-2.5 justify-start animate-fade-in">
      <WhaleAvatar size="sm" animated={true} className="mt-1 shadow-md" />
      
      <div className="bg-white/80 border border-gray-100/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-gray-400 ml-1">Ballenita está pensando...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
