import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import ChapterHero from "@/components/ChapterHero";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import InsightBox from "@/components/InsightBox";
import { spotifyData } from "@/data/spotify";

const DualTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px" }}>
        <p style={{ color: "#aaa", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.stroke ?? p.fill, fontSize: 13, marginBottom: 2 }}>
            {p.name}: <strong>{p.name.includes("%") ? `${typeof p.value === "number" ? p.value.toFixed(1) : p.value}%` : `${typeof p.value === "number" ? p.value.toFixed(1) : p.value}M`}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const latest = spotifyData[spotifyData.length - 1];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

export default function Chapter4() {
  const userPieData = [
    { name: `Free (${latest.pctFreeUsers}%)`, value: latest.freeMauM, color: "#FF9800" },
    { name: `Premium (${latest.pctPremiumUsers}%)`, value: latest.premiumSubsM, color: "#1DB954" },
  ];
  const revPieData = [
    { name: `Ad Revenue (${latest.pctAdRev}%)`, value: latest.adRevenueB, color: "#FF9800" },
    { name: `Premium Rev (${latest.pctPremiumRev}%)`, value: latest.premiumRevenueB, color: "#1DB954" },
  ];

  return (
    <div>
      <ChapterHero
        chapterNum={4}
        emoji="📊"
        gradient="linear-gradient(135deg, #2a0000 0%, #FF5252 100%)"
        title="The Ad Problem"
        sub={`${latest.pctFreeUsers}% of users generate only ${latest.pctAdRev}% of revenue. The math of giving away music to hundreds of millions of non-paying listeners is Spotify's biggest structural challenge.`}
        meta="<strong>Source:</strong> Spotify Investor Relations 2024 · <span class='dot'>·</span> Annual figures"
      />

      <div className="stats-row">
        <StatCard
          value={`${latest.freeMauM}M`}
          label="Free Users (2024)"
          sub={`${latest.pctFreeUsers}% of all listeners`}
          color="#FF9800"
        />
        <StatCard
          value={`$${latest.adRevenueB.toFixed(2)}B`}
          label="Ad Revenue (2024)"
          sub={`${latest.pctAdRev}% of total revenue`}
          color="#FF9800"
        />
        <StatCard
          value={`$${latest.premiumRevenueB.toFixed(2)}B`}
          label="Premium Revenue (2024)"
          sub={`${latest.pctPremiumRev}% of total revenue`}
          color="#1DB954"
        />
        <StatCard
          value={`${Math.round(latest.revPerPremium / latest.revPerFree)}×`}
          label="Revenue gap"
          sub="Premium vs free user value"
          color="#FF5252"
        />
        <StatCard
          value="~30%"
          label="Free-to-Premium conversion"
          sub="Industry average"
          color="#64B5F6"
        />
      </div>

      <ChartCard
        eye="CHART 4A · USER VS REVENUE SPLIT"
        title="The Ad Problem: Users vs Revenue Over Time (2018–2024)"
        sub="Bars show user counts (left axis), lines show revenue share (right axis)"
      >
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={spotifyData} margin={{ top: 10, right: 60, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="year" stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
            <YAxis
              yAxisId="left"
              stroke="#555"
              tick={{ fill: "#888", fontSize: 11 }}
              tickFormatter={(v) => `${v}M`}
              label={{ value: "Users (M)", angle: -90, position: "insideLeft", fill: "#666", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#555"
              tick={{ fill: "#888", fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 110]}
              label={{ value: "Revenue %", angle: 90, position: "insideRight", fill: "#666", fontSize: 11 }}
            />
            <Tooltip content={<DualTooltip />} />
            <Legend formatter={(value) => <span style={{ color: "#aaa" }}>{value}</span>} />
            <Bar yAxisId="left" dataKey="freeMauM" name="Free MAU (M)" fill="rgba(255,152,0,0.5)" stackId="a" />
            <Bar yAxisId="left" dataKey="premiumSubsM" name="Premium Subs (M)" fill="rgba(29,185,84,0.6)" stackId="a" />
            <Line yAxisId="right" type="monotone" dataKey="pctAdRev" name="Ad Revenue %" stroke="#FF5252" strokeWidth={2.5} dot={{ fill: "#FF5252", r: 5 }} />
            <Line yAxisId="right" type="monotone" dataKey="pctPremiumRev" name="Premium Revenue %" stroke="#1DB954" strokeWidth={2.5} strokeDasharray="6 3" dot={{ fill: "#1DB954", r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <InsightBox
        icon="⚠️"
        head="THE STRUCTURAL IMBALANCE"
        body={`In 2024, Spotify had ${latest.freeMauM}M free users and ${latest.premiumSubsM}M premium subscribers. Free users outnumber premium by ${Math.round(latest.freeMauM / latest.premiumSubsM * 10) / 10}:1 — but generate only ${Math.round(latest.adRevenueB / latest.premiumRevenueB * 100)}% of the premium revenue. Each additional free user is a bandwidth cost with marginal ad revenue return.`}
        warn
      />

      <ChartCard
        eye="CHART 4B · 2024 SNAPSHOT"
        title={`2024: ${latest.pctFreeUsers}% of Users → Only ${latest.pctAdRev}% of Revenue`}
        sub="Left: user split. Right: revenue split. Same colors, dramatically different proportions."
      >
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>USERS</p>
            <PieChart width={260} height={260}>
              <Pie
                data={userPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
              >
                {userPieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="#0f0f0f" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}M users`, ""]} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
            </PieChart>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
              {userPieData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: 11, color: "#aaa" }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ textAlign: "center", color: "#aaa", fontSize: 12, fontFamily: "monospace", letterSpacing: 1, marginBottom: 8 }}>REVENUE</p>
            <PieChart width={260} height={260}>
              <Pie
                data={revPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
              >
                {revPieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="#0f0f0f" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${v.toFixed(2)}B`, ""]} contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
            </PieChart>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
              {revPieData.map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: 11, color: "#aaa" }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ChartCard>

      <div className="cards-grid">
        <div className="info-card">
          <div className="ic">🎯</div>
          <div className="ttl">The Conversion Play</div>
          <div className="dsc">Spotify's free tier is a funnel, not a product. The goal is to hook users on the experience until they subscribe — or graduate to a family plan.</div>
        </div>
        <div className="info-card">
          <div className="ic">🌐</div>
          <div className="ttl">Ad Market Limitations</div>
          <div className="dsc">Digital audio ads command lower CPMs than display or video. Even with 350M free listeners, the ad inventory ceiling is much lower than subscription revenue.</div>
        </div>
        <div className="info-card">
          <div className="ic">📉</div>
          <div className="ttl">Artist Royalty Impact</div>
          <div className="dsc">Free streams pay lower royalties than premium streams. When ad revenue is 12% of the pool, artists who primarily attract free listeners earn less per stream.</div>
        </div>
        <div className="info-card">
          <div className="ic">🔒</div>
          <div className="ttl">The Lock-in Effect</div>
          <div className="dsc">Playlists, Discover Weekly, and Wrapped create enough switching cost that Spotify can afford to let users stay free for years while betting on eventual conversion.</div>
        </div>
      </div>
    </div>
  );
}
