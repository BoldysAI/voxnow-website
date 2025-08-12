import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  LogOut, 
  MessageSquare, 
  Calendar, 
  Clock, 
  User,
  Phone,
  FileText,
  AlertTriangle,
  XCircle,
  BarChart3,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Statistics } from './Statistics';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

interface VoiceMessage {
  id: string;
  name: string;
  voxnowLine: string;
  audioFile: string;
  transcription: string;
  duration: number;
  time: string;
  statusEmailAvocat: string;
  sentimentAnalysis: string;
  urgenceAnalysis: string;
  resume: string;
  caseStageAnalysis: string;
  smsDraft: string;
  statusSMSClient: string;
  requestCategoryAnalysis: string;
  fieldOfLawAnalysis: string;
  callerPhoneNumber: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
}

// Utility function to normalize analysis values that might be objects
const normalizeAnalysisValue = (value: any): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value && typeof value === 'object' && value.value) {
    return value.value.toString();
  }
  return '';
};

export function HuezDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [records, setRecords] = useState<AirtableRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [showStatistics, setShowStatistics] = useState(false);
  
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      console.log('Checking Huez authentication...');
      // Check if user is authenticated for Huez dashboard
      const authData = sessionStorage.getItem('huez_auth');
      console.log('Auth data from sessionStorage:', authData);
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          console.log('Parsed auth data:', parsed);
          if (parsed.email === 'mandathuez@gmail.com' && parsed.authenticated === true) {
            console.log('Authentication successful for Huez');
            setIsAuthenticated(true);
          } else {
            console.log('Authentication failed - invalid credentials');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      } else {
        console.log('No auth data found in sessionStorage');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Fetch data function
  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);

    try {
      // Appel à notre API sécurisée avec token fixe
      const response = await fetch('/api/huez-data.js', {
        headers: {
          'Authorization': 'Bearer huez-secure-token-2025',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      const airtableRecords = data.records || [];
      
      setRecords(airtableRecords);

      // Transform records to voice messages
      const transformedMessages: VoiceMessage[] = airtableRecords.map((record: any) => ({
        id: record.id,
        name: record.fields['Name']?.toString() || '',
        voxnowLine: record.fields['VoxNow Line'] || '',
        audioFile: record.fields['Audio File'] || '',
        transcription: record.fields['Transcription'] || '',
        duration: record.fields['Duration (Seconds)'] || 0,
        time: record.fields['Time'] || '',
        statusEmailAvocat: record.fields['Status email avocat'] || '',
        sentimentAnalysis: normalizeAnalysisValue(record.fields['Sentiment Analysis']),
        urgenceAnalysis: normalizeAnalysisValue(record.fields['Urgence Analysis']),
        resume: record.fields['Résumé'] || '',
        caseStageAnalysis: normalizeAnalysisValue(record.fields['Case Stage Analysis']),
        smsDraft: record.fields['SMS draft'] || '',
        statusSMSClient: record.fields['Status SMS client'] || '',
        requestCategoryAnalysis: normalizeAnalysisValue(record.fields['Request category Analysis']),
        fieldOfLawAnalysis: normalizeAnalysisValue(record.fields['Field of law Analysis']),
        callerPhoneNumber: record.fields['Caller Phone number'] || ''
      }));

      setVoiceMessages(transformedMessages);

      // Track successful data load
      trackCustomEvent('HuezDashboardDataLoaded', {
        content_name: 'Huez Dashboard Data',
        content_category: 'Dashboard',
        message_count: airtableRecords.length
      });

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Erreur lors du chargement des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      
      trackCustomEvent('HuezDashboardError', {
        content_name: 'Huez Dashboard Error',
        content_category: 'Error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Track page view when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      trackViewContent({
        content_name: 'Huez Dashboard',
        content_category: 'Client Dashboard'
      });
    }
  }, [isAuthenticated]);

  // Fetch data when authenticated and auth check is complete
  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth) {
      fetchData();
    }
  }, [isAuthenticated, isCheckingAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-vox-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    // Clear authentication
    sessionStorage.removeItem('huez_auth');
    trackCustomEvent('HuezLogout', {
      content_name: 'Huez Dashboard Logout',
      content_category: 'User Action'
    });
    navigate('/auth');
  };

  const handleRefresh = () => {
    trackCustomEvent('HuezDashboardRefresh', {
      content_name: 'Huez Dashboard Refresh',
      content_category: 'User Action'
    });
    fetchData();
  };

  const filteredMessages = voiceMessages.filter(message => {
    const matchesSearch = message.transcription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.resume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.callerPhoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || message.statusEmailAvocat === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || message.urgenceAnalysis === filterUrgency;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Email Sent':
      case 'SMS response Sent':
        return 'text-green-600 bg-green-50';
      case 'Error':
        return 'text-red-600 bg-red-50';
      case 'Archived':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'not urgent':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      case 'neutral':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img 
                  src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                  alt="VoxNow Logo"
                  className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold gradient-text">Espace Client - Maître Huez</h1>
                <p className="text-sm text-gray-600">mandathuez@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center font-medium"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Actualiser</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors duration-300 flex items-center font-medium"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-vox-blue to-now-green rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Bienvenue dans votre espace VoxNow, Maître Huez ! 👋
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Voici le tableau de bord de vos messages vocaux transcrits et analysés automatiquement
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Messages transcrits</p>
                  <p className="text-white/80 text-sm">Automatiquement par IA</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Résumés intelligents</p>
                  <p className="text-white/80 text-sm">Points clés extraits</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Analyses avancées</p>
                  <p className="text-white/80 text-sm">Urgence, sentiment, domaine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-vox-blue">{voiceMessages.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-vox-blue" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-now-green">
                    {voiceMessages.filter(msg => {
                      const today = new Date().toDateString();
                      const msgDate = new Date(msg.time).toDateString();
                      return today === msgDate;
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-now-green" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Messages urgents</p>
                  <p className="text-2xl font-bold text-red-500">
                    {voiceMessages.filter(msg => msg.urgenceAnalysis?.toLowerCase() === 'urgent').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Nouveaux dossiers</p>
                  <p className="text-2xl font-bold text-light-blue">
                    {voiceMessages.filter(msg => msg.caseStageAnalysis?.toLowerCase() === 'new case').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-light-blue" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Email Sent">Email envoyé</option>
                  <option value="Error">Erreur</option>
                  <option value="Archived">Archivé</option>
                </select>
                
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                >
                  <option value="all">Toutes urgences</option>
                  <option value="urgent">Urgent</option>
                  <option value="moderate">Modéré</option>
                  <option value="not urgent">Pas urgent</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {showStatistics ? 'Masquer' : 'Voir'} les stats
              </button>
            </div>
          </div>

          {/* Statistics Section */}
          {showStatistics && (
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-6 w-6 text-vox-blue mr-3" />
                  <h2 className="text-2xl font-bold text-vox-blue">Statistiques</h2>
                </div>
                <Statistics records={records} />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-vox-blue animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chargement des messages vocaux...
                </h3>
                <p className="text-gray-600">
                  Récupération des données depuis Airtable
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
              <div className="flex flex-col items-center">
                <XCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Erreur de chargement
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* Messages List */}
          {!loading && !error && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-vox-blue mb-6">
                Messages vocaux ({filteredMessages.length})
              </h2>

              {filteredMessages.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Aucun message trouvé
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || filterStatus !== 'all' || filterUrgency !== 'all' 
                      ? 'Aucun message ne correspond à vos critères de recherche'
                      : 'Aucun message vocal reçu pour le moment'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div key={message.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Message Header - Always Visible */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-vox-blue to-now-green rounded-full flex items-center justify-center text-white font-bold">
                              #{message.name}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium text-gray-900">{message.callerPhoneNumber}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(message.time)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatDuration(message.duration)}</span>
                                </div>
                              </div>
                              
                              {/* Résumé IA - Always visible */}
                              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-2">
                                  <FileText className="h-5 w-5 text-vox-blue mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium text-gray-900 mb-1">Résumé IA</p>
                                    <p className="text-gray-700 leading-relaxed">
                                      {message.resume}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="flex flex-wrap gap-2 justify-end">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(message.urgenceAnalysis)}`}>
                                {message.urgenceAnalysis}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(message.sentimentAnalysis)}`}>
                                {message.sentimentAnalysis}
                              </span>
                            </div>
                            
                            <button className="text-vox-blue hover:text-now-green transition-colors text-sm font-medium">
                              {expandedMessage === message.id ? 'Réduire' : 'Voir détails'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedMessage === message.id && (
                        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                          {/* Transcription */}
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <MessageSquare className="h-5 w-5 mr-2 text-now-green" />
                              Transcription complète
                            </h4>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                              <p className="text-gray-700 leading-relaxed">
                                {message.transcription}
                              </p>
                            </div>
                          </div>

                          {/* Analysis Grid */}
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <p className="text-sm font-medium text-blue-800 mb-1">Domaine juridique</p>
                              <p className="text-blue-700 font-medium">{message.fieldOfLawAnalysis}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <p className="text-sm font-medium text-green-800 mb-1">Type de demande</p>
                              <p className="text-green-700 font-medium">{message.requestCategoryAnalysis}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                              <p className="text-sm font-medium text-purple-800 mb-1">Étape du dossier</p>
                              <p className="text-purple-700 font-medium">{message.caseStageAnalysis}</p>
                            </div>
                          </div>

                          {/* SMS Draft */}
                          {message.smsDraft && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <MessageSquare className="h-5 w-5 mr-2 text-light-blue" />
                                SMS automatique envoyé
                              </h4>
                              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700 italic leading-relaxed">"{message.smsDraft}"</p>
                              </div>
                            </div>
                          )}

                          {/* Status and Actions */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">Email :</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.statusEmailAvocat)}`}>
                                  {message.statusEmailAvocat}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-600">SMS :</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.statusSMSClient)}`}>
                                  {message.statusSMSClient}
                                </span>
                              </div>
                            </div>
                            
                            {message.audioFile && (
                              <a
                                href={message.audioFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-vox-blue hover:text-now-green transition-colors font-medium"
                                onClick={() => trackCustomEvent('HuezAudioFileAccess', {
                                  content_name: 'Audio File Access',
                                  message_id: message.id
                                })}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Écouter l'audio
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}