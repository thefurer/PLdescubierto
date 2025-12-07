import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Download, FileText, Loader2, Code } from 'lucide-react';
import { generateUserManualPDF } from './UserManualGenerator';
import { generateTechnicalDocPDF } from './TechnicalDocGenerator';
import { toast } from 'sonner';

const ResourcesDropdown = () => {
  const [isGeneratingManual, setIsGeneratingManual] = useState(false);
  const [isGeneratingTechDoc, setIsGeneratingTechDoc] = useState(false);

  const handleDownloadManual = async () => {
    setIsGeneratingManual(true);
    try {
      await generateUserManualPDF();
      toast.success('Manual de usuario descargado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el manual. Intente nuevamente.');
    } finally {
      setIsGeneratingManual(false);
    }
  };

  const handleDownloadTechDoc = async () => {
    setIsGeneratingTechDoc(true);
    try {
      await generateTechnicalDocPDF();
      toast.success('Documentación técnica descargada correctamente');
    } catch (error) {
      console.error('Error generating technical doc PDF:', error);
      toast.error('Error al generar la documentación. Intente nuevamente.');
    } finally {
      setIsGeneratingTechDoc(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
        >
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Recursos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border shadow-lg z-50">
        <DropdownMenuItem
          onClick={handleDownloadManual}
          disabled={isGeneratingManual}
          className="cursor-pointer gap-3 py-3 hover:bg-primary/10 transition-colors"
        >
          {isGeneratingManual ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Download className="h-4 w-4 text-primary" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">Manual de Usuario</span>
            <span className="text-xs text-muted-foreground">
              {isGeneratingManual ? 'Generando PDF...' : 'Guía completa de uso'}
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleDownloadTechDoc}
          disabled={isGeneratingTechDoc}
          className="cursor-pointer gap-3 py-3 hover:bg-accent/10 transition-colors"
        >
          {isGeneratingTechDoc ? (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          ) : (
            <Code className="h-4 w-4 text-accent" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">Documentación Técnica</span>
            <span className="text-xs text-muted-foreground">
              {isGeneratingTechDoc ? 'Generando PDF...' : 'Para desarrolladores'}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourcesDropdown;
