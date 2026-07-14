// Peak Season — farmers market lookup via OpenStreetMap Overpass (keyless, open).
//
// Queries amenity=marketplace near a point. The tag is broad, so we score and
// label: names containing "farmers"/"farm" are marked kind:"farmers"; others
// are "market". We never fabricate — if OSM has nothing, we say so.

import type { Location, Market } from "./types";

// Multiple Overpass mirrors — the public one rate-limits and times out often,
// so we fail over between them before giving up.
const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
const UA = "PeakSeason/1.0 (local food finder)";

/** Thrown when every mirror fails, so the UI can say "try again" (not "none exist"). */
export class MarketLookupError extends Error {}

type OverpassEl = {
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function queryOverpass(q: string): Promise<OverpassEl[]> {
  let lastErr: unknown = null;
  // Free-tier serverless functions cap at ~10s total, so each mirror gets a
  // tight budget and we try at most two before giving up gracefully.
  for (const url of OVERPASS_MIRRORS.slice(0, 2)) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ data: q }).toString(),
        signal: AbortSignal.timeout(6500),
      });
      if (!res.ok) {
        lastErr = new Error(`Overpass ${res.status}`);
        continue;
      }
      const data = await res.json();
      return data.elements ?? [];
    } catch (e) {
      lastErr = e;
      // try next mirror
    }
  }
  throw new MarketLookupError(`All Overpass mirrors failed: ${String(lastErr)}`);
}

export async function findMarkets(loc: Location, radiusM = 25000): Promise<Market[]> {
  const q =
    `[out:json][timeout:8];(` +
    `node["amenity"="marketplace"](around:${radiusM},${loc.lat},${loc.lng});` +
    `way["amenity"="marketplace"](around:${radiusM},${loc.lat},${loc.lng});` +
    `);out center 40;`;
  {
    // Query with mirror failover; MarketLookupError propagates to the route.
    const els: OverpassEl[] = await queryOverpass(q);

    const markets: Market[] = [];
    for (const e of els) {
      const t = e.tags ?? {};
      const name = t.name;
      if (!name) continue; // unnamed marketplaces aren't useful to show
      const lat = e.lat ?? e.center?.lat;
      const lng = e.lon ?? e.center?.lon;
      if (lat == null || lng == null) continue;

      const lower = name.toLowerCase();
      // Broadened detection: catches "Greenmarket" (NYC), growers markets, farm
      // stands, and anything tagged with produce.
      const isFarmers =
        lower.includes("farmers") ||
        lower.includes("farmer's") ||
        lower.includes("farm market") ||
        lower.includes("farm stand") ||
        lower.includes("greenmarket") ||
        lower.includes("green market") ||
        lower.includes("growers") ||
        lower.includes("produce") ||
        t.produce != null;

      // Assemble a street address from OSM addr:* tags when present.
      const addrParts = [
        [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" "),
        t["addr:city"],
        t["addr:postcode"],
      ].filter((p) => p && p.trim());
      const address = addrParts.length ? addrParts.join(", ") : null;

      markets.push({
        name,
        kind: isFarmers ? "farmers" : "market",
        miles: haversineMiles(loc.lat, loc.lng, lat, lng),
        hours: t.opening_hours ?? null,
        address,
        website: t.website ?? t["contact:website"] ?? null,
        phone: t.phone ?? t["contact:phone"] ?? null,
        lat,
        lng,
      });
    }

    // Farmers markets first, then by distance.
    markets.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "farmers" ? -1 : 1;
      return (a.miles ?? 999) - (b.miles ?? 999);
    });
    return markets.slice(0, 10);
  }
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
