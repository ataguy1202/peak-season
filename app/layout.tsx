import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://peakseason.app"),
  title: "Peak Season — eat what's ripe, buy it local",
  description:
    "Type your zip and see what's actually in season near you right now, plus the farmers markets nearby. Fresher food, lower prices, and your money reaching real local farmers. Free.",
  openGraph: {
    title: "Peak Season — eat what's ripe, buy it local",
    description: "What's in season near you right now + the farmers markets nearby. Free.",
    type: "website",
    siteName: "Peak Season",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peak Season — eat what's ripe, buy it local",
    description: "What's in season near you + farmers markets nearby. Free.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <div className="ambient-bg" aria-hidden />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
