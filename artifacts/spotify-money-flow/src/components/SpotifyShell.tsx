import { useState } from "react";

interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  id: number;
}

const navItems: NavItem[] = [
  { icon: "📈", label: "Industry Revenue", id: 0 },
  { icon: "🎧", label: "Streaming Rise", id: 1 },
  { icon: "💵", label: "Where $1 Goes", id: 2 },
  { icon: "📊", label: "The Ad Problem", id: 3 },
  { icon: "🎤", label: "Artist Reality", id: 4 },
];

interface Props {
  currentChapter: number;
  onChapterChange: (id: number) => void;
  children: React.ReactNode;
}

export default function SpotifyShell({ currentChapter, onChapterChange, children }: Props) {
  const [progress] = useState(42);
  
  const chapters = [
    { emoji: "📈", name: "Industry Revenue", sub: "RIAA Data 1980–2024" },
    { emoji: "🎧", name: "Streaming Rise", sub: "The Format Shift" },
    { emoji: "💵", name: "Where $1 Goes", sub: "Money Flow" },
    { emoji: "📊", name: "The Ad Problem", sub: "Free vs Premium" },
    { emoji: "🎤", name: "Artist Reality", sub: "Who Actually Gets Paid?" },
  ];

  const current = chapters[currentChapter];

  return (
    <div className="spo-shell">
      {/* Sidebar */}
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
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentChapter === item.id ? "active" : ""}`}
              onClick={() => onChapterChange(item.id)}
            >
              <span className="ni">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span className="nb">{item.badge}</span>}
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

      {/* Main content */}
      <main className="spo-main" style={{ background: "var(--surface)" }}>
        {/* Topbar */}
        <div className="topbar">
          <div className="tb-arrows">
            <button
              className="tb-btn"
              onClick={() => onChapterChange(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
              style={{ opacity: currentChapter === 0 ? 0.4 : 1 }}
            >
              ‹
            </button>
            <button
              className="tb-btn"
              onClick={() => onChapterChange(Math.min(navItems.length - 1, currentChapter + 1))}
              disabled={currentChapter === navItems.length - 1}
              style={{ opacity: currentChapter === navItems.length - 1 ? 0.4 : 1 }}
            >
              ›
            </button>
          </div>
          <div className="chapter-pill">
            CHAPTER {currentChapter + 1} / {navItems.length}
          </div>
        </div>

        {children}
        <div className="spo-pad" />
      </main>

      {/* Now-playing bar */}
      <footer className="spo-bar">
        <div className="bar-left">
          <div className="bar-art" style={{ fontSize: "24px" }}>{current.emoji}</div>
          <div>
            <div className="bar-tname">{current.name}</div>
            <div className="bar-tsub">{current.sub}</div>
          </div>
        </div>
        <div className="bar-center">
          <div className="bar-ctrls">
            <button className="bar-btn" onClick={() => onChapterChange(Math.max(0, currentChapter - 1))}>⏮</button>
            <button className="bar-btn big" onClick={() => onChapterChange((currentChapter + 1) % navItems.length)}>▶</button>
            <button className="bar-btn" onClick={() => onChapterChange(Math.min(navItems.length - 1, currentChapter + 1))}>⏭</button>
          </div>
          <div className="bar-prog">
            <span className="bar-time">{String(Math.floor(currentChapter * 3.5)).padStart(1,"0")}:{String(Math.round((currentChapter * 3.5 % 1) * 60)).padStart(2,"0")}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(currentChapter / (navItems.length - 1)) * 100}%` }} />
            </div>
            <span className="bar-time">14:00</span>
          </div>
        </div>
        <div className="bar-right">
          <button className="bar-btn" style={{ fontSize: "13px" }}>🔊</button>
          <div className="vol-bar"><div className="vol-fill" /></div>
        </div>
      </footer>
    </div>
  );
}
