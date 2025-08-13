-- Fix security issue: Restrict admin access to customer personal information in profiles table
-- This prevents wholesale access to sensitive customer data while maintaining necessary admin functions

-- Drop the overly permissive admin access policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create restrictive policy - users can only view their own profiles
CREATE POLICY "Users can view only their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update only their own profiles  
CREATE POLICY "Users can update only their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert only their own profiles
CREATE POLICY "Users can insert only their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a secure function for legitimate admin operations that need profile access
-- This requires explicit admin verification and logs all access
CREATE OR REPLACE FUNCTION public.admin_get_profile_summary(target_user_id uuid)
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the admin access for audit purposes
  PERFORM log_admin_action(
    'view_profile_summary',
    'profiles',
    target_user_id,
    jsonb_build_object('accessed_by', auth.uid(), 'timestamp', now())
  );
  
  -- Return limited profile information (no phone, bio, or avatar)
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at
  FROM public.profiles p
  WHERE p.id = target_user_id;
END;
$$;

-- Create a function for main admin to access full profile data with enhanced security
CREATE OR REPLACE FUNCTION public.main_admin_get_full_profile(target_user_id uuid)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  phone text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only main admin can access full profile data
  IF NOT is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Main admin privileges required for full profile access';
  END IF;
  
  -- Log the sensitive data access
  PERFORM log_admin_action(
    'view_full_profile',
    'profiles',
    target_user_id,
    jsonb_build_object(
      'accessed_by', auth.uid(), 
      'timestamp', now(),
      'security_level', 'full_access'
    )
  );
  
  -- Return full profile information
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.phone,
    p.bio,
    p.avatar_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = target_user_id;
END;
$$;