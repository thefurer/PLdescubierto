
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  filterSection?: string;
  getSectionTitle: (section: string) => string;
  getSectionColor: (section: string) => string;
  fetchContent: () => void;
}

const EmptyState = ({ filterSection, getSectionTitle, getSectionColor, fetchContent }: EmptyStateProps) => {
  return (
    <div className="space-y-6">
      <Card className={`bg-gradient-to-r ${getSectionColor(filterSection || 'hero')} border-blue-200`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            Editor de Contenido
          </CardTitle>
          <CardDescription className="text-blue-700">
            {filterSection 
              ? `Edita el contenido de la sección: ${getSectionTitle(filterSection)}`
              : 'Edita el contenido de las diferentes secciones de tu sitio web'
            }
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Alert className="border-amber-200 bg-amber-50">
        <AlertDescription className="flex items-center justify-between text-amber-800">
          <span>No hay contenido disponible para editar.</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchContent}
            className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmptyState;
