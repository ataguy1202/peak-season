"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

/**
 * GlobeInteractive — premium WebGL globe (cobe), drag to spin. Adapted from a
 * 21st.dev component and retuned for Peak Season: a warm, light Earth with
 * green harvest markers instead of the original blue "users" theme. Markers sit
 * on real US food-producing regions to reinforce "local food, everywhere."
 */

interface FoodMarker {
  id: string;
  location: [number, number];
  name: string;
}

const FOOD_MARKERS: FoodMarker[] = [
  { id: "clt", location: [35.23, -80.84], name: "Carolinas" },
  { id: "ca", location: [36.78, -119.42], name: "Central Valley" },
  { id: "pnw", location: [45.52, -122.68], name: "Willamette" },
  { id: "mw", location: [41.88, -93.1], name: "Midwest" },
  { id: "ne", location: [42.36, -72.6], name: "New England" },
  { id: "tx", location: [30.27, -97.74], name: "Texas Hill" },
  { id: "fl", location: [27.99, -81.76], name: "Florida" },
];

export function GlobeInteractive({
  className = "",
  speed = 0.0028,
}: {
  className?: string;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId: number;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.25,
        dark: 0,
        diffuse: 1.4,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.96, 0.95, 0.9], // warm cream land
        markerColor: [0.24, 0.55, 0.28], // leaf green markers
        glowColor: [0.9, 0.86, 0.72], // soft warm halo
        markerElevation: 0,
        markers: FOOD_MARKERS.map((m) => ({ location: m.location, size: 0.045 })),
        opacity: 0.92,
      });

      const animate = () => {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.25 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      };
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) init();
    else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
    };
  }, [speed]);

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          contain: "layout paint size",
          touchAction: "none",
        }}
      />
    </div>
  );
}
