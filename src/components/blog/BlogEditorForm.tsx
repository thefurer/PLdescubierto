
import { Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from './RichTextEditor';

interface BlogEditorFormProps {
  title: string;
  excerpt: string;
  content: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

const BlogEditorForm = ({ 
  title, 
  excerpt, 
  content, 
  onTitleChange, 
  onExcerptChange, 
  onContentChange 
}: BlogEditorFormProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-ocean" />
          Contenido Principal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-base font-semibold">Título *</Label>
          <Input
            id="title"
            placeholder="Escribe un título atractivo para tu noticia..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="mt-2 text-lg"
          />
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt" className="text-base font-semibold">Resumen</Label>
          <Input
            id="excerpt"
            placeholder="Un breve resumen de la noticia (opcional)"
            value={excerpt}
            onChange={(e) => onExcerptChange(e.target.value)}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Si no se proporciona, se generará automáticamente desde el contenido
          </p>
        </div>

        {/* Rich Text Editor */}
        <div>
          <Label className="text-base font-semibold">Contenido *</Label>
          <div className="mt-2">
            <RichTextEditor
              value={content}
              onChange={onContentChange}
              placeholder="Escribe el contenido de tu noticia aquí... Usa la barra de herramientas para formatear el texto."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogEditorForm;
