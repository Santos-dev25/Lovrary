import { useState, useMemo } from "react";
import { useBooks } from "@/context/BooksContext";
import { calculateReaderSkills, SkillBadge, SkillCategory } from "@/data/readerSkills";
import {
  Flame, Compass, Quote, Feather, Award, Library, Sparkles, Target,
  Lock, CheckCircle2, ChevronRight, X, Trophy, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  Flame,
  Compass,
  Quote,
  Feather,
  Award,
  Library,
  Sparkles,
  Target,
};

const tierStyles: Record<SkillBadge["tier"], {
  badgeBg: string;
  badgeBorder: string;
  badgeGlow: string;
  accentText: string;
  chipLabel: string;
}> = {
  bronze: {
    badgeBg: "bg-amber-900/10 dark:bg-amber-950/20",
    badgeBorder: "border-amber-700/30",
    badgeGlow: "group-hover:border-amber-700/60",
    accentText: "text-amber-700 dark:text-amber-500",
    chipLabel: "Bronze",
  },
  prata: {
    badgeBg: "bg-slate-500/10 dark:bg-slate-400/10",
    badgeBorder: "border-slate-400/40",
    badgeGlow: "group-hover:border-slate-300/70",
    accentText: "text-slate-600 dark:text-slate-300",
    chipLabel: "Prata",
  },
  ouro: {
    badgeBg: "bg-gold/10 dark:bg-gold/15",
    badgeBorder: "border-gold/50",
    badgeGlow: "group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,163,68,0.25)]",
    accentText: "text-gold font-semibold",
    chipLabel: "Ouro Nobre",
  },
  diamante: {
    badgeBg: "bg-marsala/10 dark:bg-marsala/20",
    badgeBorder: "border-marsala/50",
    badgeGlow: "group-hover:border-marsala group-hover:shadow-[0_0_24px_rgba(114,47,55,0.3)]",
    accentText: "text-marsala font-bold",
    chipLabel: "Diamante Raro",
  },
};

const categoryLabels: Record<SkillCategory, string> = {
  habito: "Hábito & Ritmo",
  exploracao: "Exploração",
  journal: "Journaling & Crítica",
  acervo: "Curadoria & Estante",
};

interface ReaderSkillsSectionProps {
  compact?: boolean;
  onExploreFull?: () => void;
}

