
import { TrendingUp, Users, Clock, AlertTriangle, Scale, FileText, Brain, BarChart3 } from 'lucide-react';
import { VoicemailWithAnalysis, getAnalysisByType } from '../hooks/useSupabase';

interface StatisticsProps {
  records: VoicemailWithAnalysis[];
}

// No normalization needed - use exact database values

// Calculation functions for each analysis type
const calculateSentimentStats = (records: VoicemailWithAnalysis[]) => {
  const sentiments = records.map(record => 
    getAnalysisByType(record, 'Sentiment')
  ).filter(Boolean);

  const total = sentiments.length;
  if (total === 0) return { neutre: 0, negatif: 0, positif: 0, total: 0 };

  const neutre = sentiments.filter(s => s === 'Neutre').length;
  const negatif = sentiments.filter(s => s === 'Négatif').length;
  const positif = sentiments.filter(s => s === 'Positif').length;

  return {
    neutre: Math.round((neutre / total) * 100),
    negatif: Math.round((negatif / total) * 100),
    positif: Math.round((positif / total) * 100),
    total
  };
};

const calculateUrgencyStats = (records: VoicemailWithAnalysis[]) => {
  const urgencies = records.map(record => 
    getAnalysisByType(record, 'Urgence')
  ).filter(Boolean);

  const total = urgencies.length;
  if (total === 0) return { nonUrgent: 0, urgent: 0, modere: 0, total: 0 };

  const nonUrgent = urgencies.filter(u => u === 'Non Urgent').length;
  const urgent = urgencies.filter(u => u === 'Urgent').length;
  const modere = urgencies.filter(u => u === 'Modéré').length;

  return {
    nonUrgent: Math.round((nonUrgent / total) * 100),
    urgent: Math.round((urgent / total) * 100),
    modere: Math.round((modere / total) * 100),
    total
  };
};

const calculateCaseStageStats = (records: VoicemailWithAnalysis[]) => {
  const stages = records.map(record => 
    getAnalysisByType(record, 'Étape du dossier')
  ).filter(Boolean);

  const total = stages.length;
  if (total === 0) return { dossierEnCours: 0, nouveauDossier: 0, total: 0 };

  const dossierEnCours = stages.filter(s => s === 'Dossier En Cours').length;
  const nouveauDossier = stages.filter(s => s === 'Nouveau Dossier').length;

  return {
    dossierEnCours: Math.round((dossierEnCours / total) * 100),
    nouveauDossier: Math.round((nouveauDossier / total) * 100),
    total
  };
};

const calculateRequestCategoryStats = (records: VoicemailWithAnalysis[]) => {
  const categories = records.map(record => 
    getAnalysisByType(record, 'Catégorie')
  ).filter(Boolean);

  const total = categories.length;
  if (total === 0) return { total: 0 };

  const categoryList = [
    'Conseil Juridique Requis',
    'Demande De Paiement',
    'Document À Fournir',
    'Document À Recevoir'
  ];

  const stats: { [key: string]: number } = {};
  
  categoryList.forEach(category => {
    const count = categories.filter(c => c === category).length;
    stats[category] = Math.round((count / total) * 100);
  });

  return { ...stats, total };
};

const calculateFieldOfLawStats = (records: VoicemailWithAnalysis[]) => {
  const fields = records.map(record => 
    getAnalysisByType(record, 'Domaine juridique')
  ).filter(Boolean);

  const total = fields.length;
  if (total === 0) return { total: 0 };

  const fieldList = [
    'Droit Administratif Et Public',
    'Indéterminé',
    'Droit Pénal'
  ];

  const stats: { [key: string]: number } = {};
  
  fieldList.forEach(field => {
    const count = fields.filter(f => f === field).length;
    stats[field] = Math.round((count / total) * 100);
  });

  return { ...stats, total };
};

