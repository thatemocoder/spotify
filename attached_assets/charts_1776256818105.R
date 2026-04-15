# ─────────────────────────────────────────────────────────────────────────────
# charts.R  ·  All plotly chart functions for the Spotify Money Flow project
# Each function returns a plotly object ready to render in Shiny
# ─────────────────────────────────────────────────────────────────────────────

library(plotly)
library(dplyr)
library(tidyr)
library(scales)
library(networkD3)

# Shared dark theme applied to every plotly chart
dark_layout <- function(p, title = NULL, x_title = NULL, y_title = NULL) {
  p |> layout(
    title  = list(text = title, font = list(color = "#ffffff", size = 18, family = "Georgia, serif")),
    paper_bgcolor = "#0f0f0f",
    plot_bgcolor  = "#0f0f0f",
    font   = list(color = "#999999", family = "'Courier New', monospace"),
    xaxis  = list(title = x_title, gridcolor = "#1e1e1e", zerolinecolor = "#333",
                  color = "#888", tickfont = list(color = "#888")),
    yaxis  = list(title = y_title, gridcolor = "#1e1e1e", zerolinecolor = "#333",
                  color = "#888", tickfont = list(color = "#888")),
    legend = list(bgcolor = "rgba(0,0,0,0)", font = list(color = "#aaa")),
    margin = list(l = 60, r = 30, t = 60, b = 60),
    hoverlabel = list(bgcolor = "#111", bordercolor = "#333",
                      font = list(color = "#fff", size = 13))
  )
}

# ── CHART 1A · Stacked Area: Industry Revenue by Format ──────────────────────
chart_riaa_area <- function(data) {
  # Filter to years with any real revenue (1990+)
  d <- data |> filter(year >= 1980)

  plot_ly(d, x = ~year) |>
    add_trace(
      y = ~streaming, name = "Streaming",
      type = "scatter", mode = "none",
      fill = "tozeroy", fillcolor = "rgba(29,185,84,0.7)",
      hovertemplate = "Streaming: $%{y:.2f}B<extra></extra>"
    ) |>
    add_trace(
      y = ~digital_download, name = "Digital Downloads",
      type = "scatter", mode = "none",
      fill = "tozeroy", fillcolor = "rgba(100,181,246,0.6)",
      hovertemplate = "Digital: $%{y:.2f}B<extra></extra>"
    ) |>
    add_trace(
      y = ~physical, name = "Physical",
      type = "scatter", mode = "none",
      fill = "tozeroy", fillcolor = "rgba(255,152,0,0.5)",
      hovertemplate = "Physical: $%{y:.2f}B<extra></extra>"
    ) |>
    add_trace(
      y = ~total, name = "Total Revenue",
      type = "scatter", mode = "lines",
      line = list(color = "#ffffff", width = 2, dash = "dot"),
      hovertemplate = "Total: $%{y:.2f}B<extra></extra>"
    ) |>
    dark_layout(
      title   = "U.S. Recorded Music Revenue by Format (1980–2024)",
      x_title = "Year",
      y_title = "Revenue (USD Billion)"
    )
}

# ── CHART 1B · Line: Streaming % of Total Revenue ────────────────────────────
chart_streaming_pct <- function(data) {
  d <- data |> filter(year >= 2005)
  plot_ly(d, x = ~year, y = ~pct_streaming,
          type = "scatter", mode = "lines+markers",
          line    = list(color = "#1DB954", width = 3),
          marker  = list(color = "#1DB954", size = 7,
                         line = list(color = "#fff", width = 1.5)),
          fill    = "tozeroy", fillcolor = "rgba(29,185,84,0.12)",
          hovertemplate = "Year: %{x}<br>Streaming share: %{y:.1f}%<extra></extra>") |>
    dark_layout(
      title   = "Streaming as % of Total U.S. Music Revenue",
      x_title = "Year",
      y_title = "Share (%)"
    ) |>
    layout(yaxis = list(range = c(0, 100), ticksuffix = "%"))
}

# ── CHART 2A · Grouped Bar: Revenue per User (Premium vs Free) ───────────────
chart_rev_per_user <- function(data) {
  plot_ly(data, x = ~year) |>
    add_trace(
      y = ~rev_per_premium, name = "Premium ($/user/month)",
      type = "bar",
      marker = list(color = "#1DB954",
                    line = list(color = "#0d8f3c", width = 1)),
      hovertemplate = "Year: %{x}<br>Premium: $%{y:.2f}/user/mo<extra></extra>"
    ) |>
    add_trace(
      y = ~rev_per_free, name = "Free Tier ($/user/month)",
      type = "bar",
      marker = list(color = "#FF9800",
                    line = list(color = "#b36a00", width = 1)),
      hovertemplate = "Year: %{x}<br>Free: $%{y:.3f}/user/mo<extra></extra>"
    ) |>
    dark_layout(
      title   = "Monthly Revenue Generated per User: Premium vs Free Tier",
      x_title = "Year",
      y_title = "Revenue per User (USD/month)"
    ) |>
    layout(barmode = "group")
}

