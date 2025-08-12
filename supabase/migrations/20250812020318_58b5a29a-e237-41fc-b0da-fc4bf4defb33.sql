-- Add backgroundImages column to site_content table for hero carousel functionality
-- This will allow storing multiple background images for the hero section

-- First, let's check if we need to create any sample hero content
INSERT INTO public.site_content (section_name, content)
SELECT 'hero', jsonb_build_object(
  'title', 'Puerto López',
  'subtitle', 'Descubre sus Atracciones', 
  'description', 'Bellezas Naturales y Culturales',
  'backgroundImage', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'backgroundImages', jsonb_build_array('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_content WHERE section_name = 'hero'
);

-- Update existing hero content to include backgroundImages array if it doesn't exist
UPDATE public.site_content 
SET content = content || jsonb_build_object(
  'backgroundImages', 
  CASE 
    WHEN content ? 'backgroundImages' THEN content->'backgroundImages'
    WHEN content ? 'backgroundImage' THEN jsonb_build_array(content->>'backgroundImage')
    ELSE jsonb_build_array('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')
  END
)
WHERE section_name = 'hero' 
AND NOT (content ? 'backgroundImages');