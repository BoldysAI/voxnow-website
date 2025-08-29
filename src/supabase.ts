import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hxyyqidiixyshsszqmqd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eXlxaWRpaXh5c2hzc3pxbXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjE0NTEsImV4cCI6MjA3MTE5NzQ1MX0.WAfEvVIKtT2DOWGI8oRDZSsqroloYZ1PAb3cN1GSjGU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on public.users schema (connected to auth.users)
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string | null
  status?: string | null
  last_login?: string | null
  created_at: string
  updated_at?: string | null
}

export interface Voicemail {
  id: string
  user_id: string // References public.users(id)
  caller_phone_number?: string
  caller_name?: string
  duration_seconds?: number
  received_at: string
  audio_file_url?: string
  transcription?: string
  ai_summary?: string
  original_language: string
  status: 'Nouveau' | 'En cours' | 'Examiné' | 'Archivé' | 'Supprimé'
  priority: 'Faible' | 'Normal' | 'Élevé' | 'Urgent'
  is_read: boolean
  is_starred: boolean
  read_at?: string | null
  transcription_confidence?: number
  audio_quality_score?: number
  tags?: string[]
  notes?: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface VoicemailAnalysis {
  id: string
  voicemail_id: string
  analysis_type: 'Sentiment' | 'Urgence' | 'Catégorie' | 'Domaine juridique' | 'Étape du dossier' | 'Intention'
  analysis_result: string
  confidence_score?: number
  ai_model_name?: string
  ai_model_version?: string
  processing_time_ms?: number
  raw_response?: Record<string, any>
  created_at: string
}

export interface AudioFile {
  id: string
  voicemail_id: string
  storage_path: string
  original_filename?: string
  file_size_bytes?: number
  mime_type: string
  duration_seconds?: number
  format?: string
  sample_rate?: number
  bit_rate?: number
  status: 'Téléchargement' | 'Disponible' | 'En cours' | 'Archivé' | 'Erreur'
  audio_quality_score?: number
  uploaded_at: string
  processed_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}


