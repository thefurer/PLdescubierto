import { cn } from '@/lib/utils';

interface WhaleAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const WhaleAvatar = ({ size = 'md', animated = true, className }: WhaleAvatarProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div 
      className={cn(
        'relative flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
        sizeClasses[size],
        animated && 'animate-whale-float',
        className
      )}
    >
      {/* Whale SVG */}
      <svg 
        viewBox="0 0 64 64" 
        className={cn(
          'text-white drop-shadow-lg',
          size === 'sm' && 'w-4 h-4',
          size === 'md' && 'w-6 h-6',
          size === 'lg' && 'w-9 h-9',
          size === 'xl' && 'w-14 h-14'
        )}
        fill="currentColor"
      >
        {/* Whale body */}
        <ellipse cx="32" cy="32" rx="20" ry="14" fill="currentColor" />
        {/* Tail */}
        <path d="M12 32 C8 28, 4 24, 2 28 C0 32, 4 36, 8 38 C4 40, 0 44, 2 48 C4 52, 8 48, 12 44 C10 40, 10 36, 12 32Z" fill="currentColor" />
        {/* Belly */}
        <ellipse cx="36" cy="36" rx="14" ry="8" fill="rgba(255,255,255,0.3)" />
        {/* Eye */}
        <circle cx="44" cy="28" r="3" fill="#1a1a2e" />
        <circle cx="45" cy="27" r="1" fill="white" />
        {/* Smile */}
        <path d="M46 34 Q50 38, 52 36" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Water spout */}
        <path d="M38 18 Q40 12, 38 8 M42 16 Q44 10, 42 6 M46 18 Q48 12, 46 8" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Fin */}
        <ellipse cx="30" cy="24" rx="6" ry="4" fill="currentColor" transform="rotate(-20 30 24)" />
      </svg>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/50 to-transparent blur-sm -z-10" />
    </div>
  );
};

export default WhaleAvatar;
