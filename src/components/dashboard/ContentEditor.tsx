
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentManager } from '@/hooks/useContentManager';
import { Loader2, Save } from 'lucide-react';

const ContentEditor = () => {
  const { content, loading, saving, updateContent } = useContentManager();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleEdit = (sectionName: string, sectionContent: any) => {
    setEditingSection(sectionName);
    setFormData({ ...sectionContent });
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
  };

  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <CardTitle>Editor de Contenido</CardTitle>
          <CardDescription>
            Edita el contenido de las diferentes secciones de tu sitio web
          </CardDescription>
        </CardHeader>
      </Card>

      {content.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="capitalize">
                  {section.section_name.replace('_', ' ')}
                </CardTitle>
                <CardDescription>
                  Última actualización: {new Date(section.updated_at).toLocaleString()}
                </CardDescription>
              </div>
              {editingSection !== section.section_name && (
                <Button
                  onClick={() => handleEdit(section.section_name, section.content)}
                >
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === section.section_name ? (
              <div className="space-y-4">
                {section.section_name === 'hero' && (
                  <>
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => updateFormField('title', e.target.value)}
                        placeholder="Título del hero"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subtitle">Subtítulo</Label>
                      <Textarea
                        id="subtitle"
                        value={formData.subtitle || ''}
                        onChange={(e) => updateFormField('subtitle', e.target.value)}
                        placeholder="Subtítulo del hero"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="backgroundImage">URL de Imagen de Fondo</Label>
                      <Input
                        id="backgroundImage"
                        value={formData.backgroundImage || ''}
                        onChange={(e) => updateFormField('backgroundImage', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {section.section_name === 'footer' && (
                  <>
                    <div>
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName || ''}
                        onChange={(e) => updateFormField('companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => updateFormField('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateFormField('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => updateFormField('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => updateFormField('address', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {section.section_name === 'gallery' && (
                  <>
                    <div>
                      <Label htmlFor="title">Título de la Galería</Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => updateFormField('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ''}
                        onChange={(e) => updateFormField('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(section.content).map(([key, value]) => (
                  <div key={key}>
                    <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>
                    <p className="text-gray-600 mt-1">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentEditor;
