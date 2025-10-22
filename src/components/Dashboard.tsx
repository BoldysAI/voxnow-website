import { useState, useEffect, Fragment } from 'react';
import { Statistics } from './Statistics';
import { useNavigate } from 'react-router-dom';
import { useAuth, useVoicemails, getAnalysisByType, VoicemailWithAnalysis } from '../hooks/useSupabase';
import { 
  LogOut, 
  MessageSquare, 
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  Phone,
  Calendar,
  Search,
  FileText,
  Brain,
  Filter,
  BarChart3,
  Play,
  Download,
  Pause,
  Loader2,
  ExternalLink,
  CheckCircle,
  Circle,
  TrendingUp,
  Timer,
  AlertTriangle,
  Monitor,
  Scale as ScaleIcon,
  X,
  User
} from 'lucide-react';

type SortField = 'id' | 'received_at' | 'caller_phone_number' | 'duration_seconds';
type SortDirection = 'asc' | 'desc';
type PeriodFilter = 'all' | 'today' | 'week' | 'month';
type DurationFilter = 'all' | 'short' | 'medium' | 'long';
type ContentFilter = 'all' | 'with-transcription' | 'with-summary' | 'without-content';
type SentimentFilter = 'all' | 'Neutre' | 'Négatif' | 'Positif';
type UrgencyFilter = 'all' | 'Non Urgent' | 'Urgent' | 'Modéré';
type CaseStageFilter = 'all' | 'Dossier En Cours' | 'Nouveau Dossier';
type RequestCategoryFilter = 'all' | 'Conseil Juridique Requis' | 'Demande De Paiement' | 'Document À Fournir' | 'Document À Recevoir';
type FieldOfLawFilter = 'all' | 'Droit Administratif Et Public' | 'Indéterminé' | 'Droit Pénal';

interface DashboardProps {
  demoMode?: boolean;
}

