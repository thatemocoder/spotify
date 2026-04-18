import Reveal from "@/components/Reveal";

interface Props {
  icon: string;
  head: string;
  body: string;
  warn?: boolean;
}

export default function InsightBox({ icon, head, body, warn = false }: Props) {
  return (
    <Reveal direction="left" delay={40}>
      <div className={warn ? "warn" : "insight"}>
        <div className="ins-icon">{icon}</div>
        <div>
          <div className="ins-head">{head}</div>
          <div className="ins-body">{body}</div>
        </div>
      </div>
    </Reveal>
  );
}
