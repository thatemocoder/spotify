export interface SpotifyYear {
  year: number;
  premiumSubsM: number;
  freeMauM: number;
  premiumRevenueB: number;
  adRevenueB: number;
  revPerPremium: number;
  revPerFree: number;
  totalMauM: number;
  pctPremiumUsers: number;
  pctFreeUsers: number;
  totalRevenueB: number;
  pctPremiumRev: number;
  pctAdRev: number;
}

const raw = [
  { year: 2018, premiumSubsM: 87, freeMauM: 109, premiumRevenueB: 4.71, adRevenueB: 0.49 },
  { year: 2019, premiumSubsM: 113, freeMauM: 124, premiumRevenueB: 6.09, adRevenueB: 0.68 },
  { year: 2020, premiumSubsM: 138, freeMauM: 107, premiumRevenueB: 7.13, adRevenueB: 0.74 },
  { year: 2021, premiumSubsM: 155, freeMauM: 172, premiumRevenueB: 9.00, adRevenueB: 1.21 },
  { year: 2022, premiumSubsM: 180, freeMauM: 196, premiumRevenueB: 10.25, adRevenueB: 1.47 },
  { year: 2023, premiumSubsM: 220, freeMauM: 236, premiumRevenueB: 12.07, adRevenueB: 1.68 },
  { year: 2024, premiumSubsM: 252, freeMauM: 350, premiumRevenueB: 14.80, adRevenueB: 1.99 },
];

export const spotifyData: SpotifyYear[] = raw.map((d) => {
  const totalMauM = d.premiumSubsM + d.freeMauM;
  const totalRevenueB = d.premiumRevenueB + d.adRevenueB;
  return {
    ...d,
    revPerPremium: (d.premiumRevenueB * 1e9) / (d.premiumSubsM * 1e6) / 12,
    revPerFree: (d.adRevenueB * 1e9) / (d.freeMauM * 1e6) / 12,
    totalMauM,
    pctPremiumUsers: Math.round((d.premiumSubsM / totalMauM) * 1000) / 10,
    pctFreeUsers: Math.round((d.freeMauM / totalMauM) * 1000) / 10,
    totalRevenueB,
    pctPremiumRev: Math.round((d.premiumRevenueB / totalRevenueB) * 1000) / 10,
    pctAdRev: Math.round((d.adRevenueB / totalRevenueB) * 1000) / 10,
  };
});

export const dollarSplit = [
  { recipient: "Spotify (platform)", cents: 30, color: "#1DB954" },
  { recipient: "Recording (labels/artists)", cents: 56, color: "#9C27B0" },
  { recipient: "Publishing (songwriters)", cents: 14, color: "#FF9800" },
];

export const recordingSplit = [
  { recipient: "Major Labels", pct: 56, color: "#7C4DFF", centsOfDollar: 0.31 },
  { recipient: "Indie Labels", pct: 22, color: "#00BCD4", centsOfDollar: 0.12 },
  { recipient: "Distributors", pct: 12, color: "#FF6D00", centsOfDollar: 0.07 },
  { recipient: "Self-Released Artists", pct: 10, color: "#EF9A9A", centsOfDollar: 0.06 },
];

export const artistTiers = [
  { label: "Earn $1M+/year", artists: 1070, minStreams: 250000000, color: "#FFD700", monthlyUsd: 83333 },
  { label: "Earn $100K–$1M/year", artists: 13400, minStreams: 25000000, color: "#C0C0C0", monthlyUsd: 8333 },
  { label: "Earn $10K–$100K/year", artists: 130000, minStreams: 2500000, color: "#CD7F32", monthlyUsd: 833 },
  { label: "Earn $1K–$10K/year", artists: 870000, minStreams: 250000, color: "#607D8B", monthlyUsd: 83 },
  { label: "Earn $1–$999/year", artists: 3500000, minStreams: 1, color: "#455A64", monthlyUsd: 42 },
  { label: "Earn $0 (no streams)", artists: 7000000, minStreams: 0, color: "#2d2d2d", monthlyUsd: 0 },
];

export const streamsContext = [
  { benchmark: "US Min Wage (full-time)", monthlyCost: 1160, streamsNeeded: 290000, color: "#FF5252" },
  { benchmark: "Avg 1-bed rent (US median)", monthlyCost: 1500, streamsNeeded: 375000, color: "#FF7043" },
  { benchmark: "MIT Living Wage (single adult)", monthlyCost: 3800, streamsNeeded: 950000, color: "#FF1744" },
  { benchmark: "Spotify Premium sub", monthlyCost: 9.99, streamsNeeded: 2498, color: "#1DB954" },
  { benchmark: "Cup of coffee", monthlyCost: 5.00, streamsNeeded: 1250, color: "#64B5F6" },
];
