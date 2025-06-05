
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentManager } from '@/hooks/useContentManager';
import { Loader2, Save, Edit, Eye, Clock, User, Sparkles, RefreshCw, Globe, Palette, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import HeroPreview from '@/components/dashboard/content-previews/HeroPreview';
import FooterPreview from '@/components/dashboard/content-previews/FooterPreview';
import ImageUploader from '@/components/dashboard/ImageUploader';

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

  const handleImageUpload = (imageUrl: string) => {
    updateFormField('backgroundImage', imageUrl);
  };

  const getSectionIcon = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return <Globe className="h-6 w-6 text-blue-500" />;
      case 'footer': return <Palette className="h-6 w-6 text-green-500" />;
      default: return <Zap className="h-6 w-6 text-purple-500" />;
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

  const getSectionColor = (sectionName: string) => {
    switch (sectionName) {
      case 'hero': return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'footer': return 'from-green-50 to-emerald-50 border-green-200';
      default: return 'from-purple-50 to-pink-50 border-purple-200';
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
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </h4>
            <div className="grid gap-4">
              {Object.entries(previewContent).map(([key, value]) => (
                <div key={key} className="group">
                  <span className="text-xs font-medium text-gray-500 capitalize mb-2 block">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 group-hover:border-blue-200 transition-colors">
                    <span className="text-sm text-gray-800">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </span>
                  </div>
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
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-700">Cargando contenido...</p>
          <p className="text-sm text-gray-500">Preparando el editor para ti</p>
        </div>
      </div>
    );
  }

  if (filteredContent.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
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
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
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
                {filteredContent.length} {filteredContent.length === 1 ? 'sección' : 'secciones'}
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

      {/* Content Sections */}
      <div className="grid gap-8">
        {filteredContent.map((section) => (
          <Card key={section.id} className={`transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getSectionColor(section.section_name)} border-l-4`}>
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
                      {section.section_name === 'hero' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                                Título Principal
                              </Label>
                              <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => updateFormField('title', e.target.value)}
                                placeholder="Título del hero"
                                className="bg-white border-gray-200 focus:border-blue-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700">
                                Subtítulo
                              </Label>
                              <Input
                                id="subtitle"
                                value={formData.subtitle || ''}
                                onChange={(e) => updateFormField('subtitle', e.target.value)}
                                placeholder="Subtítulo del hero"
                                className="bg-white border-gray-200 focus:border-blue-400"
                              />
                            </div>
                          </div>
                          <div className="mb-6">
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                              Descripción
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              placeholder="Descripción del hero"
                              rows={3}
                              className="mt-2 bg-white border-gray-200 focus:border-blue-400"
                            />
                          </div>
                          
                          <Separator className="my-6" />
                          
                          {/* Image Upload Section */}
                          <ImageUploader
                            onImageUploaded={handleImageUpload}
                            currentImageUrl={formData.backgroundImage}
                            disabled={saving}
                          />
                          
                          <Separator className="my-6" />
                          
                          <div className="space-y-2">
                            <Label htmlFor="backgroundImage" className="text-sm font-semibold text-gray-700">
                              O usar URL de imagen externa
                            </Label>
                            <Input
                              id="backgroundImage"
                              value={formData.backgroundImage || ''}
                              onChange={(e) => updateFormField('backgroundImage', e.target.value)}
                              placeholder="https://ejemplo.com/imagen.jpg"
                              className="bg-white border-gray-200 focus:border-blue-400"
                            />
                          </div>
                        </>
                      )}

                      {section.section_name === 'footer' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                                Nombre de la Empresa
                              </Label>
                              <Input
                                id="companyName"
                                value={formData.companyName || ''}
                                onChange={(e) => updateFormField('companyName', e.target.value)}
                                className="bg-white border-gray-200 focus:border-green-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Correo Electrónico
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => updateFormField('email', e.target.value)}
                                className="bg-white border-gray-200 focus:border-green-400"
                              />
                            </div>
                          </div>
                          <div className="mb-6">
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                              Descripción
                            </Label>
                            <Textarea
                              id="description"
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              rows={3}
                              className="mt-2 bg-white border-gray-200 focus:border-green-400"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                                Teléfono
                              </Label>
                              <Input
                                id="phone"
                                value={formData.phone || ''}
                                onChange={(e) => updateFormField('phone', e.target.value)}
                                className="bg-white border-gray-200 focus:border-green-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                                Dirección
                              </Label>
                              <Input
                                id="address"
                                value={formData.address || ''}
                                onChange={(e) => updateFormField('address', e.target.value)}
                                className="bg-white border-gray-200 focus:border-green-400"
                              />
                            </div>
                          </div>
                        </>
                      )}
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
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;
