
import { GeminiClient } from './gemini-client.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function handleItineraryRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  const contextPrompt = `Eres un especialista en turismo de Puerto López, Ecuador. Un visitante quiere personalizar su itinerario.

INFORMACIÓN CLAVE DE PUERTO LÓPEZ:
- Observación de ballenas jorobadas (junio-septiembre, mejor época)
- Parque Nacional Machalilla con senderos ecológicos
- Isla de la Plata (tour de día completo, "Galápagos de los pobres")
- Playa Los Frailes (considerada una de las más hermosas de Ecuador)
- Agua Blanca (sitio arqueológico y aguas termales)
- Salango (museo arqueológico y playa)
- Avistamiento de aves y vida marina

PREGUNTAS PARA PERSONALIZAR:
¿Cuántos días tienes? Esto define la cantidad de actividades posibles.
¿Qué te interesa más? (naturaleza, cultura, playa, aventura)
¿Cuál es tu presupuesto aproximado?
¿Viajas solo, en pareja o en grupo?
¿Tienes experiencia en ecoturismo?

Mensaje del usuario: ${sanitizedMessage}

Responde de manera personalizada y práctica, sugiriendo actividades específicas según sus intereses. NO uses asteriscos, palabras strong, ni formato especial.`;

  return await geminiClient.generateResponse(contextPrompt);
}

export async function handleContactRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  return `¡Por supuesto! Aquí tienes la información de contacto:

📞 WhatsApp: +593 99 199 5390
📧 Email: apincay72@gmail.com

También puedes ir al chat directo haciendo clic en la opción telefónica que se encuentra en el footer de la página.

Estamos disponibles para ayudarte a planificar tu visita perfecta a Puerto López. No dudes en contactarnos para:
• Reservas de tours
• Información personalizada sobre actividades
• Recomendaciones de hospedaje
• Consejos para tu viaje

¡Esperamos conocerte pronto en este paraíso costero!`;
}

export async function handleSeasonsRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  const contextPrompt = `Eres un guía experto de Puerto López, Ecuador. Explica las mejores épocas para visitar según las actividades.

INFORMACIÓN ESTACIONAL CLAVE:
OBSERVACIÓN DE BALLENAS (IMPERDIBLE):
• Junio a Septiembre: Temporada alta de ballenas jorobadas
• Mejor época: Julio-Agosto (mayor cantidad de avistamientos)

CLIMA Y TEMPORADAS:
• Estación seca (junio-noviembre): Menos lluvia, ideal para tours
• Estación húmeda (diciembre-mayo): Más verde, menos turistas, precios menores
• Temperatura promedio: 24-28°C todo el año

ACTIVIDADES POR ÉPOCA:
• Mayo-Octubre: Mejor para buceo y snorkel (agua más clara)
• Todo el año: Isla de la Plata, Los Frailes, Agua Blanca
• Diciembre-Abril: Ideal para observar aves migratorias

Mensaje del usuario: ${sanitizedMessage}

Sé específico sobre fechas y explica por qué cada época es mejor para ciertas actividades. NO uses asteriscos, palabras strong, ni formato especial.`;

  return await geminiClient.generateResponse(contextPrompt);
}

export async function handleActivitiesRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  const contextPrompt = `Eres un guía turístico especializado en Puerto López, Ecuador. Presenta las actividades disponibles de manera organizada.

ACTIVIDADES IMPERDIBLES EN PUERTO LÓPEZ:

VIDA MARINA:
• Observación de ballenas jorobadas (jun-sep)
• Tour a Isla de la Plata con snorkel
• Buceo en arrecifes locales
• Avistamiento de delfines

NATURALEZA Y CULTURA:
• Parque Nacional Machalilla - senderos ecológicos
• Playa Los Frailes - una de las más hermosas del país
• Agua Blanca - sitio arqueológico y aguas termales
• Salango - museo arqueológico

AVENTURA:
• Senderismo en bosque seco tropical
• Kayak en manglares cercanos
• Pesca deportiva
• Fotografía de aves

EXPERIENCIAS LOCALES:
• Gastronomía marino-costera
• Artesanías locales
• Interacción con comunidades ancestrales

Mensaje del usuario: ${sanitizedMessage}

Recomienda actividades específicas según el interés del visitante y sugiere combinaciones para diferentes tipos de viajeros. NO uses asteriscos, palabras strong, ni formato especial.`;

  return await geminiClient.generateResponse(contextPrompt);
}

export async function handleWeatherRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  const contextPrompt = `Eres un experto en clima de Puerto López, Ecuador. Proporciona información detallada sobre el clima y cómo afecta las actividades turísticas.

INFORMACIÓN CLIMÁTICA DETALLADA:

TEMPORADAS PRINCIPALES:
• ESTACIÓN SECA (Junio-Noviembre):
  - Menos precipitaciones
  - Cielos más despejados
  - Ideal para tours marinos
  - Temporada alta de ballenas (jun-sep)

• ESTACIÓN HÚMEDA (Diciembre-Mayo):
  - Lluvias esporádicas, usualmente por las tardes
  - Paisaje más verde y exuberante
  - Menos turistas, precios más económicos
  - Excelente para fotografía de naturaleza

TEMPERATURA:
• Promedio anual: 24-28°C
• Variación mínima durante el año
• Brisa marina constante

RECOMENDACIONES POR CLIMA:
• Protección solar TODO EL AÑO (cerca de la línea ecuatorial)
• Ropa ligera y transpirable
• Impermeable liviano en temporada húmeda
• Para tours marinos: ropa que se pueda mojar

Mensaje del usuario: ${sanitizedMessage}

Sé específico sobre cómo el clima afecta cada actividad y qué ropa/equipo recomendar. NO uses asteriscos, palabras strong, ni formato especial.`;

  return await geminiClient.generateResponse(contextPrompt);
}

export async function handleGeneralRequest(sanitizedMessage: string, geminiClient: GeminiClient): Promise<string> {
  const contextPrompt = `Eres un asistente turístico especializado en Puerto López, Ecuador. 
  
Puerto López es un destino costero en la provincia de Manabí, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata (conocida como "Galápagos de los pobres")
- Playas hermosas como Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo y naturaleza

Responde de manera amigable, informativa y útil. Proporciona información práctica sobre actividades, hospedaje, transporte y consejos para visitar Puerto López.

Pregunta del usuario: ${sanitizedMessage}

Responde en español de manera concisa y útil. NO uses asteriscos, palabras strong, ni formato especial:`;

  return await geminiClient.generateResponse(contextPrompt);
}

export async function logInteraction(message: string, response: string) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    await supabaseClient
      .from('content_history')
      .insert({
        section_name: 'chat_interaction',
        new_content: {
          message: message,
          response: response,
          timestamp: new Date().toISOString()
        },
        change_type: 'chat_message'
      });
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}
