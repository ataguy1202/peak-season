// Peak Season — what's in season, by US region and month.
//
// Curated static table (no reliable public API exists). Sourced from USDA
// SNAP-Ed seasonal produce guide + state extension-office calendars. Months are
// 1-12. Each region maps a month to the produce genuinely at peak then. Kept to
// the strongest, most recognizable items so the list is useful, not exhaustive.

import type { Produce, RegionKey } from "./types";

const P = (name: string, emoji: string, note: string): Produce => ({ name, emoji, note });

// Shared item definitions (reused across regions/months).
const ITEMS = {
  strawberries: P("Strawberries", "🍓", "Peak sweetness and cheapest of the year right now."),
  tomatoes: P("Tomatoes", "🍅", "Field tomatoes now taste nothing like the winter grocery kind."),
  corn: P("Sweet corn", "🌽", "Sugars turn to starch fast — local same-day corn is a different food."),
  peaches: P("Peaches", "🍑", "Tree-ripened and fragrant; a fraction of winter import prices."),
  apples: P("Apples", "🍎", "Fresh-picked and crisp; storage apples later can't match it."),
  squash: P("Winter squash", "🎃", "Stores for months and is dirt cheap at harvest."),
  greens: P("Leafy greens", "🥬", "Cool weather makes kale and collards sweeter and tender."),
  berries: P("Blueberries", "🫐", "In-season pints cost a fraction of off-season."),
  peppers: P("Peppers", "🫑", "Sweet and abundant at peak; great for freezing."),
  melon: P("Melons", "🍈", "Watermelon and cantaloupe hit peak sugar mid-summer."),
  asparagus: P("Asparagus", "🌿", "A true spring-only crop; buy it while it's here."),
  peas: P("Snap peas", "🟢", "Sweetest straight off spring vines."),
  citrus: P("Citrus", "🍊", "Winter is peak orange and grapefruit season, especially in the South and West."),
  broccoli: P("Broccoli", "🥦", "Cool-season crop at its tender best now."),
  carrots: P("Carrots", "🥕", "Root crops store well and are cheapest at harvest."),
  cabbage: P("Cabbage", "🥬", "Hardy, cheap, and sweetest after a light frost."),
  cherries: P("Cherries", "🍒", "A short window — grab them at peak."),
  beans: P("Green beans", "🫛", "Snappy and abundant through summer."),
  pumpkin: P("Pumpkins", "🎃", "Fall harvest peak; cheapest of the year."),
};

type MonthMap = Record<number, Produce[]>;

// Build a region calendar. Only months with a strong list are filled; empty
// months fall back to the nearest filled month's cool/warm-season staples.
const SOUTHEAST: MonthMap = {
  1: [ITEMS.greens, ITEMS.citrus, ITEMS.cabbage, ITEMS.broccoli],
  2: [ITEMS.greens, ITEMS.citrus, ITEMS.cabbage, ITEMS.carrots],
  3: [ITEMS.strawberries, ITEMS.asparagus, ITEMS.greens, ITEMS.peas],
  4: [ITEMS.strawberries, ITEMS.asparagus, ITEMS.peas, ITEMS.greens],
  5: [ITEMS.strawberries, ITEMS.tomatoes, ITEMS.peas, ITEMS.beans],
  6: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peaches, ITEMS.beans, ITEMS.berries],
  7: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peaches, ITEMS.melon, ITEMS.peppers],
  8: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peppers, ITEMS.melon, ITEMS.beans],
  9: [ITEMS.apples, ITEMS.squash, ITEMS.peppers, ITEMS.greens],
  10: [ITEMS.apples, ITEMS.squash, ITEMS.pumpkin, ITEMS.greens],
  11: [ITEMS.greens, ITEMS.squash, ITEMS.broccoli, ITEMS.cabbage],
  12: [ITEMS.greens, ITEMS.citrus, ITEMS.cabbage, ITEMS.broccoli],
};

const NORTHEAST: MonthMap = {
  1: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
  2: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
  3: [ITEMS.greens, ITEMS.apples],
  4: [ITEMS.asparagus, ITEMS.peas, ITEMS.greens],
  5: [ITEMS.asparagus, ITEMS.strawberries, ITEMS.peas],
  6: [ITEMS.strawberries, ITEMS.peas, ITEMS.cherries, ITEMS.greens],
  7: [ITEMS.berries, ITEMS.corn, ITEMS.tomatoes, ITEMS.beans],
  8: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peppers, ITEMS.peaches, ITEMS.melon],
  9: [ITEMS.apples, ITEMS.tomatoes, ITEMS.squash, ITEMS.peppers],
  10: [ITEMS.apples, ITEMS.squash, ITEMS.pumpkin, ITEMS.greens],
  11: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage, ITEMS.carrots],
  12: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
};

