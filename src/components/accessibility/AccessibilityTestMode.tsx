import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { TestTube, EyeOff, Palette, Hand, Sun, Monitor } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const AccessibilityTestMode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const [testConditions, setTestConditions] = useState([
    { id: 'low-vision', name: t.testLowVision, description: t.testLowVisionDesc, icon: <EyeOff className="h-4 w-4" />, active: false },
    { id: 'color-blind', name: t.testColorBlind, description: t.testColorBlindDesc, icon: <Palette className="h-4 w-4" />, active: false },
    { id: 'keyboard-only', name: t.testKeyboardOnly, description: t.testKeyboardOnlyDesc, icon: <Hand className="h-4 w-4" />, active: false },
    { id: 'bright-light', name: t.testBrightLight, description: t.testBrightLightDesc, icon: <Sun className="h-4 w-4" />, active: false },
    { id: 'focus-visible', name: t.testFocusIndicators, description: t.testFocusIndicatorsDesc, icon: <Monitor className="h-4 w-4" />, active: false }
  ]);

  const [isTestModeActive, setIsTestModeActive] = useState(false);

  const toggleCondition = (id: string) => {
    setTestConditions(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const applyTestStyles = () => {
    const root = document.documentElement;
    root.removeAttribute('data-test-low-vision');
    root.removeAttribute('data-test-color-blind');
    root.removeAttribute('data-test-keyboard-only');
    root.removeAttribute('data-test-bright-light');
    root.removeAttribute('data-test-focus-visible');
    if (!isTestModeActive) return;
    testConditions.forEach(condition => {
      if (condition.active) root.setAttribute(`data-test-${condition.id}`, 'true');
    });
  };

  useEffect(() => { applyTestStyles(); }, [testConditions, isTestModeActive]);

  const activateTestMode = () => { setIsTestModeActive(true); applyTestStyles(); };
  const deactivateTestMode = () => {
    setIsTestModeActive(false);
    setTestConditions(prev => prev.map(c => ({ ...c, active: false })));
    const root = document.documentElement;
    ['low-vision', 'color-blind', 'keyboard-only', 'bright-light', 'focus-visible'].forEach(id => root.removeAttribute(`data-test-${id}`));
  };

  const activeConditionsCount = testConditions.filter(c => c.active).length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50">
            <TestTube className="h-3 w-3 mr-1" />
            {t.accessibilityTests}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              {t.testTitle}
              {isTestModeActive && <Badge variant="secondary" className="bg-purple-100 text-purple-800">{t.testActive}</Badge>}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <h3 className="font-medium text-purple-900">{t.testMode}</h3>
                <p className="text-sm text-purple-700">
                  {isTestModeActive ? t.testDeactivateAll : t.testSimulateConditions}
                </p>
              </div>
              <Switch checked={isTestModeActive} onCheckedChange={isTestModeActive ? deactivateTestMode : activateTestMode} />
            </div>

            {isTestModeActive && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-800">{t.testConditionsToSimulate}</h4>
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
                        <Switch checked={condition.active} onCheckedChange={() => toggleCondition(condition.id)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeConditionsCount > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>{t.testNote}</strong> {t.testSimulating} {activeConditionsCount} {activeConditionsCount !== 1 ? t.testConditions : t.testCondition} {t.testOfAccessibility} {t.testEffectsVisible}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isTestModeActive && activeConditionsCount > 0 && (
        <div className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            <span className="text-sm font-medium">
              {t.testModeLabel} {activeConditionsCount} {activeConditionsCount !== 1 ? t.testConditions : t.testCondition} {activeConditionsCount !== 1 ? t.testActivesLabel : t.testActiveLabel}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityTestMode;
