'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

interface Stats {
  total_users: number;
  users_today: number;
  active_quote_requests: number;
  open_tickets: number;
  pending_provider_response: number;
  awaiting_user_action: number;
}

interface QueueItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  user_name?: string;
  user_email?: string;
  status: string;
  priority?: string;
  days_waiting: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user_name?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadDashboard = async () => {
    try {
      const [statsRes, queueRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/dashboard/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/dashboard/queues/all?limit=10`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/dashboard/activity?limit=10`, { headers: getAuthHeaders() })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (queueRes.ok) setQueue(await queueRes.json());
      if (activityRes.ok) setActivity(await activityRes.json());
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Kunne ikke hente dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (type: string, id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/dashboard/queues/${type}/${id}/send-reminder`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      if (response.ok) {
        toast.success('Rykker sendt!');
      }
    } catch {
      toast.error('Kunne ikke sende rykker');
    }
  };

  const handleResolve = async (type: string, id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/dashboard/queues/${type}/${id}/resolve`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      if (response.ok) {
        toast.success('Markeret som løst!');
        loadDashboard();
      }
    } catch {
      toast.error('Kunne ikke markere som løst');
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400">Overblik over systemet</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Brugere i alt"
          value={stats?.total_users || 0}
          subtitle={`+${stats?.users_today || 0} i dag`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Aktive Jagter"
          value={stats?.active_quote_requests || 0}
          subtitle="Tilbudsforespørgsler"
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Åbne Tickets"
          value={stats?.open_tickets || 0}
          subtitle="Support sager"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Afventer Selskab"
          value={stats?.pending_provider_response || 0}
          subtitle=">3 dage uden svar"
          icon={Clock}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Ventende Sager
            </h2>
            <span className="text-sm text-slate-400">{queue.length} sager</span>
          </div>
          <div className="divide-y divide-slate-700">
            {queue.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Ingen ventende sager 🎉
              </div>
            ) : (
              queue.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.type === 'ticket' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.type === 'ticket' ? 'Ticket' : 'Tilbud'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.days_waiting >= 7 ? 'bg-red-500/20 text-red-400' :
                          item.days_waiting >= 3 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {item.days_waiting} dage
                        </span>
                      </div>
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-slate-400 truncate">{item.user_name || item.user_email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendReminder(item.type, item.id)}
                        className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                        title="Send rykker"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResolve(item.type, item.id)}
                        className="p-2 hover:bg-green-600 rounded-lg transition-colors text-green-400"
                        title="Marker som løst"
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {queue.length > 5 && (
            <div className="p-4 border-t border-slate-700">
              <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Se alle {queue.length} sager
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Seneste Aktivitet
            </h2>
          </div>
          <div className="divide-y divide-slate-700">
            {activity.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Ingen aktivitet endnu
              </div>
            ) : (
              activity.slice(0, 8).map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.type === 'signup' ? 'bg-green-500/20 text-green-400' :
                      item.type === 'quote_request' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {item.type === 'signup' ? '👤' :
                       item.type === 'quote_request' ? '📋' : '🎫'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-sm text-slate-400 truncate">{item.description}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(item.timestamp).toLocaleString('da-DK')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: any; 
  color: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}





