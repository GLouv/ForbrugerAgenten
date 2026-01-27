'use client';

import { FileText, CheckCircle, XCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Vilkår & Betingelser</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Sidst opdateret: 14. December 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Velkommen til ForbrugerAgenten</h2>
            <p className="text-gray-700 leading-relaxed">
              Ved at bruge ForbrugerAgenten ("Tjenesten") accepterer du disse vilkår og betingelser ("Vilkår"). 
              Læs dem omhyggeligt.
            </p>
          </section>

          {/* What is ForbrugerAgenten */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvad er ForbrugerAgenten?</h3>
            <p className="text-gray-700 mb-3">
              ForbrugerAgenten er en digital platform der hjælper forbrugere med at:
            </p>
            <ul className="space-y-2">
              {[
                'Sammenligne priser på strøm, mobil og internet',
                'Indhente tilbud fra leverandører',
                'Skifte til billigere aftaler',
                'Spare penge på sine faste udgifter'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Who can use */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvem kan bruge Tjenesten?</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-medium text-green-800 mb-2">✅ Du kan bruge Tjenesten hvis du:</p>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Er minimum 18 år gammel</li>
                  <li>• Er bosiddende i Danmark</li>
                  <li>• Har en gyldig MitID</li>
                  <li>• Kan give fuldmagt til os</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-medium text-red-800 mb-2">❌ Du må IKKE bruge hvis du:</p>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Er under 18 år</li>
                  <li>• Er konkurs/rekonstruktion</li>
                  <li>• Tidligere udelukket</li>
                  <li>• Bryder vilkårene</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fuldmagt - MOST IMPORTANT */}
          <section className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fuldmagt - Vigtig information!</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Hvad giver du os fuldmagt til?
                </h4>
                <ul className="space-y-1 text-sm text-gray-700 ml-7">
                  <li>• Kontakte selskaber på dine vegne</li>
                  <li>• Indhente og forhandle tilbud</li>
                  <li>• Modtage information i din agent-email</li>
                  <li>• Håndtere din kommunikation</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border-2 border-green-600">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Hvad gør vi IKKE?
                </h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li><strong>❌ Vi skifter ALDRIG uden din godkendelse</strong></li>
                  <li>❌ Vi forpligter dig IKKE til noget</li>
                  <li>❌ Vi deler IKKE dine data uden samtykke</li>
                </ul>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  Du har ALTID den endelige kontrol!
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tilbagetrækning af fuldmagt</h4>
                <p className="text-sm text-gray-700">
                  Du kan <strong>når som helst</strong> trække din fuldmagt tilbage ved at:
                </p>
                <ul className="text-sm text-gray-700 mt-1 space-y-1">
                  <li>→ Gå til Indstillinger → Slet Konto, eller</li>
                  <li>→ Send email til kontakt@forbrugeragent.dk</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvordan virker Tjenesten?</h3>
            
            <div className="space-y-3">
              {[
                { step: 1, title: 'Du giver os information', desc: 'Upload regning eller indtast forbrugsdata' },
                { step: 2, title: 'Vi indhenter tilbud', desc: 'Vi kontakter selskaber på dine vegne' },
                { step: 3, title: 'Du får besked', desc: 'Vi viser alle tilbud i appen' },
                { step: 4, title: 'Du vælger', desc: 'Du beslutter om du vil skifte' },
                { step: 5, title: 'Vi hjælper med skift', desc: 'Vi sender link, du bekræfter' }
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Pris og betaling</h3>
            
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-green-600 mb-2">GRATIS! 🎉</p>
              <p className="text-gray-700">
                Tilmelding, tilbud, sammenligning - alt er gratis!
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-600 bg-white p-4 rounded">
              <p className="font-medium mb-1">Fremtidige prismodeller:</p>
              <p>Vi forbeholder os retten til at introducere premium features eller provision fra selskaber.</p>
              <p className="font-medium mt-2">Ved ændringer: 30 dages varsel + du kan fravælge.</p>
            </div>
          </section>

          {/* Our responsibility */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Vores ansvar</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Vi stræber efter at:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Give præcise sammenligninger</li>
                  <li>✓ Indhente relevante tilbud</li>
                  <li>✓ Beskytte dine data</li>
                  <li>✓ Levere pålidelig service</li>
                </ul>
              </div>

              <div className="border-2 border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Vi garanterer IKKE:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✗ At du får besparelser</li>
                  <li>✗ At alle selskaber svarer</li>
                  <li>✗ At tilbud er tilgængelige</li>
                  <li>✗ At priser er de laveste</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  Selskaber bestemmer deres egne priser og tilgængelighed.
                </p>
              </div>
            </div>
          </section>

          {/* Your responsibility */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dit ansvar</h3>
            
            <ul className="space-y-2">
              {[
                'Give korrekte oplysninger',
                'Overholde aftaler med selskaber',
                'Beskytte din konto',
                'Ikke misbruge Tjenesten'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Opsigelse</h3>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-medium text-gray-900 mb-1">Du kan opsige:</h4>
                <p className="text-sm text-gray-700">
                  Når som helst uden grund ved at slette din konto i Indstillinger.
                  Træder i kraft øjeblikkeligt.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded">
                <h4 className="font-medium text-gray-900 mb-1">Vi kan opsige hvis:</h4>
                <p className="text-sm text-gray-700">
                  Du overtræder vilkår, misbruger tjenesten, eller hvis vi ophører drift (30 dages varsel).
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kontakt</h3>
            <p className="text-gray-700 mb-3">Spørgsmål til disse Vilkår?</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p><strong>Email:</strong> kontakt@forbrugeragent.dk</p>
              <p><strong>Telefon:</strong> [INDSÆT TELEFON]</p>
              <p className="text-gray-600 mt-2">Vi svarer inden for 2 hverdage.</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p className="font-medium text-gray-900 mb-2">
              Ved at bruge ForbrugerAgenten accepterer du disse Vilkår.
            </p>
            <p>Sidst opdateret: 14. December 2025</p>
            <p className="mt-2">
              <a href="/privacy" className="text-blue-600 hover:underline">Privatlivspolitik</a>
              {' • '}
              <a href="/cookies" className="text-blue-600 hover:underline">Cookie Politik</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
