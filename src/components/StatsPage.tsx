import { useState } from "react";
import { useBooks } from "@/context/BooksContext";
import { categories } from "@/data/mockBooks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BookOpen, TrendingUp, Award, Target, Filter } from "lucide-react";
import { motion } from "framer-motion";

const StatsPage = () => {
  const { books, readingGoal } = useBooks();
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [yearFilter, setYearFilter] = useState<number>(readingGoal.year);

  const availableYears = Array.from(
    new Set([
      new Date().getFullYear(),
      readingGoal.year,
      ...books
        .filter((b) => b.dateFinished)
        .map((b) => new Date(b.dateFinished!).getFullYear())
        .filter((y) => !isNaN(y)),
    ])
  ).sort((a, b) => b - a);

  const filteredRead = books.filter((b) => {
    if (b.status !== "lido") return false;
    if (categoryFilter !== "Todos" && b.category !== categoryFilter) return false;
    if (b.dateFinished) {
      const d = new Date(b.dateFinished);
      if (d.getFullYear() !== yearFilter) return false;
    }
    return true;
  });

  const booksRead = filteredRead.length;
  const totalPages = filteredRead.reduce((s, b) => s + (b.totalPages || 0), 0);
  const avgRating = filteredRead.length > 0
    ? (filteredRead.reduce((s, b) => s + b.rating, 0) / filteredRead.length).toFixed(1)
    : "—";

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyStats = months.map((month, i) => {
    const count = filteredRead.filter((b) => {
      if (!b.dateFinished) return false;
      const d = new Date(b.dateFinished);
      return d.getFullYear() === yearFilter && d.getMonth() === i;
    }).length;
    return { month, count };
  });

  const bestMonth = monthlyStats.reduce((a, b) => a.count > b.count ? a : b, { month: "—", count: 0 });

  // Category breakdown
  const categoryBreakdown = categories.filter((c) => c !== "Todos").map((cat) => ({
    category: cat,
    count: books.filter((b) => b.status === "lido" && b.category === cat).length,
  })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  const statCards = [
    { icon: BookOpen, label: "Livros Lidos", value: booksRead, sub: `em ${yearFilter}` },
    { icon: TrendingUp, label: "Páginas Lidas", value: totalPages.toLocaleString(), sub: `em ${yearFilter}` },
    { icon: Award, label: "Mês Destaque", value: bestMonth.month, sub: `${bestMonth.count} livro(s)` },
    { icon: Target, label: "Nota Média", value: avgRating, sub: "de 5 estrelas" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-display font-bold text-foreground">Estatísticas</h2>
        {availableYears.length > 1 && (
          <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  yearFilter === yr
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              categoryFilter === cat
                ? "gradient-marsala text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-4 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary"><Icon className="w-4 h-4 text-marsala" /></div>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-3xl font-numeric text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-4">
          Leituras por Mês {categoryFilter !== "Todos" && `(${categoryFilter})`}
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyStats} barSize={28}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {monthlyStats.map((entry, index) => (
                <Cell key={index} fill={entry.count > 0 ? "hsl(var(--marsala))" : "hsl(var(--muted))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category breakdown */}
      {categoryFilter === "Todos" && categoryBreakdown.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-5 shadow-card">
          <h3 className="font-display font-semibold text-foreground mb-4">Por Categoria</h3>
          <div className="space-y-3">
            {categoryBreakdown.map(c => {
              const pct = booksRead > 0 ? Math.round((c.count / booksRead) * 100) : 0;
              return (
                <div key={c.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{c.category}</span>
                    <span className="text-muted-foreground">{c.count} livro(s) • {pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full gradient-marsala rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsPage;
