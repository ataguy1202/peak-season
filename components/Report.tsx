"use client";

import { motion } from "framer-motion";
import type { Report, Market } from "@/lib/types";

export function ReportView({ report }: { report: Report }) {
  const { location, monthName, inSeason, markets, marketsNote, actions } = report;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-7"
    >
      {/* In season */}
      <section className="card-premium lift p-7">
        <div className="mono text-[10px] uppercase tracking-[0.22em] text-leaf mb-1.5">
          in season now · {monthName} · {location.label}
        </div>
        <h2 className="display text-2xl md:text-3xl mb-6">What&apos;s ripe near you</h2>
        {inSeason.length === 0 ? (
          <p className="text-ink-muted">Seasonal data for this area is coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inSeason.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 rounded-2xl border border-line bg-paper/70 p-4 transition hover:border-leaf/40"
              >
                <span className="text-4xl shrink-0 leading-none">{p.emoji}</span>
                <div>
                  <div className="font-semibold text-ink">{p.name}</div>
                  <p className="text-sm text-ink-muted leading-snug mt-0.5">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Markets */}
      <section className="card-premium lift p-7">
        <h2 className="display text-2xl md:text-3xl mb-1.5">Markets near you</h2>
        <p className="text-sm text-ink-muted mb-6">
          Buy direct: fresher food, and more of your money reaches the grower.
        </p>

        {marketsNote ? (
          <p className="text-sm text-ink-muted bg-paper/70 rounded-2xl border border-line p-5 leading-relaxed">
            {marketsNote}
          </p>
        ) : (
          <div className="space-y-3">
            {markets.map((m, i) => (
              <MarketCard key={i} m={m} />
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="card-hero p-7">
        <h2 className="display text-xl md:text-2xl mb-5">This week</h2>
        <div className="space-y-3.5">
          {actions.map((a, i) => (
            <div key={i} className="flex gap-3.5">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-leaf text-paper text-sm shrink-0 mt-0.5 num">
                {i + 1}
              </span>
              <p className="text-sm text-ink-muted leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-ink-dim mono">
        Market data from OpenStreetMap. Seasonal produce from USDA and regional guides. Nothing saved.
      </p>
    </motion.div>
  );
}

function MarketCard({ m }: { m: Market }) {
  return (
    <div className="rounded-2xl border border-line bg-paper/70 p-4 transition hover:border-leaf/40 hover:bg-paper">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-ink flex items-center gap-2 flex-wrap">
            {m.name}
            {m.kind === "farmers" && (
              <span className="mono text-[9px] uppercase tracking-wide text-leaf bg-leaf/10 border border-leaf/25 px-1.5 py-0.5 rounded">
                farmers
              </span>
            )}
          </div>
          <div className="mt-1.5 space-y-1">
            {m.address && (
              <div className="text-[13px] text-ink-muted flex items-start gap-1.5">
                <span className="text-ink-dim">📍</span>
                <span>{m.address}</span>
              </div>
            )}
            {m.hours && (
              <div className="text-[13px] text-ink-muted flex items-center gap-1.5">
                <span className="text-ink-dim">🕐</span>
                <span>{m.hours}</span>
              </div>
            )}
            <div className="flex items-center gap-3 pt-0.5">
              {m.website && (
                <a
                  href={m.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-leaf hover:underline"
                >
                  website ↗
                </a>
              )}
              {m.phone && <span className="text-[12px] text-ink-dim mono">{m.phone}</span>}
            </div>
          </div>
        </div>
        {m.miles != null && (
          <div className="mono text-sm text-ink-muted shrink-0 text-right">
            {m.miles}
            <span className="text-ink-dim"> mi</span>
          </div>
        )}
      </div>
    </div>
  );
}
