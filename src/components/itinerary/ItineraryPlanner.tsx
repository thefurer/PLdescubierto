
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Share2, CheckCircle } from 'lucide-react';
import { useTouristAttractions } from '@/hooks/useTouristAttractions';
import { useToast } from '@/hooks/use-toast';

interface SelectedAttraction {
  id: string;
  name: string;
  category: string;
}

interface ItineraryConfig {
  attractions: SelectedAttraction[];
  duration: string;
  groupSize: string;
  preferences: string[];
}

const ItineraryPlanner = () => {
  const { attractions, loading } = useTouristAttractions();
  const { toast } = useToast();
  const [config, setConfig] = useState<ItineraryConfig>({
    attractions: [],
    duration: '',
    groupSize: '',
    preferences: []
  });
  const [currentStep, setCurrentStep] = useState(1);

  const durations = [
    { value: '1', label: '1 día' },
    { value: '2', label: '2 días' },
    { value: '3', label: '3 días' },
    { value: '4', label: '4-5 días' },
    { value: '7', label: '1 semana' }
  ];

  const groupSizes = [
    { value: 'solo', label: 'Solo' },
    { value: 'pareja', label: 'En pareja' },
    { value: 'familia', label: 'Familia' },
    { value: 'grupo', label: 'Grupo grande' }
  ];

  const activityPreferences = [
    'Avistamiento de ballenas',
    'Buceo y snorkeling',
    'Senderismo',
    'Gastronomía local',
    'Fotografía de naturaleza',
    'Relajación en playas',
    'Cultura y tradiciones',
    'Aventura extrema'
  ];

  const toggleAttraction = (attraction: { id: string; name: string; category: string }) => {
    setConfig(prev => ({
      ...prev,
      attractions: prev.attractions.find(a => a.id === attraction.id)
        ? prev.attractions.filter(a => a.id !== attraction.id)
        : [...prev.attractions, attraction]
    }));
  };

  const togglePreference = (preference: string) => {
    setConfig(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const generateWhatsAppMessage = () => {
    const attractionsList = config.attractions.map(a => `• ${a.name}`).join('\n');
    const preferencesList = config.preferences.join(', ');
    
    const message = `🏝️ *ITINERARIO PERSONALIZADO - PUERTO LÓPEZ*

📅 *Duración:* ${durations.find(d => d.value === config.duration)?.label}
👥 *Grupo:* ${groupSizes.find(g => g.value === config.groupSize)?.label}

🎯 *Atracciones seleccionadas (${config.attractions.length}):*
${attractionsList}

💡 *Preferencias:*
${preferencesList}

¡Hola! Me gustaría obtener más información sobre este itinerario personalizado para Puerto López. ¿Podrían ayudarme con los detalles, precios y disponibilidad?

_Generado desde Puerto López Descubierto_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/593991995390?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: '¡Itinerario enviado!',
      description: 'Tu itinerario personalizado ha sido enviado por WhatsApp.',
    });
  };

  const isConfigComplete = () => {
    return config.attractions.length > 0 && config.duration && config.groupSize;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando atracciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-ocean-dark mb-2">
          Planifica tu Itinerario Personalizado
        </h2>
        <p className="text-gray-600">
          Selecciona tus atracciones favoritas y crea el viaje perfecto a Puerto López
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step ? 'bg-ocean text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-1 mx-2 ${currentStep > step ? 'bg-ocean' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Attractions */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-ocean" />
              Selecciona las Atracciones ({config.attractions.length} seleccionadas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attractions.map((attraction) => {
                const isSelected = config.attractions.find(a => a.id === attraction.id);
                return (
                  <div
                    key={attraction.id}
                    onClick={() => toggleAttraction({
                      id: attraction.id,
                      name: attraction.name,
                      category: attraction.category
                    })}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-ocean bg-ocean/10 shadow-lg' 
                        : 'border-gray-200 hover:border-ocean/50'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{attraction.name}</h3>
                      {isSelected && <CheckCircle className="h-5 w-5 text-ocean" />}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {attraction.category}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={config.attractions.length === 0}
                className="bg-ocean hover:bg-ocean-dark"
              >
                Siguiente: Duración
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Duration */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-ocean" />
              Duración del Viaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {durations.map((duration) => (
                <Button
                  key={duration.value}
                  variant={config.duration === duration.value ? "default" : "outline"}
                  onClick={() => setConfig(prev => ({ ...prev, duration: duration.value }))}
                  className="h-16 text-center"
                >
                  <div>
                    <Clock className="h-5 w-5 mx-auto mb-1" />
                    {duration.label}
                  </div>
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Anterior
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)}
                disabled={!config.duration}
                className="bg-ocean hover:bg-ocean-dark"
              >
                Siguiente: Grupo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Group Size */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-ocean" />
              Tamaño del Grupo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {groupSizes.map((size) => (
                <Button
                  key={size.value}
                  variant={config.groupSize === size.value ? "default" : "outline"}
                  onClick={() => setConfig(prev => ({ ...prev, groupSize: size.value }))}
                  className="h-16 text-center"
                >
                  <div>
                    <Users className="h-5 w-5 mx-auto mb-1" />
                    {size.label}
                  </div>
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Anterior
              </Button>
              <Button 
                onClick={() => setCurrentStep(4)}
                disabled={!config.groupSize}
                className="bg-ocean hover:bg-ocean-dark"
              >
                Siguiente: Preferencias
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Preferences & Summary */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Actividades (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activityPreferences.map((preference) => (
                  <Button
                    key={preference}
                    variant={config.preferences.includes(preference) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePreference(preference)}
                    className="text-xs h-auto py-2 px-3"
                  >
                    {preference}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-gradient-to-r from-ocean/5 to-green-primary/5">
            <CardHeader>
              <CardTitle className="text-center text-ocean-dark">
                Resumen de tu Itinerario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Detalles del Viaje</h4>
                  <p><strong>Duración:</strong> {durations.find(d => d.value === config.duration)?.label}</p>
                  <p><strong>Grupo:</strong> {groupSizes.find(g => g.value === config.groupSize)?.label}</p>
                  <p><strong>Atracciones:</strong> {config.attractions.length} seleccionadas</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Atracciones Incluidas</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {config.attractions.map((attraction) => (
                      <p key={attraction.id} className="text-sm">• {attraction.name}</p>
                    ))}
                  </div>
                </div>
              </div>
              
              {config.preferences.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Preferencias</h4>
                  <p className="text-sm">{config.preferences.join(', ')}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Anterior
                </Button>
                <Button 
                  onClick={generateWhatsAppMessage}
                  disabled={!isConfigComplete()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Enviar por WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;
