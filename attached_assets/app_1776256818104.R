# ─────────────────────────────────────────────────────────────────────────────
# app.R  ·  Spotify Money Flow — Spotify-style Layout
# ─────────────────────────────────────────────────────────────────────────────

library(shiny)
library(bslib)
library(plotly)
library(networkD3)
library(dplyr)
library(glue)
library(scales)
library(htmlwidgets)

source("data.R")
source("charts.R")

# ── SPOTIFY COLOR TOKENS (match Spotify's actual design system) ───────────────
SPO_BG       <- "#121212"
SPO_SURFACE  <- "#181818"
SPO_ELEVATED <- "#282828"
SPO_GREEN    <- "#1DB954"
SPO_WHITE    <- "#FFFFFF"
SPO_GRAY1    <- "#B3B3B3"
SPO_GRAY2    <- "#535353"
SPO_GRAY3    <- "#3E3E3E"
SPO_RED      <- "#FF5252"
SPO_AMBER    <- "#FF9800"
SPO_BLUE     <- "#64B5F6"

# ── GLOBAL CSS ────────────────────────────────────────────────────────────────
css <- "
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #121212;
  --surface:  #181818;
  --elevated: #282828;
  --green:    #1DB954;
  --white:    #FFFFFF;
  --gray1:    #B3B3B3;
  --gray2:    #535353;
  --gray3:    #3E3E3E;
  --red:      #FF5252;
  --amber:    #FF9800;
  --blue:     #64B5F6;
  --font: 'DM Sans', system-ui, sans-serif;
  --mono: 'DM Mono', 'Courier New', monospace;
}

html, body { height:100%; overflow:hidden; background:var(--bg); color:var(--white); font-family:var(--font); }
body > .container-fluid { height:100vh; padding:0 !important; }

/* ── SHELL ── */
.spo-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 1fr 90px;
  grid-template-areas: 'sidebar main' 'bar bar';
  height: 100vh;
  gap: 8px;
  padding: 8px;
  background: #000;
}

/* ── SIDEBAR ── */
.spo-sidebar {
  grid-area: sidebar;
  background: var(--surface);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
.spo-sidebar::-webkit-scrollbar { width: 0; }

.spo-logo {
  display:flex; align-items:center; gap:10px;
  padding: 22px 20px 12px;
}
.spo-logo .mark {
  width:34px; height:34px; border-radius:50%;
  background:var(--green);
  display:flex; align-items:center; justify-content:center;
  font-size:16px; flex-shrink:0;
}
.spo-logo .wm { font-size:15px; font-weight:700; color:var(--white); line-height:1.2; }
.spo-logo .tg { font-size:10px; color:var(--gray1); font-family:var(--mono); }

.nav-section { padding: 16px 8px 4px; }
.nav-label {
  font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
  color:var(--gray2); padding:0 12px; margin-bottom:4px; display:block;
}
.nav-item {
  display:flex; align-items:center; gap:14px;
  padding:10px 12px; border-radius:6px;
  cursor:pointer; border:none; background:none; width:100%;
  font-family:var(--font); font-size:14px; font-weight:500;
  color:var(--gray1); text-align:left; transition:background 0.15s, color 0.15s;
  margin-bottom:2px;
}
.nav-item:hover { background:var(--elevated); color:var(--white); }
.nav-item.active { background:var(--elevated); color:var(--white); }
.nav-item .ni { font-size:20px; width:24px; text-align:center; flex-shrink:0; }
.nav-item .nb {
  margin-left:auto; font-size:9px; font-family:var(--mono);
  background:var(--green); color:#000; border-radius:100px;
  padding:2px 7px; font-weight:700;
}
.nav-item.active .nb { background:var(--white); }

.divider { height:1px; background:var(--gray3); margin:10px 16px; }

.src-chip {
  margin:0 8px 6px;
  background:var(--elevated); border-radius:6px; padding:10px 12px;
}
.src-chip .sc-l { font-size:10px; color:var(--gray2); font-family:var(--mono); letter-spacing:1px; }
.src-chip .sc-n { font-size:12px; color:var(--gray1); margin-top:2px; }

.sidebar-foot {
  margin-top:auto; padding:14px 16px;
  border-top:1px solid var(--gray3);
  font-size:11px; color:var(--gray2); font-family:var(--mono);
}

/* ── MAIN ── */
.spo-main {
  grid-area: main;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  transition: background 0.5s;
}
.spo-main::-webkit-scrollbar { width:8px; }
.spo-main::-webkit-scrollbar-track { background:transparent; }
.spo-main::-webkit-scrollbar-thumb { background:var(--gray2); border-radius:4px; }

/* ── TOP BAR ── */
.topbar {
  position:sticky; top:0; z-index:50;
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 28px;
  background:rgba(0,0,0,0.4); backdrop-filter:blur(4px);
}
.topbar .tb-arrows { display:flex; gap:8px; }
.tb-btn {
  width:32px; height:32px; border-radius:50%;
  background:rgba(0,0,0,0.6); border:none; cursor:pointer;
  color:var(--white); font-size:14px;
  display:flex; align-items:center; justify-content:center;
}
.tb-btn:hover { background:rgba(0,0,0,0.9); }
.chapter-pill {
  background:var(--green); color:#000; border-radius:100px;
  padding:6px 16px; font-size:12px; font-weight:700; font-family:var(--mono);
  letter-spacing:0.5px;
}

/* ── CHAPTER HERO ── */
.chap-hero {
  padding:16px 28px 28px;
  display:flex; align-items:flex-end; gap:24px;
}
.chap-art {
  width:156px; height:156px; border-radius:4px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:68px;
  box-shadow:0 16px 48px rgba(0,0,0,0.6);
}
.chap-type   { font-size:11px; font-weight:700; letter-spacing:1px; color:var(--white); margin-bottom:6px; }
.chap-title  { font-size:clamp(26px,3.5vw,48px); font-weight:700; color:var(--white); line-height:1.05; margin-bottom:10px; letter-spacing:-0.5px; }
.chap-sub    { font-size:14px; color:var(--gray1); line-height:1.55; max-width:520px; margin-bottom:10px; }
.chap-meta   { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--gray1); }
.chap-meta strong { color:var(--white); }
.chap-meta .dot { color:var(--gray2); }

