import { useState, useEffect, useCallback } from 'react';
import { supabase, type User, type Voicemail, type VoicemailAnalysis, type AudioFile } from '../supabase';

// Helper type for dashboard queries
export interface VoicemailWithAnalysis extends Voicemail {
  analysis: VoicemailAnalysis[]
  audio_file?: AudioFile
}

// Hook to get current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = useCallback(async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If user not found, log the specific error but don't set user to null
        // The Auth component will handle creating the profile
        if (error.code === 'PGRST116') {
          console.warn('User profile not found in public.users, will be handled by Auth component');
        }
        setUser(null);
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}

// Hook to get voicemails with analysis
export function useVoicemails(userId?: string) {
  const [voicemails, setVoicemails] = useState<VoicemailWithAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVoicemails = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch voicemails with their analysis
      const { data: voicemailsData, error: voicemailsError } = await supabase
        .from('voicemails')
        .select(`
          *,
          analysis:voicemail_analysis(*),
          audio_file:audio_files(*)
        `)
        .eq('user_id', userId)
        .order('received_at', { ascending: false });

      if (voicemailsError) {
        // Handle case where tables don't exist yet
        if (voicemailsError.code === '42P01' || voicemailsError.message.includes('relation') || voicemailsError.message.includes('does not exist')) {
          console.warn('Database tables not set up yet, returning empty data');
          setVoicemails([]);
          setError('Base de données non configurée. Aucun message vocal disponible.');
          return;
        }
        throw new Error(voicemailsError.message);
      }

      // Transform the data to match our interface
      const transformedVoicemails: VoicemailWithAnalysis[] = voicemailsData?.map(vm => ({
        ...vm,
        analysis: vm.analysis || [],
        audio_file: vm.audio_file?.[0] || undefined
      })) || [];

      setVoicemails(transformedVoicemails);
    } catch (err: any) {
      console.error('Error fetching voicemails:', err);
      setError(err.message || 'Error fetching voicemails');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchVoicemails();
  }, [userId, fetchVoicemails]);

  const updateVoicemailStatus = useCallback(async (voicemailId: string, updates: Partial<Pick<Voicemail, 'is_read' | 'is_starred' | 'status'> & { read_at: string | null }>) => {
    try {
      const { error } = await supabase
        .from('voicemails')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', voicemailId);

      if (error) {
        // Handle database not configured
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          console.warn('Database not configured, updating local state only');
          // Update local state only
          setVoicemails(prev => prev.map(vm => 
            vm.id === voicemailId ? { ...vm, ...updates } : vm
          ));
          return;
        }
        throw new Error(error.message);
      }

      // Update local state
      setVoicemails(prev => prev.map(vm => 
        vm.id === voicemailId ? { ...vm, ...updates } : vm
      ));
    } catch (err: any) {
      console.error('Error updating voicemail:', err);
      throw err;
    }
  }, []);

  return { 
    voicemails, 
    loading, 
    error, 
    fetchVoicemails, 
    updateVoicemailStatus 
  };
}

// Helper function to get analysis by type
export function getAnalysisByType(voicemail: VoicemailWithAnalysis, type: string): string {
  const analysis = voicemail.analysis?.find(a => a.analysis_type === type);
  return analysis?.analysis_result || '';
}

// Helper function to format analysis for display
export function formatAnalysisDisplay(value: string, fallback = 'Non analysé') {
  if (!value || value.trim() === '') return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
