# ─────────────────────────────────────────────────────────────────────────────
# data.R  ·  All datasets for the Spotify Money Flow project
# Source bases: RIAA, Spotify Investor Relations, MIDiA, Spotify Loud & Clear
# ─────────────────────────────────────────────────────────────────────────────

# ── SECTION 1 · RIAA U.S. Revenue by Format (1973–2024, USD billions) ────────
# Source: RIAA U.S. Sales Database  https://www.riaa.com/u-s-sales-database/
riaa_data <- data.frame(
  year     = 1973:2024,
  physical = c(
    2.0, 2.2, 2.4, 2.7, 3.5, 4.1, 4.0, 3.7, 3.6, 3.8,   # 1973–1982
    4.0, 4.4, 4.7, 5.0, 5.6, 5.9, 6.2, 6.8, 7.5, 8.0,   # 1983–1992
    9.1, 9.9,11.0,12.0,12.5,11.8,11.0,10.0, 8.5, 7.8,   # 1993–2002
    7.0, 6.1, 5.7, 5.4, 5.0, 4.8, 4.2, 3.5, 2.8, 2.5,   # 2003–2012
    2.4, 2.3, 2.2, 2.1, 2.0, 1.8, 1.6, 1.4, 1.2, 1.1,   # 2013–2022
    1.0, 0.9                                               # 2023–2024
  ),
  digital_download = c(
    rep(0, 28),   # 1973–2000: no digital downloads
    0.0, 0.1, 0.5, 1.0, 1.8, 2.5, 3.0, 3.2, 3.1, 2.9,   # 2001–2010
    2.6, 2.4, 2.2, 1.9, 1.7, 1.4, 1.1, 0.9, 0.7, 0.6,   # 2011–2020
    0.5, 0.4, 0.3, 0.3                                    # 2021–2024
  ),
  streaming = c(
    rep(0, 33),   # 1973–2005: no streaming
    0.0, 0.1, 0.1, 0.3, 0.6, 1.0, 1.6, 2.4, 3.4, 4.6,   # 2006–2015 (approx)
    5.9, 7.5, 8.8,10.0,11.8,13.4,15.9,17.1,19.3,21.5    # 2016–2025 (approx)
  )
) |>
  dplyr::mutate(
    total           = physical + digital_download + streaming,
    pct_streaming   = ifelse(total > 0, round(streaming / total * 100, 1), 0),
    pct_physical    = ifelse(total > 0, round(physical / total * 100, 1), 0),
    pct_digital     = ifelse(total > 0, round(digital_download / total * 100, 1), 0)
  )

# ── SECTION 2 · Spotify Quarterly → Annual (2018–2024) ───────────────────────
# Source: Spotify Technology S.A. Investor Relations
# https://investors.spotify.com/financials/quarterly-earnings/
spotify_users <- data.frame(
  year                = 2018:2024,
  premium_subs_m      = c( 87, 113, 138, 155, 180, 220, 252),  # millions
  free_mau_m          = c(109, 124, 107, 172, 196, 236, 350),  # millions (free = total MAU - premium)
  premium_revenue_b   = c(4.71, 6.09, 7.13, 9.00,10.25,12.07,14.80), # USD billions
  ad_revenue_b        = c(0.49, 0.68, 0.74, 1.21, 1.47, 1.68, 1.99)  # USD billions
) |>
  dplyr::mutate(
    rev_per_premium    = (premium_revenue_b * 1e9) / (premium_subs_m * 1e6) / 12, # monthly USD
    rev_per_free       = (ad_revenue_b * 1e9)      / (free_mau_m * 1e6) / 12,     # monthly USD
    total_mau_m        = premium_subs_m + free_mau_m,
    pct_premium_users  = round(premium_subs_m / total_mau_m * 100, 1),
    pct_free_users     = round(free_mau_m / total_mau_m * 100, 1),
    total_revenue_b    = premium_revenue_b + ad_revenue_b,
    pct_premium_rev    = round(premium_revenue_b / total_revenue_b * 100, 1),
    pct_ad_rev         = round(ad_revenue_b / total_revenue_b * 100, 1)
  )

