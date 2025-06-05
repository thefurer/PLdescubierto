
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Zap, Eye } from 'lucide-react';

interface ContentEditorHeaderProps {
  filterSection?: string;
  contentCount: number;
  getSectionTitle: (section: string) => string;
  getSectionDescription: (section: string) => string;
  getSectionColor: (section: string) => string;
}

const ContentEditorHeader = ({ 
  filterSection, 
  contentCount, 
  getSectionTitle, 
  getSectionDescription, 
  getSectionColor 
}: ContentEditorHeaderProps) => {
  return (
    <Card className={`bg-gradient-to-r ${getSectionColor(filterSection || 'hero')} shadow-lg`}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                <Sparkles className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                {filterSection ? getSectionTitle(filterSection) : 'Editor de Contenido'}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/70 text-blue-700 border-blue-200">
                    <Zap className="h-3 w-3 mr-1" />
                    Tiempo Real
                  </Badge>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              {filterSection 
                ? getSectionDescription(filterSection)
                : 'Gestiona y actualiza el contenido de tu sitio web con facilidad'
              }
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Eye className="h-4 w-4" />
            <span className="font-medium">
              {contentCount} {contentCount === 1 ? 'sección' : 'secciones'}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 text-green-600">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema activo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEditorHeader;
