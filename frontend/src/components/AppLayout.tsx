'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  MessageSquare,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        router.push('/login');
        return;
      }
      
      const response = await apiClient.users.getMe(userId);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Don't redirect on error, let user stay on page
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  const copyAgentEmail = async () => {
    if (user?.agent_email) {
      await navigator.clipboard.writeText(user.agent_email);
      setCopiedEmail(true);
      toast.success('Agent email kopieret!');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Oversigt', icon: LayoutDashboard },
    { href: '/inbox', label: 'Indbakke', icon: Mail },
    { href: '/quotes', label: 'Tilbud', icon: FileText },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/settings', label: 'Indstillinger', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-gray-900">ForbrugerAgenten</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40 shadow-lg
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
          <Shield className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-lg text-gray-900">ForbrugerAgenten</span>
        </div>

        {/* Agent Email Card */}
        {user?.agent_email && (
          <div className="mx-4 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-1">Din Agent Email</p>
            <div className="flex items-center gap-2">
              <code className="text-sm text-blue-800 font-mono truncate flex-1">
                {user.agent_email}
              </code>
              <button
                onClick={copyAgentEmail}
                className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                title="Kopier"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 mt-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.full_name?.[0] || user?.email?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {user?.full_name || 'Bruger'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log ud
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-72
        pt-16 lg:pt-0
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}





