'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Trash2, CheckCircle } from 'lucide-react'

export default function InboxPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      router.push('/login')
      return
    }
    setSessionToken(token)
    loadMessages(token)
  }, [router])

  const loadMessages = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inbox/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    if (!sessionToken) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inbox/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })
      
      // Update local state
      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, read: true } : m)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message)
    if (!message.read) {
      markAsRead(message.id)
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
              <h1 className="text-2xl font-bold text-gray-900">Indbakke</h1>
              <p className="text-sm text-gray-600">
                {messages.filter(m => !m.read).length} ulæste beskeder
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-2">
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Ingen beskeder</h3>
                <p className="text-sm text-gray-600">
                  Beskeder fra udbydere vises her
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`w-full text-left bg-white rounded-lg border p-4 hover:shadow-md transition-all ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {message.subject || 'Ingen emne'}
                    </h3>
                    {!message.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {message.from_email || 'Ukendt'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(message.created_at).toLocaleString('da-DK')}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedMessage.subject || 'Ingen emne'}
                  </h2>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      <p><strong>Fra:</strong> {selectedMessage.from_email}</p>
                      <p><strong>Til:</strong> {selectedMessage.to_email}</p>
                      <p><strong>Dato:</strong> {new Date(selectedMessage.created_at).toLocaleString('da-DK')}</p>
                    </div>
                    {selectedMessage.read && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span>Læst</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {selectedMessage.body || 'Ingen indhold'}
                  </p>
                </div>

                {selectedMessage.parsed_data && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">AI Analyse</h3>
                    <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                      {JSON.stringify(selectedMessage.parsed_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vælg en besked
                </h3>
                <p className="text-gray-600">
                  Klik på en besked til venstre for at læse den
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
