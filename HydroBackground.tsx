/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function HydroBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-50 overflow-hidden pointer-events-none">
      
      {/* Groundwater / Aquifer abstract gradient blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[60%] h-[50%] bg-sky-200/20 blur-[100px] rounded-full mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[60%] bg-indigo-200/20 blur-[130px] rounded-full mix-blend-multiply" />
      <div className="absolute top-[60%] left-[20%] w-[50%] h-[40%] bg-teal-200/20 blur-[120px] rounded-full mix-blend-multiply" />
      
      {/* Geological Strata SVG overlay */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.25]" 
        preserveAspectRatio="none" 
        viewBox="0 0 1000 1000" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Soil Layer */}
        <path d="M0,150 C300,250 700,100 1000,200 L1000,0 L0,0 Z" fill="#f8fafc" />
        <path d="M0,150 C300,250 700,100 1000,200" stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
        <path d="M0,165 C300,265 700,115 1000,215" stroke="#94a3b8" strokeWidth="0.5" strokeOpacity="0.4" fill="none" />
        <path d="M0,180 C300,280 700,130 1000,230" stroke="#94a3b8" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />

        {/* Weathered Zone / Permeable Strata */}
        <path d="M0,350 C350,300 650,450 1000,350" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
        <path d="M0,365 C350,315 650,465 1000,365" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
        <path d="M0,380 C350,330 650,480 1000,380" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        <path d="M0,395 C350,345 650,495 1000,395" stroke="#0ea5e9" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />

        {/* Fractured Aquifer Zone (Water bearing) */}
        <path d="M0,600 C400,700 800,450 1000,550" stroke="#6366f1" strokeWidth="2" strokeOpacity="0.4" fill="none" />
        <path d="M0,620 C400,720 800,470 1000,570" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        <path d="M0,640 C400,740 800,490 1000,590" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        <path d="M0,660 C400,760 800,510 1000,610" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />

        {/* Hardrock Bedrock Basement */}
        <path d="M0,850 C300,900 600,800 1000,880" stroke="#334155" strokeWidth="2" strokeOpacity="0.3" fill="none" />
        <path d="M0,870 C300,920 600,820 1000,900" stroke="#334155" strokeWidth="1" strokeOpacity="0.2" fill="none" />
        <path d="M0,890 C300,940 600,840 1000,920" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />

        {/* Vertical Borewell/Percolation Shaft suggestions (dash lines) */}
        <path d="M250,150 L250,650" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 6" strokeOpacity="0.15" fill="none" />
        <path d="M800,100 L800,850" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="4 6" strokeOpacity="0.15" fill="none" />
      </svg>
      
      {/* Light dot grid to mimic structural grid / coordinates */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
