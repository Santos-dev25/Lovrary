import { Star, Bookmark } from "lucide-react";
import type { Book } from "@/data/mockBooks";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const statusConfig = {
  lido: {
    label: "Lido",
    className: "bg-marsala text-primary-foreground shadow-xs font-semibold",
  },
  lendo: {
    label: "Lendo",
    className: "bg-gold text-amber-950 dark:text-amber-900 font-bold shadow-xs",
  },
  "nao-lido": {
    label: "Na Estante",
    className: "bg-card/90 text-foreground/80 backdrop-blur-xs border border-border/80 font-medium",
  },
};

const BookCard = ({ book, onClick }: BookCardProps) => {
  const status = statusConfig[book.status] || statusConfig["nao-lido"];
  const hasNotes = book.notes && book.notes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="group relative bg-card rounded-2xl border border-border/80 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Book Cover Container with Spine Effect */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl bg-secondary book-spine-effect">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Status Badge */}
          <span
            className={`absolute top-2.5 left-2.5 text-[11px] px-2.5 py-0.5 rounded-full z-10 transition-transform ${status.className}`}
          >
            {status.label}
          </span>

          {/* Notes Indicator */}
          {hasNotes && (
            <span
              className="absolute top-2.5 right-2.5 bg-card/90 backdrop-blur-xs text-marsala p-1.5 rounded-full border border-border/60 shadow-xs z-10"
              title={`${book.notes?.length} anotação(ões) no Journal`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-marsala" />
            </span>
          )}

          {/* Progress Bar for Currently Reading */}
          {book.status === "lendo" && book.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/40 backdrop-blur-xs z-10">
              <div
                className="h-full gradient-marsala transition-all duration-500 rounded-r-full"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-3.5">
          <h3
            translate="no"
            className="notranslate font-display font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-marsala transition-colors"
          >
            {book.title}
          </h3>

          <p translate="no" className="notranslate text-xs text-muted-foreground mt-1 truncate">
            {book.author || "Autor desconhecido"}
          </p>

          {/* Rating Stars */}
          {book.rating > 0 && (
            <div className="flex items-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < book.rating ? "fill-gold text-gold" : "text-border"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tags & Vibes */}
          {(() => {
            const allTags = [
              ...(book.category ? [book.category] : []),
              ...(book.vibes || []),
            ].filter((t, idx, arr) => arr.findIndex(x => x.toLowerCase() === t.toLowerCase()) === idx);

            const visibleTags = allTags.slice(0, 2);
            const hasMore = allTags.length > 2;

            if (visibleTags.length === 0) return null;

            return (
              <div className="flex flex-wrap items-center gap-1 mt-2.5">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    translate="no"
                    className="notranslate text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-foreground/80 border border-border truncate max-w-[120px]"
                  >
                    {tag}
                  </span>
                ))}
                {hasMore && (
                  <span className="text-[10px] text-muted-foreground font-medium px-1">
                    +{allTags.length - 2}
                  </span>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Footer / Progress Text */}
      {book.status === "lendo" && (
        <div className="px-3.5 pb-3 pt-0 border-t border-border/40 mt-1">
          <p className="text-[11px] text-muted-foreground font-numeric pt-1.5 flex justify-between">
            <span>Pág. {book.currentPage || 0}/{book.totalPages || 0}</span>
            <span className="font-semibold text-marsala">{book.progress || 0}%</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BookCard;
