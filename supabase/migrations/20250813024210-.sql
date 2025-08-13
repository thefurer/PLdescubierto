-- Fix security issue: Restrict public access to IP addresses and user agent data in attraction_ratings
-- This prevents harvesting of sensitive tracking data while maintaining rating functionality

-- First, drop the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.attraction_ratings;

-- Create a secure view for public rating data that excludes sensitive information
CREATE OR REPLACE VIEW public.attraction_ratings_public AS
SELECT 
  id,
  attraction_id,
  rating,
  created_at
FROM public.attraction_ratings;

-- Enable RLS on the view
ALTER VIEW public.attraction_ratings_public SET (security_invoker = true);

-- Create new restrictive RLS policies for the main table
CREATE POLICY "Users can view their own ratings" ON public.attraction_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rating data" ON public.attraction_ratings
  FOR SELECT USING (is_admin(auth.uid()));

-- Allow public to view the secure view (without IP/user agent data)
CREATE POLICY "Public can view anonymized ratings" ON public.attraction_ratings_public
  FOR SELECT USING (true);

-- Update the rating average function to work with the secure approach
CREATE OR REPLACE FUNCTION public.get_attraction_rating_average(attraction_uuid uuid)
RETURNS TABLE(average_rating numeric, total_ratings bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating::NUMERIC), 1) as average_rating,
    COUNT(*) as total_ratings
  FROM public.attraction_ratings_public
  WHERE attraction_id = attraction_uuid;
END;
$$;

-- Grant necessary permissions
GRANT SELECT ON public.attraction_ratings_public TO anon, authenticated;