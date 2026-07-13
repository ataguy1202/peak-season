import { ImageResponse } from "next/og";

export const alt = "Peak Season — eat what's ripe, buy it local";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px", backgroundColor: "#f7f4ea",
          backgroundImage:
            "radial-gradient(900px 520px at 86% -12%, rgba(230,150,30,0.16), transparent), radial-gradient(700px 460px at 4% 20%, rgba(50,140,60,0.13), transparent)",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#3a7a2f", marginBottom: 20 }}>
          Free · local food finder
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#1c2a17", lineHeight: 1.02, letterSpacing: -2 }}>
          Eat what's <span style={{ color: "#d98324" }}>ripe.</span>
        </div>
        <div style={{ fontSize: 32, color: "#3c4a34", marginTop: 30, maxWidth: 940, lineHeight: 1.3 }}>
          What's in season near you right now, and the farmers markets nearby. Fresher, cheaper, and
          your money reaches real local farmers. 🧺🍅🌽
        </div>
      </div>
    ),
    { ...size },
  );
}
