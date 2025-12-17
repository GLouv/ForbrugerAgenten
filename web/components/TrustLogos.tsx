export function TrustLogos() {
  const logos = [
    "Norlys", "YouSee", "Andel Energi", "Telenor", "Telia", "3", "Oister", "CBB"
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
          Fungerer med dine nuværende udbydere
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <span key={logo} className="text-xl md:text-2xl font-bold text-slate-400 hover:text-slate-800 cursor-default select-none">
              {logo}
            </span>
          ))}
        </div>

        <p className="mt-8 text-sm text-slate-400 max-w-2xl mx-auto">
          Vi er 100% uafhængige. Vi arbejder kun for dig, ikke selskaberne.
        </p>
      </div>
    </section>
  );
}


