"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brand } from "@/components/Brand";
import { ReportView } from "@/components/Report";
import { GlobeInteractive } from "@/components/ui/globe-interactive";
import { MetalButton } from "@/components/ui/metal-button";
import type { Report } from "@/lib/types";

const DEMOS = [
  { zip: "28202", label: "Charlotte, NC" },
  { zip: "94110", label: "San Francisco, CA" },
  { zip: "10025", label: "New York, NY" },
];

export default function Home() {
  const [zip, setZip] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (z: string) => {
    setError(null);
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ zip: z }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else setReport(data as Report);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 sm:px-8 pt-8 pb-28 max-w-3xl mx-auto">
      <nav className="flex items-center justify-between mb-10">
        <Brand />
        <a
          href="https://github.com/ataguy1202/peak-season"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink-muted hover:text-ink transition"
        >
          source ↗
        </a>
      </nav>

      {/* Hero — big globe centerpiece over the green-gold bloom */}
      <header className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-2"
        >
          <GlobeInteractive className="w-[300px] md:w-[360px]" />
        </motion.div>
        <p className="mono text-[10px] uppercase tracking-[0.2em] text-ink-dim mb-4">
          drag to spin · local food, everywhere
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="display text-5xl md:text-7xl leading-[1.02] tracking-tight mb-5"
        >
          Eat what's <span className="market-text">ripe</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-xl mx-auto"
        >
          Type your zip. See what's actually in season near you right now, and the farmers markets
          nearby, with real addresses. Fresher, cheaper, and your money reaches local farmers.
        </motion.p>
      </header>

      {/* Input card */}
      <div className="card-premium p-5 sm:p-6 mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (zip.trim()) run(zip.trim());
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Your zip code"
            className="flex-1 bg-paper/70 border border-line-strong rounded-xl py-3.5 px-4 text-ink text-lg placeholder:text-ink-dim focus:outline-none focus:border-leaf transition"
          />
          <MetalButton type="submit" variant="leaf" disabled={loading || !zip.trim()}>
            {loading ? "Looking…" : "Show me →"}
          </MetalButton>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-sm text-ink-dim mr-1">or try:</span>
          {DEMOS.map((d) => (
            <button
              key={d.zip}
              onClick={() => {
                setZip(d.zip);
                run(d.zip);
              }}
              disabled={loading}
              className="text-sm px-3.5 py-1.5 rounded-full border border-line bg-paper-2 hover:border-leaf hover:bg-paper text-ink-muted hover:text-ink transition disabled:opacity-50"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-tomato mb-4">{error}</p>}

      {report && <ReportView report={report} />}

      {!report && !loading && (
        <div className="mt-20 pt-12 border-t border-line text-center">
          <div className="mono text-[10px] uppercase tracking-[0.26em] text-ink-dim mb-3">
            why this exists
          </div>
          <h3 className="display text-2xl md:text-4xl tracking-tight leading-[1.15] max-w-xl mx-auto">
            Only about 15 cents of every grocery dollar reaches the farmer. At a market it is most of
            it, and the food was picked days ago, not weeks.
          </h3>
        </div>
      )}
    </div>
  );
}
