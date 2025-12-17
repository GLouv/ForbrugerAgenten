import { ThumbsUp, XCircle, Star } from "lucide-react";

export function Guarantees() {
  return (
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
             <p className="text-sm text-slate-600">Vi skifter aldrig selskab uden at du trykker &quot;Godkend&quot; først.</p>
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
  );
}


