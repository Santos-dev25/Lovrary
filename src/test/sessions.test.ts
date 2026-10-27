import { describe, it, expect } from "vitest";
import {
  calculateStreak,
  calculateReadingPace,
  calculateDailyHistory,
  getLocalDateString,
  offsetDateString,
  type ReadingSession,
} from "../utils/sessions";

describe("Reading Sessions & Streaks (Ofensiva e Ritmo de Leitura)", () => {
  describe("Manipulação e formatação de datas", () => {
    it("deve formatar data local no formato YYYY-MM-DD", () => {
      const fixedDate = new Date(2026, 4, 15); // 15 de Maio de 2026
      expect(getLocalDateString(fixedDate)).toBe("2026-05-15");
    });

    it("deve calcular offsets de data corretamente, inclusive cruzando meses", () => {
      expect(offsetDateString("2026-05-01", -1)).toBe("2026-04-30");
      expect(offsetDateString("2026-04-30", 1)).toBe("2026-05-01");
      expect(offsetDateString("2026-01-01", -1)).toBe("2025-12-31");
    });
  });

  describe("Cálculo de Ofensiva (calculateStreak)", () => {
    const refDate = new Date(2026, 4, 10); // 10 de Maio de 2026
    const today = "2026-05-10";
    const yesterday = "2026-05-09";
    const twoDaysAgo = "2026-05-08";
    const threeDaysAgo = "2026-05-07";

    it("deve retornar 0 para lista de sessões vazia", () => {
      const res = calculateStreak([], refDate);
      expect(res.currentStreak).toBe(0);
      expect(res.longestStreak).toBe(0);
      expect(res.readToday).toBe(false);
      expect(res.lastSessionDate).toBeNull();
    });

    it("deve calcular ofensiva ativa quando o usuário leu hoje e ontem", () => {
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 15, sessionDate: today },
        { id: "2", bookId: "b1", pagesRead: 20, sessionDate: yesterday },
        { id: "3", bookId: "b2", pagesRead: 10, sessionDate: twoDaysAgo },
      ];

      const res = calculateStreak(sessions, refDate);
      expect(res.currentStreak).toBe(3);
      expect(res.longestStreak).toBe(3);
      expect(res.readToday).toBe(true);
      expect(res.lastSessionDate).toBe(today);
    });

    it("deve manter a ofensiva viva se o leitor leu ontem, mesmo ainda não tendo lido hoje", () => {
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 25, sessionDate: yesterday },
        { id: "2", bookId: "b1", pagesRead: 30, sessionDate: twoDaysAgo },
      ];

      const res = calculateStreak(sessions, refDate);
      expect(res.currentStreak).toBe(2);
      expect(res.longestStreak).toBe(2);
      expect(res.readToday).toBe(false);
      expect(res.lastSessionDate).toBe(yesterday);
    });

    it("deve zerar a ofensiva atual se houver gap de mais de um dia, mas preservar recorde", () => {
      const sessions: ReadingSession[] = [
        // Leu 3 dias seguidos no passado distante
        { id: "1", bookId: "b1", pagesRead: 20, sessionDate: "2026-04-01" },
        { id: "2", bookId: "b1", pagesRead: 20, sessionDate: "2026-04-02" },
        { id: "3", bookId: "b1", pagesRead: 20, sessionDate: "2026-04-03" },
        // Não leu ontem nem hoje
        { id: "4", bookId: "b1", pagesRead: 15, sessionDate: twoDaysAgo },
      ];

      const res = calculateStreak(sessions, refDate);
      expect(res.currentStreak).toBe(0);
      expect(res.longestStreak).toBe(3);
      expect(res.readToday).toBe(false);
      expect(res.lastSessionDate).toBe(twoDaysAgo);
    });

    it("deve condensar múltiplas sessões no mesmo dia sem inflar a contagem de dias", () => {
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 10, sessionDate: today },
        { id: "2", bookId: "b1", pagesRead: 15, sessionDate: today },
        { id: "3", bookId: "b2", pagesRead: 5, sessionDate: today },
        { id: "4", bookId: "b1", pagesRead: 20, sessionDate: yesterday },
      ];

      const res = calculateStreak(sessions, refDate);
      expect(res.currentStreak).toBe(2);
      expect(res.longestStreak).toBe(2);
      expect(res.readToday).toBe(true);
    });

    it("deve desconsiderar sessões com 0 páginas lidas", () => {
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 0, sessionDate: today },
        { id: "2", bookId: "b1", pagesRead: 15, sessionDate: yesterday },
      ];

      const res = calculateStreak(sessions, refDate);
      expect(res.currentStreak).toBe(1);
      expect(res.readToday).toBe(false);
    });
  });

  describe("Cálculo de Ritmo e Previsão de Término (calculateReadingPace)", () => {
    const today = getLocalDateString();
    const yesterday = offsetDateString(today, -1);

    it("deve calcular média de páginas por dia e velocidade por hora", () => {
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 30, durationMinutes: 60, sessionDate: today },
        { id: "2", bookId: "b1", pagesRead: 50, durationMinutes: 60, sessionDate: yesterday },
      ];

      // 80 páginas em 2 dias ativos = 40 págs/dia
      // 80 páginas em 120 minutos = 40 págs/hora
      const pace = calculateReadingPace(sessions, 120);
      expect(pace.avgPagesPerDay).toBe(40);
      expect(pace.avgPagesPerHour).toBe(40);
      expect(pace.totalPagesInPeriod).toBe(80);
      expect(pace.activeDaysCount).toBe(2);
      // Faltam 120 páginas com média de 40 págs/dia => 3 dias para concluir
      expect(pace.estimatedDaysToFinish).toBe(3);
    });

    it("deve lidar com livro ativo sem páginas restantes ou sem sessões", () => {
      const pace = calculateReadingPace([], 100);
      expect(pace.avgPagesPerDay).toBe(0);
      expect(pace.estimatedDaysToFinish).toBeNull();
    });
  });

  describe("Histórico Diário para Gráficos (calculateDailyHistory)", () => {
    it("deve gerar exatamente N pontos diários preenchidos", () => {
      const today = getLocalDateString();
      const sessions: ReadingSession[] = [
        { id: "1", bookId: "b1", pagesRead: 25, durationMinutes: 30, sessionDate: today },
      ];

      const history = calculateDailyHistory(sessions, 30);
      expect(history.length).toBe(30);

      // O último ponto deve ser hoje com 25 páginas
      const todayPoint = history[history.length - 1];
      expect(todayPoint.date).toBe(today);
      expect(todayPoint.pages).toBe(25);
      expect(todayPoint.durationMinutes).toBe(30);

      // Dias sem leitura devem ter 0 páginas
      const prevPoint = history[history.length - 2];
      expect(prevPoint.pages).toBe(0);
    });
  });
});
