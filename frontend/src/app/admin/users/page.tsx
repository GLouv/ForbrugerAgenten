'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Download, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  agent_email?: string;
  onboarding_completed: boolean;
  contracts_count: number;
  created_at: string;
}

interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search })
      });
      
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/?${params}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        setUsers(await response.json());
      }
    } catch (error) {
      toast.error('Kunne ikke hente brugere');
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetail = async (userId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/${userId}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        setSelectedUser(await response.json());
        setShowDetail(true);
      }
    } catch {
      toast.error('Kunne ikke hente bruger detaljer');
    }
  };

  const exportUserData = async (userId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/${userId}/export`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-${userId}-export.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data eksporteret');
      }
    } catch {
      toast.error('Kunne ikke eksportere data');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Er du sikker på du vil slette denne bruger og alt deres data? Dette kan ikke fortrydes.')) {
      return;
    }
    
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/${userId}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        toast.success('Bruger slettet');
        loadUsers();
        setShowDetail(false);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Kunne ikke slette bruger');
      }
    } catch {
      toast.error('Kunne ikke slette bruger');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brugere</h1>
          <p className="text-slate-400">Administrer alle brugere</p>
        </div>
        <div className="text-sm text-slate-400">
          {users?.total || 0} brugere i alt
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Søg på navn, email eller telefon..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Bruger</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Agent Email</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Kontrakter</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Oprettet</th>
                <th className="text-right p-4 text-sm font-medium text-slate-400">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  </td>
                </tr>
              ) : users?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Ingen brugere fundet
                  </td>
                </tr>
              ) : (
                users?.items.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.full_name || 'Ikke angivet'}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded">
                        {user.agent_email || '-'}
                      </code>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.onboarding_completed 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.onboarding_completed ? 'Aktiv' : 'Ufuldstændig'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{user.contracts_count}</td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString('da-DK')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => loadUserDetail(user.id)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Se detaljer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => exportUserData(user.id)}
                          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
                          title="Eksporter data"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-red-600 rounded-lg transition-colors text-red-400"
                          title="Slet bruger"
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

        {/* Pagination */}
        {users && users.pages > 1 && (
          <div className="p-4 border-t border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Side {users.page} af {users.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(users.pages, p + 1))}
                disabled={page === users.pages}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetail && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold">Bruger Detaljer</h2>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400">Fulde Navn</label>
                  <p className="font-medium">{selectedUser.full_name || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Telefon</label>
                  <p className="font-medium">{selectedUser.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Agent Email</label>
                  <p className="font-mono text-sm">{selectedUser.agent_email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Adresse</label>
                  <p className="font-medium">
                    {selectedUser.address ? `${selectedUser.address}, ${selectedUser.postal_code} ${selectedUser.city}` : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">MitID Verificeret</label>
                  <p className={selectedUser.mitid_verified ? 'text-green-400' : 'text-yellow-400'}>
                    {selectedUser.mitid_verified ? 'Ja' : 'Nej'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => exportUserData(selectedUser.id)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Eksporter Data
                </button>
                <button
                  onClick={() => {
                    deleteUser(selectedUser.id);
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Slet Bruger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





