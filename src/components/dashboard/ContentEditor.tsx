
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentManager } from '@/hooks/useContentManager';
import { Loader2, Save, Edit, Eye, Clock, User, Sparkles, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import HeroPreview from '@/components/dashboard/content-previews/HeroPreview';
import FooterPreview from '@/components/dashboard/content-previews/FooterPreview';

interface ContentEditorProps {
  filterSection?: string;
}

const ContentEditor = ({ filterSection }: ContentEditorProps) => {
  const { content, loading, saving, updateContent, fetchContent } = useContentManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  // Filter content based on filterSection prop
  const filteredContent = filterSection 
    ? content.filter(item => item.section_name === filterSection)
    : content;

  const handleEdit = (sectionName: string, sectionContent: any) => {
    setEditingSection(sectionName);
    setFormData({ ...sectionContent });
    setPreviewMode(null);
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    await updateContent(editingSection, formData);
    setEditingSection(null);
    setFormData({});
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
    setPreviewMode(null);
  };

  const handlePreview = (sectionName: string) => {
    setPreviewMode(previewMode === sectionName ? null : sectionName);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return '🏠';
      case 'footer': return '📧';
      default: return '📄';
    }
  };

  const getSectionTitle = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return 'Sección de Portada';
      case 'footer': return 'Pie de Página';
      default: return sectionName.replace('_', ' ');
    }
  };

  const getSectionDescription = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return 'Sección principal con imagen de fondo y texto de bienvenida';
      case 'footer': return 'Información de contacto y datos de la empresa';
      default: return 'Sección de contenido del sitio web';
    }
  };

  const renderPreview = (section: any, isEditing: boolean = false) => {
    const previewContent = isEditing ? formData : section.content;
    
    switch (section.section_name) {
      case 'hero':
        return <HeroPreview content={previewContent} />;
      case 'footer':
        return <FooterPreview content={previewContent} />;
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold mb-3 text-gray-700">Vista Previa:</h4>
            <div className="space-y-3">
              {Object.entries(previewContent).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="text-sm text-gray-800 bg-white p-2 rounded border">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Cargando contenido...</p>
      </div>
    );
  }

  if (filteredContent.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Editor de Contenido
            </CardTitle>
            <CardDescription>
              {filterSection 
                ? `Edita el contenido de la sección: ${getSectionTitle(filterSection)}`
                : 'Edita el contenido de las diferentes secciones de tu sitio web'
              }
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            No hay contenido disponible para editar.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchContent}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Sparkles className="h-5 w-5 text-blue-500" />
            {filterSection ? getSectionTitle(filterSection) : 'Editor de Contenido'}
          </CardTitle>
          <CardDescription className="text-blue-700">
            {filterSection 
              ? `Edita el contenido de la sección: ${getSectionTitle(filterSection)}`
              : 'Edita el contenido de las diferentes secciones de tu sitio web en tiempo real'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-blue-600">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {filteredContent.length} {filteredContent.length === 1 ? 'sección disponible' : 'secciones disponibles'}
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Actualización en tiempo real
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredContent.map((section) => (
          <Card key={section.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSectionIcon(section.section_name)}</span>
                    <div>
                      <CardTitle className="text-xl">
                        {getSectionTitle(section.section_name)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getSectionDescription(section.section_name)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(section.updated_at).toLocaleString()}
                    </div>
                    {section.updated_by && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Editado por usuario
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
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {previewMode === section.section_name ? 'Ocultar' : 'Vista Previa'}
                      </Button>
                      <Button
                        onClick={() => handleEdit(section.section_name, section.content)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {editingSection === section.section_name ? (
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Editar</TabsTrigger>
                    <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit" className="space-y-4 mt-4">
                    {section.section_name === 'hero' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium">Título Principal</Label>
                            <Input
                              id="title"
                              value={formData.title || ''}
                              onChange={(e) => updateFormField('title', e.target.value)}
                              placeholder="Título del hero"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle" className="text-sm font-medium">Subtítulo</Label>
                            <Input
                              id="subtitle"
                              value={formData.subtitle || ''}
                              onChange={(e) => updateFormField('subtitle', e.target.value)}
                              placeholder="Subtítulo del hero"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                          <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => updateFormField('description', e.target.value)}
                            placeholder="Descripción del hero"
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="backgroundImage" className="text-sm font-medium">URL de Imagen de Fondo</Label>
                          <Input
                            id="backgroundImage"
                            value={formData.backgroundImage || ''}
                            onChange={(e) => updateFormField('backgroundImage', e.target.value)}
                            placeholder="https://..."
                            className="mt-1"
                          />
                        </div>
                      </>
                    )}

                    {section.section_name === 'footer' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="companyName" className="text-sm font-medium">Nombre de la Empresa</Label>
                            <Input
                              id="companyName"
                              value={formData.companyName || ''}
                              onChange={(e) => updateFormField('companyName', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email || ''}
                              onChange={(e) => updateFormField('email', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                          <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => updateFormField('description', e.target.value)}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
                            <Input
                              id="phone"
                              value={formData.phone || ''}
                              onChange={(e) => updateFormField('phone', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="address" className="text-sm font-medium">Dirección</Label>
                            <Input
                              id="address"
                              value={formData.address || ''}
                              onChange={(e) => updateFormField('address', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-4">
                    {renderPreview(section, true)}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-3">
                  {previewMode === section.section_name ? (
                    renderPreview(section)
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(section.content).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded border">
                          <strong className="text-xs text-gray-600 capitalize block mb-1">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </strong>
                          <p className="text-sm text-gray-800 truncate">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;
