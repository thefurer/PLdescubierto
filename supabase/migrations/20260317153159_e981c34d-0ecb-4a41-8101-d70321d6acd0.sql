
-- Create trigger to log tourist_attractions changes to content_history
CREATE OR REPLACE FUNCTION public.create_attraction_history()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.content_history (section_name, old_content, new_content, change_type, changed_by)
    VALUES (
      'attractions',
      jsonb_build_object('name', OLD.name, 'description', OLD.description, 'category', OLD.category, 'image_url', OLD.image_url, 'is_active', OLD.is_active, 'activities', OLD.activities, 'recommendations', OLD.recommendations, 'gallery_images', OLD.gallery_images),
      jsonb_build_object('name', NEW.name, 'description', NEW.description, 'category', NEW.category, 'image_url', NEW.image_url, 'is_active', NEW.is_active, 'activities', NEW.activities, 'recommendations', NEW.recommendations, 'gallery_images', NEW.gallery_images),
      'update',
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.content_history (section_name, new_content, change_type, changed_by)
    VALUES (
      'attractions',
      jsonb_build_object('name', NEW.name, 'description', NEW.description, 'category', NEW.category, 'image_url', NEW.image_url, 'is_active', NEW.is_active),
      'create',
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.content_history (section_name, old_content, change_type, changed_by)
    VALUES (
      'attractions',
      jsonb_build_object('name', OLD.name, 'description', OLD.description, 'category', OLD.category),
      'delete',
      auth.uid()
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE TRIGGER track_attraction_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.tourist_attractions
  FOR EACH ROW
  EXECUTE FUNCTION public.create_attraction_history();

-- Also create trigger for attraction_activities
CREATE OR REPLACE FUNCTION public.create_attraction_activity_history()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.content_history (section_name, old_content, new_content, change_type, changed_by)
    VALUES (
      'attraction_activities',
      jsonb_build_object('activity_name', OLD.activity_name, 'description', OLD.description, 'attraction_id', OLD.attraction_id),
      jsonb_build_object('activity_name', NEW.activity_name, 'description', NEW.description, 'attraction_id', NEW.attraction_id),
      'update',
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.content_history (section_name, new_content, change_type, changed_by)
    VALUES (
      'attraction_activities',
      jsonb_build_object('activity_name', NEW.activity_name, 'description', NEW.description, 'attraction_id', NEW.attraction_id),
      'create',
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.content_history (section_name, old_content, change_type, changed_by)
    VALUES (
      'attraction_activities',
      jsonb_build_object('activity_name', OLD.activity_name, 'description', OLD.description),
      'delete',
      auth.uid()
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE TRIGGER track_attraction_activity_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.attraction_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.create_attraction_activity_history();
