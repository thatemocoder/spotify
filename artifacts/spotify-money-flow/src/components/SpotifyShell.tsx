import { useEffect, useState, useRef } from "react";

const navItems = [
  { icon: "📈", label: "Industry Revenue", id: "chapter-1" },
  { icon: "🎧", label: "Streaming Rise", id: "chapter-2" },
  { icon: "💵", label: "Where $1 Goes", id: "chapter-3" },
  { icon: "📊", label: "The Ad Problem", id: "chapter-4" },
  { icon: "🎤", label: "Artist Reality", id: "chapter-5" },
];

interface Props {
  children: React.ReactNode;
}

export default function SpotifyShell({ children }: Props) {
  const [activeSection, setActiveSection] = useState("chapter-1");
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight > clientHeight
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 0;
      setScrollProgress(pct);

      // Find which chapter is most visible
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section && section.getBoundingClientRect().top <= 120) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const main = mainRef.current;
    if (el && main) {
      main.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  return (
    <div className="spo-page">
      {/* Fixed sidebar */}
      <aside className="spo-sidebar">
        <div className="spo-logo">
          <div className="mark">♪</div>
          <div>
            <div className="wm">Money Flow</div>
            <div className="tg">SPOTIFY · DATA STORY</div>
          </div>
        </div>

        <div className="nav-section">
          <span className="nav-label">Chapters</span>
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => scrollTo(item.id)}
            >
              <span className="ni">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span className="nav-num">{idx + 1}</span>
            </button>
          ))}
        </div>

        <div className="divider" />

        <div className="nav-section">
          <span className="nav-label">Sources</span>
          <div className="src-chip">
            <div className="sc-l">DATA SOURCE</div>
            <div className="sc-n">RIAA U.S. Sales Database</div>
          </div>
          <div className="src-chip">
            <div className="sc-l">DATA SOURCE</div>
            <div className="sc-n">Spotify Investor Relations</div>
          </div>
          <div className="src-chip">
            <div className="sc-l">DATA SOURCE</div>
            <div className="sc-n">Loud & Clear 2024</div>
          </div>
          <div className="src-chip">
            <div className="sc-l">DATA SOURCE</div>
            <div className="sc-n">MIDiA Research</div>
          </div>
        </div>

        <div className="sidebar-foot">
          SPOTIFY MONEY FLOW<br />
          DATA STORY · 2024
        </div>
      </aside>

      {/* Scrollable main */}
      <div className="spo-content" ref={mainRef}>
        {/* Sticky top progress bar */}
        <div className="scroll-topbar">
          <div className="scroll-topbar-inner">
            <span className="scroll-topbar-label">SPOTIFY MONEY FLOW</span>
            <div className="scroll-progress-track">
              <div
                className="scroll-progress-fill"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="scroll-topbar-pct">{Math.round(scrollProgress)}%</span>
          </div>
        </div>

        {/* Hero banner */}
        <div className="page-hero">
          <div className="page-hero-eyebrow">INTERACTIVE DATA STORY</div>
          <h1 className="page-hero-title">Spotify Money Flow</h1>
          <p className="page-hero-sub">
            Where does the money go? From your $9.99/month subscription to the artist's bank account — 
            a data-driven investigation into the economics of streaming music.
          </p>
          <div className="page-hero-meta">
            5 chapters · RIAA · Spotify IR · MIDiA Research · Loud & Clear 2024
          </div>
          <button className="page-hero-cta" onClick={() => scrollTo("chapter-1")}>
            Start Reading ↓
          </button>
        </div>

        {/* Chapter content */}
        {children}

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-logo">♪ Money Flow</div>
          <p className="footer-text">
            Data sourced from RIAA U.S. Sales Database, Spotify Technology S.A. Investor Relations, 
            MIDiA Research, and Spotify Loud &amp; Clear 2024. All figures approximate.
          </p>
          <p className="footer-copy">Spotify Money Flow · Data Story · 2024</p>
        </footer>
      </div>
    </div>
  );
}
