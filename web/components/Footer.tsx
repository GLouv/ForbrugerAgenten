"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { DownloadModal } from "./DownloadModal";
import { useState } from "react";

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            
            <div className="max-w-sm">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <BrandLogo className="w-8 h-8" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">ForbrugerAgenten</span>
              </Link>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Vi er din automatiske forbrugs-vagthund. Vi overvåger markedet og dine regninger, så du undgår overpris.
              </p>
              <div className="flex gap-3">
                {/* App Store Badge */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative h-[40px] w-[135px] overflow-hidden rounded-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Download on the App Store"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                    alt="Download on the App Store" 
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </button>
                
                {/* Google Play Badge */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative h-[40px] w-[135px] overflow-hidden rounded-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Get it on Google Play"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play" 
                      className="min-w-[145px] h-auto max-w-none transform scale-[1.08]"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full md:w-auto">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Produkt</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><Link href="/hvordan-virker-det" className="hover:text-blue-900 transition-colors">Hvordan virker det?</Link></li>
                  <li><Link href="/sikkerhed" className="hover:text-blue-900 transition-colors">Sikkerhed</Link></li>
                  <li><Link href="/support" className="hover:text-blue-900 transition-colors">Hjælp & Support</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Virksomhed</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><Link href="/om-os" className="hover:text-blue-900 transition-colors">Om os</Link></li>
                  <li><Link href="/kontakt" className="hover:text-blue-900 transition-colors">Kontakt</Link></li>
                  <li><Link href="/presse" className="hover:text-blue-900 transition-colors">Presse</Link></li>
                </ul>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="font-semibold text-slate-900 mb-4">Juridisk</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li><Link href="/privatlivspolitik" className="hover:text-blue-900 transition-colors">Privatlivspolitik</Link></li>
                  <li><Link href="/betingelser" className="hover:text-blue-900 transition-colors">Handelsbetingelser</Link></li>
                  <li><Link href="/cookies" className="hover:text-blue-900 transition-colors">Cookies</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 gap-4">
            <p>© 2025 ForbrugerAgenten ApS.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <p>Dansk server-infrastruktur 🇩🇰</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
