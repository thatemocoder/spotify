import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

interface Props {
  head: string;
  body: string;
  warn?: boolean;
}

export default function InsightBox({ head, body, warn = false }: Props) {
  return (
    <Reveal direction="left" delay={40}>
      <div className={warn ? "warn" : "insight"}>
        <div className="ins-icon">
          <Icon
            name={warn ? "alert-triangle" : "info"}
            size={22}
            color={warn ? "var(--red)" : "var(--green)"}
          />
        </div>
        <div>
          <div className="ins-head">{head}</div>
          <div className="ins-body">{body}</div>
        </div>
      </div>
    </Reveal>
  );
}
