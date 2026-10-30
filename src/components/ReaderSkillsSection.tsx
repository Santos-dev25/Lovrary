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
    badgeBg: "bg-amber-900/10 dark:bg-amber-950/25",
    badgeBorder: "border-amber-700/30",
    badgeGlow: "hover:border-amber-700/60",
    accentText: "text-amber-800 dark:text-amber-400 font-semibold",
    chipLabel: "Bronze",
  },
  prata: {
    badgeBg: "bg-slate-500/10 dark:bg-slate-400/10",
    badgeBorder: "border-slate-400/40",
    badgeGlow: "hover:border-slate-300/70",
    accentText: "text-slate-700 dark:text-slate-300 font-semibold",
    chipLabel: "Prata",
  },
  ouro: {
    badgeBg: "bg-gold/15 dark:bg-gold/20",
    badgeBorder: "border-gold/50",
    badgeGlow: "hover:border-gold hover:shadow-[0_0_20px_rgba(212,163,68,0.25)]",
    accentText: "text-gold font-bold",
    chipLabel: "Ouro Nobre",
  },
  diamante: {
    badgeBg: "bg-primary/10 dark:bg-primary/20",
    badgeBorder: "border-primary/40",
    badgeGlow: "hover:border-primary hover:shadow-[0_0_24px_rgba(107,35,45,0.25)]",
    accentText: "text-primary font-bold",
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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Level Header Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-card border border-border p-5 sm:p-7 shadow-card space-y-4"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Medallion */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-card flex flex-col items-center justify-center text-center p-1 border border-border">
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
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Maestria & Habilidades Literárias
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  {level.badgeCount}/{level.totalBadges} Conquistas
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
                {level.title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl font-sans">
                Suas leituras, anotações de capítulo e citações desbloqueiam títulos honorários e desenvolvem seu perfil literário.
              </p>
            </div>
          </div>

          {/* XP / Progress Tracker */}
          <div className="w-full md:w-64 bg-secondary/40 border border-border rounded-2xl p-4 shadow-2xs">
            <div className="flex justify-between items-center text-xs mb-1.5 font-numeric">
              <span className="font-medium text-muted-foreground">Próxima Maestria:</span>
              <span className="font-bold text-foreground">{level.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground font-numeric">
              <span>{level.currentPoints.toLocaleString("pt-BR")} XP</span>
              <span className="font-semibold text-primary truncate max-w-[120px]" title={level.nextLevelTitle}>
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
                ? "bg-primary text-primary-foreground shadow-xs"
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
                  ? "bg-primary text-primary-foreground shadow-xs"
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
              transition={{ delay: idx * 0.04 }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalhes da insígnia ${badge.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedBadge(badge);
                }
              }}
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
                <h3 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  {badge.title}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                  {badge.subtitle}
                </p>

                {!compact && (
                  <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {badge.description}
                  </p>
                )}
              </div>

              {/* Progress & Tier Footer */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="flex justify-between items-center text-[11px] mb-1.5 font-numeric">
                  <span className="text-muted-foreground">
                    {badge.currentProgress.toLocaleString("pt-BR")} / {badge.maxProgress.toLocaleString("pt-BR")} {badge.unit}
                  </span>
                  <span className={`font-semibold ${badge.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Details Dialog */}
      <AnimatePresence>
        {selectedBadge && (
          <div
            className="fixed inset-0 z-[120] bg-foreground/45 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-scale-in relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fechar detalhes da insígnia"
              >
                <X className="w-4 h-4" />
              </button>

              {(() => {
                const Icon = iconMap[selectedBadge.icon] || Award;
                const tier = tierStyles[selectedBadge.tier];
                const pct = Math.min(Math.round((selectedBadge.currentProgress / selectedBadge.maxProgress) * 100), 100);

                return (
                  <>
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${tier.badgeBg} border ${tier.badgeBorder} shadow-sm`}>
                      <Icon className={`w-8 h-8 ${selectedBadge.unlocked ? tier.accentText : "text-muted-foreground"}`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tier.badgeBg} ${tier.accentText} ${tier.badgeBorder}`}>
                          Tier {tier.chipLabel}
                        </span>
                        {selectedBadge.unlocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Conquistada
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-lg text-foreground mt-2">
                        {selectedBadge.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        {selectedBadge.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed font-sans px-2">
                      {selectedBadge.description}
                    </p>

                    <div className="bg-secondary/40 border border-border rounded-xl p-3.5 space-y-2 text-left">
                      <div className="flex justify-between items-center text-xs font-numeric">
                        <span className="text-muted-foreground">Progresso do desafio:</span>
                        <span className="font-bold text-foreground">
                          {selectedBadge.currentProgress.toLocaleString("pt-BR")} / {selectedBadge.maxProgress.toLocaleString("pt-BR")} {selectedBadge.unit}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            selectedBadge.unlocked ? "bg-primary" : "bg-muted-foreground/40"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBadge(null)}
                      className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs transition-colors"
                    >
                      Fechar
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReaderSkillsSection;
