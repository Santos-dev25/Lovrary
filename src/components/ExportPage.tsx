import { useState, useRef } from "react";
import { useBooks } from "@/context/BooksContext";
import { Download, Image, Star, Quote, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { toPng } from "html-to-image";

const ExportPage = () => {
  const { books } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [format, setFormat] = useState<"card" | "text">("card");
  const cardRef = useRef<HTMLDivElement>(null);

  const reviewedBooks = books.filter(b => b.review || (b.notes && b.notes.length > 0));
  const selectedBook = books.find(b => b.id === selectedBookId);

  const handleCopyText = () => {
    if (!selectedBook) return;
    let text = `📚 ${selectedBook.title}\n`;
    text += `✍️ ${selectedBook.author}\n`;
    text += `⭐ ${selectedBook.rating}/5\n\n`;
    if (selectedBook.review) text += `📝 Resenha:\n${selectedBook.review}\n\n`;
    if (selectedBook.quotes && selectedBook.quotes.length > 0) {
      text += `💬 Citações Favoritas:\n`;
      selectedBook.quotes.forEach(q => text += `"${q}"\n`);
      text += "\n";
    }
    if (selectedBook.notes && selectedBook.notes.length > 0) {
      text += `📖 Journal:\n`;
      selectedBook.notes.forEach(n => text += `${n.date} às ${n.time} — ${n.chapter}: ${n.text}\n`);
    }
    text += `\n— Lovrary • Diário de Leitura 📖`;
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado para a área de transferência!");
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || !selectedBook) return;
    try {
      toast.loading("Gerando imagem...", { id: "dl" });
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "transparent",
      });
      const link = document.createElement("a");
      const safeName = selectedBook.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
      link.download = `lovrary-${safeName}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card baixado! 📥", { id: "dl" });
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível gerar a imagem", { id: "dl" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-foreground">Exportar Resenhas</h2>
      <p className="text-sm text-muted-foreground">Gere um card visual ou copie o texto da resenha para compartilhar.</p>

      {/* Book selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {reviewedBooks.map(book => (
          <button
            key={book.id}
            onClick={() => setSelectedBookId(book.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              selectedBookId === book.id
                ? "border-marsala bg-secondary shadow-sm"
                : "border-border bg-card hover:border-marsala/30"
            }`}
          >
            <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{book.title}</p>
              <p className="text-[10px] text-muted-foreground">{book.author}</p>
            </div>
          </button>
        ))}
      </div>

      {reviewedBooks.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum livro com resenha para exportar.</p>
        </div>
      )}

      {selectedBook && (
        <>
          {/* Format selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setFormat("card")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                format === "card" ? "gradient-marsala text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              <Image className="w-4 h-4" /> Card Visual
            </button>
            <button
              onClick={() => setFormat("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                format === "text" ? "gradient-marsala text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              <FileText className="w-4 h-4" /> Texto
            </button>
          </div>

          {format === "card" ? (
            <div className="space-y-4">
              {/* Preview card */}
              <div
                ref={cardRef}
                className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl"
                style={{ background: "linear-gradient(135deg, hsl(348 52% 30%), hsl(348 40% 45%))" }}
              >
                <div className="p-6 text-center">
                  <img src={selectedBook.cover} alt={selectedBook.title} className="w-24 h-36 object-cover rounded-xl mx-auto shadow-lg mb-4" />
                  <h3 className="font-display font-bold text-lg text-white">{selectedBook.title}</h3>
                  <p className="text-sm text-white/70 mt-1">{selectedBook.author}</p>
                  <div className="flex justify-center gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < selectedBook.rating ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`} />
                    ))}
                  </div>
                </div>
                {selectedBook.review && (
                  <div className="bg-white/10 backdrop-blur px-6 py-4">
                    <p className="text-xs text-white/90 italic leading-relaxed line-clamp-4">"{selectedBook.review}"</p>
                  </div>
                )}
                {selectedBook.quotes && selectedBook.quotes.length > 0 && (
                  <div className="px-6 py-3">
                    <p className="text-[10px] text-white/60 flex items-center gap-1 mb-1">
                      <Quote className="w-3 h-3" /> Citação favorita
                    </p>
                    <p className="text-xs text-white/80 italic">"{selectedBook.quotes[0]}"</p>
                  </div>
                )}
                <div className="px-6 py-3 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] tracking-wider font-display font-semibold text-white/75">LOVRARY • DIÁRIO LITERÁRIO</span>
                  {selectedBook.vibes.length > 0 && (
                    <div className="flex gap-1">
                      {selectedBook.vibes.slice(0, 2).map(v => (
                        <span key={v} className="text-[9px] px-2 py-0.5 rounded-full bg-white/15 text-white/70">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDownloadCard}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-marsala text-primary-foreground text-sm font-medium mx-auto shadow-card hover:shadow-card-hover transition-shadow"
              >
                <Download className="w-4 h-4" /> Baixar Card (PNG)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-body leading-relaxed">
                  📚 {selectedBook.title}{"\n"}
                  ✍️ {selectedBook.author}{"\n"}
                  ⭐ {selectedBook.rating}/5{"\n\n"}
                  {selectedBook.review && `📝 Resenha:\n${selectedBook.review}\n\n`}
                  {selectedBook.quotes && selectedBook.quotes.length > 0 && (
                    <>💬 Citações:{"\n"}{selectedBook.quotes.map(q => `"${q}"`).join("\n")}{"\n\n"}</>
                  )}
                  {selectedBook.notes && selectedBook.notes.length > 0 && (
                    <>📖 Journal:{"\n"}{selectedBook.notes.map(n => `${n.date} às ${n.time} — ${n.chapter}: ${n.text}`).join("\n")}</>
                  )}
                  {"\n\n"}— Lovrary • Diário de Leitura 📖
                </pre>
              </div>
              <button
                onClick={handleCopyText}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-marsala text-primary-foreground text-sm font-medium mx-auto"
              >
                <Download className="w-4 h-4" /> Copiar Texto
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExportPage;
