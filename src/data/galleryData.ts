
export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export const galleryImages: GalleryImage[] = [
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

// Group images by category
export const groupImagesByCategory = (images: GalleryImage[]) => {
  return images.reduce((acc, image) => {
    if (!acc[image.category]) {
      acc[image.category] = [];
    }
    acc[image.category].push(image);
    return acc;
  }, {} as Record<string, GalleryImage[]>);
};