export const ReaderSkillsSection = ({ compact = false, onExploreFull }: ReaderSkillsSectionProps) => {
  const { books, readingGoal } = useBooks();
  const [activeCategory, setActiveCategory] = useState<"todas" | SkillCategory>("todas");
  const [selectedBadge, setSelectedBadge] = useState<SkillBadge | null>(null);

  const { level, skills } = useMemo(
    () => calculateReaderSkills(books, readingGoal.target),
    [books, readingGoal.target]
  );

  const filteredSkills = useMemo(() => {
    if (activeCategory === "todas") return skills;
    return skills.filter(s => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Level Header Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-secondary/40 border border-border p-5 sm:p-7 shadow-card"
      >
        {/* Decorative background aura */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-marsala/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Medallion */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-marsala p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-card flex flex-col items-center justify-center text-center p-1 border border-white/15">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-gold drop-shadow-xs" />
                  <span className="text-[10px] font-numeric font-bold tracking-wider text-muted-foreground uppercase mt-0.5">
                    NÍVEL {level.level}
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-amber-950 font-bold text-xs shadow-xs">
                ★
              </span>
            </div>

            {/* Title & Level description */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-marsala">
                  Maestria & Habilidades Literárias
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  {level.badgeCount}/{level.totalBadges} Conquistas
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
                {level.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                Suas leituras, anotações de capítulo e citações desbloqueiam títulos honorários e desenvolvem seu perfil literário.
              </p>
            </div>
          </div>

          {/* XP / Progress Tracker */}
          <div className="w-full md:w-64 bg-background/80 backdrop-blur-xs border border-border/80 rounded-2xl p-4 shadow-xs">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-muted-foreground">Próxima Maestria:</span>
              <span className="font-bold text-foreground">{level.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-marsala rounded-full"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground">
              <span className="font-numeric">{level.currentPoints.toLocaleString()} XP</span>
              <span className="font-semibold text-marsala truncate max-w-[120px]" title={level.nextLevelTitle}>
                {level.nextLevelTitle}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Pills (Visible when not in compact mode) */}
      {!compact && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("todas")}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === "todas"
                ? "gradient-marsala text-primary-foreground shadow-xs"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Todas as Insígnias ({skills.length})
          </button>
          {(Object.keys(categoryLabels) as SkillCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "gradient-marsala text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Badges Grid */}
      <div className={`grid gap-3.5 sm:gap-4 ${
        compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}>
        {(compact ? filteredSkills.slice(0, 4) : filteredSkills).map((badge, idx) => {
          const Icon = iconMap[badge.icon] || Award;
          const tier = tierStyles[badge.tier];
          const pct = Math.min(Math.round((badge.currentProgress / badge.maxProgress) * 100), 100);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative bg-card rounded-2xl border p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                tier.badgeBorder
              } ${tier.badgeGlow} ${!badge.unlocked ? "opacity-75 hover:opacity-100" : ""}`}
            >
              <div>
                {/* Badge Top Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${tier.badgeBg} border ${tier.badgeBorder}`}>
                    <Icon className={`w-5 h-5 ${badge.unlocked ? tier.accentText : "text-muted-foreground"}`} />
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    badge.unlocked
                      ? `${tier.badgeBg} ${tier.accentText} ${tier.badgeBorder}`
                      : "bg-secondary text-muted-foreground border-border"
                  }`}>
                    {badge.unlocked ? badge.unlockedLevel : "A Iniciar"}
                  </span>
                </div>

                {/* Badge Info */}
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-marsala transition-colors">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                  {badge.subtitle}
                </p>

                {!compact && (
                  <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                )}
              </div>

              {/* Progress & Tier Footer */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="flex justify-between items-center text-[11px] mb-1.5 font-numeric">
                  <span className="text-muted-foreground">
                    {badge.currentProgress.toLocaleString()} / {badge.maxProgress.toLocaleString()} {badge.unit}
                  </span>
                  <span className={`font-semibold ${badge.unlocked ? "text-marsala" : "text-muted-foreground"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? "gradient-marsala" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {compact && onExploreFull && (
        <div className="text-center pt-1">
          <button
            onClick={onExploreFull}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-marsala hover:text-marsala-light transition-colors py-1.5 px-3 rounded-xl hover:bg-marsala/5"
          >
            <span>Ver todas as insígnias e níveis de maestria</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Badge Lore & Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 z-[120] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-md p-6 sm:p-7 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 gradient-marsala p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-card flex items-center justify-center">
                    {(() => {
                      const Icon = iconMap[selectedBadge.icon] || Award;
                      return <Icon className="w-8 h-8 text-gold drop-shadow-xs" />;
                    })()}
                  </div>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-wider text-marsala">
                  {categoryLabels[selectedBadge.category]}
                </span>
                <h3 className="font-display font-bold text-2xl text-foreground mt-1">
                  {selectedBadge.title}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Grau {tierStyles[selectedBadge.tier].chipLabel} • {selectedBadge.unlockedLevel}
                </p>

                <div className="my-5 p-4 rounded-2xl bg-secondary/50 border border-border text-left space-y-2">
                  <p className="text-xs text-foreground leading-relaxed">
                    {selectedBadge.description}
                  </p>
                  <p className="text-xs font-serif italic text-marsala border-l-2 border-marsala/40 pl-3 py-0.5">
                    {selectedBadge.flavorQuote}
                  </p>
                </div>

                {/* Progress Details */}
                <div className="space-y-1.5 text-left mb-6">
                  <div className="flex justify-between text-xs font-numeric">
                    <span className="text-muted-foreground font-medium">Progresso acumulado:</span>
                    <span className="font-bold text-foreground">
                      {selectedBadge.currentProgress.toLocaleString()} / {selectedBadge.maxProgress.toLocaleString()} {selectedBadge.unit}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-marsala rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          Math.round((selectedBadge.currentProgress / selectedBadge.maxProgress) * 100),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-2.5 rounded-xl gradient-marsala text-primary-foreground text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
                >
                  Continuar Jornada
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReaderSkillsSection;