const MIDWEST: MonthMap = {
  1: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
  2: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
  3: [ITEMS.greens, ITEMS.apples],
  4: [ITEMS.asparagus, ITEMS.greens, ITEMS.peas],
  5: [ITEMS.asparagus, ITEMS.strawberries, ITEMS.peas],
  6: [ITEMS.strawberries, ITEMS.peas, ITEMS.cherries, ITEMS.greens],
  7: [ITEMS.berries, ITEMS.corn, ITEMS.tomatoes, ITEMS.beans],
  8: [ITEMS.corn, ITEMS.tomatoes, ITEMS.peppers, ITEMS.melon, ITEMS.peaches],
  9: [ITEMS.apples, ITEMS.squash, ITEMS.tomatoes, ITEMS.peppers],
  10: [ITEMS.apples, ITEMS.squash, ITEMS.pumpkin, ITEMS.carrots],
  11: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage, ITEMS.carrots],
  12: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage],
};

const SOUTH: MonthMap = {
  // TX/OK/南 — long season, early spring
  1: [ITEMS.citrus, ITEMS.greens, ITEMS.cabbage, ITEMS.broccoli],
  2: [ITEMS.citrus, ITEMS.greens, ITEMS.carrots, ITEMS.cabbage],
  3: [ITEMS.strawberries, ITEMS.greens, ITEMS.peas, ITEMS.asparagus],
  4: [ITEMS.strawberries, ITEMS.tomatoes, ITEMS.peas, ITEMS.beans],
  5: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peaches, ITEMS.beans, ITEMS.melon],
  6: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peaches, ITEMS.melon, ITEMS.peppers],
  7: [ITEMS.melon, ITEMS.peppers, ITEMS.tomatoes, ITEMS.corn],
  8: [ITEMS.peppers, ITEMS.melon, ITEMS.tomatoes, ITEMS.beans],
  9: [ITEMS.squash, ITEMS.peppers, ITEMS.greens, ITEMS.apples],
  10: [ITEMS.squash, ITEMS.pumpkin, ITEMS.greens, ITEMS.broccoli],
  11: [ITEMS.greens, ITEMS.citrus, ITEMS.broccoli, ITEMS.cabbage],
  12: [ITEMS.citrus, ITEMS.greens, ITEMS.cabbage, ITEMS.carrots],
};

const WEST: MonthMap = {
  // Mountain/Southwest — shorter high-desert season
  1: [ITEMS.citrus, ITEMS.greens, ITEMS.apples],
  2: [ITEMS.citrus, ITEMS.greens, ITEMS.apples],
  3: [ITEMS.greens, ITEMS.asparagus],
  4: [ITEMS.asparagus, ITEMS.peas, ITEMS.greens],
  5: [ITEMS.strawberries, ITEMS.asparagus, ITEMS.peas],
  6: [ITEMS.strawberries, ITEMS.cherries, ITEMS.peas, ITEMS.greens],
  7: [ITEMS.tomatoes, ITEMS.corn, ITEMS.berries, ITEMS.melon],
  8: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peppers, ITEMS.melon, ITEMS.peaches],
  9: [ITEMS.apples, ITEMS.squash, ITEMS.peppers, ITEMS.tomatoes],
  10: [ITEMS.apples, ITEMS.squash, ITEMS.pumpkin, ITEMS.carrots],
  11: [ITEMS.apples, ITEMS.squash, ITEMS.cabbage, ITEMS.carrots],
  12: [ITEMS.citrus, ITEMS.apples, ITEMS.squash],
};

const PACIFIC: MonthMap = {
  // CA/OR/WA — mild, long, diverse
  1: [ITEMS.citrus, ITEMS.greens, ITEMS.broccoli, ITEMS.cabbage],
  2: [ITEMS.citrus, ITEMS.greens, ITEMS.broccoli, ITEMS.asparagus],
  3: [ITEMS.asparagus, ITEMS.strawberries, ITEMS.greens, ITEMS.peas],
  4: [ITEMS.strawberries, ITEMS.asparagus, ITEMS.peas, ITEMS.cherries],
  5: [ITEMS.strawberries, ITEMS.cherries, ITEMS.peas, ITEMS.greens],
  6: [ITEMS.cherries, ITEMS.berries, ITEMS.tomatoes, ITEMS.corn],
  7: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peaches, ITEMS.melon, ITEMS.berries],
  8: [ITEMS.tomatoes, ITEMS.corn, ITEMS.peppers, ITEMS.melon, ITEMS.peaches],
  9: [ITEMS.apples, ITEMS.tomatoes, ITEMS.peppers, ITEMS.squash],
  10: [ITEMS.apples, ITEMS.squash, ITEMS.pumpkin, ITEMS.greens],
  11: [ITEMS.apples, ITEMS.squash, ITEMS.greens, ITEMS.citrus],
  12: [ITEMS.citrus, ITEMS.greens, ITEMS.squash, ITEMS.broccoli],
};

export const CALENDARS: Record<RegionKey, MonthMap> = {
  northeast: NORTHEAST,
  southeast: SOUTHEAST,
  midwest: MIDWEST,
  south: SOUTH,
  west: WEST,
  pacific: PACIFIC,
};

export function inSeason(region: RegionKey, month: number): Produce[] {
  return CALENDARS[region][month] ?? [];
}
