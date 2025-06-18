
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContentHistory } from '@/hooks/useContentHistory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RotateCcw, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HistoryViewer = () => {
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const { history, loading, revertToVersion } = useContentHistory(selectedSection === 'all' ? undefined : selectedSection);

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeText = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'Creado';
      case 'update': return 'Actualizado';
      case 'delete': return 'Eliminado';
      default: return changeType;
    }
  };

  const getSectionDisplayName = (sectionName: string) => {
    const sectionNames: Record<string, string> = {
      'hero': 'Hero',
      'footer': 'Footer',
      'gallery': 'Galería',
      'tourist_attractions': 'Atracciones Turísticas'
    };
    return sectionNames[sectionName] || sectionName.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mi Historial de Cambios</CardTitle>
          <CardDescription>
            Revisa y revierte cambios que has realizado en el contenido y atracciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por sección (todas)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las secciones</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                  <SelectItem value="footer">Footer</SelectItem>
                  <SelectItem value="gallery">Galería</SelectItem>
                  <SelectItem value="tourist_attractions">Atracciones Turísticas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No tienes cambios registrados</p>
            <p className="text-sm text-gray-400 mt-2">Los cambios que realices aparecerán aquí</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {getSectionDisplayName(item.section_name)}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className={getChangeTypeColor(item.change_type)}>
                        {getChangeTypeText(item.change_type)}
                      </Badge>
                      {item.changed_by_name && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{item.changed_by_name}</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(item.changed_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  {item.old_content && item.section_name !== 'tourist_attractions' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revertToVersion(item)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Revertir
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.old_content && (
                    <div>
                      <h4 className="font-semibold text-sm text-red-600 mb-2">Contenido Anterior</h4>
                      <pre className="text-xs bg-red-50 p-3 rounded border overflow-auto max-h-32">
                        {typeof item.old_content === 'string' 
                          ? item.old_content 
                          : JSON.stringify(item.old_content, null, 2)}
                      </pre>
                    </div>
                  )}
                  {item.new_content && (
                    <div>
                      <h4 className="font-semibold text-sm text-green-600 mb-2">Contenido Nuevo</h4>
                      <pre className="text-xs bg-green-50 p-3 rounded border overflow-auto max-h-32">
                        {typeof item.new_content === 'string' 
                          ? item.new_content 
                          : JSON.stringify(item.new_content, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                {item.section_name === 'tourist_attractions' && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    💡 Los cambios en atracciones turísticas solo pueden ser revertidos editando directamente la atracción en la sección de gestión.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryViewer;
