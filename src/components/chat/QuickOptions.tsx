
import { Phone, Calendar, MapPin, CloudSun, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickOptionsProps {
  onOptionClick: (message: string) => void;
}

const QuickOptions = ({ onOptionClick }: QuickOptionsProps) => {
  const options = [
    {
      icon: Phone,
      label: 'Información de contacto',
      message: 'Necesito información de contacto de Puerto López Descubierto'
    },
    {
      icon: Calendar,
      label: 'Mejores épocas para visitar',
      message: 'Cuáles son las mejores épocas para visitar Puerto López'
    },
    {
      icon: MapPin,
      label: 'Actividades turísticas',
      message: 'Qué actividades turísticas puedo hacer en Puerto López'
    },
    {
      icon: CloudSun,
      label: 'Clima y temporadas',
      message: 'Información sobre el clima y temporadas en Puerto López'
    },
    {
      icon: Headphones,
      label: 'Soporte técnico',
      message: 'Necesito ayuda con soporte técnico'
    }
  ];

  return (
    <div className="p-3 border-b">
      <h4 className="text-xs font-medium text-gray-700 mb-2">¿En qué puedo ayudarte?</h4>
      <div className="grid grid-cols-1 gap-1.5">
        {options.map((option, index) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-8 px-2 text-left hover:bg-ocean/5 text-xs"
              onClick={() => onOptionClick(option.message)}
            >
              <IconComponent size={12} className="mr-1.5 text-ocean flex-shrink-0" />
              <span className="text-xs">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickOptions;
