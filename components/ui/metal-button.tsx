"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MetalButton — premium gradient metal button (from a 21st.dev component).
 * Press + hover states, shine sweep, touch detection, Apple-style 250ms easing.
 * Compass uses the `gold` variant as its primary CTA to match the growth accent.
 */
type ColorVariant = "default" | "gold" | "leaf";

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}

const colorVariants: Record<
  ColorVariant,
  { outer: string; inner: string; button: string; textColor: string; textShadow: string }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#FAFAFA] via-[#3E3E3E] to-[#E5E5E5]",
    button: "bg-gradient-to-b from-[#B9B9B9] to-[#969696]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(80_80_80_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#4a3a00]",
    textShadow: "[text-shadow:_0_1px_0_rgb(255_248_200_/_70%)]",
  },
  leaf: {
    outer: "bg-gradient-to-b from-[#1e4d20] to-[#8fce8f]",
    inner: "bg-gradient-to-b from-[#eaf8ea] via-[#173d19] to-[#dbf0db]",
    button: "bg-gradient-to-b from-[#a9dea9] to-[#3d7d3f]",
    textColor: "text-[#f2fbf2]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(20_50_22_/_100%)]",
  },
};

const easing = "all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)";

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTouch, setIsTouch] = React.useState(false);
    React.useEffect(() => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);

    const c = colorVariants[variant];

    return (
      <div
        className={cn("relative inline-flex transform-gpu rounded-xl p-[1.25px] will-change-transform", c.outer)}
        style={{
          transform: isPressed ? "translateY(2px) scale(0.99)" : "translateY(0) scale(1)",
          boxShadow: isPressed
            ? "0 1px 2px rgba(0,0,0,0.15)"
            : isHovered && !isTouch
              ? "0 8px 22px rgba(0,0,0,0.14)"
              : "0 4px 12px rgba(0,0,0,0.09)",
          transition: easing,
        }}
      >
        <div
          className={cn("pointer-events-none absolute inset-[1px] transform-gpu rounded-[11px] will-change-transform", c.inner)}
          style={{ transition: easing, filter: isHovered && !isPressed && !isTouch ? "brightness(1.05)" : "none" }}
        />
        <button
          ref={ref}
          className={cn(
            "relative z-10 m-[1px] inline-flex h-12 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-[10px] px-8 text-sm leading-none font-semibold will-change-transform outline-none",
            c.button,
            c.textColor,
            c.textShadow,
            className,
          )}
          style={{
            transform: isPressed ? "scale(0.97)" : "scale(1)",
            transition: easing,
            filter: isHovered && !isPressed && !isTouch ? "brightness(1.02)" : "none",
          }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => {
            setIsPressed(false);
            setIsHovered(false);
          }}
          onMouseEnter={() => !isTouch && setIsHovered(true)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none absolute inset-0 z-20 overflow-hidden transition-opacity duration-300",
              isPressed ? "opacity-20" : "opacity-0",
            )}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
          </span>
          {children}
          {isHovered && !isPressed && !isTouch && (
            <span className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-t from-transparent to-white/10" />
          )}
        </button>
      </div>
    );
  },
);
MetalButton.displayName = "MetalButton";
