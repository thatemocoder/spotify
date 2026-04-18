import { useEffect, useRef } from "react";
import SpotifyShell from "@/components/SpotifyShell";
import Chapter1 from "@/pages/Chapter1";
import Chapter2 from "@/pages/Chapter2";
import Chapter3 from "@/pages/Chapter3";
import Chapter4 from "@/pages/Chapter4";
import Chapter5 from "@/pages/Chapter5";

function App() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.classList.add("hero-ready");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const scroller = document.querySelector(".story-scroll");
    if (el && scroller) {
      (scroller as HTMLElement).scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    }
  };

  return (
    <SpotifyShell>
      {/* ── HERO ── */}
      <section className="story-hero" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-eyebrow">INTERACTIVE DATA STORY · 2024</div>
          <h1 className="hero-title">Spotify<br /><em>Money Flow</em></h1>
          <div className="hero-sub-title">Who really gets paid?</div>
          <p className="hero-body">
            From your $9.99 monthly subscription to the artist's bank account — 
            a data-driven investigation into the economics of streaming music, 
            using RIAA, Spotify IR, and MIDiA Research data.
          </p>
          <div className="hero-meta">
            5 CHAPTERS · RIAA · SPOTIFY IR · MIDIA RESEARCH · LOUD & CLEAR 2024
          </div>
          <button className="hero-cta" onClick={() => scrollTo("chapter-1")}>
            Scroll down
          </button>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ── CHAPTERS ── */}
      <section id="chapter-1"><Chapter1 /></section>
      <div className="chapter-divider" />
      <section id="chapter-2"><Chapter2 /></section>
      <div className="chapter-divider" />
      <section id="chapter-3"><Chapter3 /></section>
      <div className="chapter-divider" />
      <section id="chapter-4"><Chapter4 /></section>
      <div className="chapter-divider" />
      <section id="chapter-5"><Chapter5 /></section>

      {/* ── FOOTER ── */}
      <footer className="story-footer" style={{ opacity: 1 }}>
        <div className="footer-logo">♪ Money Flow</div>
        <p className="footer-text">
          Data sourced from RIAA U.S. Sales Database, Spotify Technology S.A. Investor Relations,
          MIDiA Research, and Spotify Loud &amp; Clear 2024. All figures approximate and for
          illustrative/educational purposes.
        </p>
        <p className="footer-copy">SPOTIFY MONEY FLOW · DATA STORY · 2024</p>
      </footer>
    </SpotifyShell>
  );
}

export default App;
