import { useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { calculateTotalPagesRead } from "@/utils/stats";
import { Target, TrendingUp, Award, BookOpen, Sparkles, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MetasPage = () => {
  const { books, readingGoal, setGoalTarget } = useBooks();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(readingGoal.target));

  const booksReadThisYear = readingGoal.current;
  const goalProgress = readingGoal.target > 0 ? Math.round((booksReadThisYear / readingGoal.target) * 100) : 0;
  const remaining = Math.max(0, readingGoal.target - booksReadThisYear);
  const isGoalReached = readingGoal.target > 0 && booksReadThisYear >= readingGoal.target;

  // Monthly breakdown
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyData = months.map((name, i) => {
    const count = books.filter(b => {
      if (b.status !== "lido" || !b.dateFinished) return false;
      const d = new Date(b.dateFinished);
      return d.getFullYear() === readingGoal.year && d.getMonth() === i;
    }).length;
    return { name, count };
  });

  const handleSaveGoal = () => {
    const val = parseInt(goalInput);
    if (!isNaN(val) && val > 0) {
      setGoalTarget(val);
      setEditingGoal(false);
      toast.success(`Meta para ${readingGoal.year} atualizada para ${val} livros! 🎯`);
    } else {
      toast.error("Por favor, informe uma meta válida maior que zero.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Metas de Leitura</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
          Acompanhe seu ritmo de leitura e defina seu compromisso para o ano.
        </p>
      </div>

      {/* Main Goal Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-5 sm:p-7 shadow-card space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl ${isGoalReached ? "bg-gold/15 text-gold border border-gold/30" : "bg-primary/10 text-primary"}`}>
              {isGoalReached ? <Sparkles className="w-6 h-6" /> : <Target className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground">
                  Meta de {readingGoal.year}
                </h3>
                {isGoalReached && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    Atingida! 🎉
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-numeric">
                <span className="font-bold text-foreground">{booksReadThisYear}</span> de{" "}
                <span className="font-bold text-foreground">{readingGoal.target}</span> livros concluídos
              </p>
            </div>
          </div>

          {/* Inline Edit Control */}
          {editingGoal ? (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <input
                type="number"
                min={1}
                max={999}
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-20 text-sm px-3 py-1.5 bg-background border border-input rounded-xl text-foreground text-center font-numeric font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={e => e.key === "Enter" && handleSaveGoal()}
                autoFocus
              />
              <button
                onClick={handleSaveGoal}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Salvar
              </button>
              <button
                onClick={() => setEditingGoal(false)}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setGoalInput(String(readingGoal.target)); setEditingGoal(true); }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors self-start sm:self-auto shadow-2xs"
            >
              Editar Meta
            </button>
          )}
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div
            role="progressbar"
            aria-valuenow={booksReadThisYear}
            aria-valuemin={0}
            aria-valuemax={readingGoal.target}
            aria-label={`Progresso da meta de leitura: ${goalProgress}%`}
            className="w-full h-6 bg-secondary rounded-full overflow-hidden relative"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(goalProgress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full flex items-center justify-end pr-2.5 transition-colors ${
                isGoalReached ? "bg-gold text-amber-950 font-bold" : "bg-primary text-primary-foreground font-bold"
              }`}
            >
              {goalProgress >= 15 && (
                <span className="text-[11px] font-numeric tracking-wider">{goalProgress}%</span>
              )}
            </motion.div>
            {goalProgress < 15 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-numeric font-bold text-muted-foreground">
                {goalProgress}%
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            {remaining > 0
              ? `Faltam ${remaining} livro(s) para atingir sua meta anual. Continue firme na leitura!`
              : "🎉 Parabéns! Você atingiu sua meta anual de leitura. Que conquista memorável!"}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Concluídos no Ano</span>
          </div>
          <p className="text-2xl sm:text-3xl font-numeric font-bold text-foreground">{booksReadThisYear}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Livros lidos em {readingGoal.year}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-gold/15 text-gold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Em Leitura Ativa</span>
          </div>
          <p className="text-2xl sm:text-3xl font-numeric font-bold text-foreground">
            {books.filter(b => b.status === "lendo").length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Obras na escrivaninha</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-success/15 text-success">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Volume de Leitura</span>
          </div>
          <p className="text-2xl sm:text-3xl font-numeric font-bold text-foreground">
            {calculateTotalPagesRead(books).toLocaleString("pt-BR")}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Total de páginas lidas</p>
        </motion.div>
      </div>

      {/* Monthly Breakdown Rhythm */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground">
            Ritmo Mensal de Conclusões
          </h3>
          <span className="text-xs text-muted-foreground font-numeric">{booksReadThisYear} em {readingGoal.year}</span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 pt-2">
          {monthlyData.map((m, i) => (
            <div key={m.name} className="text-center flex flex-col justify-end">
              <div className="h-28 flex items-end justify-center mb-1.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: m.count > 0 ? `${Math.min(Math.max(m.count * 28, 24), 100)}%` : "8%" }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                  className={`w-full max-w-[26px] rounded-t-lg transition-colors ${
                    m.count > 0 ? "bg-primary" : "bg-secondary/70"
                  }`}
                  title={`${m.name}: ${m.count} livro(s)`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{m.name}</span>
              {m.count > 0 ? (
                <p className="text-[11px] font-bold text-primary font-numeric">{m.count}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground/40 font-numeric">—</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetasPage;
