import { Home, MapPin, Camera, Compass, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationGuideProps {
  onNavigate: (section: string, message: string) => void;
  variant?: 'full' | 'compact';
}

const NavigationGuide = ({ onNavigate, variant = 'full' }: NavigationGuideProps) => {
  const navigationOptions = [
    {
      icon: Home,
      label: 'Inicio',
      section: 'hero',
      message: '¡Llévame al inicio de la página!',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: MapPin,
      label: 'Atracciones',
      section: 'attractions',
      message: '¡Quiero explorar las atracciones turísticas de Puerto López!',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Camera,
      label: 'Galería',
      section: 'gallery',
      message: '¡Muéstrame fotos hermosas de Puerto López!',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Compass,
      label: 'Guía',
      section: 'travel-guide',
      message: '¿Cómo llego a Puerto López y qué debo saber antes de ir?',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Globe,
      label: 'Metaverso',
      section: 'virtual-tour',
      message: '¡Quiero explorar Puerto López en el metaverso! ¿Cómo funciona?',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex gap-1 overflow-x-auto py-1.5 px-1 scrollbar-hide">
        {navigationOptions.slice(0, 4).map((option) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.section}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-7 px-2 text-[10px] bg-white/60 hover:bg-white border border-white/40 hover:border-cyan-300/60 rounded-full backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/20 group"
              onClick={() => onNavigate(option.section, option.message)}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mr-1 group-hover:scale-110 transition-transform`}>
                <IconComponent size={8} className="text-white" />
              </div>
              <span className="text-gray-700">{option.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {/* Navigation header */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <span className="text-[9px] font-medium text-cyan-600/80 uppercase tracking-wider">Navega conmigo</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      </div>

      {/* Main navigation - 5 items in a row */}
      <div className="flex gap-1.5 justify-center">
        {navigationOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.section}
              variant="ghost"
              className="h-auto py-2 px-1.5 flex flex-col items-center gap-1 bg-white/50 hover:bg-white border border-white/60 hover:border-cyan-300/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 group min-w-[54px]"
              onClick={() => onNavigate(option.section, option.message)}
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent size={14} className="text-white" />
              </div>
              <span className="text-[9px] font-medium text-gray-600 group-hover:text-cyan-700">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationGuide;
