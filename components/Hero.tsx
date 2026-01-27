"use client";

import { ShieldCheck } from "lucide-react";
import { DownloadModal } from "./DownloadModal";
import { Iphone16Pro } from "./ui/Iphone16Pro";
import { useState } from "react";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    <section className="pt-10 pb-10 md:pt-24 md:pb-20 overflow-hidden bg-slate-50 border-b border-blue-100">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 h-full">
          
          {/* Text Content */}
          <div className="flex-1 max-w-xl space-y-6 md:space-y-8 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-[10px] md:text-xs font-medium border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Aktiv pris-overvågning
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Vi sikrer dig markedets <span className="text-blue-900">bedste priser</span>.
              <br className="hidden md:block"/> Automatisk.
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 leading-relaxed max-w-md mx-auto md:mx-0">
              ForbrugerAgenten overvåger dine faste udgifter og forhandler nye aftaler for dig. Vi finder besparelsen – du skal bare godkende.
            </p>

            <div className="flex flex-row items-center gap-3 justify-center md:justify-start">
              {/* App Store Badge - Optimized for mobile row */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative h-[40px] md:h-[50px] w-[130px] md:w-[165px] overflow-hidden rounded-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Download on the App Store"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </button>
              
              {/* Google Play Badge - Optimized for mobile row */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative h-[40px] md:h-[50px] w-[130px] md:w-[165px] overflow-hidden rounded-lg transition-transform hover:scale-105 active:scale-95"
                aria-label="Get it on Google Play"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                    alt="Get it on Google Play" 
                    className="min-w-[140px] md:min-w-[178px] h-auto max-w-none transform scale-[1.08]" 
                  />
                </div>
              </button>
            </div>

            <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Sikker oprettelse med MitID
            </p>
          </div>

          {/* Visual: Phone Mockup - iPhone 16 Pro with Lightswind component */}
          <div className="flex-1 w-full flex justify-center md:justify-end relative mt-8 md:mt-0">
            <div className="relative z-10 w-full max-w-[240px] sm:max-w-[280px] md:max-w-[360px] max-h-[60vh] md:max-h-[80vh]">
              <Iphone16Pro
                width={100}
                height={100}
                frameColor="#0a0a0a"
                screenColor="transparent"
                showDynamicIsland={true}
                className="drop-shadow-2xl" // Moved shadow here to follow SVG shape instead of container box
              >
                {/* App Content Inside Phone */}
                <div className="w-full h-full flex flex-col bg-white relative rounded-[2.5px] overflow-hidden" style={{ fontSize: '3.2px' }}>
                  {/* Status Bar - Positioned alongside Dynamic Island - Official SF Symbols Geometry */}
                  <div className="absolute top-[5.6px] left-0 w-full h-[3px] flex items-center justify-between px-[5.5px] z-30 pointer-events-none text-white">
                    {/* Time - SF Pro Semibold - Vertically Aligned with Icons */}
                    <div className="font-semibold tracking-normal leading-none pt-[0.2px]" style={{ fontSize: '2.4px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>09:41</div>
                    
                    {/* iOS System Icons (SF Symbols) - Corrected Paths */}
                    <div className="flex gap-[1.2px] items-center h-full">
                      {/* Cellular Signal - 4 Solid Bars */}
                      <svg width="2.8" height="1.8" viewBox="0 0 17 11" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1.5 11C1.77614 11 2 10.7761 2 10.5V7.5C2 7.22386 1.77614 7 1.5 7C1.22386 7 1 7.22386 1 7.5V10.5C1 10.7761 1.22386 11 1.5 11Z" />
                         <path d="M6 11C6.27614 11 6.5 10.7761 6.5 10.5V5.5C6.5 5.22386 6.27614 5 6 5C5.72386 5 5.5 5.22386 5.5 5.5V10.5C5.5 10.7761 5.72386 11 6 11Z" />
                         <path d="M10.5 11C10.7761 11 11 10.7761 11 10.5V3.5C11 3.22386 10.7761 3 10.5 3C10.2239 3 10 3.22386 10 3.5V10.5C10 10.7761 10.2239 11 10.5 11Z" />
                         <path d="M15 11C15.2761 11 15.5 10.7761 15.5 10.5V1.5C15.5 1.22386 15.2761 1 15 1C14.7239 1 14.5 1.22386 14.5 1.5V10.5C14.5 10.7761 14.7239 11 15 11Z" />
                      </svg>

                      {/* Wifi - 3 Distinct Arcs */}
                      <svg width="2.8" height="1.8" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 12C8.36 12 8.68 11.83 8.9 11.56L14.7 4.2C14.9 3.96 14.9 3.61 14.68 3.39C12.87 1.61 10.55 0.5 8 0.5C5.45 0.5 3.13 1.61 1.32 3.39C1.1 3.61 1.1 3.96 1.3 4.2L7.1 11.56C7.32 11.83 7.64 12 8 12Z" />
                      </svg>

                      {/* Battery - Solid White, No Opacity, Exact Shape */}
                      <svg width="4" height="1.8" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <rect x="0.75" y="0.75" width="20.5" height="10.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
                         <path d="M23 4H23.5C24.3284 4 25 4.67157 25 5.5V6.5C25 7.32843 24.3284 8 23.5 8H23V4Z" fill="currentColor" />
                         <rect x="3" y="3" width="16" height="6" rx="1" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* App Header - Full bleed to top, massive top padding to clear Dynamic Island area completely */}
                  <div className="bg-blue-900 px-[2.5px] pt-[20px] pb-[4px] text-white shrink-0 relative z-10 -mt-[10px]">
                    <div className="flex justify-between items-center mb-[1.5px]">
                       <span className="font-medium text-blue-200 uppercase tracking-wider" style={{ fontSize: '2.8px' }}>Din Oversigt</span>
                       <div className="w-[3px] h-[3px] bg-blue-800 rounded-full flex items-center justify-center font-bold" style={{ fontSize: '1.8px' }}>PH</div>
                    </div>
                    <h2 className="font-bold leading-tight" style={{ fontSize: '6px' }}>Du sparer penge.</h2>
                    <p className="text-blue-200 mt-[0.5px] font-medium" style={{ fontSize: '3.2px' }}>2 aftaler er optimeret.</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-slate-50 -mt-[1.5px] rounded-t-[1.5px] relative overflow-hidden z-10">
                    <div className="p-[1.5px] space-y-[1.5px] h-full overflow-y-auto pb-[10px]">
                        {/* Notification Pop (Simulated) */}
                        <div className="bg-white p-[1.8px] rounded-[1.2px] shadow-sm border border-blue-50/50">
                           <div className="flex items-center gap-[1px] mb-[1.8px]">
                             <div className="w-[2.5px] h-[2.5px] bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                               <ShieldCheck style={{ width: '1.4px', height: '1.4px' }} strokeWidth={2.5} />
                             </div>
                             <div>
                                <span className="font-bold text-slate-400 uppercase tracking-wide block" style={{ fontSize: '2.2px' }}>Besparelse fundet</span>
                                <div className="font-bold text-slate-900 leading-none" style={{ fontSize: '3.5px' }}>Norlys El-aftale</div>
                             </div>
                           </div>
                           <div className="text-slate-600 mb-[1.5px] leading-relaxed font-medium" style={{ fontSize: '3.2px' }}>
                             Vi kan flytte dig til en aftale, der er <span className="font-bold text-green-600">89 kr. billigere</span> pr. måned.
                           </div>
                           <div className="flex gap-[1px]">
                              <div className="flex-1 bg-blue-900 text-white font-semibold py-[1px] rounded-[0.8px] text-center shadow-sm" style={{ fontSize: '3.2px' }}>Godkend</div>
                              <div className="flex-1 bg-slate-100 text-slate-600 font-semibold py-[1px] rounded-[0.8px] text-center" style={{ fontSize: '3.2px' }}>Afvis</div>
                           </div>
                        </div>

                        {/* Active Scan Card */}
                        <div className="bg-white p-[1.8px] rounded-[1.2px] shadow-sm border border-slate-100 opacity-60 grayscale">
                          <div className="flex items-center gap-[1.5px]">
                             <div className="w-[3.5px] h-[3.5px] rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                               <span style={{ fontSize: '5px' }}>📱</span>
                             </div>
                             <div>
                               <h3 className="font-semibold text-slate-900 leading-tight" style={{ fontSize: '3.5px' }}>Telenor Mobil</h3>
                               <p className="text-slate-400 mt-[0.2px] font-medium" style={{ fontSize: '2.8px' }}>Analyse i gang...</p>
                             </div>
                          </div>
                        </div>
                        
                        {/* More Content Filler for scroll demo */}
                        <div className="bg-white p-[1.8px] rounded-[1.2px] shadow-sm border border-slate-100 opacity-40 grayscale">
                          <div className="flex items-center gap-[1.5px]">
                             <div className="w-[3.5px] h-[3.5px] rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                               <span style={{ fontSize: '5px' }}>💡</span>
                             </div>
                             <div>
                               <h3 className="font-semibold text-slate-900 leading-tight" style={{ fontSize: '3.5px' }}>Energi Check</h3>
                               <p className="text-slate-400 mt-[0.2px] font-medium" style={{ fontSize: '2.8px' }}>Kommer snart...</p>
                             </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </Iphone16Pro>
            </div>
            
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

