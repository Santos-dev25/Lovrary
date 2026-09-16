import { useEffect, useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Bookmark, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const JournalPage = () => {
  const { books, addNote, updateNote, deleteNote, updateProgress, setSelectedBook } = useBooks();
  const reading = books.filter(b => b.status === "lendo");

  const [activeBookId, setActiveBookId] = useState<string>(reading[0]?.id || "");
  const [noteText, setNoteText] = useState("");
  const [noteChapter, setNoteChapter] = useState("");
  const [pageInput, setPageInput] = useState("");

  // Estado de edição de anotação
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingChapter, setEditingChapter] = useState("");

  // Garante que sempre há um livro selecionado (corrige o progresso preso em 0%)
  useEffect(() => {
    if (reading.length === 0) return;
    if (!reading.some(b => b.id === activeBookId)) {
      setActiveBookId(reading[0].id);
    }
  }, [reading, activeBookId]);

  const activeBook = books.find(b => b.id === activeBookId && b.status === "lendo");

  const handleAddNote = () => {
    if (!noteText.trim() || !activeBook) return;
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addNote(activeBook.id, {
      date,
      time,
      chapter: noteChapter || `Pág. ${activeBook.currentPage || '?'}`,
      text: noteText,
    });
    setNoteText("");
    setNoteChapter("");
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editingText.trim() || !activeBook) return;
    updateNote(activeBook.id, noteId, {
      text: editingText,
      chapter: editingChapter,
    });
    setEditingNoteId(null);
  };

  const handleUpdatePage = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && activeBook) {
      updateProgress(activeBook.id, Math.min(page, activeBook.totalPages || page));
      setPageInput("");
    }
  };

  if (reading.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold text-foreground mb-2">Nenhum livro em leitura</h2>
        <p className="text-sm text-muted-foreground">Comece a ler um livro para usar o Journal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-foreground">Journal de Leitura</h2>

      {/* Book selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {reading.map(book => (
          <button
            key={book.id}
            onClick={() => setActiveBookId(book.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all shrink-0 ${
              activeBookId === book.id
                ? "border-marsala bg-secondary shadow-sm"
                : "border-border bg-card hover:border-marsala/30"
            }`}
          >
            <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
            <div className="text-left">
              <p translate="no" className="notranslate text-sm font-semibold text-foreground">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.progress}% • Pág. {book.currentPage}/{book.totalPages}</p>
            </div>
          </button>
        ))}
      </div>

      {activeBook && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Quick log */}
          <div className="space-y-4">
            {/* Active book card */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className="flex gap-4">
                <img
                  src={activeBook.cover}
                  alt={activeBook.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm cursor-pointer"
                  onClick={() => setSelectedBook(activeBook)}
                />
                <div className="flex-1 min-w-0">
                  <h3 translate="no" className="notranslate font-display font-bold text-foreground">{activeBook.title}</h3>
                  <p translate="no" className="notranslate text-xs text-muted-foreground">{activeBook.author}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progresso: {activeBook.progress}%</span>
                      <span>{activeBook.currentPage} / {activeBook.totalPages} págs</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-marsala rounded-full transition-all duration-300"
                        style={{ width: `${activeBook.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick page update */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="number"
                      placeholder="Pág atual"
                      value={pageInput}
                      onChange={e => setPageInput(e.target.value)}
                      className="w-24 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground"
                    />
                    <button
                      onClick={handleUpdatePage}
                      className="text-xs px-3 py-1.5 gradient-marsala text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* New note form */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-card space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Nova Reação / Impressão</h4>
              <input
                type="text"
                placeholder="Capítulo ou página (ex: Cap. 5, Pág. 120)"
                value={noteChapter}
                onChange={e => setNoteChapter(e.target.value)}
                maxLength={100}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
              <textarea
                placeholder="O que você sentiu lendo esse trecho? Teorias, surpresas..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                rows={4}
                maxLength={2000}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim()}
                className="w-full flex items-center justify-center gap-2 text-xs py-2.5 gradient-marsala text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Registrar no Diário
              </button>
            </div>
          </div>

          {/* Right: Notes timeline */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">Histórico de Reações</h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {(activeBook.notes || []).slice().reverse().map((note, i) => (
                <motion.div
                  key={note.id || i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-4 border-l-2 border-marsala/30"
                >
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-marsala" />
                  <div className="bg-secondary/50 rounded-lg p-3">
                    {editingNoteId === note.id ? (
                      /* Formulário de Edição Inline */
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingChapter}
                          onChange={(e) => setEditingChapter(e.target.value)}
                          maxLength={100}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground"
                          placeholder="Capítulo ou página"
                        />
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          maxLength={2000}
                          rows={3}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground resize-none"
                          placeholder="Texto da reação"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="text-[11px] px-2.5 py-1 rounded-md border border-border bg-background hover:bg-secondary text-muted-foreground transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Cancelar
                          </button>
                          <button
                            onClick={() => handleSaveEdit(note.id!)}
                            className="text-[11px] px-2.5 py-1 rounded-md gradient-marsala text-primary-foreground font-medium transition-opacity hover:opacity-90 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold text-marsala bg-secondary px-2 py-0.5 rounded-full">
                            {note.chapter}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
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
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors p-1.5 rounded-lg"
                                aria-label="Editar reação"
                                title="Editar reação"
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
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 min-w-[32px] min-h-[32px] flex items-center justify-center transition-colors p-1.5 rounded-lg"
                              aria-label="Excluir reação"
                              title="Excluir reação"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{note.text}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
              {(!activeBook.notes || activeBook.notes.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Nenhuma reação registrada. Comece a anotar!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
