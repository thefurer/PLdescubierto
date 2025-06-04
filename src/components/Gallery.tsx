
import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentManager } from "@/hooks/useContentManager";
import { Accordion } from "@/components/ui/accordion";
import { galleryImages, groupImagesByCategory } from "@/data/galleryData";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import GalleryAccordionItem from "@/components/gallery/GalleryAccordionItem";

type GalleryProps = {
  className?: string;
};

const Gallery = ({ className }: GalleryProps) => {
  const { content } = useContentManager();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Find gallery content from database
  const galleryContent = content.find(item => item.section_name === 'gallery')?.content;

  // Gallery data with database content override
  const galleryData = {
    title: galleryContent?.title || "Galería Visual",
    description: galleryContent?.description || "Explora la belleza de Puerto López a través de nuestra galería de imágenes. Desde la vida marina hasta los paisajes naturales, cada imagen cuenta una historia única."
  };

  // Group images by category
  const groupedImages = groupImagesByCategory(galleryImages);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigateToImage = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <section 
      id="gallery" 
      className={cn("py-20 bg-ocean-light/30", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
            {galleryData.title.split(' ').map((word, index) => (
              <span key={index}>
                {index === galleryData.title.split(' ').length - 1 ? (
                  <span className="text-green-500">{word}</span>
                ) : (
                  word + ' '
                )}
              </span>
            ))}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {galleryData.description}
          </p>
        </div>

        {/* Gallery Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="multiple" className="space-y-4">
            {Object.entries(groupedImages).map(([category, images]) => (
              <GalleryAccordionItem
                key={category}
                category={category}
                images={images}
                allImages={galleryImages}
                onImageClick={openLightbox}
              />
            ))}
          </Accordion>
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <button className="px-6 py-3 rounded-full border-2 border-ocean text-ocean font-medium hover:bg-ocean hover:text-white transition-colors inline-flex items-center space-x-2">
            <Camera size={18} />
            <span>Ver galería completa</span>
          </button>
        </div>

        {/* Lightbox */}
        <GalleryLightbox
          isOpen={lightboxOpen}
          currentImageIndex={currentImageIndex}
          images={galleryImages}
          onClose={closeLightbox}
          onNavigate={navigateToImage}
          onImageSelect={setCurrentImageIndex}
        />
      </div>
    </section>
  );
};

export default Gallery;
