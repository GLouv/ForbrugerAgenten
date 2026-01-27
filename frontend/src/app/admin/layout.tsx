'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  Server, 
  Mail,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_data');
    
    if (!token || !adminData) {
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setLoading(false);
      return;
    }
    
    try {
      setAdmin(JSON.parse(adminData));
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
      router.push('/admin/login');
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    router.push('/admin/login');
  };

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Brugere', icon: Users },
    { href: '/admin/providers', label: 'Selskaber', icon: Building2 },
    { href: '/admin/emails', label: 'Email System', icon: Mail },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/system', label: 'System', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <span className="font-bold">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-700">
          <Shield className="w-8 h-8 text-blue-500" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin info & logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              {admin?.full_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{admin?.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log ud
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`
        min-h-screen transition-all duration-300
        lg:ml-64
        pt-16 lg:pt-0
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}





