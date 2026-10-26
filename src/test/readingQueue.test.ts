import { describe, it, expect } from "vitest";

describe("Reading Queue (Fila de Leitura) - Lógica de Negócio", () => {
  it("deve adicionar novos livros à fila mantendo a ordem sem duplicatas", () => {
    let queue: string[] = ["book-1", "book-2"];
    
    // Adicionando um novo livro
    const addBook = (id: string) => {
      if (!queue.includes(id)) {
        queue = [...queue, id];
      }
    };

    addBook("book-3");
    expect(queue).toEqual(["book-1", "book-2", "book-3"]);

    // Tentando adicionar livro duplicado
    addBook("book-2");
    expect(queue).toEqual(["book-1", "book-2", "book-3"]);
  });

  it("deve remover livros da fila corretamente", () => {
    let queue: string[] = ["book-1", "book-2", "book-3"];
    
    const removeBook = (id: string) => {
      queue = queue.filter(bookId => bookId !== id);
    };

    removeBook("book-2");
    expect(queue).toEqual(["book-1", "book-3"]);
  });

  it("deve reordenar a fila corretamente mantendo os índices consistentes", () => {
    let queue: string[] = ["book-1", "book-2", "book-3", "book-4"];

    const reorder = (fromIndex: number, toIndex: number) => {
      const arr = [...queue];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      queue = arr;
    };

    // Move o livro do índice 2 ("book-3") para o índice 0 (primeiro lugar)
    reorder(2, 0);
    expect(queue).toEqual(["book-3", "book-1", "book-2", "book-4"]);

    // Move o livro do índice 1 ("book-1") para o índice 3 (último lugar)
    reorder(1, 3);
    expect(queue).toEqual(["book-3", "book-2", "book-4", "book-1"]);
  });

  it("deve mapear a fila com a lista de livros reais ignorando livros excluídos", () => {
    const queue = ["b1", "b2", "b3", "deleted-b4"];
    const allBooks = [
      { id: "b1", title: "Livro 1" },
      { id: "b2", title: "Livro 2" },
      { id: "b3", title: "Livro 3" },
    ];

    const mapped = queue
      .map(id => allBooks.find(b => b.id === id))
      .filter(Boolean);

    expect(mapped.length).toBe(3);
    expect(mapped.map(b => b!.id)).toEqual(["b1", "b2", "b3"]);
  });

  it("deve filtrar corretamente dados legados na migração de localStorage para o Supabase", () => {
    const localQueue = ["b1", "b-invalid-id", "b2", "mock-legacy-99"];
    const userRemoteBooks = [
      { id: "b1", title: "Meu Livro 1" },
      { id: "b2", title: "Meu Livro 2" },
    ];

    // Lógica exata usada em loadAll:
    const validLocalIds = localQueue.filter(id => userRemoteBooks.some(b => b.id === id));
    expect(validLocalIds).toEqual(["b1", "b2"]);
  });
});
