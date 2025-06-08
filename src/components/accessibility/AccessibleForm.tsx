
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AccessibleFormProps {
  title: string;
  children: React.ReactNode;
  currentStep?: number;
  totalSteps?: number;
  errors?: Record<string, string>;
}

const AccessibleForm: React.FC<AccessibleFormProps> = ({
  title,
  children,
  currentStep,
  totalSteps,
  errors = {}
}) => {
  const hasErrors = Object.keys(errors).length > 0;
  const progress = currentStep && totalSteps ? (currentStep / totalSteps) * 100 : undefined;

  return (
    <Card className="w-full max-w-2xl mx-auto" role="form" aria-label={title}>
      <CardHeader>
        <CardTitle id="form-title" className="text-xl font-semibold">
          {title}
        </CardTitle>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paso {currentStep} de {totalSteps}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              aria-label={`Progreso del formulario: ${Math.round(progress)}% completado`}
            />
          </div>
        )}

        {hasErrors && (
          <div 
            role="alert" 
            aria-live="polite"
            className="bg-red-50 border border-red-200 rounded-md p-3"
          >
            <h3 className="text-red-800 font-medium mb-2">Errores en el formulario:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default AccessibleForm;
