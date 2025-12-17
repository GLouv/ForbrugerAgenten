"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { DownloadModal } from "./DownloadModal";

export function ComingSoonBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div 
        className="bg-blue-600 text-white px-4 py-3 relative cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left text-sm font-medium">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>
            Billederne vist i appen er eksempler. Appen er under udvikling og kommer snart. 
            <span className="opacity-90 font-normal ml-1 underline decoration-blue-300 underline-offset-2">
               Skriv dig op til at få besked ved lancering.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}


