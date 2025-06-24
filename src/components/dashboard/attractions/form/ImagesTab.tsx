
import GalleryImageManager from '../GalleryImageManager';

interface ImagesTabProps {
  attractionId: string;
  currentImageUrl: string;
  currentGalleryImages: string[];
  isUploading: boolean;
  onImageUpdate: (imageUrl: string) => void;
  onGalleryUpdate: (images: string[]) => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const ImagesTab = ({
  attractionId,
  currentGalleryImages,
  isUploading,
  onGalleryUpdate,
  onUploadImage
}: ImagesTabProps) => {
  return (
    <div className="space-y-4">
      <GalleryImageManager
        attractionId={attractionId}
        currentImages={currentGalleryImages}
        isUploading={isUploading}
        onImagesUpdate={onGalleryUpdate}
        onUploadImage={onUploadImage}
      />
    </div>
  );
};

export default ImagesTab;
