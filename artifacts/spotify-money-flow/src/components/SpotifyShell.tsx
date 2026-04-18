import { useEffect, useRef, useState } from "react";

const chapters = [
  { id: "chapter-1", label: "Industry Revenue" },
  { id: "chapter-2", label: "Streaming Rise" },
  { id: "chapter-3", label: "Where $1 Goes" },
  { id: "chapter-4", label: "The Ad Problem" },
  { id: "chapter-5", label: "Artist Reality" },
];

interface Props {
  children: React.ReactNode;
}

export default function SpotifyShell({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setScrolled(scrollTop > 20);
      const pct = scrollHeight > clientHeight
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 0;
      setProgress(pct);

      let current: string | null = null;
      for (const ch of chapters) {
        const sec = document.getElementById(ch.id);
        if (sec && sec.getBoundingClientRect().top <= 100) {
          current = ch.id;
        }
      }
      setActiveChapter(current);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const scroller = scrollRef.current;
    if (el && scroller) {
      scroller.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    }
  };

  const activeLabel = activeChapter
    ? chapters.find((c) => c.id === activeChapter)?.label
    : null;
  const activeIdx = activeChapter
    ? chapters.findIndex((c) => c.id === activeChapter)
    : -1;

  return (
    <div className="story-scroll" ref={scrollRef}>
      {/* Fixed top nav */}
      <nav className={`story-topnav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-mark">♪</div>
            <div>
              <div className="nav-title">Spotify Money Flow</div>
              <div className="nav-subtitle">DATA STORY · 2024</div>
            </div>
          </div>
          <div className={`nav-chapter-pill ${activeLabel ? "active" : ""}`}>
            {activeLabel
              ? `${String(activeIdx + 1).padStart(2, "0")} — ${activeLabel.toUpperCase()}`
              : "INTERACTIVE DATA STORY"}
          </div>
        </div>
        <div className="nav-progress-bar" style={{ width: `${progress}%` }} />
      </nav>

      {/* Fixed left chapter progress */}
      <aside className="story-left">
        <div className="left-line" />
        <div className="left-dots">
          {chapters.map((ch, i) => (
            <div
              key={ch.id}
              className={`left-dot-wrap ${activeChapter === ch.id ? "active" : ""}`}
              onClick={() => scrollTo(ch.id)}
              title={ch.label}
            >
              <div className="left-dot" />
              <div className="left-dot-num">0{i + 1}</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="story-body">
        {children}
      </div>
    </div>
  );
}
