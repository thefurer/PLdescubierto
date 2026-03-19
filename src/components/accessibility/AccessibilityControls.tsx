
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Underline, Focus, Keyboard, RotateCcw } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useTranslations } from '@/hooks/useTranslations';
import LanguageToggle from './LanguageToggle';
import FontSizeControls from './FontSizeControls';
import ScreenReaderControls from './ScreenReaderControls';
import AccessibilityGuide from './AccessibilityGuide';
import AccessibilityTestMode from './AccessibilityTestMode';

interface AccessibilityControlsProps {
  compact?: boolean;
}

const AccessibilityControls = ({ compact = false }: AccessibilityControlsProps) => {
  const { 
    settings, 
    toggleHighContrast, 
    toggleUnderlineLinks,
    resetSettings,
    updateSettings 
  } = useAccessibility();
  const t = useTranslations();

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{t.accessibilityLanguage}</span>
          <LanguageToggle compact />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{t.accessibilityFont}</span>
          <FontSizeControls compact />
        </div>

        <div className="grid grid-cols-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="h-8 text-xs"
                aria-pressed={settings.highContrast}
              >
                <Eye className="h-3 w-3 mr-1" />
                {t.accessibilityContrast}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.accessibilityHighContrastDesc}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.underlineLinks ? "default" : "outline"}
                size="sm"
                onClick={toggleUnderlineLinks}
                className="h-8 text-xs"
                aria-pressed={settings.underlineLinks}
              >
                <Underline className="h-3 w-3 mr-1" />
                {t.accessibilityLinks}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.accessibilityUnderlineLinksDesc}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className="h-8 text-xs"
                aria-pressed={settings.reducedMotion}
              >
                <Focus className="h-3 w-3 mr-1" />
                {t.accessibilityNoAnim}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t.accessibilityReduceAnimationsDesc}</p>
            </TooltipContent>
          </Tooltip>

          <ScreenReaderControls compact />
        </div>

        <div className="flex gap-1 pt-2 border-t border-slate-200">
          <AccessibilityGuide />
          <AccessibilityTestMode />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetSettings}
          className="w-full h-6 text-xs text-orange-600 hover:text-orange-700"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          {t.accessibilityRestore}
        </Button>
      </div>
    );
  }

  return (
    <div id="accessibility-options" className="space-y-3 animate-fade-in">
      <LanguageToggle />
      <FontSizeControls />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={settings.highContrast ? "default" : "outline"}
            size="sm"
            onClick={toggleHighContrast}
            className="w-full justify-start"
            aria-pressed={settings.highContrast}
            aria-label={t.accessibilityHighContrast}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t.accessibilityHighContrast} {settings.highContrast && '✓'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.accessibilityHighContrastDesc}</p>
          <p className="text-xs text-slate-400">{t.accessibilityHighContrastHint}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={settings.underlineLinks ? "default" : "outline"}
            size="sm"
            onClick={toggleUnderlineLinks}
            className="w-full justify-start"
            aria-pressed={settings.underlineLinks}
            aria-label={t.accessibilityUnderlineLinks}
          >
            <Underline className="h-4 w-4 mr-2" />
            {t.accessibilityUnderlineLinks} {settings.underlineLinks && '✓'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.accessibilityUnderlineLinksDesc}</p>
          <p className="text-xs text-slate-400">{t.accessibilityUnderlineLinksHint}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={settings.reducedMotion ? "default" : "outline"}
            size="sm"
            onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
            className="w-full justify-start"
            aria-pressed={settings.reducedMotion}
            aria-label={t.accessibilityReduceAnimations}
          >
            <Focus className="h-4 w-4 mr-2" />
            {t.accessibilityReduceAnimations} {settings.reducedMotion && '✓'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.accessibilityReduceAnimationsDesc}</p>
          <p className="text-xs text-slate-400">{t.accessibilityReduceAnimationsHint}</p>
        </TooltipContent>
      </Tooltip>

      <ScreenReaderControls />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={settings.focusIndicators ? "default" : "outline"}
            size="sm"
            onClick={() => updateSettings({ focusIndicators: !settings.focusIndicators })}
            className="w-full justify-start"
            aria-pressed={settings.focusIndicators}
            aria-label={t.accessibilityFocusVisible}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            {t.accessibilityFocusVisible} {settings.focusIndicators && '✓'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t.accessibilityFocusDesc}</p>
          <p className="text-xs text-slate-400">{t.accessibilityFocusHint}</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <AccessibilityGuide />
        <AccessibilityTestMode />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={resetSettings}
        className="w-full justify-start text-orange-600 hover:text-orange-700"
        aria-label={t.accessibilityRestoreLabel}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        {t.accessibilityRestore}
      </Button>
    </div>
  );
};

export default AccessibilityControls;
