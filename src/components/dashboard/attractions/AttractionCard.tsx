
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit2, Save, X, Upload, Link, Trash2, Plus } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';

interface AttractionCardProps {
  attraction: TouristAttraction;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TouristAttraction>) => void;
  onCancel: () => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa",
  cultura: "Cultura", 
  naturaleza: "Naturaleza"
};

const AttractionCard = ({ 
  attraction, 
  isEditing, 
  isSaving,
  isUploading,
  onEdit, 
  onSave, 
  onCancel,
  onUploadImage
}: AttractionCardProps) => {
  const [formData, setFormData] = useState({
    name: attraction.name,
    description: attraction.description || '',
    category: attraction.category,
    image_url: attraction.image_url || ''
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageManager, setShowImageManager] = useState(false);

  const handleSave = () => {
    onSave(formData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await onUploadImage(file, attraction.id);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setShowImageManager(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({ ...prev, image_url: imageUrlInput.trim() }));
      setImageUrlInput('');
      setShowImageManager(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setShowImageManager(false);
  };

  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nombre
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre de la atracción"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Descripción
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción de la atracción"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categoría
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  category: value as 'todo' | 'playa' | 'cultura' | 'naturaleza'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playa">Playa</SelectItem>
                  <SelectItem value="cultura">Cultura</SelectItem>
                  <SelectItem value="naturaleza">Naturaleza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gestión de Imagen */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Imagen
              </label>
              
              {formData.image_url && (
                <div className="mb-3">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageManager(!showImageManager)}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {formData.image_url ? 'Cambiar Imagen' : 'Agregar Imagen'}
                </Button>
                
                {formData.image_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {showImageManager && (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Subir archivo local
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="text-sm"
                    />
                    {isUploading && (
                      <p className="text-xs text-blue-600 mt-1">Subiendo imagen...</p>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      URL de imagen
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleUrlSubmit}
                        disabled={!imageUrlInput.trim()}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isSaving}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{attraction.name}</h3>
              <Badge variant="outline" className="text-xs">
                {categoryLabels[attraction.category as keyof typeof categoryLabels]}
              </Badge>
            </div>
            {attraction.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{attraction.description}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>

        {attraction.image_url && (
          <div className="mt-3">
            <img 
              src={attraction.image_url} 
              alt={attraction.name}
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Última actualización: {new Date(attraction.updated_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttractionCard;
