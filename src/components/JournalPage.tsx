import { useEffect, useState, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Feather, Plus, Trash2, Pencil, Check, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const JournalPage = () => {
  const { books, addNote, updateNote, deleteNote, updateProgress, setSelectedBook } = useBooks();
  const reading = useMemo(() => books.filter(b => b.status === "lendo"), [books]);

  const [activeBookId, setActiveBookId] = useState<string>(reading[0]?.id || "");
  const [noteText, setNoteText] = useState("");
  const [noteChapter, setNoteChapter] = useState("");
  const [pageInput, setPageInput] = useState("");

  // Inline note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingChapter, setEditingChapter] = useState("");

  // Ensure an active book is selected if reading books exist
  useEffect(() => {
    if (reading.length === 0) return;
    if (!reading.some(b => b.id === activeBookId)) {
      setActiveBookId(reading[0].id);
    }
  }, [reading, activeBookId]);

  const activeBook = useMemo(
    () => books.find(b => b.id === activeBookId && b.status === "lendo"),
    [books, activeBookId]
  );

  const reversedNotes = useMemo(
    () => (activeBook?.notes || []).slice().reverse(),
    [activeBook?.notes]
  );

  const handleAddNote = () => {
    if (!noteText.trim() || !activeBook) return;
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addNote(activeBook.id, {
      date,
      time,
      chapter: noteChapter.trim() || `Pág. ${activeBook.currentPage || '?'}`,
      text: noteText.trim(),
    });
    setNoteText("");
    setNoteChapter("");
    toast.success("Nova reflexão registrada no seu diário! ✍️");
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editingText.trim() || !activeBook) return;
    updateNote(activeBook.id, noteId, {
      text: editingText.trim(),
      chapter: editingChapter.trim(),
    });
    setEditingNoteId(null);
    toast.success("Anotação atualizada!");
  };

  const handleUpdatePage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && activeBook && page >= 0) {
      updateProgress(activeBook.id, Math.min(page, activeBook.totalPages || page));
      setPageInput("");
      toast.success(`Progresso atualizado para página ${page}`);
    }
  };

  if (reading.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in bg-card/40 rounded-2xl border border-dashed border-border p-8 space-y-3">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">Nenhum livro em leitura ativa</h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto font-sans leading-relaxed">
          Inicie a leitura de uma obra da sua estante ou acervo para registrar hipóteses, teorias e impressões no Journal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Journal de Leitura</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
          Seu espaço para reflexões, hipóteses e memórias de leitura.
        </p>
      </div>

      {/* Book selector carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {reading.map(book => (
          <button
            key={book.id}
            onClick={() => setActiveBookId(book.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              activeBookId === book.id
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40"
            }`}
          >
            <div className="w-10 sm:w-11 aspect-[2/3] rounded-lg overflow-hidden shrink-0 shadow-2xs border border-border/40 bg-secondary/30">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 pr-1">
              <p translate="no" className="notranslate text-xs sm:text-sm font-serif font-semibold text-foreground truncate max-w-[160px] sm:max-w-[200px]">
                {book.title}
              </p>
              <p className="text-[11px] text-muted-foreground font-numeric">
                {book.progress}% • Pág. {book.currentPage}/{book.totalPages || "?"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activeBook && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Active Book Specs & New Note Form (~45%) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Active Book Showcase Card */}
            <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex gap-4">
                <div
                  tabIndex={0}
                  role="button"
                  onClick={() => setSelectedBook(activeBook)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBook(activeBook);
                    }
                  }}
                  title="Ver detalhes da obra"
                  aria-label={`Ver detalhes de ${activeBook.title}`}
                  className="w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-xs border border-border/40 cursor-pointer bg-secondary/30 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <img
                    src={activeBook.cover}
                    alt={activeBook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3
                      translate="no"
                      className="notranslate font-serif font-bold text-base sm:text-lg text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setSelectedBook(activeBook)}
                    >
                      {activeBook.title}
                    </h3>
                    <p translate="no" className="notranslate text-xs text-muted-foreground font-sans mt-0.5">
                      {activeBook.author || "Autor desconhecido"}
                    </p>
                  </div>

                  {/* Progress Ruler */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-numeric">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-bold text-primary">{activeBook.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${activeBook.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Inline Page Update */}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={activeBook.totalPages || undefined}
                  placeholder={`Pág atual (de ${activeBook.totalPages || "?"})`}
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleUpdatePage()}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-numeric"
                />
                <button
                  onClick={handleUpdatePage}
                  disabled={!pageInput}
                  className="text-xs px-3.5 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-opacity disabled:opacity-40 shadow-xs shrink-0"
                >
                  Atualizar
                </button>
              </div>
            </div>

            {/* New Entry Form */}
            <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-primary" />
                  <h4 className="font-serif font-bold text-sm text-foreground">
                    Nova Entrada no Diário
                  </h4>
                </div>
                <span className="text-[11px] text-muted-foreground font-sans">Caderno de bordo</span>
              </div>

              <input
                type="text"
                placeholder="Capítulo ou página (ex: Cap. 5, Pág. 120)"
                value={noteChapter}
                onChange={e => setNoteChapter(e.target.value)}
                maxLength={100}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="relative rounded-xl border border-input bg-card overflow-hidden">
                <textarea
                  placeholder="Escreva suas impressões, sentimentos e teorias deste trecho... (Ctrl + Enter para registrar)"
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  rows={4}
                  maxLength={2000}
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground/70 resize-none focus:outline-none notebook-ruled font-serif leading-7"
                />
              </div>

              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="w-full flex items-center justify-center gap-2 text-xs py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-opacity disabled:opacity-40 shadow-xs"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Registrar no Diário</span>
              </button>
            </div>
          </div>

          {/* Right Column: Timeline Feed (~55%) */}
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-foreground">
                Passagens & Reflexões do Livro
              </h4>
              <span className="text-xs text-muted-foreground font-numeric">
                {(activeBook.notes || []).length} registro(s)
              </span>
            </div>

            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {reversedNotes.map((note, i) => (
                  <motion.div
                    key={note.id || i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative rounded-2xl bg-secondary/35 border border-border/80 p-4 shadow-2xs border-l-4 border-l-primary/70"
                  >
                    {editingNoteId === note.id ? (
                      /* Inline Edit Mode */
                      <div className="space-y-2.5">
                        <input
                          type="text"
                          value={editingChapter}
                          onChange={(e) => setEditingChapter(e.target.value)}
                          maxLength={100}
                          className="w-full text-xs px-3 py-1.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Capítulo ou página"
                        />
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          maxLength={2000}
                          rows={3}
                          className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary font-serif leading-relaxed"
                          placeholder="Texto da reação"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-xs px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" /> Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id!)}
                            className="text-xs px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-opacity flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                            {note.chapter}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-numeric flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {note.date} às {note.time}
                          </span>
                          <div className="ml-auto flex items-center gap-1">
                            {note.id && (
                              <button
                                onClick={() => {
                                  setEditingNoteId(note.id!);
                                  setEditingText(note.text);
                                  setEditingChapter(note.chapter);
                                }}
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors p-1.5 rounded-xl"
                                aria-label="Editar reação"
                                title="Editar anotação"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const noteToDelete = note;
                                deleteNote(activeBook.id, note.id);
                                toast.success("Anotação removida do diário.", {
                                  action: {
                                    label: "Desfazer",
                                    onClick: () => {
                                      addNote(activeBook.id, noteToDelete);
                                    },
                                  },
                                });
                              }}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors p-1.5 rounded-xl"
                              aria-label="Excluir reação"
                              title="Excluir anotação"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p
                          translate="no"
                          className="notranslate text-xs sm:text-sm text-foreground/90 font-serif leading-relaxed whitespace-pre-wrap pl-0.5"
                        >
                          {note.text}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!activeBook.notes || activeBook.notes.length === 0) && (
                <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-dashed border-border p-6 space-y-2">
                  <Feather className="w-8 h-8 text-primary/40 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">Diário silencioso</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
                    Nenhuma anotação registrada ainda para este livro. Registre sua primeira impressão ao lado!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
