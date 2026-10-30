import { useBooks } from "@/context/BooksContext";
import { Quote, BookOpen, Feather } from "lucide-react";
import { motion } from "framer-motion";
import RatingStars from "@/components/RatingStars";

const ResenhasPage = () => {
  const { books, setSelectedBook } = useBooks();
  const reviewedBooks = books.filter(b => b.review || (b.notes && b.notes.length > 0));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Minhas Resenhas</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
            Sua antologia crítica com impressões, ensaios breves e notas de leitura.
          </p>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground font-numeric self-start sm:self-auto">
          {reviewedBooks.length} resenha(s) registrada(s)
        </span>
      </div>

      {reviewedBooks.length === 0 ? (
        <div className="text-center py-16 sm:py-20 bg-card/40 rounded-2xl border border-dashed border-border p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-foreground text-lg">Nenhuma resenha registrada ainda</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto font-sans leading-relaxed">
            Ao concluir uma leitura ou redigir suas impressões na ficha de um livro, suas resenhas críticas aparecerão reunidas aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewedBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              tabIndex={0}
              role="button"
              aria-label={`Ver resenha completa de ${book.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedBook(book);
                }
              }}
              onClick={() => setSelectedBook(book)}
              className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex gap-4 sm:gap-5">
                {/* 2:3 Cover thumbnail */}
                <div className="w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-xs border border-border/40 bg-secondary/30">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <h3
                        translate="no"
                        className="notranslate font-serif font-bold text-base sm:text-lg text-foreground truncate group-hover:text-primary transition-colors"
                      >
                        {book.title}
                      </h3>
                      {book.rating > 0 && (
                        <div className="shrink-0">
                          <RatingStars value={book.rating} size="sm" showValue readOnly />
                        </div>
                      )}
                    </div>

                    <p
                      translate="no"
                      className="notranslate text-xs text-muted-foreground font-sans mt-0.5"
                    >
                      por <span className="text-foreground font-medium">{book.author || "Autor desconhecido"}</span>
                      {book.category ? ` • ${book.category}` : ""}
                    </p>

                    {book.review ? (
                      <p
                        translate="no"
                        className="notranslate text-xs sm:text-sm text-foreground/90 font-serif leading-relaxed line-clamp-3 mt-2.5 pl-0.5"
                      >
                        {book.review}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/70 italic mt-2 font-serif">
                        Anotações registradas no diário de bordo (sem texto corrido de resenha).
                      </p>
                    )}
                  </div>

                  {/* Footer metadata badges */}
                  <div className="flex items-center gap-3.5 mt-3 pt-2.5 border-t border-border/60 text-[11px] text-muted-foreground font-sans">
                    {book.notes && book.notes.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Feather className="w-3.5 h-3.5 text-primary" />
                        <span className="font-numeric">{book.notes.length}</span> anotação(ões) no Journal
                      </span>
                    )}
                    {book.quotes && book.quotes.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Quote className="w-3.5 h-3.5 text-gold" />
                        <span className="font-numeric">{book.quotes.length}</span> citação(ões) salvas
                      </span>
                    )}
                    {book.dateFinished && (
                      <span className="ml-auto text-muted-foreground/80 font-numeric">
                        Concluído em {book.dateFinished}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResenhasPage;
