
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Edit, Image } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';

interface AttractionCardProps {
  attraction: TouristAttraction;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TouristAttraction>) => void;
  onCancel: () => void;
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
  onEdit, 
  onSave, 
  onCancel 
}: AttractionCardProps) => {
  const [formData, setFormData] = useState({
    name: attraction.name,
    description: attraction.description || '',
    category: attraction.category,
    image_url: attraction.image_url || ''
  });

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
    onCancel();
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
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
            
            <div>
              <Label htmlFor="image_url" className="text-sm font-medium">URL de Imagen</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
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
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Image className="h-4 w-4" />
                    <span>Imagen personalizada configurada</span>
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
