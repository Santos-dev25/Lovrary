import { useState, useRef, useEffect } from "react";
import { useBooks } from "@/context/BooksContext";
import { Download, Image, Star, Quote, FileText, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { toPng } from "html-to-image";

/**
 * Converte URLs externas de imagens em Base64 Data URL local
 * contornando restrições de CORS de APIs como Google Books e Open Library.
 */
const convertToDataUrl = async (src: string): Promise<string> => {
  if (!src) return "";
  if (src.startsWith("data:")) return src;

  // 1. Tentativa com fetch direto CORS
  try {
    const res = await fetch(src, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
  } catch {}

  // 2. Tentativa com Image element em memória
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width || 300;
          canvas.height = img.naturalHeight || img.height || 450;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
            return;
          }
          reject(new Error("Canvas context indisponível"));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = src;
    });
    if (dataUrl) return dataUrl;
  } catch {}

  // 3. Fallback de alta resiliência via proxy CDN de imagens gratuito com CORS liberado (weserv.nl)
  try {
    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&default=1`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    }
  } catch (err) {
    console.warn("Falha ao converter capa para base64:", err);
  }

  return src;
};

const ExportPage = () => {
  const { books } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [format, setFormat] = useState<"card" | "text">("card");
  const [cardCoverUrl, setCardCoverUrl] = useState<string>("");
  const [loadingCover, setLoadingCover] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const reviewedBooks = books.filter(b => b.review || (b.notes && b.notes.length > 0));
  const selectedBook = books.find(b => b.id === selectedBookId);

  // Converte a capa para DataURL assim que o livro é selecionado
  useEffect(() => {
    let cancelled = false;
    if (!selectedBook?.cover) {
      setCardCoverUrl("");
      return;
    }

    setLoadingCover(true);
    convertToDataUrl(selectedBook.cover)
      .then((dataUrl) => {
        if (!cancelled) setCardCoverUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setCardCoverUrl(selectedBook.cover);
      })
      .finally(() => {
        if (!cancelled) setLoadingCover(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBook?.cover]);

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
    text += `\n— Lovrary 📖`;
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado para a área de transferência!");
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || !selectedBook) return;
    setIsExporting(true);
    const toastId = toast.loading("Renderizando card em alta definição...");

    try {
      // Garante que a capa está pronta em Data URL para evitar CORS
      let activeCover = cardCoverUrl;
      if (!activeCover && selectedBook.cover) {
        activeCover = await convertToDataUrl(selectedBook.cover);
        setCardCoverUrl(activeCover);
      }

      // Pequeno delay para garantir repaint do DOM
      await new Promise((r) => setTimeout(r, 150));

      const node = cardRef.current;
      const dataUrl = await toPng(node, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: "#521B24",
        style: {
          margin: "0",
          transform: "none",
        },
      });

      const link = document.createElement("a");
      const safeName = selectedBook.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
      link.download = `lovrary-${safeName || "acervo"}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card salvo com sucesso! 📥", { id: toastId });
    } catch (err) {
      console.error("Erro ao gerar card:", err);
      toast.error("Não foi possível gerar a imagem da capa", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-foreground">Preservar & Compartilhar Acervo</h2>
      <p className="text-sm text-muted-foreground">Gere um card visual memorável ou copie o texto da resenha e diário para compartilhar.</p>

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
            <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{book.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{book.author}</p>
            </div>
          </button>
        ))}
      </div>

      {reviewedBooks.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum livro com resenha ou diário para exportar.</p>
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
              {/* Preview card com dimensões fixas estáveis sem cortes */}
              <div
                ref={cardRef}
                className="w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-2xl relative text-left"
                style={{
                  background: "linear-gradient(145deg, #62222c 0%, #3e1219 100%)",
                  boxSizing: "border-box",
                }}
              >
                <div className="p-6 text-center">
                  <div className="relative inline-block mx-auto mb-4">
                    {loadingCover ? (
                      <div className="w-28 h-40 bg-black/20 rounded-xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
                      </div>
                    ) : (
                      <img
                        src={cardCoverUrl || selectedBook.cover}
                        alt={selectedBook.title}
                        crossOrigin="anonymous"
                        className="w-28 h-40 object-cover rounded-xl shadow-2xl mx-auto border border-white/10"
                      />
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-white leading-tight px-2">{selectedBook.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{selectedBook.author}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < selectedBook.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                    ))}
                  </div>
                </div>

                {selectedBook.review && (
                  <div className="bg-black/25 backdrop-blur-sm px-6 py-4 border-t border-b border-white/10">
                    <p className="text-xs text-white/95 italic leading-relaxed whitespace-pre-wrap">"{selectedBook.review}"</p>
                  </div>
                )}

                {selectedBook.quotes && selectedBook.quotes.length > 0 && (
                  <div className="px-6 py-3 bg-black/15">
                    <p className="text-[10px] text-white/70 flex items-center gap-1 mb-1 font-semibold uppercase tracking-wider">
                      <Quote className="w-3 h-3 text-gold" /> Citação favorita
                    </p>
                    <p className="text-xs text-white/90 italic leading-relaxed">"{selectedBook.quotes[0]}"</p>
                  </div>
                )}

                <div className="px-6 py-3.5 flex items-center justify-between border-t border-white/10 bg-black/30">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs font-display font-bold tracking-wider text-white">Lovrary</span>
                  </div>
                  {selectedBook.vibes.length > 0 && (
                    <div className="flex gap-1.5">
                      {selectedBook.vibes.slice(0, 2).map(v => (
                        <span key={v} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">{v}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDownloadCard}
                disabled={isExporting || loadingCover}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-marsala text-primary-foreground text-sm font-semibold mx-auto shadow-card hover:shadow-card-hover transition-all disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Baixar Card (PNG)</span>
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
                  {"\n\n"}— Lovrary 📖
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
