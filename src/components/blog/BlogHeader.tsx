
import { ArrowLeft, Plus, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface BlogHeaderProps {
  user: any;
  onCreatePost: () => void;
}

const BlogHeader = ({ user, onCreatePost }: BlogHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="glass-card hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Volver al inicio</span>
          <span className="sm:hidden">Volver</span>
        </Button>
      </div>
      
      {user ? (
        <Button 
          onClick={onCreatePost}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva publicación
        </Button>
      ) : (
        <Card className="p-3 bg-yellow-50 border-yellow-200 glass-card w-full sm:w-auto">
          <div className="flex items-center justify-center text-yellow-800 text-sm">
            <Lock className="h-4 w-4 mr-2" />
            <span>
              <Button 
                variant="link" 
                onClick={() => navigate('/auth')}
                className="p-0 h-auto text-yellow-800 underline text-sm"
              >
                Inicia sesión
              </Button>
              {' '}para crear publicaciones
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BlogHeader;
