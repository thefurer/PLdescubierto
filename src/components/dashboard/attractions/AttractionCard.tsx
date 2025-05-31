
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Edit, Image, Upload } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import { useToast } from '@/hooks/use-toast';

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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const { toast } = useToast();

  const handleSave = () => {
    onSave({
      name: formData.name,
      description: formData.description,
      category: formData.category as any,
      image_url: formData.image_url || null
    });
  };

  const handleCancel = () => {
    setFormData({
      name: attraction.name,
      description: attraction.description || '',
      category: attraction.category,
      image_url: attraction.image_url || ''
    });
    setUploadMethod('url');
    onCancel();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'El archivo es demasiado grande. Máximo 5MB.',
          variant: 'destructive'
        });
        return;
      }

      try {
        const imageUrl = await onUploadImage(file, attraction.id);
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: 'Éxito',
          description: 'Imagen subida correctamente',
        });
      } catch (error) {
        // Error handling is done in the upload function
      }
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-medium">Categoría</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    category: value as 'todo' | 'playa' | 'cultura' | 'naturaleza'
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="playa">Playa</SelectItem>
                    <SelectItem value="cultura">Cultura</SelectItem>
                    <SelectItem value="naturaleza">Naturaleza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Imagen de la Atracción</Label>
              
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={uploadMethod === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMethod('url')}
                >
                  URL
                </Button>
                <Button
                  type="button"
                  variant={uploadMethod === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMethod('file')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Archivo
                </Button>
              </div>

              {uploadMethod === 'url' ? (
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subiendo imagen...
                    </div>
                  )}
                </div>
              )}

              {formData.image_url && (
                <div className="mt-3">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                    <img
                      src={formData.image_url}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving || isUploading}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg">{attraction.name}</h4>
                  <Badge variant="secondary" className="capitalize">
                    {categoryLabels[attraction.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                
                {attraction.image_url && (
                  <div className="space-y-2">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                      <img
                        src={attraction.image_url}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={onEdit}
                size="sm"
                className="ml-4"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttractionCard;
