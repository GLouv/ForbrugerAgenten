"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DownloadAndroid() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual Play Store URL
    const playStoreUrl = "https://play.google.com/store/apps/details?id=placeholder";
    
    const timer = setTimeout(() => {
       // window.location.href = playStoreUrl;
       alert("Google Play link not active yet. Redirecting home.");
       router.push("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col text-white">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <h1 className="text-xl font-medium">Åbner Google Play...</h1>
    </div>
  );
}

