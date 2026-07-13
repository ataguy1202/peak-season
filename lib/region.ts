// Peak Season — zip -> lat/lng + region resolution.

import type { Location, RegionKey } from "./types";

const ZIP_URL = "https://api.zippopotam.us/us";

const STATE_REGION: Record<string, RegionKey> = {
  ME: "northeast", NH: "northeast", VT: "northeast", MA: "northeast", RI: "northeast",
  CT: "northeast", NY: "northeast", NJ: "northeast", PA: "northeast",
  DE: "southeast", MD: "southeast", DC: "southeast", VA: "southeast", WV: "southeast",
  NC: "southeast", SC: "southeast", GA: "southeast", FL: "southeast", AL: "southeast",
  MS: "southeast", TN: "southeast", KY: "southeast", AR: "southeast", LA: "southeast",
  OH: "midwest", IN: "midwest", IL: "midwest", MI: "midwest", WI: "midwest",
  MN: "midwest", IA: "midwest", MO: "midwest", ND: "midwest", SD: "midwest",
  NE: "midwest", KS: "midwest",
  TX: "south", OK: "south",
  MT: "west", ID: "west", WY: "west", CO: "west", UT: "west", NV: "west",
  AZ: "west", NM: "west",
  CA: "pacific", OR: "pacific", WA: "pacific", AK: "pacific", HI: "pacific",
};

export async function resolveZip(zip: string): Promise<Location | null> {
  const z = zip.trim().match(/\b(\d{5})\b/)?.[1];
  if (!z) return null;
  try {
    const res = await fetch(`${ZIP_URL}/${z}`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const data = await res.json();
    const place = data?.places?.[0];
    if (!place) return null;
    const state = place["state abbreviation"] ?? null;
    const region: RegionKey = (state && STATE_REGION[state]) || "southeast";
    return {
      label: `${place["place name"]}, ${state} ${z}`,
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
      state,
      region,
    };
  } catch {
    return null;
  }
}
