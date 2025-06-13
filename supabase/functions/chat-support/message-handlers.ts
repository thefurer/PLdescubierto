
import { CORS_HEADERS } from './constants.ts';

export function handleContactInfoRequest(): Response {
  const contactResponse = `📞 **Información de Contacto - Puerto López Descubierto**

**Teléfonos:**
• +593 99 199 5390 (WhatsApp disponible)
• +593 2 123 4567

**Email:**
• apincay@gmail.com

**Ubicación:**
Puerto López, Manabí, Ecuador

¡Estamos disponibles para ayudarte a planificar tu aventura perfecta en Puerto López! Puedes contactarnos por cualquiera de estos medios.`;

  return new Response(
    JSON.stringify({ reply: contactResponse }),
    { 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}

export function handleItineraryRequest(): Response {
  const itineraryResponse = `🗓️ **Personalización de Itinerario - Puerto López**

Para crear tu itinerario perfecto, necesito conocer algunos detalles:

**¿Cuántos días tienes disponibles?**
Esto define la cantidad de actividades que podemos incluir:
• 1-2 días: Actividades principales (ballenas + playa)
• 3-4 días: Tour completo con Isla de la Plata
• 5+ días: Experiencia inmersiva con múltiples destinos

**¿Cuál es tu presupuesto aproximado?**
• Económico: $50-80 por día
• Moderado: $80-120 por día  
• Premium: $120+ por día

**¿Qué te interesa más?**
• Avistamiento de ballenas (junio-septiembre)
• Buceo y snorkeling
• Senderismo y naturaleza
• Cultura y gastronomía local
• Playas y relajación

**¿Cuántas personas son?**
Esto nos ayuda a personalizar el transporte y actividades grupales.

Una vez que me proporciones esta información, podré crear un itinerario detallado y personalizado para tu visita a Puerto López. 

¿Por dónde te gustaría empezar? 😊`;

  return new Response(
    JSON.stringify({ reply: itineraryResponse }),
    { 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}

export function handleSeasonInfoRequest(): Response {
  const seasonResponse = `🌊 **Mejor Época para Visitar Puerto López**

**TEMPORADA DE BALLENAS (Junio - Septiembre)**
• Ideal para avistamiento de ballenas jorobadas
• Clima seco y soleado
• Mar en calma para navegación
• Temporada alta - reservar con anticipación

**TEMPORADA SECA (Junio - Noviembre)**
• Días soleados y noches frescas
• Perfecto para actividades al aire libre
• Mejor visibilidad para buceo y snorkeling
• Ideal para senderismo y exploración

**TEMPORADA LLUVIOSA (Diciembre - Mayo)**
• Lluvias cortas e intensas (principalmente tardes)
• Paisajes más verdes y exuberantes
• Menos turistas - precios más económicos
• Buena época para relajarse en playas

**RECOMENDACIONES POR MES:**
• JUNIO-SEPTIEMBRE: Ballenas + clima perfecto
• OCTUBRE-NOVIEMBRE: Excelente clima, menos multitudes
• DICIEMBRE-FEBRERO: Temporada verde, lluvias moderadas
• MARZO-MAYO: Fin de lluvias, naturaleza floreciente

**Consejo:** Cualquier época es buena para visitar Puerto López, ¡cada temporada tiene su encanto especial! 🌴`;

  return new Response(
    JSON.stringify({ reply: seasonResponse }),
    { 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}

export function handleActivitiesRequest(): Response {
  const activitiesResponse = `🎯 **Actividades Imperdibles en Puerto López**

**AVENTURAS MARINAS**
🐋 Avistamiento de Ballenas (Jun-Sep)
• Tour de 4 horas en lancha
• Avistamiento garantizado en temporada
• Incluye desayuno y guía especializado

🏝️ Isla de la Plata
• Conocida como "Galápagos de los Pobres"
• Snorkeling con tortugas y peces tropicales
• Observación de piqueros patas azules
• Caminata por senderos naturales

**EXPERIENCIAS TERRESTRES**
🥾 Playa Los Frailes
• Una de las playas más hermosas del Ecuador
• Sendero panorámico de 30 minutos
• Aguas cristalinas para nadar
• Perfecto para fotografía

🏛️ Agua Blanca
• Sitio arqueológico precolombino
• Museo comunitario
• Lagunas de azufre medicinales
• Bosque seco tropical

**AVENTURAS EXTREMAS**
🤿 Buceo y Snorkeling
• Arrecifes de coral coloridos
• Mantarrayas y tiburones martillo
• Cursos PADI disponibles
• Todo el año (mejor visibilidad Jun-Nov)

🦅 Observación de Aves
• Más de 270 especies registradas
• Fragatas, pelícanos, piqueros
• Tours especializados con guías locales
• Mejor época: temprano en la mañana

**CULTURA Y GASTRONOMÍA**
🍤 Tour Gastronómico
• Mariscos frescos del día
• Ceviche artesanal
• Pescado a la plancha
• Experiencia con pescadores locales

¿Te interesa alguna actividad en particular? ¡Puedo darte más detalles! 🌊`;

  return new Response(
    JSON.stringify({ reply: activitiesResponse }),
    { 
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    }
  );
}
