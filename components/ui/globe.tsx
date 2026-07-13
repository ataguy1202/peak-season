"use client";

/**
 * Globe — a large, premium, self-contained Earth (no external image).
 *
 * Layered for realism:
 *   - ocean sphere with radial depth shading
 *   - rotating continent silhouettes (simplified real world landmasses),
 *     seamlessly looping via a duplicated map strip masked to a circle
 *   - atmospheric rim glow (blue limb light)
 *   - day/night terminator shading + a soft specular highlight
 *   - a tilted orbit ring with a drifting satellite dot
 *   - parallax twinkling stars
 *
 * Respects prefers-reduced-motion (spin + orbit slow to a near stop).
 */
export default function Globe({ size = 340 }: { size?: number }) {
  const strip = size * 2; // the continent map is 2x wide, scrolled 1 full loop

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size * 1.5, height: size * 1.5 }}
      aria-hidden
    >
      <style>{`
        @keyframes ps-spin { from { transform: translateX(0); } to { transform: translateX(-${size}px); } }
        @keyframes ps-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ps-twinkle { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ps-spin { animation-duration: 400s !important; }
          .ps-orbit { animation-duration: 600s !important; }
        }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: s.r,
            height: s.r,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: 0.4,
            animation: `ps-twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.3}s infinite`,
            boxShadow: "0 0 4px rgba(255,255,255,0.6)",
          }}
        />
      ))}

      {/* Atmosphere glow behind the planet */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.28,
          height: size * 1.28,
          background:
            "radial-gradient(circle, hsl(200 80% 62% / 0.35) 62%, hsl(200 80% 62% / 0.12) 72%, transparent 78%)",
          filter: "blur(6px)",
        }}
      />

      {/* The planet */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(120% 120% at 32% 28%, #2b7fc4 0%, #1f5f9c 42%, #123f6e 72%, #0b2748 100%)",
          boxShadow:
            "inset -18px -12px 40px rgba(0,0,0,0.55), inset 14px 10px 30px rgba(160,215,255,0.25)",
        }}
      >
        {/* rotating continents: a 2x-wide strip scrolled one planet-width, looped */}
        <div
          className="ps-spin absolute top-0 left-0 h-full"
          style={{ width: strip, animation: "ps-spin 44s linear infinite" }}
        >
          <ContinentStrip width={strip} height={size} />
        </div>

        {/* day/night terminator */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 44%, rgba(4,12,28,0.28) 64%, rgba(2,8,20,0.6) 100%)",
          }}
        />
        {/* specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size * 0.5,
            height: size * 0.32,
            left: size * 0.14,
            top: size * 0.12,
            background: "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent)",
            filter: "blur(4px)",
          }}
        />
        {/* inner rim light */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 3px 2px 6px rgba(180,225,255,0.4)" }}
        />
      </div>

      {/* Tilted orbit ring + satellite dot */}
      <div
        className="ps-orbit absolute"
        style={{
          width: size * 1.32,
          height: size * 1.32,
          transform: "rotateX(74deg) rotateZ(0deg)",
          transformStyle: "preserve-3d",
          animation: "ps-orbit 18s linear infinite",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid hsl(30 88% 55% / 0.45)", boxShadow: "0 0 12px hsl(30 88% 55% / 0.25)" }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 9,
            height: 9,
            top: -4.5,
            left: "50%",
            marginLeft: -4.5,
            background: "hsl(30 90% 58%)",
            boxShadow: "0 0 10px hsl(30 90% 58%)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * ContinentStrip — draws a simplified world map twice, side by side, so the
 * scrolling loop is seamless. Landmasses are green; rendered as an SVG at the
 * strip's dimensions.
 */
function ContinentStrip({ width, height }: { width: number; height: number }) {
  const half = width / 2;
  return (
    <svg width={width} height={height} viewBox="0 0 720 360" preserveAspectRatio="none" style={{ width, height }}>
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fa35a" />
          <stop offset="100%" stopColor="#2f7d43" />
        </linearGradient>
      </defs>
      {/* two copies offset by 360 (half of 720) for the seamless loop */}
      <g fill="url(#land)" opacity="0.92">
        <WorldPaths />
        <g transform="translate(360,0)">
          <WorldPaths />
        </g>
      </g>
    </svg>
  );
}

/** Simplified continent silhouettes on a 360x360 tile (repeats every 360). */
function WorldPaths() {
  return (
    <>
      {/* North America */}
      <path d="M35 70 Q60 50 95 60 Q120 68 130 95 L120 130 Q100 150 80 145 L60 120 Q40 110 35 90 Z" />
      {/* South America */}
      <path d="M110 175 Q130 165 140 190 Q145 230 125 270 Q112 290 105 260 Q98 220 105 190 Z" />
      {/* Europe */}
      <path d="M175 75 Q200 65 215 78 Q210 100 190 105 Q175 98 175 82 Z" />
      {/* Africa */}
      <path d="M185 120 Q215 110 230 135 Q235 180 210 220 Q195 235 185 205 Q178 165 182 135 Z" />
      {/* Asia */}
      <path d="M225 70 Q285 55 330 78 Q345 100 320 120 Q270 130 235 110 Q222 92 225 78 Z" />
      {/* Southeast Asia / India nub */}
      <path d="M270 125 Q295 122 300 145 Q290 165 272 158 Q262 142 270 128 Z" />
      {/* Australia */}
      <path d="M300 240 Q335 230 350 252 Q345 278 315 280 Q295 268 298 250 Z" />
    </>
  );
}

const STARS = [
  { x: 6, y: 20, r: 2 }, { x: 92, y: 30, r: 2 }, { x: 18, y: 82, r: 1.5 },
  { x: 80, y: 76, r: 2.5 }, { x: 50, y: 6, r: 1.5 }, { x: 12, y: 50, r: 1.5 },
  { x: 88, y: 55, r: 2 }, { x: 70, y: 12, r: 1.5 }, { x: 30, y: 90, r: 2 },
  { x: 60, y: 88, r: 1.5 },
];
