import { describe, it, expect } from "vitest";
import { calculateReaderSkills } from "@/data/readerSkills";
import { Book } from "@/data/mockBooks";

describe("Reader Skills & Mastery Gamification Engine", () => {
  it("should calculate baseline level for an empty shelf", () => {
    const { level, skills } = calculateReaderSkills([], 12);
    expect(level.level).toBe(1);
    expect(level.title).toBe("Leitora Iniciante");
    expect(level.currentPoints).toBe(0);
    expect(level.badgeCount).toBe(0);
    expect(skills.length).toBe(8);
    expect(skills.every(s => !s.unlocked)).toBe(true);
  });

  it("should reward XP and unlock badges for active reading and journaling", () => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "Orgulho e Preconceito",
        author: "Jane Austen",
        cover: "/cover.jpg",
        status: "lido",
        totalPages: 400,
        currentPage: 400,
        ownership: "tenho",
        category: "Clássico",
        rating: 5,
        review: "Uma obra-prima magistral da literatura mundial com diálogos afiados.",
        notes: [
          { id: "n1", chapter: "Capítulo 1", text: "Início memorável.", date: "2024-01-01" },
          { id: "n2", chapter: "Capítulo 5", text: "Reflexão sobre Darcy.", date: "2024-01-05" },
        ],
        quotes: [
          "É uma verdade universalmente reconhecida que um homem solteiro...",
          "Minha coragem sempre aumenta com cada tentativa de me intimidar."
        ],
      },
      {
        id: "2",
        title: "Duna",
        author: "Frank Herbert",
        cover: "/dune.jpg",
        status: "lendo",
        totalPages: 600,
        currentPage: 250,
        ownership: "tenho",
        category: "Ficção Científica",
        progress: 42,
        notes: [
          { id: "n3", chapter: "Arrakis", text: "Construção de mundo incrível.", date: "2024-02-01" },
        ],
        quotes: ["O medo é o assassino da mente."],
      },
    ];

    const { level, skills } = calculateReaderSkills(mockBooks, 5);

    // Total pages = 400 + 250 = 650 pages
    // Total notes = 3, Total quotes = 3, Reviews = 1, Genres = 2
    expect(level.currentPoints).toBeGreaterThan(500);
    expect(level.level).toBeGreaterThanOrEqual(1);

    // Check specific badges
    const noteBadge = skills.find(s => s.id === "cronista-de-capitulos");
    expect(noteBadge).toBeDefined();
    expect(noteBadge?.currentProgress).toBe(3); // 3 notes

    const quoteBadge = skills.find(s => s.id === "guardia-das-palavras");
    expect(quoteBadge).toBeDefined();
    expect(quoteBadge?.currentProgress).toBe(3); // 3 quotes
    expect(quoteBadge?.unlocked).toBe(true); // unlocked because totalQuotes >= 1
  });
});
