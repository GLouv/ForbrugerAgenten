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
        className="bg-blue-600 text-white px-4 py-2.5 relative cursor-pointer hover:bg-blue-700 transition-colors overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="container mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-medium whitespace-nowrap">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <p className="truncate">
            <span className="hidden sm:inline">Billederne vist i appen er eksempler. Appen er under udvikling og kommer snart. </span>
            <span className="sm:hidden">Appen kommer snart. </span>
            <span className="opacity-90 font-normal underline decoration-blue-300 underline-offset-2">
               Skriv dig op til lancering.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

