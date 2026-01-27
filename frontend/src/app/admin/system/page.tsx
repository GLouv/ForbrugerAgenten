'use client';

import { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

interface ComponentHealth {
  name: string;
  status: string;
  message?: string;
  last_check: string;
}

interface SystemHealth {
  overall_status: string;
  components: ComponentHealth[];
  uptime_seconds: number;
}

interface TableStats {
  table_name: string;
  row_count: number;
}

interface DatabaseHealth {
  status: string;
  tables: TableStats[];
  total_rows: number;
}

interface EmailStats {
  total_sent: number;
  sent_today: number;
  sent_week: number;
  failed: number;
  delivery_rate: number;
}

interface JobStatus {
  job_name: string;
  status: string;
  last_run?: string;
  next_run?: string;
  last_error?: string;
}

export default function AdminSystemPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [database, setDatabase] = useState<DatabaseHealth | null>(null);
  const [emails, setEmails] = useState<EmailStats | null>(null);
  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadSystemStatus = async () => {
    setLoading(true);
    try {
      const [healthRes, dbRes, emailsRes, jobsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/system/health`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/system/database`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/system/emails/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/v1/admin/system/jobs`, { headers: getAuthHeaders() })
      ]);

      if (healthRes.ok) setHealth(await healthRes.json());
      if (dbRes.ok) setDatabase(await dbRes.json());
      if (emailsRes.ok) setEmails(await emailsRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
    } catch (error) {
      toast.error('Kunne ikke hente system status');
    } finally {
      setLoading(false);
    }
  };

  const triggerJob = async (jobName: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/system/jobs/${jobName}/run`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        toast.success(`Job ${jobName} startet`);
        loadSystemStatus();
      }
    } catch {
      toast.error('Kunne ikke starte job');
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}t ${minutes}m`;
    if (hours > 0) return `${hours}t ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'unhealthy': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="text-slate-400">Overvågning og status</p>
        </div>
        <button
          onClick={loadSystemStatus}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Opdater
        </button>
      </div>

      {/* Overall Status */}
      <div className={`rounded-xl border p-6 ${getStatusColor(health?.overall_status || 'unknown')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStatusIcon(health?.overall_status || 'unknown')}
            <div>
              <h2 className="text-lg font-semibold capitalize">
                System Status: {health?.overall_status || 'Ukendt'}
              </h2>
              <p className="text-sm opacity-80">
                Uptime: {formatUptime(health?.uptime_seconds || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {health?.components.map((component) => (
          <div 
            key={component.name}
            className="bg-slate-800 rounded-xl border border-slate-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(component.status)}
                <h3 className="font-semibold">{component.name}</h3>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                component.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                component.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {component.status}
              </span>
            </div>
            <p className="text-sm text-slate-400">{component.message}</p>
            <p className="text-xs text-slate-500 mt-2">
              Sidst tjekket: {new Date(component.last_check).toLocaleTimeString('da-DK')}
            </p>
          </div>
        ))}
      </div>

      {/* Database & Email Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Database</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              database?.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {database?.status}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm border-b border-slate-700 pb-2 mb-2">
              <span className="text-slate-400">Tabel</span>
              <span className="text-slate-400">Rækker</span>
            </div>
            {database?.tables.map((table) => (
              <div key={table.table_name} className="flex justify-between text-sm">
                <span className="text-slate-300">{table.table_name}</span>
                <span className="font-mono">{table.row_count.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-slate-700 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-mono font-medium">{database?.total_rows.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Email Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold">Email Service</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">I dag</p>
                <p className="text-xl font-bold">{emails?.sent_today || 0}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Denne uge</p>
                <p className="text-xl font-bold">{emails?.sent_week || 0}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Total sendt</p>
                <p className="text-xl font-bold">{emails?.total_sent || 0}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">Leveringsrate</p>
                <p className={`text-xl font-bold ${
                  (emails?.delivery_rate || 0) >= 95 ? 'text-green-400' :
                  (emails?.delivery_rate || 0) >= 80 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {emails?.delivery_rate || 0}%
                </p>
              </div>
            </div>
            {(emails?.failed || 0) > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400">
                  {emails?.failed} fejlede emails
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Jobs */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold">Background Jobs</h3>
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div 
              key={job.job_name}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
            >
              <div>
                <p className="font-medium flex items-center gap-2">
                  {job.job_name}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    job.status === 'running' ? 'bg-green-500/20 text-green-400' :
                    job.status === 'idle' ? 'bg-slate-500/20 text-slate-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {job.status}
                  </span>
                </p>
                <p className="text-sm text-slate-400">
                  Sidste kørsel: {job.last_run ? new Date(job.last_run).toLocaleString('da-DK') : 'Aldrig'}
                </p>
                {job.next_run && (
                  <p className="text-xs text-slate-500">
                    Næste: {new Date(job.next_run).toLocaleString('da-DK')}
                  </p>
                )}
              </div>
              <button
                onClick={() => triggerJob(job.job_name)}
                disabled={job.status === 'running'}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Kør Nu
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}





