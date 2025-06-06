
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BlogEmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
  user: any;
  onCreatePost: () => void;
}

const BlogEmptyState = ({ searchTerm, selectedCategory, user, onCreatePost }: BlogEmptyStateProps) => {
  return (
    <Card className="text-center p-12 glass-card border-0 shadow-lg">
      <CardContent>
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600">
            No se encontraron noticias
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : user 
                ? 'Sé el primero en compartir una noticia sobre Puerto López'
                : 'Inicia sesión para ver y crear publicaciones'
            }
          </p>
          {user && !searchTerm && selectedCategory === 'all' && (
            <Button 
              onClick={onCreatePost}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear primera noticia
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogEmptyState;
