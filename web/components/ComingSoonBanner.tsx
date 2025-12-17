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
        className="bg-blue-600 text-white px-2 sm:px-4 py-2.5 relative cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="container mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium">
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
          <p className="flex-1 text-center leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="hidden md:inline">Billederne vist i appen er eksempler. Appen er under udvikling og kommer snart. </span>
            <span className="hidden sm:inline md:hidden">Appen under udvikling. </span>
            <span className="inline sm:hidden">Kommer snart. </span>
            <span className="opacity-90 font-normal underline decoration-blue-300 underline-offset-2">
               Få besked.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

