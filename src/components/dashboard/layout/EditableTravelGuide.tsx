
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TravelPoint {
  id: string;
  name: string;
  description: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'transport';
  coordinates?: { lat: number; lng: number };
}

interface TransportOption {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

const EditableTravelGuide = () => {
  const { user } = useAuth();
  const [travelPoints, setTravelPoints] = useState<TravelPoint[]>([]);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [editingPoint, setEditingPoint] = useState<string | null>(null);
  const [editingTransport, setEditingTransport] = useState<string | null>(null);
  const [newPoint, setNewPoint] = useState<Partial<TravelPoint>>({});
  const [newTransport, setNewTransport] = useState<Partial<TransportOption>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTravelGuideData();
  }, []);

  const loadTravelGuideData = async () => {
    try {
      const { data: pointsData } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_name', 'travel_guide_points')
        .single();

      const { data: transportData } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_name', 'travel_guide_transport')
        .single();

      if (pointsData?.content && typeof pointsData.content === 'object' && pointsData.content !== null) {
        const content = pointsData.content as any;
        setTravelPoints(content.points || []);
      }
      if (transportData?.content && typeof transportData.content === 'object' && transportData.content !== null) {
        const content = transportData.content as any;
        setTransportOptions(content.options || []);
      }
    } catch (error) {
      console.error('Error loading travel guide data:', error);
    }
  };

  const saveTravelPoints = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await supabase
        .from('site_content')
        .upsert({
          section_name: 'travel_guide_points',
          content: { points: travelPoints },
          updated_by: user.id
        }, {
          onConflict: 'section_name'
        });

      toast.success('Puntos de interés guardados correctamente');
    } catch (error) {
      console.error('Error saving travel points:', error);
      toast.error('Error al guardar los puntos de interés');
    } finally {
      setLoading(false);
    }
  };

  const saveTransportOptions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await supabase
        .from('site_content')
        .upsert({
          section_name: 'travel_guide_transport',
          content: { options: transportOptions },
          updated_by: user.id
        }, {
          onConflict: 'section_name'
        });

      toast.success('Opciones de transporte guardadas correctamente');
    } catch (error) {
      console.error('Error saving transport options:', error);
      toast.error('Error al guardar las opciones de transporte');
    } finally {
      setLoading(false);
    }
  };

  const addTravelPoint = () => {
    if (!newPoint.name || !newPoint.description) return;

    const point: TravelPoint = {
      id: Date.now().toString(),
      name: newPoint.name,
      description: newPoint.description,
      category: newPoint.category || 'attraction'
    };

    setTravelPoints([...travelPoints, point]);
    setNewPoint({});
    saveTravelPoints();
  };

  const updateTravelPoint = (id: string, updates: Partial<TravelPoint>) => {
    setTravelPoints(travelPoints.map(point => 
      point.id === id ? { ...point, ...updates } : point
    ));
    setEditingPoint(null);
    saveTravelPoints();
  };

  const deleteTravelPoint = (id: string) => {
    setTravelPoints(travelPoints.filter(point => point.id !== id));
    saveTravelPoints();
  };

  const addTransportOption = () => {
    if (!newTransport.name || !newTransport.description) return;

    const transport: TransportOption = {
      id: Date.now().toString(),
      name: newTransport.name,
      description: newTransport.description,
      price: newTransport.price || '',
      duration: newTransport.duration || ''
    };

    setTransportOptions([...transportOptions, transport]);
    setNewTransport({});
    saveTransportOptions();
  };

  const updateTransportOption = (id: string, updates: Partial<TransportOption>) => {
    setTransportOptions(transportOptions.map(option => 
      option.id === id ? { ...option, ...updates } : option
    ));
    setEditingTransport(null);
    saveTransportOptions();
  };

  const deleteTransportOption = (id: string) => {
    setTransportOptions(transportOptions.filter(option => option.id !== id));
    saveTransportOptions();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'attraction': return 'bg-blue-100 text-blue-800';
      case 'restaurant': return 'bg-green-100 text-green-800';
      case 'hotel': return 'bg-purple-100 text-purple-800';
      case 'transport': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Debes iniciar sesión para editar la guía de viaje</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Puntos de Interés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Puntos de Interés
          </CardTitle>
          <CardDescription>
            Edita los puntos de interés de la guía de viaje
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {travelPoints.map((point) => (
            <div key={point.id} className="border rounded-lg p-4">
              {editingPoint === point.id ? (
                <div className="space-y-3">
                  <Input
                    value={point.name}
                    onChange={(e) => updateTravelPoint(point.id, { name: e.target.value })}
                    placeholder="Nombre del punto"
                  />
                  <Textarea
                    value={point.description}
                    onChange={(e) => updateTravelPoint(point.id, { description: e.target.value })}
                    placeholder="Descripción"
                  />
                  <select
                    value={point.category}
                    onChange={(e) => updateTravelPoint(point.id, { category: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="attraction">Atracción</option>
                    <option value="restaurant">Restaurante</option>
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transporte</option>
                  </select>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingPoint(null)}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingPoint(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{point.name}</h4>
                      <Badge className={getCategoryColor(point.category)}>
                        {point.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{point.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPoint(point.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTravelPoint(point.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
              <Input
                value={newPoint.name || ''}
                onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                placeholder="Nombre del nuevo punto"
              />
              <Textarea
                value={newPoint.description || ''}
                onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                placeholder="Descripción del punto"
              />
              <select
                value={newPoint.category || 'attraction'}
                onChange={(e) => setNewPoint({ ...newPoint, category: e.target.value as any })}
                className="w-full p-2 border rounded"
              >
                <option value="attraction">Atracción</option>
                <option value="restaurant">Restaurante</option>
                <option value="hotel">Hotel</option>
                <option value="transport">Transporte</option>
              </select>
              <Button onClick={addTravelPoint} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Punto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opciones de Transporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Opciones de Transporte
          </CardTitle>
          <CardDescription>
            Edita las opciones de transporte disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transportOptions.map((option) => (
            <div key={option.id} className="border rounded-lg p-4">
              {editingTransport === option.id ? (
                <div className="space-y-3">
                  <Input
                    value={option.name}
                    onChange={(e) => updateTransportOption(option.id, { name: e.target.value })}
                    placeholder="Nombre del transporte"
                  />
                  <Textarea
                    value={option.description}
                    onChange={(e) => updateTransportOption(option.id, { description: e.target.value })}
                    placeholder="Descripción"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={option.price}
                      onChange={(e) => updateTransportOption(option.id, { price: e.target.value })}
                      placeholder="Precio"
                    />
                    <Input
                      value={option.duration}
                      onChange={(e) => updateTransportOption(option.id, { duration: e.target.value })}
                      placeholder="Duración"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingTransport(null)}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingTransport(null)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{option.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex gap-4 text-sm">
                      {option.price && <span><strong>Precio:</strong> {option.price}</span>}
                      {option.duration && <span><strong>Duración:</strong> {option.duration}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTransport(option.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTransportOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="space-y-3">
              <Input
                value={newTransport.name || ''}
                onChange={(e) => setNewTransport({ ...newTransport, name: e.target.value })}
                placeholder="Nombre del transporte"
              />
              <Textarea
                value={newTransport.description || ''}
                onChange={(e) => setNewTransport({ ...newTransport, description: e.target.value })}
                placeholder="Descripción del transporte"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={newTransport.price || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, price: e.target.value })}
                  placeholder="Precio"
                />
                <Input
                  value={newTransport.duration || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, duration: e.target.value })}
                  placeholder="Duración"
                />
              </div>
              <Button onClick={addTransportOption} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Transporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableTravelGuide;
