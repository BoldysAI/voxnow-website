import { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Calendar,
  Loader2,
  AlertCircle,
  RotateCcw,
  Users,
  BarChart3,
  Activity,
  Table2,
  Percent,
  PhoneCall,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface TwilioCost {
  id: number;
  created_at: string;
  client_id: string | null;
  message: string | null;
  message_type: string | null;
  num_segment: number | null;
  price: number | null;
  client_name: string | null;
  cost: number | null;
}

interface DailyCost    { date: string; dateKey: string; cost: number }
interface DailyMessageBreakdown { date: string; dateKey: string; reponses: number; manques: number }
interface MonthlyCost  { sortKey: string; month: string; cost: number }
interface MessageTypeCost { message_type: string; label: string; cost: number; count: number }
interface ClientCost   { client_name: string; cost: number; count: number }
interface MonthlyClientCost { client_name: string; total: number; [month: string]: string | number }
interface ClientProfitability {
  client_name: string;
  active_months: number;
  total_cost: number;
  total_revenue: number;
  total_profit: number;
  avg_monthly_cost: number;
  avg_monthly_profitability: number;
}
interface Filters {
  startDate: string;
  endDate: string;
  client: string;
  messageType: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = 90; // €/client/month

const VOXNOW_COLORS = {
  primary:   '#095C97',
  secondary: '#2D9D8E',
  accent1:   '#028EB1',
  accent2:   '#41CC9C',
  purple:    '#7c3aed',
  orange:    '#f97316',
  rose:      '#e11d48',
};

const CHART_COLORS = [
  VOXNOW_COLORS.primary,
  VOXNOW_COLORS.secondary,
  VOXNOW_COLORS.accent1,
  VOXNOW_COLORS.accent2,
  VOXNOW_COLORS.purple,
];

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  answer:               'Réponse',
  missed_call:          'Appel manqué',
  missed_call_simplicy: 'Appel manqué (Symplicy)',
  sms:                  'SMS',
  transcription:        'Transcription',
  email:                'Email',
};

const getMessageTypeLabel = (type: string): string =>
  MESSAGE_TYPE_LABELS[type] ?? type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const isAnsweredType = (type: string | null) => type === 'answer';
const isMissedType   = (type: string | null) => (type ?? '').includes('missed_call');

const fmt = (v: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);

// ─── Filter helper ────────────────────────────────────────────────────────────

function applyFilters(rows: TwilioCost[], f: Filters): TwilioCost[] {
  return rows.filter(r => {
    const d = new Date(r.created_at);
    if (f.startDate && d < new Date(f.startDate + 'T00:00:00'))  return false;
    if (f.endDate   && d > new Date(f.endDate   + 'T23:59:59'))  return false;
    if (f.client      && (r.client_name ?? 'Non défini') !== f.client)       return false;
    if (f.messageType && (r.message_type ?? 'Non défini') !== f.messageType)  return false;
    return true;
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, children }: { icon: any; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vox-blue/10 to-now-green/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-vox-blue" />
        </div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function KpiCard({
  label, value, sub, icon: Icon, iconColor, iconBg, trend, accent,
}: {
  label: string; value: string; sub?: string; icon: any;
  iconColor: string; iconBg: string; trend?: 'up' | 'down' | null; accent?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${accent ? `border-l-4` : 'border-gray-100'}`}
      style={accent ? { borderLeftColor: accent } : {}}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend === 'up' ? 'text-rose-500' : 'text-now-green'}`}>
            {trend === 'up' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {trend === 'up' ? 'En hausse' : 'En baisse'}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? fmt(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const CountTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value} ({total > 0 ? ((p.value / total) * 100).toFixed(0) : 0}%)
        </p>
      ))}
      <p className="text-gray-400 text-xs mt-1 border-t border-gray-100 pt-1">Total : {total}</p>
    </div>
  );
};

// Toggle button pair
function ViewToggle({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            value === o.value ? 'bg-white text-vox-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({
  filters, onChange, uniqueClients, uniqueMessageTypes,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  uniqueClients: string[];
  uniqueMessageTypes: string[];
}) {
  const activeCount = [filters.startDate, filters.endDate, filters.client, filters.messageType]
    .filter(Boolean).length;

  const reset = () => onChange({ startDate: '', endDate: '', client: '', messageType: '' });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
          <Filter className="h-4 w-4 text-vox-blue" />
          Filtres
          {activeCount > 0 && (
            <span className="bg-vox-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-400">Du</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={e => onChange({ ...filters, startDate: e.target.value })}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-vox-blue/30 focus:border-vox-blue"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-gray-400">Au</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={e => onChange({ ...filters, endDate: e.target.value })}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-vox-blue/30 focus:border-vox-blue"
          />
        </div>

        <select
          value={filters.client}
          onChange={e => onChange({ ...filters, client: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-vox-blue/30 focus:border-vox-blue min-w-[160px]"
        >
          <option value="">Tous les clients</option>
          {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filters.messageType}
          onChange={e => onChange({ ...filters, messageType: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-vox-blue/30 focus:border-vox-blue min-w-[180px]"
        >
          <option value="">Tous les types</option>
          {uniqueMessageTypes.map(t => (
            <option key={t} value={t}>{getMessageTypeLabel(t)}</option>
          ))}
        </select>

        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-500 transition-colors font-medium ml-1"
          >
            <X className="h-3.5 w-3.5" />
            Réinitialiser
          </button>
        )}

        <span className="ml-auto text-xs text-gray-400 italic">
          Filtres appliqués à tous les graphiques
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CostDashboard() {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [allCosts, setAllCosts] = useState<TwilioCost[]>([]);
  const [filters,  setFilters]  = useState<Filters>({ startDate: '', endDate: '', client: '', messageType: '' });

  // KPIs
  const [totalCost, setTotalCost]               = useState(0);
  const [averageCost, setAverageCost]           = useState(0);
  const [totalMessages, setTotalMessages]       = useState(0);
  const [activeClients, setActiveClients]       = useState(0);
  const [currentMonthCost, setCurrentMonthCost] = useState(0);
  const [lastMonthCost, setLastMonthCost]       = useState(0);
  const [monthlyEvolution, setMonthlyEvolution] = useState(0);
  const [answerRate, setAnswerRate]             = useState(0);

  // Charts
  const [dailyCosts, setDailyCosts]           = useState<DailyCost[]>([]);
  const [dailyBreakdown, setDailyBreakdown]   = useState<DailyMessageBreakdown[]>([]);
  const [monthlyCosts, setMonthlyCosts]       = useState<MonthlyCost[]>([]);
  const [messageTypeCosts, setMessageTypeCosts] = useState<MessageTypeCost[]>([]);
  const [clientCosts, setClientCosts]         = useState<ClientCost[]>([]);
  const [monthlyClientMatrix, setMonthlyClientMatrix] = useState<MonthlyClientCost[]>([]);
  const [sortedMonthKeys, setSortedMonthKeys] = useState<string[]>([]);
  const [clientProfitability, setClientProfitability] = useState<ClientProfitability[]>([]);

  // UI state
  const [profitView, setProfitView] = useState<'percent' | 'total'>('percent');
  const [tableOpen, setTableOpen]   = useState(false);

  // ── Derived data ──
  const filteredCosts = useMemo(() => applyFilters(allCosts, filters), [allCosts, filters]);

  const uniqueClients = useMemo(() =>
    [...new Set(allCosts.map(r => r.client_name ?? 'Non défini'))].sort(),
  [allCosts]);

  const uniqueMessageTypes = useMemo(() =>
    [...new Set(allCosts.map(r => r.message_type ?? 'Non défini'))].sort(),
  [allCosts]);

  // Profitability sorted by current view
  const sortedProfitData = useMemo(() =>
    [...clientProfitability].sort((a, b) =>
      profitView === 'percent'
        ? b.avg_monthly_profitability - a.avg_monthly_profitability
        : b.total_profit - a.total_profit
    ),
  [clientProfitability, profitView]);

  const avgDailyCost = useMemo(() =>
    dailyCosts.length > 0 ? dailyCosts.reduce((s, d) => s + d.cost, 0) / dailyCosts.length : 0,
  [dailyCosts]);

  // ── Fetch ──
  useEffect(() => { fetchCosts(); }, []);

  // ── Reprocess when filtered data changes ──
  useEffect(() => { processData(filteredCosts); }, [filteredCosts]);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('twilio_costs' as any)
        .select('*')
        .order('created_at', { ascending: false }) as { data: TwilioCost[] | null; error: any };

      if (fetchError) {
        if (fetchError.code === '42501' || fetchError.message?.includes('permission denied') || fetchError.message?.includes('row-level security')) {
          throw new Error('Accès refusé par les politiques RLS. Veuillez configurer un accès public en lecture sur la table twilio_costs.');
        }
        throw new Error(fetchError.message);
      }
      setAllCosts(data ?? []);
    } catch (err) {
      console.error('Error fetching costs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      setAllCosts([]);
    } finally {
      setLoading(false);
    }
  };

  const processData = (rows: TwilioCost[]) => {
    const now            = new Date();
    const curMonthStart  = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // ── KPIs ──
    const total  = rows.reduce((s, r) => s + (r.cost ?? 0), 0);
    const avg    = rows.length > 0 ? total / rows.length : 0;
    const curMo  = rows.filter(r => new Date(r.created_at) >= curMonthStart)
                       .reduce((s, r) => s + (r.cost ?? 0), 0);
    const prevMo = rows.filter(r => { const d = new Date(r.created_at); return d >= prevMonthStart && d < curMonthStart; })
                       .reduce((s, r) => s + (r.cost ?? 0), 0);

    const answered = rows.filter(r => isAnsweredType(r.message_type)).length;
    const clients  = new Set(rows.map(r => r.client_name ?? 'Non défini')).size;

    setTotalCost(total);
    setAverageCost(avg);
    setTotalMessages(rows.length);
    setActiveClients(clients);
    setCurrentMonthCost(curMo);
    setLastMonthCost(prevMo);
    setMonthlyEvolution(prevMo > 0 ? ((curMo - prevMo) / prevMo) * 100 : 0);
    setAnswerRate(rows.length > 0 ? (answered / rows.length) * 100 : 0);

    // ── Daily costs ──
    const dailyCostMap = new Map<string, { label: string; cost: number }>();
    rows.forEach(r => {
      const d    = new Date(r.created_at);
      const key  = d.toISOString().split('T')[0];
      const lbl  = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const prev = dailyCostMap.get(key) ?? { label: lbl, cost: 0 };
      dailyCostMap.set(key, { label: lbl, cost: prev.cost + (r.cost ?? 0) });
    });
    setDailyCosts(
      Array.from(dailyCostMap.entries()).sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => ({ dateKey: key, date: v.label, cost: v.cost }))
    );

    // ── Daily messages breakdown ──
    const dailyMsgMap = new Map<string, { label: string; reponses: number; manques: number }>();
    rows.forEach(r => {
      const d    = new Date(r.created_at);
      const key  = d.toISOString().split('T')[0];
      const lbl  = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      const prev = dailyMsgMap.get(key) ?? { label: lbl, reponses: 0, manques: 0 };
      if (isAnsweredType(r.message_type)) {
        dailyMsgMap.set(key, { ...prev, reponses: prev.reponses + 1 });
      } else {
        dailyMsgMap.set(key, { ...prev, manques: prev.manques + 1 });
      }
    });
    setDailyBreakdown(
      Array.from(dailyMsgMap.entries()).sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => ({ dateKey: key, date: v.label, reponses: v.reponses, manques: v.manques }))
    );

    // ── Monthly costs (chronological) ──
    const monthlyMap = new Map<string, { label: string; cost: number }>();
    rows.forEach(r => {
      const d       = new Date(r.created_at);
      const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const lbl     = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
      const prev    = monthlyMap.get(sortKey) ?? { label: lbl, cost: 0 };
      monthlyMap.set(sortKey, { label: lbl, cost: prev.cost + (r.cost ?? 0) });
    });
    setMonthlyCosts(
      Array.from(monthlyMap.entries()).sort(([a], [b]) => a.localeCompare(b))
        .map(([sortKey, v]) => ({ sortKey, month: v.label, cost: v.cost }))
    );

    // ── Message type costs ──
    const typeMap = new Map<string, { cost: number; count: number }>();
    rows.forEach(r => {
      const type = r.message_type ?? 'Non défini';
      const prev = typeMap.get(type) ?? { cost: 0, count: 0 };
      typeMap.set(type, { cost: prev.cost + (r.cost ?? 0), count: prev.count + 1 });
    });
    setMessageTypeCosts(
      Array.from(typeMap.entries())
        .map(([message_type, v]) => ({ message_type, label: getMessageTypeLabel(message_type), ...v }))
        .sort((a, b) => b.cost - a.cost).slice(0, 5)
    );

    // ── Top 5 clients ──
    const clientMap = new Map<string, { cost: number; count: number }>();
    rows.forEach(r => {
      const client = r.client_name ?? 'Non défini';
      const prev   = clientMap.get(client) ?? { cost: 0, count: 0 };
      clientMap.set(client, { cost: prev.cost + (r.cost ?? 0), count: prev.count + 1 });
    });
    setClientCosts(
      Array.from(clientMap.entries())
        .map(([client_name, v]) => ({ client_name, ...v }))
        .sort((a, b) => b.cost - a.cost).slice(0, 5)
    );

    // ── Client profitability ──
    const profData: ClientProfitability[] = Array.from(clientMap.entries()).map(([client_name, { cost: total_cost }]) => {
      const activeSet = new Set<string>();
      rows.forEach(r => {
        if ((r.client_name ?? 'Non défini') === client_name) {
          const d = new Date(r.created_at);
          activeSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
      });
      const active_months             = activeSet.size || 1;
      const total_revenue             = active_months * MONTHLY_REVENUE;
      const total_profit              = total_revenue - total_cost;
      const avg_monthly_cost          = total_cost / active_months;
      const avg_monthly_profitability = ((MONTHLY_REVENUE - avg_monthly_cost) / MONTHLY_REVENUE) * 100;
      return { client_name, active_months, total_cost, total_revenue, total_profit, avg_monthly_cost, avg_monthly_profitability };
    });
    setClientProfitability(profData);

    // ── Monthly client matrix ──
    const allSortedKeys = Array.from(monthlyMap.keys()).sort();
    setSortedMonthKeys(allSortedKeys);
    const allClientNames = Array.from(clientMap.keys());
    const matrix: MonthlyClientCost[] = allClientNames.map(client => {
      const row: MonthlyClientCost = { client_name: client, total: 0 };
      let rowTotal = 0;
      allSortedKeys.forEach(key => {
        const lbl = monthlyMap.get(key)?.label ?? key;
        const sum = rows
          .filter(r => {
            const d      = new Date(r.created_at);
            const rowKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return rowKey === key && (r.client_name ?? 'Non défini') === client;
          })
          .reduce((s, r) => s + (r.cost ?? 0), 0);
        row[lbl] = sum;
        rowTotal += sum;
      });
      row.total = rowTotal;
      return row;
    });
    setMonthlyClientMatrix(matrix.sort((a, b) => (b.total as number) - (a.total as number)));
  };

  // ── CSV Export ──
  const exportCSV = () => {
    const headers = ['Date', 'Client', 'Type de message', 'Segments', 'Coût (€)'];
    const rows = filteredCosts.map(r => [
      new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      r.client_name ?? '',
      getMessageTypeLabel(r.message_type ?? ''),
      r.num_segment ?? 0,
      (r.cost ?? 0).toFixed(4).replace('.', ','),
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `voxnow-couts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Loading / Error / Empty ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-vox-blue" />
        <span className="text-gray-500 font-medium">Chargement des données…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-700 font-semibold mb-1">Erreur de chargement</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (allCosts.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-12 text-center">
        <BarChart3 className="h-12 w-12 text-vox-blue/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune donnée disponible</h3>
        <p className="text-gray-500 text-sm">La table <code className="bg-white px-2 py-0.5 rounded">twilio_costs</code> est vide.</p>
      </div>
    );
  }

  const evolutionTrend = monthlyEvolution > 5 ? 'up' : monthlyEvolution < -5 ? 'down' : null;
  const totalTypeCost  = messageTypeCosts.reduce((s, t) => s + t.cost, 0);
  const totalClientCost = clientCosts.reduce((s, c) => s + c.cost, 0);

  return (
    <div className="space-y-8">

      {/* ── Filter Bar ───────────────────────────────────────────────── */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        uniqueClients={uniqueClients}
        uniqueMessageTypes={uniqueMessageTypes}
      />

      {/* ── Indicateurs clés ─────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Activity} title="Indicateurs clés">
          <button
            onClick={fetchCosts}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Actualiser
          </button>
        </SectionHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
          <KpiCard label="Coût Total"         value={fmt(totalCost)}    sub="Somme de toutes les entrées" icon={DollarSign} iconColor="text-vox-blue"    iconBg="bg-vox-blue/10"   accent={VOXNOW_COLORS.primary} />
          <KpiCard label="Coût Moyen"          value={fmt(averageCost)}  sub="Par message traité"          icon={TrendingUp} iconColor="text-now-green"   iconBg="bg-now-green/10" />
          <KpiCard label="Total Messages"      value={totalMessages.toLocaleString('fr-FR')} sub="Nombre d'entrées filtrées" icon={MessageSquare} iconColor="text-light-blue" iconBg="bg-light-blue/10" />
          <KpiCard label="Clients actifs"      value={String(activeClients)} sub="Clients avec activité" icon={Users}        iconColor="text-purple-500"  iconBg="bg-purple-50" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Mois en cours"       value={fmt(currentMonthCost)} sub="Coût du mois actuel"    icon={Calendar}   iconColor="text-light-green" iconBg="bg-light-green/10" />
          <KpiCard label="Mois précédent"      value={fmt(lastMonthCost)}    sub="Coût du mois dernier"   icon={Calendar}   iconColor="text-gray-400"    iconBg="bg-gray-100" />
          <KpiCard
            label="Évolution mensuelle"
            value={`${monthlyEvolution >= 0 ? '+' : ''}${monthlyEvolution.toFixed(1)}%`}
            sub="vs mois précédent"
            icon={monthlyEvolution >= 0 ? TrendingUp : TrendingDown}
            iconColor={monthlyEvolution >= 0 ? 'text-rose-500' : 'text-now-green'}
            iconBg={monthlyEvolution >= 0 ? 'bg-rose-50' : 'bg-now-green/10'}
            trend={evolutionTrend}
          />
          <KpiCard
            label="Taux de réponse"
            value={`${answerRate.toFixed(1)}%`}
            sub="Appels répondus / total"
            icon={PhoneCall}
            iconColor={answerRate >= 50 ? 'text-now-green' : 'text-rose-500'}
            iconBg={answerRate >= 50 ? 'bg-now-green/10' : 'bg-rose-50'}
            accent={answerRate >= 50 ? VOXNOW_COLORS.secondary : VOXNOW_COLORS.rose}
          />
        </div>
      </section>

      {/* ── Tendances ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={BarChart3} title="Tendances" />
        <div className="space-y-4">

          {/* Daily cost – full width with average reference line */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-base font-semibold text-gray-800">Coûts quotidiens</p>
              {avgDailyCost > 0 && (
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="inline-block w-6 border-t-2 border-dashed border-gray-300" />
                  Moyenne : {fmt(avgDailyCost)} / jour
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyCosts} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `${v.toFixed(2)}€`} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={60} />
                <Tooltip content={<CurrencyTooltip />} />
                {avgDailyCost > 0 && (
                  <ReferenceLine
                    y={avgDailyCost}
                    stroke="#d1d5db"
                    strokeDasharray="5 4"
                    label={{ value: 'Moy.', fill: '#9ca3af', fontSize: 10, position: 'insideTopRight' }}
                  />
                )}
                <Line type="monotone" dataKey="cost" stroke={VOXNOW_COLORS.primary} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="Coût" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Daily messages + Monthly costs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-base font-semibold text-gray-800 mb-4">Messages par jour</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dailyBreakdown} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={30} />
                  <Tooltip content={<CountTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                  <Bar dataKey="reponses" name="Réponses"      stackId="a" fill={VOXNOW_COLORS.secondary} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="manques"  name="Appels manqués" stackId="a" fill={VOXNOW_COLORS.purple}    radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-base font-semibold text-gray-800 mb-4">Coûts mensuels</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyCosts} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={v => `${v.toFixed(0)}€`} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={45} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Bar dataKey="cost" name="Coût" fill={VOXNOW_COLORS.accent1} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </section>

      {/* ── Répartition ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Users} title="Répartition" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Cost by message type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-base font-semibold text-gray-800 mb-4">Coût par type de message</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={messageTypeCosts} cx="50%" cy="45%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="cost" nameKey="label">
                  {messageTypeCosts.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as MessageTypeCost;
                    const pct = totalTypeCost > 0 ? (d.cost / totalTypeCost) * 100 : 0;
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
                        <p className="font-semibold text-gray-800 mb-2">{d.label}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Coût</span>
                            <span className="font-medium">{fmt(d.cost)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Part du total</span>
                            <span className="font-bold text-vox-blue">{pct.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Messages</span>
                            <span className="font-medium">{d.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend iconType="circle" iconSize={8} formatter={(_, entry: any) => (
                  <span className="text-xs text-gray-600">{entry.payload?.label}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top 5 clients */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-base font-semibold text-gray-800 mb-4">Top 5 clients par coût</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={clientCosts} cx="50%" cy="45%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="cost" nameKey="client_name">
                  {clientCosts.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as ClientCost;
                    const pct = totalClientCost > 0 ? (d.cost / totalClientCost) * 100 : 0;
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
                        <p className="font-semibold text-gray-800 mb-2">{d.client_name}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Coût</span>
                            <span className="font-medium">{fmt(d.cost)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Part du total</span>
                            <span className="font-bold text-vox-blue">{pct.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Messages</span>
                            <span className="font-medium">{d.count}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend iconType="circle" iconSize={8} formatter={(v) => (
                  <span className="text-xs text-gray-600">{v}</span>
                )} />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </section>

      {/* ── Rentabilité par client ──────────────────────────────────── */}
      <section>
        <SectionHeader icon={Percent} title="Rentabilité par client">
          <ViewToggle
            value={profitView}
            onChange={v => setProfitView(v as 'percent' | 'total')}
            options={[{ value: 'percent', label: '% par mois' }, { value: 'total', label: 'Total €' }]}
          />
        </SectionHeader>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-5 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: VOXNOW_COLORS.secondary }} />
              <span>Rentable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: VOXNOW_COLORS.rose }} />
              <span>Déficitaire (coût &gt; {MONTHLY_REVENUE}€/mois)</span>
            </div>
            <span className="ml-auto text-gray-400 italic">
              Hypothèse : {MONTHLY_REVENUE}€ de revenus / client / mois actif
            </span>
          </div>

          <ResponsiveContainer width="100%" height={Math.max(280, sortedProfitData.length * 52)}>
            <BarChart data={sortedProfitData} layout="vertical" margin={{ left: 8, right: 70, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={v => profitView === 'percent' ? `${v.toFixed(0)}%` : `${v.toFixed(0)}€`}
                tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false}
                domain={profitView === 'percent' ? ['auto', 100] : ['auto', 'auto']}
              />
              <YAxis type="category" dataKey="client_name" width={160} tick={{ fontSize: 12, fill: '#374151' }} tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as ClientProfitability;
                  return (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-sm min-w-[230px]">
                      <p className="font-semibold text-gray-800 mb-3">{d.client_name}</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Mois actifs</span>
                          <span className="font-medium">{d.active_months} mois</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Revenus totaux</span>
                          <span className="font-medium">{fmt(d.total_revenue)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Coûts totaux</span>
                          <span className="font-medium">{fmt(d.total_cost)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-1.5 mt-1 flex justify-between gap-4">
                          <span className="text-gray-500">Marge nette</span>
                          <span className={`font-bold ${d.total_profit >= 0 ? 'text-now-green' : 'text-rose-500'}`}>
                            {d.total_profit >= 0 ? '+' : ''}{fmt(d.total_profit)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">Rentabilité moy.</span>
                          <span className={`font-bold ${d.avg_monthly_profitability >= 0 ? 'text-now-green' : 'text-rose-500'}`}>
                            {d.avg_monthly_profitability >= 0 ? '+' : ''}{d.avg_monthly_profitability.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey={profitView === 'percent' ? 'avg_monthly_profitability' : 'total_profit'}
                radius={[0, 4, 4, 0]}
                label={{
                  position: 'right', fontSize: 11, fill: '#6b7280',
                  formatter: (v: any) => {
                    const n = typeof v === 'number' ? v : Number(v);
                    return profitView === 'percent'
                      ? `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`
                      : `${n >= 0 ? '+' : ''}${n.toFixed(0)}€`;
                  },
                }}
              >
                {sortedProfitData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={(profitView === 'percent' ? entry.avg_monthly_profitability : entry.total_profit) >= 0
                      ? VOXNOW_COLORS.secondary
                      : VOXNOW_COLORS.rose}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Tableau client × mois ───────────────────────────────────── */}
      <section>
        <SectionHeader icon={Table2} title="Coût par client et par mois" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Client</th>
                  {sortedMonthKeys.map(key => {
                    const label = monthlyCosts.find(m => m.sortKey === key)?.month ?? key;
                    return <th key={key} className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">{label}</th>;
                  })}
                  <th className="px-5 py-3 text-right font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthlyClientMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                        {row.client_name}
                      </div>
                    </td>
                    {sortedMonthKeys.map(key => {
                      const label = monthlyCosts.find(m => m.sortKey === key)?.month ?? key;
                      const val   = (row[label] as number) ?? 0;
                      return (
                        <td key={key} className={`px-4 py-3 text-right tabular-nums ${val > 0 ? 'text-gray-800' : 'text-gray-300'}`}>
                          {val > 0 ? fmt(val) : '—'}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-right font-semibold text-vox-blue tabular-nums">{fmt(row.total as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Tableau détaillé (collapsible) ───────────────────────────── */}
      <section>
        {/* Header – always visible, acts as toggle */}
        <button
          onClick={() => setTableOpen(o => !o)}
          className="w-full flex items-center justify-between mb-4 group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vox-blue/10 to-now-green/10 flex items-center justify-center">
              <Table2 className="h-4 w-4 text-vox-blue" />
            </div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Enregistrements détaillés</span>
            <span className="text-xs text-gray-400 font-normal normal-case">
              ({filteredCosts.length.toLocaleString('fr-FR')} lignes)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {tableOpen && (
              <button
                onClick={e => { e.stopPropagation(); exportCSV(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
              {tableOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {tableOpen ? 'Réduire' : 'Afficher'}
            </div>
          </div>
        </button>

        {/* Collapsible body */}
        {tableOpen && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Date</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Client</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-600">Segments</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-600">Coût</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCosts.map(r => {
                    const typeLabel  = getMessageTypeLabel(r.message_type ?? '');
                    const isAnswered = isAnsweredType(r.message_type);
                    const isMissed   = isMissedType(r.message_type);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-800">{r.client_name ?? <span className="text-gray-300 italic">—</span>}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isAnswered ? 'bg-now-green/10 text-now-green'
                            : isMissed  ? 'bg-purple-50 text-purple-600'
                            : 'bg-gray-100 text-gray-500'
                          }`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-gray-500 tabular-nums">{r.num_segment ?? 0}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-800 tabular-nums">{fmt(r.cost ?? 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
