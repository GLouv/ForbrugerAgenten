'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Check, User, Zap, Smartphone, Wifi, FileCheck, Upload, Camera, FileText, Image as ImageIcon } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: any
}

const steps: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Din profil',
    description: 'Fortæl os lidt om dig selv',
    icon: User
  },
  {
    id: 'services',
    title: 'Vælg services',
    description: 'Hvad vil du spare penge på?',
    icon: Zap
  },
  {
    id: 'upload',
    title: 'Upload regninger',
    description: 'Valgfrit - for hurtigere tilbud',
    icon: Upload
  },
  {
    id: 'consent',
    title: 'Fuldmagt',
    description: 'Giv os lov til at hjælpe dig',
    icon: FileCheck
  }
]

const services = [
  {
    id: 'energy',
    name: 'Elektricitet',
    description: 'Spar op til 3.000 kr/år på din elregning',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'mobile',
    name: 'Mobil',
    description: 'Find det bedste mobilabonnement til dig',
    icon: Smartphone,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'internet',
    name: 'Internet',
    description: 'Hurtigere internet til lavere pris',
    icon: Wifi,
    color: 'from-purple-500 to-pink-500'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  // Refs for file uploads
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step 1: Profile data
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    postal_code: '',
    city: ''
  })

  // Step 2: Selected services
  const [selectedServices, setSelectedServices] = useState({
    wants_energy: false,
    wants_mobile: false,
    wants_internet: false
  })

  // Step 3: Uploaded documents
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Step 4: Consent
  const [consent, setConsent] = useState({
    consent_given: false,
    fuldmagt_accepted: false
  })

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('session_token')
    if (!token) {
      router.push('/login')
      return
    }
    setSessionToken(token)
    loadOnboardingStatus(token)
  }, [router])

  const loadOnboardingStatus = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onboarding/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        
        // If already completed, redirect to dashboard
        if (data.onboarding_completed) {
          router.push('/dashboard')
          return
        }

        // Load existing data
        if (data.profile) {
          setProfile({
            full_name: data.profile.full_name || '',
            phone: data.profile.phone || '',
            date_of_birth: data.profile.date_of_birth || '',
            address: data.profile.address || '',
            postal_code: data.profile.postal_code || '',
            city: data.profile.city || ''
          })
        }

        // Set step based on saved progress
        const stepMap: { [key: string]: number } = {
          'profile': 0,
          'services': 1,
          'upload': 2,
          'consent': 3,
          'completed': 3
        }
        const step = stepMap[data.onboarding_step] || 0
        setCurrentStep(step)
      }
    } catch (error) {
      console.error('Failed to load onboarding status:', error)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newFiles: File[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        newFiles.push(file)
        
        // TODO: Parse with AI (bill_parser_service)
        console.log('📄 Uploaded:', file.name)
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsUploading(false)
  }

  const handleNext = async () => {
    if (!sessionToken) return
    
    setLoading(true)

    try {
      if (currentStep === 0) {
        // Step 1: Save profile
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onboarding/profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          },
          body: JSON.stringify(profile)
        })

        if (!response.ok) throw new Error('Failed to save profile')
        
        setCurrentStep(1)
      } else if (currentStep === 1) {
        // Step 2: Save services
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onboarding/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          },
          body: JSON.stringify(selectedServices)
        })

        if (!response.ok) throw new Error('Failed to save services')
        
        const data = await response.json()
        console.log('✅ Agent email generated:', data.agent_email)
        
        setCurrentStep(2)
      } else if (currentStep === 2) {
        // Step 3: Upload documents (optional - just skip)
        // TODO: If files uploaded, send to backend for parsing
        setCurrentStep(3)
      } else if (currentStep === 3) {
        // Step 4: Save consent & complete
        const consentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onboarding/consent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          },
          body: JSON.stringify(consent)
        })

        if (!consentResponse.ok) throw new Error('Failed to save consent')

        // Complete onboarding
        const completeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/onboarding/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          },
          body: JSON.stringify({ onboarding_completed: true })
        })

        if (!completeResponse.ok) throw new Error('Failed to complete onboarding')

        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Der skete en fejl. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [`wants_${serviceId}`]: !prev[`wants_${serviceId}` as keyof typeof prev]
    }))
  }

  const canProceed = () => {
    if (currentStep === 0) {
      return profile.full_name && profile.phone && profile.address && profile.postal_code && profile.city
    } else if (currentStep === 1) {
      return selectedServices.wants_energy || selectedServices.wants_mobile || selectedServices.wants_internet
    } else if (currentStep === 2) {
      return true // Upload is optional
    } else if (currentStep === 3) {
      return consent.consent_given && consent.fuldmagt_accepted
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Velkommen til ForbrugerAgenten! 🎉
          </h1>
          <p className="text-gray-600">
            Lad os hjælpe dig med at spare penge på el, mobil og internet
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Step 1: Profile */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Din profil</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fulde navn *</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dit fulde navn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer *</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+45 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fødselsdato (valgfrit)</label>
                  <input
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Gadenavn 123"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postnummer *</label>
                    <input
                      type="text"
                      value={profile.postal_code}
                      onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">By *</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="København"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Hvad vil du spare penge på?</h2>
              <p className="text-gray-600 mb-6">Vælg de services vi skal hjælpe dig med</p>
              
              <div className="space-y-4">
                {services.map((service) => {
                  const ServiceIcon = service.icon
                  const isSelected = selectedServices[`wants_${service.id}` as keyof typeof selectedServices]
                  
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`w-full relative p-6 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-white flex-shrink-0`}>
                          <ServiceIcon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <Check className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {(selectedServices.wants_energy || selectedServices.wants_mobile || selectedServices.wants_internet) && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ {Object.values(selectedServices).filter(Boolean).length} service(s) valgt
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Upload Documents */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Upload dine regninger (valgfrit)</h2>
              <p className="text-gray-600 mb-6">
                Upload billeder af dine nuværende regninger, så kan vi give dig hurtigere tilbud. Du kan også springe over.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Tag billede</span>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </button>

                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Vælg billede</span>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Upload PDF</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </button>
              </div>

              {isUploading && (
                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-700">Uploader...</span>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Uploadede filer ({uploadedFiles.length})</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-900 flex-1">{file.name}</span>
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  💡 <strong>Tip:</strong> Dette step er valgfrit. Du kan også tilføje regninger senere fra dit dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Consent */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Fuldmagt og samtykke</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-lg mb-3">GDPR Samtykke</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Jeg giver tilladelse til at ForbrugerAgenten behandler mine personoplysninger i henhold til GDPR.
                    Vi bruger dine data til at hjælpe dig med at finde bedre tilbud på el, mobil og internet.
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.consent_given}
                      onChange={(e) => setConsent({ ...consent, consent_given: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Jeg accepterer GDPR vilkår</span>
                  </label>
                </div>

                <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h3 className="font-semibold text-lg mb-3">Fuldmagt</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Jeg giver ForbrugerAgenten fuldmagt til at:
                  </p>
                  <ul className="text-sm text-gray-600 mb-4 space-y-2 ml-4">
                    <li>• Indhente tilbud fra leverandører på mine vegne</li>
                    <li>• Kommunikere med el-, mobil- og internetudbydere</li>
                    <li>• Hjælpe mig med at skifte til bedre tilbud</li>
                  </ul>
                  <p className="text-xs text-gray-500 mb-4">
                    Du kan til enhver tid trække din fuldmagt tilbage.
                  </p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.fuldmagt_accepted}
                      onChange={(e) => setConsent({ ...consent, fuldmagt_accepted: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Jeg accepterer fuldmagten</span>
                  </label>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900">
                    🎉 <strong>Næsten færdig!</strong> Når du klikker "Kom i gang", starter vi med at finde besparelser til dig.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tilbage
          </button>

          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Spring over
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gemmer...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Kom i gang! 🚀
                  <Check className="w-5 h-5" />
                </>
              ) : (
                <>
                  Næste
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
