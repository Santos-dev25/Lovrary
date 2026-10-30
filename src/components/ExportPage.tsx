import { useState, useRef, useEffect, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { Download, Image, Star, Quote, FileText, Loader2, Sparkles, Database, FileSpreadsheet, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import RatingStars from "@/components/RatingStars";

/**
 * Converte URLs externas de imagens em Base64 Data URL local
 * contornando restricoes de CORS de APIs como Google Books e Open Library.
 */
const convertToDataUrl = async (src: string): Promise<string> => {
  if (!src) return "";
  if (src.startsWith("data:")) return src;

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
          reject(new Error("Canvas context indisponivel"));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = src;
    });
    if (dataUrl) return dataUrl;
  } catch {}

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

  const reviewedBooks = useMemo(
    () => books.filter(b => b.review || (b.notes && b.notes.length > 0) || b.rating > 0),
    [books]
  );

  useEffect(() => {
    if (!selectedBookId && reviewedBooks.length > 0) {
      setSelectedBookId(reviewedBooks[0].id);
    }
  }, [reviewedBooks, selectedBookId]);

  const selectedBook = books.find(b => b.id === selectedBookId);

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

  const totalNotesCount = useMemo(
    () => books.reduce((sum, b) => sum + (b.notes?.length || 0), 0),
    [books]
  );

  const totalQuotesCount = useMemo(
    () => books.reduce((sum, b) => sum + (b.quotes?.length || 0), 0),
    [books]
  );

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lovrary-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Backup completo em JSON exportado com sucesso! 📦");
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Título", "Autor", "Categoria", "Status", "Posse", "Páginas Totais", "Página Atual", "Avaliação", "Data Conclusão"];
    const rows = books.map(b => [
      `"${b.id}"`,
      `"${(b.title || "").replace(/"/g, '""')}"`,
      `"${(b.author || "").replace(/"/g, '""')}"`,
      `"${(b.category || "").replace(/"/g, '""')}"`,
      `"${b.status}"`,
      `"${b.ownership}"`,
      b.totalPages || 0,
      b.currentPage || 0,
      b.rating || 0,
      `"${b.dateFinished || ""}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lovrary-acervo-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Planilha CSV do acervo gerada com sucesso! 📊");
  };

  const formattedTextContent = useMemo(() => {
    if (!selectedBook) return "";
    const lines: string[] = [];
    lines.push(`📚 ${selectedBook.title}`);
    lines.push(`✍️ ${selectedBook.author}`);
    lines.push(`⭐ ${selectedBook.rating}/5`);
    lines.push("");
    if (selectedBook.review) {
      lines.push("📝 Resenha:");
      lines.push(selectedBook.review);
      lines.push("");
    }
    if (selectedBook.quotes && selectedBook.quotes.length > 0) {
      lines.push("💬 Citações:");
      selectedBook.quotes.forEach(q => lines.push(`"${q}"`));
      lines.push("");
    }
    if (selectedBook.notes && selectedBook.notes.length > 0) {
      lines.push("📖 Journal:");
      selectedBook.notes.forEach(n => lines.push(`${n.date} às ${n.time} — ${n.chapter}: ${n.text}`));
      lines.push("");
    }
    lines.push("— Lovrary • Biblioteca Pessoal 📖");
    return lines.join("\n");
  }, [selectedBook]);

  const handleCopyText = () => {
    if (!formattedTextContent) return;
    navigator.clipboard.writeText(formattedTextContent);
    toast.success("Texto copiado para a área de transferência!");
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current || !selectedBook) return;
    setIsExporting(true);
    const toastId = toast.loading("Renderizando card em alta definição...");

    try {
      let activeCover = cardCoverUrl;
      if (!activeCover && selectedBook.cover) {
        activeCover = await convertToDataUrl(selectedBook.cover);
        setCardCoverUrl(activeCover);
      }

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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Preservar & Compartilhar Acervo</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
          Seus dados pertencem a você. Exporte seus registros em formatos universais ou crie cartões visuais para compartilhar.
        </p>
      </div>

      {/* 1. Backup & Data Sovereign Export Card */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-7 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Preservação & Soberania dos Dados
            </h3>
            <p className="text-xs text-muted-foreground font-sans">
              Faça o download completo dos seus livros, notas do diário e citações para armazenamento seguro e portabilidade.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 py-2 border-y border-border/60 text-center font-numeric">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{books.length}</p>
            <p className="text-[11px] text-muted-foreground font-sans">Livros no Total</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{totalNotesCount}</p>
            <p className="text-[11px] text-muted-foreground font-sans">Entradas no Journal</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{totalQuotesCount}</p>
            <p className="text-[11px] text-muted-foreground font-sans">Citações Salvas</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleExportJSON}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-xs sm:text-sm font-semibold transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Exportar em JSON (Completo)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-xs sm:text-sm font-semibold transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileSpreadsheet className="w-4 h-4 text-success" />
            <span>Exportar em CSV (Planilha)</span>
          </button>
        </div>
      </div>

      {/* 2. Social Media Visual Card Studio */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground">
            Estúdio de Cartões Literários
          </h3>
        </div>

        {/* Book Selector Pills/Grid */}
        {reviewedBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {reviewedBooks.map(book => (
              <button
                key={book.id}
                onClick={() => setSelectedBookId(book.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedBookId === book.id
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40"
                }`}
              >
                <div className="w-9 aspect-[2/3] rounded-md overflow-hidden shrink-0 shadow-2xs border border-border/40 bg-secondary/30">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 pr-1">
                  <p translate="no" className="notranslate text-xs font-semibold text-foreground truncate" title={book.title}>
                    {book.title}
                  </p>
                  <p translate="no" className="notranslate text-[10px] text-muted-foreground truncate">
                    {book.author || "Autor desconhecido"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border p-6 space-y-2">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-xs text-muted-foreground font-sans">
              Nenhum livro com resenha, nota ou avaliação para gerar cartões sociais.
            </p>
          </div>
        )}

        {selectedBook && (
          <div className="space-y-4 pt-2">
            {/* Format selector tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("card")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  format === "card"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                <Image className="w-4 h-4" /> Card Visual (PNG)
              </button>
              <button
                onClick={() => setFormat("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  format === "text"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                }`}
              >
                <Copy className="w-4 h-4" /> Texto Formatado
              </button>
            </div>

            {format === "card" ? (
              <div className="space-y-4">
                {/* Visual Card Canvas */}
                <div
                  ref={cardRef}
                  className="w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden shadow-2xl relative text-left border border-white/10"
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
                          className="w-28 h-40 object-cover rounded-xl shadow-2xl mx-auto border border-white/15"
                        />
                      )}
                    </div>
                    <h3
                      translate="no"
                      className="notranslate font-serif font-bold text-xl text-white leading-tight px-2"
                    >
                      {selectedBook.title}
                    </h3>
                    <p translate="no" className="notranslate text-sm text-white/80 mt-1 font-sans">
                      {selectedBook.author}
                    </p>
                    {selectedBook.rating > 0 && (
                      <div className="flex justify-center mt-3">
                        <RatingStars value={selectedBook.rating} size="md" showValue readOnly />
                      </div>
                    )}
                  </div>

                  {selectedBook.review && (
                    <div className="bg-black/25 backdrop-blur-sm px-6 py-4 border-t border-b border-white/10">
                      <p
                        translate="no"
                        className="notranslate text-xs text-white/95 font-serif italic leading-relaxed whitespace-pre-wrap"
                      >
                        "{selectedBook.review}"
                      </p>
                    </div>
                  )}

                  {selectedBook.quotes && selectedBook.quotes.length > 0 && (
                    <div className="px-6 py-3 bg-black/15">
                      <p className="text-[10px] text-white/70 flex items-center gap-1 mb-1 font-semibold uppercase tracking-wider font-sans">
                        <Quote className="w-3 h-3 text-gold" /> Citação marcante
                      </p>
                      <p
                        translate="no"
                        className="notranslate text-xs text-white/90 font-serif italic leading-relaxed"
                      >
                        "{selectedBook.quotes[0]}"
                      </p>
                    </div>
                  )}

                  <div className="px-6 py-3.5 flex items-center justify-between border-t border-white/10 bg-black/30">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      <span className="text-xs font-serif font-bold tracking-wider text-white">Lovrary</span>
                    </div>
                    {selectedBook.vibes && selectedBook.vibes.length > 0 && (
                      <div className="flex gap-1.5">
                        {selectedBook.vibes.slice(0, 2).map(v => (
                          <span key={v} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white/90">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleDownloadCard}
                  disabled={isExporting || loadingCover}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold mx-auto shadow-card hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Baixar Card Social (PNG)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5 shadow-xs">
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {formattedTextContent}
                  </pre>
                </div>
                <button
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold mx-auto hover:bg-primary/90 transition-opacity shadow-xs"
                >
                  <Copy className="w-4 h-4" /> Copiar Texto
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPage;
