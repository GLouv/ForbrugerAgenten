import { ShieldCheck, ScanLine, BellRing, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Features() {
  return (
    <section className="py-24 bg-white overflow-hidden" id="hvordan">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Processen
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Sådan arbejder din Agent.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
            Vi har fjernet alt bøvlet. Du skal ikke skifte kodeord, uploade filer eller ringe til nogen. <br className="hidden md:block" />Vi klarer det hele digitalt.
          </p>
        </div>

        {/* Feature 1: Setup (The Connection) */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 mb-32">
          {/* Visual Side */}
          <div className="flex-1 w-full">
            <div className="relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm overflow-hidden group">
               {/* Background Pattern */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60"></div>
               
               {/* Mini UI: Identity Card */}
               <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-auto transform transition-transform duration-500 group-hover:scale-105">
                 <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4">
                   <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">MitID</div>
                   <div>
                     <div className="h-2 w-24 bg-slate-200 rounded mb-2"></div>
                     <div className="h-2 w-16 bg-slate-100 rounded"></div>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                     <span>Verificeret Identitet</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                     <span>Digital Fuldmagt oprettet</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                     <CheckCircle2 className="w-4 h-4 text-green-500" />
                     <span>Bank-kryptering aktiv</span>
                   </div>
                 </div>
                 <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Sikker forbindelse</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                 </div>
               </div>
            </div>
          </div>
          
          {/* Text Side */}
          <div className="flex-1 max-w-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">1. Opret sikker forbindelse</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Log ind med MitID. Det tager 30 sekunder. Det giver os en digital fuldmagt, så vi kan indhente dine aftaler fra selskaberne helt automatisk.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Ingen upload af PDF&apos;er nødvendig.
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Vi henter selv data fra dine udbydere.
              </li>
            </ul>
          </div>
        </div>


        {/* Feature 2: The Agent (The Scan) - Reversed Layout */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 mb-32">
          {/* Visual Side */}
          <div className="flex-1 w-full">
            <div className="relative bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl overflow-hidden group">
               {/* Background Pattern */}
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
               
               {/* Mini UI: Scanning Interface */}
               <div className="relative z-10 space-y-4 max-w-sm mx-auto">
                 {/* Contract Item 1 */}
                 <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 flex items-center justify-between transform transition-all duration-500 hover:translate-x-2">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">⚡️</div>
                     <div>
                       <div className="text-white text-sm font-medium">Norlys El</div>
                       <div className="text-slate-400 text-xs">Scanning priser...</div>
                     </div>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   </div>
                 </div>

                 {/* Contract Item 2 */}
                 <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-700 flex items-center justify-between transform transition-all duration-500 delay-100 hover:translate-x-2">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">📱</div>
                     <div>
                       <div className="text-white text-sm font-medium">Telenor Mobil</div>
                       <div className="text-slate-400 text-xs">Tjekker forbrug...</div>
                     </div>
                   </div>
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75"></div>
                   </div>
                 </div>

                  {/* Scan Line Animation */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-full w-full pointer-events-none animate-[scan_3s_ease-in-out_infinite]"></div>
               </div>
            </div>
          </div>
          
          {/* Text Side */}
          <div className="flex-1 max-w-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">2. Agenten går på jagt</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Mens du sover, analyserer vores system markedet. Vi sammenligner dine nuværende priser med tusindvis af andre tilbud.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Tjekker for skjulte gebyrer.
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Finder &quot;snik-pristigninger&quot;.
              </li>
            </ul>
          </div>
        </div>


        {/* Feature 3: Approval (The Result) */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Visual Side */}
          <div className="flex-1 w-full">
            <div className="relative bg-green-50 rounded-3xl p-8 md:p-12 border border-green-100 shadow-sm overflow-hidden group">
               {/* Background Pattern */}
               <div className="absolute top-1/2 left-1/2 w-full h-full bg-green-100/50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-60"></div>
               
               {/* Mini UI: Notification Card */}
               <div className="relative z-10 bg-white rounded-2xl shadow-xl p-0 overflow-hidden max-w-sm mx-auto transform transition-transform duration-500 group-hover:-translate-y-2">
                 <div className="bg-green-600 p-4 flex justify-between items-center">
                   <span className="text-white font-medium text-sm">Ny besparelse fundet!</span>
                   <BellRing className="w-4 h-4 text-green-100" />
                 </div>
                 <div className="p-6 text-center">
                   <div className="text-3xl font-bold text-slate-900 mb-1">89 kr.</div>
                   <div className="text-slate-500 text-sm mb-6">sparet hver måned på El</div>
                   
                   <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                     Godkend skift
                     <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                   <p className="text-xs text-slate-400 mt-3">Vi klarer papirarbejdet for dig.</p>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Text Side */}
          <div className="flex-1 max-w-lg">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">3. Du godkender med ét klik</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Når vi finder en bedre aftale, får du besked. Du skal bare trykke &quot;Godkend&quot;, så klarer vi opsigelse og oprettelse.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                Ingen telefonkøer.
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                Du bevarer kontrollen.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

