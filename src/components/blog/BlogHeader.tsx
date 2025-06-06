
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
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mr-6 glass-card hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-ocean-dark via-ocean to-green-primary bg-clip-text text-transparent">
            Noticias
          </h1>
          <p className="text-xl text-gray-600 mt-2">Últimas noticias y eventos de Puerto López</p>
        </div>
      </div>
      
      {user ? (
        <Button 
          onClick={onCreatePost}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva noticia
        </Button>
      ) : (
        <Card className="p-4 bg-yellow-50 border-yellow-200 glass-card">
          <div className="flex items-center text-yellow-800">
            <Lock className="h-5 w-5 mr-2" />
            <span className="text-sm">
              <Button 
                variant="link" 
                onClick={() => navigate('/auth')}
                className="p-0 h-auto text-yellow-800 underline"
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
