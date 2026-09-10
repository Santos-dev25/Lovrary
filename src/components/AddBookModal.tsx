import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, BookOpen, Star, Loader2, PenLine } from "lucide-react";
import { useBooks } from "@/context/BooksContext";
import type { Book } from "@/data/mockBooks";
import { searchGoogleBooks, type GoogleBookItem } from "@/lib/googleBooks";

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
  const [mode, setMode] = useState<"search" | "manual">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const { addBook, books } = useBooks();

  // Manual form state
  const [manualTitle, setManualTitle] = useState("");
  const [manualAuthor, setManualAuthor] = useState("");
  const [manualPages, setManualPages] = useState("");
  const [manualCategory, setManualCategory] = useState("Ficção");
  const [manualCover, setManualCover] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError("");
    try {
      const { items, error: searchErr } = await searchGoogleBooks(query.trim(), 20);
      if (searchErr) {
        setError(searchErr);
      }
      setResults(items);
    } catch (err) {
      console.error("Google Books error:", err);
      setError("Erro ao buscar livros. Tente novamente ou adicione manualmente.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (item: GoogleBookItem, ownership: "tenho" | "pretendo") => {
    const v = item.volumeInfo;
    const cover =
      v.imageLinks?.thumbnail?.replace("http://", "https://") ||
      v.imageLinks?.smallThumbnail?.replace("http://", "https://") ||
      "";
    const rawCategory = v.categories?.[0] || "Outros";
    const category = categoryMap[rawCategory] || rawCategory;

    const newBook: Book = {
      id: "", // será gerado pelo banco
      title: v.title,
      author: v.authors?.join(", ") || "Autor desconhecido",
      cover,
      rating: 0,
      category,
      vibes: [],
      ownership,
      status: "nao-lido",
      totalPages: v.pageCount || 0,
      currentPage: 0,
    };
    addBook(newBook);
  };

  const handleManualAdd = (ownership: "tenho" | "pretendo") => {
    if (!manualTitle.trim()) return;
    const newBook: Book = {
      id: "", // será gerado pelo banco
      title: manualTitle.trim(),
      author: manualAuthor.trim() || "Autor desconhecido",
      cover: manualCover.trim() || "",
      rating: 0,
      category: manualCategory,
      vibes: [],
      ownership,
      status: "nao-lido",
      totalPages: parseInt(manualPages) || 0,
      currentPage: 0,
    };
    addBook(newBook);
    setManualTitle("");
    setManualAuthor("");
    setManualPages("");
    setManualCover("");
    setManualCategory("Ficção");
  };

  const isAdded = (googleId: string) => {
    // Match by title (não temos mais ID estável)
    const item = results.find(r => r.id === googleId);
    if (!item) return false;
    return books.some(b => b.title === item.volumeInfo.title);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-marsala" />
            Adicionar Livro
          </DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setMode("search")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all ${
              mode === "search"
                ? "gradient-marsala text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-4 h-4" /> Buscar Online
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md transition-all ${
              mode === "manual"
                ? "gradient-marsala text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenLine className="w-4 h-4" /> Adicionar Manual
          </button>
        </div>

        {mode === "search" ? (
          <>
            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); searchBooks(); }} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar no Google Books..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30 transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 gradient-marsala text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
              </button>
            </form>

            {/* Results */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-marsala" />
                  <span className="ml-2 text-sm text-muted-foreground">Buscando...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8 space-y-3">
                  <p className="text-sm text-destructive">{error}</p>
                  <button
                    onClick={() => setMode("manual")}
                    className="text-sm font-medium text-marsala hover:underline"
                  >
                    Adicionar manualmente →
                  </button>
                </div>
              )}

              {!loading && !error && searched && results.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">Nenhum livro encontrado. Tente outro termo.</p>
                </div>
              )}

              {!loading && !error && results.map((item) => {
                const v = item.volumeInfo;
                const cover = v.imageLinks?.thumbnail?.replace("http://", "https://") || "";
                const added = isAdded(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                  >
                    {cover ? (
                      <img src={cover} alt={v.title} className="w-14 h-20 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-14 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{v.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {v.authors?.join(", ") || "Autor desconhecido"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {v.pageCount ? `${v.pageCount} págs` : ""}
                        {v.categories ? ` · ${v.categories[0]}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {added ? (
                        <span className="text-xs text-marsala font-medium px-2 py-1">✓ Adicionado</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAdd(item, "tenho")}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium gradient-marsala text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Plus className="w-3 h-3" /> Tenho
                          </button>
                          <button
                            onClick={() => handleAdd(item, "pretendo")}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-marsala text-marsala rounded-lg hover:bg-marsala/10 transition-colors"
                          >
                            <Star className="w-3 h-3" /> Quero ter
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {!searched && !loading && !error && (
                <div className="text-center py-12 space-y-2">
                  <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground text-sm">
                    Pesquise um livro para adicioná-lo à sua coleção
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Manual Mode */
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Título *</label>
                <input
                  type="text"
                  placeholder="Nome do livro"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
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
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
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
                    className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Categoria</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
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
                  className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                />
              </div>

              {/* Preview */}
              {manualTitle && (
                <div className="flex gap-3 p-3 rounded-xl border border-border bg-secondary/30">
                  {manualCover ? (
                    <img src={manualCover} alt={manualTitle} className="w-14 h-20 object-cover rounded-lg shrink-0" />
                  ) : (
                    <div className="w-14 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">{manualTitle}</h4>
                    <p className="text-xs text-muted-foreground">{manualAuthor || "Autor desconhecido"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {manualPages ? `${manualPages} págs · ` : ""}{manualCategory}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleManualAdd("tenho")}
                  disabled={!manualTitle.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium gradient-marsala text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Tenho
                </button>
                <button
                  onClick={() => handleManualAdd("pretendo")}
                  disabled={!manualTitle.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-marsala text-marsala rounded-xl hover:bg-marsala/10 transition-colors disabled:opacity-50"
                >
                  <Star className="w-4 h-4" /> Quero ter
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
