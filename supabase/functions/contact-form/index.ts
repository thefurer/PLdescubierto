
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per window

  const userLimit = rateLimit.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= maxRequests) {
    return false;
  }

  userLimit.count++;
  return true;
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' }),
        { 
          status: 429, 
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    const body: ContactFormData = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos obligatorios deben ser completados' }),
        { 
          status: 400, 
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Formato de email inválido' }),
        { 
          status: 400, 
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate field lengths
    if (body.name.length > 100 || body.email.length > 255 || body.message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Uno o más campos exceden la longitud máxima permitida' }),
        { 
          status: 400, 
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      message: sanitizeInput(body.message),
      phone: body.phone ? sanitizeInput(body.phone) : undefined,
      submittedAt: new Date().toISOString(),
      clientIP
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the submission
    console.log('Contact form submission:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      submittedAt: sanitizedData.submittedAt
    });

    // For now, just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.' 
      }),
      { 
        status: 200, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { 
        status: 500, 
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      }
    );
  }
});
