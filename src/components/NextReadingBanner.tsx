import { useBooks } from "@/context/BooksContext";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onStartReading?: () => void;
}

const NextReadingBanner = ({ onStartReading }: Props) => {
  const { books, readingQueue, startReading } = useBooks();
  const nextBook = readingQueue.length > 0 ? books.find((b) => b.id === readingQueue[0]) : null;
  if (!nextBook) return null;

  const handleStart = () => {
    startReading(nextBook.id);
    onStartReading?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-marsala rounded-xl p-4 flex items-center gap-4 text-primary-foreground"
    >
      <div className="p-2 rounded-lg bg-primary-foreground/15">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium opacity-80">Próximo na sua fila</p>
        <p translate="no" className="notranslate font-display font-bold text-sm truncate">{nextBook.title}</p>
        <p translate="no" className="notranslate text-xs opacity-70">{nextBook.author}</p>
      </div>
      <button
        onClick={handleStart}
        className="shrink-0 flex items-center gap-1 text-xs font-semibold bg-primary-foreground/15 hover:bg-primary-foreground/25 px-3 py-2 rounded-lg transition-colors"
      >
        <span className="hidden sm:inline">Começar</span> <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default NextReadingBanner;
