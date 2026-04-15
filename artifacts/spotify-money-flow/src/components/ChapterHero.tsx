interface Props {
  emoji: string;
  gradient: string;
  title: string;
  sub: string;
  meta?: string;
  chapterNum: number;
}

export default function ChapterHero({ emoji, gradient, title, sub, meta, chapterNum }: Props) {
  return (
    <div className="chap-hero">
      <div className="chap-art" style={{ background: gradient }}>
        {emoji}
      </div>
      <div>
        <div className="chap-type">DATA STORY · CHAPTER {chapterNum}</div>
        <div className="chap-title">{title}</div>
        <div className="chap-sub">{sub}</div>
        {meta && (
          <div className="chap-meta">
            <span dangerouslySetInnerHTML={{ __html: meta }} />
          </div>
        )}
      </div>
    </div>
  );
}
