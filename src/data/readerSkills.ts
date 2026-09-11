import { Book } from "@/data/mockBooks";

export type SkillCategory = "habito" | "exploracao" | "journal" | "acervo";

export interface SkillBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: SkillCategory;
  icon: string;
  tier: "bronze" | "prata" | "ouro" | "diamante";
  currentProgress: number;
  maxProgress: number;
  unit: string;
  unlocked: boolean;
  unlockedLevel: string;
  flavorQuote: string;
}

export interface ReaderLevel {
  level: number;
  title: string;
  nextLevelTitle: string;
  currentPoints: number;
  nextLevelPoints: number;
  progressPercent: number;
  badgeCount: number;
  totalBadges: number;
}

/**
 * Calcula as skills e insígnias dinamicamente a partir dos livros do usuário
 */
export const calculateReaderSkills = (books: Book[], goalTarget = 12): {
  level: ReaderLevel;
  skills: SkillBadge[];
} => {
  const booksRead = books.filter(b => b.status === "lido");
  const booksReading = books.filter(b => b.status === "lendo");
  const ownedBooks = books.filter(b => b.ownership === "tenho");

  // Páginas acumuladas
  const pagesRead = books.reduce((sum, b) => {
    if (b.status === "lido") return sum + (b.totalPages || 0);
    if (b.status === "lendo") return sum + (b.currentPage || 0);
    return sum;
  }, 0);

  // Anotações e citações
  const totalNotes = books.reduce((sum, b) => sum + (b.notes?.length || 0), 0);
  const totalQuotes = books.reduce((sum, b) => sum + (b.quotes?.length || 0), 0);
  const totalReviews = books.filter(b => Boolean(b.review && b.review.trim().length > 15)).length;

  // Gêneros distintos explorados
  const distinctCategories = new Set(
    books.filter(b => b.status === "lido" && b.category).map(b => b.category!.trim().toLowerCase())
  ).size;

  // Avaliações de 5 estrelas
  const fiveStarBooks = books.filter(b => b.status === "lido" && b.rating === 5).length;

  const rawSkills: SkillBadge[] = [
    {
      id: "devoradora-paginas",
      title: "Devoradora de Páginas",
      subtitle: "Constância de Leitura",
      description: "Acumule páginas lidas através dos seus livros físicos e digitais.",
      category: "habito",
      icon: "Flame",
      tier: pagesRead >= 5000 ? "diamante" : pagesRead >= 2500 ? "ouro" : pagesRead >= 1000 ? "prata" : "bronze",
      currentProgress: pagesRead,
      maxProgress: pagesRead >= 5000 ? 10000 : pagesRead >= 2500 ? 5000 : pagesRead >= 1000 ? 2500 : 1000,
      unit: "páginas",
      unlocked: pagesRead >= 500,
      unlockedLevel: pagesRead >= 5000 ? "Épica" : pagesRead >= 2500 ? "Voraz" : pagesRead >= 1000 ? "Dedicada" : "Iniciada",
      flavorQuote: "“Quem lê viaja sem sair do lugar e vive mil vidas antes de partir.”",
    },
    {
      id: "polimata-literaria",
      title: "Polímata Literária",
      subtitle: "Variedade de Gêneros",
      description: "Explore universos plurais transitando por diferentes classificações.",
      category: "exploracao",
      icon: "Compass",
      tier: distinctCategories >= 6 ? "diamante" : distinctCategories >= 4 ? "ouro" : distinctCategories >= 2 ? "prata" : "bronze",
      currentProgress: distinctCategories,
      maxProgress: 6,
      unit: "gêneros",
      unlocked: distinctCategories >= 2,
      unlockedLevel: distinctCategories >= 6 ? "Universal" : distinctCategories >= 4 ? "Ecletismo" : distinctCategories >= 2 ? "Curiosa" : "Iniciante",
      flavorQuote: "“A mente aberta a novos mundos nunca mais retorna ao tamanho original.”",
    },
    {
      id: "guardia-das-palavras",
      title: "Guardiã das Palavras",
      subtitle: "Coleção de Citações",
      description: "Guarde trechos sublimes e passagens marcantes que tocaram seu coração.",
      category: "journal",
      icon: "Quote",
      tier: totalQuotes >= 10 ? "ouro" : totalQuotes >= 5 ? "prata" : "bronze",
      currentProgress: totalQuotes,
      maxProgress: 10,
      unit: "citações",
      unlocked: totalQuotes >= 1,
      unlockedLevel: totalQuotes >= 10 ? "Antologia" : totalQuotes >= 5 ? "Sensível" : "Observadora",
      flavorQuote: "“Citações são pequenos fragmentos de eternidade capturados em papel.”",
    },
    {
      id: "cronista-de-capitulos",
      title: "Cronista de Capítulos",
      subtitle: "Anotações no Journal",
      description: "Mantenha o hábito de registrar suas reações e emoções durante a leitura.",
      category: "journal",
      icon: "Feather",
      tier: totalNotes >= 15 ? "diamante" : totalNotes >= 8 ? "ouro" : totalNotes >= 3 ? "prata" : "bronze",
      currentProgress: totalNotes,
      maxProgress: 15,
      unit: "anotações",
      unlocked: totalNotes >= 1,
      unlockedLevel: totalNotes >= 15 ? "Memoirista" : totalNotes >= 8 ? "Reflexiva" : "Atenta",
      flavorQuote: "“Ler com caneta na mão é dialogar intimamente com o autor.”",
    },
    {
      id: "critica-apurada",
      title: "Crítica Apurada",
      subtitle: "Resenhas Elaboradas",
      description: "Escreva análises completas avaliando narrativa, personagens e ritmo.",
      category: "journal",
      icon: "Award",
      tier: totalReviews >= 6 ? "ouro" : totalReviews >= 3 ? "prata" : "bronze",
      currentProgress: totalReviews,
      maxProgress: 6,
      unit: "resenhas",
      unlocked: totalReviews >= 1,
      unlockedLevel: totalReviews >= 6 ? "Criteriosa" : totalReviews >= 3 ? "Eloquente" : "Estreante",
      flavorQuote: "“Uma boa resenha é o mapa do tesouro para o próximo leitor.”",
    },
    {
      id: "curadora-do-acervo",
      title: "Curadora da Estante",
      subtitle: "Acervo Próprio",
      description: "Cultive sua biblioteca física e digital com títulos cuidadosamente catalogados.",
      category: "acervo",
      icon: "Library",
      tier: ownedBooks.length >= 25 ? "diamante" : ownedBooks.length >= 15 ? "ouro" : ownedBooks.length >= 5 ? "prata" : "bronze",
      currentProgress: ownedBooks.length,
      maxProgress: 25,
      unit: "livros",
      unlocked: ownedBooks.length >= 3,
      unlockedLevel: ownedBooks.length >= 25 ? "Bibliotecária" : ownedBooks.length >= 15 ? "Colecionadora" : "Curadora",
      flavorQuote: "“Uma casa cheia de livros é um jardim de mentes nobres.”",
    },
    {
      id: "olhos-de-estrelas",
      title: "Olhos de Ouro",
      subtitle: "Favoritos da Vida",
      description: "Descubra livros perfeitos que receberam nota máxima e marcaram sua história.",
      category: "acervo",
      icon: "Sparkles",
      tier: fiveStarBooks >= 5 ? "ouro" : fiveStarBooks >= 2 ? "prata" : "bronze",
      currentProgress: fiveStarBooks,
      maxProgress: 5,
      unit: "obras-primas",
      unlocked: fiveStarBooks >= 1,
      unlockedLevel: fiveStarBooks >= 5 ? "Sublime" : fiveStarBooks >= 2 ? "Entusiasta" : "Iniciada",
      flavorQuote: "“Existem livros que você lê; outros que se tornam parte de você.”",
    },
    {
      id: "ritmo-infalivel",
      title: "Foco no Horizonte",
      subtitle: "Meta de Leitura",
      description: "Aproxime-se da conclusão da sua meta anual de obras lidas.",
      category: "habito",
      icon: "Target",
      tier: booksRead.length >= goalTarget ? "diamante" : booksRead.length >= Math.ceil(goalTarget / 2) ? "ouro" : "prata",
      currentProgress: booksRead.length,
      maxProgress: goalTarget,
      unit: "livros",
      unlocked: booksRead.length >= 1,
      unlockedLevel: booksRead.length >= goalTarget ? "Campeã" : booksRead.length >= Math.ceil(goalTarget / 2) ? "Determinada" : "Focada",
      flavorQuote: "“Página por página, dia após dia, a grande meta se constrói.”",
    },
  ];

  // Cálculo de pontuação e nível geral de maestria
  const unlockedCount = rawSkills.filter(s => s.unlocked).length;
  const points = (pagesRead * 0.5) + (booksRead.length * 100) + (totalNotes * 30) + (totalQuotes * 20) + (totalReviews * 50);

  const levels = [
    { min: 0, title: "Leitora Iniciante", next: "Leitora Dedicada", nextMin: 400 },
    { min: 400, title: "Leitora Dedicada", next: "Exploradora de Estantes", nextMin: 900 },
    { min: 900, title: "Exploradora de Estantes", next: "Leitora Voraz", nextMin: 1800 },
    { min: 1800, title: "Leitora Voraz", next: "Bibliófila Apaixonada", nextMin: 3200 },
    { min: 3200, title: "Bibliófila Apaixonada", next: "Guardiã Literária Mestre", nextMin: 5000 },
    { min: 5000, title: "Guardiã Literária Mestre", next: "Lenda dos Livros", nextMin: 10000 },
  ];

  const currentLevelIndex = levels.reduce((acc, lvl, idx) => (points >= lvl.min ? idx : acc), 0);
  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[Math.min(currentLevelIndex + 1, levels.length - 1)];

  const levelProgress = Math.min(
    Math.round(((points - currentLevel.min) / Math.max(1, currentLevel.nextMin - currentLevel.min)) * 100),
    100
  );

  return {
    level: {
      level: currentLevelIndex + 1,
      title: currentLevel.title,
      nextLevelTitle: currentLevel.next,
      currentPoints: Math.round(points),
      nextLevelPoints: currentLevel.nextMin,
      progressPercent: levelProgress,
      badgeCount: unlockedCount,
      totalBadges: rawSkills.length,
    },
    skills: rawSkills,
  };
};