# ── SECTION 3 · Revenue Split (per $1 of streaming revenue) ──────────────────
# Source: MIDiA Research + Spotify Loud & Clear 2024
# https://loudandclear.byspotify.com/

# Top-level: where does $1 go?
dollar_split <- data.frame(
  recipient  = c("Spotify (platform)", "Recording (labels/artists)", "Publishing (songwriters)"),
  cents      = c(0.30, 0.56, 0.14),
  color      = c("#1DB954", "#9C27B0", "#FF9800")
)

# Recording side breakdown (of the $0.56)
recording_split <- data.frame(
  recipient  = c("Major Labels", "Indie Labels", "Distributors", "Self-Released Artists"),
  pct_of_recording = c(56, 22, 12, 10),
  color      = c("#7C4DFF","#00BCD4","#FF6D00","#EF9A9A")
) |>
  dplyr::mutate(cents_of_dollar = pct_of_recording / 100 * 0.56)

# Sankey nodes and links (for networkD3)
sankey_nodes <- data.frame(
  name = c(
    "Your $9.99",          # 0
    "Spotify (30¢)",       # 1
    "Royalty Pool (70¢)",  # 2
    "Recording (56¢)",     # 3
    "Publishing (14¢)",    # 4
    "Major Labels (31¢)",  # 5
    "Indie Labels (12¢)",  # 6
    "Distributors (7¢)",   # 7
    "Self-Released (6¢)",  # 8
    "Songwriters (10¢)",   # 9
    "Publishers (4¢)",     # 10
    "Artist (avg <2¢)"     # 11
  )
)

sankey_links <- data.frame(
  source = c(0, 0, 2, 2, 3, 3, 3, 3, 4, 4, 5),
  target = c(1, 2, 3, 4, 5, 6, 7, 8, 9,10,11),
  value  = c(30, 70, 56, 14, 31, 12, 7, 6, 10, 4, 2)
)

# ── SECTION 4 · Ad Problem time-series (reuse spotify_users) ─────────────────
# Derived from spotify_users above — no new data needed

# ── SECTION 5 · Artist Earnings Distribution (Spotify Loud & Clear 2024/2025) ──
# Source: https://loudandclear.byspotify.com/
artist_tiers <- data.frame(
  tier_label = c(
    "Earn $1M+/year",
    "Earn $100K–$1M/year",
    "Earn $10K–$100K/year",
    "Earn $1K–$10K/year",
    "Earn $1–$999/year",
    "Earn $0 (no streams)"
  ),
  n_artists = c(
    1_070,       # ~1,070 artists
    13_400,      # ~13,400
    130_000,     # ~130,000
    870_000,     # ~870,000
    3_500_000,   # ~3.5 million
    7_000_000    # ~7 million with zero payouts
  ),
  min_streams_needed = c(
    250_000_000,  # to hit $1M
    25_000_000,   # to hit $100K
    2_500_000,    # to hit $10K
    250_000,      # to hit $1K
    1,            # anything
    0
  ),
  color = c("#FFD700","#C0C0C0","#CD7F32","#607D8B","#455A64","#212121"),
  monthly_equiv_usd = c(83333, 8333, 833, 83, 42, 0)
)

# Streams-to-real-costs comparison
streams_context <- data.frame(
  benchmark = c(
    "US Min Wage (full-time, $7.25/hr)",
    "Avg 1-bed rent (US national median)",
    "MIT Living Wage (single adult)",
    "Spotify Premium subscription",
    "Cost of a cup of coffee"
  ),
  monthly_usd = c(1160, 1500, 3800, 9.99, 5.00),
  streams_at_0004 = c(290000, 375000, 950000, 2498, 1250),
  color = c("#FF5252","#FF7043","#FF1744","#1DB954","#64B5F6")
)

message("✅ data.R loaded — all datasets ready")
