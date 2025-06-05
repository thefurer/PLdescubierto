
import { useLanguage } from './useLanguage';

export const useTranslations = () => {
  const { language } = useLanguage();

  const translations = {
    es: {
      // Navigation
      home: "Inicio",
      attractions: "Atracciones",
      virtualTour: "Tour Virtual",
      contact: "Contacto",
      
      // Hero Section
      heroTitle: "Descubre la Magia de",
      heroSubtitle: "Puerto López",
      heroDescription: "Descubre la belleza natural, riqueza cultural y aventuras sin fin en el paraíso costero más encantador de Ecuador.",
      exploreBtn: "Explorar Atracciones",
      virtualBtn: "Experiencia Virtual",
      
      // Attractions Section
      attractionsTitle: "Principales Atracciones",
      attractionsSubtitle: "Descubre los lugares más impresionantes de Puerto López",
      attractionsDescription: "Desde playas vírgenes hasta encuentros únicos con la vida marina, Puerto López ofrece experiencias inolvidables para todo tipo de viajeros.",
      viewMore: "Ver Más",
      showLess: "Mostrar Menos",
      category: "Categoría",
      allCategories: "Todas las Categorías",
      
      // Virtual Tour Section
      virtualTourTitle: "Experiencia Virtual",
      virtualTourSubtitle: "Explora Puerto López desde Casa",
      virtualTourDescription: "Sumérgete en una experiencia inmersiva y descubre la belleza de Puerto López a través de nuestra tecnología de vanguardia.",
      selectLocation: "Selecciona una Ubicación",
      enterMetaverse: "Entrar al Metaverso",
      watch360: "Ver en 360°",
      
      // Contact Section
      contactTitle: "Contáctanos",
      contactSubtitle: "¿Listo para tu próxima aventura?",
      contactDescription: "Estamos aquí para ayudarte a planificar tu viaje perfecto a Puerto López.",
      yourName: "Tu Nombre",
      yourEmail: "Tu Email",
      yourMessage: "Tu Mensaje",
      sendMessage: "Enviar Mensaje",
      
      // Footer
      quickLinks: "Enlaces Rápidos",
      followUs: "Síguenos",
      newsletter: "Boletín",
      newsletterText: "Suscríbete para recibir las últimas noticias y ofertas especiales.",
      subscribe: "Suscribirse",
      allRightsReserved: "Todos los derechos reservados.",
      
      // General
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      close: "Cerrar",
      open: "Abrir",
      next: "Siguiente",
      previous: "Anterior",
      
      // Chat
      chatPlaceholder: "Escribe tu mensaje aquí...",
      chatWelcome: "¡Hola! ¿En qué puedo ayudarte hoy?",
      
      // Gallery
      gallery: "Galería",
      photos: "Fotos",
      videos: "Videos"
    },
    en: {
      // Navigation
      home: "Home",
      attractions: "Attractions",
      virtualTour: "Virtual Tour",
      contact: "Contact",
      
      // Hero Section
      heroTitle: "Discover the Magic of",
      heroSubtitle: "Puerto López",
      heroDescription: "Discover the natural beauty, cultural richness, and endless adventures in Ecuador's most enchanting coastal paradise.",
      exploreBtn: "Explore Attractions",
      virtualBtn: "Virtual Experience",
      
      // Attractions Section
      attractionsTitle: "Top Attractions",
      attractionsSubtitle: "Discover the most stunning places in Puerto López",
      attractionsDescription: "From pristine beaches to unique marine life encounters, Puerto López offers unforgettable experiences for all types of travelers.",
      viewMore: "View More",
      showLess: "Show Less",
      category: "Category",
      allCategories: "All Categories",
      
      // Virtual Tour Section
      virtualTourTitle: "Virtual Experience",
      virtualTourSubtitle: "Explore Puerto López from Home",
      virtualTourDescription: "Immerse yourself in an interactive experience and discover the beauty of Puerto López through our cutting-edge technology.",
      selectLocation: "Select a Location",
      enterMetaverse: "Enter Metaverse",
      watch360: "Watch in 360°",
      
      // Contact Section
      contactTitle: "Contact Us",
      contactSubtitle: "Ready for your next adventure?",
      contactDescription: "We're here to help you plan your perfect trip to Puerto López.",
      yourName: "Your Name",
      yourEmail: "Your Email",
      yourMessage: "Your Message",
      sendMessage: "Send Message",
      
      // Footer
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      newsletter: "Newsletter",
      newsletterText: "Subscribe to receive the latest news and special offers.",
      subscribe: "Subscribe",
      allRightsReserved: "All rights reserved.",
      
      // General
      loading: "Loading...",
      error: "Error",
      success: "Success",
      close: "Close",
      open: "Open",
      next: "Next",
      previous: "Previous",
      
      // Chat
      chatPlaceholder: "Type your message here...",
      chatWelcome: "Hello! How can I help you today?",
      
      // Gallery
      gallery: "Gallery",
      photos: "Photos",
      videos: "Videos"
    }
  };

  return translations[language];
};
