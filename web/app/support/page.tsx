import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Har du brug for hjælp?</h1>
        <p className="text-lg text-slate-600 mb-12">
          Vi sidder klar til at hjælpe dig. Vi bestræber os på at svare inden for 24 timer på hverdage.
        </p>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 inline-block text-left w-full">
           <div className="flex items-center gap-4 mb-6">
             <div className="bg-blue-50 p-3 rounded-full">
               <Mail className="w-6 h-6 text-blue-900" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Email Support</h3>
               <a href="mailto:support@forbrugeragenten.dk" className="text-blue-600 hover:underline">
                 support@forbrugeragenten.dk
               </a>
             </div>
           </div>
           
           <div className="border-t border-slate-100 pt-6">
             <h4 className="font-semibold text-slate-900 mb-2">Ofte stillede spørgsmål</h4>
             <ul className="space-y-3 text-slate-600 text-sm">
               <li>• Hvordan opsiger jeg min agent?</li>
               <li>• Hvad koster det? (Det er gratis at oprette)</li>
               <li>• Hvilke selskaber understøtter I?</li>
             </ul>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}


