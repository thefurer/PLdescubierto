export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      tourist_attractions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
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
      [_ in never]: never
    }
    Functions: {
      assign_admin_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      create_initial_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
