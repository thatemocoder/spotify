import { useState } from "react";
import SpotifyShell from "@/components/SpotifyShell";
import Chapter1 from "@/pages/Chapter1";
import Chapter2 from "@/pages/Chapter2";
import Chapter3 from "@/pages/Chapter3";
import Chapter4 from "@/pages/Chapter4";
import Chapter5 from "@/pages/Chapter5";

const chapters = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5];

function App() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const CurrentPage = chapters[currentChapter];

  return (
    <SpotifyShell currentChapter={currentChapter} onChapterChange={setCurrentChapter}>
      <CurrentPage />
    </SpotifyShell>
  );
}

export default App;
