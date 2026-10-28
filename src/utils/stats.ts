import type { Book } from "@/data/mockBooks";

export interface BookPagesLike {
  status?: string | null;
  ownership?: string | null;
  totalPages?: number | string | null;
  total_pages?: number | string | null;
  currentPage?: number | string | null;
  current_page?: number | string | null;
}

/**
 * Calcula o total acumulado de páginas lidas para a dashboard:
 * 1. Para livros com status 'lido' (concluídos): somar o total de páginas do livro (	otal_pages ou 	otalPages).
 * 2. Para livros com status 'lendo' (em andamento) ou 'abandonado' (interrompidos): somar a página atual onde o leitor parou (current_page ou currentPage).
 * 3. Para livros com status 'emprestado', 'tenho' ou 'pretendo': somar 0.
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

    // 3. Para livros da lista de desejos (wishlist/pretendo): somar 0
    if (status === "tenho" || status === "pretendo" || ownership === "pretendo") {
      return sum;
    }

    // 1. Para livros com status 'lido' (concluídos): somar o total de páginas do livro
    if (status === "lido") {
      const rawTotal = book.totalPages ?? (book as BookPagesLike).total_pages;
      const total = Math.max(0, Math.floor(Number(rawTotal) || 0));
      return sum + total;
    }

    // 2. Para livros com status 'lendo' ou 'abandonado': somar a página atual onde o leitor parou
    if (status === "lendo" || status === "abandonado") {
      const rawCurrent = book.currentPage ?? (book as BookPagesLike).current_page;
      const current = Math.max(0, Math.floor(Number(rawCurrent) || 0));
      return sum + current;
    }

    // Para outros status (ex: 'nao-lido', 'emprestado'): somar 0
    return sum;
  }, 0);
};