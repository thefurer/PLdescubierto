
import { Car, Plane, Bus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface TransportOptionsPreviewProps {
  options: TransportOption[];
}

const TransportOptionsPreview = ({ options }: TransportOptionsPreviewProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'plane':
        return <Plane className="h-8 w-8" />;
      case 'bus':
        return <Bus className="h-8 w-8" />;
      case 'car':
        return <Car className="h-8 w-8" />;
      default:
        return <Car className="h-8 w-8" />;
    }
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="mb-12 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-ocean-dark">Opciones de Transporte</h2>
        <p className="text-xl text-center text-gray-600 mb-10">Elige la opción que mejor se adapte a tu viaje</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.slice(0, 3).map((option, index) => (
            <Card 
              key={option.id} 
              className="relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg glass-card border-0"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColor(index)} opacity-10`}></div>
              
              <CardHeader className="text-center relative z-10 pb-4">
                <div className={`mx-auto mb-6 p-6 bg-gradient-to-br ${getGradientColor(index)} rounded-full w-fit shadow-lg`}>
                  <div className="text-white">
                    {getIconComponent(option.icon)}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-ocean-dark">{option.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{option.description}</p>
                {option.details && (
                  <p className="text-gray-500 mb-4 text-sm">{option.details}</p>
                )}
                <div className="space-y-4">
                  {option.totalTime && (
                    <div className="flex items-center justify-center text-lg">
                      <Clock className="h-5 w-5 mr-2 text-green-500" />
                      <span className="font-semibold">{option.totalTime}</span>
                    </div>
                  )}
                  {option.price && (
                    <div className="text-2xl font-bold text-ocean-dark">{option.price}</div>
                  )}
                  {option.pros && option.pros.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {option.pros.map((pro, proIndex) => (
                        <span 
                          key={proIndex}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {pro}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportOptionsPreview;
