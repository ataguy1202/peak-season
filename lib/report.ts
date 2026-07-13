// Peak Season — report builder.

import type { Location, Report } from "./types";
import { inSeason } from "./seasonal";
import { findMarkets } from "./markets";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export async function buildReport(loc: Location, month: number): Promise<Report> {
  const inSeasonList = inSeason(loc.region, month);
  const markets = await findMarkets(loc);

  const marketsNote =
    markets.length === 0
      ? "We couldn't find a farmers market mapped near this zip. The in-season list below still applies to your area, so check your town's website for pop-up markets."
      : null;

  const topFarmers = markets.find((m) => m.kind === "farmers");
  const actions: string[] = [];
  if (topFarmers) {
    const where = topFarmers.address ? ` at ${topFarmers.address}` : "";
    const when = topFarmers.hours ? ` (${topFarmers.hours})` : "";
    actions.push(
      `Visit ${topFarmers.name}${where}${when}. Buying direct means fresher food, and more of your dollar reaches the farmer.`,
    );
  }
  if (inSeasonList.length > 0) {
    const picks = inSeasonList.slice(0, 3).map((p) => p.name.toLowerCase()).join(", ");
    actions.push(`Build a meal around what's peaking now: ${picks}. In-season produce is cheaper and tastes better.`);
  }
  actions.push("Bring cash and a tote. Ask a grower what they'd cook tonight — it's the best free recipe you'll get.");

  return {
    location: loc,
    monthName: MONTHS[month - 1],
    inSeason: inSeasonList,
    markets,
    marketsNote,
    actions,
  };
}
