import { useEffect, useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { vibeOptions, categoryOptions, mockBooks } from "@/data/mockBooks";
import { searchGoogleBooks } from "@/lib/googleBooks";
import {
  X, Star, Bookmark, Quote, Plus, Trash2,
  CheckCircle, Play, Tag, Calendar, Sparkles, PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const BookDetailModal = () => {
  const {
    selectedBook: book, setSelectedBook, addNote, addReview, addQuote,
    removeQuote, setRating, setSubRating, startReading, finishReading,
    updateProgress, moveToAcervo, addVibe, removeVibe, addToQueue,
    updateBook, deleteBook, deleteNote, books, addBook
  } = useBooks();

  const [activeSection, setActiveSection] = useState<"info" | "journal" | "review">("info");
  const [noteText, setNoteText] = useState("");
  const [noteChapter, setNoteChapter] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [quoteText, setQuoteText] = useState("");
  const [newSubLabel, setNewSubLabel] = useState("");
  const [newSubRating, setNewSubRating] = useState(5);
  const [showAddSub, setShowAddSub] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const [totalPagesInput, setTotalPagesInput] = useState("");
  const [newVibe, setNewVibe] = useState("");
  const [showAddVibe, setShowAddVibe] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [customGenreInput, setCustomGenreInput] = useState("");
  const [confirmDeleteBook, setConfirmDeleteBook] = useState(false);

  const [recs, setRecs] = useState<{ id: string; title: string; author: string; cover: string }[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const bookId = book?.id;
  const bookCategory = book?.category;
  const bookAuthor = book?.author;
  const bookTitle = book?.title;

  // Recommendations: Search with cache / smart fallback
  useEffect(() => {
    let cancelled = false;
    if (!bookId) { setRecs([]); return; }
    
    const query = bookCategory ? `subject:${bookCategory}` : (bookAuthor || "");
    if (!query) return;

    setRecsLoading(true);
    searchGoogleBooks(query, 8)
      .then(({ items }) => {
        if (cancelled) return;
        const onlineRecs = (items || [])
          .map((it) => ({
            id: it.id,
            title: it.volumeInfo?.title || "",
            author: it.volumeInfo?.authors?.join(", ") || "",
            cover: it.volumeInfo?.imageLinks?.thumbnail || it.volumeInfo?.imageLinks?.smallThumbnail || "",
          }))
          .filter((r) => r.cover && r.title && r.title.toLowerCase() !== (bookTitle || "").toLowerCase())
          .slice(0, 6);

        if (onlineRecs.length > 0) {
          setRecs(onlineRecs);
        } else {
          // Fallback from catalog
          const localRecs = [...books, ...mockBooks]
            .filter(b => b.title.toLowerCase() !== (bookTitle || "").toLowerCase())
            .filter(b => (bookCategory && b.category === bookCategory) || (bookAuthor && b.author === bookAuthor))
            .map(b => ({ id: b.id, title: b.title, author: b.author, cover: b.cover }))
            .slice(0, 6);
          setRecs(localRecs);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const localRecs = [...books, ...mockBooks]
          .filter(b => b.title.toLowerCase() !== (bookTitle || "").toLowerCase())
          .filter(b => (bookCategory && b.category === bookCategory) || (bookAuthor && b.author === bookAuthor))
          .map(b => ({ id: b.id, title: b.title, author: b.author, cover: b.cover }))
          .slice(0, 6);
        setRecs(localRecs);
      })
      .finally(() => {
        if (!cancelled) setRecsLoading(false);
      });

    return () => { cancelled = true; };
  }, [bookId, bookCategory, bookAuthor, bookTitle, books]);

  // Sync page input placeholder when book changes
  useEffect(() => {
    if (book) {
      setPageInput("");
      setTotalPagesInput(book.totalPages ? String(book.totalPages) : "");
    }
  }, [book?.id]);

  if (!book) return null;

  const allClassifications = Array.from(
    new Set([...categoryOptions, ...books.map(b => b.category).filter(Boolean) as string[]])
  ).sort((a, b) => a.localeCompare(b));

  const handleDeleteBookConfirm = () => {
    deleteBook(book.id);
    setConfirmDeleteBook(false);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addNote(book.id, {
      date,
      time,
      chapter: noteChapter.trim() || `Pág. ${book.currentPage || 0}`,
      text: noteText.trim(),
    });
    setNoteText("");
    setNoteChapter("");
  };

  const handleSaveReview = () => {
    if (!reviewText.trim()) return;
    addReview(book.id, reviewText.trim());
  };

  const handleAddQuote = () => {
    if (!quoteText.trim()) return;
    addQuote(book.id, quoteText.trim());
    setQuoteText("");
  };

  const handleUpdatePage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 0) {
      updateProgress(book.id, page);
      setPageInput("");
    }
  };

  const handleUpdateTotalPages = () => {
    const total = parseInt(totalPagesInput);
    if (!isNaN(total) && total > 0) {
      updateBook(book.id, { totalPages: total });
      toast.success(`Total de páginas atualizado para ${total}`);
    }
  };

  const handleAddCustomVibe = () => {
    if (!newVibe.trim()) return;
    addVibe(book.id, newVibe.trim());
    setNewVibe("");
    setShowAddVibe(false);
  };

  const handleAddCustomSubRating = () => {
    if (!newSubLabel.trim()) return;
    setSubRating(book.id, newSubLabel.trim(), newSubRating);
    setNewSubLabel("");
    setNewSubRating(5);
    setShowAddSub(false);
  };

  const handleSelectGenre = (cat: string) => {
    updateBook(book.id, { category: cat });
    setGenreDropdownOpen(false);
    toast.success(`Classificação definida para "${cat}"`);
  };

  const handleAddCustomGenre = () => {
    if (!customGenreInput.trim()) return;
    updateBook(book.id, { category: customGenreInput.trim() });
    setCustomGenreInput("");
    setGenreDropdownOpen(false);
    toast.success(`Classificação definida para "${customGenreInput.trim()}"`);
  };

  const handleAddRecToWishlist = (rec: { title: string; author: string; cover: string }) => {
    addBook({
      id: "",
      title: rec.title,
      author: rec.author,
      cover: rec.cover,
      rating: 0,
      category: book.category || "Outros",
      vibes: [],
      ownership: "pretendo",
      status: "nao-lido",
      totalPages: 0,
      currentPage: 0,
    });
  };

  const sections = [
    { id: "info" as const, label: "Detalhes" },
    { id: "journal" as const, label: "Jornal" },
    { id: "review" as const, label: "Resenha" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-4 sm:py-8 px-2 sm:px-4"
        onClick={() => setSelectedBook(null)}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24 }}
          className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-3xl overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 p-4 sm:p-6 border-b border-border relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-xl shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 translate="no" className="notranslate font-display font-bold text-xl text-foreground">
                    {book.title}
                  </h2>
                  <p translate="no" className="notranslate text-sm text-muted-foreground mt-0.5">
                    {book.author || "Autor desconhecido"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setConfirmDeleteBook(true)}
                    className="p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
                    aria-label="Excluir livro do acervo"
                    title="Excluir livro do acervo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Fechar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setRating(book.id, i + 1)} title={`Avaliar ${i + 1} estrelas`}>
                    <Star className={`w-5 h-5 transition-colors ${i < book.rating ? "fill-gold text-gold" : "text-muted hover:text-gold/50"}`} />
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-2">{book.rating}/5</span>
              </div>

              {/* Status, Ownership & Integrated Genre/Classification */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  book.status === "lido" ? "bg-marsala text-primary-foreground" :
                  book.status === "lendo" ? "bg-gold text-foreground" :
                  "bg-secondary text-secondary-foreground"
                }`}>
                  {book.status === "lido" ? "Lido" : book.status === "lendo" ? "Lendo" : "Não lido"}
                </span>

                <span className={`text-xs font-medium px-3 py-1 rounded-full border border-border ${
                  book.ownership === "tenho" ? "bg-secondary text-foreground" : "bg-card text-muted-foreground"
                }`}>
                  {book.ownership === "tenho" ? "📚 Na estante" : "💫 Pretendo ter"}
                </span>

                {/* Integrated Genre / Classification Button */}
                <div className="relative">
                  <button
                    onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-marsala/40 bg-marsala/10 text-marsala hover:bg-marsala hover:text-primary-foreground transition-all"
                    title="Classificação / Gênero principal"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{book.category || "Definir classificação"}</span>
                  </button>

                  {genreDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl p-3 w-56 space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Classificações</p>
                      <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                        {allClassifications.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleSelectGenre(cat)}
                            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                              book.category === cat ? "bg-marsala text-primary-foreground font-semibold" : "hover:bg-secondary text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-border flex gap-1">
                        <input
                          type="text"
                          placeholder="Nova classificação..."
                          value={customGenreInput}
                          onChange={(e) => setCustomGenreInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddCustomGenre()}
                          className="flex-1 text-xs px-2 py-1 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground"
                        />
                        <button
                          onClick={handleAddCustomGenre}
                          className="text-xs px-2 py-1 bg-marsala text-primary-foreground rounded-md"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-3.5">
                {book.ownership === "pretendo" && (
                  <button
                    onClick={() => moveToAcervo(book.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-marsala text-primary-foreground hover:bg-marsala-light transition-colors shadow-sm"
                  >
                    Mover para Acervo
                  </button>
                )}
                {book.status === "nao-lido" && book.ownership === "tenho" && (
                  <>
                    <button
                      onClick={() => startReading(book.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3 h-3" /> Começar a Ler
                    </button>
                    <button
                      onClick={() => addToQueue(book.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors border border-border"
                    >
                      Adicionar à Fila
                    </button>
                  </>
                )}
                {book.status === "lendo" && (
                  <button
                    onClick={() => finishReading(book.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-marsala text-primary-foreground hover:bg-marsala-light transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Marcar como Lido
                  </button>
                )}
                {book.status === "lido" && (
                  <button
                    onClick={() => startReading(book.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors border border-border"
                  >
                    Relendo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Delete Book Confirmation Banner */}
          {confirmDeleteBook && (
            <div className="bg-destructive/10 border-b border-destructive/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
              <div>
                <p className="text-xs font-semibold text-destructive">
                  Tem certeza que deseja excluir "{book.title}"?
                </p>
                <p className="text-[11px] text-muted-foreground">
                  O livro será removido de todas as abas (Acervo, Lendo agora, Fila, Histórico e Metas).
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDeleteBookConfirm}
                  className="text-xs font-medium px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sim, excluir livro
                </button>
                <button
                  onClick={() => setConfirmDeleteBook(false)}
                  className="text-xs font-medium px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Progress Tracker (Active during reading or viewing progress) */}
          {book.status === "lendo" && (
            <div className="px-4 sm:px-6 py-3 border-b border-border bg-secondary/30">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Pág. {book.currentPage || 0} de {book.totalPages || 0}
                    </span>
                    <span className="font-semibold text-marsala">{book.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-marsala rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(book.progress || 0, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Pág."
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdatePage()}
                    className="w-20 px-2.5 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                  <button
                    onClick={handleUpdatePage}
                    disabled={!pageInput}
                    className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-medium disabled:opacity-40"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-border bg-secondary/10">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-1 text-sm font-medium py-3 transition-colors border-b-2 ${
                  activeSection === s.id
                    ? "border-marsala text-marsala font-semibold bg-card"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 max-h-[52vh] overflow-y-auto">
            {/* 1. DETALHES SECTION */}
            {activeSection === "info" && (
              <div className="space-y-6">
                {/* Boas vibrações (Vibes) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-marsala" /> Boas vibrações
                    </h4>
                    <button
                      onClick={() => setShowAddVibe(!showAddVibe)}
                      className="text-xs font-medium text-marsala hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar tag
                    </button>
                  </div>

                  {showAddVibe && (
                    <div className="flex items-center gap-2 mb-3 bg-secondary/40 p-2.5 rounded-xl border border-border">
                      <input
                        placeholder="Nome da tag (ex: Conforto, Suspense)..."
                        value={newVibe}
                        onChange={(e) => setNewVibe(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddCustomVibe()}
                        className="text-xs px-3 py-1.5 bg-card border border-border rounded-lg flex-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                        autoFocus
                      />
                      <button
                        onClick={handleAddCustomVibe}
                        disabled={!newVibe.trim()}
                        className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-medium disabled:opacity-40"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setShowAddVibe(false)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Active and preset tags with add/delete support */}
                  <div className="flex flex-wrap gap-1.5">
                    {/* Active vibes on book (can be removed/excluded with X) */}
                    {book.vibes.map((vibe) => (
                      <span
                        key={vibe}
                        translate="no"
                        className="notranslate group text-xs px-3 py-1 rounded-full bg-marsala text-primary-foreground border border-marsala flex items-center gap-1.5 shadow-sm"
                      >
                        <span>{vibe}</span>
                        <button
                          onClick={() => removeVibe(book.id, vibe)}
                          className="opacity-70 hover:opacity-100 hover:bg-marsala-light rounded-full p-0.5 transition-opacity"
                          title="Excluir tag"
                          aria-label={`Excluir tag ${vibe}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Inactive suggestion vibes (click to add) */}
                    {vibeOptions
                      .filter((v) => !book.vibes.some((vb) => vb.toLowerCase() === v.toLowerCase()))
                      .map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() => addVibe(book.id, vibe)}
                          className="text-xs px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground hover:border-marsala/40 hover:text-foreground transition-all"
                        >
                          + {vibe}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Específicas (Sub-ratings with + and delete) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold" /> Específicas
                    </h4>
                    <button
                      onClick={() => setShowAddSub(!showAddSub)}
                      className="text-xs font-medium text-marsala hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nova categoria
                    </button>
                  </div>

                  {showAddSub && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 bg-secondary/40 p-3 rounded-xl border border-border">
                      <input
                        placeholder="Nome da categoria (ex: Intenso, Plot Twist)..."
                        value={newSubLabel}
                        onChange={(e) => setNewSubLabel(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-card border border-border rounded-lg flex-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                        autoFocus
                      />
                      <div className="flex items-center gap-1 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} type="button" onClick={() => setNewSubRating(i + 1)}>
                            <Star className={`w-4 h-4 ${i < newSubRating ? "fill-gold text-gold" : "text-muted"}`} />
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleAddCustomSubRating}
                          disabled={!newSubLabel.trim()}
                          className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-medium disabled:opacity-40"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setShowAddSub(false)}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {(book.subRatings || []).map((sub) => (
                      <div key={sub.label} className="flex items-center justify-between gap-3 bg-secondary/30 px-3 py-2 rounded-xl border border-border">
                        <span translate="no" className="notranslate text-xs font-medium text-foreground min-w-[100px]">
                          {sub.label}
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setSubRating(book.id, sub.label, i + 1)}
                              title={`Nota ${i + 1}`}
                            >
                              <Star className={`w-4 h-4 transition-colors ${i < sub.value ? "fill-gold text-gold" : "text-muted hover:text-gold/50"}`} />
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            updateBook(book.id, {
                              subRatings: (book.subRatings || []).filter((sr) => sr.label !== sub.label),
                            })
                          }
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-md"
                          aria-label="Excluir categoria específica"
                          title="Excluir categoria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {(!book.subRatings || book.subRatings.length === 0) && !showAddSub && (
                      <p className="text-xs text-muted-foreground py-1">
                        Nenhuma avaliação específica ainda. Clique em "+ Nova categoria" para adicionar!
                      </p>
                    )}
                  </div>
                </div>

                {/* Total Pages Editing */}
                <div className="bg-secondary/20 p-3.5 rounded-xl border border-border">
                  <h4 className="text-xs font-semibold text-foreground mb-1.5">Número de páginas do livro</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Ex: 384"
                      value={totalPagesInput}
                      onChange={(e) => setTotalPagesInput(e.target.value)}
                      className="w-28 text-xs px-3 py-1.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                    />
                    <button
                      onClick={handleUpdateTotalPages}
                      className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 border border-border font-medium"
                    >
                      Salvar total
                    </button>
                  </div>
                </div>

                {/* Retroatividade de Datas de Leitura */}
                <div className="bg-secondary/20 p-3.5 rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-marsala" />
                    <h4 className="text-sm font-semibold text-foreground">Data e ano de leitura</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Registre a data em que concluiu a leitura (inclusive livros lidos em anos anteriores).
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="date"
                      value={book.dateFinished || ""}
                      onChange={(e) => updateBook(book.id, { dateFinished: e.target.value })}
                      className="text-xs px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                    />
                    {book.dateFinished && (
                      <button
                        onClick={() => updateBook(book.id, { dateFinished: undefined })}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Limpar data
                      </button>
                    )}
                  </div>
                </div>

                {/* Recomendações: "Pessoas que leram esse livro também leram..." */}
                <div className="pt-2 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-marsala" />
                    Pessoas que leram esse livro também leram...
                  </h4>

                  {recsLoading && (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">Buscando obras similares...</p>
                    </div>
                  )}

                  {!recsLoading && recs.length === 0 && (
                    <p className="text-xs text-muted-foreground py-4">Nenhuma sugestão encontrada para este título.</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {recs.map((r) => (
                      <div
                        key={r.id}
                        className="bg-card border border-border rounded-xl p-2.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <img
                          src={r.cover}
                          alt={r.title}
                          className="w-full h-32 object-cover rounded-lg mb-2 shadow-sm"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <p translate="no" className="notranslate text-xs font-semibold text-foreground line-clamp-2">
                            {r.title}
                          </p>
                          <p translate="no" className="notranslate text-[11px] text-muted-foreground truncate mt-0.5">
                            {r.author}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddRecToWishlist(r)}
                          className="w-full mt-2 text-[10px] font-medium py-1.5 rounded-md bg-secondary text-foreground hover:bg-marsala hover:text-primary-foreground transition-colors flex items-center justify-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" /> Quero ler
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. JORNAL SECTION */}
            {activeSection === "journal" && (
              <div className="space-y-5">
                {/* Progress update in Journal Tab */}
                <div className="bg-secondary/40 rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground">Rastreamento de Leitura</h4>
                    <span className="text-xs font-bold text-marsala">{book.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-marsala rounded-full transition-all"
                      style={{ width: `${Math.min(book.progress || 0, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">
                      Pág. {book.currentPage || 0} / {book.totalPages || 0}
                    </span>
                    <input
                      type="number"
                      min={0}
                      placeholder="Nova pág."
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdatePage()}
                      className="w-24 text-xs px-2.5 py-1.5 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30 ml-auto"
                    />
                    <button
                      onClick={handleUpdatePage}
                      disabled={!pageInput}
                      className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-medium disabled:opacity-40"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>

                {/* Add note */}
                <div className="bg-secondary/30 rounded-xl p-4 space-y-3 border border-border">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-gold" /> Nova Anotação
                  </h4>
                  <input
                    placeholder="Capítulo / Página (opcional, ex: Cap. 4, Pág. 75)"
                    value={noteChapter}
                    onChange={(e) => setNoteChapter(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                  <textarea
                    placeholder="O que você está achando? Registre suas respostas e sentimentos..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    className="text-xs font-medium px-4 py-2 rounded-lg gradient-marsala text-primary-foreground disabled:opacity-40 transition-opacity"
                  >
                    Salvar Anotação
                  </button>
                </div>

                {/* Notes list with Trash icon */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Anotações salvas ({(book.notes || []).length})
                  </h4>

                  {(book.notes || []).slice().reverse().map((note, i) => (
                    <motion.div
                      key={note.id || i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-xl p-3.5 shadow-sm flex items-start justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-marsala bg-marsala/10 px-2 py-0.5 rounded-full border border-marsala/20">
                            {note.chapter || "Anotação"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {note.date} às {note.time}
                          </span>
                        </div>
                        <p translate="no" className="notranslate text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                          {note.text}
                        </p>
                      </div>

                      {/* Note Trash Button */}
                      <button
                        onClick={() => deleteNote(book.id, note.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                        title="Apagar anotação"
                        aria-label="Apagar anotação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}

                  {(!book.notes || book.notes.length === 0) && (
                    <div className="text-center py-8 bg-secondary/20 rounded-xl border border-dashed border-border">
                      <p className="text-xs text-muted-foreground">Nenhuma anotação registrada ainda.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. RESENHA SECTION */}
            {activeSection === "review" && (
              <div className="space-y-6">
                {/* Review Text */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Sua Resenha</h4>
                  <textarea
                    placeholder="Escreva sua opinião detalhada sobre o livro, personagens, enredo e conclusão..."
                    value={reviewText || book.review || ""}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground min-h-[130px] resize-none focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                  <button
                    onClick={handleSaveReview}
                    className="text-xs font-medium px-4 py-2 rounded-lg gradient-marsala text-primary-foreground"
                  >
                    Salvar Resenha
                  </button>
                </div>

                {/* Quotes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Quote className="w-4 h-4 text-marsala" /> Citações Favoritas
                  </h4>
                  <div className="space-y-2">
                    {(book.quotes || []).map((q, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 bg-secondary/40 border border-border rounded-xl p-3">
                        <p translate="no" className="notranslate text-xs text-foreground italic flex-1">
                          "{q}"
                        </p>
                        <button
                          onClick={() => removeQuote(book.id, i)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded-md"
                          title="Remover citação"
                          aria-label="Remover citação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      placeholder="Digite uma citação marcante do livro..."
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                      onKeyDown={(e) => e.key === "Enter" && handleAddQuote()}
                    />
                    <button
                      onClick={handleAddQuote}
                      disabled={!quoteText.trim()}
                      className="text-xs px-3 py-2 rounded-lg gradient-marsala text-primary-foreground font-medium disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookDetailModal;
