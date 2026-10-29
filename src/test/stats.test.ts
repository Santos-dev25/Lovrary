import { describe, it, expect } from "vitest";
import { calculateTotalPagesRead, getReturnDeadline } from "@/utils/stats";
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

  it("deve somar currentPage para livros com status 'abandonado'", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "abandonado", totalPages: 600, currentPage: 140, ownership: "tenho" },
      { id: "2", status: "abandonado", totalPages: 450, currentPage: 60, ownership: "tenho" },
    ];
    expect(calculateTotalPagesRead(books as Book[])).toBe(200);
  });

  it("deve somar páginas lidas de livros pegos emprestados", () => {
    const books: Partial<Book>[] = [
      // Livro pego emprestado e já concluído por mim: deve somar total de páginas!
      { id: "1", status: "lido", totalPages: 300, currentPage: 300, ownership: "tenho", borrowedFrom: "Biblioteca" },
      // Livro pego emprestado e em andamento: deve somar páginas lidas até aqui
      { id: "2", status: "emprestado", totalPages: 400, currentPage: 120, ownership: "tenho", borrowedFrom: "Mariana" },
      // Livro pego emprestado que ainda não comecei: 0 páginas
      { id: "3", status: "emprestado", totalPages: 250, currentPage: 0, ownership: "tenho", borrowedFrom: "Carlos" },
    ];
    // 300 + 120 + 0 = 420
    expect(calculateTotalPagesRead(books as Book[])).toBe(420);
  });

  it("deve somar 0 para livros da lista de desejos (pretendo)", () => {
    const books: Partial<Book>[] = [
      { id: "1", status: "pretendo" as any, totalPages: 320, currentPage: 10, ownership: "pretendo" },
      { id: "2", status: "nao-lido", totalPages: 250, currentPage: 0, ownership: "tenho" },
    ];
    expect(calculateTotalPagesRead(books as Book[])).toBe(0);
  });
});

describe("getReturnDeadline", () => {
  it("deve retornar null se não houver returnDate", () => {
    expect(getReturnDeadline(null)).toBeNull();
    expect(getReturnDeadline("")).toBeNull();
  });

  it("deve calcular dias restantes e flags de prazo corretamente", () => {
    const today = new Date();
    
    // Data daqui a 10 dias
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 10);
    const futureRes = getReturnDeadline(futureDate.toISOString());
    expect(futureRes).not.toBeNull();
    expect(futureRes?.daysRemaining).toBe(10);
    expect(futureRes?.isOverdue).toBe(false);
    expect(futureRes?.isDueSoon).toBe(false);

    // Data daqui a 3 dias (prazo próximo)
    const soonDate = new Date(today);
    soonDate.setDate(today.getDate() + 3);
    const soonRes = getReturnDeadline(soonDate.toISOString());
    expect(soonRes?.daysRemaining).toBe(3);
    expect(soonRes?.isDueSoon).toBe(true);
    expect(soonRes?.isOverdue).toBe(false);

    // Data passada há 2 dias (atrasado)
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 2);
    const pastRes = getReturnDeadline(pastDate.toISOString());
    expect(pastRes?.daysRemaining).toBe(-2);
    expect(pastRes?.isOverdue).toBe(true);
  });
});
