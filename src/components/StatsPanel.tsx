import { useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { calculateTotalPagesRead } from "@/utils/stats";
import { calculateDailyHistory } from "@/utils/sessions";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BookOpen, TrendingUp, Award, Target, FileText, Flame, Zap, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const StatsPanel = () => {
  const { books, readingGoal: goal, streak, readingPace, readingSessions } = useBooks();

  const dailyHistory = useMemo(() => calculateDailyHistory(readingSessions, 30), [readingSessions]);

  const { booksReadInYear, totalBooksRead, booksReading, goalProgress, pagesRead, monthlyStats, bestMonth, statCards, tabCounts } = useMemo(() => {
    // 1. Livros lidos no ano da meta (sincronizado 100% com Registros de Leitura)
    const readInYear = books.filter((b) => {
      if (b.status !== "lido") return false;
      if (b.dateFinished) {
        const d = new Date(b.dateFinished);
        return !isNaN(d.getTime()) && d.getFullYear() === goal.year;
      }
      return true;
    }).length;

    // Total de livros lidos histórico
    const totalRead = books.filter((b) => b.status === "lido").length;
    const booksReadingCount = books.filter((b) => b.status === "lendo").length;

    // Porcentagem da Meta Anual: (Livros lidos no ano / Meta definida) * 100
    const progress = goal.target > 0 ? Math.round((readInYear / goal.target) * 100) : 0;

    // Total de Páginas Lidas da Dashboard:
    // - status 'lido': totalPages do livro
    // - status 'lendo': currentPage onde o leitor parou
    // - status 'tenho' / 'pretendo': 0
    const totalPages = calculateTotalPagesRead(books);

    // Leituras por Mês no ano da meta
    const mStats = MONTH_NAMES.map((month, i) => {
      const count = books.filter((b) => {
        if (b.status !== "lido" || !b.dateFinished) return false;
        const d = new Date(b.dateFinished);
        return !isNaN(d.getTime()) && d.getFullYear() === goal.year && d.getMonth() === i;
      }).length;
      return { month, count };
    });

    const bMonth = mStats.reduce(
      (a, b) => (a.count > b.count ? a : b),
      { month: "—", count: 0 }
    );

    const cards = [
      {
        icon: BookOpen,
        label: "Livros Lidos",
        value: readInYear,
        sub: totalRead !== readInYear ? `em ${goal.year} (${totalRead} no total)` : `em ${goal.year}`,
      },
      {
        icon: FileText,
        label: "Páginas Lidas",
        value: totalPages.toLocaleString("pt-BR"),
        sub: "lidos + em andamento",
      },
      {
        icon: TrendingUp,
        label: "Lendo Agora",
        value: booksReadingCount,
        sub: "em andamento",
      },
      {
        icon: Award,
        label: "Mês Destaque",
        value: bMonth.month,
        sub: bMonth.count > 0 ? `${bMonth.count} livro(s) em ${goal.year}` : `sem leituras em ${goal.year}`,
      },
    ];

    const tabs = {
      tenho: books.filter((b) => b.ownership === "tenho" && b.status !== "emprestado").length,
      pretendo: books.filter((b) => b.ownership === "pretendo").length,
      lendo: books.filter((b) => b.status === "lendo").length,
      lido: totalRead,
      emprestado: books.filter((b) => b.status === "emprestado").length,
      abandonado: books.filter((b) => b.status === "abandonado").length,
    };

    return {
      booksReadInYear: readInYear,
      totalBooksRead: totalRead,
      booksReading: booksReadingCount,
      goalProgress: progress,
      pagesRead: totalPages,
      monthlyStats: mStats,
      bestMonth: bMonth,
      statCards: cards,
      tabCounts: tabs,
    };
  }, [books, goal]);

  return (
    <div className="space-y-6">
      {/* Contagem exata por abas ('tenho', 'pretendo', 'lendo', 'lido', 'emprestado') */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 rounded-2xl bg-secondary/30 border border-border">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <span className="text-xs text-muted-foreground font-medium">Acervo</span>
          <span className="font-numeric text-xs font-bold text-foreground">{tabCounts.tenho}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <span className="text-xs text-muted-foreground font-medium">Pretendo</span>
          <span className="font-numeric text-xs font-bold text-foreground">{tabCounts.pretendo}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <span className="text-xs text-muted-foreground font-medium">Lendo</span>
          <span className="font-numeric text-xs font-bold text-marsala">{tabCounts.lendo}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <span className="text-xs text-muted-foreground font-medium">Lidos</span>
          <span className="font-numeric text-xs font-bold text-foreground">{tabCounts.lido}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border/60 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Com Você</span>
          <span className="font-numeric text-xs font-bold text-indigo-600 dark:text-indigo-400">{tabCounts.emprestado}</span>
        </div>
      </div>

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

      {/* Bloco de Hábitos Literários: Ofensiva (Streak) & Ritmo de Leitura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card da Ofensiva (Streak) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="relative overflow-hidden bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-gold/15 text-gold shadow-2xs">
                  <Flame className="w-5 h-5 fill-gold/30" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm sm:text-base">Ofensiva de Leitura</h3>
                  <p className="text-[11px] text-muted-foreground">Constância diária de páginas lidas</p>
                </div>
              </div>
              {streak.readToday ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> Lido hoje
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Pendente hoje
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-numeric font-bold text-foreground tracking-tight">
                {streak.currentStreak}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {streak.currentStreak === 1 ? "dia seguido" : "dias seguidos"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {streak.longestStreak > 0
                ? `Seu recorde histórico é de ${streak.longestStreak} ${streak.longestStreak === 1 ? "dia consecutivo" : "dias consecutivos"}.`
                : "Registre seu progresso diariamente para acender e manter sua chama de leitura."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Última sessão registrada:</span>
            <span className="font-medium text-foreground">
              {streak.lastSessionDate
                ? streak.lastSessionDate.split("-").reverse().join("/")
                : "Nenhuma ainda"}
            </span>
          </div>
        </motion.div>

        {/* Card do Ritmo de Leitura (Pace) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="relative overflow-hidden bg-card rounded-2xl border border-border p-5 shadow-card flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-marsala/10 blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-marsala/15 text-marsala shadow-2xs">
                  <Zap className="w-5 h-5 fill-marsala/20" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm sm:text-base">Ritmo Médio</h3>
                  <p className="text-[11px] text-muted-foreground">Velocidade e cadência de leitura</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Últimos 30 dias
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-numeric font-bold text-foreground tracking-tight">
                {readingPace.avgPagesPerDay}
              </span>
              <span className="text-sm text-muted-foreground font-medium">págs / dia ativo</span>
            </div>

            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {readingPace.totalPagesInPeriod > 0
                ? `${readingPace.totalPagesInPeriod} páginas lidas distribuídas em ${readingPace.activeDaysCount} ${readingPace.activeDaysCount === 1 ? "dia ativo" : "dias ativos"}.`
                : "Conforme você avança nas leituras, calculamos sua velocidade média de páginas diárias."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Previsão término (livro ativo):</span>
            <span className="font-medium text-foreground">
              {readingPace.estimatedDaysToFinish !== null
                ? `~${readingPace.estimatedDaysToFinish} ${readingPace.estimatedDaysToFinish === 1 ? "dia" : "dias"}`
                : "Sem livro ativo"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Gráfico de Constância Diária: Últimos 30 Dias */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="bg-card rounded-2xl border border-border p-5 shadow-card space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-secondary text-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-sm sm:text-base">Constância nos Últimos 30 Dias</h3>
              <p className="text-[11px] text-muted-foreground">Volume de páginas lidas por dia</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-marsala" />
            <span>{readingPace.totalPagesInPeriod} páginas no período</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={dailyHistory} barSize={10} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.4)" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              axisLine={false}
              tickLine={false}
              width={30}
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
              labelStyle={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
              itemStyle={{ color: "hsl(var(--marsala))" }}
              formatter={(value: number) => [`${value} página(s)`, "Lidas"]}
              labelFormatter={(_label, payload) => {
                if (payload && payload.length > 0 && payload[0].payload) {
                  const pt = payload[0].payload;
                  return `${pt.dayOfWeek}, ${pt.dayLabel} (${pt.date})`;
                }
                return _label;
              }}
            />
            <Bar dataKey="pages" radius={[4, 4, 0, 0]}>
              {dailyHistory.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.pages > 0 ? "hsl(var(--marsala))" : "hsl(var(--secondary) / 0.4)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Grid: Reading Goal + Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
              <span>{booksReadInYear} lidos em {goal.year}</span>
              <span>Alvo: {goal.target} livros</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 mt-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {goal.target - booksReadInYear > 0
                ? `Faltam ${goal.target - booksReadInYear} livro(s) para atingir sua meta de ${goal.year}. Continue no ritmo!`
                : `🎉 Parabéns! Você concluiu sua meta de leitura para ${goal.year}!`}
            </p>
          </div>
        </motion.div>

        {/* Monthly Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-foreground text-sm sm:text-base">Leituras por Mês</h3>
            <span className="text-xs text-muted-foreground">Ano de {goal.year}</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyStats} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
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
                labelStyle={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--marsala))" }}
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
