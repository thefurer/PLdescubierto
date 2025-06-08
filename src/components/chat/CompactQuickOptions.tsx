
import { Phone, Calendar, MapPin, CloudSun, Headphones, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompactQuickOptionsProps {
  onOptionClick: (message: string) => void;
}

const CompactQuickOptions = ({ onOptionClick }: CompactQuickOptionsProps) => {
  const options = [
    {
      icon: Route,
      label: 'Itinerario',
      message: 'Quiero personalizar mi itinerario turístico para Puerto López'
    },
    {
      icon: Phone,
      label: 'Contacto',
      message: 'Necesito información de contacto de Puerto López Descubierto'
    },
    {
      icon: Calendar,
      label: 'Épocas',
      message: 'Cuáles son las mejores épocas para visitar Puerto López'
    },
    {
      icon: MapPin,
      label: 'Actividades',
      message: 'Qué actividades turísticas puedo hacer en Puerto López'
    },
    {
      icon: CloudSun,
      label: 'Clima',
      message: 'Información sobre el clima y temporadas en Puerto López'
    },
    {
      icon: Headphones,
      label: 'Soporte',
      message: 'Necesito ayuda con soporte técnico'
    }
  ];

  return (
    <div className="p-2 border-b border-gray-100 bg-gradient-to-b from-gray-50/30 to-white">
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {options.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex-shrink-0 h-7 px-2 text-xs hover:bg-ocean/5 hover:border-ocean/20 whitespace-nowrap border-gray-200 rounded-lg"
              onClick={() => onOptionClick(option.message)}
            >
              <IconComponent size={10} className="mr-1 text-ocean" />
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactQuickOptions;
