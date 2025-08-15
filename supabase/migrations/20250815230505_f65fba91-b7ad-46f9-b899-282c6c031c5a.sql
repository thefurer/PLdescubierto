-- Crear tabla de publicaciones del blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de comentarios
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de reacciones
CREATE TABLE public.blog_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type),
  UNIQUE(comment_id, user_id, reaction_type),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- Crear tabla de palabras prohibidas para moderación
CREATE TABLE public.moderation_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  replacement TEXT DEFAULT '****',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de reportes de contenido
CREATE TABLE public.content_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'resolved')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL))
);

-- Habilitar RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para blog_posts
CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Authors can view their own posts" 
ON public.blog_posts 
FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can update any post" 
ON public.blog_posts 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete posts" 
ON public.blog_posts 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Políticas RLS para blog_comments
CREATE POLICY "Anyone can view approved comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Admins can view all comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can create comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authors can update their own comments" 
ON public.blog_comments 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can update any comment" 
ON public.blog_comments 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete comments" 
ON public.blog_comments 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Políticas RLS para blog_reactions
CREATE POLICY "Anyone can view reactions" 
ON public.blog_reactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reactions" 
ON public.blog_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" 
ON public.blog_reactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
ON public.blog_reactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para moderation_words
CREATE POLICY "Only admins can manage moderation words" 
ON public.moderation_words 
FOR ALL 
USING (is_admin(auth.uid()));

-- Políticas RLS para content_reports
CREATE POLICY "Admins can view all reports" 
ON public.content_reports 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own reports" 
ON public.content_reports 
FOR SELECT 
USING (auth.uid() = reporter_id);

CREATE POLICY "Anyone can create reports" 
ON public.content_reports 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update reports" 
ON public.content_reports 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Triggers para updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_content_reports_updated_at
  BEFORE UPDATE ON public.content_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Función para moderar contenido automáticamente
CREATE OR REPLACE FUNCTION public.moderate_content(content_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
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

-- Insertar algunas palabras prohibidas básicas
INSERT INTO public.moderation_words (word, severity, replacement) VALUES
('spam', 'medium', '****'),
('tonto', 'low', '****'),
('idiota', 'medium', '****'),
('estúpido', 'medium', '****'),
('odio', 'high', '****'),
('mierda', 'high', '****'),
('joder', 'high', '****');

-- Índices para mejorar rendimiento
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, created_at DESC);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_comments_post ON public.blog_comments(post_id, created_at);
CREATE INDEX idx_blog_comments_approved ON public.blog_comments(is_approved);
CREATE INDEX idx_blog_reactions_post ON public.blog_reactions(post_id, reaction_type);
CREATE INDEX idx_blog_reactions_comment ON public.blog_reactions(comment_id, reaction_type);
CREATE INDEX idx_content_reports_status ON public.content_reports(status);