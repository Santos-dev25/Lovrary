import { useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Bookmark, Check, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

interface ReadingNowProps {
  fullView?: boolean;
}

const ReadingNow = ({ fullView }: ReadingNowProps) => {
  const { books, setSelectedBook, updateProgress, startReading } = useBooks();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const candidates = books.filter((b) => b.ownership === "tenho" && b.status !== "lendo");
  const filteredCandidates = candidates.filter((b) => {
    if (!pickerSearch.trim()) return true;
    const q = pickerSearch.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });
  const currentlyReading = books.filter((b) => b.status === "lendo");
  const [pageInputs, setPageInputs] = useState<Record<string, string>>({});

  const handleSavePage = (bookId: string, total: number) => {
    const raw = pageInputs[bookId];
    const page = parseInt(raw);
    if (!isNaN(page) && page >= 0) {
      updateProgress(bookId, Math.min(page, total || page));
      setPageInputs((p) => ({ ...p, [bookId]: "" }));
    }
  };

  const Picker = () =>
    pickerOpen ? (
      <div
        className="fixed inset-0 z-[110] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setPickerOpen(false)}
      >
        <div
          className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md max-h-[75vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h4 className="font-display font-semibold text-foreground">Selecionar livro para ler</h4>
              <p className="text-xs text-muted-foreground">Escolha um livro do seu acervo para iniciar a leitura</p>
            </div>
            <button onClick={() => setPickerOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="p-3 border-b border-border">
            <input
              type="text"
              placeholder="Buscar livro por título ou autor..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {filteredCandidates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {candidates.length === 0 ? "Nenhum livro disponível no acervo." : "Nenhum livro encontrado para esta busca."}
              </p>
            )}
            {filteredCandidates.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  startReading(b.id);
                  setPickerOpen(false);
                  setPickerSearch("");
                }}
                className="w-full flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-secondary text-left transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={b.cover} alt={b.title} className="w-10 h-14 object-cover rounded-lg shrink-0 shadow-sm" />
                  <div className="min-w-0">
                    <p translate="no" className="notranslate text-sm font-medium text-foreground truncate">{b.title}</p>
                    <p translate="no" className="notranslate text-xs text-muted-foreground truncate">{b.author || "Autor desconhecido"}</p>
                    {b.totalPages ? (
                      <span className="text-[10px] text-muted-foreground">{b.totalPages} páginas</span>
                    ) : null}
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-marsala/10 text-marsala group-hover:bg-marsala group-hover:text-primary-foreground transition-colors shrink-0">
                  Ler agora
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    ) : null;

  if (currentlyReading.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-marsala" /> Lendo Agora
          </h3>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl gradient-marsala text-primary-foreground shadow-xs hover:opacity-95"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>
        <div className="bg-card rounded-2xl border border-dashed border-border p-8 text-center flex flex-col items-center justify-center">
          <div className="p-3 rounded-2xl bg-secondary mb-3 text-marsala">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="font-display font-bold text-foreground text-sm">Nenhum livro em leitura no momento</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Escolha um título do seu acervo para registrar o progresso e criar anotações de cada capítulo.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl gradient-marsala text-primary-foreground shadow-xs hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Escolher Livro do Acervo
          </button>
        </div>
        <Picker />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-marsala" /> Lendo Agora
        </h3>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl gradient-marsala text-primary-foreground shadow-xs hover:opacity-95"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </button>
      </div>
      <Picker />
      <div className="space-y-3">
        {currentlyReading.map((book, i) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex gap-4 bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="relative shrink-0 book-spine-effect rounded-xl overflow-hidden shadow-xs">
              <img
                src={book.cover}
                alt={book.title}
                className="w-16 h-24 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedBook(book)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4
                translate="no"
                className="notranslate font-display font-semibold text-sm text-foreground truncate cursor-pointer hover:text-marsala transition-colors"
                onClick={() => setSelectedBook(book)}
              >
                {book.title}
              </h4>
              <p className="text-xs text-muted-foreground">{book.author}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Pág. {book.currentPage}/{book.totalPages}</span>
                  <span className="font-semibold text-marsala">{book.progress}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${book.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.2 }}
                    className="h-full gradient-marsala rounded-full"
                  />
                </div>
              </div>

              {/* Quick page update */}
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={book.totalPages || undefined}
                  placeholder="Atualizar página..."
                  value={pageInputs[book.id] ?? ""}
                  onChange={(e) =>
                    setPageInputs((p) => ({ ...p, [book.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSavePage(book.id, book.totalPages || 0);
                    }
                  }}
                  className="flex-1 text-xs px-2.5 py-1.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                />
                <button
                  onClick={() => handleSavePage(book.id, book.totalPages || 0)}
                  disabled={!pageInputs[book.id]}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground disabled:opacity-40 flex items-center gap-1"
                  title="Salvar página"
                >
                  <Check className="w-3 h-3" /> OK
                </button>
              </div>

              {book.notes && book.notes.length > 0 && (
                <div className="mt-2 flex items-start gap-1.5">
                  <Bookmark className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    <span className="font-medium">{book.notes[book.notes.length - 1].chapter}:</span>{" "}
                    {book.notes[book.notes.length - 1].text}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReadingNow;
