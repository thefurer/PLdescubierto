
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TravelPointEditor from '../travel-guide/TravelPointEditor';
import TransportOptionEditor from '../travel-guide/TransportOptionEditor';
import NewTravelPointForm from '../travel-guide/NewTravelPointForm';
import NewTransportForm from '../travel-guide/NewTransportForm';

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

  const addTravelPoint = (newPointData: Partial<TravelPoint>) => {
    if (!newPointData.name || !newPointData.description) return;

    const point: TravelPoint = {
      id: Date.now().toString(),
      name: newPointData.name,
      description: newPointData.description,
      category: newPointData.category || 'tours',
      rating: newPointData.rating || 4.5,
      difficulty: newPointData.difficulty || 'Fácil',
      duration: newPointData.duration || '',
      price: newPointData.price || '',
      bestTime: newPointData.bestTime || '',
      highlights: newPointData.highlights || [],
      image: newPointData.image || '',
      coordinates: newPointData.coordinates
    };

    setTravelPoints([...travelPoints, point]);
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

  const addTransportOption = (newTransportData: Partial<TransportOption>) => {
    if (!newTransportData.name || !newTransportData.description) return;

    const transport: TransportOption = {
      id: Date.now().toString(),
      name: newTransportData.name,
      description: newTransportData.description,
      totalTime: newTransportData.totalTime || '',
      price: newTransportData.price || '',
      pros: newTransportData.pros || [],
      icon: newTransportData.icon || '',
      details: newTransportData.details || ''
    };

    setTransportOptions([...transportOptions, transport]);
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
            <TravelPointEditor
              key={point.id}
              point={point}
              isEditing={editingPoint === point.id}
              onEdit={() => setEditingPoint(point.id)}
              onSave={(updates) => updateTravelPoint(point.id, updates)}
              onCancel={() => setEditingPoint(null)}
              onDelete={() => deleteTravelPoint(point.id)}
            />
          ))}

          <NewTravelPointForm
            onAdd={addTravelPoint}
            loading={loading}
          />
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
            <TransportOptionEditor
              key={option.id}
              option={option}
              isEditing={editingTransport === option.id}
              onEdit={() => setEditingTransport(option.id)}
              onSave={(updates) => updateTransportOption(option.id, updates)}
              onCancel={() => setEditingTransport(null)}
              onDelete={() => deleteTransportOption(option.id)}
            />
          ))}

          <NewTransportForm
            onAdd={addTransportOption}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableTravelGuide;
