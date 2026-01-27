"use client";

import { useEffect, useState } from "react";
import { DownloadModal } from "./DownloadModal";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div 
        className={`fixed bottom-0 left-0 right-0 p-4 z-50 transition-all duration-300 md:hidden ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-3 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">ForbrugerAgenten</span>
            <span className="text-xs font-medium text-slate-600 line-clamp-1">Sikr dig de bedste priser nu</span>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
          >
            Hent appen
          </button>
        </div>
      </div>
    </>
  );
}

