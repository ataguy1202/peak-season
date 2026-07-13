// Peak Season — lookup API. Resolves a zip, finds nearby markets (OSM), and
// returns in-season produce for the current month + region. Keyless, nothing
// stored.

import { NextResponse } from "next/server";
import { resolveZip } from "@/lib/region";
import { buildReport } from "@/lib/report";
import { MarketLookupError } from "@/lib/markets";

export const maxDuration = 25;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const zip = String(body.zip ?? "").trim();
    if (!zip) return NextResponse.json({ error: "Enter a 5-digit zip." }, { status: 400 });

    const loc = await resolveZip(zip);
    if (!loc) return NextResponse.json({ error: "We couldn't find that zip." }, { status: 404 });

    // Month can be overridden for demos; defaults to the real current month.
    const month =
      Number(body.month) >= 1 && Number(body.month) <= 12
        ? Number(body.month)
        : new Date().getMonth() + 1;

    const report = await buildReport(loc, month);
    return NextResponse.json(report);
  } catch (e) {
    // Distinguish "market service is busy, retry" from a real failure so the UI
    // never wrongly implies an area has no markets.
    if (e instanceof MarketLookupError) {
      return NextResponse.json(
        { error: "The market map is busy right now. Give it a few seconds and try again." },
        { status: 503 },
      );
    }
    const msg = (e as Error).message ?? String(e);
    return NextResponse.json({ error: `Something went wrong. ${msg}` }, { status: 500 });
  }
}