export function Dashboard({ demoMode = false }: DashboardProps) {
  // Demo user data
  const demoUser = {
    id: '8647524b-c248-4bfc-9ea2-aaef11e36e85', // This should match the ID we created in the database
    email: 'demo@voxnow.be',
    full_name: 'Cabinet d\'Avocat Démo',
    demo_user: true
  };

  // Auth and data hooks - use demo data when in demo mode
  const { user: authUser, loading: authLoading, signOut: authSignOut, isAuthenticated } = useAuth();
  const user = demoMode ? demoUser : authUser;
  const signOut = demoMode ? () => navigate('/') : authSignOut;
  
  const { voicemails, loading: voicemailsLoading, error, fetchVoicemails, updateVoicemailStatus } = useVoicemails(user?.id);
  
  // UI state
  const [filteredVoicemails, setFilteredVoicemails] = useState<VoicemailWithAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'statistics'>('messages');
  const [sortField, setSortField] = useState<SortField>('received_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [mobileWarningDismissed, setMobileWarningDismissed] = useState(false);
  
  // Advanced filters
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');
  const [caseStageFilter, setCaseStageFilter] = useState<CaseStageFilter>('all');
  const [requestCategoryFilter, setRequestCategoryFilter] = useState<RequestCategoryFilter>('all');
  const [fieldOfLawFilter, setFieldOfLawFilter] = useState<FieldOfLawFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Quick filters (independent from advanced filters)
  const [quickTodayFilter, setQuickTodayFilter] = useState(false);
  const [quickUrgentFilter, setQuickUrgentFilter] = useState(false);
  const [quickUnreadFilter, setQuickUnreadFilter] = useState(false);
  
  // Audio player state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [audioSupportCache, setAudioSupportCache] = useState<Map<string, boolean>>(new Map());
  
  const navigate = useNavigate();

  // Anti-loop redirect to auth - only redirect when definitely not authenticated (skip in demo mode)
  useEffect(() => {
    // Skip auth redirect in demo mode
    if (demoMode) return;
    
    // Only redirect if we're absolutely sure user is not authenticated
    // AND we've waited long enough to avoid redirect loops
    if (!authLoading && !isAuthenticated && user === null) {
      console.log('Dashboard: Definitely not authenticated, redirecting to auth');
      
      // Add delay to prevent rapid redirect loops
      const redirectTimer = setTimeout(() => {
        // Double-check auth state hasn't changed during delay
        if (!isAuthenticated && user === null) {
          console.log('Dashboard: Confirmed redirect after delay');
          navigate('/auth', { replace: true }); // Use replace to prevent back button issues
        } else {
          console.log('Dashboard: Auth state changed during delay, not redirecting');
        }
      }, 1000); // 1 second delay to let auth stabilize

      return () => clearTimeout(redirectTimer);
    }
  }, [authLoading, isAuthenticated, user, navigate, demoMode]);

  // Check if user is on mobile and show warning
  useEffect(() => {
    const checkMobile = () => {
      // Don't show warning if already dismissed
      if (mobileWarningDismissed) return;
      
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setShowMobileWarning(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileWarningDismissed]);

    // Apply filters when dependencies change
  useEffect(() => {
    let filtered = voicemails.filter(vm => vm.status !== 'Supprimé');

    // Search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(voicemail => {
        const transcription = (voicemail.transcription || '').toLowerCase();
        const summary = (voicemail.ai_summary || '').toLowerCase();
        const id = (voicemail.id || '').toLowerCase();
        const phone = (voicemail.caller_phone_number || '').toLowerCase();
        
        return transcription.includes(searchLower) || 
               summary.includes(searchLower) || 
               id.includes(searchLower) ||
               phone.includes(searchLower);
      });
    }

    // Period filter
    if (periodFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(voicemail => {
        if (!voicemail.received_at) return false;
        const messageDate = new Date(voicemail.received_at);
        
        switch (periodFilter) {
          case 'today':
            return messageDate >= today;
          case 'week':
            return messageDate >= weekAgo;
          case 'month':
            return messageDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (durationFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const duration = voicemail.duration_seconds || 0;
        switch (durationFilter) {
          case 'short':
            return duration <= 30;
          case 'medium':
            return duration > 30 && duration <= 120;
          case 'long':
            return duration > 120;
          default:
            return true;
        }
      });
    }

    // Content filter
    if (contentFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const hasTranscription = !!voicemail.transcription;
        const hasSummary = !!voicemail.ai_summary;
        
        switch (contentFilter) {
          case 'with-transcription':
            return hasTranscription;
          case 'with-summary':
            return hasSummary;
          case 'without-content':
            return !hasTranscription && !hasSummary;
          default:
            return true;
        }
      });
    }

    // Sentiment filter
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const sentiment = getAnalysisByType(voicemail, 'Sentiment');
        // Direct exact match with stored values
        return sentiment === sentimentFilter;
      });
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const urgency = getAnalysisByType(voicemail, 'Urgence');
        // Direct exact match with stored values
        return urgency === urgencyFilter;
      });
    }

    // Case Stage filter
    if (caseStageFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const caseStage = getAnalysisByType(voicemail, 'Étape du dossier');
        // Direct exact match with stored values
        return caseStage === caseStageFilter;
      });
    }

    // Request Category filter
    if (requestCategoryFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const requestCategory = getAnalysisByType(voicemail, 'Catégorie');
        // Direct exact match with stored values
        return requestCategory === requestCategoryFilter;
      });
    }

    // Field of Law filter
    if (fieldOfLawFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const fieldOfLaw = getAnalysisByType(voicemail, 'Domaine juridique');
        // Direct exact match with stored values
        return fieldOfLaw === fieldOfLawFilter;
      });
    }

    // Quick filters (independent from advanced filters)
    if (quickTodayFilter) {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      filtered = filtered.filter(voicemail => {
        if (!voicemail.received_at) return false;
        const messageDate = new Date(voicemail.received_at);
        return messageDate >= startOfToday;
      });
    }

    if (quickUrgentFilter) {
      filtered = filtered.filter(voicemail => {
        const urgency = getAnalysisByType(voicemail, 'Urgence');
        return urgency === 'Urgent';
      });
    }

    if (quickUnreadFilter) {
      filtered = filtered.filter(voicemail => {
        return !voicemail.is_read;
      });
    }

    setFilteredVoicemails(filtered);
    setCurrentPage(1);
  }, [voicemails, searchTerm, periodFilter, durationFilter, contentFilter, sentimentFilter, urgencyFilter, caseStageFilter, requestCategoryFilter, fieldOfLawFilter, quickTodayFilter, quickUrgentFilter, quickUnreadFilter]);


  // Cleanup audio elements when component unmounts
  useEffect(() => {
    return () => {
      // Pause and cleanup all audio elements
      audioElements.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      setCurrentlyPlaying(null);
      setAudioLoading(null);
      setAudioSupportCache(new Map());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check localStorage on component mount
  useEffect(() => {
    const dismissed = localStorage.getItem('voxnow_mobile_warning_dismissed');
    if (dismissed === 'true') {
      setMobileWarningDismissed(true);
    }
  }, []);

  // Show loading while auth is in progress
  if (authLoading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vox-blue mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Vérification de l\'authentification...' : 'Chargement du profil utilisateur...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (redirect useEffect will handle it) - except in demo mode
  if (!demoMode && (!isAuthenticated || !user)) {
    return null;
  }





  // Get sentiment display with color coding - matches database values
  const getSentimentDisplay = (voicemail: VoicemailWithAnalysis) => {
    const sentiment = getAnalysisByType(voicemail, 'Sentiment').trim();
    
    if (!sentiment || sentiment === "") {
      return { text: 'Non analysé', color: 'text-gray-400 bg-gray-100' };
    }
    
    switch (sentiment) {
      case 'Positif':
        return { text: 'Positif', color: 'text-green-600 bg-green-50' };
      case 'Négatif':
        return { text: 'Négatif', color: 'text-red-600 bg-red-50' };
      case 'Neutre':
        return { text: 'Neutre', color: 'text-gray-600 bg-gray-50' };
      default:
        return { text: sentiment, color: 'text-blue-600 bg-blue-50' };
    }
  };

  // Get urgency display with color coding - matches database values
  const getUrgencyDisplay = (voicemail: VoicemailWithAnalysis) => {
    const urgency = getAnalysisByType(voicemail, 'Urgence').trim();
    
    if (!urgency || urgency === '') {
      return { text: 'Non analysé', color: 'text-gray-400 bg-gray-100' };
    }
    
    switch (urgency) {
      case 'Urgent':
        return { text: 'Urgent', color: 'text-red-600 bg-red-50' };
      case 'Modéré':
        return { text: 'Modéré', color: 'text-orange-600 bg-orange-50' };
      case 'Non Urgent':
        return { text: 'Non Urgent', color: 'text-green-600 bg-green-50' };
      default:
        return { text: urgency, color: 'text-blue-600 bg-blue-50' };
    }
  };



  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };






  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const toggleReadStatus = async (id: string) => {
    // Find the voicemail to get current read status from database
    const voicemail = voicemails.find(vm => vm.id === id);
    if (!voicemail) return;
    
    const newReadStatus = !voicemail.is_read;
    
    try {
      await updateVoicemailStatus(id, { 
        is_read: newReadStatus,
        read_at: newReadStatus ? new Date().toISOString() : null 
      });
      
      // No need to manually update local state - the useEffect will handle it
      // when voicemails data is updated via updateVoicemailStatus
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };


  const downloadAudio = (audioUrl?: string, voicemailId?: string) => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `voicemail_${voicemailId || 'audio'}.mp3`;
      link.click();
    }
  };

  const openAudioInNewTab = (audioUrl: string, showMessage = true) => {
    window.open(audioUrl, '_blank');
    if (showMessage) {
      // Use a more subtle notification instead of alert
      console.info('Audio ouvert dans un nouvel onglet car la lecture directe n\'est pas disponible');
    }
  };

  const checkAudioSupport = async (audioUrl: string): Promise<boolean> => {
    // Check cache first
    if (audioSupportCache.has(audioUrl)) {
      return audioSupportCache.get(audioUrl)!;
    }

    try {
      // Try to fetch the audio file to check accessibility
      const response = await fetch(audioUrl, { method: 'HEAD' });
      const canPlay = response.ok;
      
      if (canPlay) {
        // Check content type
        const contentType = response.headers.get('content-type');
        const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
        
        if (contentType && !supportedTypes.some(type => contentType.includes(type))) {
          console.warn('Audio format may not be supported:', contentType);
        }
      }
      
      // Cache the result
      const newCache = new Map(audioSupportCache);
      newCache.set(audioUrl, canPlay);
      setAudioSupportCache(newCache);
      
      return canPlay;
    } catch (error) {
      console.warn('Cannot access audio file directly:', error);
      
      // Cache negative result
      const newCache = new Map(audioSupportCache);
      newCache.set(audioUrl, false);
      setAudioSupportCache(newCache);
      
      return false;
    }
  };

  const toggleAudioPlayback = async (audioUrl?: string, voicemailId?: string) => {
    if (!audioUrl || !voicemailId) return;

    // If this audio is currently playing, pause it
    if (currentlyPlaying === voicemailId) {
      const currentAudio = audioElements.get(voicemailId);
      if (currentAudio) {
        currentAudio.pause();
        setCurrentlyPlaying(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (currentlyPlaying) {
      const currentAudio = audioElements.get(currentlyPlaying);
      if (currentAudio) {
        currentAudio.pause();
      }
    }

    setAudioLoading(voicemailId);

    // First, quickly check if we can access the audio file
    const canPlayDirect = await checkAudioSupport(audioUrl);
    
    if (!canPlayDirect) {
      setAudioLoading(null);
      openAudioInNewTab(audioUrl, false);
      return;
    }

    // Create new audio element if it doesn't exist
    let audio = audioElements.get(voicemailId);
    if (!audio) {
      audio = new Audio();
      
      // Set up event listeners
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null);
        setAudioLoading(null);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Direct audio playback failed, falling back to new tab:', e);
        setCurrentlyPlaying(null);
        setAudioLoading(null);
        openAudioInNewTab(audioUrl, false);
      });

      audio.addEventListener('loadstart', () => {
        console.log('Audio loading started for:', audioUrl);
      });

      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through:', audioUrl);
        setAudioLoading(null);
      });

      audio.addEventListener('loadeddata', () => {
        setAudioLoading(null);
      });
      
      const newAudioElements = new Map(audioElements);
      newAudioElements.set(voicemailId, audio);
      setAudioElements(newAudioElements);
    }

    // Set the source and try to load
    try {
      audio.src = audioUrl;
      audio.load(); // Explicitly load the audio
      
      // Set a timeout for loading
      const loadTimeout = setTimeout(() => {
        if (audioLoading === voicemailId) {
          setAudioLoading(null);
          setCurrentlyPlaying(null);
          openAudioInNewTab(audioUrl, false);
        }
      }, 5000); // 5 second timeout
      
      // Attempt to play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          clearTimeout(loadTimeout);
          setCurrentlyPlaying(voicemailId);
          setAudioLoading(null);
        }).catch((error) => {
          clearTimeout(loadTimeout);
          console.error('Play promise rejected:', error);
          setCurrentlyPlaying(null);
          setAudioLoading(null);
          openAudioInNewTab(audioUrl, false);
        });
      }
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      setCurrentlyPlaying(null);
      setAudioLoading(null);
      openAudioInNewTab(audioUrl, false);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'Date', 'Numéro', 'Durée', 'Résumé IA', 'Sentiment', 'Urgence', 'Catégorie', 'Domaine juridique', 'Transcription'].join(','),
      ...filteredVoicemails.map(vm => [
        vm.id || '',
        vm.received_at || '',
        vm.caller_phone_number || '',
        vm.duration_seconds || '',
        `"${(vm.ai_summary || '').replace(/"/g, '""')}"`,
        getSentimentDisplay(vm).text,
        getUrgencyDisplay(vm).text,
        getAnalysisByType(vm, 'Catégorie'),
        getAnalysisByType(vm, 'Domaine juridique'),
        `"${(vm.transcription || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voicemails.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortedData = () => {
    return [...filteredVoicemails].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'duration_seconds':
          aValue = a.duration_seconds || 0;
          bValue = b.duration_seconds || 0;
          break;
        case 'received_at':
          aValue = a.received_at ? new Date(a.received_at).getTime() : 0;
          bValue = b.received_at ? new Date(b.received_at).getTime() : 0;
          break;
        case 'caller_phone_number':
          aValue = (a.caller_phone_number || '').toLowerCase();
          bValue = (b.caller_phone_number || '').toLowerCase();
          break;
        case 'id':
          aValue = (a.id || '').toLowerCase();
          bValue = (b.id || '').toLowerCase();
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getPaginatedData = () => {
    const sortedData = getSortedData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredVoicemails.length / itemsPerPage);
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Non défini';
    try {
      return new Date(timeString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Statistics calculations
  const totalMessages = voicemails.length;
  const processedMessages = voicemails.filter(vm => vm.transcription || vm.ai_summary).length;
  const totalDuration = voicemails.reduce((sum, vm) => sum + (vm.duration_seconds || 0), 0);
  const unreadMessages = voicemails.filter(vm => !vm.is_read).length;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-vox-blue" /> : 
      <ChevronDown className="h-4 w-4 text-vox-blue" />;
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Mobile Warning Popup */}
      {showMobileWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-orange-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Dashboard optimisé pour ordinateur
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ce tableau de bord démo n'est actuellement adapté que pour les ordinateurs. 
                Pour une expérience optimale, veuillez utiliser un écran plus large.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setShowMobileWarning(false);
                    setMobileWarningDismissed(true);
                    // Store in localStorage to persist across page reloads
                    localStorage.setItem('voxnow_mobile_warning_dismissed', 'true');
                  }}
                  className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Continuer quand même
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowMobileWarning(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        {/* Demo Banner */}
        {demoMode && (
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-2 px-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="font-semibold">MODE DÉMONSTRATION</span>
              <span className="text-sm opacity-90">• Données exemples</span>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                alt="VoxNow Logo"
                className="h-10"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-vox-blue">Tableau de bord</h1>
                  {demoMode && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      DÉMO
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Gestion des messages vocaux</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.email || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'Connecté'}</p>
              </div>
              
              {!demoMode && (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-vox-blue transition-colors"
                  title="Mon profil"
                >
                  <User className="h-5 w-5 mr-2" />
                  Profil
                </button>
              )}
              
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total messages</p>
                <p className="text-2xl font-bold text-vox-blue">{totalMessages}</p>
              </div>
              <div className="w-12 h-12 bg-vox-blue/10 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-vox-blue" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages traités</p>
                <p className="text-2xl font-bold text-now-green">{processedMessages}</p>
              </div>
              <div className="w-12 h-12 bg-now-green/10 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-now-green" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Durée totale</p>
                <p className="text-2xl font-bold text-light-blue">{formatDuration(totalDuration)}</p>
              </div>
              <div className="w-12 h-12 bg-light-blue/10 rounded-full flex items-center justify-center">
                <Timer className="h-6 w-6 text-light-blue" />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
            unreadMessages > 0 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 ring-2 ring-red-100' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non lus</p>
                <p className={`text-2xl font-bold ${
                  unreadMessages > 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {unreadMessages}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                unreadMessages > 0 
                  ? 'bg-red-100 animate-pulse' 
                  : 'bg-gray-100'
              }`}>
                <Circle className={`h-6 w-6 ${
                  unreadMessages > 0 ? 'text-red-600' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les transcriptions, résumés, noms ou numéros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setQuickTodayFilter(!quickTodayFilter)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  quickTodayFilter
                    ? 'bg-vox-blue text-white shadow-md'
                    : 'bg-blue-50 text-vox-blue hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Aujourd'hui
              </button>
              
              <button
                onClick={() => setQuickUrgentFilter(!quickUrgentFilter)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  quickUrgentFilter
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Urgent
              </button>
              
              <button
                onClick={() => setQuickUnreadFilter(!quickUnreadFilter)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  quickUnreadFilter
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                }`}
              >
                <Circle className="h-4 w-4 mr-2" />
                Non lu
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </button>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={fetchVoicemails}
                className="flex items-center px-4 py-3 bg-vox-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center px-4 py-3 bg-now-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                  <select
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Toutes les périodes</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <select
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value as DurationFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Toutes les durées</option>
                    <option value="short">Court (≤30s)</option>
                    <option value="medium">Moyen (30s-2min)</option>
                     <option value="long">Long (&gt;2min)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                  <select
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value as ContentFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Tout le contenu</option>
                    <option value="with-transcription">Avec transcription</option>
                    <option value="with-summary">Avec résumé IA</option>
                    <option value="without-content">Sans contenu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                  <select
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value as SentimentFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Tous les sentiments</option>
                    <option value="Neutre">Neutre</option>
                    <option value="Négatif">Négatif</option>
                    <option value="Positif">Positif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgence</label>
                  <select
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value as UrgencyFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Toutes les urgences</option>
                    <option value="Non Urgent">Non Urgent</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Modéré">Modéré</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Étape du dossier</label>
                  <select
                    value={caseStageFilter}
                    onChange={(e) => setCaseStageFilter(e.target.value as CaseStageFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Toutes les étapes</option>
                    <option value="Dossier En Cours">Dossier En Cours</option>
                    <option value="Nouveau Dossier">Nouveau Dossier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie de demande</label>
                  <select
                    value={requestCategoryFilter}
                    onChange={(e) => setRequestCategoryFilter(e.target.value as RequestCategoryFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="Conseil Juridique Requis">Conseil Juridique Requis</option>
                    <option value="Demande De Paiement">Demande De Paiement</option>
                    <option value="Document À Fournir">Document À Fournir</option>
                    <option value="Document À Recevoir">Document À Recevoir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domaine juridique</label>
                  <select
                    value={fieldOfLawFilter}
                    onChange={(e) => setFieldOfLawFilter(e.target.value as FieldOfLawFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="all">Tous les domaines</option>
                    <option value="Droit Administratif Et Public">Droit Administratif Et Public</option>
                    <option value="Indéterminé">Indéterminé</option>
                    <option value="Droit Pénal">Droit Pénal</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'text-vox-blue border-b-2 border-vox-blue bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Messages vocaux ({filteredVoicemails.length})</span>
                {unreadMessages > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                    {unreadMessages} non lu{unreadMessages > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'statistics'
                  ? 'text-vox-blue border-b-2 border-vox-blue bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Statistiques</span>
              </div>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Erreur: {error}</p>
            <button 
              onClick={fetchVoicemails}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Messages List */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-vox-blue">Messages vocaux</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-gray-600">
                      {filteredVoicemails.length} message{filteredVoicemails.length !== 1 ? 's' : ''} 
                      {searchTerm && ` (filtré${filteredVoicemails.length !== 1 ? 's' : ''} sur ${voicemails.length})`}
                    </p>
                    {(quickTodayFilter || quickUrgentFilter || quickUnreadFilter) && (
                      <div className="flex space-x-1">
                        {quickTodayFilter && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-vox-blue">
                            <Calendar className="h-3 w-3 mr-1" />
                            Aujourd'hui
                          </span>
                        )}
                        {quickUrgentFilter && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </span>
                        )}
                        {quickUnreadFilter && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
                            <Circle className="h-3 w-3 mr-1" />
                            Non lu
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-vox-blue" />
                  <span className="text-sm text-gray-600">
                    {Math.round((processedMessages / totalMessages) * 100)}% traités
                  </span>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {(authLoading || voicemailsLoading) && (
              <div className="flex flex-col justify-center items-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vox-blue"></div>
                <span className="text-gray-600 font-medium">Chargement des messages vocaux...</span>
                <div className="text-center">
                  <div className="bg-blue-50 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Première connexion ?</strong> Le chargement peut prendre quelques secondes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 px-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md mx-auto">
                  <p className="font-medium mb-4">{error}</p>
                  <button
                    onClick={() => fetchVoicemails()}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!(authLoading || voicemailsLoading) && !error && filteredVoicemails.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="bg-gray-50 p-8 rounded-lg max-w-md mx-auto">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Aucun message vocal pour le moment</p>
                  <p className="text-gray-500 text-sm">
                    Les messages apparaîtront ici dès qu'ils seront reçus et traités.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-vox-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Actualiser
                    </button>
                  </div>
                </div>
              </div>
            )}

            {filteredVoicemails.length > 0 && (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left w-12"></th>
                        <th className="px-6 py-4 text-left w-12"></th>
                        <th className="px-6 py-4 text-left min-w-[150px]">
                          <button
                            onClick={() => handleSort('received_at')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Date & Heure</span>
                            <SortIcon field="received_at" />
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left min-w-[200px]">
                          <span className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <Brain className="h-4 w-4" />
                            <span>Résumé IA</span>
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left min-w-[120px]">
                          <span className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <TrendingUp className="h-4 w-4" />
                            <span>Analyse de sentiment</span>
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left min-w-[120px]">
                          <span className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Analyse d'urgence</span>
                          </span>
                        </th>
                        <th className="px-6 py-4 text-left min-w-[140px]">
                          <button
                            onClick={() => handleSort('caller_phone_number')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Numéro</span>
                            <SortIcon field="caller_phone_number" />
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort('duration_seconds')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Clock className="h-4 w-4" />
                            <span>Durée</span>
                            <SortIcon field="duration_seconds" />
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left w-24">
                          <span className="text-sm font-medium text-gray-700">Audio</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getPaginatedData().map((voicemail) => (
                        <Fragment key={voicemail.id}>
                          <tr className={`transition-colors ${
                            !voicemail.is_read 
                              ? 'bg-white border-l-4 border-l-vox-blue shadow-sm hover:bg-blue-50/20' 
                              : 'bg-gray-50/60 text-gray-600 hover:bg-gray-100/80'
                          }`}>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleRowExpansion(voicemail.id)}
                                className="text-gray-400 hover:text-vox-blue transition-colors"
                              >
                                {expandedRows.has(voicemail.id) ? (
                                  <ChevronDown className="h-5 w-5" />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleReadStatus(voicemail.id)}
                                className={`transition-colors ${
                                  voicemail.is_read 
                                    ? 'text-gray-400 hover:text-now-green' 
                                    : 'text-vox-blue hover:text-now-green animate-pulse'
                                }`}
                                title={voicemail.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
                              >
                                {voicemail.is_read ? (
                                  <CheckCircle className="h-5 w-5 text-now-green" />
                                ) : (
                                  <Circle className="h-5 w-5 stroke-2" />
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm flex items-center space-x-2 ${
                                !voicemail.is_read ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>
                                <span>{formatTime(voicemail.received_at)}</span>
                                {!voicemail.is_read && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-vox-blue text-white">
                                    NOUVEAU
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`${
                                !voicemail.is_read ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>
                                {voicemail.ai_summary ? 
                                  truncateText(voicemail.ai_summary, 60) : 
                                  <span className="text-gray-400 italic">Aucun résumé</span>
                                }
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {(() => {
                                const sentimentDisplay = getSentimentDisplay(voicemail);
                                return (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sentimentDisplay.color}`}>
                                    {sentimentDisplay.text}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4">
                              {(() => {
                                const urgencyDisplay = getUrgencyDisplay(voicemail);
                                return (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${urgencyDisplay.color}`}>
                                    {urgencyDisplay.text}
                                  </span>
                                );
                              })()}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`font-medium ${
                                !voicemail.is_read ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {voicemail.caller_phone_number || 'Non défini'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`text-sm ${
                                !voicemail.is_read ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>
                                {formatDuration(voicemail.duration_seconds)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {(voicemail.audio_url || voicemail.audio_file_url) ? (
                                <div className="flex space-x-2">
                                  {voicemail.audio_url && (
                                    <button
                                      onClick={() => toggleAudioPlayback(voicemail.audio_url, voicemail.id)}
                                      className="p-2 text-vox-blue hover:bg-vox-blue/10 rounded-lg transition-colors relative"
                                      title={
                                        audioLoading === voicemail.id ? "Chargement..." :
                                        currentlyPlaying === voicemail.id ? "Arrêter la lecture" : 
                                        audioSupportCache.get(voicemail.audio_url || '') === false ? "Ouvrir dans un nouvel onglet" :
                                        "Écouter le message"
                                      }
                                      disabled={audioLoading === voicemail.id}
                                    >
                                      {audioLoading === voicemail.id ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                      ) : currentlyPlaying === voicemail.id ? (
                                        <Pause className="h-5 w-5" />
                                      ) : (
                                        <Play className="h-5 w-5" />
                                      )}
                                      {voicemail.audio_url && audioSupportCache.get(voicemail.audio_url) === false && (
                                        <ExternalLink className="h-2 w-2 absolute -top-0.5 -right-0.5 text-gray-400" />
                                      )}
                                    </button>
                                  )}
                                  {voicemail.audio_file_url && (
                                    <button
                                      onClick={() => downloadAudio(voicemail.audio_file_url, voicemail.id)}
                                      className="p-2 text-now-green hover:bg-now-green/10 rounded-lg transition-colors"
                                      title="Télécharger l'audio"
                                    >
                                      <Download className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                          
                          {/* Expanded Row Details */}
                          {expandedRows.has(voicemail.id) && (
                            <tr>
                              <td colSpan={9} className="px-6 py-6 bg-gray-50">
                                <div className="space-y-6">
                                  {/* Transcription complète */}
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                      <FileText className="h-5 w-5 text-vox-blue mr-2" />
                                      Transcription complète
                                    </h4>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {voicemail.transcription || 'Aucune transcription disponible'}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Analyse IA */}
                                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Analyse de sentiment</h4>
                                      </div>
                                      {(() => {
                                        const sentimentDisplay = getSentimentDisplay(voicemail);
                                        return (
                                          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${sentimentDisplay.color}`}>
                                            {sentimentDisplay.text}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Analyse d'urgence</h4>
                                      </div>
                                      {(() => {
                                        const urgencyDisplay = getUrgencyDisplay(voicemail);
                                        return (
                                          <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${urgencyDisplay.color}`}>
                                            {urgencyDisplay.text}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                  </div>

                                  {/* Analyses supplémentaires */}
                                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <FileText className="h-5 w-5 text-purple-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Étape du dossier</h4>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {getAnalysisByType(voicemail, 'Étape du dossier') || 'Non analysé'}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Catégorie de demande</h4>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {getAnalysisByType(voicemail, 'Catégorie') || 'Non analysé'}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <ScaleIcon className="h-5 w-5 text-indigo-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Domaine juridique</h4>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {getAnalysisByType(voicemail, 'Domaine juridique') || 'Non analysé'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Résumé IA */}
                                  {voicemail.ai_summary && (
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                                      <div className="flex items-center mb-3">
                                        <Brain className="h-5 w-5 text-now-green mr-2" />
                                        <h4 className="font-semibold text-gray-900">Résumé IA</h4>
                                      </div>
                                      <p className="text-gray-700 leading-relaxed">
                                        {voicemail.ai_summary}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* SMS envoyé */}
                                  {voicemail.sms_sent && (
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                                      <div className="flex items-center mb-3">
                                        <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
                                        <h4 className="font-semibold text-gray-900">SMS envoyé</h4>
                                      </div>
                                      <p className="text-gray-700 leading-relaxed">
                                        {voicemail.sms_sent}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Informations supplémentaires */}
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <h4 className="font-semibold text-gray-900 mb-2">Détails de l'appel</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">ID Message:</span>
                                          <span className="font-medium">{voicemail.id || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Numéro:</span>
                                          <span className="font-medium">{voicemail.caller_phone_number || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Durée:</span>
                                          <span className="font-medium">{formatDuration(voicemail.duration_seconds)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Date & Heure:</span>
                                          <span className="font-medium">{formatTime(voicemail.received_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {(voicemail.audio_url || voicemail.audio_file_url) && (
                                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Audio</h4>
                                        <div className="flex space-x-3">
                                          {voicemail.audio_url && (
                                            <button
                                              onClick={() => toggleAudioPlayback(voicemail.audio_url, voicemail.id)}
                                              className="flex items-center px-4 py-2 bg-vox-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 relative"
                                              disabled={audioLoading === voicemail.id}
                                              title={
                                                audioSupportCache.get(voicemail.audio_url || '') === false ? 
                                                "Ouvrira dans un nouvel onglet" : undefined
                                              }
                                            >
                                              {audioLoading === voicemail.id ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                  Chargement...
                                                </>
                                              ) : currentlyPlaying === voicemail.id ? (
                                                <>
                                                  <Pause className="h-4 w-4 mr-2" />
                                                  Arrêter la lecture
                                                </>
                                              ) : (
                                                <>
                                                  <Play className="h-4 w-4 mr-2" />
                                                  {audioSupportCache.get(voicemail.audio_url || '') === false ? 
                                                    "Ouvrir l'audio" : "Écouter l'enregistrement"}
                                                  {audioSupportCache.get(voicemail.audio_url || '') === false && (
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                  )}
                                                </>
                                              )}
                                            </button>
                                          )}
                                          {voicemail.audio_file_url && (
                                            <button
                                              onClick={() => downloadAudio(voicemail.audio_file_url, voicemail.id)}
                                              className="flex items-center px-4 py-2 bg-now-green text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                            >
                                              <Download className="h-4 w-4 mr-2" />
                                              Télécharger
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {getTotalPages() > 1 && (
                  <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} sur {getTotalPages()} 
                      ({filteredVoicemails.length} message{filteredVoicemails.length !== 1 ? 's' : ''} au total)
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-vox-blue text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                        disabled={currentPage === getTotalPages()}
                        className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                Statistiques des messages vocaux
                {filteredVoicemails.length > 0 && (
                  <span className="text-lg text-gray-600 font-normal ml-2">
                    ({filteredVoicemails.length} messages analysés)
                  </span>
                )}
              </h2>
            </div>
            <Statistics records={filteredVoicemails} />
          </div>
        )}
      </div>
    </div>
  );
}