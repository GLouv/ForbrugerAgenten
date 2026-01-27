'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Mail,
  TrendingDown, 
  Plus,
  FileText,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      router.push('/login')
      return
    }
    setSessionToken(token)
    loadDashboardData(token)
  }, [router])

  const loadDashboardData = async (token: string) => {
    try {
      // Load user profile
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        
        // Load messages/inbox
        try {
          const messagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inbox/messages`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json()
            setMessages(messagesData.messages || [])
          }
        } catch (error) {
          console.error('Failed to load messages:', error)
        }
      } else {
        // Session expired
        router.push('/login')
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!sessionToken) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('session_token')
    localStorage.removeItem('user_email')
    router.push('/login')
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'energy': return <Zap className="w-5 h-5 text-yellow-600" />
      case 'mobile': return <Smartphone className="w-5 h-5 text-blue-600" />
      case 'internet': return <Wifi className="w-5 h-5 text-purple-600" />
      default: return <Zap className="w-5 h-5" />
    }
  }

  const getServiceLabel = (service: string) => {
    switch (service) {
      case 'energy': return 'Elektricitet'
      case 'mobile': return 'Mobil'
      case 'internet': return 'Internet'
      default: return service
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeServices = [
    user?.wants_energy && 'energy',
    user?.wants_mobile && 'mobile',
    user?.wants_internet && 'internet'
  ].filter(Boolean)

  const unreadMessages = messages.filter(m => !m.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ForbrugerAgenten</h1>
              <p className="text-sm text-gray-600">Velkommen tilbage, {user?.name || user?.email}!</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/inbox')}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mail className="w-6 h-6" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-6 h-6" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Log ud</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Dit Besparelses Dashboard 💰</h2>
            <p className="text-blue-100 mb-6">
              Vi arbejder på at finde de bedste tilbud til dig på el, mobil og internet
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-100">Aktive Services</p>
                <p className="text-2xl font-bold">{activeServices.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-100">Beskeder</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-100">Estimeret Besparelse</p>
                <p className="text-2xl font-bold">Beregnes...</p>
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dine Aktive Services</h3>
            
            {activeServices.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ingen services valgt</h4>
                <p className="text-gray-600 mb-4">Gå tilbage til onboarding for at vælge services</p>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Vælg Services
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeServices.map((service) => (
                  <div key={service} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        {getServiceIcon(service as string)}
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        Aktiv
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {getServiceLabel(service as string)}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Vi indhenter tilbud fra forskellige udbydere
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span>Afventer svar</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Seneste Beskeder</h3>
              <button
                onClick={() => router.push('/inbox')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Se alle →
              </button>
            </div>
            
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Ingen beskeder endnu</h4>
                <p className="text-gray-600">
                  Når vi modtager tilbud fra udbydere, vises de her
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{message.subject || 'Ingen emne'}</h4>
                          {!message.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Fra: {message.from_email || 'Ukendt afsender'}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {message.body || 'Ingen indhold'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {new Date(message.created_at).toLocaleDateString('da-DK')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hurtige Handlinger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/inbox')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tjek din indbakke</h4>
                    <p className="text-sm text-gray-600">Se alle beskeder fra udbydere</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/settings')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Indstillinger</h4>
                    <p className="text-sm text-gray-600">Administrer din profil og præferencer</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
