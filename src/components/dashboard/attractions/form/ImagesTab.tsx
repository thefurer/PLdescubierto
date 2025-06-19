
import AttractionImageManager from '../AttractionImageManager';
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
  currentImageUrl,
  currentGalleryImages,
  isUploading,
  onImageUpdate,
  onGalleryUpdate,
  onUploadImage
}: ImagesTabProps) => {
  return (
    <div className="space-y-4">
      <AttractionImageManager
        currentImageUrl={currentImageUrl}
        attractionId={attractionId}
        isUploading={isUploading}
        onImageUpdate={onImageUpdate}
        onUploadImage={onUploadImage}
      />

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
