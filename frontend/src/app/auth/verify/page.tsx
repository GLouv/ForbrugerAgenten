'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token')
      const email = searchParams.get('email')

      if (!token || !email) {
        setStatus('error')
        setMessage('Ugyldigt login link. Prøv at logge ind igen.')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: Include cookies
          body: JSON.stringify({ email, token }),
        })

        if (!response.ok) {
          throw new Error('Verification failed')
        }

        const data = await response.json()

        // Store session token in localStorage as backup
        localStorage.setItem('session_token', data.session_token)
        localStorage.setItem('user_email', data.email)

        setStatus('success')
        setMessage('Login successful! Redirecting...')

        // Redirect based on onboarding status
        setTimeout(() => {
          if (data.onboarding_complete) {
            router.push('/dashboard')
          } else {
            router.push('/onboarding')
          }
        }, 1500)

      } catch (err) {
        setStatus('error')
        setMessage('Ugyldigt eller udløbet login link. Prøv igen.')
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verificerer login...
              </h1>

              <p className="text-gray-600">
                Et øjeblik venligst
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Login successful! ✅
              </h1>

              <p className="text-gray-600">
                {message}
              </p>

              <div className="mt-6">
                <div className="inline-block animate-bounce">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Login fejlede ❌
              </h1>

              <p className="text-gray-600 mb-6">
                {message}
              </p>

              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Prøv igen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
