import { useBooks } from "@/context/BooksContext";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

const WelcomeBanner = () => {
  const { books, readingGoal } = useBooks();
  const booksReadThisYear = books.filter(
    (b) => b.status === "lido" && (!b.dateFinished || b.dateFinished?.startsWith(String(readingGoal.year)))
  ).length;
  const booksReading = books.filter((b) => b.status === "lendo").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Bem-vindo de volta! 📖
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Você já concluiu <span className="font-semibold text-marsala font-numeric">{booksReadThisYear}</span> {booksReadThisYear === 1 ? "livro" : "livros"} este ano
          {booksReading > 0 ? (
            <> e está com <span className="font-semibold text-marsala font-numeric">{booksReading}</span> em andamento.</>
          ) : (
            <>. Que tal escolher uma nova leitura?</>
          )}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-card shrink-0">
        <div className="p-2 rounded-xl bg-gold/15 text-gold">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Em leitura</p>
          <p className="font-numeric text-foreground text-lg font-bold leading-tight">{booksReading}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
