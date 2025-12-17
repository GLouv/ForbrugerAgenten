import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Lock, Shield, Server, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Lean Header */}
      <div className="container mx-auto px-4 pt-16 pb-12 max-w-3xl text-center">
         <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Sikkerhed er vores fundament.</h1>
         <p className="text-lg text-slate-600">
           Vi håndterer dine mest følsomme data: CPR-nummer, MitID og regninger. 
           Derfor er vores sikkerhed på bank-niveau.
         </p>
      </div>

      <div className="container mx-auto px-4 pb-24 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
           
           {/* MitID Card */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
               <Shield className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">MitID Validering</h3>
             <p className="text-slate-600 leading-relaxed mb-4">
               Vi bruger MitID til at verificere din identitet. Det sikrer, at ingen kan udgive sig for at være dig. 
             </p>
             <ul className="mt-auto space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Juridisk bindende fuldmagt</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Sikker login-standard</li>
             </ul>
           </div>

           {/* Data Sovereignty Card */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
               <Server className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">Data i Danmark</h3>
             <p className="text-slate-600 leading-relaxed mb-4">
               Alle dine data opbevares på sikrede servere placeret fysisk i Danmark. Vi overholder alle GDPR-regler.
             </p>
             <ul className="mt-auto space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Dansk lovgivning gælder</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Fuld datakontrol</li>
             </ul>
           </div>

           {/* Encryption Card */}
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow md:col-span-2">
             <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Total Kryptering</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">
                    Al kommunikation mellem din app og vores servere er krypteret (TLS 1.3). 
                    Dine dokumenter (regninger og kontrakter) opbevares krypteret (AES-256), så selv hvis nogen stjal vores harddiske, ville de intet kunne læse.
                  </p>
                </div>
             </div>
           </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}


