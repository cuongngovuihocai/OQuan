import React from 'react';

export const FolkPaperBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#f6ebd7] text-[#4a2e1b] font-sans overflow-x-hidden selection:bg-[#e29d62] selection:text-white">
      {/* Paper Texture Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40 z-0 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(#cbb087 1px, transparent 0), radial-gradient(#d3be9c 1px, #f6ebd7 0)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      {/* Folk Art Decorative Landscape Background (Water, Hills, Clouds, Bamboo) */}
      <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-25 z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdf8ed" />
            <stop offset="50%" stopColor="#f4e4c1" />
            <stop offset="100%" stopColor="#ebd6a9" />
          </linearGradient>
          <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3b899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#69825b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78a1bb" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#5b88a5" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Rolling Folk Hills at top */}
        <path d="M0,80 Q200,20 400,60 T800,40 T1200,70 T1600,30 L1600,0 L0,0 Z" fill="url(#hillGrad1)" />
        
        {/* Winding River at bottom */}
        <path d="M0,850 Q300,750 600,820 T1200,780 T1600,850 L1600,1000 L0,1000 Z" fill="url(#riverGrad)" />

        {/* Cloud Motifs (Traditional Vietnamese Tranh Dân Gian Style) */}
        <g stroke="#8d6e4c" strokeWidth="1.5" fill="none" opacity="0.4">
          <path d="M100,120 Q120,100 140,120 T180,120 Q190,140 170,150 T110,140 Z" />
          <path d="M1200,100 Q1220,80 1240,100 T1280,100 Q1290,120 1270,130 T1210,120 Z" />
          <path d="M800,880 Q820,860 840,880 T880,880 Q890,900 870,910 T810,900 Z" />
        </g>
      </svg>

      {/* Decorative Border Frame */}
      <div className="pointer-events-none fixed inset-2 sm:inset-4 border-2 border-[#b88e5d]/40 rounded-2xl z-10" />

      <div className="relative z-20 max-w-6xl mx-auto px-3 py-2.5 sm:px-6 sm:py-4 short-landscape-wrapper">
        {children}
      </div>
    </div>
  );
};
