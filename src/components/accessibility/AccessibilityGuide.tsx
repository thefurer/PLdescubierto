import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, Eye, Type, Underline, Focus, Volume2, Keyboard, Globe, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const AccessibilityGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const t = useTranslations();

  const guideSteps = [
    {
      id: 'language', title: t.guideLangTitle, description: t.guideLangDesc,
      icon: <Globe className="h-5 w-5" />,
      instructions: [t.guideLangI1, t.guideLangI2, t.guideLangI3],
      benefits: [t.guideLangB1, t.guideLangB2, t.guideLangB3]
    },
    {
      id: 'font-size', title: t.guideFontTitle, description: t.guideFontDesc,
      icon: <Type className="h-5 w-5" />,
      instructions: [t.guideFontI1, t.guideFontI2, t.guideFontI3],
      benefits: [t.guideFontB1, t.guideFontB2, t.guideFontB3]
    },
    {
      id: 'contrast', title: t.guideContrastTitle, description: t.guideContrastDesc,
      icon: <Eye className="h-5 w-5" />,
      instructions: [t.guideContrastI1, t.guideContrastI2, t.guideContrastI3],
      benefits: [t.guideContrastB1, t.guideContrastB2, t.guideContrastB3]
    },
    {
      id: 'underline', title: t.guideUnderlineTitle, description: t.guideUnderlineDesc,
      icon: <Underline className="h-5 w-5" />,
      instructions: [t.guideUnderlineI1, t.guideUnderlineI2, t.guideUnderlineI3],
      benefits: [t.guideUnderlineB1, t.guideUnderlineB2, t.guideUnderlineB3]
    },
    {
      id: 'animations', title: t.guideAnimTitle, description: t.guideAnimDesc,
      icon: <Focus className="h-5 w-5" />,
      instructions: [t.guideAnimI1, t.guideAnimI2, t.guideAnimI3],
      benefits: [t.guideAnimB1, t.guideAnimB2, t.guideAnimB3]
    },
    {
      id: 'screen-reader', title: t.guideReaderTitle, description: t.guideReaderDesc,
      icon: <Volume2 className="h-5 w-5" />,
      instructions: [t.guideReaderI1, t.guideReaderI2, t.guideReaderI3],
      benefits: [t.guideReaderB1, t.guideReaderB2, t.guideReaderB3]
    },
    {
      id: 'focus', title: t.guideFocusTitle, description: t.guideFocusDesc,
      icon: <Keyboard className="h-5 w-5" />,
      instructions: [t.guideFocusI1, t.guideFocusI2, t.guideFocusI3],
      benefits: [t.guideFocusB1, t.guideFocusB2, t.guideFocusB3]
    }
  ];

  const nextStep = () => { if (currentStep < guideSteps.length - 1) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const currentGuide = guideSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <HelpCircle className="h-3 w-3 mr-1" />
          {t.accessibilityGuide}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            {t.guideTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div key={index} className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : index < currentStep ? 'bg-blue-300' : 'bg-slate-200'
                }`} />
              ))}
            </div>
            <Badge variant="outline" className="text-xs">
              {currentStep + 1} {t.guideStepOf} {guideSteps.length}
            </Badge>
          </div>

          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{currentGuide.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold">{currentGuide.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{currentGuide.description}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">{t.guideHowToUse}</h4>
                <ul className="space-y-1">
                  {currentGuide.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">{t.guideBenefits}</h4>
                <div className="flex flex-wrap gap-1">
                  {currentGuide.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">{benefit}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              {t.previous}
            </Button>
            <Button onClick={nextStep} disabled={currentStep === guideSteps.length - 1} className="flex items-center gap-2">
              {t.next}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityGuide;
