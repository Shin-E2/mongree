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
      accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          provider_account_id: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
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
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
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
          created_at: string | null
          deleted_at: string | null
          diary_id: string
          id: string
          parent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          diary_id: string
          id?: string
          parent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          diary_id?: string
          id?: string
          parent_id?: string | null
          updated_at?: string | null
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
          created_at: string | null
          deleted_at: string | null
          id: string
          is_private: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_private?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_private?: boolean | null
          title?: string
          updated_at?: string | null
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
          created_at: string | null
          diary_id: string
          emotion_id: string
        }
        Insert: {
          created_at?: string | null
          diary_id: string
          emotion_id: string
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
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
          created_at?: string | null
          diary_id: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          image_url: string
          mime_type?: string | null
          sort_order: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
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
        ]
      }
      diary_likes: {
        Row: {
          created_at: string | null
          diary_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          diary_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          diary_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          diary_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
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
          created_at: string | null
          id: string
          is_active: boolean | null
          label: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id: string
          is_active?: boolean | null
          label: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          detail_address: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          is_profile_complete: boolean | null
          nickname: string
          profile_image: string | null
          updated_at: string | null
          username: string | null
          zone_code: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          detail_address?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          is_profile_complete?: boolean | null
          nickname: string
          profile_image?: string | null
          updated_at?: string | null
          username?: string | null
          zone_code?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          detail_address?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          is_profile_complete?: boolean | null
          nickname?: string
          profile_image?: string | null
          updated_at?: string | null
          username?: string | null
          zone_code?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_tag_id: {
        Args: { tag_name: string }
        Returns: string
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
    Enums: {},
  },
} as const
