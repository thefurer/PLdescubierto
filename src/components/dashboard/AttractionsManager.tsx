
import { useState, useMemo } from 'react';
import { useTouristAttractions } from '@/hooks/useTouristAttractions';
import { TouristAttraction } from '@/types/touristAttractions';
import { Loader2, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AttractionsHeader from './attractions/AttractionsHeader';
import CategorySection from './attractions/CategorySection';

const AttractionsManager = () => {
  const { attractions, loading, saving, uploading, updateAttraction, uploadImage, deleteAttraction, createAttraction } = useTouristAttractions();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta atracción?')) {
      await deleteAttraction(id);
    }
  };

  const handleCreateNew = async () => {
    const newAttraction: Partial<TouristAttraction> = {
      name: 'Nueva Atracción',
      description: 'Descripción de la nueva atracción',
      category: 'todo',
      is_active: true,
      display_order: attractions.length + 1
    };
    
    try {
      const created = await createAttraction(newAttraction);
      setEditingId(created.id);
    } catch (error) {
      console.error('Error creating attraction:', error);
    }
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

  // Filter attractions based on search term
  const filteredAttractions = useMemo(() => {
    if (!searchTerm.trim()) return attractions;
    
    return attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attractions, searchTerm]);

  const groupedAttractions = filteredAttractions.reduce((acc, attraction) => {
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

      {/* Search Bar and Create Button */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar atracciones por nombre, descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleCreateNew}
          className="flex items-center gap-2"
          disabled={saving}
        >
          <Plus className="h-4 w-4" />
          Nueva Atracción
        </Button>
      </div>

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
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AttractionsManager;
