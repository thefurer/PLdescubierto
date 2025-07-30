
import { GEMINI_CONFIG } from './constants.ts';

export class GeminiClient {
  private apiKey: string = 'AIzaSyCjkYre7PNuHbmKDLs6EqzMZuuI37GTKTU';

  constructor() {
    // API key ya está configurada directamente
  }

  async generateResponse(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: GEMINI_CONFIG,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Gemini API error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        throw new Error('El servicio de IA está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Error de autenticación con el servicio de IA de Google.');
      } else {
        throw new Error(`Error del servicio de IA: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
  }
}
