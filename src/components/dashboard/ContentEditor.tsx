
import { useState } from 'react';
import { useContentManager } from '@/hooks/useContentManager';
import { Globe, Palette, Zap, Eye } from 'lucide-react';
import HeroPreview from '@/components/dashboard/content-previews/HeroPreview';
import FooterPreview from '@/components/dashboard/content-previews/FooterPreview';
import ContentEditorHeader from '@/components/dashboard/content-editor/ContentEditorHeader';
import SectionCard from '@/components/dashboard/content-editor/SectionCard';
import HeroEditForm from '@/components/dashboard/content-editor/HeroEditForm';
import FooterEditForm from '@/components/dashboard/content-editor/FooterEditForm';
import EmptyState from '@/components/dashboard/content-editor/EmptyState';
import LoadingState from '@/components/dashboard/content-editor/LoadingState';

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

  const renderEditForm = (section: any) => {
    if (section.section_name === 'hero') {
      return (
        <HeroEditForm 
          formData={formData}
          updateFormField={updateFormField}
          handleImageUpload={handleImageUpload}
          saving={saving}
        />
      );
    }

    if (section.section_name === 'footer') {
      return (
        <FooterEditForm 
          formData={formData}
          updateFormField={updateFormField}
        />
      );
    }

    return null;
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
    return <LoadingState />;
  }

  if (filteredContent.length === 0) {
    return (
      <EmptyState 
        filterSection={filterSection}
        getSectionTitle={getSectionTitle}
        getSectionColor={getSectionColor}
        fetchContent={fetchContent}
      />
    );
  }

  return (
    <div className="space-y-8">
      <ContentEditorHeader 
        filterSection={filterSection}
        contentCount={filteredContent.length}
        getSectionTitle={getSectionTitle}
        getSectionDescription={getSectionDescription}
        getSectionColor={getSectionColor}
      />

      <div className="grid gap-8">
        {filteredContent.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            editingSection={editingSection}
            previewMode={previewMode}
            saving={saving}
            getSectionIcon={getSectionIcon}
            getSectionTitle={getSectionTitle}
            getSectionDescription={getSectionDescription}
            getSectionColor={getSectionColor}
            handleEdit={handleEdit}
            handlePreview={handlePreview}
            handleSave={handleSave}
            handleCancel={handleCancel}
            renderEditForm={renderEditForm}
            renderPreview={renderPreview}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;
