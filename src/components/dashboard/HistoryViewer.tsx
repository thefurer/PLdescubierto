
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, RotateCcw, User, Calendar, FileText, Palette, Navigation, Image, MousePointer, Type } from 'lucide-react';
import { useContentHistory } from '@/hooks/useContentHistory';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const HistoryViewer = () => {
  const { history, loading, revertToVersion } = useContentHistory();

  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes('color_palette')) return <Palette className="h-4 w-4 text-blue-500" />;
    if (sectionName.includes('navbar_settings')) return <Navigation className="h-4 w-4 text-green-500" />;
    if (sectionName.includes('logo_settings')) return <Image className="h-4 w-4 text-pink-500" />;
    if (sectionName.includes('button_styles')) return <MousePointer className="h-4 w-4 text-purple-500" />;
    if (sectionName.includes('typography')) return <Type className="h-4 w-4 text-orange-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'update':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeTypeText = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'Creado';
      case 'update':
        return 'Actualizado';
      case 'delete':
        return 'Eliminado';
      default:
        return changeType;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Cambios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">Cargando historial...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px]">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          Historial de Cambios
        </CardTitle>
        <CardDescription>
          Registro completo de todas las modificaciones realizadas en el sitio
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <History className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No hay historial disponible</h3>
              <p className="text-sm text-gray-500">Los cambios que realices aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-0">
              {history.map((item, index) => (
                <div key={item.id}>
                  <div className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getSectionIcon(item.section_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {(item as any).section_display_name || item.section_name}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-2 py-0.5 ${getChangeTypeColor(item.change_type)}`}
                            >
                              {getChangeTypeText(item.change_type)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.changed_by_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDistanceToNow(new Date(item.changed_at), { 
                                  addSuffix: true, 
                                  locale: es 
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Show preview of changes for visual config */}
                          {item.section_name.startsWith('visual_config_') && item.new_content && (
                            <div className="text-xs text-gray-500 bg-gray-50 rounded p-2 mt-2">
                              <strong>Cambios realizados:</strong>
                              <pre className="mt-1 whitespace-pre-wrap font-mono text-xs max-h-20 overflow-y-auto">
                                {JSON.stringify(item.new_content, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.old_content && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revertToVersion(item)}
                          className="ml-2 h-8 px-3 text-xs"
                          title="Revertir a esta versión"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Revertir
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < history.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryViewer;
