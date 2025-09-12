import { useState, useEffect, useCallback } from 'react';
import { supabase, type User, type Voicemail, type VoicemailAnalysis, type AudioFile } from '../supabase';

// Helper type for dashboard queries
export interface VoicemailWithAnalysis extends Voicemail {
  analysis: VoicemailAnalysis[]
  audio_file?: AudioFile
}


// Cache user profile to prevent unnecessary re-fetching
let cachedUser: User | null = null;
let lastSessionId: string | null = null;

// Hook to get current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfile = useCallback(async (authUserId: string, mounted: React.MutableRefObject<boolean>) => {
    if (!mounted.current) return null;

    console.log('👤 Fetching user profile for:', authUserId);
    
    try {
      // Quick database query with aggressive timeout
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (!mounted.current) return null;

      if (error) {
        console.warn('⚠️ Database error, creating minimal user:', error.code, error.message);
        throw new Error('Database error: ' + error.message);
      }

      console.log('✅ User profile fetched successfully');
      
      // Update last_login timestamp for this user
      try {
        await supabase
          .from('users')
          .update({
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', authUserId);
        console.log('✅ Last login timestamp updated');
      } catch (updateError) {
        console.warn('⚠️ Failed to update last_login timestamp:', updateError);
        // Don't fail the profile fetch for this
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ Profile fetch failed, creating minimal user from auth:', error);
      
      // Always create minimal user to prevent auth loops
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && mounted.current) {
          const minimalUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            phone: authUser.user_metadata?.phone || null,
            status: 'active',
            last_login: new Date().toISOString(),
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          };
          console.log('✅ Created minimal user profile');
          return minimalUser;
        }
      } catch (authError) {
        console.error('❌ Even auth.getUser() failed:', authError);
      }
      
      return null;
    }
  }, []);



  useEffect(() => {
    console.log('🔄 Setting up auth with anti-loop protection...');
    const mounted = { current: true };
    let isProcessing = false; // Prevent overlapping auth state changes

    // Initialize with cached user if available
    if (cachedUser && lastSessionId) {
      console.log('✅ Initializing with cached user');
      setUser(cachedUser);
      setIsAuthenticated(true);
      setLoading(false);
    }

    // Smart auth state listener with caching to prevent unnecessary re-authentication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current || isProcessing) {
        console.log('⏭️ Skipping auth state change - component unmounted or already processing');
        return;
      }

      const currentSessionId = session?.access_token?.substring(0, 10); // Use part of token as session ID
      const isSameSession = currentSessionId && currentSessionId === lastSessionId;

      // Skip unnecessary re-authentication for same session
      if (isSameSession && cachedUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log(`⏭️ Skipping ${event} - same session, using cached user`);
        if (mounted.current) {
          setIsAuthenticated(true);
          setUser(cachedUser);
          setLoading(false);
        }
        return;
      }

      isProcessing = true;
      console.log('🔔 Auth state changed:', { 
        event, 
        hasSession: !!session, 
        userEmail: session?.user?.email,
        isSameSession,
        hasCachedUser: !!cachedUser
      });

      try {
        if (session?.user) {
          console.log(`✅ User authenticated via ${event}`);
          setIsAuthenticated(true);
          setLoading(true);
          
          // Update session tracking
          lastSessionId = currentSessionId || null;
          
          // Use cached user if available and it's the same user
          if (cachedUser && cachedUser.id === session.user.id && event !== 'INITIAL_SESSION') {
            console.log('✅ Using cached user profile');
            if (mounted.current) {
              setUser(cachedUser);
              setLoading(false);
            }
            return;
          }
          
          // Fetch fresh user profile
          try {
            const profilePromise = fetchUserProfile(session.user.id, mounted);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Profile timeout')), 3000)
            );
            
            const userProfile = await Promise.race([profilePromise, timeoutPromise]);
            
            if (mounted.current && userProfile) {
              // Cache the user profile
              cachedUser = userProfile as User;
              setUser(userProfile as any);
            }
          } catch (error) {
            console.warn('⚠️ Profile fetch failed, creating minimal user to prevent loop:', error);
            
            // Create minimal user immediately to prevent auth loops
            if (mounted.current) {
              const minimalUser = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.email?.split('@')[0] || 'User',
                phone: null,
                status: 'active',
                last_login: new Date().toISOString(),
                created_at: session.user.created_at,
                updated_at: new Date().toISOString()
              };
              // Cache the minimal user too
              cachedUser = minimalUser;
              setUser(minimalUser);
            }
          }
          
          if (mounted.current) {
            setLoading(false);
          }
        } else {
          console.log(`❌ No session - ${event}`);
          // Clear cache when signing out
          cachedUser = null;
          lastSessionId = null;
          
          if (mounted.current) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
          }
        }
      } finally {
        isProcessing = false;
      }
    });


    // Add window focus/blur handlers to prevent unnecessary auth events
    let windowWasBlurred = false;
    
    const handleWindowBlur = () => {
      windowWasBlurred = true;
      console.log('🔍 Window blurred');
    };
    
    const handleWindowFocus = () => {
      if (windowWasBlurred) {
        console.log('🔍 Window focused after blur - ignoring potential auth events for 2 seconds');
        windowWasBlurred = false;
        
        // Temporarily ignore auth events for a short period to prevent window focus re-authentication
        const originalIsProcessing = isProcessing;
        isProcessing = true;
        
        setTimeout(() => {
          isProcessing = originalIsProcessing;
          console.log('🔍 Re-enabling auth event processing');
        }, 2000);
      }
    };
    
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      console.log('🧹 Cleaning up auth...');
      mounted.current = false;
      subscription.unsubscribe();
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []); // Empty deps - run once

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear cache before signing out
      cachedUser = null;
      lastSessionId = null;
      
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData: { full_name: string; phone?: string }) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Update cached user
      if (cachedUser) {
        cachedUser.full_name = profileData.full_name;
        cachedUser.phone = profileData.phone || null;
        cachedUser.updated_at = new Date().toISOString();
      }

      // Update local state
      setUser(prev => prev ? {
        ...prev,
        full_name: profileData.full_name,
        phone: profileData.phone || null,
        updated_at: new Date().toISOString()
      } : null);

    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  return { user, loading, signOut, isAuthenticated, updateUserProfile, updatePassword };
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
      setVoicemails([]);
      return;
    }

    fetchVoicemails();
  }, [fetchVoicemails]);

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
