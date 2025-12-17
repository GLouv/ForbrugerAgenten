"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useState } from "react";
import { DownloadModal } from "./DownloadModal";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <nav className="border-b border-slate-100 bg-white/90 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <BrandLogo className="w-9 h-9 shadow-sm group-hover:scale-105 transition-transform duration-300" />
            <span className="font-bold text-lg md:text-xl text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
              ForbrugerAgenten
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/hvordan-virker-det" className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors">
              Hvordan virker det?
            </Link>
            <Link href="/sikkerhed" className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors">
              Sikkerhed
            </Link>
            <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-blue-900 transition-colors">
              Support
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="cta" 
              size="sm" 
              className="bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20 shadow-md transition-all hover:translate-y-[-1px]"
              onClick={() => setIsModalOpen(true)}
            >
              Hent appen
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <button className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </>
  );
}

