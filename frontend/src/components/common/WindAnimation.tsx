import React from 'react'

/**
 * Calm, clean SVG-based air wind streamline animation.
 * Features flowing laminar air current curves and gentle floating breeze particles.
 * Designed to feel soothing and atmospheric without being flashy or distracting.
 */
export default function WindAnimation({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      <style>{`
        @keyframes windStream {
          0% {
            stroke-dashoffset: 800;
            opacity: 0;
          }
          15% {
            opacity: 0.65;
          }
          85% {
            opacity: 0.65;
          }
          100% {
            stroke-dashoffset: -800;
            opacity: 0;
          }
        }

        @keyframes breezeFloat {
          0% {
            transform: translateX(-10%) translateY(0px);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(110%) translateY(-15px);
            opacity: 0;
          }
        }

        .wind-path-1 {
          stroke-dasharray: 180 320;
          animation: windStream 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .wind-path-2 {
          stroke-dasharray: 240 380;
          animation: windStream 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 2.5s;
        }
        .wind-path-3 {
          stroke-dasharray: 140 260;
          animation: windStream 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 4.8s;
        }
        .wind-path-4 {
          stroke-dasharray: 200 350;
          animation: windStream 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 1.2s;
        }

        .particle-1 { animation: breezeFloat 11s linear infinite; animation-delay: 0s; }
        .particle-2 { animation: breezeFloat 14s linear infinite; animation-delay: 3.5s; }
        .particle-3 { animation: breezeFloat 9s linear infinite; animation-delay: 6s; }
        .particle-4 { animation: breezeFloat 16s linear infinite; animation-delay: 1.8s; }
      `}</style>

      {/* SVG Wind Streamlines */}
      <svg
        className="w-full h-full min-h-[320px] opacity-40 dark:opacity-35"
        viewBox="0 0 1440 360"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="windGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0" />
            <stop offset="35%" stop-color="#10b981" stop-opacity="0.7" />
            <stop offset="70%" stop-color="#38bdf8" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </linearGradient>

          <linearGradient id="windGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#059669" stop-opacity="0" />
            <stop offset="40%" stop-color="#34d399" stop-opacity="0.8" />
            <stop offset="80%" stop-color="#0284c7" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
          </linearGradient>
        </defs>

        {/* Streamline 1 (Upper gentle draft) */}
        <path
          d="M -100 70 C 250 40, 550 110, 850 65 C 1150 20, 1380 90, 1600 60"
          stroke="url(#windGrad1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="wind-path-1"
        />

        {/* Streamline 2 (Mid-level laminar flow) */}
        <path
          d="M -120 160 C 220 180, 520 120, 840 170 C 1120 210, 1380 140, 1620 155"
          stroke="url(#windGrad2)"
          strokeWidth="3"
          strokeLinecap="round"
          className="wind-path-2"
        />

        {/* Streamline 3 (Lower gentle breeze) */}
        <path
          d="M -80 250 C 260 220, 580 270, 900 230 C 1180 190, 1400 260, 1600 240"
          stroke="url(#windGrad1)"
          strokeWidth="2"
          strokeLinecap="round"
          className="wind-path-3"
        />

        {/* Streamline 4 (Deep ambient sweep) */}
        <path
          d="M -150 310 C 200 330, 600 290, 950 320 C 1220 345, 1450 300, 1650 315"
          stroke="url(#windGrad2)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="wind-path-4"
        />
      </svg>

      {/* Floating Gentle Breeze Particle Indicators */}
      <div className="absolute top-[22%] left-0 w-2 h-2 rounded-full bg-emerald-500/40 particle-1 blur-[0.5px]" />
      <div className="absolute top-[48%] left-0 w-2.5 h-2.5 rounded-full bg-sky-400/35 particle-2 blur-[0.5px]" />
      <div className="absolute top-[68%] left-0 w-1.5 h-1.5 rounded-full bg-emerald-400/40 particle-3 blur-[0.5px]" />
      <div className="absolute top-[82%] left-0 w-3 h-3 rounded-full bg-teal-400/30 particle-4 blur-[1px]" />
    </div>
  )
}
