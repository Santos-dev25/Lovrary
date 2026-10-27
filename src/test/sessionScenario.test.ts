import { describe, it, expect } from "vitest";
import {
  calculateStreak,
  calculateReadingPace,
  calculateDailyHistory,
  getLocalDateString,
  offsetDateString,
  type ReadingSession,
} from "../utils/sessions";

describe("Cenário de Validação Prática: A Jornada de Leitura de Helena no Lovrary", () => {
  // Simulando datas consecutivas relativas a hoje
  const hoje = getLocalDateString();
  const ontem = offsetDateString(hoje, -1);
  const anteontem = offsetDateString(hoje, -2);
  const tresDiasAtras = offsetDateString(hoje, -3);

  // Livro que Helena está lendo: "Memórias Póstumas de Brás Cubas" (160 páginas)
  const totalPagesBook = 160;

  it("Passo 1: Helena lê 25 páginas há 3 dias atrás -> Inicia a ofensiva de 1 dia", () => {
    const sessoes: ReadingSession[] = [
      {
        id: "sess-1",
        bookId: "livro-bras-cubas",
        pagesRead: 25,
        startPage: 0,
        endPage: 25,
        durationMinutes: 30,
        sessionDate: tresDiasAtras,
      },
    ];

    // Calculado no dia 3 dias atrás
    const [y, m, d] = tresDiasAtras.split("-").map(Number);
    const refDate = new Date(y, m - 1, d);
    const streak = calculateStreak(sessoes, refDate);

    expect(streak.currentStreak).toBe(1);
    expect(streak.readToday).toBe(true);
    expect(streak.longestStreak).toBe(1);
  });

  it("Passo 2: Helena mantém a leitura diária em anteontem e ontem -> Ofensiva de 3 dias", () => {
    const sessoes: ReadingSession[] = [
      { id: "sess-1", bookId: "livro-bras-cubas", pagesRead: 25, startPage: 0, endPage: 25, sessionDate: tresDiasAtras },
      { id: "sess-2", bookId: "livro-bras-cubas", pagesRead: 30, startPage: 25, endPage: 55, sessionDate: anteontem },
      { id: "sess-3", bookId: "livro-bras-cubas", pagesRead: 25, startPage: 55, endPage: 80, sessionDate: ontem },
    ];

    // Verificação ontem à noite
    const [y, m, d] = ontem.split("-").map(Number);
    const refOntem = new Date(y, m - 1, d);
    const streak = calculateStreak(sessoes, refOntem);

    expect(streak.currentStreak).toBe(3);
    expect(streak.longestStreak).toBe(3);
    expect(streak.readToday).toBe(true);

    // Ritmo de leitura acumulado: 80 páginas em 3 dias ativos
    // Páginas restantes: 160 - 80 = 80 páginas
    const ritmo = calculateReadingPace(sessoes, totalPagesBook - 80);
    expect(ritmo.totalPagesInPeriod).toBe(80);
    expect(ritmo.activeDaysCount).toBe(3);
    expect(ritmo.avgPagesPerDay).toBe(27); // 80 / 3 = 26.66 ~ 27 páginas/dia
    expect(ritmo.estimatedDaysToFinish).toBe(3); // 80 / 27 = 2.96 => 3 dias para terminar
  });

  it("Passo 3: Helena abre o app hoje de manhã (ainda não leu hoje) -> Ofensiva permanece viva!", () => {
    const sessoes: ReadingSession[] = [
      { id: "sess-1", bookId: "livro-bras-cubas", pagesRead: 25, sessionDate: tresDiasAtras },
      { id: "sess-2", bookId: "livro-bras-cubas", pagesRead: 30, sessionDate: anteontem },
      { id: "sess-3", bookId: "livro-bras-cubas", pagesRead: 25, sessionDate: ontem },
    ];

    // Verificação HOJE sem nenhuma sessão criada hoje
    const streakHoje = calculateStreak(sessoes, new Date());

    // Regra da tolerância de 24h: Como leu ontem, a ofensiva de 3 dias continua válida!
    expect(streakHoje.currentStreak).toBe(3);
    expect(streakHoje.readToday).toBe(false); // Sinaliza "Pendente hoje" na dashboard
    expect(streakHoje.lastSessionDate).toBe(ontem);
  });

  it("Passo 4: Helena lê 20 páginas hoje à tarde -> Ofensiva salta para 4 dias e marca 'Lido hoje'", () => {
    const sessoes: ReadingSession[] = [
      { id: "sess-1", bookId: "livro-bras-cubas", pagesRead: 25, sessionDate: tresDiasAtras },
      { id: "sess-2", bookId: "livro-bras-cubas", pagesRead: 30, sessionDate: anteontem },
      { id: "sess-3", bookId: "livro-bras-cubas", pagesRead: 25, sessionDate: ontem },
      // Nova sessão registrada hoje via updateProgress(bookId, 100)
      { id: "sess-4", bookId: "livro-bras-cubas", pagesRead: 20, startPage: 80, endPage: 100, sessionDate: hoje },
    ];

    const streakHoje = calculateStreak(sessoes, new Date());

    expect(streakHoje.currentStreak).toBe(4); // Salta para 4 dias consecutivos!
    expect(streakHoje.longestStreak).toBe(4);
    expect(streakHoje.readToday).toBe(true);  // Muda o badge para "Lido hoje ✨"

    // O gráfico dos últimos 30 dias reflete hoje com 20 páginas
    const graficoHistorico = calculateDailyHistory(sessoes, 30);
    const pontoHoje = graficoHistorico[graficoHistorico.length - 1];
    expect(pontoHoje.date).toBe(hoje);
    expect(pontoHoje.pages).toBe(20);

    // O ponto de ontem tem 25 páginas
    const pontoOntem = graficoHistorico[graficoHistorico.length - 2];
    expect(pontoOntem.date).toBe(ontem);
    expect(pontoOntem.pages).toBe(25);
  });

  it("Passo 5: Caso ocorra uma quebra (gap de 2 dias sem ler) -> Ofensiva zera mas recorde é mantido", () => {
    // Helena leu há 4 dias, há 3 dias e anteontem (3 dias seguidos). Mas não leu ontem nem hoje.
    const quatroDiasAtras = offsetDateString(hoje, -4);
    const sessoesQuebradas: ReadingSession[] = [
      { id: "s1", bookId: "livro-bras-cubas", pagesRead: 20, sessionDate: quatroDiasAtras },
      { id: "s2", bookId: "livro-bras-cubas", pagesRead: 25, sessionDate: tresDiasAtras },
      { id: "s3", bookId: "livro-bras-cubas", pagesRead: 30, sessionDate: anteontem },
      // Ontem: Não leu
      // Hoje: Não leu
    ];

    const streakQuebrado = calculateStreak(sessoesQuebradas, new Date());

    expect(streakQuebrado.currentStreak).toBe(0); // Quebrou a sequência atual
    expect(streakQuebrado.longestStreak).toBe(3); // Mas o recorde de 3 dias continua registrado para sempre!
    expect(streakQuebrado.readToday).toBe(false);
  });
});
