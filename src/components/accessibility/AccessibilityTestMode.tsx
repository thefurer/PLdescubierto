import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  TestTube, 
  Eye, 
  EyeOff, 
  MousePointer, 
  Hand,
  Palette,
  Sun,
  Monitor
} from 'lucide-react';

interface TestCondition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
}

const AccessibilityTestMode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testConditions, setTestConditions] = useState<TestCondition[]>([
    {
      id: 'low-vision',
      name: 'Visión Reducida',
      description: 'Simula condiciones de baja visión',
      icon: <EyeOff className="h-4 w-4" />,
      active: false
    },
    {
      id: 'color-blind',
      name: 'Daltonismo',
      description: 'Simula diferentes tipos de daltonismo',
      icon: <Palette className="h-4 w-4" />,
      active: false
    },
    {
      id: 'keyboard-only',
      name: 'Solo Teclado',
      description: 'Navegación únicamente con teclado',
      icon: <Hand className="h-4 w-4" />,
      active: false
    },
    {
      id: 'bright-light',
      name: 'Luz Intensa',
      description: 'Simula navegación bajo luz solar intensa',
      icon: <Sun className="h-4 w-4" />,
      active: false
    },
    {
      id: 'focus-visible',
      name: 'Indicadores de Foco',
      description: 'Resalta todos los elementos enfocables',
      icon: <Monitor className="h-4 w-4" />,
      active: false
    }
  ]);

  const [isTestModeActive, setIsTestModeActive] = useState(false);

  const toggleCondition = (id: string) => {
    setTestConditions(prev => 
      prev.map(condition => 
        condition.id === id 
          ? { ...condition, active: !condition.active }
          : condition
      )
    );
  };

  const applyTestStyles = () => {
    const root = document.documentElement;
    
    // Reset all test styles first
    root.removeAttribute('data-test-low-vision');
    root.removeAttribute('data-test-color-blind');
    root.removeAttribute('data-test-keyboard-only');
    root.removeAttribute('data-test-bright-light');
    root.removeAttribute('data-test-focus-visible');

    if (!isTestModeActive) return;

    // Apply active test conditions
    testConditions.forEach(condition => {
      if (condition.active) {
        root.setAttribute(`data-test-${condition.id.replace('-', '-')}`, 'true');
      }
    });
  };

  useEffect(() => {
    applyTestStyles();
  }, [testConditions, isTestModeActive]);

  const activateTestMode = () => {
    setIsTestModeActive(true);
    applyTestStyles();
  };

  const deactivateTestMode = () => {
    setIsTestModeActive(false);
    setTestConditions(prev => 
      prev.map(condition => ({ ...condition, active: false }))
    );
    
    // Remove all test attributes
    const root = document.documentElement;
    root.removeAttribute('data-test-low-vision');
    root.removeAttribute('data-test-color-blind');
    root.removeAttribute('data-test-keyboard-only');
    root.removeAttribute('data-test-bright-light');
    root.removeAttribute('data-test-focus-visible');
  };

  const activeConditionsCount = testConditions.filter(c => c.active).length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <TestTube className="h-3 w-3 mr-1" />
            Pruebas
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              Modo de Prueba de Accesibilidad
              {isTestModeActive && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Activo
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <h3 className="font-medium text-purple-900">Modo de Prueba</h3>
                <p className="text-sm text-purple-700">
                  {isTestModeActive ? 'Desactivar todas las simulaciones' : 'Simula condiciones de accesibilidad'}
                </p>
              </div>
              <Switch
                checked={isTestModeActive}
                onCheckedChange={isTestModeActive ? deactivateTestMode : activateTestMode}
              />
            </div>

            {isTestModeActive && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-800">Condiciones a Simular:</h4>
                
                {testConditions.map((condition) => (
                  <Card key={condition.id} className="border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${condition.active ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                            {condition.icon}
                          </div>
                          <div>
                            <h5 className="font-medium text-sm">{condition.name}</h5>
                            <p className="text-xs text-slate-600">{condition.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={condition.active}
                          onCheckedChange={() => toggleCondition(condition.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeConditionsCount > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Nota:</strong> Estás simulando {activeConditionsCount} condición{activeConditionsCount !== 1 ? 'es' : ''} de accesibilidad. 
                      Los efectos son visibles en toda la aplicación.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Test mode indicator overlay */}
      {isTestModeActive && activeConditionsCount > 0 && (
        <div className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="text-sm font-medium">
              Modo Prueba: {activeConditionsCount} condición{activeConditionsCount !== 1 ? 'es' : ''} activa{activeConditionsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityTestMode;