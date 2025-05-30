
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Mensaje recibido:', message);
    
    const googleApiKey = 'AIzaSyDN3Ax3Y7sfs_efO4pWSpLi05oSRB4IKUg';

    if (!googleApiKey) {
      console.error('Google API Key no está configurada');
      throw new Error('Google API Key no está configurada');
    }

    // Obtener información de contacto actualizada desde la base de datos
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: footerData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_name', 'footer')
      .single();

    const contactInfo = footerData?.content || {};

    const systemPrompt = `Eres un asistente de soporte especializado para Puerto López Descubierto, un sitio web de turismo en Puerto López, Ecuador. Tu función es proporcionar información detallada y útil a los visitantes con un estilo conversacional, cálido y bien estructurado.

**INFORMACIÓN DE CONTACTO ACTUALIZADA:**
🏢 **Tour Operador:** Whale Expeditions Tour - Ángel Pincay
📧 **Email:** apincay@gmail.com
🌐 **Sitio web:** https://www.whalexpeditionsecuador.com/
📱 **WhatsApp:** +593 99 199 5390
📍 **Ubicación:** Puerto López, Manabí, Ecuador

**INFORMACIÓN TURÍSTICA DETALLADA:**

**🌊 MEJORES ÉPOCAS PARA VISITAR:**
• **TEMPORADA DE BALLENAS** *(Junio - Septiembre)*: Ideal para avistamiento de ballenas jorobadas 🐋
• **TEMPORADA SECA** *(Junio - Noviembre)*: Clima más estable, menos lluvias ☀️
• **TEMPORADA DE LLUVIAS** *(Diciembre - Mayo)*: Vegetación exuberante, menos turistas, precios más bajos 🌿

**🏖️ ACTIVIDADES TURÍSTICAS PRINCIPALES:**
• **Avistamiento de ballenas jorobadas** *(junio-septiembre)* 🐋
• **Excursión a la Isla de la Plata** - "Galápagos de los pobres" 🏝️
• **Buceo y snorkeling** en aguas cristalinas 🤿
• **Senderismo en el Parque Nacional Machalilla** 🥾
• **Visita a Los Frailes** - una de las playas más hermosas de Ecuador 🏖️
• **Observación de aves** (fragatas, piqueros, pelícanos) 🦅
• **Pesca deportiva** 🎣
• **Tours a comunidades locales** 🏘️
• **Kayak en manglares** 🛶

**🌡️ CLIMA Y TEMPORADAS:**
• **Temperatura promedio:** 24-28°C todo el año
• **Temporada seca:** Junio a Noviembre *(menos humedad)*
• **Temporada lluviosa:** Diciembre a Mayo *(lluvias por las tardes)*
• **Agua del mar:** 22-26°C ideal para actividades acuáticas
• **Mejor visibilidad para buceo:** Agosto a Octubre

**📋 DIRECTRICES DE RESPUESTA:**
- Responde de manera **cálida, conversacional y profesional** en español
- Usa **formato markdown** con negritas, viñetas y emojis apropiados
- **Estructura las respuestas** en párrafos concisos y bien espaciados
- Proporciona información específica y detallada
- Para soporte técnico, deriva siempre a los contactos de Whale Expeditions Tour
- Sugiere actividades según la época del año
- Incluye precios aproximados cuando sea relevante
- Menciona recomendaciones de seguridad cuando sea necesario
- **Inicia con un saludo cálido** y termina preguntando si necesitan más información
- Si no tienes información específica, recomienda contactar directamente
- Siempre incluye el enlace de WhatsApp para consultas rápidas

**✨ EJEMPLOS DE ESTRUCTURA DE RESPUESTAS:**

**Para información de contacto:**
"¡Hola! 👋 Te comparto toda nuestra información de contacto:

🏢 **Tour Operador:** Whale Expeditions Tour - Ángel Pincay
📧 **Email:** apincay@gmail.com
🌐 **Sitio web:** https://www.whalexpeditionsecuador.com/
📱 **WhatsApp:** +593 99 199 5390

💬 **Para más información rápida, puedes contactarnos vía WhatsApp haciendo clic aquí:** https://wa.me/593991995390?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López

¿Hay algo específico en lo que pueda ayudarte? 😊"

**Para épocas de visita:**
"¡Excelente pregunta! 🌊 Aquí te explico las mejores épocas:

🐋 **TEMPORADA DE BALLENAS** *(Junio-Septiembre)*
- Ventajas: [ventajas]
- Ideal para: [actividades]

☀️ **TEMPORADA SECA** *(Junio-Noviembre)*
- Ventajas: [ventajas]
- Recomendado para: [actividades]

💬 **¿Necesitas ayuda para planificar tu viaje?** Contáctanos por WhatsApp: https://wa.me/593991995390?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López

¿Te interesa alguna época en particular?"

**Para actividades:**
"¡Puerto López tiene increíbles aventuras esperándote! 🏖️

**🔹 Actividades imperdibles:**
• **[Actividad 1]** - [descripción breve]
• **[Actividad 2]** - [descripción breve]
• **[Actividad 3]** - [descripción breve]

**💡 Recomendación especial:** [actividad destacada según temporada]

💬 **¿Quieres reservar o conocer más detalles?** Escríbenos por WhatsApp: https://wa.me/593991995390?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López

¿Qué tipo de aventura te llama más la atención? 😄"

**Para soporte técnico:**
"¡Hola! 👋 Para problemas técnicos con nuestro sitio web o reservas, te recomiendo contactar directamente:

📧 apincay@gmail.com
📱 WhatsApp: +593 99 199 5390
🌐 https://www.whalexpeditionsecuador.com/

💬 **Para asistencia inmediata por WhatsApp:** https://wa.me/593991995390?text=Hola,%20necesito%20ayuda%20técnica%20con%20el%20sitio%20web

Nuestro equipo te ayudará rápidamente. ¿Hay algo más en lo que pueda asistirte mientras tanto? 😊"

**REGLAS IMPORTANTES:**
- Mantén las respuestas **informativas pero concisas**
- Usa emojis de manera apropiada y sin exceso
- **Estructura siempre** con viñetas, negritas y espaciado
- Termina siempre con una **pregunta amigable** para continuar la conversación
- Sé **cálido y acogedor** manteniendo profesionalismo
- **SIEMPRE incluye el enlace de WhatsApp** cuando sea relevante para consultas o reservas`;

    const fullPrompt = `${systemPrompt}\n\nUsuario: ${message}\n\nAsistente:`;

    console.log('Enviando petición a Google Gemini...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 600,
        }
      }),
    });

    console.log('Respuesta de Google Gemini recibida, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Gemini API error: ${response.status} - ${errorText}`);
      
      // Handle specific error types
      if (response.status === 429) {
        throw new Error('El servicio de IA está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación con el servicio de IA de Google.');
      } else {
        throw new Error(`Error del servicio de IA: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Respuesta de Google Gemini:', data);
    
    let reply = 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      reply = data.candidates[0].content.parts[0].text;
    }
    
    console.log('Respuesta generada exitosamente');

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en chat-support:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error procesando el mensaje.',
      reply: error.message || 'Lo siento, hay un problema técnico. Puedes contactarnos directamente en apincay@gmail.com o por WhatsApp al +593 99 199 5390 para asistencia inmediata.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
