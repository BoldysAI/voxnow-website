import { createClient } from '@supabase/supabase-js'

const createMemoryStorage = (): Storage => {
  const store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
  }
}

const getSafeStorage = (): Storage => {
  try {
    const storage = window.localStorage
    const testKey = '__voxnow_storage_test__'
    storage.setItem(testKey, testKey)
    storage.removeItem(testKey)
    return storage
  } catch {
    return createMemoryStorage()
  }
}

// Publishable fallback values (anon key + project URL are safe to expose).
// These mirror src/integrations/supabase/client.ts and prevent the app from
// crashing at module load when build-time env vars are missing (e.g. on the
// published preview where VITE_SUPABASE_* aren't injected).
const FALLBACK_SUPABASE_URL = 'https://hxyyqidiixyshsszqmqd.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eXlxaWRpaXh5c2hzc3pxbXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MjE0NTEsImV4cCI6MjA3MTE5NzQ1MX0.WAfEvVIKtT2DOWGI8oRDZSsqroloYZ1PAb3cN1GSjGU'

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabaseUrl = envUrl && envUrl.startsWith('https://') ? envUrl : FALLBACK_SUPABASE_URL
const supabaseAnonKey = envAnonKey && envAnonKey.length >= 50 ? envAnonKey : FALLBACK_SUPABASE_ANON_KEY

if (!envUrl || !envAnonKey) {
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing at build time — using publishable fallback values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: getSafeStorage(),
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


