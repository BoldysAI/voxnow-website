import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Statistics } from './Statistics';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
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
  User,
  Calendar,
  Search,
  FileText,
  Brain,
  Filter,
  BarChart3,
  Play,
  Archive,
  Download,
  CheckCircle,
  Circle,
  TrendingUp,
  Timer,
  Volume2,
  AlertTriangle,
  Monitor,
  Users,
  Scale as ScaleIcon,
  X
} from 'lucide-react';

interface VoicemailRecord {
  id: string;
  fields: {
    // Champs de base
    Name?: string;                           // Autonumber - ID du message
    Time?: string;                           // Long text - Date/heure de réception
    'Caller Phone number'?: string;         // Single line text - Numéro appelant
    'Duration (Seconds)'?: number;          // Number - Durée en secondes
    'VoxNow Line'?: string;                 // Single line text - Ligne VoxNow
    
    // Contenu du message
    Transcription?: string;                 // Long text - Transcription complète
    'Résumé'?: string;                      // Long text - Résumé IA
    'Audio File'?: string;                  // Single line text - URL fichier audio
    
    // Analyses IA
    'Sentiment Analysis'?: string;          // AI text - Analyse sentiment
    'Urgence Analysis'?: string;            // AI text - Analyse urgence
    'Request category Analysis'?: string;   // AI text - Catégorie de demande
    'Field of law Analysis'?: string;       // AI text - Domaine juridique
    
    // Gestion et statuts
    'Status email avocat'?: string;         // Single select - Statut email
    'Status SMS client'?: string;           // Single select - Statut SMS
    'SMS draft'?: string;                   // Long text - Brouillon SMS
    
    // Relations
    Users?: string[];                       // Linked record vers Users
    
    // Champs de travail IA (Long text)
    'Analyse de sentiment'?: string;
    'Analyse de l\'urgence'?: string;
    
    // Anciens champs (compatibilité)
    'sentiment test'?: string;
  };
}

type SortField = 'Name' | 'VoxNow Line' | 'Duration (Seconds)' | 'Time' | 'Caller Phone number';
type SortDirection = 'asc' | 'desc';
type PeriodFilter = 'all' | 'today' | 'week' | 'month';
type DurationFilter = 'all' | 'short' | 'medium' | 'long';
type ContentFilter = 'all' | 'with-transcription' | 'with-summary' | 'without-content';
type SentimentFilter = 'all' | 'neutral' | 'negative';
type UrgencyFilter = 'all' | 'not-urgent' | 'urgent' | 'moderate';
type CaseStageFilter = 'all' | 'ongoing-case' | 'new-case';
type RequestCategoryFilter = 'all' | 'legal-advice-needed' | 'case-update-requested' | 'payment-inquiry' | 'document-to-provide' | 'document-to-receive' | 'meeting-requested' | 'urgent-action-required' | 'ongoing-case';
type FieldOfLawFilter = 'all' | 'contract-law' | 'family-law' | 'employment-law' | 'civil-law' | 'administrative-and-public-law' | 'undetermined' | 'criminal-law' | 'business-and-commercial-law' | 'consumer-law' | 'banking-and-finance-law' | 'inheritance-and-succession-law' | 'real-estate-law' | 'ongoing-case';

