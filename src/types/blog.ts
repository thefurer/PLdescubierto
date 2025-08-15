export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  tags: string[];
  category: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
    email?: string;
  };
  reactions?: BlogReaction[];
  comments?: BlogComment[];
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_id?: string;
  author_name?: string;
  author_email?: string;
  content: string;
  is_approved: boolean;
  is_flagged: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  reactions?: BlogReaction[];
  replies?: BlogComment[];
}

export interface BlogReaction {
  id: string;
  post_id?: string;
  comment_id?: string;
  user_id?: string;
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  created_at: string;
}

export interface ModerationWord {
  id: string;
  word: string;
  severity: 'low' | 'medium' | 'high';
  replacement: string;
  is_active: boolean;
  created_at: string;
}

export interface ContentReport {
  id: string;
  post_id?: string;
  comment_id?: string;
  reporter_id?: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'resolved';
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export const REACTION_EMOJIS = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡'
} as const;

export const BLOG_CATEGORIES = [
  'general',
  'vida-marina',
  'actividades',
  'gastronomia',
  'naturaleza',
  'fotografia',
  'cultura',
  'noticias',
  'consejos'
] as const;