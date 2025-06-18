
import { useState } from 'react';
import { useTouristAttractions } from '@/hooks/useTouristAttractions';
import { TouristAttraction } from '@/types/touristAttractions';
import { Loader2 } from 'lucide-react';
import AttractionsHeader from './attractions/AttractionsHeader';
import CategorySection from './attractions/CategorySection';

const AttractionsManager = () => {
  const { attractions, loading, saving, uploading, updateAttraction, uploadImage } = useTouristAttractions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleEdit = (attraction: TouristAttraction) => {
    setEditingId(attraction.id);
  };

  const handleSave = async (id: string, updates: Partial<TouristAttraction>) => {
    await updateAttraction(id, updates);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleUploadImage = async (file: File, attractionId: string) => {
    return await uploadImage(file, attractionId);
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const groupedAttractions = attractions.reduce((acc, attraction) => {
    if (!acc[attraction.category]) {
      acc[attraction.category] = [];
    }
    acc[attraction.category].push(attraction);
    return acc;
  }, {} as Record<string, typeof attractions>);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Cargando atracciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttractionsHeader attractionsCount={attractions.length} />

      <div className="space-y-4">
        {Object.entries(groupedAttractions).map(([category, categoryAttractions]) => (
          <CategorySection
            key={category}
            category={category}
            attractions={categoryAttractions}
            isOpen={openItems.has(category)}
            onToggle={() => toggleItem(category)}
            editingId={editingId}
            saving={saving}
            uploading={uploading}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onUploadImage={handleUploadImage}
          />
        ))}
      </div>
    </div>
  );
};

export default AttractionsManager;
