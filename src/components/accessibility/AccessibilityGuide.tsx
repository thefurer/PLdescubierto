import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Eye, 
  Type, 
  Underline, 
  Focus, 
  Volume2, 
  Keyboard,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  instructions: string[];
  benefits: string[];
}

const AccessibilityGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const guideSteps: GuideStep[] = [
    {
      id: 'language',
      title: 'Selección de Idioma',
      description: 'Cambia el idioma de la interfaz para una mejor comprensión',
      icon: <Globe className="h-5 w-5" />,
      instructions: [
        'Haz clic en el selector de idioma',
        'Elige entre Español e Inglés',
        'El cambio se aplica inmediatamente'
      ],
      benefits: [
        'Navegación en tu idioma preferido',
        'Mejor comprensión del contenido',
        'Experiencia más natural'
      ]
    },
    {
      id: 'font-size',
      title: 'Tamaño de Fuente',
      description: 'Ajusta el tamaño del texto para mejorar la legibilidad',
      icon: <Type className="h-5 w-5" />,
      instructions: [
        'Usa los botones + y - para ajustar',
        'Observa el cambio en tiempo real',
        'Elige entre S, M, L, XL'
      ],
      benefits: [
        'Reduce la fatiga visual',
        'Mejora la legibilidad',
        'Adaptable a tus necesidades'
      ]
    },
    {
      id: 'contrast',
      title: 'Alto Contraste',
      description: 'Aumenta el contraste para una mejor visibilidad',
      icon: <Eye className="h-5 w-5" />,
      instructions: [
        'Activa el modo alto contraste',
        'Los colores se intensificarán',
        'Ideal para condiciones de poca luz'
      ],
      benefits: [
        'Mayor visibilidad del texto',
        'Reduce el esfuerzo visual',
        'Mejor para usuarios con baja visión'
      ]
    },
    {
      id: 'underline',
      title: 'Subrayado de Enlaces',
      description: 'Hace más visible la identificación de enlaces',
      icon: <Underline className="h-5 w-5" />,
      instructions: [
        'Activa el subrayado de enlaces',
        'Todos los enlaces serán subrayados',
        'Facilita la navegación'
      ],
      benefits: [
        'Enlaces más fáciles de identificar',
        'Mejor para usuarios con daltonismo',
        'Navegación más intuitiva'
      ]
    },
    {
      id: 'animations',
      title: 'Reducir Animaciones',
      description: 'Disminuye las animaciones para evitar distracciones',
      icon: <Focus className="h-5 w-5" />,
      instructions: [
        'Activa la reducción de animaciones',
        'Las transiciones serán más suaves',
        'Reduce el movimiento en pantalla'
      ],
      benefits: [
        'Menos distracciones visuales',
        'Mejor para sensibilidad al movimiento',
        'Navegación más tranquila'
      ]
    },
    {
      id: 'screen-reader',
      title: 'Lector de Pantalla',
      description: 'Reproduce el contenido de la página en voz alta',
      icon: <Volume2 className="h-5 w-5" />,
      instructions: [
        'Haz clic en "Leer página"',
        'Escucha el contenido en voz alta',
        'Usa "Detener" para pausar'
      ],
      benefits: [
        'Acceso auditivo al contenido',
        'Multitarea mientras navegas',
        'Apoyo para usuarios con discapacidad visual'
      ]
    },
    {
      id: 'focus',
      title: 'Indicadores de Foco',
      description: 'Resalta el elemento activo durante la navegación por teclado',
      icon: <Keyboard className="h-5 w-5" />,
      instructions: [
        'Activa los indicadores de foco',
        'Usa la tecla Tab para navegar',
        'Observa los elementos resaltados'
      ],
      benefits: [
        'Navegación por teclado más clara',
        'Mejor accesibilidad',
        'Identificación visual del elemento activo'
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentGuide = guideSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <HelpCircle className="h-3 w-3 mr-1" />
          Guía
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Guía de Accesibilidad
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 
                    index < currentStep ? 'bg-blue-300' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <Badge variant="outline" className="text-xs">
              {currentStep + 1} de {guideSteps.length}
            </Badge>
          </div>

          {/* Current step content */}
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {currentGuide.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{currentGuide.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{currentGuide.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instructions */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Cómo usar:</h4>
                <ul className="space-y-1">
                  {currentGuide.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Beneficios:</h4>
                <div className="flex flex-wrap gap-1">
                  {currentGuide.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === guideSteps.length - 1}
              className="flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityGuide;