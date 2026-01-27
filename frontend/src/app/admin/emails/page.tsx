'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Inbox, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  FileText,
  Settings,
  Users,
  Activity,
  TrendingUp,
  XCircle,
  Eye,
  Filter,
  Calendar,
  Search
} from 'lucide-react';

interface EmailStats {
  today: {
    sent: number;
    delivered: number;
    opened: number;
    bounced: number;
    failed: number;
  };
  week: {
    sent: number;
    delivered: number;
    opened: number;
    bounced: number;
    failed: number;
  };
  month: {
    sent: number;
    delivered: number;
    opened: number;
    bounced: number;
    failed: number;
  };
}

interface EmailLog {
  id: string;
  to_email: string;
  subject: string;
  template: string;
  status: 'sent' | 'delivered' | 'opened' | 'bounced' | 'failed';
  sent_at: string;
  opened_at?: string;
  error_message?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  last_used: string;
  sent_count: number;
  open_rate: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

// Mock data for demo
const MOCK_STATS: EmailStats = {
  today: { sent: 45, delivered: 44, opened: 32, bounced: 1, failed: 0 },
  week: { sent: 312, delivered: 305, opened: 221, bounced: 5, failed: 2 },
  month: { sent: 1247, delivered: 1210, opened: 847, bounced: 28, failed: 9 },
};

const MOCK_LOGS: EmailLog[] = [
  { id: '1', to_email: 'user1@example.com', subject: 'Nyt tilbud fra Norlys', template: 'quote_received', status: 'opened', sent_at: '2025-12-13T14:32:00Z', opened_at: '2025-12-13T15:10:00Z' },
  { id: '2', to_email: 'user2@example.com', subject: 'Velkommen til ForbrugerAgenten', template: 'welcome', status: 'delivered', sent_at: '2025-12-13T14:28:00Z' },
  { id: '3', to_email: 'user3@example.com', subject: 'Påmindelse: Du har et afventende tilbud', template: 'reminder', status: 'sent', sent_at: '2025-12-13T14:15:00Z' },
  { id: '4', to_email: 'invalid@example', subject: 'Nyt tilbud', template: 'quote_received', status: 'bounced', sent_at: '2025-12-13T13:45:00Z', error_message: 'Invalid email address' },
  { id: '5', to_email: 'user5@example.com', subject: 'Din jagt er startet', template: 'hunt_started', status: 'opened', sent_at: '2025-12-13T12:30:00Z', opened_at: '2025-12-13T13:00:00Z' },
];

const MOCK_TEMPLATES: EmailTemplate[] = [
  { id: '1', name: 'Velkommen', subject: 'Velkommen til ForbrugerAgenten', category: 'onboarding', last_used: '2025-12-13', sent_count: 523, open_rate: 72 },
  { id: '2', name: 'Tilbud Modtaget', subject: 'Nyt tilbud fra {provider}', category: 'quotes', last_used: '2025-12-13', sent_count: 1847, open_rate: 68 },
  { id: '3', name: 'Jagt Startet', subject: 'Din jagt er nu i gang', category: 'quotes', last_used: '2025-12-13', sent_count: 892, open_rate: 54 },
  { id: '4', name: 'Påmindelse', subject: 'Påmindelse: Du har et afventende tilbud', category: 'reminders', last_used: '2025-12-12', sent_count: 412, open_rate: 41 },
  { id: '5', name: 'Provider Forespørgsel', subject: 'Ny kundeforespørgsel', category: 'provider', last_used: '2025-12-13', sent_count: 2103, open_rate: 89 },
];

const statusConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  sent: { icon: Send, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Sendt' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Leveret' },
  opened: { icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Åbnet' },
  bounced: { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Bounced' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Fejlet' },
};

export default function AdminEmailsPage() {
  const [stats, setStats] = useState<EmailStats>(MOCK_STATS);
  const [logs, setLogs] = useState<EmailLog[]>(MOCK_LOGS);
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'templates'>('overview');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to fetch email data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      log.to_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return Math.round((numerator / denominator) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email System</h1>
          <p className="text-gray-500">Overvåg og administrer email kommunikation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Opdater
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Settings className="w-4 h-4" />
            Indstillinger
          </button>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">SendGrid Status</h2>
              <p className="text-green-100">Alle systemer kører normalt</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></span>
            <span className="font-medium">Forbundet</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-green-100 text-sm">Domain</p>
            <p className="font-medium">forbrugeragent.dk</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Sender</p>
            <p className="font-medium">noreply@forbrugeragent.dk</p>
          </div>
          <div>
            <p className="text-green-100 text-sm">Status</p>
            <p className="font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Verified
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Oversigt', icon: Activity },
          { id: 'logs', label: 'Email Log', icon: FileText },
          { id: 'templates', label: 'Skabeloner', icon: Mail },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Sendt i dag', value: stats.today.sent, icon: Send, color: 'blue' },
              { label: 'Leveret', value: `${calculateRate(stats.today.delivered, stats.today.sent)}%`, icon: CheckCircle, color: 'green' },
              { label: 'Åbnet', value: `${calculateRate(stats.today.opened, stats.today.delivered)}%`, icon: Eye, color: 'purple' },
              { label: 'Bounced', value: stats.today.bounced, icon: AlertTriangle, color: 'yellow' },
              { label: 'Fejlet', value: stats.today.failed, icon: XCircle, color: 'red' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className={`flex items-center gap-2 text-${stat.color}-600 mb-1`}>
                  <stat.icon className="w-4 h-4" />
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Time Period Comparison */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Statistik Oversigt</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Periode</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Sendt</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Leveret</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Åbnet</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Bounce Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Open Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { label: 'I dag', data: stats.today },
                    { label: 'Denne uge', data: stats.week },
                    { label: 'Denne måned', data: stats.month },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.label}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{row.data.sent}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{row.data.delivered}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{row.data.opened}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          calculateRate(row.data.bounced, row.data.sent) > 5
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {calculateRate(row.data.bounced, row.data.sent)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          calculateRate(row.data.opened, row.data.delivered) > 50
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {calculateRate(row.data.opened, row.data.delivered)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Søg efter email eller emne..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle status</option>
              <option value="sent">Sendt</option>
              <option value="delivered">Leveret</option>
              <option value="opened">Åbnet</option>
              <option value="bounced">Bounced</option>
              <option value="failed">Fejlet</option>
            </select>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Modtager</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Emne</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Skabelon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sendt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  const config = statusConfig[log.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{log.to_email}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.subject}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {log.template}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(log.sent_at).toLocaleString('da-DK')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {template.category}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4 truncate">{template.subject}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">
                    <Send className="w-4 h-4 inline mr-1" />
                    {template.sent_count}
                  </span>
                  <span className={`${template.open_rate >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                    <Eye className="w-4 h-4 inline mr-1" />
                    {template.open_rate}%
                  </span>
                </div>
                <span className="text-gray-400 text-xs">{template.last_used}</span>
              </div>
            </div>
          ))}
          
          {/* Add New Template */}
          <button className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition group">
            <Mail className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
            <span className="text-gray-600 group-hover:text-blue-600 font-medium">Opret Ny Skabelon</span>
          </button>
        </div>
      )}
    </div>
  );
}



