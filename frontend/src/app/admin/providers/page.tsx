'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Pause, 
  Play,
  X,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

interface Provider {
  id: string;
  name: string;
  categories: string[];
  quote_email?: string;
  support_email?: string;
  is_active: boolean;
  reputation_score: number;
  avg_response_time_hours: number;
  is_slow_responder: boolean;
  total_leads_sent: number;
  total_deals_won: number;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  energy: 'Energi',
  mobile: 'Mobil',
  internet: 'Internet'
};

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editProvider, setEditProvider] = useState<Provider | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    quote_email: '',
    support_email: '',
    categories: [] as string[],
    admin_notes: ''
  });

  useEffect(() => {
    loadProviders();
  }, [categoryFilter, search]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(categoryFilter && { category: categoryFilter }),
        ...(search && { search }),
        sort_by: 'reputation_score'
      });
      
      const response = await fetch(
        `${API_URL}/api/v1/admin/providers/?${params}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        setProviders(await response.json());
      }
    } catch (error) {
      toast.error('Kunne ikke hente selskaber');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editProvider 
        ? `${API_URL}/api/v1/admin/providers/${editProvider.id}`
        : `${API_URL}/api/v1/admin/providers/`;
      
      const response = await fetch(url, {
        method: editProvider ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success(editProvider ? 'Selskab opdateret' : 'Selskab oprettet');
        setShowModal(false);
        setEditProvider(null);
        resetForm();
        loadProviders();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunne ikke gemme selskab');
      }
    } catch {
      toast.error('Kunne ikke gemme selskab');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Er du sikker på du vil slette ${name}?`)) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/providers/${id}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        toast.success('Selskab slettet');
        loadProviders();
      }
    } catch {
      toast.error('Kunne ikke slette selskab');
    }
  };

  const toggleActive = async (provider: Provider) => {
    try {
      const endpoint = provider.is_active ? 'pause' : 'activate';
      const response = await fetch(
        `${API_URL}/api/v1/admin/providers/${provider.id}/${endpoint}`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        toast.success(provider.is_active ? 'Selskab sat på pause' : 'Selskab aktiveret');
        loadProviders();
      }
    } catch {
      toast.error('Kunne ikke ændre status');
    }
  };

  const flagSlowResponder = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/providers/${id}/flag-slow`,
        { method: 'POST', headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        toast.success('Selskab markeret som langsom');
        loadProviders();
      }
    } catch {
      toast.error('Kunne ikke markere selskab');
    }
  };

  const openEditModal = (provider: Provider) => {
    setEditProvider(provider);
    setFormData({
      name: provider.name,
      quote_email: provider.quote_email || '',
      support_email: provider.support_email || '',
      categories: provider.categories,
      admin_notes: ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quote_email: '',
      support_email: '',
      categories: [],
      admin_notes: ''
    });
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const getConversionRate = (p: Provider) => {
    return p.total_leads_sent > 0 
      ? ((p.total_deals_won / p.total_leads_sent) * 100).toFixed(1)
      : '0.0';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Selskaber</h1>
          <p className="text-slate-400">Administrer udbydere</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditProvider(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tilføj Selskab
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Søg på navn eller email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Alle kategorier</option>
          <option value="energy">Energi</option>
          <option value="mobile">Mobil</option>
          <option value="internet">Internet</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Selskab</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Kategorier</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Score</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Svartid</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Leads</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Konvertering</th>
                <th className="text-right p-4 text-sm font-medium text-slate-400">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Ingen selskaber fundet
                  </td>
                </tr>
              ) : (
                providers.map((provider) => (
                  <tr key={provider.id} className={`hover:bg-slate-700/50 transition-colors ${!provider.is_active ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-bold">
                          {provider.name[0]}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {provider.name}
                            {provider.is_slow_responder && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" title="Langsom responder" />
                            )}
                          </p>
                          <p className="text-sm text-slate-400">{provider.quote_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {provider.categories.map(cat => (
                          <span key={cat} className="text-xs px-2 py-1 bg-slate-700 rounded-full">
                            {CATEGORY_LABELS[cat] || cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${
                          provider.reputation_score >= 70 ? 'text-green-400' :
                          provider.reputation_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                        }`} />
                        <span className="font-medium">{provider.reputation_score}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`${
                        provider.avg_response_time_hours <= 24 ? 'text-green-400' :
                        provider.avg_response_time_hours <= 72 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {provider.avg_response_time_hours.toFixed(1)}t
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{provider.total_leads_sent}</td>
                    <td className="p-4">
                      <span className={`${
                        parseFloat(getConversionRate(provider)) >= 20 ? 'text-green-400' :
                        parseFloat(getConversionRate(provider)) >= 10 ? 'text-yellow-400' : 'text-slate-400'
                      }`}>
                        {getConversionRate(provider)}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(provider)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title={provider.is_active ? 'Sæt på pause' : 'Aktiver'}
                        >
                          {provider.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        {!provider.is_slow_responder && (
                          <button
                            onClick={() => flagSlowResponder(provider.id)}
                            className="p-2 hover:bg-yellow-600 rounded-lg transition-colors text-yellow-400"
                            title="Marker som langsom"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(provider)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Rediger"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(provider.id, provider.name)}
                          className="p-2 hover:bg-red-600 rounded-lg transition-colors text-red-400"
                          title="Slet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editProvider ? 'Rediger Selskab' : 'Tilføj Selskab'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Navn</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Selskabets navn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tilbuds Email</label>
                <input
                  type="email"
                  value={formData.quote_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, quote_email: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tilbud@selskab.dk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Support Email</label>
                <input
                  type="email"
                  value={formData.support_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="support@selskab.dk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kategorier</label>
                <div className="flex gap-2">
                  {['energy', 'mobile', 'internet'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        formData.categories.includes(cat)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Admin Noter</label>
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Interne noter..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Annuller
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {editProvider ? 'Gem Ændringer' : 'Opret Selskab'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





