import SpotifyShell from "@/components/SpotifyShell";
import Chapter1 from "@/pages/Chapter1";
import Chapter2 from "@/pages/Chapter2";
import Chapter3 from "@/pages/Chapter3";
import Chapter4 from "@/pages/Chapter4";
import Chapter5 from "@/pages/Chapter5";

function ChapterSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="chapter-section">
      {children}
    </section>
  );
}

function App() {
  return (
    <SpotifyShell>
      <ChapterSection id="chapter-1">
        <Chapter1 />
      </ChapterSection>

      <div className="chapter-divider">
        <span className="chapter-divider-label">CHAPTER 2</span>
      </div>

      <ChapterSection id="chapter-2">
        <Chapter2 />
      </ChapterSection>

      <div className="chapter-divider">
        <span className="chapter-divider-label">CHAPTER 3</span>
      </div>

      <ChapterSection id="chapter-3">
        <Chapter3 />
      </ChapterSection>

      <div className="chapter-divider">
        <span className="chapter-divider-label">CHAPTER 4</span>
      </div>

      <ChapterSection id="chapter-4">
        <Chapter4 />
      </ChapterSection>

      <div className="chapter-divider">
        <span className="chapter-divider-label">CHAPTER 5</span>
      </div>

      <ChapterSection id="chapter-5">
        <Chapter5 />
      </ChapterSection>
    </SpotifyShell>
  );
}

export default App;
