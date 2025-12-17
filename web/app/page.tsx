import { Navbar } from "@/components/Navbar";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { Hero } from "@/components/Hero";
import { TrustLogos } from "@/components/TrustLogos";
import { Features } from "@/components/Features";
import { Security } from "@/components/Security";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <ComingSoonBanner />
      <Navbar />
      <Hero />
      <TrustLogos />
      <Features />
      <Security />
      <Footer />
    </main>
  );
}
