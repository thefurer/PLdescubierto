
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import AttractionCard from './AttractionCard';

interface CategorySectionProps {
  category: string;
  attractions: TouristAttraction[];
  isOpen: boolean;
  onToggle: () => void;
  editingId: string | null;
  saving: boolean;
  uploading: boolean;
  onEdit: (attraction: TouristAttraction) => void;
  onSave: (id: string, updates: Partial<TouristAttraction>) => void;
  onCancel: () => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa",
  cultura: "Cultura", 
  naturaleza: "Naturaleza"
};

const CategorySection = ({ 
  category, 
  attractions, 
  isOpen, 
  onToggle, 
  editingId, 
  saving,
  uploading,
  onEdit, 
  onSave, 
  onCancel,
  onUploadImage
}: CategorySectionProps) => {
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <CardTitle className="capitalize text-xl">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </CardTitle>
                </div>
                <Badge variant="outline">
                  {attractions.length} atracciones
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {attractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  isEditing={editingId === attraction.id}
                  isSaving={saving}
                  isUploading={uploading}
                  onEdit={() => onEdit(attraction)}
                  onSave={(updates) => onSave(attraction.id, updates)}
                  onCancel={onCancel}
                  onUploadImage={onUploadImage}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CategorySection;
