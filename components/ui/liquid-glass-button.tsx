"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LiquidButton — Apple-style frosted glass button (from a 21st.dev component).
 * Uses an SVG turbulence + displacement filter for the liquid-glass refraction.
 * Heavy filter, so use on a few CTAs, not everywhere. Light-theme tuned for
 * Compass (subtle dark inset edges over the cream background).
 */
export function LiquidButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-[1.03] outline-none",
        className,
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute inset-0 z-0 rounded-xl transition-all
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.4),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.35),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.25),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.25),inset_0_0_6px_6px_rgba(255,255,255,0.12),0_0_10px_rgba(255,255,255,0.25)]"
      />
      <span
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl"
        style={{ backdropFilter: 'url("#peak-glass")' }}
      />
      <span className="pointer-events-none relative z-10">{children}</span>
      <GlassFilter />
    </button>
  );
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="peak-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="60" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
