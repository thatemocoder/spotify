interface Props {
  text: string;
  attr?: string;
}

export default function PullQuote({ text, attr }: Props) {
  return (
    <div className="pull-quote">
      <div className="pq-mark">&ldquo;</div>
      <p className="pq-text">{text}</p>
      {attr && <p className="pq-attr">{attr}</p>}
    </div>
  );
}
