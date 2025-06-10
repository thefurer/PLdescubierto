
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import AttractionEditForm from './AttractionEditForm';
import AttractionDisplay from './AttractionDisplay';

interface AttractionCardProps {
  attraction: TouristAttraction;
  isEditing: boolean;
  isSaving: boolean;
  isUploading: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TouristAttraction>) => Promise<void>;
  onCancel: () => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const AttractionCard = ({ 
  attraction, 
  isEditing, 
  isSaving,
  isUploading,
  onEdit, 
  onSave, 
  onCancel,
  onUploadImage
}: AttractionCardProps) => {
  if (isEditing) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <AttractionEditForm
            attraction={attraction}
            isSaving={isSaving}
            isUploading={isUploading}
            onSave={onSave}
            onCancel={onCancel}
            onUploadImage={onUploadImage}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <AttractionDisplay
          attraction={attraction}
          onEdit={onEdit}
        />
      </CardContent>
    </Card>
  );
};

export default AttractionCard;
