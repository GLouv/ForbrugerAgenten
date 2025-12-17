import React from "react";

export function BrandLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ForbrugerAgenten Logo"
    >
      {/* Background: Squircle (App Icon shape) - Trust Blue */}
      <rect x="0" y="0" width="100" height="100" rx="24" fill="#1e3a8a" />
      
      {/* The F: Constructed from geometric bars. Bold, Stable, Modern. */}
      {/* Vertical Stem */}
      <rect x="32" y="25" width="14" height="50" rx="4" fill="white" />
      
      {/* Top Bar */}
      <rect x="32" y="25" width="40" height="14" rx="4" fill="white" />
      
      {/* Middle Bar (Slightly shorter for dynamic look) */}
      <rect x="32" y="48" width="32" height="14" rx="4" fill="white" />
      
      {/* Subtle Dot/Accent in the corner (Optional "Notification" signal) - darker blue for depth */}
      {/* <circle cx="78" cy="22" r="6" fill="#3b82f6" /> */}
    </svg>
  );
}


