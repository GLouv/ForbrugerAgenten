'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  PiggyBank,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

interface KPIs {
  signups_today: number;
  signups_week: number;
  signups_month: number;
  total_users: number;
  active_quote_requests: number;
  quotes_received: number;
  quotes_accepted: number;
  conversion_rate: number;
  avg_response_time_hours: number;
  total_savings_estimated: number;
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface TrendDataPoint {
  date: string;
  count: number;
}

interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  energy: 'Energi',
  mobile: 'Mobil',
  internet: 'Internet',
  unknown: 'Andet'
};

export default function AdminAnalyticsPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [trend, setTrend] = useState<TrendDataPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadAnalytics = async () => {
    try {
      const [kpisRes, funnelRes, trendRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/analytics/kpis`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/analytics/funnel?days=30`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/analytics/signups/trend?days=30`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/analytics/categories`, { headers: getAuthHeaders() })
      ]);

      if (kpisRes.ok) setKpis(await kpisRes.json());
      if (funnelRes.ok) setFunnel(await funnelRes.json());
      if (trendRes.ok) setTrend(await trendRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
    } catch (error) {
      toast.error('Kunne ikke hente analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-400">Indsigt og KPI'er</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Brugere i alt"
          value={kpis?.total_users || 0}
          subtitle={`+${kpis?.signups_month || 0} denne måned`}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="Konverteringsrate"
          value={`${kpis?.conversion_rate || 0}%`}
          subtitle="Tilbud → Accepteret"
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Gns. Svartid"
          value={`${kpis?.avg_response_time_hours || 0}t`}
          subtitle="Fra selskaber"
          icon={Clock}
          color="yellow"
        />
        <KPICard
          title="Estimeret Besparelse"
          value={`${((kpis?.total_savings_estimated || 0) / 1000).toFixed(0)}k kr`}
          subtitle="For alle brugere"
          icon={PiggyBank}
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Tilbud Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Aktive forespørgsler</span>
              <span className="font-medium">{kpis?.active_quote_requests || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Modtaget tilbud</span>
              <span className="font-medium">{kpis?.quotes_received || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Accepteret tilbud</span>
              <span className="font-medium text-green-400">{kpis?.quotes_accepted || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Nye Brugere</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">I dag</span>
              <span className="font-medium">{kpis?.signups_today || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Denne uge</span>
              <span className="font-medium">{kpis?.signups_week || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Denne måned</span>
              <span className="font-medium">{kpis?.signups_month || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold">Kategorier</h3>
          </div>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-slate-400 text-sm">Ingen data endnu</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.category} className="flex justify-between items-center">
                  <span className="text-slate-400">{CATEGORY_LABELS[cat.category] || cat.category}</span>
                  <span className="font-medium">{cat.count} ({cat.percentage}%)</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Konverteringstragt (sidste 30 dage)
        </h3>
        <div className="space-y-4">
          {funnel.map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <div className="w-40 text-sm text-slate-400">{stage.stage}</div>
              <div className="flex-1">
                <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      index === 0 ? 'bg-blue-600' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-blue-400' :
                      index === 3 ? 'bg-green-500' :
                      'bg-green-400'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-right">
                <span className="font-medium">{stage.count}</span>
                <span className="text-slate-400 text-sm ml-2">({stage.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signup Trend */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          Signup Trend (sidste 30 dage)
        </h3>
        <div className="h-48 flex items-end gap-1">
          {trend.map((point, index) => {
            const maxCount = Math.max(...trend.map(t => t.count), 1);
            const height = (point.count / maxCount) * 100;
            return (
              <div 
                key={point.date}
                className="flex-1 bg-green-500/30 hover:bg-green-500/50 transition-colors rounded-t cursor-pointer group relative"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${point.date}: ${point.count} signups`}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {point.date}: {point.count}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{trend[0]?.date || ''}</span>
          <span>{trend[trend.length - 1]?.date || ''}</span>
        </div>
      </div>
    </div>
  );
}

function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: any; 
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}





