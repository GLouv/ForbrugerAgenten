import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Search, FileText, ArrowDown, RefreshCcw, ThumbsUp, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* 1. Header */}
      <div className="container mx-auto px-4 pt-12 pb-16 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Sådan virker det.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Vi finder den bedste aftale til dig i dag. <br className="hidden md:block"/>
            Og vi sikrer, at den bliver ved med at være god i morgen.
          </p>
      </div>

      {/* 2. The Process */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-3xl relative">
          
          {/* Thread */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-200 to-transparent -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2 md:hidden"></div>

          {/* STEP 1: CONNECT */}
          <div className="relative mb-20 md:mb-32">
             <div className="md:flex items-center justify-between gap-12 group">
               {/* Marker */}
               <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md -translate-x-1/2 mt-6 z-10"></div>
               
               {/* Content - Left Side */}
               <div className="md:w-1/2 md:text-right pl-20 md:pl-0 md:pr-16">
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">1. Forbind til ForbrugerAgenten</h3>
                 <p className="text-slate-600 mb-4 text-lg">
                   Log ind med MitID. Det giver os en sikker, digital fuldmagt til at indhente dine kontrakter, så vi kan se præcis, hvad du betaler i dag.
                 </p>
                 <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                   <ShieldCheck className="w-3 h-3 text-green-600" />
                   Sikker MitID-login
                 </div>
               </div>

               {/* Visual - Right Side */}
               <div className="hidden md:block md:w-1/2 pl-16">
                 <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-900/5 border border-slate-100 w-full max-w-xs transform group-hover:scale-105 transition-transform duration-500 hover:shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md">MitID</div>
                      <div className="text-sm font-medium text-slate-900">Adgang godkendt</div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded mb-2"></div>
                    <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                 </div>
               </div>
             </div>
          </div>

          {/* STEP 2: FIND BEST DEAL */}
          <div className="relative mb-20 md:mb-32">
             <div className="md:flex items-center justify-between gap-12 flex-row-reverse group">
               {/* Marker */}
               <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md -translate-x-1/2 mt-6 z-10 animate-pulse"></div>
               
               {/* Content - Right Side */}
               <div className="md:w-1/2 md:text-left pl-20 md:pl-16">
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">2. Vi finder de bedste aftaler</h3>
                 <p className="text-slate-600 mb-4 text-lg">
                   Vi scanner hele markedet og sammenligner med din nuværende pris. Hvis der findes en bedre eller billigere aftale derude, finder vi den til dig.
                 </p>
                 <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                   <Search className="w-3 h-3" />
                   Vi scanner tusindvis af priser
                 </div>
               </div>

               {/* Visual - Left Side */}
               <div className="hidden md:block md:w-1/2 pr-16 text-right">
                 <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-blue-900/20 w-full max-w-xs ml-auto transform group-hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                      <span className="text-xs text-slate-400">Din nuværende pris</span>
                      <span className="text-xs text-green-400 font-bold">Markedets bedste</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-white font-medium">Mobil</span>
                       <div className="flex gap-2 text-sm">
                         <span className="text-slate-500 line-through">199 kr.</span>
                         <span className="text-green-400 font-bold">119 kr.</span>
                       </div>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          {/* STEP 3: MONITOR BILLS */}
          <div className="relative">
             <div className="md:flex items-center justify-between gap-12 group">
               {/* Marker */}
               <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-900 rounded-full border-4 border-white shadow-md -translate-x-1/2 mt-6 z-10"></div>
               
               {/* Content - Left Side */}
               <div className="md:w-1/2 md:text-right pl-20 md:pl-0 md:pr-16">
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">3. Vi tjekker dine regninger automatisk</h3>
                 <p className="text-slate-600 mb-4 text-lg">
                   Vi gennemgår hver eneste regning for fejl, gebyrer og prisstigninger. Hvis selskabet prøver at hæve prisen, slår vi alarm med det samme.
                 </p>
                 <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-900 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200">
                   <FileText className="w-3 h-3" />
                   Vi fanger skjulte gebyrer
                 </div>
               </div>

               {/* Visual - Right Side */}
               <div className="hidden md:block md:w-1/2 pl-16">
                 <div className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 w-full max-w-xs transform group-hover:scale-105 transition-transform duration-500 hover:shadow-xl">
                    <div className="flex items-start gap-3 mb-3">
                       <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div>
                         <div className="text-sm font-bold text-slate-900">Regning analyseret</div>
                         <div className="text-xs text-slate-500 mt-1">Prisstigning fundet: +20 kr.</div>
                       </div>
                    </div>
                    
                    {/* The "Switch" Action Visual */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-500">Anbefaling:</span>
                        <span className="text-green-600 font-bold">Skift selskab</span>
                      </div>
                      <div className="w-full bg-blue-900 text-white text-xs py-1.5 rounded-lg text-center font-medium flex items-center justify-center gap-1 shadow-sm cursor-pointer hover:bg-blue-800 transition-colors">
                        <RefreshCcw className="w-3 h-3" />
                        Godkend skift
                      </div>
                    </div>

                 </div>
               </div>
             </div>
          </div>

        </div>
      </section>

      {/* 3. The "Tryghed" Section (New) */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Dine Garantier</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-600">
                 <ThumbsUp className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-slate-900 mb-2">Du bestemmer</h3>
               <p className="text-sm text-slate-600">Vi skifter aldrig selskab uden at du trykker "Godkend" først.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-red-500">
                 <XCircle className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-slate-900 mb-2">Ingen binding</h3>
               <p className="text-sm text-slate-600">Du kan slette din agent og tilbagekalde fuldmagten på 10 sekunder.</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-slate-50/50">
               <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-yellow-500">
                 <Star className="w-5 h-5" />
               </div>
               <h3 className="font-bold text-slate-900 mb-2">Kun gode selskaber</h3>
               <p className="text-sm text-slate-600">Vi foreslår kun udbydere med ordentlig dækning og kundeservice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="bg-white border-t border-slate-100 py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Skal vi overvåge dine priser?</h2>
          <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white px-10 h-12 shadow-lg shadow-blue-900/20 text-lg">
            Start din agent gratis
          </Button>
          <p className="text-sm text-slate-400 mt-6">Ingen binding. 100% uforpligtende.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

