
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Car, Compass } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TravelPointEditor from '../travel-guide/TravelPointEditor';
import TransportOptionEditor from '../travel-guide/TransportOptionEditor';
import NewTravelPointForm from '../travel-guide/NewTravelPointForm';
import NewTransportForm from '../travel-guide/NewTransportForm';
import TravelTipsEditor from '../travel-guide/TravelTipsEditor';
import NewTravelTipForm from '../travel-guide/NewTravelTipForm';
import TravelGuidePointsPreview from '../content-previews/TravelGuidePointsPreview';
import TransportOptionsPreview from '../content-previews/TransportOptionsPreview';
import TravelTipsPreview from '../content-previews/TravelTipsPreview';

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

interface TravelTip {
  id: string;
  category: 'epoca' | 'items';
  title: string;
  description?: string;
  items?: string[];
  seasonal?: {
    period: string;
    description: string;
  }[];
}

const EditableTravelGuide = () => {
  const { user } = useAuth();
  const [travelPoints, setTravelPoints] = useState<TravelPoint[]>([]);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [editingPoint, setEditingPoint] = useState<string | null>(null);
  const [editingTransport, setEditingTransport] = useState<string | null>(null);
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

      const { data: tipsData } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_name', 'travel_guide_tips')
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
      if (tipsData?.content && typeof tipsData.content === 'object' && tipsData.content !== null) {
        const content = tipsData.content as any;
        if (content.tips && Array.isArray(content.tips)) {
          setTravelTips(content.tips);
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

  const saveTravelTips = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await supabase
        .from('site_content')
        .upsert({
          section_name: 'travel_guide_tips',
          content: { tips: travelTips } as any,
          updated_by: user.id
        }, {
          onConflict: 'section_name'
        });

      toast.success('Consejos de viaje guardados correctamente');
    } catch (error) {
      console.error('Error saving travel tips:', error);
      toast.error('Error al guardar los consejos de viaje');
    } finally {
      setLoading(false);
    }
  };

  const addTravelTip = (newTipData: Partial<TravelTip>) => {
    if (!newTipData.title) return;

    const tip: TravelTip = {
      id: Date.now().toString(),
      category: newTipData.category || 'epoca',
      title: newTipData.title,
      description: newTipData.description || '',
      items: newTipData.items || [],
      seasonal: newTipData.seasonal || []
    };

    setTravelTips([...travelTips, tip]);
    saveTravelTips();
  };

  const updateTravelTip = (id: string, updates: Partial<TravelTip>) => {
    setTravelTips(travelTips.map(tip => 
      tip.id === id ? { ...tip, ...updates } : tip
    ));
    setEditingTip(null);
    saveTravelTips();
  };

  const deleteTravelTip = (id: string) => {
    setTravelTips(travelTips.filter(tip => tip.id !== id));
    saveTravelTips();
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

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vista Previa - Guía de Viaje</h2>
          <Button onClick={() => setShowPreview(false)} variant="outline">
            Volver a Editar
          </Button>
        </div>
        
        <div className="bg-white">
          <TravelGuidePointsPreview points={travelPoints} />
          <TransportOptionsPreview options={transportOptions} />
          <TravelTipsPreview tips={travelTips} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Editar Guía de Viaje</h2>
        <Button onClick={() => setShowPreview(true)} variant="outline">
          Ver Vista Previa
        </Button>
      </div>

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

      {/* Consejos de Viaje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Consejos de Viaje
          </CardTitle>
          <CardDescription>
            Edita los consejos de viaje y recomendaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {travelTips.map((tip) => (
            <TravelTipsEditor
              key={tip.id}
              tip={tip}
              isEditing={editingTip === tip.id}
              onEdit={() => setEditingTip(tip.id)}
              onSave={(updates) => updateTravelTip(tip.id, updates)}
              onCancel={() => setEditingTip(null)}
              onDelete={() => deleteTravelTip(tip.id)}
            />
          ))}

          <NewTravelTipForm
            onAdd={addTravelTip}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditableTravelGuide;
