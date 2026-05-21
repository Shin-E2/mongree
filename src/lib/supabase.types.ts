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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_reports: {
        Row: {
          created_at: string
          dominant_emotions: string[]
          gentle_insight: string
          id: string
          month: string
          payload: Json
          recommendations: string[]
          source: string
          summary: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dominant_emotions?: string[]
          gentle_insight: string
          id?: string
          month: string
          payload?: Json
          recommendations?: string[]
          source?: string
          summary: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dominant_emotions?: string[]
          gentle_insight?: string
          id?: string
          month?: string
          payload?: Json
          recommendations?: string[]
          source?: string
          summary?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          diary_id: string
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          diary_id: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          diary_id?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "public_diary_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diaries: {
        Row: {
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_private: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_private?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_private?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_emotions: {
        Row: {
          created_at: string
          diary_id: string
          emotion_id: string
        }
        Insert: {
          created_at?: string
          diary_id: string
          emotion_id: string
        }
        Update: {
          created_at?: string
          diary_id?: string
          emotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_emotions_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_emotions_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "public_diary_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_emotions_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotions"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_images: {
        Row: {
          alt_text: string | null
          created_at: string
          diary_id: string
          file_name: string | null
          file_size: number | null
          id: string
          image_url: string
          mime_type: string | null
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          diary_id: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          image_url: string
          mime_type?: string | null
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          diary_id?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          image_url?: string
          mime_type?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "diary_images_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_images_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "public_diary_feed"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_likes: {
        Row: {
          created_at: string
          diary_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          diary_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          diary_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_likes_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_likes_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "public_diary_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_tags: {
        Row: {
          created_at: string
          diary_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          diary_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          diary_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_tags_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_tags_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "public_diary_feed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      emotions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image: string | null
          is_active: boolean
          label: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id: string
          image?: string | null
          is_active?: boolean
          label: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image?: string | null
          is_active?: boolean
          label?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      mongi_items: {
        Row: {
          asset_url: string | null
          created_at: string
          description: string
          id: string
          is_default: boolean
          name: string
          slot: string
          sort_order: number
        }
        Insert: {
          asset_url?: string | null
          created_at?: string
          description: string
          id: string
          is_default?: boolean
          name: string
          slot: string
          sort_order?: number
        }
        Update: {
          asset_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_default?: boolean
          name?: string
          slot?: string
          sort_order?: number
        }
        Relationships: []
      }
      mongi_profiles: {
        Row: {
          created_at: string
          equipped_item_id: string | null
          experience: number
          last_rewarded_diary_date: string | null
          level: number
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          equipped_item_id?: string | null
          experience?: number
          last_rewarded_diary_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          equipped_item_id?: string | null
          experience?: number
          last_rewarded_diary_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mongi_profiles_equipped_item_id_fkey"
            columns: ["equipped_item_id"]
            isOneToOne: false
            referencedRelation: "mongi_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mongi_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_private: {
        Row: {
          address: string | null
          created_at: string
          detail_address: string | null
          updated_at: string
          user_id: string
          zone_code: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          detail_address?: string | null
          updated_at?: string
          user_id: string
          zone_code?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          detail_address?: string | null
          updated_at?: string
          user_id?: string
          zone_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_private_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          is_profile_complete: boolean
          nickname: string
          profile_image: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_active?: boolean
          is_profile_complete?: boolean
          nickname: string
          profile_image?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          is_profile_complete?: boolean
          nickname?: string
          profile_image?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          price_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          price_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          source: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          source?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mongi_items: {
        Row: {
          acquired_at: string
          item_id: string
          source: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          item_id: string
          source?: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          item_id?: string
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mongi_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "mongi_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mongi_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_diary_feed: {
        Row: {
          comment_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          is_private: boolean | null
          like_count: number | null
          nickname: string | null
          profile_image: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_diary_transaction: {
        Args: {
          p_content: string
          p_emotion_ids?: string[]
          p_images?: Json
          p_is_private: boolean
          p_tag_names?: string[]
          p_title: string
        }
        Returns: string
      }
      get_or_create_tag_id: { Args: { tag_name: string }; Returns: string }
      get_public_diary_feed: {
        Args: {
          p_emotion_ids?: string[]
          p_limit?: number
          p_offset?: number
          p_search?: string
          p_sort_by?: string
        }
        Returns: {
          comment_count: number
          content: string
          created_at: string
          emotions: Json
          id: string
          images: Json
          is_private: boolean
          like_count: number
          profile: Json
          tags: Json
          title: string
          total_count: number
          updated_at: string
          user_id: string
        }[]
      }
      update_diary_transaction: {
        Args: {
          p_content: string
          p_diary_id: string
          p_emotion_ids?: string[]
          p_is_private: boolean
          p_kept_image_ids?: string[]
          p_new_images?: Json
          p_tag_names?: string[]
          p_title: string
        }
        Returns: {
          diary_id: string
          is_private: boolean
          removed_image_urls: string[]
          was_private: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
