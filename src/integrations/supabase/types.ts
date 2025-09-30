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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audio_files: {
        Row: {
          audio_quality_score: number | null
          bit_rate: number | null
          created_at: string | null
          duration_seconds: number | null
          error_message: string | null
          file_size_bytes: number | null
          format: string | null
          id: string
          mime_type: string | null
          original_filename: string | null
          processed_at: string | null
          sample_rate: number | null
          status: string | null
          storage_path: string
          updated_at: string | null
          uploaded_at: string | null
          voicemail_id: string
        }
        Insert: {
          audio_quality_score?: number | null
          bit_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          file_size_bytes?: number | null
          format?: string | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          processed_at?: string | null
          sample_rate?: number | null
          status?: string | null
          storage_path: string
          updated_at?: string | null
          uploaded_at?: string | null
          voicemail_id: string
        }
        Update: {
          audio_quality_score?: number | null
          bit_rate?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          file_size_bytes?: number | null
          format?: string | null
          id?: string
          mime_type?: string | null
          original_filename?: string | null
          processed_at?: string | null
          sample_rate?: number | null
          status?: string | null
          storage_path?: string
          updated_at?: string | null
          uploaded_at?: string | null
          voicemail_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_files_voicemail_id_fkey"
            columns: ["voicemail_id"]
            isOneToOne: false
            referencedRelation: "voicemails"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          demo_user: boolean
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          demo_user?: boolean
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          demo_user?: boolean
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      voicemail_analysis: {
        Row: {
          ai_model_name: string | null
          ai_model_version: string | null
          analysis_result: string
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          processing_time_ms: number | null
          raw_response: Json | null
          voicemail_id: string
        }
        Insert: {
          ai_model_name?: string | null
          ai_model_version?: string | null
          analysis_result: string
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          raw_response?: Json | null
          voicemail_id: string
        }
        Update: {
          ai_model_name?: string | null
          ai_model_version?: string | null
          analysis_result?: string
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          processing_time_ms?: number | null
          raw_response?: Json | null
          voicemail_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voicemail_analysis_voicemail_id_fkey"
            columns: ["voicemail_id"]
            isOneToOne: false
            referencedRelation: "voicemails"
            referencedColumns: ["id"]
          },
        ]
      }
      voicemails: {
        Row: {
          ai_summary: string | null
          audio_file_url: string | null
          audio_quality_score: number | null
          audio_url: string | null
          caller_name: string | null
          caller_phone_number: string | null
          created_at: string | null
          demo_data: boolean
          duration_seconds: number | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          metadata: Json | null
          notes: string | null
          original_language: string | null
          priority: string | null
          read_at: string | null
          received_at: string
          status: string | null
          tags: string[] | null
          transcription: string | null
          transcription_confidence: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          audio_file_url?: string | null
          audio_quality_score?: number | null
          audio_url?: string | null
          caller_name?: string | null
          caller_phone_number?: string | null
          created_at?: string | null
          demo_data?: boolean
          duration_seconds?: number | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          metadata?: Json | null
          notes?: string | null
          original_language?: string | null
          priority?: string | null
          read_at?: string | null
          received_at: string
          status?: string | null
          tags?: string[] | null
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          audio_file_url?: string | null
          audio_quality_score?: number | null
          audio_url?: string | null
          caller_name?: string | null
          caller_phone_number?: string | null
          created_at?: string | null
          demo_data?: boolean
          duration_seconds?: number | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          metadata?: Json | null
          notes?: string | null
          original_language?: string | null
          priority?: string | null
          read_at?: string | null
          received_at?: string
          status?: string | null
          tags?: string[] | null
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voicemails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
