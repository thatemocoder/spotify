interface Props {
  value: string;
  label: string;
  sub?: string;
  color?: string;
}

export default function StatCard({ value, label, sub, color = "#1DB954" }: Props) {
  return (
    <div className="stat-card">
      <div className="sv" style={{ color }}>{value}</div>
      <div className="sl">{label}</div>
      {sub && <div className="ss">{sub}</div>}
    </div>
  );
}
