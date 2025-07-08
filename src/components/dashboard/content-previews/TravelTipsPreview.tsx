
import { Star, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface TravelTipsPreviewProps {
  tips?: TravelTip[];
}

const TravelTipsPreview = ({ tips = [] }: TravelTipsPreviewProps) => {
  // Default tips if none provided
  const defaultTips: TravelTip[] = [
    {
      id: '1',
      category: 'epoca',
      title: 'Mejor época para visitar',
      seasonal: [
        {
          period: 'Junio - Septiembre',
          description: 'Temporada de ballenas jorobadas'
        },
        {
          period: 'Diciembre - Abril',
          description: 'Clima seco y soleado'
        }
      ]
    },
    {
      id: '2',
      category: 'items',
      title: 'Qué llevar',
      items: [
        'Protector solar y sombrero',
        'Ropa cómoda y zapatos de caminata',
        'Cámara impermeable',
        'Repelente de insectos'
      ]
    }
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;
  const epocaTip = displayTips.find(tip => tip.category === 'epoca');
  const itemsTip = displayTips.find(tip => tip.category === 'items');

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-green-primary to-ocean text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Consejos de Viaje</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {epocaTip && (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-ocean">
                    <h4 className="text-xl font-bold mb-4 text-ocean-dark flex items-center">
                      <Star className="h-6 w-6 mr-2 text-yellow-500" />
                      {epocaTip.title}
                    </h4>
                    <div className="space-y-3">
                      {epocaTip.seasonal?.map((season, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                          <strong className="text-ocean">{season.period}:</strong> {season.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {itemsTip && (
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-primary">
                    <h4 className="text-xl font-bold mb-4 text-green-dark flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-green-primary" />
                      {itemsTip.title}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {itemsTip.items?.map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="w-2 h-2 bg-green-primary rounded-full mr-3"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelTipsPreview;