export function Dashboard() {
  const [voicemails, setVoicemails] = useState<VoicemailRecord[]>([]);
  const [filteredVoicemails, setFilteredVoicemails] = useState<VoicemailRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'statistics'>('messages');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [sortField, setSortField] = useState<SortField>('Time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [archivedMessages, setArchivedMessages] = useState<Set<string>>(new Set());
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
  
  const navigate = useNavigate();

  // Utility function for safe string handling
  const getSafeString = (value: any, fallback: string = "non analysé"): string => {
    if (!value) return fallback;
    
    // Handle Airtable AI field objects
    if (typeof value === "object" && value.value !== undefined) {
      return value.value && value.value.trim() !== "" ? value.value : fallback;
    }
    
    // Handle regular strings
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
    
    // Handle other object types by converting to string
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    
    return fallback;
  };

  // Capitalize first letter for display
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get sentiment test display with color coding
  const getSentimentDisplay = (record: VoicemailRecord) => {
    // Essayer plusieurs champs de sentiment dans l'ordre de priorité
    const sentimentSources = [
      record.fields['Sentiment Analysis'],
      record.fields['sentiment test']
    ];
    
    let sentiment = '';
    for (const source of sentimentSources) {
      if (source) {
        // Handle Airtable AI field objects
        if (typeof source === "object" && source.value !== undefined) {
          sentiment = getSafeString(source.value, '');
        } else if (typeof source === "string") {
          sentiment = source;
        }
        if (sentiment && sentiment.trim() !== '') break;
      }
    }
    
    const normalizedSentiment = getSafeString(sentiment, '').toLowerCase().trim();
    
    if (!normalizedSentiment || normalizedSentiment === "") {
      return { text: 'Non analysé', color: 'text-gray-400 bg-gray-100' };
    }
    
    switch (normalizedSentiment) {
      case 'positive':
      case 'positif':
        return { text: 'Positive', color: 'text-green-600 bg-green-50' };
      case 'negative':
      case 'négatif':
        return { text: 'Negative', color: 'text-red-600 bg-red-50' };
      case 'neutral':
      case 'neutre':
        return { text: 'Neutral', color: 'text-gray-600 bg-gray-50' };
      default:
        return { text: capitalize(normalizedSentiment), color: 'text-blue-600 bg-blue-50' };
    }
  };

  // Get urgency display with color coding
  const getUrgencyDisplay = (record: VoicemailRecord) => {
    let urgencyValue = '';
    const urgencySource = record.fields['Urgence Analysis'];
    
    if (urgencySource) {
      // Handle Airtable AI field objects
      if (typeof urgencySource === "object" && urgencySource.value !== undefined) {
        urgencyValue = getSafeString(urgencySource.value, '');
      } else if (typeof urgencySource === "string") {
        urgencyValue = urgencySource;
      }
    }
    
    if (!urgencyValue || urgencyValue.trim() === '') {
      return { text: 'Non analysé', color: 'text-gray-400 bg-gray-100' };
    }
    
    const normalizedUrgency = getSafeString(urgencyValue, '').toLowerCase().trim();
    
    switch (normalizedUrgency) {
      case 'critique':
      case 'urgent':
      case 'haute':
      case 'high':
      case 'élevé':
      case 'élevée':
        return { text: 'Urgent', color: 'text-red-600 bg-red-50' };
      case 'moyenne':
      case 'moyen':
      case 'medium':
      case 'modéré':
      case 'modérée':
        return { text: 'Moyen', color: 'text-orange-600 bg-orange-50' };
      case 'faible':
      case 'basse':
      case 'low':
      case 'bas':
        return { text: 'Faible', color: 'text-green-600 bg-green-50' };
      default:
        return { text: capitalize(normalizedUrgency), color: 'text-blue-600 bg-blue-50' };
    }
  };

  useEffect(() => {
    fetchVoicemails();
    
    // Check if user is on mobile and show warning
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

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [searchTerm, voicemails, periodFilter, durationFilter, contentFilter, sentimentFilter, urgencyFilter, caseStageFilter, requestCategoryFilter, fieldOfLawFilter, archivedMessages]);

  // Check localStorage on component mount
  useEffect(() => {
    const dismissed = localStorage.getItem('voxnow_mobile_warning_dismissed');
    if (dismissed === 'true') {
      setMobileWarningDismissed(true);
    }
  }, []);

  const fetchVoicemails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
        setLoading(false);
        setError('Délai d\'attente dépassé. Veuillez réessayer.');
      }, 10000); // 10 seconds timeout
      
      const response = await fetch(
        `https://api.airtable.com/v0/appaHCYACotTr76A1/Voicemails%20(demo)`,
        {
          headers: {
            'Authorization': 'Bearer patozC94xMMGI4CTT.e4967e60f6012ef4e3e8f82eac56fdaef15452ab3c56d06c1de888c1e109367e',
            'Content-Type': 'application/json'
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      setVoicemails(data.records || []);
      
      // Debug: Log first record to see available fields
      if (data.records && data.records.length > 0) {
        console.log('Premier enregistrement Airtable:', data.records[0]);
        console.log('Champs disponibles:', Object.keys(data.records[0].fields));
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des données:', err);
      setLoadingTimeout(true);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to normalize analysis values for filtering
  const normalizeAnalysisValue = (value: any): string => {
    if (!value) return '';
    
    // Handle Airtable AI field objects
    if (typeof value === "object" && value.value !== undefined) {
      return (value.value || '').toString().toLowerCase().trim();
    }
    
    // Handle regular strings
    if (typeof value === "string") {
      return value.toLowerCase().trim();
    }
    
    return '';
  };

  const applyFilters = () => {
    let filtered = voicemails.filter(vm => !archivedMessages.has(vm.id));

    // Search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(voicemail => {
        const transcription = (voicemail.fields.Transcription || '').toString().toLowerCase();
        const summary = (voicemail.fields['Résumé'] || '').toString().toLowerCase();
        const name = (voicemail.fields.Name || '').toString().toLowerCase();
        const phone = (voicemail.fields['Caller Phone number'] || '').toString().toLowerCase();
        
        return transcription.includes(searchLower) || 
               summary.includes(searchLower) || 
               name.includes(searchLower) ||
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
        if (!voicemail.fields.Time) return false;
        const messageDate = new Date(voicemail.fields.Time);
        
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
        const duration = voicemail.fields['Duration (Seconds)'] || 0;
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
        const hasTranscription = !!voicemail.fields.Transcription;
        const hasSummary = !!voicemail.fields['Résumé'];
        
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
        const sentiment = normalizeAnalysisValue(voicemail.fields['Sentiment Analysis']);
        return sentiment === sentimentFilter;
      });
    }

    // Urgency filter
    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const urgency = normalizeAnalysisValue(voicemail.fields['Urgence Analysis']);
        return urgency === urgencyFilter.replace('-', ' ');
      });
    }

    // Case Stage filter
    if (caseStageFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const caseStage = normalizeAnalysisValue(voicemail.fields['Case Stage Analysis']);
        return caseStage === caseStageFilter.replace('-', ' ');
      });
    }

    // Request Category filter
    if (requestCategoryFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const requestCategory = normalizeAnalysisValue(voicemail.fields['Request category Analysis']);
        return requestCategory === requestCategoryFilter.replace(/-/g, ' ');
      });
    }

    // Field of Law filter
    if (fieldOfLawFilter !== 'all') {
      filtered = filtered.filter(voicemail => {
        const fieldOfLaw = normalizeAnalysisValue(voicemail.fields['Field of law Analysis']);
        if (fieldOfLawFilter === 'undetermined') {
          return fieldOfLaw === 'undetermined.';
        }
        return fieldOfLaw === fieldOfLawFilter.replace(/-/g, ' ');
      });
    }

    setFilteredVoicemails(filtered);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
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

  const toggleReadStatus = (id: string) => {
    const newRead = new Set(readMessages);
    if (newRead.has(id)) {
      newRead.delete(id);
    } else {
      newRead.add(id);
    }
    setReadMessages(newRead);
  };

  const archiveMessage = (id: string) => {
    const newArchived = new Set(archivedMessages);
    newArchived.add(id);
    setArchivedMessages(newArchived);
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    }
  };

  const exportData = () => {
    const csvContent = [
      ['ID', 'Date', 'Numéro', 'Durée', 'Résumé IA', 'Sentiment', 'Urgence', 'Catégorie', 'Domaine juridique', 'Statut Email', 'Statut SMS', 'Transcription'].join(','),
      ...filteredVoicemails.map(vm => [
        vm.fields.Name || '',
        vm.fields.Time || '',
        vm.fields['Caller Phone number'] || '',
        vm.fields['Duration (Seconds)'] || '',
        `"${(vm.fields['Résumé'] || '').replace(/"/g, '""')}"`,
        getSentimentDisplay(vm).text,
        getUrgencyDisplay(vm).text,
        vm.fields['Request category Analysis'] || '',
        vm.fields['Field of law Analysis'] || '',
        vm.fields['Status email avocat'] || '',
        vm.fields['Status SMS client'] || '',
        `"${(vm.fields.Transcription || '').replace(/"/g, '""')}"`,
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
      let aValue = a.fields[sortField];
      let bValue = b.fields[sortField];

      if (sortField === 'Duration (Seconds)') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (sortField === 'Time') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
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
  const processedMessages = voicemails.filter(vm => vm.fields.Transcription || vm.fields['Résumé']).length;
  const totalDuration = voicemails.reduce((sum, vm) => sum + (vm.fields['Duration (Seconds)'] || 0), 0);
  const unreadMessages = totalMessages - readMessages.size;

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-vox-blue" /> : 
      <ChevronDown className="h-4 w-4 text-vox-blue" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vox-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des messages vocaux...</p>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                alt="VoxNow Logo"
                className="h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-vox-blue">Tableau de bord</h1>
                <p className="text-sm text-gray-600">Gestion des messages vocaux</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">sacha@voxnow.be</p>
                <p className="text-xs text-gray-500">Compte démo</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-vox-blue transition-colors"
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

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non lus</p>
                <p className="text-2xl font-bold text-light-green">{unreadMessages}</p>
              </div>
              <div className="w-12 h-12 bg-light-green/10 rounded-full flex items-center justify-center">
                <Circle className="h-6 w-6 text-light-green" />
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
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
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
                    <option value="not-urgent">Not urgent</option>
                    <option value="urgent">Urgent</option>
                    <option value="moderate">Moderate</option>
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
                    <option value="ongoing-case">Ongoing case</option>
                    <option value="new-case">New case</option>
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
                    <option value="legal-advice-needed">Legal advice needed</option>
                    <option value="case-update-requested">Case update requested</option>
                    <option value="payment-inquiry">Payment inquiry</option>
                    <option value="document-to-provide">Document to provide</option>
                    <option value="document-to-receive">Document to receive</option>
                    <option value="meeting-requested">Meeting requested</option>
                    <option value="urgent-action-required">Urgent action required</option>
                    <option value="ongoing-case">Ongoing case</option>
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
                    <option value="contract-law">Contract law</option>
                    <option value="family-law">Family law</option>
                    <option value="employment-law">Employment law</option>
                    <option value="civil-law">Civil law</option>
                    <option value="administrative-and-public-law">Administrative and public law</option>
                    <option value="undetermined">Undetermined</option>
                    <option value="criminal-law">Criminal law</option>
                    <option value="business-and-commercial-law">Business and commercial law</option>
                    <option value="consumer-law">Consumer law</option>
                    <option value="banking-and-finance-law">Banking and finance law</option>
                    <option value="inheritance-and-succession-law">Inheritance and succession law</option>
                    <option value="real-estate-law">Real estate law</option>
                    <option value="ongoing-case">Ongoing case</option>
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
                  <p className="text-gray-600 mt-1">
                    {filteredVoicemails.length} message{filteredVoicemails.length !== 1 ? 's' : ''} 
                    {searchTerm && ` (filtré${filteredVoicemails.length !== 1 ? 's' : ''} sur ${voicemails.length})`}
                  </p>
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
            {loading && (
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
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      setLoadingTimeout(false);
                      // Retry loading
                      window.location.reload();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* No Data State */}
            {!loading && !error && filteredVoicemails.length === 0 && !loadingTimeout && (
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
                            onClick={() => handleSort('Time')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Date & Heure</span>
                            <SortIcon field="Time" />
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
                            onClick={() => handleSort('Caller Phone number')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Numéro</span>
                            <SortIcon field="Caller Phone number" />
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort('Duration (Seconds)')}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-vox-blue transition-colors w-full"
                          >
                            <Clock className="h-4 w-4" />
                            <span>Durée</span>
                            <SortIcon field="Duration (Seconds)" />
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left w-16">
                          <span className="text-sm font-medium text-gray-700">Audio</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getPaginatedData().map((voicemail) => (
                        <React.Fragment key={voicemail.id}>
                          <tr className={`hover:bg-gray-50 transition-colors ${!readMessages.has(voicemail.id) ? 'bg-blue-50/30' : ''}`}>
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
                                className="text-gray-400 hover:text-vox-blue transition-colors"
                              >
                                {readMessages.has(voicemail.id) ? (
                                  <CheckCircle className="h-5 w-5 text-now-green" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700 text-sm">
                                {formatTime(voicemail.fields.Time)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700">
                                {voicemail.fields['Résumé'] ? 
                                  truncateText(voicemail.fields['Résumé'], 60) : 
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
                              <div className="text-gray-700 font-medium">
                                {voicemail.fields['Caller Phone number'] || 'Non défini'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700 text-sm">
                                {formatDuration(voicemail.fields['Duration (Seconds)'])}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {voicemail.fields['Audio File'] ? (
                                <button
                                  onClick={() => playAudio(voicemail.fields['Audio File'])}
                                  className="p-2 text-vox-blue hover:bg-vox-blue/10 rounded-lg transition-colors"
                                  title="Écouter le message vocal"
                                >
                                  <Volume2 className="h-5 w-5" />
                                </button>
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
                                        {getSafeString(voicemail.fields['Transcription']) || 'Aucune transcription disponible'}
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
                                        {getSafeString(voicemail.fields['Case Stage Analysis'], 'Non analysé')}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Catégorie de demande</h4>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {getSafeString(voicemail.fields['Request category Analysis'], 'Non analysé')}
                                      </p>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center mb-3">
                                        <ScaleIcon className="h-5 w-5 text-indigo-500 mr-2" />
                                        <h4 className="font-semibold text-gray-900">Domaine juridique</h4>
                                      </div>
                                      <p className="text-gray-700 text-sm">
                                        {getSafeString(voicemail.fields['Field of law Analysis'], 'Non analysé')}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Résumé IA */}
                                  {voicemail.fields['Résumé'] && (
                                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200">
                                      <div className="flex items-center mb-3">
                                        <Brain className="h-5 w-5 text-now-green mr-2" />
                                        <h4 className="font-semibold text-gray-900">Résumé IA</h4>
                                      </div>
                                      <p className="text-gray-700 leading-relaxed">
                                        {voicemail.fields['Résumé']}
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
                                          <span className="font-medium">{voicemail.fields.Name || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Numéro:</span>
                                          <span className="font-medium">{voicemail.fields['Caller Phone number'] || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Durée:</span>
                                          <span className="font-medium">{formatDuration(voicemail.fields['Duration (Seconds)'])}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Date & Heure:</span>
                                          <span className="font-medium">{formatTime(voicemail.fields.Time)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {voicemail.fields['Audio File'] && (
                                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Audio</h4>
                                        <button
                                          onClick={() => playAudio(voicemail.fields['Audio File'])}
                                          className="flex items-center px-4 py-2 bg-vox-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                        >
                                          <Play className="h-4 w-4 mr-2" />
                                          Écouter l'enregistrement
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
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