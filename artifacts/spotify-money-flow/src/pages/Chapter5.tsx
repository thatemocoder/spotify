import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";
import ChapterHero from "@/components/ChapterHero";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightBox from "@/components/InsightBox";
import { artistTiers, streamsContext } from "@/data/spotify";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

const ArtistTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#fff", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{d.label}</p>
        <p style={{ color: "#aaa", fontSize: 12 }}>Artists: <strong style={{ color: "#fff" }}>{formatNumber(d.artists)}</strong></p>
        <p style={{ color: "#aaa", fontSize: 12 }}>Min streams needed: <strong style={{ color: "#fff" }}>{formatNumber(d.minStreams)}</strong></p>
        <p style={{ color: "#aaa", fontSize: 12 }}>Monthly equivalent: <strong style={{ color: "#fff" }}>${formatNumber(d.monthlyUsd)}/mo</strong></p>
      </div>
    );
  }
  return null;
};

const StreamsTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#fff", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>{d.benchmark}</p>
        <p style={{ color: "#aaa", fontSize: 12 }}>Monthly cost: <strong style={{ color: "#fff" }}>${d.monthlyCost.toFixed(2)}</strong></p>
        <p style={{ color: "#aaa", fontSize: 12 }}>Streams needed/month: <strong style={{ color: "#fff" }}>{formatNumber(d.streamsNeeded)}</strong></p>
        <p style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>At $0.004/stream average</p>
      </div>
    );
  }
  return null;
};

export default function Chapter5() {
  const totalArtists = artistTiers.reduce((sum, t) => sum + t.artists, 0);
  const topTier = artistTiers[0];
  const bottomTier = artistTiers[artistTiers.length - 2]; // exclude $0

  return (
    <div>
      <ChapterHero
        chapterNum={5}
        emoji="🎤"
        gradient="linear-gradient(135deg, #1a0a00 0%, #FF5252 100%)"
        title="Who Actually Gets Paid?"
        sub={`~${formatNumber(totalArtists)} artists on Spotify. 1,070 earn over $1M. 7 million earn nothing. The math behind streaming's biggest myth — that it's democratizing music.`}
        meta="<strong>Source:</strong> Spotify Loud &amp; Clear 2024 · <span class='dot'>·</span> Artist payout data · @$0.004/stream avg"
      />

      <div className="stats-row">
        <StatCard
          value={`${formatNumber(totalArtists)}`}
          label="Total Artists on Spotify"
          sub="~11.5M as of 2024"
          color="#B3B3B3"
        />
        <StatCard
          value={`${formatNumber(topTier.artists)}`}
          label="Earn $1M+/year"
          sub="0.009% of all artists"
          color="#FFD700"
        />
        <StatCard
          value="7M"
          label="Earn $0"
          sub="No streams, no pay"
          color="#535353"
        />
        <StatCard
          value="$0.004"
          label="Avg royalty per stream"
          sub="Industry estimate"
          color="#FF5252"
        />
        <StatCard
          value="250M"
          label="Streams to earn $1M"
          sub="At $0.004/stream"
          color="#FF9800"
        />
      </div>

      <ChartCard
        eye="CHART 5A · LOUD & CLEAR 2024"
        title={`Artist Earnings Pyramid — ~${formatNumber(totalArtists)} Artists on Spotify`}
        sub="The music industry's power law in action — the top 0.01% captures most of the value"
      >
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={[...artistTiers].reverse()}
            layout="vertical"
            margin={{ top: 10, right: 80, left: 180, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
            <XAxis
              type="number"
              stroke="#555"
              tick={{ fill: "#888", fontSize: 10 }}
              tickFormatter={(v) => formatNumber(v)}
              scale="log"
              domain={[100, 10000000]}
              ticks={[1000, 10000, 100000, 1000000, 10000000]}
            />
            <YAxis
              type="category"
              dataKey="label"
              stroke="#555"
              tick={{ fill: "#aaa", fontSize: 11 }}
              width={175}
            />
            <Tooltip content={<ArtistTooltip />} />
            <Bar dataKey="artists" name="Artists" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "#888", fontSize: 10, formatter: (v: number) => formatNumber(v) }}>
              {[...artistTiers].reverse().map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <InsightBox
        icon="💡"
        head="THE POWER LAW REALITY"
        body="1,070 artists earn 1M+ streams per month consistently. 3.5 million earn between $1–$999/year — not enough for a single Spotify subscription. For context: a musician needs 290,000 streams per month just to match a full-time minimum wage, and 950,000 monthly streams to meet the MIT Living Wage for a single adult."
      />

      <ChartCard
        eye="CHART 5B · STREAMS TO REAL-WORLD COSTS"
        title="Monthly Streams Needed to Match Real-World Costs"
        sub="At $0.004/stream average — how many plays does it take to cover basic living expenses?"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[...streamsContext].reverse()}
            layout="vertical"
            margin={{ top: 10, right: 80, left: 220, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
            <XAxis
              type="number"
              stroke="#555"
              tick={{ fill: "#888", fontSize: 10 }}
              tickFormatter={(v) => formatNumber(v)}
            />
            <YAxis
              type="category"
              dataKey="benchmark"
              stroke="#555"
              tick={{ fill: "#aaa", fontSize: 11 }}
              width={215}
            />
            <Tooltip content={<StreamsTooltip />} />
            <Bar dataKey="streamsNeeded" name="Monthly Streams Needed" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "#888", fontSize: 10, formatter: (v: number) => formatNumber(v) }}>
              {[...streamsContext].reverse().map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <InsightBox
        icon="⚠️"
        head="THE SUSTAINABILITY CRISIS"
        body="97% of artists on Spotify earn less than $1,000/year. Of the 11.5M artists, 60% earn literally $0. The pro-rata royalty model structurally concentrates wealth toward a small number of mega-streams — Taylor Swift's catalog alone generates more Spotify royalties than the bottom 6 million artists combined."
        warn
      />

      <div className="cards-grid">
        <div className="info-card">
          <div className="ic">🏆</div>
          <div className="ttl">Top 1,070 Artists</div>
          <div className="dsc">Taylor Swift, Drake, Bad Bunny. They need 250M+ streams/year. Their label, management, and publishing deals slice every payment before it arrives.</div>
        </div>
        <div className="info-card">
          <div className="ic">📻</div>
          <div className="ttl">The Mid-Tier Myth</div>
          <div className="dsc">130,000 artists earn $10K–$100K/year from streaming — these are working musicians who still need day jobs, teaching gigs, or touring income to survive.</div>
        </div>
        <div className="info-card">
          <div className="ic">🎸</div>
          <div className="ttl">Why Touring Still Matters</div>
          <div className="dsc">Most professional musicians rely on live performance for 70–80% of income. Streaming is marketing, not a living wage — the economics force it.</div>
        </div>
        <div className="info-card">
          <div className="ic">🔄</div>
          <div className="ttl">User-Centric Royalties: The Alternative</div>
          <div className="dsc">Instead of a big pool, your $9.99 would go directly to artists you listen to. Deezer and Soundcloud tried this. Spotify hasn't adopted it — yet.</div>
        </div>
      </div>
    </div>
  );
}
