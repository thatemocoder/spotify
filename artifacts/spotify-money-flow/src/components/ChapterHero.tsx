import Reveal from "@/components/Reveal";

interface Props {
  chapterNum: number;
  title: string;
  sub: string;
  meta?: string;
}

export default function ChapterHero({ chapterNum, title, sub, meta }: Props) {
  const pad = String(chapterNum).padStart(2, "0");
  return (
    <div className="chap-header">
      <div className="chap-num-big">{pad}</div>
      <Reveal direction="fade" delay={0}>
        <div className="chap-tag">
          CHAPTER {pad} OF 05
        </div>
      </Reveal>
      <Reveal direction="up" delay={80}>
        <h2 className="chap-title">{title}</h2>
      </Reveal>
      <Reveal direction="up" delay={160}>
        <p className="chap-intro">{sub}</p>
      </Reveal>
      {meta && (
        <Reveal direction="fade" delay={240}>
          <div className="chap-source">
            <span dangerouslySetInnerHTML={{ __html: meta }} />
          </div>
        </Reveal>
      )}
    </div>
  );
}
