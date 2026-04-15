interface Props {
  eye?: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}

export default function ChartCard({ eye, title, sub, children }: Props) {
  return (
    <div className="chart-card">
      {eye && <div className="cc-eye">{eye}</div>}
      <div className="cc-title">{title}</div>
      {sub && <div className="cc-sub">{sub}</div>}
      {children}
    </div>
  );
}
