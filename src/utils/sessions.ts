export interface ReadingSession {
  id: string;
  bookId: string;
  userId?: string;
  pagesRead: number;
  startPage?: number | null;
  endPage?: number | null;
  durationMinutes?: number | null;
  sessionDate: string; // Formato YYYY-MM-DD
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Retorna a data no fuso horário local do usuário no formato YYYY-MM-DD
 */
export const getLocalDateString = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Soma ou subtrai dias de uma string YYYY-MM-DD
 */
export const offsetDateString = (dateStr: string, daysOffset: number): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + daysOffset);
  return getLocalDateString(date);
};

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  readToday: boolean;
  lastSessionDate: string | null;
}

/**
 * Calcula a ofensiva atual (dias consecutivos lendo) e o recorde histórico
 */
export const calculateStreak = (
  sessions: ReadingSession[],
  referenceDate = new Date()
): StreakResult => {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      readToday: false,
      lastSessionDate: null,
    };
  }

  // Conjunto de datas únicas normalizadas em que houve leitura
  const uniqueDatesSet = new Set<string>();
  sessions.forEach((s) => {
    if (s.pagesRead > 0 && s.sessionDate) {
      const cleanDate = s.sessionDate.slice(0, 10);
      uniqueDatesSet.add(cleanDate);
    }
  });

  if (uniqueDatesSet.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      readToday: false,
      lastSessionDate: null,
    };
  }

  const todayStr = getLocalDateString(referenceDate);
  const yesterdayStr = offsetDateString(todayStr, -1);
  const readToday = uniqueDatesSet.has(todayStr);

  // Ordena as datas em ordem decrescente (mais recente primeiro)
  const sortedDatesDesc = Array.from(uniqueDatesSet).sort().reverse();
  const lastSessionDate = sortedDatesDesc[0];

  // Cálculo da Ofensiva Atual (Current Streak):
  // A ofensiva só permanece viva se o leitor leu hoje ou ontem
  let currentStreak = 0;
  if (uniqueDatesSet.has(todayStr) || uniqueDatesSet.has(yesterdayStr)) {
    // Começa a verificação a partir de hoje (se leu hoje) ou de ontem (se ainda não leu hoje)
    let checkDate = uniqueDatesSet.has(todayStr) ? todayStr : yesterdayStr;

    while (uniqueDatesSet.has(checkDate)) {
      currentStreak++;
      checkDate = offsetDateString(checkDate, -1);
    }
  }

  // Cálculo do Recorde de Ofensiva (Longest Streak):
  const sortedDatesAsc = Array.from(uniqueDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let previousDate: string | null = null;

  for (const dateStr of sortedDatesAsc) {
    if (!previousDate) {
      tempStreak = 1;
    } else {
      const expectedNext = offsetDateString(previousDate, 1);
      if (dateStr === expectedNext) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    previousDate = dateStr;
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
    readToday,
    lastSessionDate,
  };
};

export interface ReadingPaceResult {
  avgPagesPerDay: number;
  avgPagesPerHour: number;
  totalMinutesRead: number;
  totalPagesInPeriod: number;
  activeDaysCount: number;
  estimatedDaysToFinish: number | null;
}

/**
 * Calcula o ritmo de leitura (média de páginas/dia, páginas/hora e previsão de término)
 */
export const calculateReadingPace = (
  sessions: ReadingSession[],
  activeBookRemainingPages?: number,
  periodDays = 30
): ReadingPaceResult => {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      avgPagesPerDay: 0,
      avgPagesPerHour: 0,
      totalMinutesRead: 0,
      totalPagesInPeriod: 0,
      activeDaysCount: 0,
      estimatedDaysToFinish: null,
    };
  }

  const todayStr = getLocalDateString();
  const cutoffDateStr = offsetDateString(todayStr, -periodDays);

  // Filtra sessões dentro do período de análise
  const recentSessions = sessions.filter((s) => s.sessionDate >= cutoffDateStr && s.pagesRead > 0);

  const activeDates = new Set<string>();
  let totalPagesInPeriod = 0;
  let totalMinutesRead = 0;
  let timedPages = 0;
  let timedMinutes = 0;

  recentSessions.forEach((s) => {
    activeDates.add(s.sessionDate.slice(0, 10));
    totalPagesInPeriod += s.pagesRead;
    if (s.durationMinutes && s.durationMinutes > 0) {
      totalMinutesRead += s.durationMinutes;
      timedPages += s.pagesRead;
      timedMinutes += s.durationMinutes;
    }
  });

  const activeDaysCount = activeDates.size;
  // Média de páginas por dia ativo (ou 0 se nenhum)
  const avgPagesPerDay = activeDaysCount > 0 ? Math.round(totalPagesInPeriod / activeDaysCount) : 0;

  // Média de páginas por hora para sessões cronometradas
  const avgPagesPerHour =
    timedMinutes > 0 ? Math.round((timedPages / timedMinutes) * 60) : 0;

  // Estimativa de dias para concluir o livro em leitura ativa
  let estimatedDaysToFinish: number | null = null;
  if (
    typeof activeBookRemainingPages === "number" &&
    activeBookRemainingPages > 0 &&
    avgPagesPerDay > 0
  ) {
    estimatedDaysToFinish = Math.ceil(activeBookRemainingPages / avgPagesPerDay);
  }

  return {
    avgPagesPerDay,
    avgPagesPerHour,
    totalMinutesRead,
    totalPagesInPeriod,
    activeDaysCount,
    estimatedDaysToFinish,
  };
};

export interface DailyActivityPoint {
  date: string;
  dayLabel: string;
  dayOfWeek: string;
  pages: number;
  durationMinutes: number;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Agrupa o histórico dos últimos N dias para renderização de gráficos de constância
 */
export const calculateDailyHistory = (
  sessions: ReadingSession[],
  daysCount = 30
): DailyActivityPoint[] => {
  const result: DailyActivityPoint[] = [];
  const todayStr = getLocalDateString();

  // Mapeia totais por data
  const dateTotalsMap = new Map<string, { pages: number; duration: number }>();
  (sessions || []).forEach((s) => {
    if (!s.sessionDate) return;
    const d = s.sessionDate.slice(0, 10);
    const existing = dateTotalsMap.get(d) || { pages: 0, duration: 0 };
    dateTotalsMap.set(d, {
      pages: existing.pages + (s.pagesRead || 0),
      duration: existing.duration + (s.durationMinutes || 0),
    });
  });

  for (let i = daysCount - 1; i >= 0; i--) {
    const curDateStr = offsetDateString(todayStr, -i);
    const [y, m, d] = curDateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);

    const dayLabel = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
    const dayOfWeek = WEEKDAYS[dateObj.getDay()];
    const totals = dateTotalsMap.get(curDateStr) || { pages: 0, duration: 0 };

    result.push({
      date: curDateStr,
      dayLabel,
      dayOfWeek,
      pages: totals.pages,
      durationMinutes: totals.duration,
    });
  }

  return result;
};
