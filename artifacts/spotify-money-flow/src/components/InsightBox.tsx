interface Props {
  icon: string;
  head: string;
  body: string;
  warn?: boolean;
}

export default function InsightBox({ icon, head, body, warn = false }: Props) {
  return (
    <div className={warn ? "warn" : "insight"}>
      <div className="ins-icon">{icon}</div>
      <div>
        <div className="ins-head">{head}</div>
        <div className="ins-body">{body}</div>
      </div>
    </div>
  );
}
