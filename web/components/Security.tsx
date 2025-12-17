import { Lock, Server, Shield } from "lucide-react";

export function Security() {
  return (
    <section className="py-24 bg-white border-t border-slate-100" id="sikkerhed">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 mb-8 text-slate-900">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Dine data er private.</h2>
          <p className="text-lg text-slate-600 mb-12">
            Vi behandler dine oplysninger med samme sikkerhedsniveau som bankerne. <br/>
            Vi er her for at hjælpe dig, ikke sælge dine data.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="flex gap-4">
               <div className="flex-shrink-0 mt-1">
                 <Server className="w-5 h-5 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-900">Dansk Infrastruktur</h4>
                 <p className="text-sm text-slate-500 mt-1">Al data opbevares på sikrede servere i Danmark.</p>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="flex-shrink-0 mt-1">
                 <Lock className="w-5 h-5 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-900">Total Kryptering</h4>
                 <p className="text-sm text-slate-500 mt-1">Al kommunikation er krypteret. Ingen kan kigge med.</p>
               </div>
             </div>

             <div className="flex gap-4">
               <div className="flex-shrink-0 mt-1">
                 <Shield className="w-5 h-5 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-900">GDPR Compliant</h4>
                 <p className="text-sm text-slate-500 mt-1">Du ejer dine data. Du kan altid bede os slette alt.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

