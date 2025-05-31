
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContentManager } from "@/hooks/useContentManager";

type GalleryProps = {
  className?: string;
};

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80",
    alt: "Humpback whale jumping out of water",
    category: "Wildlife"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80",
    alt: "Beautiful ocean wave at Los Frailes beach",
    category: "Beach"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
    alt: "Local cultural site in Puerto Lopez",
    category: "Culture"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
    alt: "River between mountains in Machalilla National Park",
    category: "Nature"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1587559070757-b4efd8be928d?auto=format&fit=crop&q=80",
    alt: "Lush ecological trail through the jungle",
    category: "Nature"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80",
    alt: "Deer in natural habitat of Machalilla National Park",
    category: "Wildlife"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1606545609115-f55737664c3b?auto=format&fit=crop&q=80",
    alt: "Fresh seafood dish from local restaurant",
    category: "Cuisine"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
    alt: "Whale watching tour boat near humpback whale",
    category: "Activity"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1621335829175-95205d9b3229?auto=format&fit=crop&q=80",
    alt: "Rock formations at El Sombrerito Beach",
    category: "Nature"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1516715021267-d7c2873a369b?auto=format&fit=crop&q=80",
    alt: "Boat excursion to Isla de la Plata",
    category: "Activity"
  }
];

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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="text-white">
                  <div className="inline-block px-3 py-1 bg-ocean-dark/70 rounded-full text-xs mb-2">
                    {image.category}
                  </div>
                  <p className="font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-10">
          <button className="px-6 py-3 rounded-full border-2 border-ocean text-ocean font-medium hover:bg-ocean hover:text-white transition-colors inline-flex items-center space-x-2">
            <Camera size={18} />
            <span>Ver galería completa</span>
          </button>
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
            <button 
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={() => navigateToImage("prev")}
            >
              <ChevronLeft size={48} />
            </button>
            
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={() => navigateToImage("next")}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="relative max-w-5xl max-h-[80vh]">
              <img 
                src={galleryImages[currentImageIndex].src} 
                alt={galleryImages[currentImageIndex].alt} 
                className="max-h-[80vh] max-w-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                <p className="font-medium">{galleryImages[currentImageIndex].alt}</p>
                <p className="text-sm text-gray-300">{galleryImages[currentImageIndex].category}</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
              {galleryImages.map((_, index) => (
                <button 
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full",
                    index === currentImageIndex ? "bg-white" : "bg-gray-500 hover:bg-gray-400"
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
