import { useBooks } from "@/context/BooksContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BookOpen, TrendingUp, Award, Target, FileText } from "lucide-react";
import { motion } from "framer-motion";

const StatsPanel = () => {
  const { books, readingGoal: goal } = useBooks();

  const booksRead = books.filter((b) => b.status === "lido").length;
  const booksReading = books.filter((b) => b.status === "lendo").length;
  const goalProgress = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;

  // Total de páginas lidas
  const pagesRead = books.reduce((sum, b) => {
    if (b.status === "lido") return sum + (b.totalPages || 0);
    if (b.status === "lendo") return sum + (b.currentPage || 0);
    return sum;
  }, 0);

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const monthlyStats = months.map((month, i) => {
    const count = books.filter((b) => {
      if (b.status !== "lido" || !b.dateFinished) return false;
      const d = new Date(b.dateFinished);
      return !isNaN(d.getTime()) && d.getMonth() === i;
    }).length;
    return { month, count };
  });

  const bestMonth = monthlyStats.reduce(
    (a, b) => (a.count > b.count ? a : b),
    { month: "—", count: 0 }
  );

  const statCards = [
    { icon: BookOpen, label: "Livros Lidos", value: booksRead, sub: `em ${goal.year}` },
    { icon: FileText, label: "Páginas Lidas", value: pagesRead.toLocaleString("pt-BR"), sub: "total acumulado" },
    { icon: TrendingUp, label: "Lendo Agora", value: booksReading, sub: "em andamento" },
    { icon: Award, label: "Mês Destaque", value: bestMonth.month, sub: `${bestMonth.count} livro(s)` },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Balanced Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-card hover:border-marsala/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-2 rounded-xl bg-secondary text-marsala">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-numeric text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Grid: Reading Goal + Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-marsala/10 text-marsala">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-foreground">Meta {goal.year}</h3>
              </div>
              <span className="text-sm font-bold font-numeric text-marsala">{goalProgress}%</span>
            </div>

            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(goalProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="h-full gradient-marsala rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{goal.current} lidos</span>
              <span>Alvo: {goal.target} livros</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 mt-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {goal.target - goal.current > 0
                ? `Faltam ${goal.target - goal.current} livro(s) para atingir sua meta deste ano. Continue no ritmo!`
                : "🎉 Parabéns! Você concluiu sua meta de leitura para este ano!"}
            </p>
          </div>
        </motion.div>

        {/* Monthly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base">Leituras por Mês</h3>
            <span className="text-xs text-muted-foreground">Ano de {goal.year}</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyStats} barSize={24}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--secondary) / 0.4)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                  boxShadow: "var(--shadow-card)",
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value: number) => [`${value} livro(s)`, "Lidos"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {monthlyStats.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.count > 0 ? "hsl(var(--marsala))" : "hsl(var(--secondary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsPanel;
