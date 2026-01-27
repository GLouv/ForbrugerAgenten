"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Hvorfor skal jeg bruge MitID?",
      answer: "Vi bruger MitID til at verificere din identitet og oprette en digital fuldmagt. Dette gør det muligt for os at indhente dine nuværende aftaler fra dine udbydere helt automatisk, så du slipper for at uploade PDF-regninger manuelt. Det er præcis samme sikkerhedsniveau som din bank.",
    },
    {
      question: "Koster det noget at bruge ForbrugerAgenten?",
      answer: "Det er gratis at oprette din agent og få overvåget dine priser. Vi tjener kun penge, hvis vi finder en besparelse til dig, som du vælger at godkende. Vi tager en lille procentdel af den besparelse, vi skaffer dig det første år – ellers er det helt gratis.",
    },
    {
      question: "Er mine data sikre?",
      answer: "Ja, dine data er 100% sikre. Vi opbevarer al data på krypterede servere i Danmark og følger alle GDPR-regler. Vi sælger aldrig dine personlige oplysninger videre til tredjeparter. Vi er din uafhængige vagthund.",
    },
    {
      question: "Kan jeg altid opsige min fuldmagt?",
      answer: "Selvfølgelig. Du har fuld kontrol. Du kan til enhver tid trække din fuldmagt tilbage og slette din profil med ét klik inde i appen. Der er ingen binding hos os.",
    },
    {
      question: "Hvilke udbydere holder I øje med?",
      answer: "Vi overvåger alle de store danske udbydere inden for el, mobil og internet. Det inkluderer selskaber som Norlys, Andel Energi, YouSee, Telenor, Telia, 3, Oister, CBB og mange flere. Vi er 100% uafhængige af selskaberne.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Ofte stillede spørgsmål
          </h2>
          <p className="text-slate-600 text-lg">
            Få svar på de mest almindelige spørgsmål om sikkerhed, pris og hvordan vi arbejder for dig.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900 md:text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

