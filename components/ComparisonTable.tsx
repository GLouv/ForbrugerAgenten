import { Check, X } from "lucide-react";

export function ComparisonTable() {
  const comparisonData = [
    {
      feature: "Overvågning af priser",
      normal: "Manuelt (hvis du husker det)",
      agent: "Automatisk 24/7",
      agentWin: true,
    },
    {
      feature: "Gennemgang af regninger",
      normal: "Sjældent (for kompliceret)",
      agent: "Hver måned (systematisk)",
      agentWin: true,
    },
    {
      feature: "Forhandling af tilbud",
      normal: "Du skal ringe og prutte om pris",
      agent: "Agenten forhandler digitalt",
      agentWin: true,
    },
    {
      feature: "Skift af udbyder",
      normal: "Besværligt med opsigelse",
      agent: "Ét klik i appen",
      agentWin: true,
    },
    {
      feature: "Sikkerhed",
      normal: "Varierende",
      agent: "MitID & Bank-kryptering",
      agentWin: true,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Hvorfor bruge en Agent?
          </h2>
          <p className="text-slate-600 text-lg">
            Vi har sammenlignet den traditionelle måde at håndtere faste udgifter på med ForbrugerAgenten.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-100 shadow-xl bg-slate-50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-6 text-sm font-bold uppercase tracking-wider">Funktion</th>
                <th className="p-6 text-sm font-bold uppercase tracking-wider text-center">Traditionelt</th>
                <th className="p-6 text-sm font-bold uppercase tracking-wider text-center bg-blue-900">ForbrugerAgenten</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.map((item, index) => (
                <tr key={index} className="group hover:bg-white transition-colors">
                  <td className="p-6 font-semibold text-slate-800">{item.feature}</td>
                  <td className="p-6 text-center text-slate-500 text-sm italic">{item.normal}</td>
                  <td className={`p-6 text-center font-bold text-sm bg-blue-50/30 group-hover:bg-blue-50/50 transition-colors ${item.agentWin ? "text-blue-900" : "text-slate-900"}`}>
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      {item.agent}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-8 bg-blue-50/50 text-center border-t border-slate-100">
            <p className="text-blue-900 font-bold text-lg mb-2">Spar op til 4.500 kr. om året pr. husstand</p>
            <p className="text-slate-500 text-sm italic">Beregnet ud fra gennemsnitlige besparelser på el, mobil og internet i Danmark.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