/* ── STATS ROW ── */
.stats-row { display:flex; gap:10px; padding:0 28px 20px; overflow-x:auto; }
.stat-card {
  background:var(--elevated); border-radius:8px; padding:14px 18px;
  flex:1; min-width:130px; border:1px solid transparent;
  transition:background 0.2s, border-color 0.2s;
}
.stat-card:hover { background:#333; border-color:var(--gray3); }
.stat-card .sv { font-size:24px; font-weight:700; font-family:var(--mono); margin-bottom:4px; }
.stat-card .sl { font-size:12px; color:var(--gray1); }
.stat-card .ss { font-size:11px; color:var(--gray2); margin-top:2px; }

/* ── CHART CARD ── */
.chart-card {
  background:var(--surface); border-radius:8px; padding:22px;
  margin:0 28px 14px;
  transition:background 0.2s;
}
.chart-card:hover { background:var(--elevated); }
.cc-eye   { font-size:10px; font-family:var(--mono); letter-spacing:2px; color:var(--gray2); text-transform:uppercase; margin-bottom:12px; }
.cc-title { font-size:16px; font-weight:700; color:var(--white); margin-bottom:3px; }
.cc-sub   { font-size:13px; color:var(--gray1); margin-bottom:18px; }

/* ── INSIGHT / WARN ── */
.insight, .warn {
  margin:0 28px 20px;
  border-radius:8px; padding:16px 20px;
  display:flex; gap:12px; align-items:flex-start;
}
.insight { background:#172917; border-left:3px solid var(--green); }
.warn    { background:#271717; border-left:3px solid var(--red); }
.ins-head { font-size:12px; font-weight:700; letter-spacing:1px; margin-bottom:5px; }
.insight .ins-head { color:var(--green); }
.warn    .ins-head { color:var(--red); }
.ins-body { font-size:13px; color:var(--gray1); line-height:1.6; }
.ins-icon { font-size:20px; flex-shrink:0; margin-top:2px; }

/* ── INFO CARDS ── */
.cards-grid {
  display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:10px; margin:0 28px 20px;
}
.info-card {
  background:var(--surface); border-radius:8px; padding:18px;
  transition:background 0.2s;
}
.info-card:hover { background:var(--elevated); }
.info-card .ic  { font-size:24px; margin-bottom:10px; }
.info-card .ttl { font-size:14px; font-weight:700; color:var(--white); margin-bottom:6px; }
.info-card .dsc { font-size:12px; color:var(--gray1); line-height:1.55; }

/* ── DOLLAR BAR ── */
.dollar-wrap { margin:0 28px 20px; }
.dollar-eye { font-size:10px; font-family:var(--mono); letter-spacing:2px; color:var(--gray2); text-transform:uppercase; margin-bottom:12px; }
.dollar-track {
  display:flex; height:44px; border-radius:6px; overflow:hidden; gap:2px; margin-bottom:4px;
}
.dollar-seg {
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700; font-family:var(--mono); color:#000;
}

/* ── SANKEY WRAP ── */
.sankey-wrap {
  margin:0 28px 14px;
  background:var(--surface); border-radius:8px; padding:22px;
}

/* ── TRACK LIST ── */
.track-list { margin:0 28px 20px; }
.track-header {
  display:grid; gap:16px; padding:0 12px 8px;
  border-bottom:1px solid var(--gray3); margin-bottom:4px;
  font-size:10px; letter-spacing:1px; color:var(--gray2); text-transform:uppercase; font-family:var(--mono);
}
.track-row {
  display:grid; gap:16px; padding:8px 12px; border-radius:6px;
  align-items:center; transition:background 0.15s;
}
.track-row:hover { background:var(--elevated); }
.t-num  { color:var(--gray2); font-family:var(--mono); font-size:13px; text-align:center; }
.t-name { font-size:13px; font-weight:500; color:var(--white); }
.t-sub  { font-size:11px; color:var(--gray1); margin-top:2px; }
.t-val  { font-family:var(--mono); font-size:13px; text-align:right; }

/* ── NOW PLAYING BAR ── */
.spo-bar {
  grid-area: bar;
  background:var(--elevated);
  border-radius:8px;
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  padding:0 24px;
  border-top:1px solid var(--gray3);
}
.bar-left  { display:flex; align-items:center; gap:14px; }
.bar-art   { width:52px; height:52px; border-radius:4px; background:var(--green); display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.bar-tname { font-size:14px; font-weight:600; color:var(--white); }
.bar-tsub  { font-size:11px; color:var(--gray1); margin-top:2px; }
.bar-center { display:flex; flex-direction:column; align-items:center; gap:6px; }
.bar-ctrls  { display:flex; gap:18px; align-items:center; }
.bar-btn { background:none; border:none; cursor:pointer; font-size:16px; color:var(--gray1); transition:color 0.15s; padding:4px; }
.bar-btn:hover { color:var(--white); }
.bar-btn.big { font-size:30px; color:var(--white); }
.bar-prog { display:flex; align-items:center; gap:10px; }
.bar-time { font-size:11px; font-family:var(--mono); color:var(--gray2); }
.bar-track { width:180px; height:4px; background:var(--gray3); border-radius:2px; cursor:pointer; }
.bar-fill  { height:100%; background:var(--white); border-radius:2px; transition:width 0.4s; }
.bar-track:hover .bar-fill { background:var(--green); }
.bar-right { display:flex; justify-content:flex-end; align-items:center; gap:10px; }
.vol-bar  { width:80px; height:4px; background:var(--gray3); border-radius:2px; }
.vol-fill { height:100%; width:70%; background:var(--white); border-radius:2px; }

.spo-pad { height:36px; }
"

# ── HELPERS ───────────────────────────────────────────────────────────────────
stat_c <- function(val, lbl, sub, col = SPO_GREEN) {
  tags$div(class="stat-card",
    tags$div(class="sv", style=glue("color:{col};"), val),
    tags$div(class="sl", lbl),
    tags$div(class="ss", sub)
  )
}

chart_card <- function(eye, title, sub = NULL, ...) {
  tags$div(class="chart-card",
    tags$div(class="cc-eye", eye),
    tags$div(class="cc-title", title),
    if (!is.null(sub)) tags$div(class="cc-sub", sub),
    ...
  )
}

insight_box <- function(icon, head, body, warn = FALSE) {
  tags$div(class = if (warn) "warn" else "insight",
    tags$div(class="ins-icon", icon),
    tags$div(
      tags$div(class="ins-head", head),
      tags$div(class="ins-body", body)
    )
  )
}

chap_hero <- function(num, emoji, grad, title, sub, src) {
  tags$div(class="chap-hero",
    tags$div(class="chap-art", style=glue("background:{grad};"), emoji),
    tags$div(
      tags$div(class="chap-type", "DATA STORY"),
      tags$h1(class="chap-title", title),
      tags$p(class="chap-sub", sub),
      tags$div(class="chap-meta",
        tags$strong(glue("Chapter {num}")),
        tags$span(class="dot","•"),
        tags$span(src),
        tags$span(class="dot","•"),
        tags$span("2024 Data")
      )
    )
  )
}

nav_btn <- function(icon, lbl, val, badge = NULL) {
  tags$div(class="nav-item", id=paste0("nb_",val),
    onclick=glue("Shiny.setInputValue('sec','{val}',{{priority:'event'}})"),
    tags$span(class="ni", icon),
    tags$span(lbl),
    if (!is.null(badge)) tags$span(class="nb", badge)
  )
}

# ─────────────────────────────────────────────────────────────────────────────
# UI
# ─────────────────────────────────────────────────────────────────────────────
ui <- page_fluid(
  theme = bs_theme(bg = SPO_BG, fg = SPO_WHITE, primary = SPO_GREEN,
                   base_font = font_google("DM Sans")),
  tags$head(
    tags$style(HTML(css)),
    tags$title("Where Does Your $9.99 Go?")
  ),

  tags$div(class="spo-shell",

    # ── SIDEBAR ────────────────────────────────────────────────────────────
    tags$div(class="spo-sidebar",
      tags$div(class="spo-logo",
        tags$div(class="mark","♫"),
        tags$div(tags$div(class="wm","$9.99 Decoded"), tags$div(class="tg","DATA INVESTIGATION"))
      ),
      tags$div(class="nav-section",
        tags$span(class="nav-label","Chapters"),
        uiOutput("sidebar_nav")
      ),
      tags$div(class="divider"),
      tags$div(class="nav-section",
        tags$span(class="nav-label","Data Sources"),
        tags$div(class="src-chip", tags$div(class="sc-l","Section 1"), tags$div(class="sc-n","RIAA U.S. Sales Database")),
        tags$div(class="src-chip", tags$div(class="sc-l","Sections 2 & 4"), tags$div(class="sc-n","Spotify Investor Reports")),
        tags$div(class="src-chip", tags$div(class="sc-l","Section 3"), tags$div(class="sc-n","MIDiA Research")),
        tags$div(class="src-chip", tags$div(class="sc-l","Section 5"), tags$div(class="sc-n","Spotify Loud & Clear"))
      ),
      tags$div(class="sidebar-foot","© 2024 · Estimates only")
    ),

    # ── MAIN ───────────────────────────────────────────────────────────────
    tags$div(class="spo-main",
      tags$div(class="topbar",
        tags$div(class="tb-arrows",
          tags$button(class="tb-btn","‹"),
          tags$button(class="tb-btn","›")
        ),
        uiOutput("topbar_pill")
      ),
      uiOutput("main_content"),
      tags$div(class="spo-pad")
    ),

    # ── NOW PLAYING BAR ────────────────────────────────────────────────────
    tags$div(class="spo-bar",
      tags$div(class="bar-left",
        tags$div(class="bar-art","💸"),
        tags$div(
          tags$div(class="bar-tname", uiOutput("bar_name")),
          tags$div(class="bar-tsub",  uiOutput("bar_sub"))
        )
      ),
      tags$div(class="bar-center",
        tags$div(class="bar-ctrls",
          tags$button(class="bar-btn", onclick="Shiny.setInputValue('sec','s1',{priority:'event'})", "⏮"),
          tags$button(class="bar-btn", onclick="Shiny.setInputValue('sec','s2',{priority:'event'})", "⏪"),
          tags$button(class="bar-btn big","▶"),
          tags$button(class="bar-btn", onclick="Shiny.setInputValue('sec','s4',{priority:'event'})", "⏩"),
          tags$button(class="bar-btn", onclick="Shiny.setInputValue('sec','s5',{priority:'event'})", "⏭")
        ),
        tags$div(class="bar-prog",
          tags$span(class="bar-time", uiOutput("bar_pos")),
          tags$div(class="bar-track", tags$div(class="bar-fill", id="bar_fill")),
          tags$span(class="bar-time","5:00")
        )
      ),
      tags$div(class="bar-right",
        tags$span(style="color:var(--gray1);font-size:16px;","🔊"),
        tags$div(class="vol-bar", tags$div(class="vol-fill"))
      )
    )
  )
)

# ─────────────────────────────────────────────────────────────────────────────
# SERVER
# ─────────────────────────────────────────────────────────────────────────────
server <- function(input, output, session) {

  sec <- reactiveVal("s1")
  observeEvent(input$sec, sec(input$sec))

  meta <- list(
    s1 = list(num="01", icon="📊", lbl="Industry Growth",  badge="RIAA",   grad="linear-gradient(180deg,#1e3a2f 0%,#121212 360px)", art_grad="linear-gradient(135deg,#1DB954,#0d8f3c)"),
    s2 = list(num="02", icon="👤", lbl="The Two Users",    badge="SPO IR", grad="linear-gradient(180deg,#1a1a3a 0%,#121212 360px)", art_grad="linear-gradient(135deg,#4A90D9,#1a1a8a)"),
    s3 = list(num="03", icon="💰", lbl="Follow the Money", badge="MIDiA",  grad="linear-gradient(180deg,#2a1a0a 0%,#121212 360px)", art_grad="linear-gradient(135deg,#FF9800,#8B4513)"),
    s4 = list(num="04", icon="📢", lbl="The Ad Problem",   badge="IR",     grad="linear-gradient(180deg,#2a1010 0%,#121212 360px)", art_grad="linear-gradient(135deg,#FF5252,#8B0000)"),
    s5 = list(num="05", icon="🎤", lbl="The Artist",       badge="L&C",    grad="linear-gradient(180deg,#1a0d2a 0%,#121212 360px)", art_grad="linear-gradient(135deg,#7C4DFF,#1a0040)")
  )

  now_info <- list(
    s1=list(name="Industry Growth",   sub="RIAA · $33.8B total, 74% streaming", pos="0:30", pct="15%"),
    s2=list(name="The Two Users",     sub="Spotify IR · 30× revenue gap",       pos="1:30", pct="30%"),
    s3=list(name="Follow the Money",  sub="MIDiA · Artist gets <2¢ per $1",     pos="2:30", pct="50%"),
    s4=list(name="The Ad Problem",    sub="IR · 58% of users, 12% of revenue",  pos="3:30", pct="70%"),
    s5=list(name="The Artist",        sub="Loud & Clear · 93% earn <$1K/yr",    pos="4:30", pct="90%")
  )

  # Sidebar nav (highlight active)
  output$sidebar_nav <- renderUI({
    cur <- sec()
    tagList(lapply(names(meta), function(id) {
      m <- meta[[id]]
      tags$div(class=paste("nav-item", if (id==cur) "active"),
        onclick=glue("Shiny.setInputValue('sec','{id}',{{priority:'event'}})"),
        tags$span(class="ni", m$icon),
        tags$span(paste(m$num, m$lbl)),
        tags$span(class="nb", m$badge)
      )
    }))
  })

  # Topbar pill
  output$topbar_pill <- renderUI({
    m <- meta[[sec()]]
    tags$div(class="chapter-pill", paste("Ch", m$num, "·", m$lbl))
  })

  # Now playing bar
  output$bar_name <- renderUI(tags$span(now_info[[sec()]]$name))
  output$bar_sub  <- renderUI(tags$span(now_info[[sec()]]$sub))
  output$bar_pos  <- renderUI(tags$span(now_info[[sec()]]$pos))

  # Bar fill via inline CSS injection
  output$main_content <- renderUI({
    id  <- sec()
    m   <- meta[[id]]
    pct <- now_info[[id]]$pct

    content <- switch(id,

      "s1" = tagList(
        chap_hero("01","📊",m$art_grad,"Where the Money Comes From",
          "Streaming didn't just grow — it completely replaced every other format in under 20 years.",
          "RIAA U.S. Sales Database · 1973–2024"),
        tags$div(class="stats-row",
          stat_c("$33.8B","Global revenue 2024","Up 126% since 2015",    SPO_GREEN),
          stat_c("74%",   "Streaming share",    "of all recorded music", SPO_BLUE),
          stat_c("$2.0B", "Physical 2024",      "from $14.6B peak",      SPO_AMBER),
          stat_c("0%",    "Streaming in 2004",  "now dominates entirely",SPO_GRAY1)
        ),
        chart_card("Revenue by Format · RIAA · 1980–2024",
                   "U.S. Music Revenue: Physical → Digital → Streaming",
                   "Physical collapsed, downloads peaked and fell, streaming took everything",
                   plotlyOutput("p1a", height="300px")),
        chart_card("Streaming Dominance · %",
                   "Streaming as % of Total U.S. Revenue",
                   "0% in 2005 → 74% in 2024 — fastest format shift in music history",
                   plotlyOutput("p1b", height="220px")),
        insight_box("📈","KEY INSIGHT",
          "Streaming went from 0% to 74% of U.S. music revenue in under 20 years.
           The physical format that generated $14.6B/year in the 1990s now earns $2.0B.
           This structural shift is the root cause of the artist earnings crisis —
           per-stream rates are a fraction of what a CD sale once paid an artist.")
      ),

      "s2" = tagList(
        chap_hero("02","👤",m$art_grad,"The Two Users",
          "A premium subscriber and a free listener sit on opposite ends of the value spectrum. One funds the industry. One barely registers.",
          "Spotify Investor Relations · 2018–2024"),
        tags$div(class="stats-row",
          stat_c("$7.34", "Revenue/month Premium", "avg 2024",       SPO_GREEN),
          stat_c("$0.24", "Revenue/month Free",    "avg 2024",       SPO_AMBER),
          stat_c("30×",   "Premium earns more",   "per user",       SPO_RED),
          stat_c("58%",   "Users on free tier",   "350M of 602M",   SPO_GRAY1)
        ),
        chart_card("Monthly Revenue per User · Spotify IR · 2018–2024",
                   "What Each User Type Actually Generates",
                   "The gap between premium and free has barely narrowed in 7 years",
                   plotlyOutput("p2a", height="280px")),
        chart_card("2024 Snapshot · Log Scale",
                   "Value Generated per User — Premium vs Free",
                   "Log scale required — the gap makes free users nearly invisible on linear scale",
                   plotlyOutput("p2b", height="240px")),
        tags$div(class="cards-grid",
          tags$div(class="info-card",style="border-top:3px solid var(--green);",
            tags$div(class="ic","💳"),tags$div(class="ttl","Premium User"),
            tags$div(class="dsc","Pays $9.99/mo. Generates ~$6.99 royalty pool contribution. Each stream worth ~$0.004.")
          ),
          tags$div(class="info-card",style="border-top:3px solid var(--amber);",
            tags$div(class="ic","📻"),tags$div(class="ttl","Free User"),
            tags$div(class="dsc","Pays $0. Generates ~$0.24/mo from ads. Each stream worth ~$0.00076 — 5× less than premium.")
          ),
          tags$div(class="info-card",style="border-top:3px solid var(--red);",
            tags$div(class="ic","⚡"),tags$div(class="ttl","The Problem"),
            tags$div(class="dsc","350M free users generate less total revenue than 252M paid subscribers, suppressing royalty rates for everyone.")
          )
        ),
        insight_box("👤","KEY INSIGHT",
          "Premium users generate 30× more revenue per person than free users.
           Yet 58% of all listeners are on the free tier — and that share keeps growing.
           Every user who never converts to premium permanently shrinks the royalty pool.")
      ),

      "s3" = tagList(
        chap_hero("03","💰",m$art_grad,"Follow the Money",
          "Once revenue enters Spotify it passes through multiple layers before touching a creator. Each layer takes a cut.",
          "MIDiA Research · Spotify Loud & Clear 2024"),
        tags$div(class="stats-row",
          stat_c("30¢","Spotify keeps (per $1)",  "platform + profit",     SPO_GREEN),
          stat_c("56¢","Recording side",          "labels + distributors", "#9C27B0"),
          stat_c("14¢","Publishing",              "songwriters + pub.",     SPO_AMBER),
          stat_c("<2¢","Artist actually gets",    "after recoupment",      SPO_RED)
        ),
        tags$div(class="dollar-wrap",
          tags$div(class="dollar-eye","From Every $1 of Streaming Revenue · MIDiA Research + Spotify Loud & Clear"),
          tags$div(class="dollar-track",
            tags$div(class="dollar-seg",style="flex:30;background:#1DB954;","Spotify 30¢"),
            tags$div(class="dollar-seg",style="flex:56;background:#9C27B0;color:#fff;","Recording 56¢"),
            tags$div(class="dollar-seg",style="flex:14;background:#FF9800;","Publishing 14¢")
          ),
          tags$div(class="dollar-track",style="height:30px;margin-top:2px;",
            tags$div(class="dollar-seg",style="flex:30;background:transparent;"),
            tags$div(class="dollar-seg",style="flex:31;background:#7C4DFF;color:#fff;font-size:10px;","Majors 31¢"),
            tags$div(class="dollar-seg",style="flex:12;background:#00BCD4;font-size:10px;","Indie 12¢"),
            tags$div(class="dollar-seg",style="flex:7;background:#FF6D00;color:#fff;font-size:9px;","Dist 7¢"),
            tags$div(class="dollar-seg",style="flex:6;background:#EF9A9A;font-size:9px;","Self 6¢"),
            tags$div(class="dollar-seg",style="flex:14;background:transparent;")
          )
        ),
        tags$div(class="sankey-wrap",
          tags$div(class="cc-eye","Interactive Sankey · Drag nodes to rearrange · Values in cents per $1"),
          tags$div(class="cc-title","Money Flow: $1 → Spotify → Labels → Artist"),
          sankeyNetworkOutput("p3s", height="420px")
        ),
        tags$div(class="cards-grid",
          tags$div(class="info-card",style="border-top:3px solid #7C4DFF;",
            tags$div(class="ic","🏛️"),tags$div(class="ttl","Major Labels: 31¢"),
            tags$div(class="dsc","Universal, Sony, Warner negotiate directly with Spotify and lock in preferential rates.")
          ),
          tags$div(class="info-card",style="border-top:3px solid #00BCD4;",
            tags$div(class="ic","🎸"),tags$div(class="ttl","Indie Labels: 12¢"),
            tags$div(class="dsc","Artists on indie labels typically keep 15–50% of their share, depending on contract.")
          ),
          tags$div(class="info-card",style="border-top:3px solid var(--amber);",
            tags$div(class="ic","📝"),tags$div(class="ttl","Publishing: 14¢"),
            tags$div(class="dsc","Covers the composition. Often goes to different entities than the performer.")
          ),
          tags$div(class="info-card",style="border-top:3px solid var(--red);",
            tags$div(class="ic","🎤"),tags$div(class="ttl","Artist Reality"),
            tags$div(class="dsc","Label recoupment means artists see nothing until advances and costs are fully paid back.")
          )
        ),
        insight_box("🔴","KEY INSIGHT",
          "Artists don't receive 56¢ — they receive a fraction of it. Label recoupment clauses
           mean that until recording advances, marketing, and production are paid back, artists earn zero.
           On a typical major label deal, an artist nets roughly 2–5¢ per dollar streamed.", warn=TRUE)
      ),

      "s4" = tagList(
        chap_hero("04","📢",m$art_grad,"The Ad Problem",
          "More than half of Spotify's users generate less than 12% of its revenue. The free tier is structurally broken for artists.",
          "Spotify Investor Relations · 2018–2024"),
        tags$div(class="stats-row",
          stat_c("58%","Users on free tier 2024","350M MAUs",        SPO_AMBER),
          stat_c("12%","Revenue from ads 2024",  "$2.0B of $16.8B", SPO_RED),
          stat_c("88%","Revenue from premium",   "$14.8B in 2024",  SPO_GREEN),
          stat_c("42%","Users who pay",          "252M subscribers",SPO_BLUE)
        ),
        chart_card("Dual-Axis · Spotify IR · 2018–2024",
                   "Users vs Revenue: The Growing Imbalance",
                   "Bars = user mix (millions). Lines = revenue share (%, right axis)",
                   plotlyOutput("p4a", height="320px")),
        chart_card("2024 Snapshot · Side-by-Side Donuts",
                   "Half the Users. One-Eighth the Revenue.",
                   "Left: who uses Spotify. Right: who generates revenue.",
                   plotlyOutput("p4b", height="280px")),
        insight_box("🔴","KEY INSIGHT",
          "350 million free users generated only $2.0B in 2024.
           252 million paying subscribers generated $14.8B.
           This structural imbalance means every stream on the free tier contributes 5×
           less to the royalty pool — and independent artists, who rely on volume, absorb the loss.", warn=TRUE)
      ),

      "s5" = tagList(
        chap_hero("05","🎤",m$art_grad,"The Artist",
          "The royalty system has created the most extreme income inequality of any creative industry. Only a tiny fraction earn a living.",
          "Spotify Loud & Clear 2024 · 2025"),
        tags$div(class="stats-row",
          stat_c("~1,070",  "Earn $1M+/year",      "0.009% of artists","#FFD700"),
          stat_c("~13,400", "Earn $100K–$1M",      "0.12% of artists", "#C0C0C0"),
          stat_c("~130K",   "Earn $10K–$100K",     "1.1% of artists",  "#CD7F32"),
          stat_c(">10M",    "Earn under $1K/year", "87%+ of artists",  SPO_RED)
        ),
        chart_card("Artist Earnings · Spotify Loud & Clear 2024",
                   "The Earnings Pyramid",
                   "~11.5 million artists on Spotify. Log scale required — the bottom tiers contain millions.",
                   plotlyOutput("p5a", height="320px")),
        chart_card("Real-World Context · at $0.004/stream average",
                   "Monthly Streams Needed to Cover Living Costs",
                   "How many streams per month an artist needs just to match basic expenses",
                   plotlyOutput("p5b", height="260px")),
        tags$div(class="track-list",
          tags$div(class="track-header",
            style="grid-template-columns:28px 1fr 160px 110px;",
            tags$span("#"),tags$span("BENCHMARK"),tags$span("STREAMS/MONTH"),tags$span("MONTHLY $",style="text-align:right;")
          ),
          tagList(lapply(list(
            list("US Minimum Wage (full-time, $7.25/hr)","290,000","$1,160"),
            list("Average 1-bed rent (US median)","375,000","$1,500"),
            list("MIT Living Wage (single adult)","950,000","$3,800"),
            list("Your Spotify Premium subscription","2,498","$9.99"),
            list("A cup of coffee","1,250","$5.00")
          ), function(r) {
            tags$div(class="track-row",
              style="grid-template-columns:28px 1fr 160px 110px;",
              tags$div(class="t-num","♪"),
              tags$div(tags$div(class="t-name",r[[1]])),
              tags$div(class="t-val",style="color:var(--amber);",r[[2]]),
              tags$div(class="t-val",style="color:var(--green);",r[[3]])
            )
          }))
        ),
        tags$div(class="cards-grid",
          tags$div(class="info-card",
            tags$div(class="ic","⚖️"),tags$div(class="ttl","Pro-Rata Model"),
            tags$div(class="dsc","Your $9.99 pools globally and divides by total streams — not just your listening. Superstars dominate.")
          ),
          tags$div(class="info-card",
            tags$div(class="ic","📜"),tags$div(class="ttl","Legacy Contracts"),
            tags$div(class="dsc","Artists signed before streaming are locked into deals giving labels 80–90% of digital income.")
          ),
          tags$div(class="info-card",
            tags$div(class="ic","🌱"),tags$div(class="ttl","The Alternative"),
            tags$div(class="dsc","User-centric payouts send your money only to artists you listen to. Deezer piloted this in 2023.")
          )
        ),
        insight_box("🔴","KEY INSIGHT",
          "To earn US minimum wage ($1,160/month) purely from Spotify streams,
           an artist needs ~290,000 streams per month, every single month.
           Only ~14,000 artists globally achieve this. For the other 11+ million on the platform:
           streaming is not and cannot currently be a primary income source.", warn=TRUE)
      )
    )

    tagList(
      tags$style(HTML(glue(
        ".spo-main{{background:{m$grad};}}",
        "#bar_fill{{width:{pct};}}"
      ))),
      content
    )
  })

  # Chart renders
  output$p1a <- renderPlotly(chart_riaa_area(riaa_data))
  output$p1b <- renderPlotly(chart_streaming_pct(riaa_data))
  output$p2a <- renderPlotly(chart_rev_per_user(spotify_users))
  output$p2b <- renderPlotly(chart_user_snapshot_2024(spotify_users))
  output$p3s <- renderSankeyNetwork(chart_sankey(sankey_nodes, sankey_links))
  output$p4a <- renderPlotly(chart_ad_problem_dual(spotify_users))
  output$p4b <- renderPlotly(chart_gap_summary_2024(spotify_users))
  output$p5a <- renderPlotly(chart_artist_pyramid(artist_tiers))
  output$p5b <- renderPlotly(chart_streams_reality(streams_context))
}

shinyApp(
  ui = ui, server = server,
  options = list(host = "0.0.0.0", port = 3838, launch.browser = FALSE)
)
