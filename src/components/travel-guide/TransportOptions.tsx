
import { useState } from 'react';
import { Car, Plane, Bus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';

interface TransportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  cost: string;
  pros: string[];
  color: string;
}

const TransportOptions = () => {
  const [hoveredTransport, setHoveredTransport] = useState<number | null>(null);
  const t = useTranslations();

  const transportOptions: TransportOption[] = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: t.byPlane,
      description: t.planeDesc,
      duration: t.totalTime,
      cost: '$80 - $150',
      pros: [t.faster, t.comfortable],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Bus className="h-8 w-8" />,
      title: t.byBus,
      description: t.busDesc,
      duration: t.fromQuito,
      cost: '$8 - $15',
      pros: [t.economical, t.direct],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: t.byCar,
      description: t.carDesc,
      duration: t.fromQuito.replace('6-8', '5-6'),
      cost: `$40 - $60 (${t.gasoline})`,
      pros: [t.flexible, t.landscapes],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-center mb-4 text-ocean-dark">{t.transportOptions}</h2>
      <p className="text-xl text-center text-gray-600 mb-10">{t.chooseTransport}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {transportOptions.map((option, index) => (
          <Card 
            key={index} 
            className={`relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
              hoveredTransport === index ? 'shadow-2xl' : 'shadow-lg'
            } glass-card border-0`}
            onMouseEnter={() => setHoveredTransport(index)}
            onMouseLeave={() => setHoveredTransport(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 transition-opacity duration-300 ${
              hoveredTransport === index ? 'opacity-20' : ''
            }`}></div>
            
            <CardHeader className="text-center relative z-10 pb-4">
              <div className={`mx-auto mb-6 p-6 bg-gradient-to-br ${option.color} rounded-full w-fit shadow-lg transform transition-all duration-300 ${
                hoveredTransport === index ? 'scale-110 rotate-12' : ''
              }`}>
                <div className="text-white">
                  {option.icon}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-ocean-dark">{option.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{option.description}</p>
              <div className="space-y-4">
                <div className="flex items-center justify-center text-lg">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  <span className="font-semibold">{option.duration}</span>
                </div>
                <div className="text-2xl font-bold text-ocean-dark">{option.cost}</div>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TransportOptions;
