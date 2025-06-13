
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

export const CONTACT_INFO = {
  tourOperator: 'Whale Expeditions Tour - Ángel Pincay',
  email: 'apincay@gmail.com',
  website: 'https://www.whalexpeditionsecuador.com/',
  whatsapp: '+593 99 199 5390',
  phone: '+593 2 123 4567',
  location: 'Puerto López, Manabí, Ecuador'
};

export const WHATSAPP_LINK = 'https://wa.me/593991995390?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López';

export const GEMINI_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 600,
};
