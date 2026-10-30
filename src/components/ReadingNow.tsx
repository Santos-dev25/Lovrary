import { useState, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Bookmark, Check, Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ReadingNowProps {
  fullView?: boolean;
}

const ReadingNow = ({ fullView }: ReadingNowProps) => {
  const { books, setSelectedBook, updateProgress, startReading } = useBooks();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const candidates = useMemo(
    () => books.filter((b) => b.ownership === "tenho" && b.status !== "lendo"),
    [books]
  );

  const filteredCandidates = useMemo(() => {
    if (!pickerSearch.trim()) return candidates;
    const q = pickerSearch.toLowerCase();
    return candidates.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }, [candidates, pickerSearch]);

  const currentlyReading = useMemo(() => books.filter((b) => b.status === "lendo"), [books]);
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({});

  const handleSavePage = (bookId: string, total: number, title: string) => {
    const raw = pageInputs[bookId];
    const page = parseInt(raw);
    if (!isNaN(page) && page >= 0) {
      const finalPage = Math.min(page, total || page);
      updateProgress(bookId, finalPage);
      setPageInputs((p) => ({ ...p, [bookId]: "" }));
      toast.success(`Progresso de "${title}" atualizado para pág. ${finalPage}!`);
    }
  };

  const PickerModal = () => (
    <AnimatePresence>
      {pickerOpen && (
        <div
          className="fixed inset-0 z-[110] bg-foreground/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <div>
                <h4 className="font-serif font-bold text-base text-foreground">Iniciar Nova Leitura</h4>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">Escolha um livro da sua estante para começar</p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar seletor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por título ou autor..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto p-3 space-y-1.5 max-h-[50vh]">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground font-sans">
                  {candidates.length === 0 ? "Nenhum livro disponível no acervo." : "Nenhum livro correspondente encontrado."}
                </div>
              ) : (
                filteredCandidates.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      startReading(b.id);
                      setPickerOpen(false);
                      setPickerSearch("");
                      toast.success(`Leitura de "${b.title}" iniciada! 📖`);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-secondary text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 aspect-[2/3] rounded-md overflow-hidden shrink-0 shadow-2xs border border-border/40 bg-secondary/30">
                        <img src={b.cover} alt={b.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p translate="no" className="notranslate text-xs sm:text-sm font-serif font-semibold text-foreground truncate">{b.title}</p>
                        <p translate="no" className="notranslate text-[11px] text-muted-foreground truncate">{b.author || "Autor desconhecido"}</p>
                        {b.totalPages ? (
                          <span className="text-[10px] text-muted-foreground font-numeric">{b.totalPages} págs</span>
                        ) : null}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 shadow-2xs">
                      Ler agora
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  if (currentlyReading.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Lendo Agora</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">Santuário de leitura ativa e ritmo presente.</p>
          </div>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Iniciar Leitura
          </button>
        </div>

        <div className="bg-card rounded-2xl border border-dashed border-border p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-secondary text-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-foreground text-base sm:text-lg">Nenhum livro em leitura no momento</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
            Sua biblioteca pessoal está à espera. Escolha uma obra do seu acervo para iniciar uma nova jornada literária.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shadow-xs"
          >
            <Plus className="w-4 h-4" /> Escolher Livro da Estante
          </button>
        </div>
        <PickerModal />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Lendo Agora</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
            {currentlyReading.length} obra(s) em andamento na sua escrivaninha.
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>

      <PickerModal />

      <div className="space-y-4">
        {currentlyReading.map((book, i) => {
          const remainingPages = Math.max(0, (book.totalPages || 0) - (book.currentPage || 0));

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all ${
                fullView ? "p-5 sm:p-6" : "p-4 sm:p-5"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* 2:3 Cover thumbnail (no 3D spine effect) */}
                <div
                  className="w-24 sm:w-28 md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shrink-0 shadow-card border border-border/50 cursor-pointer bg-secondary/30 group mx-auto sm:mx-0"
                  onClick={() => setSelectedBook(book)}
                  title={`Ver detalhes de ${book.title}`}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      translate="no"
                      className="notranslate font-serif font-bold text-lg sm:text-xl text-foreground truncate cursor-pointer hover:text-primary transition-colors text-center sm:text-left"
                      onClick={() => setSelectedBook(book)}
                    >
                      {book.title}
                    </h3>
                    <p
                      translate="no"
                      className="notranslate text-xs sm:text-sm text-muted-foreground font-sans mt-0.5 text-center sm:text-left"
                    >
                      por <span className="text-foreground font-medium">{book.author || "Autor desconhecido"}</span>
                      {book.category ? ` • ${book.category}` : ""}
                    </p>

                    {/* Progress details */}
                    <div className="mt-3.5 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-numeric">
                        <span className="text-muted-foreground">
                          Página {book.currentPage || 0} de {book.totalPages || "?"}{" "}
                          {book.totalPages ? `• Faltam ${remainingPages} pág(s)` : ""}
                        </span>
                        <span className="font-bold text-primary">{book.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${book.progress || 0}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Page Updater Inline */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min={0}
                        max={book.totalPages || undefined}
                        placeholder="Atualizar página atual..."
                        value={pageInputs[book.id] ?? ""}
                        onChange={(e) =>
                          setPageInputs((p) => ({ ...p, [book.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSavePage(book.id, book.totalPages || 0, book.title);
                          }
                        }}
                        className="w-full text-xs px-3 py-2 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-numeric"
                      />
                    </div>
                    <button
                      onClick={() => handleSavePage(book.id, book.totalPages || 0, book.title)}
                      disabled={!pageInputs[book.id]}
                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="text-xs font-medium px-3.5 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors text-center"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                  {/* Latest Note preview */}
                  {book.notes && book.notes.length > 0 && (
                    <div className="pt-2 border-t border-border/60 flex items-start gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground font-sans line-clamp-1">
                        <span className="font-semibold text-foreground">
                          {book.notes[book.notes.length - 1].chapter}:
                        </span>{" "}
                        <span className="font-serif italic text-foreground/90">
                          "{book.notes[book.notes.length - 1].text}"
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingNow;
