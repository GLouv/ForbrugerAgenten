'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Bell, Zap, Smartphone, Wifi } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      router.push('/login')
      return
    }
    setSessionToken(token)
    loadUser(token)
  }, [router])

  const loadUser = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Indstillinger</h1>
              <p className="text-sm text-gray-600">Administrer din profil og præferencer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profil Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
              </div>

              {user?.name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Navn</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aktive Services</h2>
            
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-lg ${user?.wants_energy ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${user?.wants_energy ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${user?.wants_energy ? 'text-yellow-900' : 'text-gray-600'}`}>
                    Elektricitet
                  </span>
                </div>
                <span className={`text-sm font-medium ${user?.wants_energy ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {user?.wants_energy ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${user?.wants_mobile ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Smartphone className={`w-5 h-5 ${user?.wants_mobile ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${user?.wants_mobile ? 'text-blue-900' : 'text-gray-600'}`}>
                    Mobil
                  </span>
                </div>
                <span className={`text-sm font-medium ${user?.wants_mobile ? 'text-blue-700' : 'text-gray-500'}`}>
                  {user?.wants_mobile ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${user?.wants_internet ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Wifi className={`w-5 h-5 ${user?.wants_internet ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span className={`font-medium ${user?.wants_internet ? 'text-purple-900' : 'text-gray-600'}`}>
                    Internet
                  </span>
                </div>
                <span className={`text-sm font-medium ${user?.wants_internet ? 'text-purple-700' : 'text-gray-500'}`}>
                  {user?.wants_internet ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/onboarding')}
              className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
            >
              Rediger Services
            </button>
          </div>

          {/* Agent Email */}
          {user?.agent_email && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Din Agent Email
              </h2>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Email:</strong> {user.agent_email}
                </p>
                <p className="text-xs text-blue-700">
                  Dette er din unikke email som udbydere sender tilbud til. Alle beskeder videresendes automatisk til din indbakke.
                </p>
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Konto Handlinger</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => alert('Ændring af adgangskode kommer snart!')}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-left"
              >
                Skift adgangskode
              </button>
              
              <button
                onClick={() => alert('Download af data kommer snart!')}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-left"
              >
                Download dine data (GDPR)
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Er du sikker på at du vil slette din konto? Dette kan ikke fortrydes.')) {
                    alert('Sletning af konto kommer snart!')
                  }
                }}
                className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-900 rounded-lg font-medium transition-colors text-left border border-red-200"
              >
                Slet min konto
              </button>
            </div>
          </div>

          {/* Privacy Links */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Juridisk & Privatliv</h3>
            <div className="space-y-2 text-sm">
              <a href="/privacy" className="block text-blue-600 hover:text-blue-700">
                Privatlivspolitik
              </a>
              <a href="/terms" className="block text-blue-600 hover:text-blue-700">
                Vilkår & Betingelser
              </a>
              <a href="/cookies" className="block text-blue-600 hover:text-blue-700">
                Cookie Politik
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
