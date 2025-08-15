-- Corregir función de moderación con search_path seguro
CREATE OR REPLACE FUNCTION public.moderate_content(content_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_text TEXT := content_text;
  word_record RECORD;
BEGIN
  -- Iterar sobre las palabras prohibidas activas
  FOR word_record IN 
    SELECT word, replacement, severity 
    FROM public.moderation_words 
    WHERE is_active = true 
    ORDER BY LENGTH(word) DESC
  LOOP
    -- Reemplazar las palabras prohibidas (case insensitive)
    result_text := regexp_replace(
      result_text, 
      '\y' || word_record.word || '\y', 
      word_record.replacement, 
      'gi'
    );
  END LOOP;
  
  RETURN result_text;
END;
$$;