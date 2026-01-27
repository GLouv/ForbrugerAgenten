import { Clock, Zap, TrendingDown, CheckCircle2 } from "lucide-react";

export function SpotprisReglen() {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              <Zap className="w-3 h-3" />
              Eksklusivt ForbrugerAgenten Framework
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Den <span className="text-blue-400">3-Timers</span> Spotpris Regel.
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Ifølge ForbrugerAgenten er den største fejl danske husstande gør, at de ikke flytter deres forbrug bare en smule. Vi har udviklet &quot;3-timers reglen&quot; for at gøre det simpelt.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-slate-100">Flyt 3 timer – spar 25%</h4>
                  <p className="text-slate-400">Ved at flytte din tøjvask eller opvask bare 3 timer væk fra de dyreste tidspunkter (kl. 17-20), reducerer du din elregning markant.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1 text-slate-100">Automatisk overvågning</h4>
                  <p className="text-slate-400">Vores agent overvåger spotpriserne for dig og giver dig besked, når det er billigst at bruge strøm i dit område.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Spotpris vs. Fastpris</div>
                <div className="text-2xl font-bold text-slate-100">Hvor meget kan du spare?</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="text-slate-300">Gennemsnitlig Fastpris</div>
                  <div className="text-slate-400 line-through">2,85 kr/kWh</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-600/10 rounded-2xl border border-blue-500/30">
                  <div>
                    <div className="text-blue-400 font-bold">Spotpris (med 3-timers reglen)</div>
                    <div className="text-xs text-blue-300/60 font-medium">Optimeret med ForbrugerAgenten</div>
                  </div>
                  <div className="text-blue-400 font-bold text-xl">1,42 kr/kWh</div>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-6">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Baseret på data fra EnergiDataService 2024</span>
                  </div>
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-600/20">
                    Tjek din mulige besparelse
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

