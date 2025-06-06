
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  author: string;
  date: string;
  excerpt: string;
  category: string;
}

interface Category {
  value: string;
  label: string;
  color: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  categories: Category[];
  user: any;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
}

const BlogPostCard = ({ post, categories, user, onEdit, onDelete }: BlogPostCardProps) => {
  const categoryInfo = categories.find(cat => cat.value === post.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br>');
  };

  return (
    <Card className="glass-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
      <CardHeader>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Badge className={categoryInfo?.color}>
                {categoryInfo?.label}
              </Badge>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(post.date)}
              </div>
            </div>
            <CardTitle className="text-xl text-ocean-dark mb-3 leading-tight">
              {post.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base leading-relaxed">
              {post.excerpt}
            </CardDescription>
          </div>
          
          {user && (
            <div className="flex space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post)}
                className="glass-card"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="glass-card hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-1" />
          {post.author}
        </div>
      </CardHeader>
      
      <CardContent>
        {post.image && (
          <div className="mb-6">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: renderContent(post.content.length > 300 
                ? `${post.content.substring(0, 300)}...` 
                : post.content
              )
            }}
            className="text-gray-700 leading-relaxed"
          />
        </div>
        
        <Button 
          variant="link" 
          className="p-0 mt-4 text-ocean hover:text-ocean-dark font-semibold"
        >
          Leer artículo completo →
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