# ── CHART 2B · Side-by-side stat: 2024 snapshot ──────────────────────────────
chart_user_snapshot_2024 <- function(data) {
  d <- data |> filter(year == 2024)

  categories <- c("Monthly Revenue/User", "Annual Royalty Contribution",
                  "Stream Value (×1000)", "Market Importance")
  premium_vals <- c(d$rev_per_premium, d$rev_per_premium * 12, 4.0, 10)
  free_vals    <- c(d$rev_per_free,    d$rev_per_free * 12,    0.7, 1)

  # Normalise to ratio for visual comparison (log scale)
  plot_ly() |>
    add_trace(
      type = "bar", orientation = "h",
      y = categories,
      x = premium_vals,
      name = "Premium User",
      marker = list(color = "#1DB954"),
      hovertemplate = "Premium: $%{x:.2f}<extra></extra>"
    ) |>
    add_trace(
      type = "bar", orientation = "h",
      y = categories,
      x = free_vals,
      name = "Free User",
      marker = list(color = "#FF9800"),
      hovertemplate = "Free: $%{x:.2f}<extra></extra>"
    ) |>
    dark_layout(
      title   = "2024 Snapshot — Value Generated per User",
      x_title = "USD",
      y_title = NULL
    ) |>
    layout(barmode = "group",
           xaxis = list(type = "log", title = "USD (log scale)"))
}

# ── CHART 3 · Sankey: Money Flow from $1 to Artist ───────────────────────────
chart_sankey <- function(nodes, links) {
  # networkD3 requires 0-indexed source/target
  sankeyNetwork(
    Links   = links,
    Nodes   = nodes,
    Source  = "source",
    Target  = "target",
    Value   = "value",
    NodeID  = "name",
    units   = "¢",
    fontSize = 13,
    nodeWidth = 30,
    nodePadding = 20,
    sinksRight  = TRUE
  )
}

# ── CHART 4A · Dual-Axis: Users Split + Revenue Split Over Time ───────────────
chart_ad_problem_dual <- function(data) {
  plot_ly(data, x = ~year) |>
    # Free users (bar, left axis)
    add_trace(
      y = ~free_mau_m, name = "Free MAU (M users)",
      type = "bar", yaxis = "y1",
      marker = list(color = "rgba(255,152,0,0.5)"),
      hovertemplate = "Year: %{x}<br>Free users: %{y}M<extra></extra>"
    ) |>
    # Premium users (bar, left axis)
    add_trace(
      y = ~premium_subs_m, name = "Premium Subs (M users)",
      type = "bar", yaxis = "y1",
      marker = list(color = "rgba(29,185,84,0.6)"),
      hovertemplate = "Year: %{x}<br>Premium: %{y}M<extra></extra>"
    ) |>
    # % of revenue from ads (line, right axis)
    add_trace(
      y = ~pct_ad_rev, name = "Ad Revenue %",
      type = "scatter", mode = "lines+markers", yaxis = "y2",
      line   = list(color = "#FF5252", width = 2.5),
      marker = list(color = "#FF5252", size = 8),
      hovertemplate = "Year: %{x}<br>Ad Revenue share: %{y:.1f}%<extra></extra>"
    ) |>
    # % of revenue from premium (line, right axis)
    add_trace(
      y = ~pct_premium_rev, name = "Premium Revenue %",
      type = "scatter", mode = "lines+markers", yaxis = "y2",
      line   = list(color = "#1DB954", width = 2.5, dash = "dash"),
      marker = list(color = "#1DB954", size = 8),
      hovertemplate = "Year: %{x}<br>Premium Revenue share: %{y:.1f}%<extra></extra>"
    ) |>
    dark_layout(
      title = "The Ad Problem: Users vs Revenue Split (2018–2024)"
    ) |>
    layout(
      barmode = "stack",
      yaxis  = list(title = "Users (Millions)", gridcolor = "#1e1e1e",
                    color = "#888", ticksuffix = "M"),
      yaxis2 = list(title = "Revenue Share (%)", overlaying = "y",
                    side = "right", range = c(0, 110),
                    gridcolor = "rgba(0,0,0,0)", color = "#aaa",
                    ticksuffix = "%")
    )
}

