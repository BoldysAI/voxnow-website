import { useState, useEffect, useCallback } from 'react';
import { supabase, type User, type Voicemail, type VoicemailAnalysis, type AudioFile } from '../supabase';

// Helper type for dashboard queries
export interface VoicemailWithAnalysis extends Voicemail {
  analysis: VoicemailAnalysis[]
  audio_file?: AudioFile
}

// Global flag to prevent multiple simultaneous initializations (React StrictMode fix)
let globalInitializationInProgress = false;
let globalSessionCache: any = null;
let globalSessionTimestamp = 0;

// Hook to get current user
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const fetchUserProfile = useCallback(async (authUserId: string, mounted: React.MutableRefObject<boolean>) => {
    try {
      // Don't fetch if component unmounted
      if (!mounted.current) return null;

      console.log('👤 Fetching user profile for:', authUserId);

      // First try to get user profile from database with timeout
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 8000)
      );

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;

      // Check again after async operation
      if (!mounted.current) return null;

      if (error) {
        console.warn('User profile fetch issue:', error.message);
        
        // If user not found, create a basic user object from auth data
        if (error.code === 'PGRST116' || error.message === 'Profile fetch timeout') {
          console.warn('User profile not available, creating minimal user from auth data');
          
          try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            if (authUser && mounted.current) {
              // Create a minimal user object from auth data
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
            console.error('Failed to get auth user:', authError);
            return null;
          }
        } else {
          // For other errors, don't invalidate the session but return null user
          console.error('Database error, but keeping session active');
          return null;
        }
      } else {
        console.log('✅ User profile fetched successfully');
        return data;
      }
    } catch (error) {
      console.error('Critical error fetching user profile:', error);
      // Don't set user to null for network errors
      return null;
    }
    return null;
  }, []);



  useEffect(() => {
    console.log('🔄 useAuth effect mounting...');
    const mounted = { current: true };
    let authSubscription: any;
    let sessionInitialized = false;

    // Comprehensive session debugging
    const debugSession = async () => {
      console.log('🔍 Debugging session state...');
      console.log('LocalStorage available:', typeof(Storage) !== "undefined");
      console.log('LocalStorage keys:', Object.keys(localStorage));
      
      // Check for Supabase session in localStorage
      const supabaseKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('sb-') || key.includes('auth-token')
      );
      console.log('Supabase localStorage keys:', supabaseKeys);
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('📋 Raw session data:', {
          session: session ? {
            access_token: session.access_token?.substring(0, 20) + '...',
            refresh_token: session.refresh_token?.substring(0, 20) + '...',
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              created_at: session.user.created_at
            } : null,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            provider_token: session.provider_token ? 'present' : 'none'
          } : null,
          error: error
        });

        // Add session timing information
        if (session?.expires_at) {
          const expiresAt = new Date(session.expires_at * 1000);
          const now = new Date();
          const timeUntilExpiry = expiresAt.getTime() - now.getTime();
          const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
          const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));
          
          console.log(`⏰ Session expires in: ${hoursUntilExpiry}h ${minutesUntilExpiry}m`);
          
          if (timeUntilExpiry < 0) {
            console.warn('⚠️ Session has already expired!');
          } else if (timeUntilExpiry < 10 * 60 * 1000) { // Less than 10 minutes
            console.warn('⚠️ Session expires soon!');
          }
        }
        return { session, error };
      } catch (err) {
        console.error('❌ Error in debugSession:', err);
        return { session: null, error: err };
      }
    };

    // Get initial session with comprehensive error handling and React StrictMode protection
    const initializeAuth = async () => {
      if (sessionInitialized) {
        console.log('⚠️ initializeAuth called but already initialized (component level)');
        return;
      }
      
      // Global protection against React StrictMode double initialization
      if (globalInitializationInProgress) {
        console.log('⚠️ Global initialization already in progress, waiting...');
        // Wait for global initialization to complete
        let attempts = 0;
        while (globalInitializationInProgress && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        // Use cached session if available and recent (within 5 seconds)
        if (globalSessionCache && (Date.now() - globalSessionTimestamp) < 5000) {
          console.log('📋 Using cached session data');
          const { session, error } = globalSessionCache;
          
          if (!mounted.current) return;
          
          if (error) {
            console.log('📋 Cached session had error:', error);
            setIsAuthenticated(false);
            setUser(null);
          } else if (session?.user) {
            setIsAuthenticated(true);
            const userProfile = await fetchUserProfile(session.user.id, mounted);
            if (mounted.current) {
              setUser(userProfile);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          
          setLoading(false);
          setSessionChecked(true);
          sessionInitialized = true;
          return;
        }
      }
      
      sessionInitialized = true;
      globalInitializationInProgress = true;

      try {
        console.log('🚀 Starting auth initialization...');
        setLoading(true);
        
        // Create a shorter timeout for the initialization process
        const initializationTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Initialization timeout after 8 seconds')), 8000)
        );
        
        const initializationPromise = (async () => {
          // Quick session check - let auth listener do the heavy lifting
          const { session, error } = await debugSession();
          
          // Cache the session result
          globalSessionCache = { session, error };
          globalSessionTimestamp = Date.now();
          
          if (!mounted.current) {
            console.log('🚫 Component unmounted during initialization');
            return;
          }

          if (error) {
            console.error('❌ Session error:', error);
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            setSessionChecked(true);
            return;
          }

          if (session?.user) {
            console.log('✅ Session found, auth listener will handle user profile');
            // Don't fetch profile here - let the auth state listener handle it
            // This prevents double processing and timeouts
            setIsAuthenticated(true);
            // Auth state listener will set user and loading to false
          } else {
            console.log('🚫 No session found - user not authenticated');
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            setSessionChecked(true);
          }
        })();
        
        // Race between initialization and timeout
        await Promise.race([initializationPromise, initializationTimeout]);
        
      } catch (error) {
        console.error('❌ Critical error in initializeAuth:', error);
        if (mounted.current) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        globalInitializationInProgress = false;
        if (mounted.current) {
          console.log('🏁 Auth initialization complete');
          setSessionChecked(true);
          // Don't set loading to false here if we have a session - let auth listener handle it
          // Only set loading to false if no session or error
          if (!sessionInitialized) {
            setLoading(false);
          }
        }
      }
    };

    // Set up auth state listener with better error handling
    const setupAuthListener = () => {
      console.log('👂 Setting up auth state listener...');
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted.current) {
          console.log('🚫 Auth state change ignored - component unmounted');
          return;
        }

        console.log('🔔 Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        });

        // Handle INITIAL_SESSION to ensure we catch restored sessions
        if (event === 'INITIAL_SESSION') {
          console.log('🔄 Processing INITIAL_SESSION');
          // Don't skip - this is important for session restoration
        }

        try {
          // Handle different auth events
          switch (event) {
            case 'INITIAL_SESSION':
            case 'SIGNED_IN':
            case 'TOKEN_REFRESHED':
              if (session?.user) {
                console.log(`✅ User ${event.toLowerCase().replace('_', ' ')}`);
                setIsAuthenticated(true);
                
                // For INITIAL_SESSION, mark that we've processed it
                if (event === 'INITIAL_SESSION') {
                  sessionInitialized = true;
                  globalInitializationInProgress = false; // Clear global flag
                }
                
                // Fetch user profile with shorter timeout for auth listener
                try {
                  const userProfile = await Promise.race([
                    fetchUserProfile(session.user.id, mounted),
                    new Promise((_, reject) => 
                      setTimeout(() => reject(new Error('Auth listener profile fetch timeout')), 10000)
                    )
                  ]);
                  
                  if (mounted.current) {
                    setUser(userProfile as User | null);
                    setLoading(false);
                    setSessionChecked(true);
                    console.log('✅ Auth listener: Set loading=false, sessionChecked=true, user set');
                  }
                } catch (profileError) {
                  console.warn('⚠️ Profile fetch failed in auth listener, creating minimal user:', profileError);
                  if (mounted.current) {
                    // Create minimal user from session data
                    const minimalUser: User = {
                      id: session.user.id,
                      email: session.user.email || '',
                      full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                      phone: session.user.user_metadata?.phone || null,
                      status: 'active',
                      last_login: new Date().toISOString(),
                      created_at: session.user.created_at,
                      updated_at: new Date().toISOString()
                    };
                    setUser(minimalUser);
                    setLoading(false);
                    setSessionChecked(true);
                    console.log('✅ Auth listener: Set loading=false, sessionChecked=true, minimal user created');
                  }
                }
              } else {
                console.log(`⚠️ ${event} but no session`);
                if (mounted.current) {
                  setIsAuthenticated(false);
                  setUser(null);
                  setLoading(false);
                }
              }
              break;
            
            case 'SIGNED_OUT':
              console.log('👋 User signed out');
              if (mounted.current) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
              }
              break;
            
            case 'USER_UPDATED':
              if (session?.user && mounted.current) {
                console.log('🔄 User updated');
                const userProfile = await fetchUserProfile(session.user.id, mounted);
                if (mounted.current) {
                  setUser(userProfile);
                }
              }
              break;
            
            default:
              console.log('❓ Unhandled auth event:', event);
              if (session?.user) {
                if (mounted.current) {
                  setIsAuthenticated(true);
                  setLoading(false);
                }
              } else {
                if (mounted.current) {
                  setIsAuthenticated(false);
                  setUser(null);
                  setLoading(false);
                }
              }
          }
        } catch (error) {
          console.error('❌ Error handling auth state change:', error);
          if (mounted.current) {
            setLoading(false);
          }
        }
      });

      authSubscription = subscription;
      console.log('✅ Auth listener setup complete');
    };

    // Add visibility change listener and session monitoring
    const handleVisibilityChange = async () => {
      if (!document.hidden && mounted.current && sessionChecked) {
        console.log('👁️ Tab became visible, checking session...');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session && isAuthenticated) {
            console.log('❌ Session invalid after tab focus, signing out');
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
          } else if (session && !isAuthenticated) {
            console.log('✅ Session found after tab focus, but not authenticated');
            // Trigger re-authentication
            setIsAuthenticated(true);
            try {
              const userProfile = await fetchUserProfile(session.user.id, mounted);
              if (mounted.current) {
                setUser(userProfile);
                setLoading(false);
              }
            } catch (error) {
              console.error('Failed to fetch user profile on re-auth:', error);
            }
          } else if (session && isAuthenticated) {
            console.log('✅ Session and authentication both valid');
            // Check if session is close to expiring (within 5 minutes)
            if (session.expires_at) {
              const expiresAt = new Date(session.expires_at * 1000);
              const now = new Date();
              const timeUntilExpiry = expiresAt.getTime() - now.getTime();
              const fiveMinutes = 5 * 60 * 1000;
              
              if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
                console.log('⚠️ Session expiring soon, attempting refresh...');
                try {
                  const { error } = await supabase.auth.refreshSession();
                  if (error) {
                    console.error('Failed to refresh session:', error);
                  } else {
                    console.log('✅ Session refreshed successfully');
                  }
                } catch (refreshError) {
                  console.error('Error during session refresh:', refreshError);
                }
              }
            }
          }
        } catch (error) {
          console.error('❌ Error checking session on visibility change:', error);
        }
      }
    };

    // Add periodic session monitoring (every 5 minutes)
    const sessionMonitor = setInterval(() => {
      if (mounted.current && isAuthenticated && sessionChecked) {
        handleVisibilityChange(); // Reuse the same logic
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Initialize everything
    console.log('🎬 Starting auth setup...');
    setupAuthListener();
    
    // Small delay to let auth listener handle INITIAL_SESSION first
    setTimeout(() => {
      if (mounted.current && !sessionInitialized && !globalInitializationInProgress) {
        console.log('🔄 Manual initialization as fallback');
        initializeAuth();
      } else {
        console.log('⏭️ Skipping manual initialization - session already handled or in progress');
        console.log('   sessionInitialized:', sessionInitialized, 'globalInitializationInProgress:', globalInitializationInProgress);
      }
    }, 1000); // Increase to 1 second to give auth listener more time
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Safety net: ensure loading is never stuck (conservative approach)
    const safetyTimeout = setTimeout(() => {
      if (mounted.current) {
        console.log('🔍 Safety timeout check - only ensuring loading is false if still true');
        // Only force loading to false, don't touch auth state
        setLoading(false);
        setSessionChecked(true);
        
        // Reset global state if stuck
        if (globalInitializationInProgress) {
          globalInitializationInProgress = false;
          console.log('🔧 Reset global initialization flag');
        }
      }
    }, 20000); // 20 seconds - very conservative

    return () => {
      console.log('🧹 Cleaning up auth effect...');
      mounted.current = false;
      clearTimeout(safetyTimeout);
      clearInterval(sessionMonitor);
      if (authSubscription) {
        authSubscription.unsubscribe();
        console.log('✅ Auth subscription unsubscribed');
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependencies to prevent loops

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signOut, isAuthenticated };
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
