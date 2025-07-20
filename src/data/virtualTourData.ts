
export interface VirtualTourLocation {
  id: number;
  name: string;
  image: string;
  description: string;
}

export const getVirtualTourLocations = (language: 'es' | 'en'): VirtualTourLocation[] => [
  {
    id: 1,
    name: "Plaza Central Virtual",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
    description: language === 'es' 
      ? "Explora el centro del metaverso de Puerto López, donde puedes interactuar con otros visitantes virtuales."
      : "Explore the center of Puerto López's metaspace, where you can interact with other virtual visitors."
  },
  {
    id: 2,
    name: "Galería Digital 3D",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
    description: language === 'es'
      ? "Una galería inmersiva en 3D donde puedes caminar entre las obras de arte y fotografías de Puerto López."
      : "An immersive 3D gallery where you can walk among artworks and photographs of Puerto López."
  },
  {
    id: 3,
    name: "Teatro Virtual",
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
    description: language === 'es'
      ? "Asiste a presentaciones en vivo sobre la historia y cultura de Puerto López en nuestro teatro virtual."
      : "Attend live presentations about Puerto López's history and culture in our virtual theater."
  },
  {
    id: 4,
    name: "Mirador 360°",
    image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80",
    description: language === 'es'
      ? "Disfruta de vistas panorámicas de 360° de los paisajes más hermosos de Puerto López."
      : "Enjoy 360° panoramic views of Puerto López's most beautiful landscapes."
  }
];

export const virtualTourTexts = {
  es: {
    title: "Experiencia en el",
    subtitle: "Metaverso",
    description: "Sumérgete en nuestro metaespacio interactivo de Puerto López. Una experiencia inmersiva donde puedes explorar y conocer las maravillas del Cantón",
    enterMetaverse: "Entrar al Metaverso",
    exploreSpace: "Explorar Espacio",
    highlights: "Características del Metaespacio",
    tips: "Guía del Metaverso",
    tip1: "Usa auriculares VR para una experiencia completamente inmersiva",
    tip2: "Interactúa con otros visitantes usando tu avatar personalizado",
    tip3: "Explora diferentes áreas usando los portales de teletransporte",
    interactive: "Experiencias Interactivas",
    interactiveDesc: "Participa en tours guiados, eventos en vivo y actividades sociales en el metaespacio.",
    social: "Conexiones Sociales",
    socialDesc: "Conoce a otros amantes de Puerto López y comparte experiencias en tiempo real.",
    immersive: "Tecnología Inmersiva",
    immersiveDesc: "Experimenta Puerto López como nunca antes con gráficos 3D realistas y audio espacial.",
    explore: "Explorar"
  },
  en: {
    title: "Metaverse",
    subtitle: "Experience",
    description: "Dive into our interactive Puerto López metaspace. An immersive experience where you can explore, socialize and discover from anywhere in the world.",
    enterMetaverse: "Enter Metaverse",
    exploreSpace: "Explore Space",
    highlights: "Metaspace Features",
    tips: "Metaverse Guide",
    tip1: "Use VR headset for a completely immersive experience",
    tip2: "Interact with other visitors using your personalized avatar",
    tip3: "Explore different areas using teleportation portals",
    interactive: "Interactive Experiences",
    interactiveDesc: "Participate in guided tours, live events and social activities in the metaspace.",
    social: "Social Connections",
    socialDesc: "Meet other Puerto López lovers and share real-time experiences.",
    immersive: "Immersive Technology",
    immersiveDesc: "Experience Puerto López like never before with realistic 3D graphics and spatial audio.",
    explore: "Explore"
  }
};
