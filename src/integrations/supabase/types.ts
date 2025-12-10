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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_plans: {
        Row: {
          created_at: string
          decoration_items: Json
          description: string | null
          dj_setup: Json | null
          entry_design: Json
          estimated_cost: number
          event_request_id: string
          id: string
          lighting_setup: Json
          plan_name: string
          plan_type: string
          profit_margin: number
          stage_design: Json | null
        }
        Insert: {
          created_at?: string
          decoration_items?: Json
          description?: string | null
          dj_setup?: Json | null
          entry_design?: Json
          estimated_cost: number
          event_request_id: string
          id?: string
          lighting_setup?: Json
          plan_name: string
          plan_type: string
          profit_margin?: number
          stage_design?: Json | null
        }
        Update: {
          created_at?: string
          decoration_items?: Json
          description?: string | null
          dj_setup?: Json | null
          entry_design?: Json
          estimated_cost?: number
          event_request_id?: string
          id?: string
          lighting_setup?: Json
          plan_name?: string
          plan_type?: string
          profit_margin?: number
          stage_design?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_plans_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          event_request_id: string
          highlight_reel_url: string | null
          id: string
          is_published: boolean
          photos: string[]
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_request_id: string
          highlight_reel_url?: string | null
          id?: string
          is_published?: boolean
          photos?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          event_request_id?: string
          highlight_reel_url?: string | null
          id?: string
          is_published?: boolean
          photos?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      event_requests: {
        Row: {
          budget: number
          created_at: string
          event_date: string
          event_scale: string
          event_time: string | null
          event_type: string
          guest_count: number
          id: string
          location: string
          location_coordinates: Json | null
          reference_images: string[] | null
          status: string
          time_of_day: string
          updated_at: string
          user_id: string
          venue_type: string
          voice_note_url: string | null
        }
        Insert: {
          budget: number
          created_at?: string
          event_date: string
          event_scale: string
          event_time?: string | null
          event_type: string
          guest_count: number
          id?: string
          location: string
          location_coordinates?: Json | null
          reference_images?: string[] | null
          status?: string
          time_of_day: string
          updated_at?: string
          user_id: string
          venue_type: string
          voice_note_url?: string | null
        }
        Update: {
          budget?: number
          created_at?: string
          event_date?: string
          event_scale?: string
          event_time?: string | null
          event_type?: string
          guest_count?: number
          id?: string
          location?: string
          location_coordinates?: Json | null
          reference_images?: string[] | null
          status?: string
          time_of_day?: string
          updated_at?: string
          user_id?: string
          venue_type?: string
          voice_note_url?: string | null
        }
        Relationships: []
      }
      event_timeline: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          event_request_id: string
          id: string
          milestone: string
          scheduled_date: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          event_request_id: string
          id?: string
          milestone: string
          scheduled_date: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          event_request_id?: string
          id?: string
          milestone?: string
          scheduled_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_timeline_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          event_request_id: string
          id: string
          rating: number
          review: string | null
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          event_request_id: string
          id?: string
          rating: number
          review?: string | null
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          event_request_id?: string
          id?: string
          rating?: number
          review?: string | null
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      final_approved_plans: {
        Row: {
          approved_at: string
          approved_by: string
          created_at: string
          decoration_details: Json
          dj_timing: string | null
          entry_concept: string
          event_request_id: string
          final_price: number
          id: string
          lighting_style: string
          notes: string | null
          stage_design: string
          theme: string
        }
        Insert: {
          approved_at?: string
          approved_by: string
          created_at?: string
          decoration_details?: Json
          dj_timing?: string | null
          entry_concept: string
          event_request_id: string
          final_price: number
          id?: string
          lighting_style: string
          notes?: string | null
          stage_design: string
          theme: string
        }
        Update: {
          approved_at?: string
          approved_by?: string
          created_at?: string
          decoration_details?: Json
          dj_timing?: string | null
          entry_concept?: string
          event_request_id?: string
          final_price?: number
          id?: string
          lighting_style?: string
          notes?: string | null
          stage_design?: string
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "final_approved_plans_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: true
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          email: string | null
          expires_at: string
          id: string
          otp_code: string
          phone: string
          type: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          otp_code: string
          phone: string
          type: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string
          type?: string
          verified?: boolean
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          event_request_id: string
          id: string
          invoice_url: string | null
          notes: string | null
          paid_at: string | null
          payment_gateway: string | null
          payment_method: string | null
          payment_type: string
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          event_request_id: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_type: string
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          event_request_id?: string
          id?: string
          invoice_url?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_type?: string
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_event_request_id_fkey"
            columns: ["event_request_id"]
            isOneToOne: false
            referencedRelation: "event_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          phone: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
