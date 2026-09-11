import { describe, it, expect } from "vitest";
import { Book } from "@/data/mockBooks";

describe("Acervo Sorting & Filtering Logic", () => {
  const sampleBooks: Book[] = [
    {
      id: "1",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "/cover1.jpg",
      status: "lido",
      rating: 5,
      totalPages: 256,
      currentPage: 256,
      ownership: "tenho",
      category: "Clássicos",
      vibes: ["Melancolia", "Nostalgia"],
      dateFinished: "2024-03-15",
    },
    {
      id: "2",
      title: "A Metamorfose",
      author: "Franz Kafka",
      cover: "/cover2.jpg",
      status: "lido",
      rating: 4,
      totalPages: 96,
      currentPage: 96,
      ownership: "tenho",
      category: "Ficção",
      vibes: ["Existencial"],
      dateFinished: "2024-05-20",
    },
    {
      id: "3",
      title: "O Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/cover3.jpg",
      status: "lido",
      rating: 5,
      totalPages: 310,
      currentPage: 310,
      ownership: "tenho",
      category: "Fantasia",
      vibes: ["Aventura"],
      dateFinished: "2023-12-10",
    },
  ];

  it("should sort books by rating descending", () => {
    const sorted = [...sampleBooks].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    expect(sorted[0].rating).toBe(5);
    expect(sorted[sorted.length - 1].rating).toBe(4);
  });

  it("should sort books by dateFinished descending (most recent first)", () => {
    const sorted = [...sampleBooks].sort((a, b) => {
      const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
      const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
      return dateB - dateA;
    });
    expect(sorted[0].title).toBe("A Metamorfose"); // 2024-05-20
    expect(sorted[sorted.length - 1].title).toBe("O Hobbit"); // 2023-12-10
  });

  it("should sort books by total pages descending", () => {
    const sorted = [...sampleBooks].sort((a, b) => (b.totalPages || 0) - (a.totalPages || 0));
    expect(sorted[0].title).toBe("O Hobbit"); // 310
    expect(sorted[sorted.length - 1].title).toBe("A Metamorfose"); // 96
  });

  it("should sort books alphabetically by title (A-Z)", () => {
    const sorted = [...sampleBooks].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    expect(sorted[0].title).toBe("A Metamorfose");
    expect(sorted[1].title).toBe("Dom Casmurro");
    expect(sorted[2].title).toBe("O Hobbit");
  });

  it("should sort books alphabetically by author (A-Z)", () => {
    const sorted = [...sampleBooks].sort((a, b) => (a.author || "").localeCompare(b.author || "", "pt-BR"));
    expect(sorted[0].author).toBe("Franz Kafka");
    expect(sorted[1].author).toBe("J.R.R. Tolkien");
    expect(sorted[2].author).toBe("Machado de Assis");
  });
});
