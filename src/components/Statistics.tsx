
import { TrendingUp, Users, Clock, AlertTriangle, Scale, FileText, Brain, BarChart3 } from 'lucide-react';

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
  };
}

interface StatisticsProps {
  records: AirtableRecord[];
}

// Utility function to normalize analysis values (handle objects and strings)
const normalizeAnalysisValue = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'object' && value.value) {
    return value.value.replace(/-/g, ' ');
  }
  if (typeof value === 'string') {
    return value.replace(/-/g, ' ');
  }
  return '';
};

// Calculation functions for each analysis type
const calculateSentimentStats = (records: AirtableRecord[]) => {
  const sentiments = records.map(record => 
    normalizeAnalysisValue(record.fields['Sentiment Analysis'])
  ).filter(Boolean);

  const total = sentiments.length;
  if (total === 0) return { neutral: 0, negative: 0, total: 0 };

  const neutral = sentiments.filter(s => s.toLowerCase() === 'neutral').length;
  const negative = sentiments.filter(s => s.toLowerCase() === 'negative').length;

  return {
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
    total
  };
};

const calculateUrgencyStats = (records: AirtableRecord[]) => {
  const urgencies = records.map(record => 
    normalizeAnalysisValue(record.fields['Urgence Analysis'])
  ).filter(Boolean);

  const total = urgencies.length;
  if (total === 0) return { notUrgent: 0, urgent: 0, moderate: 0, total: 0 };

  const notUrgent = urgencies.filter(u => u.toLowerCase() === 'not urgent').length;
  const urgent = urgencies.filter(u => u.toLowerCase() === 'urgent').length;
  const moderate = urgencies.filter(u => u.toLowerCase() === 'moderate').length;

  return {
    notUrgent: Math.round((notUrgent / total) * 100),
    urgent: Math.round((urgent / total) * 100),
    moderate: Math.round((moderate / total) * 100),
    total
  };
};

const calculateCaseStageStats = (records: AirtableRecord[]) => {
  const stages = records.map(record => 
    normalizeAnalysisValue(record.fields['Case Stage Analysis'])
  ).filter(Boolean);

  const total = stages.length;
  if (total === 0) return { ongoing: 0, newCase: 0, total: 0 };

  const ongoing = stages.filter(s => s.toLowerCase() === 'ongoing case').length;
  const newCase = stages.filter(s => s.toLowerCase() === 'new case').length;

  return {
    ongoing: Math.round((ongoing / total) * 100),
    newCase: Math.round((newCase / total) * 100),
    total
  };
};

const calculateRequestCategoryStats = (records: AirtableRecord[]) => {
  const categories = records.map(record => 
    normalizeAnalysisValue(record.fields['Request category Analysis'])
  ).filter(Boolean);

  const total = categories.length;
  if (total === 0) return { total: 0 };

  const categoryList = [
    'Legal advice needed',
    'Case update requested', 
    'Payment inquiry',
    'Document to provide',
    'Document to receive',
    'Meeting requested',
    'Urgent action required',
    'Ongoing case'
  ];

  const stats: { [key: string]: number } = {};
  
  categoryList.forEach(category => {
    const count = categories.filter(c => c.toLowerCase() === category.toLowerCase()).length;
    stats[category] = Math.round((count / total) * 100);
  });

  return { ...stats, total };
};

const calculateFieldOfLawStats = (records: AirtableRecord[]) => {
  const fields = records.map(record => 
    normalizeAnalysisValue(record.fields['Field of law Analysis'])
  ).filter(Boolean);

  const total = fields.length;
  if (total === 0) return { total: 0 };

  const fieldList = [
    'Contract law',
    'Family law',
    'Employment law',
    'Civil law',
    'Administrative and public law',
    'Undetermined.',
    'Criminal law',
    'Business and commercial law',
    'Consumer law',
    'Banking and finance law',
    'Inheritance and succession law',
    'Real estate law',
    'Ongoing case'
  ];

  const stats: { [key: string]: number } = {};
  
  fieldList.forEach(field => {
    const count = fields.filter(f => {
      const normalized = f.toLowerCase();
      const fieldNormalized = field.toLowerCase();
      return normalized === fieldNormalized || 
             (field === 'Undetermined.' && normalized === 'undetermined.');
    }).length;
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
  const averagePerDay = totalMessages > 0 ? Math.round(totalMessages / 30) : 0; // Assuming 30 days
  const mostUrgent = urgencyStats.urgent || 0;
  const newCases = caseStageStats.newCase || 0;

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
          subtitle="Messages par jour"
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
              label="Neutral" 
              percentage={sentimentStats.neutral} 
              color="bg-gray-400" 
            />
            <PercentageBar 
              label="Negative" 
              percentage={sentimentStats.negative} 
              color="bg-red-500" 
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
              label="Not urgent" 
              percentage={urgencyStats.notUrgent} 
              color="bg-green-500" 
            />
            <PercentageBar 
              label="Moderate" 
              percentage={urgencyStats.moderate} 
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
              label="Ongoing case" 
              percentage={caseStageStats.ongoing} 
              color="bg-blue-500" 
            />
            <PercentageBar 
              label="New case" 
              percentage={caseStageStats.newCase} 
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
              {urgencyStats.urgent > 50 ? 'Élevé' : 
               urgencyStats.moderate > 50 ? 'Modéré' : 'Faible'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}