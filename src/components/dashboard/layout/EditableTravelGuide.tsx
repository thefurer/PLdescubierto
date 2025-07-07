
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Plus, Trash2, Edit2, Save, X, Star, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TravelPoint {
  id: string;
  name: string;
  description: string;
  category: 'tours' | 'playas' | 'cultura' | 'aventura';
  rating: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Muy Fácil';
  duration: string;
  price: string;
  bestTime: string;
  highlights: string[];
  image: string;
  coordinates?: { lat: number; lng: number };
}

interface TransportOption {
  id: string;
  name: string;
  description: string;
  totalTime: string;
  price: string;
  pros: string[];
  icon: string;
  details: string;
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
        if (content.points && Array.isArray(content.points)) {
          setTravelPoints(content.points);
        }
      }
      if (transportData?.content && typeof transportData.content === 'object' && transportData.content !== null) {
        const content = transportData.content as any;
        if (content.options && Array.isArray(content.options)) {
          setTransportOptions(content.options);
        }
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
          content: { points: travelPoints } as any,
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
          content: { options: transportOptions } as any,
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
      category: newPoint.category || 'tours',
      rating: newPoint.rating || 4.5,
      difficulty: newPoint.difficulty || 'Fácil',
      duration: newPoint.duration || '',
      price: newPoint.price || '',
      bestTime: newPoint.bestTime || '',
      highlights: newPoint.highlights || [],
      image: newPoint.image || '',
      coordinates: newPoint.coordinates
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
      totalTime: newTransport.totalTime || '',
      price: newTransport.price || '',
      pros: newTransport.pros || [],
      icon: newTransport.icon || '',
      details: newTransport.details || ''
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
      case 'tours': return 'bg-blue-100 text-blue-800';
      case 'playas': return 'bg-cyan-100 text-cyan-800';
      case 'cultura': return 'bg-purple-100 text-purple-800';
      case 'aventura': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Muy Fácil': return 'bg-green-100 text-green-800';
      case 'Fácil': return 'bg-blue-100 text-blue-800';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addHighlight = (pointId: string, highlight: string) => {
    if (!highlight.trim()) return;
    
    setTravelPoints(travelPoints.map(point => 
      point.id === pointId 
        ? { ...point, highlights: [...(point.highlights || []), highlight] }
        : point
    ));
  };

  const removeHighlight = (pointId: string, index: number) => {
    setTravelPoints(travelPoints.map(point => 
      point.id === pointId 
        ? { ...point, highlights: point.highlights?.filter((_, i) => i !== index) || [] }
        : point
    ));
  };

  const addPro = (transportId: string, pro: string) => {
    if (!pro.trim()) return;
    
    setTransportOptions(transportOptions.map(option => 
      option.id === transportId 
        ? { ...option, pros: [...(option.pros || []), pro] }
        : option
    ));
  };

  const removePro = (transportId: string, index: number) => {
    setTransportOptions(transportOptions.map(option => 
      option.id === transportId 
        ? { ...option, pros: option.pros?.filter((_, i) => i !== index) || [] }
        : option
    ));
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={point.name}
                      onChange={(e) => updateTravelPoint(point.id, { name: e.target.value })}
                      placeholder="Nombre del punto"
                    />
                    <select
                      value={point.category}
                      onChange={(e) => updateTravelPoint(point.id, { category: e.target.value as any })}
                      className="w-full p-2 border rounded"
                    >
                      <option value="tours">Tours</option>
                      <option value="playas">Playas</option>
                      <option value="cultura">Cultura</option>
                      <option value="aventura">Aventura</option>
                    </select>
                  </div>
                  
                  <Textarea
                    value={point.description}
                    onChange={(e) => updateTravelPoint(point.id, { description: e.target.value })}
                    placeholder="Descripción"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Rating</label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={point.rating}
                        onChange={(e) => updateTravelPoint(point.id, { rating: parseFloat(e.target.value) })}
                        placeholder="4.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Duración</label>
                      <Input
                        value={point.duration}
                        onChange={(e) => updateTravelPoint(point.id, { duration: e.target.value })}
                        placeholder="3-4 horas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Precio</label>
                      <Input
                        value={point.price}
                        onChange={(e) => updateTravelPoint(point.id, { price: e.target.value })}
                        placeholder="$25-40"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Dificultad</label>
                      <select
                        value={point.difficulty}
                        onChange={(e) => updateTravelPoint(point.id, { difficulty: e.target.value as any })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Muy Fácil">Muy Fácil</option>
                        <option value="Fácil">Fácil</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Difícil">Difícil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mejor época</label>
                      <Input
                        value={point.bestTime}
                        onChange={(e) => updateTravelPoint(point.id, { bestTime: e.target.value })}
                        placeholder="Todo el año"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Imagen URL</label>
                    <Input
                      value={point.image}
                      onChange={(e) => updateTravelPoint(point.id, { image: e.target.value })}
                      placeholder="URL de la imagen"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Qué verás (Highlights)</label>
                    <div className="space-y-2">
                      {point.highlights?.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => {
                              const newHighlights = [...(point.highlights || [])];
                              newHighlights[index] = e.target.value;
                              updateTravelPoint(point.id, { highlights: newHighlights });
                            }}
                            placeholder="Highlight"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeHighlight(point.id, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addHighlight(point.id, '')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Highlight
                      </Button>
                    </div>
                  </div>
                  
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
                      <Badge className={getDifficultyColor(point.difficulty)}>
                        {point.difficulty}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-semibold">{point.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{point.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{point.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{point.price}</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <strong>Mejor época:</strong> {point.bestTime}
                    </div>
                    {point.highlights && point.highlights.length > 0 && (
                      <div className="mt-2">
                        <strong className="text-sm">Qué verás:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {point.highlights.map((highlight, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={newPoint.name || ''}
                  onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                  placeholder="Nombre del nuevo punto"
                />
                <select
                  value={newPoint.category || 'tours'}
                  onChange={(e) => setNewPoint({ ...newPoint, category: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="tours">Tours</option>
                  <option value="playas">Playas</option>
                  <option value="cultura">Cultura</option>
                  <option value="aventura">Aventura</option>
                </select>
              </div>
              
              <Textarea
                value={newPoint.description || ''}
                onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                placeholder="Descripción del punto"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newPoint.rating || ''}
                  onChange={(e) => setNewPoint({ ...newPoint, rating: parseFloat(e.target.value) })}
                  placeholder="Rating (4.5)"
                />
                <Input
                  value={newPoint.duration || ''}
                  onChange={(e) => setNewPoint({ ...newPoint, duration: e.target.value })}
                  placeholder="Duración (3-4 horas)"
                />
                <Input
                  value={newPoint.price || ''}
                  onChange={(e) => setNewPoint({ ...newPoint, price: e.target.value })}
                  placeholder="Precio ($25-40)"
                />
              </div>
              
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={option.name}
                      onChange={(e) => updateTransportOption(option.id, { name: e.target.value })}
                      placeholder="Nombre del transporte"
                    />
                    <Input
                      value={option.icon}
                      onChange={(e) => updateTransportOption(option.id, { icon: e.target.value })}
                      placeholder="Icono (plane, bus, car)"
                    />
                  </div>
                  
                  <Textarea
                    value={option.description}
                    onChange={(e) => updateTransportOption(option.id, { description: e.target.value })}
                    placeholder="Descripción"
                  />
                  
                  <Textarea
                    value={option.details}
                    onChange={(e) => updateTransportOption(option.id, { details: e.target.value })}
                    placeholder="Detalles adicionales"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      value={option.totalTime}
                      onChange={(e) => updateTransportOption(option.id, { totalTime: e.target.value })}
                      placeholder="Tiempo total"
                    />
                    <Input
                      value={option.price}
                      onChange={(e) => updateTransportOption(option.id, { price: e.target.value })}
                      placeholder="Precio"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ventajas</label>
                    <div className="space-y-2">
                      {option.pros?.map((pro, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={pro}
                            onChange={(e) => {
                              const newPros = [...(option.pros || [])];
                              newPros[index] = e.target.value;
                              updateTransportOption(option.id, { pros: newPros });
                            }}
                            placeholder="Ventaja"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePro(option.id, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPro(option.id, '')}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ventaja
                      </Button>
                    </div>
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
                    {option.details && (
                      <p className="text-sm text-gray-500 mb-2">{option.details}</p>
                    )}
                    <div className="flex gap-4 text-sm mb-2">
                      {option.totalTime && <span><strong>Tiempo:</strong> {option.totalTime}</span>}
                      {option.price && <span><strong>Precio:</strong> {option.price}</span>}
                    </div>
                    {option.pros && option.pros.length > 0 && (
                      <div>
                        <strong className="text-sm">Ventajas:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {option.pros.map((pro, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={newTransport.name || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, name: e.target.value })}
                  placeholder="Nombre del transporte"
                />
                <Input
                  value={newTransport.icon || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, icon: e.target.value })}
                  placeholder="Icono (plane, bus, car)"
                />
              </div>
              
              <Textarea
                value={newTransport.description || ''}
                onChange={(e) => setNewTransport({ ...newTransport, description: e.target.value })}
                placeholder="Descripción del transporte"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newTransport.totalTime || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, totalTime: e.target.value })}
                  placeholder="Tiempo total"
                />
                <Input
                  value={newTransport.price || ''}
                  onChange={(e) => setNewTransport({ ...newTransport, price: e.target.value })}
                  placeholder="Precio"
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
