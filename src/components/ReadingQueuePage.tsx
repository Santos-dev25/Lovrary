import { useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { X, Play, BookOpen, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ReadingQueuePage = () => {
  const { books, readingQueue, removeFromQueue, reorderQueue, startReading, setSelectedBook, addToQueue } = useBooks();

  const queueBooks = useMemo(
    () => readingQueue.map(id => books.find(b => b.id === id)).filter(Boolean) as typeof books,
    [readingQueue, books]
  );

  const unreadBooks = useMemo(
    () => books.filter(b => b.ownership === "tenho" && b.status === "nao-lido" && !readingQueue.includes(b.id)),
    [books, readingQueue]
  );

  const handleStartReading = (bookId: string, title: string) => {
    startReading(bookId);
    toast.success(`Leitura de "${title}" iniciada! 📖`);
  };

  const handleRemove = (bookId: string, title: string) => {
    removeFromQueue(bookId);
    toast.info(`"${title}" removido da fila de leitura.`);
  };

  const handleAdd = (bookId: string, title: string) => {
    addToQueue(bookId);
    toast.success(`"${title}" adicionado à fila de leitura! 🔖`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Próxima Leitura</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
          Organize a ordem dos livros que você pretende ler a seguir.
        </p>
      </div>

      {/* Queue List */}
      {queueBooks.length > 0 ? (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {queueBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 sm:gap-4 bg-card rounded-2xl border border-border p-3.5 sm:p-4 shadow-card hover:shadow-card-hover transition-all group"
              >
                {/* Position number */}
                <span className="text-lg sm:text-xl font-serif font-bold text-primary w-7 sm:w-8 text-center shrink-0">
                  {index + 1}
                </span>

                {/* 2:3 Cover thumbnail */}
                <div
                  className="w-11 sm:w-12 aspect-[2/3] rounded-lg overflow-hidden shrink-0 shadow-xs border border-border/40 cursor-pointer bg-secondary/30"
                  onClick={() => setSelectedBook(book)}
                  title={`Ver detalhes de ${book.title}`}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Title & metadata */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4
                    translate="no"
                    className="notranslate font-serif font-semibold text-sm sm:text-base text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setSelectedBook(book)}
                  >
                    {book.title}
                  </h4>
                  <p
                    translate="no"
                    className="notranslate text-xs text-muted-foreground truncate font-sans mt-0.5"
                  >
                    {book.author || "Autor desconhecido"}
                    {book.totalPages ? ` • ${book.totalPages} págs` : ""}
                    {book.category ? ` • ${book.category}` : ""}
                  </p>
                </div>

                {/* Action buttons with minimum touch target */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => index > 0 && reorderQueue(index, index - 1)}
                    disabled={index === 0}
                    className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25"
                    aria-label={`Mover "${book.title}" para cima na fila`}
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => index < queueBooks.length - 1 && reorderQueue(index, index + 1)}
                    disabled={index === queueBooks.length - 1}
                    className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-25"
                    aria-label={`Mover "${book.title}" para baixo na fila`}
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleStartReading(book.id, book.title)}
                    className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all"
                    aria-label={`Começar a ler "${book.title}"`}
                    title="Começar a ler agora"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>

                  <button
                    onClick={() => handleRemove(book.id, book.title)}
                    className="min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remover "${book.title}" da fila`}
                    title="Remover da fila"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-14 sm:py-16 bg-card/60 rounded-2xl border border-dashed border-border p-6 sm:p-8 space-y-2">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-60" />
          <h3 className="font-serif font-bold text-foreground text-base">Sua fila de leitura está vazia</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto font-sans leading-relaxed">
            Selecione livros abaixo da sua estante para organizar sua sequência de próximas leituras.
          </p>
        </div>
      )}

      {/* Available to add from shelf */}
      {unreadBooks.length > 0 && (
        <div className="space-y-3.5 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base sm:text-lg text-foreground">
              Livros na Estante Disponíveis para Enfileirar
            </h3>
            <span className="text-xs text-muted-foreground font-numeric">{unreadBooks.length} disponível(is)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {unreadBooks.map(book => (
              <div
                key={book.id}
                className="group flex flex-col justify-between bg-card rounded-2xl border border-border p-3 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 mb-2">
                  <div className="w-10 aspect-[2/3] rounded-md overflow-hidden shrink-0 shadow-2xs border border-border/40 bg-secondary/30">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p translate="no" className="notranslate text-xs font-semibold text-foreground truncate" title={book.title}>
                      {book.title}
                    </p>
                    <p translate="no" className="notranslate text-[10px] text-muted-foreground truncate">
                      {book.author || "Autor desconhecido"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(book.id, book.title)}
                  className="w-full py-1.5 px-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Enfileirar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingQueuePage;
