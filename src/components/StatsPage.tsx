import { useState, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { categories } from "@/data/mockBooks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BookOpen, TrendingUp, Award, Target, Filter } from "lucide-react";
import { motion } from "framer-motion";

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const StatsPage = () => {
  const { books, readingGoal } = useBooks();
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [yearFilter, setYearFilter] = useState<number>(readingGoal.year);

  const availableYears = useMemo(() => Array.from(
    new Set([
      new Date().getFullYear(),
      readingGoal.year,
      ...books
        .filter((b) => b.dateFinished)
        .map((b) => new Date(b.dateFinished!).getFullYear())
        .filter((y) => !isNaN(y)),
    ])
  ).sort((a, b) => b - a), [books, readingGoal.year]);

  const { booksRead, totalPages, avgRating, monthlyStats, statCards, categoryBreakdown, bestMonth } = useMemo(() => {
    const filteredRead = books.filter((b) => {
      if (b.status !== "lido") return false;
      if (categoryFilter !== "Todos" && b.category !== categoryFilter) return false;
      if (b.dateFinished) {
        const d = new Date(b.dateFinished);
        if (d.getFullYear() !== yearFilter) return false;
      }
      return true;
    });

    const readCount = filteredRead.length;
    const pages = filteredRead.reduce((s, b) => s + (b.totalPages || 0), 0);
    const avg = filteredRead.length > 0
      ? (filteredRead.reduce((s, b) => s + b.rating, 0) / filteredRead.length).toFixed(1)
      : "—";

    const mStats = MONTH_NAMES.map((month, i) => {
      const count = filteredRead.filter((b) => {
        if (!b.dateFinished) return false;
        const d = new Date(b.dateFinished);
        return d.getFullYear() === yearFilter && d.getMonth() === i;
      }).length;
      return { month, count };
    });

    const bMonth = mStats.reduce((a, b) => a.count > b.count ? a : b, { month: "—", count: 0 });

    const userCategories = Array.from(
      new Set([
        ...categories.filter(c => c !== "Todos"),
        ...books.filter(b => b.status === "lido" && b.category).map(b => b.category!),
      ])
    );

    const cBreakdown = userCategories
      .map((cat) => ({
        category: cat,
        count: books.filter((b) => b.status === "lido" && b.category === cat).length,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    const cards = [
      { icon: BookOpen, label: "Livros Lidos", value: readCount, sub: `em ${yearFilter}` },
      { icon: TrendingUp, label: "Páginas Lidas", value: pages.toLocaleString("pt-BR"), sub: `em ${yearFilter}` },
      { icon: Award, label: "Mês Destaque", value: bMonth.month, sub: `${bMonth.count} livro(s)` },
      { icon: Target, label: "Nota Média", value: avg, sub: "de 5 estrelas" },
    ];

    return {
      filteredRead,
      booksRead: readCount,
      totalPages: pages,
      avgRating: avg,
      monthlyStats: mStats,
      bestMonth: bMonth,
      categoryBreakdown: cBreakdown,
      statCards: cards,
    };
  }, [books, categoryFilter, yearFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Accessible data summary table for screen readers */}
      <div className="sr-only">
        <h3>Sumário Estatístico de Leituras {yearFilter}</h3>
        <table>
          <caption>Desempenho de leitura por mês em {yearFilter}</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Livros Lidos</th>
            </tr>
          </thead>
          <tbody>
            {monthlyStats.map(m => (
              <tr key={m.month}>
                <td>{m.month}</td>
                <td>{m.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">Registros de Leitura</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-sans">
            Métricas de ritmo, distribuição mensal e avaliação do seu acervo.
          </p>
        </div>
        {availableYears.length > 1 && (
          <div className="flex items-center gap-1 bg-secondary/80 border border-border p-1 rounded-xl self-start sm:self-auto">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  yearFilter === yr
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              categoryFilter === cat
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground truncate">{stat.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-numeric font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground">
            Leituras por Mês {categoryFilter !== "Todos" && `(${categoryFilter})`}
          </h3>
          <span className="text-xs text-muted-foreground font-numeric">
            {booksRead} livro(s) em {yearFilter}
          </span>
        </div>
        <div className="w-full h-[220px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                width={26}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--secondary) / 0.5)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                  boxShadow: "var(--shadow-card-hover)",
                }}
                labelStyle={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
                formatter={(value: number) => [`${value} livro(s)`, "Lidos"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {monthlyStats.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.count > 0 ? (entry.month === bestMonth.month && bestMonth.count > 1 ? "hsl(var(--gold))" : "hsl(var(--primary))") : "hsl(var(--secondary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category breakdown */}
      {categoryFilter === "Todos" && categoryBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-card"
        >
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground mb-4">Distribuição por Categoria</h3>
          <div className="space-y-3.5">
            {categoryBreakdown.map(c => {
              const pct = booksRead > 0 ? Math.round((c.count / booksRead) * 100) : 0;
              return (
                <div key={c.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{c.category}</span>
                    <span className="text-muted-foreground font-numeric">{c.count} livro(s) • {pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-primary rounded-full"
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
