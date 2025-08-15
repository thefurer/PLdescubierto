import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { useBlogReactions } from '@/hooks/useBlogReactions';
import { useBlogComments } from '@/hooks/useBlogComments';
import BlogReactions from './BlogReactions';

interface BlogPostCardProps {
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
  isPreview?: boolean;
}

const BlogPostCard = ({ post, onReadMore, isPreview = false }: BlogPostCardProps) => {
  const { getTotalReactions } = useBlogReactions(post.id);
  const { comments } = useBlogComments(post.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const categoryColorMap: Record<string, string> = {
    'vida-marina': 'bg-blue-100 text-blue-800 border-blue-200',
    'actividades': 'bg-green-100 text-green-800 border-green-200',
    'gastronomia': 'bg-orange-100 text-orange-800 border-orange-200',
    'naturaleza': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'fotografia': 'bg-purple-100 text-purple-800 border-purple-200',
    'cultura': 'bg-pink-100 text-pink-800 border-pink-200',
    'noticias': 'bg-red-100 text-red-800 border-red-200',
    'consejos': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'general': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <article className="group">
      <Card 
        className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        role="article"
        aria-labelledby={`post-title-${post.id}`}
      >
        {post.image_url && (
          <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
            <img 
              src={post.image_url} 
              alt={`Imagen del artículo: ${post.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="outline" 
              className={`text-sm font-medium ${categoryColorMap[post.category] || categoryColorMap.general}`}
            >
              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            {post.is_featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Destacado
              </Badge>
            )}
          </div>
          
          <CardTitle 
            id={`post-title-${post.id}`}
            className="line-clamp-2 group-hover:text-primary transition-colors text-lg font-bold leading-tight"
          >
            {post.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {post.excerpt || truncateContent(post.content)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Metadatos del post */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center" aria-label="Autor">
                <User className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>{post.author?.full_name || 'Autor'}</span>
              </div>
              <div className="flex items-center" aria-label="Fecha de publicación">
                <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
              </div>
            </div>
          </div>

          {/* Estadísticas de interacción */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center" aria-label={`${post.view_count} visualizaciones`}>
                <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>{post.view_count}</span>
              </div>
              <div className="flex items-center" aria-label={`${getTotalReactions()} reacciones`}>
                <Heart className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>{getTotalReactions()}</span>
              </div>
              <div className="flex items-center" aria-label={`${comments.length} comentarios`}>
                <MessageCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                <span>{comments.length}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadMore(post)}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={`Leer más sobre ${post.title}`}
            >
              Leer más
            </Button>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Etiquetas del artículo">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors"
                  role="listitem"
                >
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/50">
                  +{post.tags.length - 3} más
                </Badge>
              )}
            </div>
          )}

          {/* Reacciones rápidas si no es preview */}
          {!isPreview && (
            <div className="pt-2 border-t">
              <BlogReactions 
                postId={post.id}
                compact={true}
                ariaLabel={`Reacciones para el artículo ${post.title}`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </article>
  );
};

export default BlogPostCard;