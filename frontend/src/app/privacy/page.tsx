'use client';

import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Privatlivspolitik</h1>
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
              ForbrugerAgenten ("vi", "os", "vores") respekterer dit privatliv og er forpligtet til at beskytte dine personoplysninger. 
              Denne privatlivspolitik fortæller dig, hvordan vi indsamler, bruger og beskytter dine oplysninger.
            </p>
          </section>

          {/* Who we are */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvem er vi?</h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-1 text-sm">
              <p><strong>Navn:</strong> ForbrugerAgenten</p>
              <p><strong>CVR:</strong> [INDSÆT CVR NR]</p>
              <p><strong>Adresse:</strong> [INDSÆT ADRESSE]</p>
              <p><strong>Email:</strong> kontakt@forbrugeragent.dk</p>
              <p><strong>Telefon:</strong> [INDSÆT TELEFON]</p>
            </div>
          </section>

          {/* What we collect */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvilke oplysninger indsamler vi?</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">1. Identifikationsoplysninger</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Navn (via MitID)</li>
                  <li>CPR-nummer (via MitID, krypteret)</li>
                  <li>Email adresse</li>
                  <li>Telefonnummer</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">2. Forbrugsdata</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Nuværende aftaler (strøm, mobil, internet)</li>
                  <li>Regninger og fakturaer (uploadet af dig)</li>
                  <li>Forbrugstal (kWh, data forbrug, etc.)</li>
                  <li>Månedlige omkostninger</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">3. Kommunikationsdata</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Beskeder mellem dig og selskaber</li>
                  <li>Chat samtaler med vores AI-assistent</li>
                  <li>Support henvendelser</li>
                  <li>Emailkorrespondance</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">4. Tekniske data</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP-adresse</li>
                  <li>Browser type og version</li>
                  <li>Enhedstype (mobil, tablet, computer)</li>
                  <li>Besøgstidspunkter</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How we use data */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Hvordan bruger vi dine oplysninger?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💼</span>
                <div>
                  <h4 className="font-medium text-gray-900">Levere vores service</h4>
                  <p className="text-gray-700 text-sm">Indhente tilbud, sammenligne priser, kommunikere med selskaber</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <h4 className="font-medium text-gray-900">Forbedre brugeroplevelsen</h4>
                  <p className="text-gray-700 text-sm">Personalisere indhold, optimere AI, udvikle nye features</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📬</span>
                <div>
                  <h4 className="font-medium text-gray-900">Kommunikation</h4>
                  <p className="text-gray-700 text-sm">Sende tilbud, påmindelser, system opdateringer</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sharing */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Deling af dine oplysninger</h3>
            
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium">✅ Vi deler med:</p>
              <ul className="mt-2 space-y-1 text-sm text-green-700">
                <li>• Selskaber du har godkendt</li>
                <li>• Tekniske leverandører (Railway, SendGrid, Criipto)</li>
                <li>• Juridiske krav (kun hvis lov kræver det)</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium">❌ Vi deler ALDRIG med:</p>
              <ul className="mt-2 space-y-1 text-sm text-red-700">
                <li>• Marketing firmaer</li>
                <li>• Databrokers</li>
                <li>• Social media platforme</li>
                <li>• Tredjeparter uden dit samtykke</li>
              </ul>
            </div>
          </section>

          {/* GDPR Rights */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dine rettigheder (GDPR)</h3>
            
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Ret til indsigt</h4>
                <p className="text-sm text-gray-700">Få en kopi af alle dine data</p>
                <p className="text-xs text-blue-600 mt-1">→ Indstillinger → Dine Data → Eksporter Data</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Ret til rettelse</h4>
                <p className="text-sm text-gray-700">Ret forkerte oplysninger</p>
                <p className="text-xs text-blue-600 mt-1">→ Indstillinger → Profil → Rediger</p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900">Ret til sletning</h4>
                <p className="text-sm text-gray-700">Få slettet alle dine data (permanent!)</p>
                <p className="text-xs text-red-600 mt-1">→ Indstillinger → Dine Data → Slet Konto</p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sikkerhed</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                'SSL/TLS kryptering',
                'Krypterede passwords',
                'Krypteret CPR-nummer',
                'Firewalls',
                'Sikkerhedsopdateringer',
                'Begrænsede adgangsrettigheder'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✅</span>
                  {feature}
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kontakt os</h3>
            <p className="text-gray-700 mb-3">Har du spørgsmål til denne politik?</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p><strong>Email:</strong> kontakt@forbrugeragent.dk</p>
              <p><strong>Telefon:</strong> [INDSÆT TELEFON]</p>
              <p className="text-gray-600 mt-2">Vi svarer normalt inden for 2 hverdage.</p>
            </div>
          </section>

          {/* Datatilsynet */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Klage til Datatilsynet</h4>
            <p className="text-sm text-gray-700 mb-3">
              Hvis du mener vi ikke overholder GDPR, kan du klage til:
            </p>
            <div className="text-sm">
              <p className="font-medium">Datatilsynet</p>
              <p>Borgergade 28, 5.</p>
              <p>1300 København K</p>
              <p>Email: dt@datatilsynet.dk</p>
              <p>Telefon: +45 33 19 32 00</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-6 border-t">
            <p>Sidst opdateret: 14. December 2025</p>
            <p className="mt-2">
              <a href="/terms" className="text-blue-600 hover:underline">Vilkår & Betingelser</a>
              {' • '}
              <a href="/cookies" className="text-blue-600 hover:underline">Cookie Politik</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
