import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBlogReactions } from '@/hooks/useBlogReactions';
import { REACTION_EMOJIS, BlogReaction } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogReactionsProps {
  postId?: string;
  commentId?: string;
  compact?: boolean;
  className?: string;
  ariaLabel?: string;
}

const BlogReactions = ({ 
  postId, 
  commentId, 
  compact = false, 
  className,
  ariaLabel = "Reacciones"
}: BlogReactionsProps) => {
  const { 
    userReaction, 
    loading, 
    addReaction, 
    getReactionCounts 
  } = useBlogReactions(postId, commentId);

  const reactionCounts = getReactionCounts();

  const getReactionLabel = (type: BlogReaction['reaction_type']) => {
    const labels = {
      like: 'Me gusta',
      love: 'Me encanta',
      laugh: 'Me divierte',
      wow: 'Me sorprende',
      sad: 'Me entristece',
      angry: 'Me molesta'
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="flex space-x-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-8 bg-muted rounded-full animate-pulse"
              role="presentation"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div 
        className={cn("flex items-center flex-wrap gap-1", className)}
        role="group"
        aria-label={ariaLabel}
      >
        {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => {
          const reactionType = type as BlogReaction['reaction_type'];
          const count = reactionCounts[reactionType];
          const isActive = userReaction?.reaction_type === reactionType;
          const hasReactions = count > 0;

          // En modo compacto, solo mostrar reacciones con conteo > 0 o la reacción activa del usuario
          if (compact && !hasReactions && !isActive) {
            return null;
          }

          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size={compact ? "sm" : "default"}
                  onClick={() => addReaction(reactionType)}
                  className={cn(
                    "relative transition-all duration-200",
                    compact ? "h-8 px-2" : "h-10 px-3",
                    isActive && "bg-primary text-primary-foreground shadow-md",
                    !isActive && hasReactions && "bg-muted/50",
                    "hover:scale-110 active:scale-95",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                  aria-label={`${getReactionLabel(reactionType)}${hasReactions ? ` (${count})` : ''}`}
                  aria-pressed={isActive}
                >
                  <span 
                    className={cn(
                      "text-lg transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                    role="img"
                    aria-label={emoji}
                  >
                    {emoji}
                  </span>
                  {hasReactions && (
                    <span 
                      className={cn(
                        "ml-1 text-xs font-medium",
                        compact && count > 99 ? "text-[10px]" : ""
                      )}
                      aria-hidden="true"
                    >
                      {compact && count > 99 ? "99+" : count}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getReactionLabel(reactionType)}</p>
                {hasReactions && (
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'persona' : 'personas'}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default BlogReactions;