# ── CHART 4B · Annotations: the gap in plain numbers ─────────────────────────
chart_gap_summary_2024 <- function(data) {
  d <- data |> filter(year == 2024) |>
    mutate(
      free_pct_users = round(free_mau_m / (free_mau_m + premium_subs_m) * 100, 1),
      prem_pct_users = round(premium_subs_m / (free_mau_m + premium_subs_m) * 100, 1)
    )

  plot_ly() |>
    add_trace(
      type = "pie",
      values = c(d$free_mau_m, d$premium_subs_m),
      labels = c(
        glue::glue("Free Users ({d$free_pct_users}% of users)"),
        glue::glue("Premium Subs ({d$prem_pct_users}% of users)")
      ),
      hole = 0.6,
      marker = list(colors = c("#FF9800", "#1DB954"),
                    line   = list(color = "#0f0f0f", width = 2)),
      textinfo = "label+percent",
      textfont = list(color = "#fff", size = 11),
      domain   = list(x = c(0, 0.45)),
      name     = "Users",
      hovertemplate = "%{label}: %{value}M<extra></extra>"
    ) |>
    add_trace(
      type = "pie",
      values = c(d$ad_revenue_b, d$premium_revenue_b),
      labels = c(
        glue::glue("Ad Revenue ({d$pct_ad_rev}% of revenue)"),
        glue::glue("Premium Revenue ({d$pct_premium_rev}% of revenue)")
      ),
      hole = 0.6,
      marker = list(colors = c("#FF9800", "#1DB954"),
                    line   = list(color = "#0f0f0f", width = 2)),
      textinfo = "label+percent",
      textfont = list(color = "#fff", size = 11),
      domain   = list(x = c(0.55, 1.0)),
      name     = "Revenue",
      hovertemplate = "%{label}: $%{value}B<extra></extra>"
    ) |>
    dark_layout(title = "2024: Half the Users → Only 12% of Revenue") |>
    layout(
      annotations = list(
        list(text = "USERS", x = 0.2, y = 0.5, showarrow = FALSE,
             font = list(color = "#aaa", size = 14)),
        list(text = "REVENUE", x = 0.8, y = 0.5, showarrow = FALSE,
             font = list(color = "#aaa", size = 14))
      )
    )
}

# ── CHART 5A · Pyramid: Artist Earnings Distribution ─────────────────────────
chart_artist_pyramid <- function(data) {
  d <- data |>
    filter(n_artists > 0) |>
    mutate(
      tier_label  = factor(tier_label, levels = rev(tier_label)),
      log_artists = log10(n_artists),
      pct         = round(n_artists / sum(n_artists) * 100, 2),
      label_text  = scales::comma(n_artists)
    )

  plot_ly(d,
          y    = ~tier_label,
          x    = ~n_artists,
          type = "bar",
          orientation = "h",
          marker = list(
            color = ~color,
            line  = list(color = "#0f0f0f", width = 1.5)
          ),
          text         = ~label_text,
          textposition = "outside",
          textfont     = list(color = "#ccc", size = 11),
          hovertemplate = paste(
            "<b>%{y}</b><br>",
            "Artists: %{text}<br>",
            "<extra></extra>"
          )
  ) |>
    dark_layout(
      title   = "Artist Earnings Pyramid — ~11.5M Artists on Spotify (2024)",
      y_title = NULL,
      x_title = "Number of Artists (log scale)"
    ) |>
    layout(xaxis = list(type = "log",
                        tickvals  = c(1e3, 1e4, 1e5, 1e6, 1e7),
                        ticktext  = c("1K", "10K", "100K", "1M", "10M")))
}

# ── CHART 5B · Bar: Streams needed to match real-world costs ─────────────────
chart_streams_reality <- function(data) {
  d <- data |>
    mutate(
      benchmark    = factor(benchmark, levels = rev(benchmark)),
      label_text   = scales::comma(streams_at_0004)
    )

  plot_ly(d,
          y    = ~benchmark,
          x    = ~streams_at_0004,
          type = "bar",
          orientation = "h",
          marker       = list(color = ~color, line = list(color = "#0f0f0f", width = 1)),
          text         = ~label_text,
          textposition = "outside",
          textfont     = list(color = "#ccc", size = 11),
          hovertemplate = paste(
            "<b>%{y}</b><br>",
            "Monthly cost: $%{customdata}<br>",
            "Streams needed: %{text}<br>",
            "<extra></extra>"
          ),
          customdata = ~monthly_usd
  ) |>
    dark_layout(
      title   = "Streams Needed per Month to Cover Real-World Costs",
      y_title = NULL,
      x_title = "Monthly Streams Required (at $0.004/stream)"
    ) |>
    layout(xaxis = list(type = "log",
                        tickvals  = c(1e3, 1e4, 1e5, 1e6),
                        ticktext  = c("1K", "10K", "100K", "1M")))
}

message("✅ charts.R loaded — all chart functions ready")
