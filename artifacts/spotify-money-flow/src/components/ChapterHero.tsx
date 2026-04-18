interface Props {
  chapterNum: number;
  emoji: string;
  gradient?: string;
  title: string;
  sub: string;
  meta?: string;
}

export default function ChapterHero({ chapterNum, emoji, title, sub, meta }: Props) {
  const pad = String(chapterNum).padStart(2, "0");
  return (
    <div className="chap-header">
      <div className="chap-num-big">{pad}</div>
      <div className="chap-tag">
        {emoji} &nbsp; CHAPTER {pad} OF 05
      </div>
      <h2 className="chap-title">{title}</h2>
      <p className="chap-intro">{sub}</p>
      {meta && (
        <div className="chap-source">
          <span dangerouslySetInnerHTML={{ __html: meta }} />
        </div>
      )}
    </div>
  );
}
