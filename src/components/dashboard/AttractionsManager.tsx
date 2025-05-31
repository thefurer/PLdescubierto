
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTouristAttractions } from '@/hooks/useTouristAttractions';
import { Loader2, Save, Edit, MapPin, Image, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AttractionsManager = () => {
  const { attractions, loading, saving, updateAttraction } = useTouristAttractions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image_url: ''
  });

  const categoryLabels = {
    todo: "Todo",
    playa: "Playa",
    cultura: "Cultura", 
    naturaleza: "Naturaleza"
  };

  const handleEdit = (attraction: any) => {
    setEditingId(attraction.id);
    setFormData({
      name: attraction.name,
      description: attraction.description || '',
      category: attraction.category,
      image_url: attraction.image_url || ''
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    await updateAttraction(editingId, {
      name: formData.name,
      description: formData.description,
      category: formData.category as any,
      image_url: formData.image_url || null
    });
    
    setEditingId(null);
    setFormData({ name: '', description: '', category: '', image_url: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', category: '', image_url: '' });
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const groupedAttractions = attractions.reduce((acc, attraction) => {
    if (!acc[attraction.category]) {
      acc[attraction.category] = [];
    }
    acc[attraction.category].push(attraction);
    return acc;
  }, {} as Record<string, typeof attractions>);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Cargando atracciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <MapPin className="h-5 w-5 text-green-500" />
            Gestión de Atracciones Turísticas
          </CardTitle>
          <CardDescription className="text-green-700">
            Edita las 37 atracciones turísticas de Puerto López organizadas por categorías
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-green-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {attractions.length} atracciones disponibles
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Actualización en tiempo real
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {Object.entries(groupedAttractions).map(([category, categoryAttractions]) => (
          <Card key={category}>
            <Collapsible 
              open={openItems.has(category)} 
              onOpenChange={() => toggleItem(category)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {openItems.has(category) ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                        <CardTitle className="capitalize text-xl">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </CardTitle>
                      </div>
                      <Badge variant="outline">
                        {categoryAttractions.length} atracciones
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {categoryAttractions.map((attraction) => (
                      <Card key={attraction.id} className="border-l-4 border-l-blue-400">
                        <CardContent className="p-4">
                          {editingId === attraction.id ? (
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
                                  disabled={saving}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                  )}
                                  {saving ? 'Guardando...' : 'Guardar'}
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
                                  onClick={() => handleEdit(attraction)}
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
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AttractionsManager;
