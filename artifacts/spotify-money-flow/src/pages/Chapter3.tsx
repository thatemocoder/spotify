import { useState } from "react";
import ChapterHero from "@/components/ChapterHero";
import StatCard from "@/components/StatCard";
import InsightBox from "@/components/InsightBox";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import { dollarSplit, recordingSplit } from "@/data/spotify";

function DollarBar() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="dollar-wrap">
      <div className="dollar-eye">EVERY $1 YOU PAY TO SPOTIFY</div>
      <div className="dollar-track">
        {dollarSplit.map((seg, i) => (
          <div
            key={seg.recipient}
            className="dollar-seg"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: seg.cents,
              background: seg.color,
              opacity: hovered === null || hovered === i ? 1 : 0.5,
              transition: "opacity 0.2s, flex 0.3s",
              flexShrink: 0,
              flexGrow: hovered === i ? seg.cents * 1.1 : seg.cents,
              position: "relative",
            }}
          >
            <span style={{ fontSize: hovered === i ? 13 : 11, fontWeight: 700, fontFamily: "monospace", color: "#000" }}>
              {seg.cents}¢
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {dollarSplit.map((seg, i) => (
          <div
            key={seg.recipient}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer", opacity: hovered === null || hovered === i ? 1 : 0.5, transition: "opacity 0.2s"
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#B3B3B3" }}>
              {seg.recipient} — <strong style={{ color: "#fff", fontFamily: "monospace" }}>{seg.cents}¢</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordingSankey() {
  return (
    <div className="chart-card">
      <div className="cc-eye">RECORDING SPLIT · Of the 56¢ to "Recording"</div>
      <div className="cc-title">How the Recording 56¢ Gets Divided</div>
      <div className="cc-sub">The label/distributor layer extracts most of the value before an artist sees anything</div>
      <div style={{ marginTop: 16 }}>
        {recordingSplit.map((seg) => (
          <div key={seg.recipient} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#B3B3B3" }}>{seg.recipient}</span>
              <span style={{ fontSize: 13, fontFamily: "monospace", color: seg.color }}>
                {seg.pct}% ({(seg.centsOfDollar * 100).toFixed(0)}¢ of $1)
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#282828", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${seg.pct}%`,
                background: seg.color, borderRadius: 4,
                transition: "width 0.6s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 20, padding: "14px 16px",
        background: "#1a0d1a", borderLeft: "3px solid #9C27B0", borderRadius: "0 6px 6px 0"
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#9C27B0", marginBottom: 6 }}>WHAT AN ARTIST ACTUALLY GETS</div>
        <div style={{ fontSize: 13, color: "#B3B3B3", lineHeight: 1.6 }}>
          A self-released artist on a distributor keeps their full 6¢. A signed artist at a major label may keep 15–20% of the label's 31¢ — meaning approximately <strong style={{ color: "#fff" }}>&lt;2¢ out of every dollar you spend on Spotify</strong> reaches the artist who made the music.
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  const nodes = [
    { id: "input", label: "Your $9.99/month", x: 0, color: "#ffffff" },
    { id: "spotify", label: "Spotify 30¢", x: 1, color: "#1DB954" },
    { id: "royalty", label: "Royalty Pool 70¢", x: 1, color: "#9C27B0" },
    { id: "recording", label: "Recording 56¢", x: 2, color: "#7C4DFF" },
    { id: "publishing", label: "Publishing 14¢", x: 2, color: "#FF9800" },
    { id: "major", label: "Major Labels 31¢", x: 3, color: "#7C4DFF" },
    { id: "indie", label: "Indie Labels 12¢", x: 3, color: "#00BCD4" },
    { id: "dist", label: "Distributors 7¢", x: 3, color: "#FF6D00" },
    { id: "self", label: "Self-Released 6¢", x: 3, color: "#EF9A9A" },
    { id: "writers", label: "Songwriters 10¢", x: 3, color: "#FF9800" },
    { id: "publishers", label: "Publishers 4¢", x: 3, color: "#FFC107" },
    { id: "artist", label: "Artist avg <2¢", x: 4, color: "#FF5252" },
  ];

  return (
    <div className="chart-card">
      <div className="cc-eye">SANKEY FLOW · SIMPLIFIED VIEW</div>
      <div className="cc-title">Where Your $9.99 Goes — Step by Step</div>
      <div className="cc-sub">Each layer extracts value before it reaches the creator</div>
      <div style={{ overflowX: "auto", paddingTop: 20 }}>
        <div style={{ minWidth: 600, position: "relative" }}>
          {/* Visual flow representation */}
          {[0, 1, 2, 3, 4].map((col) => (
            <div key={col} style={{
              display: "inline-block", width: "20%", verticalAlign: "top",
              padding: "0 8px", textAlign: "center"
            }}>
              <div style={{ fontSize: 10, color: "#535353", letterSpacing: 1, fontFamily: "monospace", marginBottom: 12 }}>
                {["YOU PAY", "SPOTIFY", "ROYALTIES", "RECIPIENTS", "ARTIST"][col]}
              </div>
              {nodes.filter(n => n.x === col).map(node => (
                <div key={node.id} style={{
                  background: "#282828", borderRadius: 6, padding: "10px 12px",
                  marginBottom: 8, borderLeft: `3px solid ${node.color}`,
                  fontSize: 12, color: node.color, fontWeight: 600, fontFamily: "monospace",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {node.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chapter3() {
  return (
    <div>
      <ChapterHero
        chapterNum={3}
        emoji="💵"
        gradient="linear-gradient(135deg, #2a1a00 0%, #FF9800 100%)"
        title="Where Does Your $9.99 Go?"
        sub="Spotify pays out ~70% as royalties — but the path from your subscription to an artist's bank account involves four layers of extraction."
        meta="<strong>Source:</strong> MIDiA Research · Spotify Loud & Clear 2024 · <span class='dot'>·</span> Based on standard streaming royalty structures"
      />

      <Reveal direction="up" delay={60}>
      <div className="stats-row">
        <StatCard value="30¢" label="Spotify keeps" sub="Platform fee" color="#1DB954" />
        <StatCard value="56¢" label="Recording royalties" sub="Labels + artists" color="#9C27B0" />
        <StatCard value="14¢" label="Publishing royalties" sub="Songwriters + publishers" color="#FF9800" />
        <StatCard value="<2¢" label="Average artist gets" sub="After label cuts" color="#FF5252" />
        <StatCard value="6¢" label="Self-released artist" sub="Best case scenario" color="#64B5F6" />
      </div>
      </Reveal>

      <DollarBar />

      <FlowDiagram />

      <RecordingSankey />

      <PullQuote
        text="Out of every dollar you spend on Spotify, less than 2¢ reaches the artist who actually made the music."
        attr="MIDIA RESEARCH · LOUD & CLEAR 2024"
      />

      <InsightBox
        icon="⚠️"
        head="THE LABEL EXTRACTION PROBLEM"
        body={"Major labels — Universal, Sony, and Warner — own 56% of the recording royalty pool and have equity stakes in Spotify itself. This means they receive royalties AND benefit from Spotify\u2019s stock value. An artist signed to a major label may receive as little as 13% of what the label earns, pushing the final artist take below 1\u00a2 per stream at $0.004/stream rates."}
        warn
      />

      <Reveal direction="up" delay={40}>
      <div className="cards-grid">
        <div className="info-card">
          <div className="ic">🏢</div>
          <div className="ttl">Major Labels Own the Stack</div>
          <div className="dsc">Universal, Sony, and Warner collectively own ~68% of all recording royalties. They also held equity in Spotify at IPO, collecting twice.</div>
        </div>
        <div className="info-card">
          <div className="ic">✍️</div>
          <div className="ttl">Songwriters Get Less</div>
          <div className="dsc">Publishing royalties (14¢) are split between songwriters and publishers. A writer who didn't perform gets even less than the performing artist.</div>
        </div>
        <div className="info-card">
          <div className="ic">🆓</div>
          <div className="ttl">Self-Released is Best Case</div>
          <div className="dsc">An artist on DistroKid keeps ~91% of their 6¢ after distributor fees — far more than signed artists, but still only 6¢ per dollar.</div>
        </div>
        <div className="info-card">
          <div className="ic">🔄</div>
          <div className="ttl">Royalties Are Pro-Rata</div>
          <div className="dsc">Spotify uses a "big pool" model: your $9.99 goes to the platform-wide royalty pool, not specifically to the artists you listen to.</div>
        </div>
      </div>
      </Reveal>
    </div>
  );
}
