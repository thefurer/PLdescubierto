
import { Camera } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GalleryImage } from "@/data/galleryData";

type GalleryAccordionItemProps = {
  category: string;
  images: GalleryImage[];
  allImages: GalleryImage[];
  onImageClick: (globalIndex: number) => void;
};

const GalleryAccordionItem = ({ 
  category, 
  images, 
  allImages, 
  onImageClick 
}: GalleryAccordionItemProps) => {
  return (
    <AccordionItem 
      value={category}
      className="bg-white rounded-xl shadow-lg border-0 overflow-hidden"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean to-ocean-dark flex items-center justify-center">
            <Camera className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ocean-dark text-left">{category}</h3>
            <p className="text-sm text-gray-600 text-left">{images.length} imágenes</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => {
            const globalIndex = allImages.findIndex(img => img.id === image.id);
            return (
              <div 
                key={image.id} 
                className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
                onClick={() => onImageClick(globalIndex)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="text-white">
                    <p className="font-medium text-sm">{image.alt}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default GalleryAccordionItem;
