'use client';

import { Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Cookie Politik</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Sidst opdateret: 14. December 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Intro */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hvad er cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cookies er små tekstfiler som gemmes på din computer eller mobilenhed når du besøger et website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              De bruges til at huske dine præferencer, holde dig logget ind, analysere hvordan du bruger sitet, 
              og forbedre brugeroplevelsen.
            </p>
          </section>

          {/* Types of cookies */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hvilke cookies bruger vi?</h3>
            
            {/* Necessary cookies */}
            <div className="mb-6">
              <div className="bg-red-50 p-4 rounded-t-lg border-2 border-red-200">
                <h4 className="font-semibold text-red-800">
                  1. Strengt nødvendige cookies (kan ikke fravælges)
                </h4>
              </div>
              <div className="border-2 border-red-200 border-t-0 rounded-b-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Disse cookies er <strong>nødvendige</strong> for at Tjenesten virker:
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium">Cookie</th>
                        <th className="text-left p-2 font-medium">Formål</th>
                        <th className="text-left p-2 font-medium">Udløb</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">session_id</code></td>
                        <td className="p-2">Holder dig logget ind</td>
                        <td className="p-2">Ved logout</td>
                      </tr>
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">csrf_token</code></td>
                        <td className="p-2">Sikkerhed mod angreb</td>
                        <td className="p-2">1 time</td>
                      </tr>
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">user_preferences</code></td>
                        <td className="p-2">Gemmer dine indstillinger</td>
                        <td className="p-2">1 år</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-600 mt-2">
                  <strong>Retligt grundlag:</strong> Legitim interesse (nødvendig for Tjenesten)
                </p>
              </div>
            </div>

            {/* Analytics cookies */}
            <div className="mb-6">
              <div className="bg-yellow-50 p-4 rounded-t-lg border-2 border-yellow-200">
                <h4 className="font-semibold text-yellow-800">
                  2. Analytiske cookies (kan fravælges)
                </h4>
              </div>
              <div className="border-2 border-yellow-200 border-t-0 rounded-b-lg p-4">
                <p className="text-sm text-gray-700 mb-3">
                  Disse cookies hjælper os med at forstå hvordan du bruger appen:
                </p>
                
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 font-medium">Cookie</th>
                        <th className="text-left p-2 font-medium">Formål</th>
                        <th className="text-left p-2 font-medium">Udløb</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">_ga</code></td>
                        <td className="p-2">Google Analytics - besøgs ID</td>
                        <td className="p-2">2 år</td>
                      </tr>
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">_gat</code></td>
                        <td className="p-2">Google Analytics - rate limiting</td>
                        <td className="p-2">1 minut</td>
                      </tr>
                      <tr>
                        <td className="p-2"><code className="bg-gray-100 px-1 rounded">_gid</code></td>
                        <td className="p-2">Google Analytics - sessions ID</td>
                        <td className="p-2">24 timer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800 mb-1">✅ Hvad vi måler:</p>
                    <ul className="text-green-700 space-y-0.5">
                      <li>• Antal besøgende</li>
                      <li>• Hvilke sider du besøger</li>
                      <li>• Hvor lang tid du bruger</li>
                      <li>• Hvilken enhed du bruger</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-3 rounded">
                    <p className="font-medium text-red-800 mb-1">❌ Hvad vi IKKE måler:</p>
                    <ul className="text-red-700 space-y-0.5">
                      <li>• Personidentificerbar info</li>
                      <li>• Dine regninger/forbrug</li>
                      <li>• Dine chat samtaler</li>
                      <li>• Tilbud du modtager</li>
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-3">
                  <strong>Retligt grundlag:</strong> Samtykke (du giver accept)
                </p>
              </div>
            </div>

            {/* Marketing cookies */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  3. Marketing cookies (kan fravælges)
                </h4>
                <p className="text-sm text-gray-700">
                  <strong>Vi bruger for nuværende INGEN marketing cookies.</strong>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Hvis vi introducerer dem i fremtiden, vil du blive informeret og skal give eksplicit samtykke.
                </p>
              </div>
            </div>
          </section>

          {/* How to control */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hvordan styrer du cookies?</h3>
            
            {/* In app */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900 mb-2">I appen:</h4>
              <p className="text-sm text-blue-800 mb-2">
                Gå til: <strong>Indstillinger → Cookie Præferencer</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>✅ Nødvendige cookies (kan ikke fravælges)</li>
                <li>☑ Analytiske cookies (valgfri)</li>
                <li>☐ Marketing cookies (valgfri)</li>
              </ul>
            </div>

            {/* In browser */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">I din browser:</h4>
              
              {[
                {
                  browser: 'Chrome',
                  steps: ['Indstillinger → Privatliv og sikkerhed', 'Cookies og andre webstedsdata', 'Bloker alle cookies ELLER Se alle cookies → Fjern specifikke']
                },
                {
                  browser: 'Safari',
                  steps: ['Præferencer → Privatliv', 'Bloker alle cookies ELLER Administrer webstedsdata → Fjern specifikke']
                },
                {
                  browser: 'Firefox',
                  steps: ['Indstillinger → Privatliv og sikkerhed', 'Cookies og webstedsdata', 'Slet cookies når Firefox lukkes ELLER Administrer data → Fjern']
                },
                {
                  browser: 'Edge',
                  steps: ['Indstillinger → Cookies og webtilladelser', 'Administrer og slet cookies', 'Bloker alle ELLER Se alle → Fjern specifikke']
                }
              ].map(({ browser, steps }) => (
                <div key={browser} className="border rounded-lg p-3">
                  <p className="font-medium text-gray-900 mb-1">{browser}:</p>
                  <ol className="text-sm text-gray-700 space-y-0.5 ml-4">
                    {steps.map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
              ))}

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200 mt-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Bemærk:</strong> Hvis du blokerer nødvendige cookies, kan du ikke logge ind og appen fungerer ikke korrekt.
                </p>
              </div>
            </div>
          </section>

          {/* Third party */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tredjepartscookies</h3>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Google Analytics</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Formål:</strong> Website statistik</li>
                <li><strong>Cookies:</strong> _ga, _gat, _gid</li>
                <li><strong>Privatlivspolitik:</strong> <a href="https://policies.google.com/privacy" target="_blank" className="text-blue-600 hover:underline">policies.google.com/privacy</a></li>
                <li><strong>Opt-out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" className="text-blue-600 hover:underline">tools.google.com/dlpage/gaoptout</a></li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-green-800 font-medium mb-2">Vi bruger IKKE:</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>❌ Facebook Pixel</li>
                <li>❌ LinkedIn Insight</li>
                <li>❌ TikTok Pixel</li>
                <li>❌ Andre sociale medie tracking</li>
              </ul>
            </div>
          </section>

          {/* Duration */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvor længe gemmes cookies?</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Varighed</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3">Session cookies</td>
                    <td className="p-3">Til du lukker browser</td>
                  </tr>
                  <tr>
                    <td className="p-3">Nødvendige cookies</td>
                    <td className="p-3">Max 1 år</td>
                  </tr>
                  <tr>
                    <td className="p-3">Analytiske cookies</td>
                    <td className="p-3">Max 2 år</td>
                  </tr>
                  <tr>
                    <td className="p-3">Marketing cookies</td>
                    <td className="p-3">N/A (vi bruger ingen)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Spørgsmål?</h3>
            <p className="text-gray-700 mb-3">Har du spørgsmål om vores brug af cookies?</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p><strong>Email:</strong> kontakt@forbrugeragent.dk</p>
              <p><strong>Telefon:</strong> [INDSÆT TELEFON]</p>
              <p className="text-gray-600 mt-2">Vi svarer inden for 2 hverdage.</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p>Sidst opdateret: 14. December 2025</p>
            <p className="mt-2">
              <a href="/privacy" className="text-blue-600 hover:underline">Privatlivspolitik</a>
              {' • '}
              <a href="/terms" className="text-blue-600 hover:underline">Vilkår & Betingelser</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
