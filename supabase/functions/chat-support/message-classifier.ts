
export function classifyMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('contacto') || lowerMessage.includes('información de contacto') || 
      lowerMessage.includes('telefono') || lowerMessage.includes('teléfono') || 
      lowerMessage.includes('email') || lowerMessage.includes('correo')) {
    return 'contact';
  }
  
  if (lowerMessage.includes('itinerario') || lowerMessage.includes('personalizar') || 
      lowerMessage.includes('planificar') || lowerMessage.includes('viaje')) {
    return 'itinerary';
  }
  
  if (lowerMessage.includes('época') || lowerMessage.includes('mejor momento') || 
      lowerMessage.includes('cuando visitar') || lowerMessage.includes('temporada') ||
      lowerMessage.includes('clima')) {
    return 'season';
  }
  
  if (lowerMessage.includes('actividades') || lowerMessage.includes('qué hacer') || 
      lowerMessage.includes('tours') || lowerMessage.includes('excursiones') ||
      lowerMessage.includes('atracciones')) {
    return 'activities';
  }
  
  return 'general';
}
