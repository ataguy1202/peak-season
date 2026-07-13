export type RegionKey = "northeast" | "southeast" | "midwest" | "south" | "west" | "pacific";

export type Produce = {
  name: string;
  emoji: string;
  /** Why it's worth buying now — fresher/cheaper/peak flavor. */
  note: string;
};

export type Market = {
  name: string;
  /** "farmers" if clearly a farmers market, else "market". */
  kind: "farmers" | "market";
  miles: number | null;
  hours: string | null;
  /** Assembled street address when OSM has it. */
  address: string | null;
  website: string | null;
  phone: string | null;
  lat: number;
  lng: number;
};

export type Location = {
  label: string;
  lat: number;
  lng: number;
  state: string | null;
  region: RegionKey;
};

export type Report = {
  location: Location;
  monthName: string;
  inSeason: Produce[];
  markets: Market[];
  /** honest note when no markets were found nearby. */
  marketsNote: string | null;
  actions: string[];
};
