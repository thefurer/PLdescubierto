
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';

interface AttractionDisplayProps {
  attraction: TouristAttraction;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa",
  cultura: "Cultura", 
  naturaleza: "Naturaleza"
};

const AttractionDisplay = ({ attraction, onEdit, onDelete }: AttractionDisplayProps) => {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{attraction.name}</h3>
            <Badge variant="outline" className="text-xs">
              {categoryLabels[attraction.category as keyof typeof categoryLabels]}
            </Badge>
          </div>
          {attraction.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{attraction.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {attraction.image_url && (
        <div className="mt-3">
          <img 
            src={attraction.image_url} 
            alt={attraction.name}
            className="w-full h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Última actualización: {new Date(attraction.updated_at).toLocaleDateString()}
      </div>
    </>
  );
};

export default AttractionDisplay;
