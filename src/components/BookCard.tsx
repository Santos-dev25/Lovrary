import { memo } from "react";
import { Bookmark } from "lucide-react";
import type { Book } from "@/data/mockBooks";
import { motion } from "framer-motion";
import RatingStars from "@/components/RatingStars";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  lido: {
    label: "Lido",
    className: "bg-success/15 text-success border border-success/30 font-semibold",
  },
  lendo: {
    label: "Lendo",
    className: "bg-gold/15 text-gold border border-gold/30 font-semibold",
  },
  "nao-lido": {
    label: "Na Estante",
    className: "bg-card/90 text-muted-foreground backdrop-blur-xs border border-border font-medium",
  },
  emprestado: {
    label: "Emprestado",
    className: "bg-secondary text-secondary-foreground border border-border font-medium",
  },
  abandonado: {
    label: "Abandonado",
    className: "bg-destructive/15 text-destructive border border-destructive/30 font-medium",
  },
};

const BookCard = memo(({ book, onClick }: BookCardProps) => {
  const isWishlist = book.ownership === "pretendo";
  const status = isWishlist
    ? { label: "Pretendo", className: "bg-gold/15 text-gold border border-gold/30 font-semibold" }
    : (statusConfig[book.status] || statusConfig["nao-lido"]);
  const hasNotes = book.notes && book.notes.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalhes de ${book.title}, por ${book.author || "autor desconhecido"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group relative bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 ease-out hover:-translate-y-1 will-change-transform cursor-pointer overflow-hidden flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div>
        {/* Book Cover Container: Protagonist 2:3 clean cover */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-secondary">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-95"
            loading="lazy"
          />

          {/* Status Badge */}
          <span
            className={`absolute top-2 left-2 text-[11px] px-2.5 py-0.5 rounded-full z-10 shadow-2xs ${status.className}`}
          >
            {status.label}
          </span>

          {/* Notes Indicator */}
          {hasNotes && (
            <span
              className="absolute top-2 right-2 bg-card/90 backdrop-blur-xs text-primary p-1.5 rounded-full border border-border shadow-2xs z-10"
              title={`${book.notes?.length} anotação(ões) no Journal`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-primary" />
            </span>
          )}

          {/* Progress Bar for Currently Reading */}
          {book.status === "lendo" && book.progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/60 backdrop-blur-xs z-10">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-r-full"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="p-3">
          <h3
            translate="no"
            className="notranslate font-sans font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors"
          >
            {book.title}
          </h3>

          <p translate="no" className="notranslate text-xs text-muted-foreground mt-0.5 truncate">
            {book.author || "Autor desconhecido"}
          </p>

          {/* Rating Stars */}
          {book.rating > 0 && (
            <div className="mt-2">
              <RatingStars value={book.rating} size="sm" showValue readOnly />
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
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    translate="no"
                    className="notranslate text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/80 truncate max-w-[110px]"
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
        <div className="px-3 pb-2.5 pt-0 border-t border-border/40 mt-1">
          <p className="text-[11px] text-muted-foreground font-numeric pt-1.5 flex justify-between">
            <span>Pág. {book.currentPage || 0}/{book.totalPages || 0}</span>
            <span className="font-semibold text-primary">{book.progress || 0}%</span>
          </p>
        </div>
      )}
    </motion.div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
