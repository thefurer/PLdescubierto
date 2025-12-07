import { Home, MapPin, Camera, Compass, MessageSquare, Phone, BookOpen, HelpCircle, Sparkles } from 'lucide-react';
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
      label: 'Guía de Viaje',
      section: 'travel-guide',
      message: '¿Cómo llego a Puerto López y qué debo saber antes de ir?',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: MessageSquare,
      label: 'Testimonios',
      section: 'testimonials',
      message: '¿Qué dicen otros viajeros sobre Puerto López?',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Phone,
      label: 'Contacto',
      section: 'contact',
      message: '¿Cómo puedo contactar con Puerto López Descubierto?',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const quickActions = [
    {
      icon: Sparkles,
      label: 'Planificar viaje',
      message: '¡Ayúdame a planificar mi viaje a Puerto López!',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: BookOpen,
      label: 'Blog',
      section: 'blog',
      message: '¿Tienen artículos o blogs sobre Puerto López?',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HelpCircle,
      label: 'FAQ',
      section: 'faq',
      message: '¿Cuáles son las preguntas más frecuentes sobre Puerto López?',
      color: 'from-slate-500 to-gray-600'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex gap-1.5 overflow-x-auto py-2 px-1 scrollbar-hide">
        {navigationOptions.slice(0, 4).map((option) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.section}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 px-2.5 text-xs bg-white/60 hover:bg-white border border-white/40 hover:border-cyan-300/60 rounded-full backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-cyan-500/20 group"
              onClick={() => onNavigate(option.section, option.message)}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mr-1.5 group-hover:scale-110 transition-transform`}>
                <IconComponent size={10} className="text-white" />
              </div>
              <span className="text-gray-700">{option.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Navigation header */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <span className="text-[10px] font-medium text-cyan-600/80 uppercase tracking-wider">Navega conmigo</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      </div>

      {/* Main navigation grid */}
      <div className="grid grid-cols-3 gap-2">
        {navigationOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Button
              key={option.section}
              variant="ghost"
              className="h-auto py-2.5 px-2 flex flex-col items-center gap-1.5 bg-white/50 hover:bg-white border border-white/60 hover:border-cyan-300/60 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 group"
              onClick={() => onNavigate(option.section, option.message)}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-medium text-gray-600 group-hover:text-cyan-700">{option.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              className="flex-1 h-9 text-xs bg-gradient-to-r from-white/60 to-white/40 hover:from-white hover:to-white/80 border border-white/50 hover:border-cyan-300/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-md group"
              onClick={() => onNavigate(action.section || '', action.message)}
            >
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${action.color} flex items-center justify-center mr-1.5 group-hover:scale-110 transition-transform`}>
                <IconComponent size={12} className="text-white" />
              </div>
              <span className="text-gray-600 group-hover:text-gray-800">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NavigationGuide;
