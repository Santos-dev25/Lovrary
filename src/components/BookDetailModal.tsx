import { useEffect, useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { vibeOptions, categoryOptions, mockBooks } from "@/data/mockBooks";
import { searchGoogleBooks } from "@/lib/googleBooks";
import {
  X, Star, Bookmark, Quote, Plus, Trash2, CheckCircle, Play, Tag,
  Calendar, Sparkles, PlusCircle, Feather, BookOpen, MoreHorizontal,
  ChevronDown, Heart, Check, Clock, Library, Undo2, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type TabSection = "journal" | "review" | "quotes" | "info";

export const BookDetailModal = () => {
  const {
    selectedBook: book, setSelectedBook, addNote, addReview, addQuote,
    removeQuote, setRating, setSubRating, startReading, finishReading,
    updateProgress, moveToAcervo, addVibe, removeVibe, addToQueue,
    updateBook, deleteBook, deleteNote, books, addBook
  } = useBooks();

  const [activeTab, setActiveTab] = useState<TabSection>("journal");
  const [noteText, setNoteText] = useState("");
  const [noteChapter, setNoteChapter] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
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
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);

  const [recs, setRecs] = useState<{ id: string; title: string; author: string; cover: string }[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const bookId = book?.id;
  const bookCategory = book?.category;
  const bookAuthor = book?.author;
  const bookTitle = book?.title;

  // Search recommendations via Google Books or fallback
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
          .slice(0, 4);

        if (onlineRecs.length > 0) {
          setRecs(onlineRecs);
        } else {
          const localRecs = [...books, ...mockBooks]
            .filter(b => b.title.toLowerCase() !== (bookTitle || "").toLowerCase())
            .filter(b => (bookCategory && b.category === bookCategory) || (bookAuthor && b.author === bookAuthor))
            .map(b => ({ id: b.id, title: b.title, author: b.author, cover: b.cover }))
            .slice(0, 4);
          setRecs(localRecs);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const localRecs = [...books, ...mockBooks]
          .filter(b => b.title.toLowerCase() !== (bookTitle || "").toLowerCase())
          .filter(b => (bookCategory && b.category === bookCategory) || (bookAuthor && b.author === bookAuthor))
          .map(b => ({ id: b.id, title: b.title, author: b.author, cover: b.cover }))
          .slice(0, 4);
        setRecs(localRecs);
      })
      .finally(() => {
        if (!cancelled) setRecsLoading(false);
      });

    return () => { cancelled = true; };
  }, [bookId, bookCategory, bookAuthor, bookTitle, books]);

  // Sync inputs on book change
  useEffect(() => {
    if (book) {
      setPageInput("");
      setTotalPagesInput(book.totalPages ? String(book.totalPages) : "");
      setReviewText(book.review || "");
      setIsEditingReview(!book.review);
      setActionsMenuOpen(false);
      setConfirmDeleteBook(false);
    }
  }, [book?.id]);

  if (!book) return null;

  const allClassifications = Array.from(
    new Set([...categoryOptions, ...books.map(b => b.category).filter(Boolean) as string[]])
  ).sort((a, b) => a.localeCompare(b));

  const handleDeleteBookConfirm = () => {
    deleteBook(book.id);
    setConfirmDeleteBook(false);
    toast.success(`"${book.title}" foi removido do seu acervo.`);
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
    toast.success("Nova anotação registrada no diário! ✍️");
  };

  const handleSaveReview = () => {
    if (!reviewText.trim()) return;
    addReview(book.id, reviewText.trim());
    setIsEditingReview(false);
    toast.success("Resenha salva com sucesso!");
  };

  const handleAddQuote = () => {
    if (!quoteText.trim()) return;
    addQuote(book.id, quoteText.trim());
    setQuoteText("");
    toast.success("Citação arquivada com sucesso! ✨");
  };

  const handleUpdatePage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 0) {
      const maxP = book.totalPages || page;
      updateProgress(book.id, Math.min(page, maxP));
      setPageInput("");
      toast.success(`Progresso atualizado para página ${page}`);
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
    toast.success(`"${rec.title}" adicionado à sua Lista de Desejos! 💫`);
  };

  const tabs: { id: TabSection; label: string; count?: number; icon: React.ElementType }[] = [
    { id: "journal", label: "Journal", count: book.notes?.length || 0, icon: Feather },
    { id: "review", label: "Resenha", icon: Star },
    { id: "quotes", label: "Citações", count: book.quotes?.length || 0, icon: Quote },
    { id: "info", label: "Ficha Técnica", icon: Bookmark },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] bg-foreground/45 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
        onClick={() => setSelectedBook(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-card rounded-3xl border border-border shadow-2xl w-full max-w-5xl max-h-[92vh] md:max-h-[88vh] flex flex-col overflow-hidden my-auto"
        >
          {/* Top subtle atmosphere aura */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-marsala/10 blur-3xl pointer-events-none" />

          {/* Close button - desktop & mobile pinned top-right */}
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Fechar modal de detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Delete Confirmation Alert Banner */}
          {confirmDeleteBook && (
            <div className="bg-destructive/10 border-b border-destructive/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in z-20">
              <div className="text-left">
                <p className="text-xs font-semibold text-destructive">
                  Tem certeza que deseja excluir "{book.title}"?
                </p>
                <p className="text-[11px] text-muted-foreground">
                  O livro e todo o histórico de anotações serão removidos permanentemente.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDeleteBookConfirm}
                  className="text-xs font-semibold px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
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

          {/* Modal Main Body: 2-Column Desktop Grid with Unified Scroll */}
          <div className="flex-1 overflow-y-auto md:grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border">
            
            {/* ============================================================ */}
            {/* LEFT COLUMN: PHYSICAL BOOK SHOWCASE & ACTION HIERARCHY (~38%) */}
            {/* ============================================================ */}
            <div className="md:col-span-5 p-5 sm:p-7 flex flex-col items-center justify-start text-center space-y-5 bg-secondary/15">
              
              {/* 1. Physical Book Cover with 3D Spine and Ribbon */}
              <div className="relative group select-none pt-2">
                {/* Book ambient floor shadow */}
                <div className="absolute -bottom-3 inset-x-2 h-6 bg-black/35 dark:bg-black/70 blur-md rounded-full" />

                <div className="relative w-36 sm:w-44 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl book-spine-effect border border-white/20 transition-transform duration-300 group-hover:-translate-y-1">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />

                  {/* Golden Bookmark Ribbon */}
                  <div className="absolute -top-1 right-4 w-5 h-9 bg-gold shadow-md clip-path-ribbon z-10" />

                  {/* Reading Status Pill overlay on cover */}
                  <div className="absolute bottom-2.5 inset-x-2.5">
                    <span className={`block w-full text-[10px] font-bold py-1 px-2 rounded-lg text-center backdrop-blur-md border shadow-xs tracking-wider uppercase ${
                      book.status === "lido"
                        ? "bg-marsala/90 text-primary-foreground border-white/20"
                        : book.status === "lendo"
                        ? "bg-gold/90 text-amber-950 font-bold border-gold/40"
                        : "bg-card/90 text-muted-foreground border-border/80"
                    }`}>
                      {book.status === "lido" ? "Concluído" : book.status === "lendo" ? "Lendo Agora" : "Não Lido"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Star Rating Bar */}
              <div className="space-y-1 w-full flex flex-col items-center">
                <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-card border border-border shadow-2xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setRating(book.id, i + 1);
                        toast.success(`Nota atualizada para ${i + 1} estrelas! ⭐`);
                      }}
                      className="p-0.5 hover:scale-115 transition-transform"
                      title={`Avaliar ${i + 1} estrelas`}
                      aria-label={`Avaliar ${i + 1} estrelas`}
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          i < book.rating ? "fill-gold text-gold" : "text-muted-foreground/30 hover:text-gold/60"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-numeric font-bold text-foreground ml-1">
                    {book.rating ? `${book.rating}.0` : "—"}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">Avaliação pessoal</span>
              </div>

              {/* 3. Reading Progress Ruler (when reading or has progress) */}
              <div className="w-full bg-card rounded-2xl p-4 border border-border/80 shadow-2xs space-y-2 text-left">
                <div className="flex items-center justify-between text-xs font-numeric">
                  <span className="font-semibold text-foreground">
                    Página {book.currentPage || 0} de {book.totalPages || "?"}
                  </span>
                  <span className="font-bold text-marsala">
                    {book.progress || 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(book.progress || 0, 100)}%` }}
                    className="h-full gradient-marsala rounded-full"
                  />
                </div>

                {/* Quick page update inline */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="number"
                    min={0}
                    max={book.totalPages || undefined}
                    placeholder="Pág..."
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleUpdatePage()}
                    className="w-full text-xs px-2.5 py-1.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                  />
                  <button
                    onClick={handleUpdatePage}
                    disabled={!pageInput}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-semibold disabled:opacity-40 hover:opacity-95 transition-opacity"
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              {/* 4. Action Hierarchy: Primary CTA + Secondary Actions */}
              <div className="w-full space-y-2 pt-1">
                {/* Primary CTA button with prominent contrast */}
                {book.ownership === "pretendo" ? (
                  <button
                    onClick={() => {
                      moveToAcervo(book.id);
                      toast.success(`"${book.title}" adicionado ao seu acervo na estante! 📚`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl gradient-marsala text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Library className="w-4 h-4" />
                    <span>Mover para o Acervo</span>
                  </button>
                ) : book.status === "nao-lido" ? (
                  <button
                    onClick={() => {
                      startReading(book.id);
                      toast.success(`Boa leitura de "${book.title}"! 📖`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl gradient-marsala text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Começar a Ler Agora</span>
                  </button>
                ) : book.status === "lendo" ? (
                  <button
                    onClick={() => {
                      finishReading(book.id);
                      toast.success(`Parabéns! Leitura de "${book.title}" concluída! 🎉`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl gradient-marsala text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Marcar como Concluído</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      startReading(book.id);
                      toast.success(`Releitura de "${book.title}" iniciada! 📖`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-card border border-border hover:bg-secondary text-foreground text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Undo2 className="w-4 h-4 text-marsala" />
                    <span>Iniciar Releitura</span>
                  </button>
                )}

                {/* Secondary Actions Row */}
                <div className="flex items-center gap-2 w-full">
                  {book.status === "nao-lido" && book.ownership === "tenho" && (
                    <button
                      onClick={() => {
                        addToQueue(book.id);
                        toast.success(`"${book.title}" adicionado à sua fila de próxima leitura! 🔖`);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-card border border-border text-foreground hover:bg-secondary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-gold" />
                      <span>Fila de Leitura</span>
                    </button>
                  )}

                  {/* Discreet Dropdown Menu for secondary / destructive management */}
                  <div className="relative flex-1">
                    <button
                      onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
                      className="w-full py-2 px-3 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      <span>Mais Opções</span>
                      <ChevronDown className="w-3 h-3 ml-auto opacity-60" />
                    </button>

                    {actionsMenuOpen && (
                      <div className="absolute bottom-full mb-1 left-0 right-0 z-40 bg-card border border-border rounded-2xl shadow-xl p-2 space-y-1 text-left animate-fade-in">
                        <button
                          onClick={() => {
                            updateBook(book.id, {
                              ownership: book.ownership === "tenho" ? "pretendo" : "tenho"
                            });
                            setActionsMenuOpen(false);
                            toast.success("Posse do livro atualizada!");
                          }}
                          className="w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-secondary text-foreground flex items-center gap-2"
                        >
                          <Library className="w-3.5 h-3.5 text-marsala" />
                          <span>
                            {book.ownership === "tenho" ? "Mover p/ Lista de Desejos" : "Já possuo este livro"}
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            const nextStatus = book.status === "lido" ? "nao-lido" : "lido";
                            updateBook(book.id, { status: nextStatus });
                            setActionsMenuOpen(false);
                            toast.success(`Status alterado para: ${nextStatus === "lido" ? "Lido" : "Não lido"}`);
                          }}
                          className="w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-secondary text-foreground flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-gold" />
                          <span>
                            {book.status === "lido" ? "Marcar como Não Lido" : "Marcar como Lido diretamente"}
                          </span>
                        </button>

                        <div className="border-t border-border my-1" />

                        <button
                          onClick={() => {
                            setConfirmDeleteBook(true);
                            setActionsMenuOpen(false);
                          }}
                          className="w-full text-left text-xs px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir livro do acervo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ownership info badge */}
              <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span>{book.ownership === "tenho" ? "Exemplar presente na sua estante" : "Item na lista de desejos"}</span>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: REFINED EDITORIAL TABS & CONTENT (~62%)         */}
            {/* ============================================================ */}
            <div className="md:col-span-7 flex flex-col min-w-0">
              
              {/* Header: Title, Author, Classification Tag */}
              <div className="p-5 sm:p-7 pb-4 border-b border-border space-y-2">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  {/* Category Selector Pill with Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-marsala/40 bg-marsala/10 text-marsala hover:bg-marsala hover:text-primary-foreground transition-all"
                      title="Clique para alterar a classificação"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{book.category || "Definir classificação"}</span>
                      <ChevronDown className="w-3 h-3 opacity-70" />
                    </button>

                    {genreDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 z-50 bg-card border border-border rounded-2xl shadow-xl p-3 w-60 space-y-2 animate-fade-in">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          Classificação Literária
                        </p>
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                          {allClassifications.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleSelectGenre(cat)}
                              className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                                book.category === cat
                                  ? "gradient-marsala text-primary-foreground font-semibold"
                                  : "hover:bg-secondary text-foreground"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-border flex gap-1">
                          <input
                            type="text"
                            placeholder="Novo gênero..."
                            value={customGenreInput}
                            onChange={(e) => setCustomGenreInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCustomGenre()}
                            className="flex-1 text-xs px-2.5 py-1 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                          />
                          <button
                            onClick={handleAddCustomGenre}
                            className="text-xs px-2.5 py-1 gradient-marsala text-primary-foreground rounded-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vibes preview tags */}
                  {book.vibes && book.vibes.slice(0, 2).map((vibe) => (
                    <span
                      key={vibe}
                      className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>

                <h1
                  translate="no"
                  className="notranslate text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight leading-tight pr-6"
                >
                  {book.title}
                </h1>
                <p
                  translate="no"
                  className="notranslate text-sm text-muted-foreground font-medium"
                >
                  por <span className="text-foreground font-semibold">{book.author || "Autor desconhecido"}</span>
                </p>
              </div>

              {/* Clean Editorial Navigation Tabs */}
              <div className="flex border-b border-border bg-card/60 overflow-x-auto scrollbar-hide px-3 sm:px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all ${
                        isActive
                          ? "border-marsala text-marsala font-bold bg-secondary/30"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-marsala" : "text-muted-foreground"}`} />
                      <span>{tab.label}</span>
                      {typeof tab.count === "number" && tab.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-marsala/15 text-marsala font-bold" : "bg-secondary text-muted-foreground"
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panels */}
              <div className="p-5 sm:p-7 overflow-y-auto max-h-[58vh] md:max-h-[54vh] space-y-6">

                {/* -------------------------------------------------------- */}
                {/* 1. JOURNAL TAB: LINED NOTEBOOK STYLING                  */}
                {/* -------------------------------------------------------- */}
                {activeTab === "journal" && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Add Note Card with Notebook Feel */}
                    <div className="rounded-2xl bg-card border border-border/90 p-4 sm:p-5 shadow-xs space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Feather className="w-4 h-4 text-marsala" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Nova Entrada no Diário
                          </h3>
                        </div>
                        <span className="text-[11px] text-muted-foreground">Caderno de Leitura</span>
                      </div>

                      <input
                        placeholder="Capítulo ou página de referência (ex: Cap. 4, Pág. 72)"
                        value={noteChapter}
                        onChange={(e) => setNoteChapter(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                      />

                      {/* Textarea with lined journal paper styling */}
                      <div className="relative rounded-xl border border-border/80 bg-card overflow-hidden">
                        <textarea
                          placeholder="Escreva suas impressões, sentimentos e teorias deste capítulo..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground/70 min-h-[110px] resize-none focus:outline-none notebook-ruled font-serif leading-7"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleAddNote}
                          disabled={!noteText.trim()}
                          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl gradient-marsala text-primary-foreground disabled:opacity-40 shadow-xs hover:opacity-95 transition-opacity"
                        >
                          <Feather className="w-3.5 h-3.5" />
                          <span>Registrar no Diário</span>
                        </button>
                      </div>
                    </div>

                    {/* Journal Entries Timeline */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Passagens & Reflexões ({(book.notes || []).length})
                        </h4>
                      </div>

                      {(book.notes || []).length > 0 ? (
                        <div className="space-y-3">
                          {(book.notes || []).slice().reverse().map((note, i) => (
                            <motion.div
                              key={note.id || i}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative rounded-2xl bg-card border border-border/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow group flex items-start justify-between gap-4 border-l-4 border-l-marsala/70"
                            >
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-bold text-marsala bg-marsala/10 px-2.5 py-0.5 rounded-full border border-marsala/20">
                                    {note.chapter || "Anotação"}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground font-numeric flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {note.date} às {note.time}
                                  </span>
                                </div>
                                <p
                                  translate="no"
                                  className="notranslate text-xs sm:text-sm text-foreground/90 font-serif leading-relaxed whitespace-pre-wrap pl-1"
                                >
                                  {note.text}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  deleteNote(book.id, note.id);
                                  toast.success("Anotação removida do diário.");
                                }}
                                className="opacity-60 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all shrink-0"
                                title="Excluir anotação"
                                aria-label="Excluir anotação"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-secondary/20 rounded-2xl border border-dashed border-border p-6 space-y-2">
                          <Feather className="w-8 h-8 text-marsala/50 mx-auto" />
                          <p className="text-xs font-semibold text-foreground">Diário silencioso</p>
                          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                            Nenhuma reflexão registrada ainda. Conforme as páginas avançarem, guarde pensamentos e reações de cada capítulo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* 2. REVIEW TAB: EDITORIAL CRITIQUE & SUB-RATINGS         */}
                {/* -------------------------------------------------------- */}
                {activeTab === "review" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Main Written Review */}
                    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-gold" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Resenha Crítica
                          </h3>
                        </div>
                        {book.review && !isEditingReview && (
                          <button
                            onClick={() => setIsEditingReview(true)}
                            className="text-xs text-marsala font-semibold hover:underline"
                          >
                            Editar resenha
                          </button>
                        )}
                      </div>

                      {isEditingReview ? (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Escreva sua análise detalhada sobre os personagens, desenvolvimento do enredo, tom narrativo e desfecho..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full text-xs sm:text-sm px-4 py-3 bg-secondary/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground min-h-[140px] resize-none focus:outline-none focus:ring-1 focus:ring-marsala leading-relaxed"
                          />
                          <div className="flex items-center justify-end gap-2">
                            {book.review && (
                              <button
                                onClick={() => setIsEditingReview(false)}
                                className="text-xs px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground"
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                              onClick={handleSaveReview}
                              disabled={!reviewText.trim()}
                              className="text-xs font-bold px-4 py-2 rounded-xl gradient-marsala text-primary-foreground disabled:opacity-40 shadow-xs hover:opacity-95 transition-opacity"
                            >
                              Salvar Resenha
                            </button>
                          </div>
                        </div>
                      ) : book.review ? (
                        <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 space-y-2">
                          <p
                            translate="no"
                            className="notranslate text-xs sm:text-sm text-foreground/90 font-serif leading-relaxed whitespace-pre-wrap"
                          >
                            {book.review}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-xs text-muted-foreground mb-3">Você ainda não redigiu uma resenha para este livro.</p>
                          <button
                            onClick={() => setIsEditingReview(true)}
                            className="text-xs font-bold px-4 py-2 rounded-xl gradient-marsala text-primary-foreground"
                          >
                            Escrever Resenha
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Specific Sub-Ratings (Personagens, Enredo, etc.) */}
                    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gold" /> Critérios & Avaliações Específicas
                        </h4>
                        <button
                          onClick={() => setShowAddSub(!showAddSub)}
                          className="text-xs font-semibold text-marsala hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Nova Categoria
                        </button>
                      </div>

                      {showAddSub && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border">
                          <input
                            placeholder="Critério (ex: Ritmo, Personagens, Plot Twist)..."
                            value={newSubLabel}
                            onChange={(e) => setNewSubLabel(e.target.value)}
                            className="text-xs px-3 py-1.5 bg-card border border-border rounded-lg flex-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                            autoFocus
                          />
                          <div className="flex items-center gap-1 justify-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button key={i} type="button" onClick={() => setNewSubRating(i + 1)}>
                                <Star className={`w-4 h-4 ${i < newSubRating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleAddCustomSubRating}
                              disabled={!newSubLabel.trim()}
                              className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-semibold disabled:opacity-40"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {(book.subRatings || []).map((sub) => (
                          <div
                            key={sub.label}
                            className="flex items-center justify-between gap-3 bg-secondary/30 px-3.5 py-2.5 rounded-xl border border-border"
                          >
                            <span translate="no" className="notranslate text-xs font-medium text-foreground truncate">
                              {sub.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSubRating(book.id, sub.label, i + 1)}
                                  title={`Nota ${i + 1}`}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 transition-colors ${
                                      i < sub.value ? "fill-gold text-gold" : "text-muted-foreground/30 hover:text-gold/50"
                                    }`}
                                  />
                                </button>
                              ))}
                              <button
                                onClick={() =>
                                  updateBook(book.id, {
                                    subRatings: (book.subRatings || []).filter((sr) => sr.label !== sub.label),
                                  })
                                }
                                className="ml-1 p-1 text-muted-foreground hover:text-destructive rounded-md"
                                title="Remover critério"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!book.subRatings || book.subRatings.length === 0) && !showAddSub && (
                          <p className="text-xs text-muted-foreground col-span-2 py-2">
                            Nenhum critério específico adicionado ainda. Clique em "+ Nova Categoria" para avaliar enredo, personagens e ritmo.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* 3. QUOTES TAB: LITERARY CLIPPINGS & HIGHLIGHTS           */}
                {/* -------------------------------------------------------- */}
                {activeTab === "quotes" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Add Quote Input */}
                    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex items-center gap-2">
                        <Quote className="w-4 h-4 text-marsala" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Adicionar Nova Citação Marcante
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <input
                          placeholder="Digite ou cole aqui o trecho memorável do livro..."
                          value={quoteText}
                          onChange={(e) => setQuoteText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddQuote()}
                          className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-secondary/40 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                        />
                        <button
                          onClick={handleAddQuote}
                          disabled={!quoteText.trim()}
                          className="px-4 py-2.5 rounded-xl gradient-marsala text-primary-foreground text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 shadow-xs hover:opacity-95 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </div>

                    {/* Quotes List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Citações Salvas ({(book.quotes || []).length})
                      </h4>

                      {(book.quotes || []).length > 0 ? (
                        <div className="space-y-3">
                          {(book.quotes || []).map((q, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative rounded-2xl bg-card border border-border/80 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow group flex items-start justify-between gap-4 border-l-4 border-l-gold"
                            >
                              <div className="flex-1 min-w-0">
                                <p
                                  translate="no"
                                  className="notranslate text-xs sm:text-sm text-foreground/90 font-serif italic leading-relaxed"
                                >
                                  “{q}”
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-2 block font-medium">
                                  — {book.title}, por {book.author || "Autor"}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  removeQuote(book.id, i);
                                  toast.success("Citação removida.");
                                }}
                                className="opacity-60 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all shrink-0"
                                title="Remover citação"
                                aria-label="Remover citação"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-secondary/20 rounded-2xl border border-dashed border-border p-6 space-y-2">
                          <Quote className="w-8 h-8 text-gold/50 mx-auto" />
                          <p className="text-xs font-semibold text-foreground">Nenhuma citação arquivada</p>
                          <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                            Ao encontrar uma frase sublime que toque sua alma de leitora, registre-a para eternizar o trecho.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* 4. TECHNICAL DETAILS & VIBES TAB                        */}
                {/* -------------------------------------------------------- */}
                {activeTab === "info" && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Metadata Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Total Pages Edit */}
                      <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Extensão da Obra
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            placeholder="Ex: 412"
                            value={totalPagesInput}
                            onChange={(e) => setTotalPagesInput(e.target.value)}
                            className="w-28 text-xs px-3 py-1.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                          />
                          <button
                            onClick={handleUpdateTotalPages}
                            className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-semibold"
                          >
                            Salvar Páginas
                          </button>
                        </div>
                      </div>

                      {/* Date Finished */}
                      <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-marsala" />
                          Data de Conclusão da Leitura
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={book.dateFinished || ""}
                            onChange={(e) => {
                              updateBook(book.id, { dateFinished: e.target.value });
                              toast.success("Data de conclusão registrada!");
                            }}
                            className="text-xs px-3 py-1.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                          />
                          {book.dateFinished && (
                            <button
                              onClick={() => updateBook(book.id, { dateFinished: undefined })}
                              className="text-[11px] text-muted-foreground hover:text-destructive underline"
                            >
                              Limpar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Vibes & Emotional Tags */}
                    <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-marsala" /> Boas Vibrações & Emoções
                        </h4>
                        <button
                          onClick={() => setShowAddVibe(!showAddVibe)}
                          className="text-xs font-semibold text-marsala hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Nova Tag
                        </button>
                      </div>

                      {showAddVibe && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50 border border-border">
                          <input
                            placeholder="Nome da tag (ex: Conforto, Suspense, Lágrimas)..."
                            value={newVibe}
                            onChange={(e) => setNewVibe(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCustomVibe()}
                            className="text-xs px-3 py-1.5 bg-card border border-border rounded-lg flex-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-marsala"
                            autoFocus
                          />
                          <button
                            onClick={handleAddCustomVibe}
                            disabled={!newVibe.trim()}
                            className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground font-semibold disabled:opacity-40"
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

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {/* Active Vibes */}
                        {book.vibes.map((vibe) => (
                          <span
                            key={vibe}
                            className="text-xs px-3 py-1 rounded-full gradient-marsala text-primary-foreground flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{vibe}</span>
                            <button
                              onClick={() => removeVibe(book.id, vibe)}
                              className="opacity-70 hover:opacity-100 hover:bg-black/20 rounded-full p-0.5"
                              title="Remover tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}

                        {/* Suggested Vibes */}
                        {vibeOptions
                          .filter((v) => !book.vibes.some((vb) => vb.toLowerCase() === v.toLowerCase()))
                          .map((vibe) => (
                            <button
                              key={vibe}
                              onClick={() => addVibe(book.id, vibe)}
                              className="text-xs px-3 py-1 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:border-marsala/40 hover:text-foreground transition-all"
                            >
                              + {vibe}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Smart Recommendations: Similar Books */}
                    <div className="pt-2 border-t border-border space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Obras Recomendadas Para Esta Leitora
                        </h4>
                      </div>

                      {recsLoading && (
                        <p className="text-xs text-muted-foreground py-4 text-center">Buscando sugestões literárias afins...</p>
                      )}

                      {!recsLoading && recs.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2">Nenhuma sugestão encontrada para este título no momento.</p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {recs.map((r) => (
                          <div
                            key={r.id}
                            className="bg-card border border-border rounded-2xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-card transition-all group"
                          >
                            <img
                              src={r.cover}
                              alt={r.title}
                              className="w-full h-28 object-cover rounded-xl mb-2 shadow-xs"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                                {r.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                {r.author}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddRecToWishlist(r)}
                              className="w-full mt-2 text-[10px] font-bold py-1.5 rounded-xl bg-secondary text-foreground hover:bg-marsala hover:text-primary-foreground transition-colors flex items-center justify-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" />
                              <span>Quero Ler</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookDetailModal;
