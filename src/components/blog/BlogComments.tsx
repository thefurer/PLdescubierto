import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Reply, Flag, Calendar, AlertTriangle } from 'lucide-react';
import { useBlogComments } from '@/hooks/useBlogComments';
import { useAuth } from '@/hooks/useAuthContext';
import { BlogComment } from '@/types/blog';
import BlogReactions from './BlogReactions';
import { cn } from '@/lib/utils';

interface BlogCommentsProps {
  postId: string;
  className?: string;
}

const BlogComments = ({ postId, className }: BlogCommentsProps) => {
  const { comments, loading, submitting, addComment, reportComment } = useBlogComments(postId);
  const { user } = useAuth();
  
  const [newComment, setNewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [reportingComment, setReportingComment] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      return;
    }

    const result = await addComment(
      newComment.trim(),
      user ? undefined : guestName.trim(),
      user ? undefined : guestEmail.trim()
    );

    if (result) {
      setNewComment('');
      setGuestName('');
      setGuestEmail('');
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    const result = await addComment(
      replyContent.trim(),
      user ? undefined : guestName.trim(),
      user ? undefined : guestEmail.trim(),
      parentId
    );

    if (result) {
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleReport = async (commentId: string) => {
    if (!reportReason.trim()) return;

    await reportComment(commentId, reportReason.trim());
    setReportingComment(null);
    setReportReason('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: BlogComment; isReply?: boolean }) => (
    <div 
      className={cn(
        "space-y-3",
        isReply && "ml-8 pl-4 border-l-2 border-muted"
      )}
      role="article"
      aria-labelledby={`comment-${comment.id}`}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {getInitials(comment.author_name || 'Usuario')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 
              id={`comment-${comment.id}`}
              className="text-sm font-medium text-foreground"
            >
              {comment.author_name || 'Usuario'}
            </h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
              <time dateTime={comment.created_at}>
                {formatDate(comment.created_at)}
              </time>
            </div>
          </div>
          
          <div 
            className="text-sm text-foreground leading-relaxed mb-3"
            style={{ wordBreak: 'break-word' }}
          >
            {comment.content}
          </div>

          {/* Reacciones del comentario */}
          <div className="flex items-center justify-between">
            <BlogReactions 
              commentId={comment.id}
              compact={true}
              ariaLabel={`Reacciones para el comentario de ${comment.author_name}`}
            />
            
            <div className="flex items-center space-x-2">
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment.id)}
                  className="h-7 px-2 text-xs"
                  aria-label={`Responder al comentario de ${comment.author_name}`}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Responder
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReportingComment(comment.id)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                aria-label={`Reportar comentario de ${comment.author_name}`}
              >
                <Flag className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Formulario de respuesta */}
          {replyingTo === comment.id && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user ? getInitials(user.email || 'U') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder={`Responder a ${comment.author_name}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                    aria-label={`Respuesta a ${comment.author_name}`}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim() || submitting}
                    >
                      {submitting ? 'Enviando...' : 'Responder'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Respuestas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de reporte */}
      {reportingComment === comment.id && (
        <Alert className="mt-4 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium text-orange-800">
                Reportar este comentario
              </p>
              <Textarea
                placeholder="Describe por qué consideras que este comentario es inapropiado..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="bg-white"
                aria-label="Razón del reporte"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReportingComment(null);
                    setReportReason('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReport(comment.id)}
                  disabled={!reportReason.trim()}
                >
                  Reportar
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Cargando comentarios...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Comentarios ({comments.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Formulario para nuevo comentario */}
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user ? getInitials(user.email || 'U') : 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                  aria-label="Nuevo comentario"
                  required
                />
                
                {/* Campos para usuarios invitados */}
                {!user && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="guest-name" className="sr-only">
                        Nombre
                      </Label>
                      <Input
                        id="guest-name"
                        placeholder="Tu nombre"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        aria-label="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guest-email" className="sr-only">
                        Email
                      </Label>
                      <Input
                        id="guest-email"
                        type="email"
                        placeholder="Tu email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        aria-label="Tu email"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Los comentarios son moderados automáticamente
                  </p>
                  <Button 
                    type="submit" 
                    disabled={!newComment.trim() || submitting || (!user && (!guestName.trim() || !guestEmail.trim()))}
                  >
                    {submitting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Lista de comentarios */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Sé el primero en comentar este artículo</p>
            </div>
          ) : (
            <div className="space-y-6" role="list" aria-label="Lista de comentarios">
              {comments.map((comment) => (
                <div key={comment.id} role="listitem">
                  <CommentItem comment={comment} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogComments;