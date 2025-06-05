
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, Edit, Eye, Save, Loader2, Sparkles } from 'lucide-react';

interface SectionCardProps {
  section: any;
  editingSection: string | null;
  previewMode: string | null;
  saving: boolean;
  getSectionIcon: (sectionName: string) => React.ReactNode;
  getSectionTitle: (sectionName: string) => string;
  getSectionDescription: (sectionName: string) => string;
  getSectionColor: (sectionName: string) => string;
  handleEdit: (sectionName: string, content: any) => void;
  handlePreview: (sectionName: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  renderEditForm: (section: any) => React.ReactNode;
  renderPreview: (section: any, isEditing?: boolean) => React.ReactNode;
}

const SectionCard = ({
  section,
  editingSection,
  previewMode,
  saving,
  getSectionIcon,
  getSectionTitle,
  getSectionDescription,
  getSectionColor,
  handleEdit,
  handlePreview,
  handleSave,
  handleCancel,
  renderEditForm,
  renderPreview
}: SectionCardProps) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getSectionColor(section.section_name)} border-l-4`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/80 rounded-xl shadow-sm">
                {getSectionIcon(section.section_name)}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl text-gray-800">
                  {getSectionTitle(section.section_name)}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {getSectionDescription(section.section_name)}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                {new Date(section.updated_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {section.updated_by && (
                <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <User className="h-3 w-3" />
                  Usuario autorizado
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {editingSection !== section.section_name && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(section.section_name)}
                  className="bg-white/70 hover:bg-white border-blue-200 text-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {previewMode === section.section_name ? 'Ocultar' : 'Previsualizar'}
                </Button>
                <Button
                  onClick={() => handleEdit(section.section_name, section.content)}
                  className="bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {editingSection === section.section_name ? (
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/70">
              <TabsTrigger value="edit" className="data-[state=active]:bg-white">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-white">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-6 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
                {renderEditForm(section)}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-white/70 hover:bg-white border-gray-200"
                >
                  Cancelar
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-6">
              {renderPreview(section, true)}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {previewMode === section.section_name ? (
              renderPreview(section)
            ) : (
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Contenido actual:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(section.content).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                      <strong className="text-xs text-gray-500 capitalize block mb-1">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </strong>
                      <p className="text-sm text-gray-800 truncate" title={typeof value === 'string' ? value : JSON.stringify(value)}>
                        {typeof value === 'string' ? value : JSON.stringify(value)}
                      </p>
                    </div>
                  ))}
                </div>
                {Object.keys(section.content).length > 3 && (
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    +{Object.keys(section.content).length - 3} campos más...
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SectionCard;
