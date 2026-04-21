import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, ReferenceLine
} from "recharts";
import ChapterHero from "@/components/ChapterHero";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightBox from "@/components/InsightBox";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { riaaFrom1980, riaaFrom2005 } from "@/data/riaa";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color, fontSize: 13, marginBottom: 2 }}>
            {p.name}: <strong>${typeof p.value === "number" ? p.value.toFixed(2) : p.value}B</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PctTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>{label}</p>
        <p style={{ color: "#1DB954", fontSize: 13 }}>
          Streaming share: <strong>{payload[0]?.value}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

export default function Chapter1() {
  const latest = riaaFrom1980[riaaFrom1980.length - 1];

  return (
    <div>
      <ChapterHero
        chapterNum={1}
        title="The Rise and Fall of Music Revenue"
        sub="From vinyl peaks to the streaming era - how $14B became $7B, then climbed back to $20B through a complete format revolution."
        meta='<strong>Source:</strong> <a href="https://www.riaa.com/u-s-sales-database/" target="_blank" style="color: #1DB954; text-decoration: none; border-bottom: 1px solid rgba(29,185,84,0.3)">RIAA U.S. Sales Database</a> <span class="dot"> &middot; </span> <strong>Period:</strong> 1980&ndash;2024'
      />

      <Reveal direction="up" delay={60}>
      <div className="stats-row">
        <StatCard
          value={`$${latest.total.toFixed(1)}B`}
          label="2024 Total Revenue"
          sub="U.S. Recorded Music"
          color="#1DB954"
        />
        <StatCard
          value={`${latest.pctStreaming}%`}
          label="Streaming Share"
          sub="of total 2024 revenue"
          color="#64B5F6"
        />
        <StatCard
          value="$12.5B"
          label="Physical Peak (1997)"
          sub="Before digital disruption"
          color="#FF9800"
        />
        <StatCard
          value="-37%"
          label="Revenue Decline"
          sub="1999-2014 trough"
          color="#FF5252"
        />
        <StatCard
          value="+54%"
          label="Recovery vs. trough"
          sub="Streaming-led comeback"
          color="#1DB954"
        />
      </div>
      </Reveal>

      <ChartCard
        eye="CHART 1A · RIAA DATA"
        title="U.S. Recorded Music Revenue by Format (1980-2024)"
        sub="The industry's full lifecycle: physical dominance, digital disruption, and the streaming comeback"
      >
        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={riaaFrom1980} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <defs>
              <linearGradient id="physGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9800" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#FF9800" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64B5F6" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#64B5F6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1DB954" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#1DB954" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `$${v}B`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: "#aaa", fontSize: 12 }}
              formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>}
            />
            <ReferenceLine
              x={1999}
              stroke="#FF5252"
              strokeDasharray="4 4"
              label={{ value: "Napster (1999)", fill: "#FF5252", fontSize: 10, position: "insideTopRight" }}
            />
            <ReferenceLine
              x={2015}
              stroke="#1DB954"
              strokeDasharray="4 4"
              label={{ value: "Streaming >50%", fill: "#1DB954", fontSize: 10, position: "insideTopLeft" }}
            />
            <Area type="monotone" dataKey="physical" name="Physical" fill="url(#physGrad)" stroke="#FF9800" strokeWidth={2} />
            <Area type="monotone" dataKey="digitalDownload" name="Digital Downloads" fill="url(#dlGrad)" stroke="#64B5F6" strokeWidth={2} />
            <Area type="monotone" dataKey="streaming" name="Streaming" fill="url(#streamGrad)" stroke="#1DB954" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <InsightBox
        head="THE NAPSTER EFFECT"
        body="The music industry lost nearly $6B in revenue between 1999 and 2014 - a 37% collapse driven by digital piracy. The rise of streaming on Spotify (2008) and Apple Music (2015) reversed this trend, but the recovery took 15 years and changed how money flows to artists."
      />

      <PullQuote
        text="The industry recovered its revenue - but the economics of who gets paid look nothing like they did in 1999."
        attr="RIAA DATA ANALYSIS"
      />

      <ChartCard
        eye="CHART 1B · FORMAT SHIFT"
        title="Streaming as % of Total U.S. Music Revenue (2005-2024)"
        sub="From near-zero to more than 84% of the entire industry in under 20 years"
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={riaaFrom2005} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
            <Tooltip content={<PctTooltip />} />
            <ReferenceLine
              y={50}
              stroke="#FF9800"
              strokeDasharray="4 4"
              label={{ value: "50% threshold (2015)", fill: "#FF9800", fontSize: 10, position: "insideBottomLeft" }}
            />
            <Line
              type="monotone"
              dataKey="pctStreaming"
              name="Streaming %"
              stroke="#1DB954"
              strokeWidth={3}
              dot={{ fill: "#1DB954", r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#1DB954" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Reveal direction="up" delay={40}>
      <div className="cards-grid">
        <div className="info-card">
          <div className="ic"><Icon name="disc" size={22} color="#FF9800" /></div>
          <div className="ttl">Physical Peak: $12.5B (1997)</div>
          <div className="dsc">CD sales dominated. Tower Records had 200+ stores. Artists got royalty checks in the mail.</div>
        </div>
        <div className="info-card">
          <div className="ic"><Icon name="download" size={22} color="#64B5F6" /></div>
          <div className="ttl">Digital Download Era (2003-2012)</div>
          <div className="dsc">iTunes launched at 99c/track. Downloads briefly replaced CDs but could not sustain the industry alone.</div>
        </div>
        <div className="info-card">
          <div className="ic"><Icon name="music" size={22} color="#1DB954" /></div>
          <div className="ttl">Streaming Takeover (2015+)</div>
          <div className="dsc">Spotify, Apple Music, and Tidal redefined access over ownership. $9.99/month became the new album price.</div>
        </div>
        <div className="info-card">
          <div className="ic"><Icon name="bar-chart" size={22} color="#64B5F6" /></div>
          <div className="ttl">2024 Revenue: ~$19.3B streaming</div>
          <div className="dsc">This money flows very differently than the old model - most goes to intermediaries before reaching artists.</div>
        </div>
      </div>
      </Reveal>
    </div>
  );
}
