import { useEffect, useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Bookmark, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const JournalPage = () => {
  const { books, addNote, deleteNote, updateProgress, setSelectedBook } = useBooks();
  const reading = books.filter(b => b.status === "lendo");

  const [activeBookId, setActiveBookId] = useState<string>(reading[0]?.id || "");
  const [noteText, setNoteText] = useState("");
  const [noteChapter, setNoteChapter] = useState("");
  const [pageInput, setPageInput] = useState("");

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
      <div className="flex gap-3 overflow-x-auto pb-2">
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
          {/* Left: Add note + progress */}
          <div className="space-y-4">
            {/* Progress update */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Atualizar Progresso</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Pág. {activeBook.currentPage}/{activeBook.totalPages}</span>
                    <span className="font-semibold text-marsala">{activeBook.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${activeBook.progress}%` }}
                      className="h-full gradient-marsala rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Página atual"
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  onKeyDown={e => e.key === "Enter" && handleUpdatePage()}
                />
                <button onClick={handleUpdatePage} className="text-sm px-4 py-2 rounded-lg gradient-marsala text-primary-foreground font-medium">
                  Salvar
                </button>
              </div>
            </div>

            {/* Add note */}
            <div className="bg-card rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-gold" /> Nova Reação
              </h4>
              <div className="space-y-3">
                <input
                  placeholder="Capítulo ou Página (ex: Cap. 12)"
                  value={noteChapter}
                  onChange={e => setNoteChapter(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
                <textarea
                  placeholder="O que você está sentindo? Registre sua reação..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  className="w-full text-sm font-medium py-2.5 rounded-lg gradient-marsala text-primary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Salvar Reação
                </button>
              </div>
            </div>
          </div>

          {/* Right: Notes timeline */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground mb-4">Histórico de Reações</h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-marsala bg-secondary px-2 py-0.5 rounded-full">
                        {note.chapter}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {note.date} às {note.time}
                      </span>
                      <button
                        onClick={() => deleteNote(activeBook.id, note.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Excluir reação"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{note.text}</p>
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
