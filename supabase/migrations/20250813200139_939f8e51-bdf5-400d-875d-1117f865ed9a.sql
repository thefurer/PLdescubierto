-- Fix attraction_ratings security issue: restrict access to IP addresses and user agents

-- Drop the overly permissive policy that exposes sensitive data
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.attraction_ratings;

-- Create restrictive policies for viewing sensitive data
CREATE POLICY "Admins can view all rating data" 
ON public.attraction_ratings 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own rating data" 
ON public.attraction_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a secure view for public aggregated rating data (no IP/user agent exposure)
CREATE OR REPLACE VIEW public.attraction_ratings_public AS
SELECT 
  attraction_id,
  rating,
  created_at
FROM public.attraction_ratings
WHERE attraction_id IS NOT NULL;

-- Grant public access to the secure view
GRANT SELECT ON public.attraction_ratings_public TO anon, authenticated;

-- Create a secure function to get attraction rating statistics
CREATE OR REPLACE FUNCTION public.get_attraction_rating_stats(attraction_uuid uuid)
RETURNS TABLE(
  attraction_id uuid,
  average_rating numeric,
  total_ratings bigint,
  rating_distribution jsonb
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    attraction_uuid as attraction_id,
    ROUND(AVG(r.rating::NUMERIC), 1) as average_rating,
    COUNT(*) as total_ratings,
    jsonb_build_object(
      '1', COUNT(*) FILTER (WHERE r.rating = 1),
      '2', COUNT(*) FILTER (WHERE r.rating = 2),
      '3', COUNT(*) FILTER (WHERE r.rating = 3),
      '4', COUNT(*) FILTER (WHERE r.rating = 4),
      '5', COUNT(*) FILTER (WHERE r.rating = 5)
    ) as rating_distribution
  FROM public.attraction_ratings r
  WHERE r.attraction_id = attraction_uuid
  GROUP BY attraction_uuid;
END;
$$;