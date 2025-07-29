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
    
    // Test the API key by making a request to verify it works
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
    
    try {
      const testResponse = await fetch(testUrl)
      const testData = await testResponse.json()
      
      console.log('API test response status:', testData.status)
      
      if (testData.status === 'REQUEST_DENIED') {
        throw new Error(`Google Maps API request denied: ${testData.error_message || 'Invalid API key or API not enabled'}`)
      }
    } catch (testError) {
      console.error('API key test failed:', testError)
      throw new Error(`Google Maps API key validation failed: ${testError.message}`)
    }
    
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