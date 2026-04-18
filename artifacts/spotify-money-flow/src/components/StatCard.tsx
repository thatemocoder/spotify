import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  value: string;
  label: string;
  sub?: string;
  color?: string;
}

function parseValue(raw: string): { prefix: string; num: number; suffix: string; decimals: number } | null {
  const m = raw.match(/^([^0-9]*)([0-9]+\.?[0-9]*)([^0-9.]*)$/);
  if (!m) return null;
  const num = parseFloat(m[2]);
  if (isNaN(num)) return null;
  const decimals = (m[2].split(".")[1] ?? "").length;
  return { prefix: m[1], num, suffix: m[3], decimals };
}

function AnimatedValue({ raw, color }: { raw: string; color: string }) {
  const parsed = parseValue(raw);
  const [triggered, setTriggered] = useState(false);
  const countStr = useCountUp(parsed?.num ?? 0, 1400, triggered, parsed?.decimals ?? 0);

  if (!parsed) {
    return <div className="sv" style={{ color }}>{raw}</div>;
  }

  return (
    <div className="sv" style={{ color, display: "flex", alignItems: "baseline", gap: 1 }}>
      <span>{parsed.prefix}</span>
      <CountTrigger onVisible={() => setTriggered(true)} value={countStr} />
      <span>{parsed.suffix}</span>
    </div>
  );
}

function CountTrigger({
  onVisible,
  value,
}: {
  onVisible: () => void;
  value: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          onVisible();
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onVisible]);

  return <span ref={ref}>{value}</span>;
}

export default function StatCard({ value, label, sub, color = "#1DB954" }: Props) {
  return (
    <div className="stat-card">
      <AnimatedValue raw={value} color={color} />
      <div className="sl">{label}</div>
      {sub && <div className="ss">{sub}</div>}
    </div>
  );
}
