import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Plus, BookOpen, Star, Loader2, PenLine, Zap, ArrowUpRight } from "lucide-react";
import { useBooks } from "@/context/BooksContext";
import type { Book } from "@/data/mockBooks";
import { searchGoogleBooks, sanitizeCoverUrl, type GoogleBookItem } from "@/lib/googleBooks";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

const categoryMap: Record<string, string> = {
  Fiction: "Ficção",
  Fantasy: "Fantasia",
  Romance: "Romance",
  Horror: "Terror",
  "Science Fiction": "Ficção Científica",
  Mystery: "Suspense",
  Thriller: "Suspense",
  Biography: "Biografia",
  History: "História",
  "Self-Help": "Autoajuda",
};

const categoryOptions = [
  "Ficção", "Fantasia", "Romance", "Terror", "Ficção Científica",
  "Suspense", "Biografia", "História", "Autoajuda", "Outros",
];

const AddBookModal = ({ open, onClose }: AddBookModalProps) => {
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [searchType, setSearchType] = useState<"normal" | "deep">("normal");
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isManualAdding, setIsManualAdding] = useState(false);
  const { addBook, books } = useBooks();

  // Manual form state
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");
  const [manualPages, setManualPages] = useState("");
  const [manualCategory, setManualCategory] = useState("Ficção");
  const [manualCover, setManualCover] = useState("");

  const searchBooks = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSearched(true);
    setError("");
    setResults([]);
    try {
      const { items, error: searchErr } = await searchGoogleBooks(query.trim(), {
        maxResults: 20,
        startIndex: 0,
        searchType,
      });
      if (searchErr && items.length === 0) {
        setError(searchErr);
      }
      setResults(items);
      setHasMore(items.length >= 20);
    } catch (err) {
      console.error("Google Books error:", err);
      setError("Erro ao buscar livros. Tente novamente ou adicione manualmente.");
      setResults([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBooks = async () => {
    if (!query.trim() || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextIndex = results.length;
      const { items, error: searchErr } = await searchGoogleBooks(query.trim(), {
        maxResults: 20,
        startIndex: nextIndex,
        searchType,
      });
      if (items.length > 0) {
        setResults((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = items.filter((item) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setHasMore(items.length >= 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn("Erro ao carregar mais livros:", err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAdd = async (
    item: GoogleBookItem,
    ownership: "tenho" | "pretendo",
    initialStatus: Book["status"] = "nao-lido"
  ) => {
    if (addingId) return;
    setAddingId(item.id);
    const v = item.volumeInfo;
    const cover = sanitizeCoverUrl(
      v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || ""
    );
    const rawCategory = v.categories?.[0] || "Outros";
    const category = categoryMap[rawCategory] || rawCategory;

    const newBook: Book = {
      id: "", // gerado pelo banco
      title: String(v.title || "").trim().slice(0, 250),
      author: Array.isArray(v.authors) ? v.authors.join(", ").slice(0, 150) : "Autor desconhecido",
      cover,
      rating: 0,
      category,
      vibes: [],
      ownership,
      status: initialStatus,
      totalPages: Math.max(0, Math.min(Number(v.pageCount) || 0, 100000)),
      currentPage: 0,
    };
    try {
      await addBook(newBook);
    } finally {
      setAddingId(null);
    }
  };

  const handleManualAdd = async (
    ownership: "tenho" | "pretendo",
    initialStatus: Book["status"] = "nao-lido"
  ) => {
    if (!manualTitle.trim() || isManualAdding) return;
    setIsManualAdding(true);
    const safeTitle = manualTitle.trim().slice(0, 250);
    const safeAuthor = (manualAuthor.trim() || "Autor desconhecido").slice(0, 150);
    const safePages = Math.max(0, Math.min(parseInt(manualPages) || 0, 100000));
    const safeCover = sanitizeCoverUrl(manualCover);

    const newBook: Book = {
      id: "", // gerado pelo banco
      title: safeTitle,
      author: safeAuthor,
      cover: safeCover,
      rating: 0,
      category: manualCategory,
      vibes: [],
      ownership,
      status: initialStatus,
      totalPages: safePages,
      currentPage: 0,
    };
    try {
      await addBook(newBook);
      setManualTitle("");
      setManualAuthor("");
      setManualPages("");
      setManualCover("");
      setManualCategory("Ficção");
      onClose();
    } finally {
      setIsManualAdding(false);
    }
  };

  const isAdded = (googleId: string) => {
    const item = results.find(r => r.id === googleId);
    if (!item) return false;
    return books.some(b => b.title.toLowerCase() === (item.volumeInfo.title || "").toLowerCase());
  };

  const renderModalContent = () => (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1">
        <button
          onClick={() => setMode("search")}
          className={`flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium py-2 rounded-lg transition-all ${
            mode === "search"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Search className="w-4 h-4" /> Buscar Online
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium py-2 rounded-lg transition-all ${
            mode === "manual"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PenLine className="w-4 h-4" /> Adicionar Manual
        </button>
      </div>

      {mode === "search" ? (
        <div className="space-y-3.5">
          {/* Search Type Selector */}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs text-muted-foreground font-medium">Modo de pesquisa:</span>
            <div className="inline-flex p-0.5 rounded-lg bg-secondary border border-border text-xs">
              <button
                type="button"
                onClick={() => setSearchType("normal")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  searchType === "normal"
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Busca direta, extremamente rápida e leve"
              >
                <Search className="w-3 h-3 text-primary" />
                <span>Normal</span>
              </button>
              <button
                type="button"
                onClick={() => setSearchType("deep")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  searchType === "deep"
                    ? "bg-primary text-primary-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Busca direcionada por título com descarte de resumos/guias"
              >
                <Zap className="w-3 h-3 text-gold" />
                <span>Aprofundada</span>
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={(e) => { e.preventDefault(); searchBooks(); }} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder={searchType === "deep" ? "Buscar título exato (Aprofundada)..." : "Buscar no Google Books..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={120}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </button>
          </form>

          {/* Results List */}
          <div className="max-h-[50vh] sm:max-h-[55vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Buscando no Google Books...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-8 space-y-3 bg-secondary/30 rounded-xl p-4 border border-border">
                <p className="text-sm text-destructive">{error}</p>
                <button
                  onClick={() => setMode("manual")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Adicionar manualmente →
                </button>
              </div>
            )}

            {!loading && !error && searched && results.length === 0 && (
              <div className="text-center py-12 bg-secondary/20 rounded-xl p-6 border border-dashed border-border">
                <p className="text-muted-foreground text-sm">Nenhum livro encontrado para esta busca.</p>
                <p className="text-xs text-muted-foreground mt-1">Verifique a ortografia ou adicione manualmente.</p>
              </div>
            )}

            {!loading && !error && results.map((item) => {
              const v = item.volumeInfo;
              const cover = v.imageLinks?.thumbnail?.replace("http://", "https://") || "";
              const added = isAdded(item.id);

              return (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors shadow-2xs"
                >
                  {cover ? (
                    <img src={cover} alt={v.title} className="w-14 h-20 aspect-[2/3] object-cover rounded-lg border border-border/80 shrink-0 bg-secondary" />
                  ) : (
                    <div className="w-14 h-20 aspect-[2/3] bg-secondary rounded-lg border border-border/80 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">{v.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {v.authors?.join(", ") || "Autor desconhecido"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {v.pageCount ? `${v.pageCount} págs` : ""}
                      {v.categories ? ` · ${v.categories[0]}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                    {added ? (
                      <span className="text-xs text-primary font-semibold px-2 py-1">✓ Adicionado</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAdd(item, "tenho")}
                          disabled={addingId === item.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-opacity disabled:opacity-50 shadow-2xs"
                        >
                          {addingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                          <span>{addingId === item.id ? "Adicionando..." : "Tenho"}</span>
                        </button>
                        <button
                          onClick={() => handleAdd(item, "pretendo")}
                          disabled={addingId === item.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground border border-border rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
                        >
                          {addingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Star className="w-3 h-3 text-gold" />
                          )}
                          <span>{addingId === item.id ? "Adicionando..." : "Quero ter"}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Load More Button */}
            {!loading && !error && results.length > 0 && hasMore && (
              <div className="pt-2 pb-1 text-center">
                <button
                  type="button"
                  onClick={loadMoreBooks}
                  disabled={loadingMore}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-2xs"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Carregando mais livros...</span>
                    </>
                  ) : (
                    <span>Carregar Mais Livros</span>
                  )}
                </button>
              </div>
            )}

            {!searched && !loading && !error && (
              <div className="text-center py-12 space-y-2">
                <BookOpen className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                <p className="text-muted-foreground text-sm">
                  Pesquise um livro por título, autor ou ISBN para adicioná-lo
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Manual Mode */
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Título *</label>
            <input
              type="text"
              placeholder="Nome do livro"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              maxLength={250}
              className="w-full px-3.5 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Autor</label>
            <input
              type="text"
              placeholder="Nome do autor"
              value={manualAuthor}
              onChange={(e) => setManualAuthor(e.target.value)}
              maxLength={150}
              className="w-full px-3.5 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Páginas</label>
              <input
                type="number"
                placeholder="Total de páginas"
                value={manualPages}
                onChange={(e) => setManualPages(e.target.value)}
                min={1}
                max={100000}
                className="w-full px-3.5 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Categoria</label>
              <select
                value={manualCategory}
                onChange={(e) => setManualCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              URL da Capa (opcional)
            </label>
            <input
              type="url"
              placeholder="https://exemplo.com/capa.jpg"
              value={manualCover}
              onChange={(e) => setManualCover(e.target.value)}
              maxLength={1000}
              className="w-full px-3.5 py-2.5 bg-card border border-input rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors shadow-2xs"
            />
          </div>

          {/* Preview */}
          {manualTitle && (
            <div className="flex gap-3 p-3 rounded-xl border border-border bg-secondary/40 shadow-2xs">
              {manualCover ? (
                <img src={manualCover} alt={manualTitle} className="w-14 h-20 aspect-[2/3] object-cover rounded-lg border border-border/80 shrink-0 bg-secondary" />
              ) : (
                <div className="w-14 h-20 aspect-[2/3] bg-secondary rounded-lg border border-border/80 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground truncate">{manualTitle}</h4>
                <p className="text-xs text-muted-foreground">{manualAuthor || "Autor desconhecido"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {manualPages ? `${manualPages} págs · ` : ""}{manualCategory}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => handleManualAdd("tenho", "nao-lido")}
              disabled={!manualTitle.trim() || isManualAdding}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xs"
            >
              {isManualAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>{isManualAdding ? "Adicionando..." : "Tenho (Acervo)"}</span>
            </button>
            <button
              onClick={() => handleManualAdd("pretendo", "nao-lido")}
              disabled={!manualTitle.trim() || isManualAdding}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium bg-secondary text-secondary-foreground border border-border rounded-xl hover:bg-secondary/80 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isManualAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 text-gold" />}
              <span>{isManualAdding ? "Adicionando..." : "Quero ter"}</span>
            </button>
            <button
              onClick={() => handleManualAdd("tenho", "emprestado")}
              disabled={!manualTitle.trim() || isManualAdding}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium bg-card text-foreground border border-border rounded-xl hover:bg-secondary active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isManualAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
              <span>{isManualAdding ? "Adicionando..." : "Peguei Emprestado"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
        <DrawerContent className="max-h-[92vh] flex flex-col bg-card border-border">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Adicionar Livro
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderModalContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-border p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold flex items-center gap-2 text-foreground">
            <BookOpen className="w-5 h-5 text-primary" />
            Adicionar Livro
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1">
          {renderModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
