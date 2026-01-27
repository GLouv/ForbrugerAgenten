'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4332';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login to:', `${API_URL}/api/v1/admin/login`);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login fejlede');
      }

      const data = await response.json();
      
      // Store token and admin data
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_data', JSON.stringify(data.admin));
      
      toast.success('Velkommen tilbage!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error detailed:', error);
      toast.error(error.message || 'Login fejlede');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/admin/setup-first-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          full_name: fullName,
          role: 'super_admin'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Setup fejlede');
      }

      const data = await response.json();
      
      // Store token and admin data
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_data', JSON.stringify(data.admin));
      
      toast.success('Admin oprettet! Velkommen!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Setup fejlede');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-400 mt-2">ForbrugerAgenten Management</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsSetup(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isSetup ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSetup(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isSetup ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Første Setup
          </button>
        </div>

        {/* Dev Login Helper */}
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={() => {
              setEmail('admin@forbrugeragenten.dk');
              setPassword('Admin123!');
            }}
            className="mb-4 w-full py-1 px-2 bg-slate-800 text-xs text-slate-500 rounded hover:bg-slate-700"
          >
            [DEV] Auto-fill Credentials
          </button>
        )}

        {/* Form */}
        <form onSubmit={isSetup ? handleSetup : handleLogin} className="space-y-4">
          {isSetup && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fulde Navn
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dit navn"
                required={isSetup}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@forbrugeragenten.dk"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adgangskode
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isSetup ? 'Opretter...' : 'Logger ind...'}
              </>
            ) : (
              isSetup ? 'Opret Admin' : 'Log ind'
            )}
          </button>
        </form>

        {isSetup && (
          <p className="text-sm text-slate-500 text-center mt-4">
            Første setup opretter en super admin bruger.
            <br />Dette virker kun hvis ingen admins eksisterer.
          </p>
        )}
      </div>
    </div>
  );
}





