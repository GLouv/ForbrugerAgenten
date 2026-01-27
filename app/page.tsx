import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustLogos } from "@/components/TrustLogos";
import { Features } from "@/components/Features";
import { SpotprisReglen } from "@/components/SpotprisReglen";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Guarantees } from "@/components/Guarantees";
import { Security } from "@/components/Security";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <TrustLogos />
      <Features />
      <SpotprisReglen />
      <ComparisonTable />
      <Guarantees />
      <Security />
      <FAQ />
      <Footer />
      <StickyCTA />
    </main>
  );
}
