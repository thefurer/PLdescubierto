
import { useState } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Category {
  value: string;
  label: string;
  color: string;
}

interface BlogEditorSidebarProps {
  category: string;
  image: string;
  isEditing: boolean;
  onCategoryChange: (value: string) => void;
  onImageChange: (image: string) => void;
  onImageFileChange: (file: File | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

const BlogEditorSidebar = ({ 
  category, 
  image, 
  isEditing,
  onCategoryChange, 
  onImageChange, 
  onImageFileChange,
  onSave, 
  onCancel 
}: BlogEditorSidebarProps) => {
  const categories: Category[] = [
    { value: 'noticias', label: 'Noticias', color: 'bg-blue-100 text-blue-800' },
    { value: 'eventos', label: 'Eventos', color: 'bg-green-100 text-green-800' },
    { value: 'conservacion', label: 'Conservación', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'turismo', label: 'Turismo', color: 'bg-purple-100 text-purple-800' },
    { value: 'cultura', label: 'Cultura', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageFileChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageChange('');
    onImageFileChange(null);
  };

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                  category === cat.value 
                    ? 'border-ocean bg-ocean/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Badge className={cat.color}>
                  {cat.label}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Imagen destacada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!image ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Arrastra una imagen o haz clic para seleccionar</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                Seleccionar imagen
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('imageInput')?.click()}
                className="absolute bottom-2 left-2 bg-white/90 hover:bg-white"
              >
                Cambiar
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Actions */}
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onSave}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Actualizar noticia' : 'Publicar noticia'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEditorSidebar;
