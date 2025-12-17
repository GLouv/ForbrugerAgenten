"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DownloadIOS() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual App Store URL
    const appStoreUrl = "https://apps.apple.com/dk/app/placeholder"; 
    
    // Simulate redirect delay or check logic
    const timer = setTimeout(() => {
       // window.location.href = appStoreUrl;
       alert("App Store link not active yet. Redirecting home.");
       router.push("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center flex-col text-white">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <h1 className="text-xl font-medium">Åbner App Store...</h1>
    </div>
  );
}


