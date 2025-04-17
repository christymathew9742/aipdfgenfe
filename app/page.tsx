import Image from "next/image";
import GeminiChat from "./components/GeminiChat";
import PdfTextExtractor from "./components/pdfcon";

export default function Home() {
  return (
    <main>
      <GeminiChat />
      {/* <PdfTextExtractor/> */}
    </main>
  );
}


