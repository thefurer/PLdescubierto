import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location, center } = await req.json()
    
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    console.log('API Key available:', !!GOOGLE_MAPS_API_KEY)
    console.log('Location:', location)
    console.log('Center:', center)
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured')
    }

    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}&center=${center}&zoom=13`
    
    console.log('Generated embed URL (without key):', embedUrl.replace(GOOGLE_MAPS_API_KEY, 'HIDDEN_KEY'))
    
    // Note: We skip API validation here since Maps Embed API doesn't have a direct validation endpoint
    // The embed will fail gracefully if the API key is invalid
    
    return new Response(
      JSON.stringify({ embedUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})