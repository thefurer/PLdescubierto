
import { useState } from 'react';
import { Car, Plane, Bus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  cost: string;
  pros: string[];
  color: string;
}

const transportOptions: TransportOption[] = [
  {
    icon: <Plane className="h-8 w-8" />,
    title: 'Por Avión',
    description: 'Vuela a Manta (1 hora desde Quito) + 1.5 horas en bus/auto',
    duration: '2.5 horas total',
    cost: '$80 - $150',
    pros: ['Más rápido', 'Cómodo'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: <Bus className="h-8 w-8" />,
    title: 'Por Bus',
    description: 'Bus directo desde Quito, Guayaquil o Cuenca',
    duration: '6-8 horas desde Quito',
    cost: '$8 - $15',
    pros: ['Económico', 'Directo'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: <Car className="h-8 w-8" />,
    title: 'Por Auto',
    description: 'Ruta escénica por la costa del Pacífico',
    duration: '5-6 horas desde Quito',
    cost: '$40 - $60 (gasolina)',
    pros: ['Flexible', 'Paisajes'],
    color: 'from-orange-500 to-red-500'
  }
];

const TransportOptions = () => {
  const [hoveredTransport, setHoveredTransport] = useState<number | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-center mb-4 text-ocean-dark">Opciones de Transporte</h2>
      <p className="text-xl text-center text-gray-600 mb-10">Elige la opción que mejor se adapte a tu viaje</p>
      
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
