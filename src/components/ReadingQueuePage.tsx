import { useBooks } from "@/context/BooksContext";
import { GripVertical, X, Play, BookOpen, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const ReadingQueuePage = () => {
  const { books, readingQueue, removeFromQueue, reorderQueue, startReading, setSelectedBook } = useBooks();

  const queueBooks = readingQueue.map(id => books.find(b => b.id === id)).filter(Boolean) as typeof books;
  const unreadBooks = books.filter(b => b.ownership === "tenho" && b.status === "nao-lido" && !readingQueue.includes(b.id));

  const { addToQueue } = useBooks();

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-foreground">Próxima Leitura</h2>
      <p className="text-sm text-muted-foreground">Organize a ordem dos livros que você pretende ler.</p>

      {/* Queue */}
      {queueBooks.length > 0 ? (
        <div className="space-y-2">
          {queueBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 shadow-card group"
            >
              <span className="text-lg font-display font-bold text-marsala w-8 text-center">{index + 1}</span>
              <img
                src={book.cover}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg shadow-sm cursor-pointer"
                onClick={() => setSelectedBook(book)}
              />
              <div className="flex-1 min-w-0">
                <h4 translate="no" className="notranslate font-display font-semibold text-sm text-foreground truncate">{book.title}</h4>
                <p translate="no" className="notranslate text-xs text-muted-foreground">{book.author} • {book.totalPages} páginas</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => index > 0 && reorderQueue(index, index - 1)}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-30"
                >
                  <ArrowUp className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => index < queueBooks.length - 1 && reorderQueue(index, index + 1)}
                  disabled={index === queueBooks.length - 1}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-30"
                >
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => startReading(book.id)}
                  className="p-1.5 rounded-lg hover:bg-marsala/10 transition-colors"
                  title="Começar a ler"
                >
                  <Play className="w-4 h-4 text-marsala" />
                </button>
                <button
                  onClick={() => removeFromQueue(book.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Sua fila está vazia. Adicione livros abaixo!</p>
        </div>
      )}

      {/* Available to add */}
      {unreadBooks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Livros disponíveis para adicionar</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {unreadBooks.map(book => (
              <button
                key={book.id}
                onClick={() => addToQueue(book.id)}
                className="flex items-center gap-3 bg-card rounded-xl border border-border p-3 hover:border-marsala/30 transition-colors text-left"
              >
                <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                <div className="min-w-0">
                  <p translate="no" className="notranslate text-xs font-semibold text-foreground truncate">{book.title}</p>
                  <p translate="no" className="notranslate text-[10px] text-muted-foreground truncate">{book.author}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingQueuePage;
