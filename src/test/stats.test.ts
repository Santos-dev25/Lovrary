import { describe, it, expect } from "vitest";
import { calculateTotalPagesRead } from "@/utils/stats";
import type { Book } from "@/data/mockBooks";

describe("calculateTotalPagesRead", () => {
  it("deve retornar 0 para uma lista vazia ou nula", () => {
    expect(calculateTotalPagesRead([])).toBe(0);
    expect(calculateTotalPagesRead(null as any)).toBe(0);
    expect(calculateTotalPagesRead(undefined as any)).toBe(0);
  });

  it("deve somar totalPages para livros com status 'lido'", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "lido", totalPages: 350, currentPage: 350, ownership: "tenho" },
      { id: "2", status: "lido", totalPages: 420, currentPage: 420, ownership: "tenho" },
    ];
    expect(calculateTotalPagesRead(books as Book[])).toBe(770);
  });

  it("deve somar currentPage para livros com status 'lendo'", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "lendo", totalPages: 500, currentPage: 120, ownership: "tenho" },
      { id: "2", status: "lendo", totalPages: 300, currentPage: 85, ownership: "tenho" },
    ];
    expect(calculateTotalPagesRead(books as Book[])).toBe(205);
  });

  it("deve somar 0 para livros com status 'tenho' ou 'pretendo'", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "tenho" as any, totalPages: 400, currentPage: 50, ownership: "tenho" },
      { id: "2", status: "pretendo" as any, totalPages: 320, currentPage: 10, ownership: "pretendo" },
      { id: "3", status: "nao-lido", totalPages: 250, currentPage: 0, ownership: "tenho" },
      { id: "4", status: "lendo", totalPages: 200, currentPage: 50, ownership: "pretendo" }, // wishlist nunca soma
    ];
    expect(calculateTotalPagesRead(books as Book[])).toBe(0);
  });

  it("deve combinar livros lidos, lendo e na estante respeitando rigorosamente a regra", () => {
    const books: Partial<Book>[] = [
      // 1. Lido: deve somar totalPages (400)
      { id: "1", title: "Livro 1", status: "lido", totalPages: 400, currentPage: 400, ownership: "tenho" },
      // 2. Lendo: deve somar currentPage (150)
      { id: "2", title: "Livro 2", status: "lendo", totalPages: 500, currentPage: 150, ownership: "tenho" },
      // 3. Tenho / Não lido: deve somar 0
      { id: "3", title: "Livro 3", status: "nao-lido", totalPages: 300, currentPage: 0, ownership: "tenho" },
      // 4. Pretendo (Wishlist): deve somar 0
      { id: "4", title: "Livro 4", status: "pretendo" as any, totalPages: 600, currentPage: 80, ownership: "pretendo" },
    ];

    // 400 (lido) + 150 (lendo) + 0 + 0 = 550
    expect(calculateTotalPagesRead(books as Book[])).toBe(550);
  });

  it("deve suportar snake_case (total_pages e current_page) vindo do banco de dados Supabase", () => {
    const dbRows = [
      { id: "1", status: "lido", total_pages: 310, current_page: 310, ownership: "tenho" },
      { id: "2", status: "lendo", total_pages: 400, current_page: 95, ownership: "tenho" },
      { id: "3", status: "tenho", total_pages: 200, current_page: 20, ownership: "tenho" },
    ];

    // 310 + 95 + 0 = 405
    expect(calculateTotalPagesRead(dbRows as any)).toBe(405);
  });

  it("deve atualizar instantaneamente o total ao mudar o currentPage de um livro 'lendo'", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "lido", totalPages: 300, ownership: "tenho" },
      { id: "2", status: "lendo", totalPages: 500, currentPage: 40, ownership: "tenho" },
    ];

    expect(calculateTotalPagesRead(books as Book[])).toBe(340);

    // Simula a atualização do card ou modal
    const updatedBooks = books.map(b => (b.id === "2" ? { ...b, currentPage: 180 } : b));
    expect(calculateTotalPagesRead(updatedBooks as Book[])).toBe(480);
  });

  it("deve lidar com valores inválidos, negativos ou strings com segurança", () => {
    const books = [
      { id: "1", status: "lido", totalPages: "250", ownership: "tenho" },
      { id: "2", status: "lendo", currentPage: -50, ownership: "tenho" },
      { id: "3", status: "lendo", currentPage: "invalid", ownership: "tenho" },
    ];

    // 250 (lido com string '250') + 0 (negativo vira 0) + 0 (inválido vira 0) = 250
    expect(calculateTotalPagesRead(books as any)).toBe(250);
  });
});
