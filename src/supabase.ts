import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  throw new Error(
    'VITE_SUPABASE_URL is required and must be a valid HTTPS URL. ' +
    'Please check your .env file and ensure VITE_SUPABASE_URL is properly configured.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey.length < 50) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY is required and must be a valid JWT token. ' +
    'Please check your .env file and ensure VITE_SUPABASE_ANON_KEY is properly configured.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    flowType: 'pkce', // Use PKCE flow for better security and reliability
    debug: false, // Disable debug in production
    storageKey: 'voxnow-auth-token' // Custom storage key
  },
  global: {
    headers: {
      'X-Client-Info': 'voxnow-web@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database types based on public.users schema (connected to auth.users)
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string | null
  status?: string | null
  last_login?: string | null
  demo_user?: boolean
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
  audio_url?: string
  transcription?: string
  ai_summary?: string
  sms_sent?: string
  original_language: string
  status: 'Nouveau' | 'En cours' | 'Examiné' | 'Archivé' | 'Supprimé'
  priority: 'Faible' | 'Normal' | 'Élevé' | 'Urgent'
  is_read: boolean
  is_starred: boolean
  read_at?: string | null
  transcription_confidence?: number
  audio_quality_score?: number
  demo_data?: boolean
  missed_call?: boolean
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


