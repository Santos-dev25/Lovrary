import type { Book } from "@/data/mockBooks";

export interface BookPagesLike {
  status?: string | null;
  ownership?: string | null;
  totalPages?: number | string | null;
  total_pages?: number | string | null;
  currentPage?: number | string | null;
  current_page?: number | string | null;
  borrowedFrom?: string | null;
  borrowed_from?: string | null;
}

/**
 * Calcula o total acumulado de páginas lidas para a dashboard:
 * 1. Para livros com status 'lido' (concluídos): somar o total de páginas do livro (`total_pages` ou `totalPages`).
 *    (Inclui livros pegos emprestados que foram lidos por mim).
 * 2. Para livros com status 'lendo' ou 'abandonado': somar a página atual onde o leitor parou (`current_page` ou `currentPage`).
 * 3. Para livros com status 'emprestado': se o leitor já tiver páginas lidas registradas, soma `currentPage`; se 0, soma 0.
 * 4. Para livros com ownership 'pretendo' (lista de desejos): somar 0.
 *
 * @param books Lista de livros da biblioteca
 * @returns Total acumulado de páginas lidas
 */
export const calculateTotalPagesRead = (books: (Book | BookPagesLike)[]): number => {
  if (!Array.isArray(books) || books.length === 0) {
    return 0;
  }

  return books.reduce((sum, book) => {
    if (!book) return sum;

    const status = String(book.status || "").toLowerCase().trim();
    const ownership = String(book.ownership || "").toLowerCase().trim();

    // 4. Lista de desejos (wishlist/pretendo): nunca soma páginas
    if (status === "pretendo" || ownership === "pretendo") {
      return sum;
    }

    // 1. Livros concluídos (status 'lido'): somar total de páginas
    if (status === "lido") {
      const rawTotal = book.totalPages ?? (book as BookPagesLike).total_pages;
      const total = Math.max(0, Math.floor(Number(rawTotal) || 0));
      return sum + total;
    }

    // 2. Livros em andamento ('lendo'), interrompidos ('abandonado') ou pegos emprestados com progresso:
    if (status === "lendo" || status === "abandonado" || status === "emprestado") {
      const rawCurrent = book.currentPage ?? (book as BookPagesLike).current_page;
      const current = Math.max(0, Math.floor(Number(rawCurrent) || 0));
      return sum + current;
    }

    // Para outros status (ex: 'nao-lido' sem páginas lidas): somar 0
    return sum;
  }, 0);
};

/**
 * Helper para calcular status e prazo de devolução de livros emprestados:
 * @param returnDate Data de retorno (ISO string ou YYYY-MM-DD)
 */
export interface ReturnDeadlineInfo {
  daysRemaining: number;
  isOverdue: boolean;
  isDueSoon: boolean;
  formattedDate: string;
}

export const getReturnDeadline = (returnDate?: string | null): ReturnDeadlineInfo | null => {
  if (!returnDate) return null;

  const target = new Date(returnDate);
  if (isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    daysRemaining,
    isOverdue: daysRemaining < 0,
    isDueSoon: daysRemaining >= 0 && daysRemaining <= 5,
    formattedDate: target.toLocaleDateString("pt-BR"),
  };
};
