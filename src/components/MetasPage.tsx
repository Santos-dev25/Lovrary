import { useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { Target, TrendingUp, Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const MetasPage = () => {
  const { books, readingGoal, setGoalTarget } = useBooks();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(readingGoal.target));

  const booksReadThisYear = books.filter(b => {
    if (b.status !== "lido") return false;
    if (b.dateFinished) {
      const d = new Date(b.dateFinished);
      return !isNaN(d.getTime()) ? d.getFullYear() === readingGoal.year : true;
    }
    return true;
  }).length;
  const goalProgress = readingGoal.target > 0 ? Math.round((booksReadThisYear / readingGoal.target) * 100) : 0;
  const remaining = Math.max(0, readingGoal.target - booksReadThisYear);

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
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-display font-bold text-foreground">Metas de Leitura</h2>

      {/* Main goal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-marsala">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">Meta {readingGoal.year}</h3>
              <p className="text-xs text-muted-foreground">
                {booksReadThisYear} de {readingGoal.target} livros
              </p>
            </div>
          </div>
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-20 text-sm px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-center"
                onKeyDown={e => e.key === "Enter" && handleSaveGoal()}
              />
              <button onClick={handleSaveGoal} className="text-xs px-3 py-1.5 rounded-lg gradient-marsala text-primary-foreground">Salvar</button>
              <button onClick={() => setEditingGoal(false)} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-foreground">Cancelar</button>
            </div>
          ) : (
            <button
              onClick={() => { setGoalInput(String(readingGoal.target)); setEditingGoal(true); }}
              className="text-xs font-medium px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            >
              Editar Meta
            </button>
          )}
        </div>

        {/* Big progress */}
        <div className="relative">
          <div className="w-full h-6 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(goalProgress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full gradient-marsala rounded-full flex items-center justify-end pr-2"
            >
              {goalProgress >= 15 && (
                <span className="text-[10px] font-bold text-primary-foreground">{goalProgress}%</span>
              )}
            </motion.div>
          </div>
          {goalProgress < 15 && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">{goalProgress}%</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          {remaining > 0
            ? `Faltam ${remaining} livros para atingir sua meta! Você consegue! 💪`
            : "🎉 Parabéns! Você atingiu sua meta anual!"}
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card">
          <BookOpen className="w-5 h-5 text-marsala mb-2" />
          <p className="text-3xl font-numeric text-foreground">{booksReadThisYear}</p>
          <p className="text-xs text-muted-foreground">Livros lidos em {readingGoal.year}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card">
          <TrendingUp className="w-5 h-5 text-marsala mb-2" />
          <p className="text-3xl font-numeric text-foreground">
            {books.filter(b => b.status === "lendo").length}
          </p>
          <p className="text-xs text-muted-foreground">Em leitura agora</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-4 shadow-card">
          <Award className="w-5 h-5 text-gold mb-2" />
          <p className="text-3xl font-numeric text-foreground">
            {books.filter(b => b.status === "lido").reduce((sum, b) => sum + (b.totalPages || 0), 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Páginas lidas no total</p>
        </motion.div>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">Leituras por Mês</h3>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {monthlyData.map((m, i) => (
            <div key={m.name} className="text-center">
              <div className="h-24 flex items-end justify-center mb-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: m.count > 0 ? `${Math.max(m.count * 30, 20)}%` : "8%" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`w-full max-w-[24px] rounded-t-md ${m.count > 0 ? "gradient-marsala" : "bg-secondary"}`}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{m.name}</span>
              {m.count > 0 && <p className="text-[10px] font-semibold text-marsala">{m.count}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetasPage;