// Component for metric cards
const MetricCard = ({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{subtitle}</p>
  </div>
);

// Component for percentage bars
const PercentageBar = ({ label, percentage, color }: {
  label: string;
  percentage: number;
  color: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className={`h-3 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

export function Statistics({ records }: StatisticsProps) {
  // Ensure records is always an array to prevent undefined errors
  const safeRecords = records ?? [];

  // Calculate all statistics
  const sentimentStats = calculateSentimentStats(safeRecords);
  const urgencyStats = calculateUrgencyStats(safeRecords);
  const caseStageStats = calculateCaseStageStats(safeRecords);
  const requestCategoryStats = calculateRequestCategoryStats(safeRecords);
  const fieldOfLawStats = calculateFieldOfLawStats(safeRecords);

  // Calculate general metrics
  const totalMessages = safeRecords.length;
  
  // Calculate real average per day based on actual date range
  const calculateAveragePerDay = () => {
    if (totalMessages === 0) return 0;
    
    // Get all valid received_at dates
    const dates = safeRecords
      .map(record => record.received_at)
      .filter(Boolean)
      .map(dateStr => new Date(dateStr))
      .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return 0;
    
    // Find earliest and latest dates
    const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Calculate difference in days
    const timeDiff = latestDate.getTime() - earliestDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
    
    // Avoid division by zero and ensure minimum 1 day
    const actualDays = Math.max(daysDiff, 1);
    
    return Math.round((totalMessages / actualDays) * 10) / 10; // Round to 1 decimal place
  };
  
  const averagePerDay = calculateAveragePerDay();
  const mostUrgent = urgencyStats.urgent || 0;
  const newCases = caseStageStats.nouveauDossier || 0;

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Messages"
          value={totalMessages}
          subtitle="Messages vocaux reçus"
          icon={FileText}
          color="bg-vox-blue"
        />
        <MetricCard
          title="Moyenne/jour"
          value={averagePerDay}
          subtitle="Sur la période analysée"
          icon={Clock}
          color="bg-now-green"
        />
        <MetricCard
          title="Messages urgents"
          value={`${mostUrgent}%`}
          subtitle="Nécessitent une action rapide"
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <MetricCard
          title="Nouveaux dossiers"
          value={`${newCases}%`}
          subtitle="Nouvelles opportunités"
          icon={Users}
          color="bg-light-blue"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Brain className="h-6 w-6 text-vox-blue mr-3" />
            <h3 className="text-xl font-bold text-vox-blue">Analyse du Sentiment</h3>
          </div>
          <div className="space-y-4">
            <PercentageBar 
              label="Neutre" 
              percentage={sentimentStats.neutre} 
              color="bg-gray-400" 
            />
            <PercentageBar 
              label="Négatif" 
              percentage={sentimentStats.negatif} 
              color="bg-red-500" 
            />
            <PercentageBar 
              label="Positif" 
              percentage={sentimentStats.positif} 
              color="bg-green-500" 
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Basé sur {sentimentStats.total} messages analysés
          </p>
        </div>

        {/* Urgency Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-xl font-bold text-vox-blue">Analyse d'Urgence</h3>
          </div>
          <div className="space-y-4">
            <PercentageBar 
              label="Non Urgent" 
              percentage={urgencyStats.nonUrgent} 
              color="bg-green-500" 
            />
            <PercentageBar 
              label="Modéré" 
              percentage={urgencyStats.modere} 
              color="bg-yellow-500" 
            />
            <PercentageBar 
              label="Urgent" 
              percentage={urgencyStats.urgent} 
              color="bg-red-500" 
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Basé sur {urgencyStats.total} messages analysés
          </p>
        </div>

        {/* Case Stage Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Scale className="h-6 w-6 text-now-green mr-3" />
            <h3 className="text-xl font-bold text-vox-blue">Étape des Dossiers</h3>
          </div>
          <div className="space-y-4">
            <PercentageBar 
              label="Dossier En Cours" 
              percentage={caseStageStats.dossierEnCours} 
              color="bg-blue-500" 
            />
            <PercentageBar 
              label="Nouveau Dossier" 
              percentage={caseStageStats.nouveauDossier} 
              color="bg-green-500" 
            />
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Basé sur {caseStageStats.total} messages analysés
          </p>
        </div>

        {/* Request Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-light-blue mr-3" />
            <h3 className="text-xl font-bold text-vox-blue">Catégories de Demandes</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {Object.entries(requestCategoryStats)
              .filter(([key]) => key !== 'total')
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .map(([category, percentage]) => (
                <PercentageBar 
                  key={category}
                  label={category} 
                  percentage={percentage as number} 
                  color="bg-light-blue" 
                />
              ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Basé sur {requestCategoryStats.total} messages analysés
          </p>
        </div>
      </div>

      {/* Field of Law Analysis - Full width */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center mb-6">
          <Scale className="h-6 w-6 text-light-green mr-3" />
          <h3 className="text-xl font-bold text-vox-blue">Domaines Juridiques</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(fieldOfLawStats)
            .filter(([key]) => key !== 'total')
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .map(([field, percentage]) => (
              <PercentageBar 
                key={field}
                label={field} 
                percentage={percentage as number} 
                color="bg-light-green" 
              />
            ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Basé sur {fieldOfLawStats.total} messages analysés
        </p>
      </div>

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-vox-blue mr-3" />
          <h3 className="text-xl font-bold text-vox-blue">Insights Clés</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Domaine le plus fréquent</p>
            <p className="font-bold text-gray-900">
              {Object.entries(fieldOfLawStats)
                .filter(([key]) => key !== 'total')
                .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Type de demande principal</p>
            <p className="font-bold text-gray-900">
              {Object.entries(requestCategoryStats)
                .filter(([key]) => key !== 'total')
                .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Niveau d'urgence moyen</p>
            <p className="font-bold text-gray-900">
              {urgencyStats.urgent > 50 ? 'Urgent' : 
               urgencyStats.modere > 50 ? 'Modéré' : 'Non Urgent'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}