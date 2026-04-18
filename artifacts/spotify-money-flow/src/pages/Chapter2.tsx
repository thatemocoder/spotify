import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import ChapterHero from "@/components/ChapterHero";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightBox from "@/components/InsightBox";
import PullQuote from "@/components/PullQuote";
import Reveal from "@/components/Reveal";
import { spotifyData } from "@/data/spotify";

const RevTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill ?? p.color, fontSize: 13, marginBottom: 2 }}>
            {p.name}: <strong>${typeof p.value === "number" ? p.value.toFixed(2) : p.value}/user/mo</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const UsersTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill ?? p.color, fontSize: 13, marginBottom: 2 }}>
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(1) : p.value}M users</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Chapter2() {
  const latest = spotifyData[spotifyData.length - 1];
  const earliest = spotifyData[0];

  return (
    <div>
      <ChapterHero
        chapterNum={2}
        emoji="🎧"
        gradient="linear-gradient(135deg, #1a1a4a 0%, #64B5F6 100%)"
        title="Spotify's Two-Tier Economy"
        sub="602 million users, but only 42% pay. Free listeners generate just 12¢ a month — premium subscribers generate $4.88. The math tells a stark story."
        meta="<strong>Source:</strong> Spotify Investor Relations Q4 2024 · <span class='dot'>·</span> <strong>Period:</strong> 2018–2024"
      />

      <Reveal direction="up" delay={60}>
      <div className="stats-row">
        <StatCard
          value={`${latest.premiumSubsM}M`}
          label="Premium Subscribers (2024)"
          sub="+189% since 2018"
          color="#1DB954"
        />
        <StatCard
          value={`${latest.freeMauM}M`}
          label="Free MAU (2024)"
          sub="Monthly active listeners"
          color="#FF9800"
        />
        <StatCard
          value={`$${latest.revPerPremium.toFixed(2)}`}
          label="Premium $/user/month"
          sub="Revenue generated"
          color="#1DB954"
        />
        <StatCard
          value={`$${latest.revPerFree.toFixed(3)}`}
          label="Free $/user/month"
          sub="From advertising"
          color="#FF9800"
        />
        <StatCard
          value={`${Math.round(latest.revPerPremium / latest.revPerFree)}×`}
          label="Premium vs Free value"
          sub="Revenue per user gap"
          color="#FF5252"
        />
      </div>
      </Reveal>

      <ChartCard
        eye="CHART 2A · SPOTIFY INVESTOR RELATIONS"
        title="Monthly Revenue per User: Premium vs Free Tier (2018–2024)"
        sub="A premium subscriber generates ~47x more revenue than a free listener — yet both consume the same music"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={spotifyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `$${v.toFixed(2)}`} />
            <Tooltip content={<RevTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>}
            />
            <Bar dataKey="revPerPremium" name="Premium ($/user/mo)" fill="#1DB954" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revPerFree" name="Free Tier ($/user/mo)" fill="#FF9800" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <InsightBox
        icon="⚠️"
        head="THE FREE TIER PARADOX"
        body={`In 2024, free users represent ${latest.pctFreeUsers}% of all listeners but generate only ${latest.pctAdRev}% of revenue. Meanwhile, premium subscribers — just ${latest.pctPremiumUsers}% of users — drive ${latest.pctPremiumRev}% of all revenue. Every free listener who never converts costs Spotify in server bandwidth while contributing a fraction of a cent.`}
        warn
      />

      <PullQuote
        text="A free user generates 12¢ a month. A premium subscriber generates $4.88. Both consume exactly the same music."
        attr="SPOTIFY INVESTOR RELATIONS · Q4 2024"
      />

      <ChartCard
        eye="CHART 2B · USER GROWTH"
        title="Spotify User Base Growth by Tier (2018–2024)"
        sub="Both tiers grew, but free users accelerated faster — widening the structural revenue imbalance"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={spotifyData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
            <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
            <Tooltip content={<UsersTooltip />} />
            <Legend
              formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>}
            />
            <Bar dataKey="premiumSubsM" name="Premium Subscribers" stackId="a" fill="#1DB954" />
            <Bar dataKey="freeMauM" name="Free MAU" stackId="a" fill="#FF9800" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Reveal direction="up" delay={40}>
      <div className="cards-grid">
        <div className="info-card">
          <div className="ic">💰</div>
          <div className="ttl">Premium ARPU: ~$4.88/mo</div>
          <div className="dsc">Despite a $9.99 sticker price, discounts for students, families, and bundles push the average revenue per user down significantly.</div>
        </div>
        <div className="info-card">
          <div className="ic">📡</div>
          <div className="ttl">Free Tier: Conversion Funnel</div>
          <div className="dsc">Spotify views free listeners as future premium subscribers. The free tier is a $1.99B/year bet on conversion — only ~30% ever convert.</div>
        </div>
        <div className="info-card">
          <div className="ic">🌍</div>
          <div className="ttl">Geographic Tilt</div>
          <div className="dsc">Free users skew heavily toward emerging markets where premium pricing is prohibitive. India, Brazil, and Southeast Asia are free-tier dominated.</div>
        </div>
        <div className="info-card">
          <div className="ic">📢</div>
          <div className="ttl">Ad Revenue: Still Only 12%</div>
          <div className="dsc">Despite growing from $490M to $1.99B since 2018, advertising remains a fraction of total revenue — the premium model is the engine.</div>
        </div>
      </div>
      </Reveal>
    </div>
  );
}
