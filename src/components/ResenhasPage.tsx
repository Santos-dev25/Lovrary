import { useBooks } from "@/context/BooksContext";
import { Star, Quote, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const ResenhasPage = () => {
  const { books, setSelectedBook } = useBooks();
  const reviewedBooks = books.filter(b => b.review || (b.notes && b.notes.length > 0));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">Minhas Resenhas</h2>
        <span className="text-sm text-muted-foreground">{reviewedBooks.length} resenha(s)</span>
      </div>

      {reviewedBooks.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma resenha ainda. Finalize um livro para começar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewedBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl border border-border p-5 shadow-card cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => setSelectedBook(book)}
            >
              <div className="flex gap-4">
                <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-sm" />
                <div className="flex-1 min-w-0">
                  <h3 translate="no" className="notranslate font-display font-semibold text-foreground">{book.title}</h3>
                  <p translate="no" className="notranslate text-xs text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < book.rating ? "fill-gold text-gold" : "text-muted"}`} />
                    ))}
                  </div>

                  {book.review && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{book.review}</p>
                  )}

                  <div className="flex items-center gap-4 mt-2">
                    {book.notes && book.notes.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">{book.notes.length} anotação(ões)</span>
                    )}
                    {book.quotes && book.quotes.length > 0 && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Quote className="w-3 h-3" /> {book.quotes.length} citação(ões)
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
