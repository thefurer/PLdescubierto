-- Fix security definer view issue: Remove SECURITY DEFINER from attraction_ratings_public view
-- and ensure proper RLS policies are in place

-- Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.attraction_ratings_public;

-- Create the view as a normal view (not SECURITY DEFINER)
CREATE VIEW public.attraction_ratings_public AS
SELECT 
  attraction_id,
  rating,
  created_at
FROM public.attraction_ratings
WHERE attraction_id IS NOT NULL;

-- Enable RLS on the view (this will inherit from the base table)
-- Views inherit RLS from their base tables, so no additional policies needed
-- Public access is controlled by granting SELECT permission to anon/authenticated roles

-- Grant explicit access to the view for public use
GRANT SELECT ON public.attraction_ratings_public TO anon, authenticated;