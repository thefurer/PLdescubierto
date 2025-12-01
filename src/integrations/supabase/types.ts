export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions_log: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json
          id: string
          ip_address: unknown
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json
          id?: string
          ip_address?: unknown
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          granted_at: string
          granted_by: string
          id: string
          is_active: boolean
          section_name: string
          user_id: string
        }
        Insert: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          granted_at?: string
          granted_by: string
          id?: string
          is_active?: boolean
          section_name: string
          user_id: string
        }
        Update: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          granted_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          section_name?: string
          user_id?: string
        }
        Relationships: []
      }
      attraction_activities: {
        Row: {
          activity_name: string
          attraction_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration: string | null
          id: string
          is_active: boolean | null
          price: number | null
          updated_at: string | null
        }
        Insert: {
          activity_name: string
          attraction_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          activity_name?: string
          attraction_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attraction_activities_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "tourist_attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      attraction_ratings: {
        Row: {
          attraction_id: string
          created_at: string
          id: string
          ip_address: unknown
          rating: number
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          attraction_id: string
          created_at?: string
          id?: string
          ip_address?: unknown
          rating: number
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          attraction_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          rating?: number
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attraction_ratings_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "tourist_attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      authorized_emails: {
        Row: {
          authorized_at: string
          authorized_by: string
          email: string
          id: string
          is_active: boolean
          notes: string | null
        }
        Insert: {
          authorized_at?: string
          authorized_by: string
          email: string
          id?: string
          is_active?: boolean
          notes?: string | null
        }
        Update: {
          authorized_at?: string
          authorized_by?: string
          email?: string
          id?: string
          is_active?: boolean
          notes?: string | null
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string | null
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          is_flagged: boolean | null
          parent_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_flagged?: boolean | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_email?: string | null
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_flagged?: boolean | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean
          like_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean
          like_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean
          like_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      blog_reactions: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          reaction_type: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          reaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_history: {
        Row: {
          change_type: string
          changed_at: string
          changed_by: string | null
          content_id: string | null
          id: string
          new_content: Json | null
          old_content: Json | null
          section_name: string
        }
        Insert: {
          change_type: string
          changed_at?: string
          changed_by?: string | null
          content_id?: string | null
          id?: string
          new_content?: Json | null
          old_content?: Json | null
          section_name: string
        }
        Update: {
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          content_id?: string | null
          id?: string
          new_content?: Json | null
          old_content?: Json | null
          section_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_history_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "site_content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          description: string | null
          id: string
          post_id: string | null
          reason: string
          reporter_id: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          post_id?: string | null
          reason: string
          reporter_id?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          storage_path: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          category: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          storage_path: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          storage_path?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      marketplace_products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json | null
          is_active: boolean | null
          name: string
          price: number
          shipping_info: Json | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name: string
          price: number
          shipping_info?: Json | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name?: string
          price?: number
          shipping_info?: Json | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string
          end_date: string | null
          features: Json | null
          id: string
          start_date: string
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          features?: Json | null
          id?: string
          start_date?: string
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          features?: Json | null
          id?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      moderation_words: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          replacement: string | null
          severity: string
          word: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          replacement?: string | null
          severity?: string
          word: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          replacement?: string | null
          severity?: string
          word?: string
        }
        Relationships: []
      }
      premium_guides: {
        Row: {
          content_type: string
          created_at: string
          description: string
          download_count: number | null
          file_size: number | null
          file_url: string | null
          id: string
          is_active: boolean | null
          price: number
          rating: number | null
          required_membership: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description: string
          download_count?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          price: number
          rating?: number | null
          required_membership?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string
          download_count?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          price?: number
          rating?: number | null
          required_membership?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          attraction_id: string | null
          contact_info: Json
          created_at: string
          guests_count: number
          id: string
          reservation_date: string
          reservation_type: string
          special_requests: string | null
          status: string
          time_slot: string | null
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attraction_id?: string | null
          contact_info?: Json
          created_at?: string
          guests_count?: number
          id?: string
          reservation_date: string
          reservation_type: string
          special_requests?: string | null
          status?: string
          time_slot?: string | null
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attraction_id?: string | null
          contact_info?: Json
          created_at?: string
          guests_count?: number
          id?: string
          reservation_date?: string
          reservation_type?: string
          special_requests?: string | null
          status?: string
          time_slot?: string | null
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "tourist_attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          attraction_id: string | null
          content: string
          created_at: string
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          photos: Json | null
          rating: number
          status: string
          title: string
          updated_at: string
          user_id: string
          verification_method: string | null
          visit_date: string | null
        }
        Insert: {
          attraction_id?: string | null
          content: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          photos?: Json | null
          rating: number
          status?: string
          title: string
          updated_at?: string
          user_id: string
          verification_method?: string | null
          visit_date?: string | null
        }
        Update: {
          attraction_id?: string | null
          content?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          photos?: Json | null
          rating?: number
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          verification_method?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "tourist_attractions"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          section_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          section_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          section_name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_visual_config: {
        Row: {
          config_data: Json
          config_type: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          config_data?: Json
          config_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          config_data?: Json
          config_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tourist_attractions: {
        Row: {
          activities: string[] | null
          additional_info: Json | null
          category: string
          coordinates: Json | null
          created_at: string
          description: string | null
          display_order: number | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          recommendations: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          activities?: string[] | null
          additional_info?: Json | null
          category: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          recommendations?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          activities?: string[] | null
          additional_info?: Json | null
          category?: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          recommendations?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      attraction_ratings_public: {
        Row: {
          attraction_id: string | null
          created_at: string | null
          rating: number | null
        }
        Insert: {
          attraction_id?: string | null
          created_at?: string | null
          rating?: number | null
        }
        Update: {
          attraction_id?: string | null
          created_at?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attraction_ratings_attraction_id_fkey"
            columns: ["attraction_id"]
            isOneToOne: false
            referencedRelation: "tourist_attractions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_get_profile_summary: {
        Args: { target_user_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
        }[]
      }
      assign_admin_role: { Args: { user_email: string }; Returns: undefined }
      assign_admin_role_and_activate: {
        Args: { user_email: string }
        Returns: undefined
      }
      assign_section_permissions: {
        Args: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          section: string
          target_user_id: string
        }
        Returns: undefined
      }
      authorize_email: {
        Args: { notes?: string; user_email: string }
        Returns: undefined
      }
      create_initial_admin: { Args: never; Returns: undefined }
      delete_authorized_email: {
        Args: { email_id: string }
        Returns: undefined
      }
      get_admin_actions_with_user_info: {
        Args: never
        Returns: {
          action_type: string
          admin_email: string
          admin_id: string
          admin_name: string
          created_at: string
          details: Json
          id: string
          target_id: string
          target_table: string
        }[]
      }
      get_admin_users_with_permissions: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          permissions: Json
        }[]
      }
      get_all_admin_actions_secure: {
        Args: never
        Returns: {
          action_type: string
          admin_email: string
          admin_id: string
          admin_name: string
          created_at: string
          details: Json
          id: string
          target_id: string
          target_table: string
        }[]
      }
      get_attraction_rating_average: {
        Args: { attraction_uuid: string }
        Returns: {
          average_rating: number
          total_ratings: number
        }[]
      }
      get_attraction_rating_stats: {
        Args: { attraction_uuid: string }
        Returns: {
          attraction_id: string
          average_rating: number
          rating_distribution: Json
          total_ratings: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_section_permission: {
        Args: { permission_type: string; section: string; user_id: string }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_email_authorized: { Args: { user_email: string }; Returns: boolean }
      is_main_admin: { Args: { user_id: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          action_type: string
          details?: Json
          target_id?: string
          target_table?: string
        }
        Returns: undefined
      }
      main_admin_get_full_profile: {
        Args: { target_user_id: string }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }[]
      }
      moderate_content: { Args: { content_text: string }; Returns: string }
      reactivate_authorized_email: {
        Args: { email_id: string }
        Returns: undefined
      }
      update_authorized_email_notes: {
        Args: { email_id: string; new_notes: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
