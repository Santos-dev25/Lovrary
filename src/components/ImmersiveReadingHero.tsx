import { useState, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import {
  BookOpen, ArrowRight, Bookmark, Check, Feather, Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ImmersiveReadingHeroProps {
  onOpenJournal?: () => void;
  onExploreAcervo?: () => void;
}

export const ImmersiveReadingHero = ({ onOpenJournal, onExploreAcervo }: ImmersiveReadingHeroProps) => {
  const { books, updateProgress, setSelectedBook, startReading, readingQueue, streak, readingPace } = useBooks();

  // Livro ativo em leitura (prioriza o que tem maior progresso ou mais recente)
  const activeBook = useMemo(() => books.find(b => b.status === "lendo") || null, [books]);
  // Próximo livro da fila como alternativa
  const nextInQueue = useMemo(
    () => (readingQueue.length > 0 ? books.find(b => b.id === readingQueue[0]) || null : null),
    [readingQueue, books]
  );

  const [pageInput, setPageInput] = useState("");
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Saudação poética conforme o horário local
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: "Bom dia, leitora", icon: "☕" };
    if (hour >= 12 && hour < 18) return { text: "Boa tarde, leitora", icon: "📖" };
    return { text: "Boa noite, leitora", icon: "🕯️" };
  }, []);

  const handleSavePage = () => {
    if (!activeBook) return;
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 0) {
      const maxP = activeBook.totalPages || page;
      const targetPage = Math.min(page, maxP);
      updateProgress(activeBook.id, targetPage);
      setPageInput("");
      setJustSaved(true);
      toast.success(`Página ${targetPage} registrada! Ritmo atualizado. 📖`);
      setTimeout(() => {
        setJustSaved(false);
        setIsEditingPage(false);
      }, 850);
    }
  };

  // Se não há livro ativo em leitura, exibe o convite literário
  if (!activeBook) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-card"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span>{greeting.icon}</span> {greeting.text}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight">
              Sua próxima grande história está à sua espera.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Sua estante possui tesouros prontos para serem desbravados. Escolha um livro para acompanhar páginas, capítulos e pensamentos no seu diário.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {nextInQueue ? (
                <button
                  onClick={() => startReading(nextInQueue.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  <span>Iniciar Próximo da Fila: {nextInQueue.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onExploreAcervo}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explorar Meu Acervo</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Visual Element */}
          <div className="shrink-0 w-32 h-44 sm:w-36 sm:h-52 rounded-xl bg-secondary/60 border border-dashed border-border flex flex-col items-center justify-center p-4 text-center">
            <BookOpen className="w-8 h-8 text-primary/50 mb-2" />
            <span className="text-[11px] font-medium text-muted-foreground">Estante silenciosa</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Livro ativo em leitura: Renderização Imersiva com Capa Protagonista
  const lastNote = activeBook.notes && activeBook.notes.length > 0
    ? activeBook.notes[activeBook.notes.length - 1]
    : null;

  const lastQuote = activeBook.quotes && activeBook.quotes.length > 0
    ? activeBook.quotes[activeBook.quotes.length - 1]
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border p-5 sm:p-8 shadow-card"
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Protagonist Book Showcase (Capa em Proporção 2:3) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div
            onClick={() => setSelectedBook(activeBook)}
            className="group relative cursor-pointer select-none"
            title="Clique para ver os detalhes do livro"
          >
            {/* Book Cover Container: 2:3 Clean, Natural Shadow, sem relevo falso */}
            <div className="relative w-40 sm:w-48 aspect-[2/3] rounded-xl overflow-hidden shadow-card-hover border border-border/80 transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src={activeBook.cover}
                alt={activeBook.title}
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Status Badge overlay discreto na base */}
              <div className="absolute bottom-2 inset-x-2">
                <div className="bg-card/90 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-border/60 shadow-xs flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    Lendo Agora
                  </span>
                  <span className="text-xs font-numeric font-bold text-foreground">
                    {activeBook.progress || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reading Journey & Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          {/* Header & Greeting */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <span>{greeting.icon}</span> {greeting.text}
              </span>
              {activeBook.category && (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                  {activeBook.category}
                </span>
              )}
            </div>

            <h2
              onClick={() => setSelectedBook(activeBook)}
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground tracking-tight hover:text-primary transition-colors cursor-pointer"
            >
              {activeBook.title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              por <span className="text-foreground">{activeBook.author || "Autor desconhecido"}</span>
            </p>
          </div>

          {/* Reading Progress Ruler */}
          <div className="bg-background rounded-xl p-4 border border-border shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-numeric">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-gold fill-gold/20" />
                <span className="font-semibold text-foreground">
                  Página {activeBook.currentPage || 0} de {activeBook.totalPages || "?"}
                </span>
                {streak.currentStreak > 0 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    🔥 {streak.currentStreak} {streak.currentStreak === 1 ? "dia" : "dias"}
                  </span>
                )}
              </div>
              <span className="font-bold text-primary font-numeric">
                {activeBook.progress || 0}% concluído
              </span>
            </div>

            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden p-0.5 border border-border/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeBook.progress || 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
              <span>
                Faltam {Math.max(0, (activeBook.totalPages || 0) - (activeBook.currentPage || 0))} páginas para a conclusão
                {readingPace.estimatedDaysToFinish !== null && readingPace.estimatedDaysToFinish > 0
                  ? ` • ~${readingPace.estimatedDaysToFinish} ${readingPace.estimatedDaysToFinish === 1 ? "dia" : "dias"} no ritmo atual`
                  : ""}
              </span>
              {isEditingPage ? (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <input
                    type="number"
                    min={0}
                    max={activeBook.totalPages || undefined}
                    placeholder="Pág..."
                    value={pageInput}
                    onChange={e => setPageInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSavePage()}
                    className="w-16 px-2 py-0.5 text-xs bg-card border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    autoFocus
                  />
                  <button
                    onClick={handleSavePage}
                    disabled={justSaved}
                    className={`p-1 rounded-md text-primary-foreground transition-all duration-300 ${
                      justSaved ? "bg-success scale-105" : "bg-primary hover:bg-primary/90"
                    }`}
                    title="Confirmar"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  {!justSaved && (
                    <button
                      onClick={() => setIsEditingPage(false)}
                      className="text-[10px] text-muted-foreground hover:text-foreground px-1"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPageInput(String(activeBook.currentPage || ""));
                    setIsEditingPage(true);
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Atualizar página rápida
                </button>
              )}
            </div>
          </div>

          {/* Last Reflection / Journal Quote Highlight */}
          {(lastNote || lastQuote) && (
            <div className="rounded-xl bg-secondary/50 border border-border p-3.5 sm:p-4 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-card text-primary shrink-0 mt-0.5 shadow-2xs">
                {lastNote ? <Feather className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                  {lastNote ? `Última reflexão • ${lastNote.chapter || "Journal"}` : "Citação em destaque"}
                </span>
                <p className="text-xs font-serif italic text-foreground/90 line-clamp-2 leading-relaxed">
                  “{lastNote ? lastNote.text : lastQuote}”
                </p>
              </div>
            </div>
          )}

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setSelectedBook(activeBook)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Abrir Painel do Livro</span>
            </button>

            <button
              onClick={onOpenJournal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 text-xs font-medium shadow-xs transition-colors"
            >
              <Feather className="w-4 h-4 text-primary" />
              <span>Escrever no Journal</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ImmersiveReadingHero;
