import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Download, FileText, Loader2 } from 'lucide-react';
import { generateUserManualPDF } from './UserManualGenerator';
import { toast } from 'sonner';

const ResourcesDropdown = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadManual = async () => {
    setIsGenerating(true);
    try {
      await generateUserManualPDF();
      toast.success('Manual de usuario descargado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el manual. Intente nuevamente.');
    } finally {
      setIsGenerating(false);
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
      <DropdownMenuContent align="end" className="w-56 bg-card border shadow-lg z-50">
        <DropdownMenuItem
          onClick={handleDownloadManual}
          disabled={isGenerating}
          className="cursor-pointer gap-3 py-3 hover:bg-primary/10 transition-colors"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Download className="h-4 w-4 text-primary" />
          )}
          <div className="flex flex-col">
            <span className="font-medium">Manual de Usuario</span>
            <span className="text-xs text-muted-foreground">
              {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-3 py-3 hover:bg-primary/10 transition-colors"
          onClick={() => window.open('/docs/ADMIN_PANEL_TECHNICAL_DOCUMENTATION.md', '_blank')}
        >
          <FileText className="h-4 w-4 text-accent" />
          <div className="flex flex-col">
            <span className="font-medium">Documentación Técnica</span>
            <span className="text-xs text-muted-foreground">Ver documentación</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourcesDropdown;
