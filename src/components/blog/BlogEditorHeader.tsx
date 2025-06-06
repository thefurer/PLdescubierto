
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogEditorHeaderProps {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const BlogEditorHeader = ({ isEditing, onCancel, onSave }: BlogEditorHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="mr-6 glass-card hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean-dark via-ocean to-green-primary bg-clip-text text-transparent">
            {isEditing ? 'Editar Noticia' : 'Nueva Noticia'}
          </h1>
          <p className="text-gray-600 mt-2">
            Comparte noticias e historias sobre Puerto López
          </p>
        </div>
      </div>
      
      <Button 
        onClick={onSave}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Save className="h-4 w-4 mr-2" />
        {isEditing ? 'Actualizar' : 'Publicar'}
      </Button>
    </div>
  );
};

export default BlogEditorHeader;
