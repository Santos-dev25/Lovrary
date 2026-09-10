import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { type Book, type BookNote, mockBooks } from "@/data/mockBooks";
import { toast } from "sonner";

interface BooksContextType {
  books: Book[];
  loading: boolean;
  isGuest: boolean;
  loginAsGuest: () => void;
  logoutGuest: () => void;
  addBook: (book: Book) => Promise<void>;
  readingQueue: string[];
  readingGoal: { year: number; target: number; current: number };
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  addNote: (bookId: string, note: BookNote) => void;
  deleteNote: (bookId: string, noteId?: string) => Promise<void>;
  moveToAcervo: (bookId: string) => void;
  startReading: (bookId: string) => void;
  finishReading: (bookId: string) => void;
  updateProgress: (bookId: string, currentPage: number) => void;
  addToQueue: (bookId: string) => void;
  removeFromQueue: (bookId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  setGoalTarget: (target: number) => void;
  addReview: (bookId: string, review: string) => void;
  addQuote: (bookId: string, quote: string) => void;
  removeQuote: (bookId: string, index: number) => void;
  setRating: (bookId: string, rating: number) => void;
  setSubRating: (bookId: string, label: string, value: number) => void;
  addVibe: (bookId: string, vibe: string) => void;
  removeVibe: (bookId: string, vibe: string) => void;
  deleteBook: (bookId: string) => Promise<void>;
}

const BooksContext = createContext<BooksContextType | null>(null);

export const useBooks = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
};

const QUEUE_KEY = "lovrary_queue";
const GUEST_KEY = "lovrary_guest_session";
const GUEST_BOOKS_KEY = "lovrary_guest_books";
const GUEST_GOAL_KEY = "lovrary_guest_goal";

// DB row -> Book mapping
type DbBook = {
  id: string;
  title: string;
  author: string | null;
  cover: string | null;
  category: string | null;
  vibes: string[] | null;
  ownership: string;
  status: string;
  total_pages: number | null;
  current_page: number | null;
  rating: number | null;
  sub_ratings: Record<string, number> | null;
  quotes: string[] | null;
  resenha: string | null;
  date_finished?: string | null;
};

type DbNote = {
  id: string;
  book_id: string;
  reaction: string;
  reaction_type: string | null;
  chapter: string | null;
  created_at: string;
};

const dbToBook = (row: DbBook, notes: DbNote[]): Book => {
  const total = row.total_pages || 0;
  const current = row.current_page || 0;
  const progress = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  const bookNotes: BookNote[] = notes
    .filter(n => n.book_id === row.id)
    .map(n => {
      const d = new Date(n.created_at);
      return {
        id: n.id,
        date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
        time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
        chapter: n.chapter || "",
        text: n.reaction,
      };
    });

  const subRatings = row.sub_ratings && typeof row.sub_ratings === "object"
    ? Object.entries(row.sub_ratings).map(([label, value]) => ({ label, value: Number(value) }))
    : [];

  return {
    id: row.id,
    title: row.title,
    author: row.author || "",
    cover: row.cover || "",
    rating: Number(row.rating) || 0,
    category: row.category || "",
    vibes: row.vibes || [],
    ownership: (row.ownership === "pretendo" ? "pretendo" : "tenho") as Book["ownership"],
    status: (row.status as Book["status"]) || "nao-lido",
    progress,
    totalPages: total,
    currentPage: current,
    notes: bookNotes,
    review: row.resenha || undefined,
    quotes: row.quotes || [],
    subRatings,
    dateFinished: row.date_finished || undefined,
  };
};

const subRatingsToDb = (subs?: { label: string; value: number }[]) => {
  if (!subs) return {};
  return subs.reduce((acc, s) => ({ ...acc, [s.label]: s.value }), {} as Record<string, number>);
};

export const BooksProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [readingQueue, setReadingQueue] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    } catch { return []; }
  });
  const [readingGoalState, setReadingGoal] = useState({ year: new Date().getFullYear(), target: 12, current: 0 });
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem(GUEST_KEY) === "true");

  const selectedBook = books.find(b => b.id === selectedBookId) || null;
  const setSelectedBook = useCallback((b: Book | null) => {
    setSelectedBookId(b ? b.id : null);
  }, []);

  // Persist queue locally
  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(readingQueue));
  }, [readingQueue]);

  // Load guest data
  const loadGuestData = useCallback(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(GUEST_BOOKS_KEY);
      const guestBooks: Book[] = stored ? JSON.parse(stored) : mockBooks;
      if (!stored) {
        localStorage.setItem(GUEST_BOOKS_KEY, JSON.stringify(mockBooks));
      }
      setBooks(guestBooks);
      const year = new Date().getFullYear();
      const readCount = guestBooks.filter(b => b.status === "lido").length;
      const storedGoal = localStorage.getItem(GUEST_GOAL_KEY);
      const target = storedGoal ? Number(storedGoal) : 12;
      setReadingGoal({ year, target, current: readCount });
    } catch (e) {
      console.error("Erro ao carregar dados de visitante:", e);
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_KEY, "true");
    setIsGuest(true);
    setUserId("guest");
    loadGuestData();
    toast.success("Bem-vindo(a) ao Modo Demonstração! 📚");
  }, [loadGuestData]);

  const logoutGuest = useCallback(() => {
    localStorage.removeItem(GUEST_KEY);
    setIsGuest(false);
    setUserId(null);
    setBooks([]);
  }, []);

  // Load from Supabase DB
  const loadAll = useCallback(async (_uid: string) => {
    setLoading(true);
    try {
      const [{ data: booksData, error: booksErr }, { data: notesData }, { data: goalData }] = await Promise.all([
        supabase.from("books").select("*").order("created_at", { ascending: false }),
        supabase.from("journal_notes").select("*").order("created_at", { ascending: true }),
        supabase.from("reading_goals").select("*").eq("year", new Date().getFullYear()).maybeSingle(),
      ]);

      if (booksErr) throw booksErr;
      const allBooks = (booksData || []).map(b => dbToBook(b as unknown as DbBook, (notesData || []) as unknown as DbNote[]));
      setBooks(allBooks);

      const year = new Date().getFullYear();
      const readCount = allBooks.filter(b => b.status === "lido").length;
      if (goalData && typeof (goalData as { goal?: number }).goal === "number") {
        setReadingGoal({ year, target: (goalData as { goal: number }).goal, current: readCount });
      } else {
        setReadingGoal({ year, target: 12, current: readCount });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
      toast.error("Erro ao carregar sua biblioteca em nuvem");
    } finally {
      setLoading(false);
    }
  }, []);

  // Watch auth state
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Se não há Supabase configurado, entra em modo convidado se solicitado
      if (localStorage.getItem(GUEST_KEY) === "true") {
        setIsGuest(true);
        setUserId("guest");
        loadGuestData();
      } else {
        setLoading(false);
      }
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id || null;
      if (uid) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
        setUserId(uid);
        setTimeout(() => loadAll(uid), 0);
      } else if (localStorage.getItem(GUEST_KEY) === "true") {
        setIsGuest(true);
        setUserId("guest");
        loadGuestData();
      } else {
        setUserId(null);
        setBooks([]);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id || null;
      if (uid) {
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
        setUserId(uid);
        loadAll(uid);
      } else if (localStorage.getItem(GUEST_KEY) === "true") {
        setIsGuest(true);
        setUserId("guest");
        loadGuestData();
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [loadAll, loadGuestData]);

  // Helper to persist guest books
  const persistGuestBooks = (newBooks: Book[]) => {
    try {
      localStorage.setItem(GUEST_BOOKS_KEY, JSON.stringify(newBooks));
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
  };

  // Helper to persist Supabase
  const persistBook = async (id: string, updates: Partial<DbBook>) => {
    if (isGuest || userId === "guest") return;
    const { error } = await supabase.from("books").update(updates).eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Erro ao salvar alteração");
    }
  };

  const addBook = useCallback(async (book: Book) => {
    if (!userId) {
      toast.error("Você precisa estar conectado");
      return;
    }

    // Deduplicate by title + author
    if (
      books.find(
        b =>
          b.title.trim().toLowerCase() === book.title.trim().toLowerCase() &&
          b.author.trim().toLowerCase() === book.author.trim().toLowerCase()
      )
    ) {
      toast.info("Esse livro já está na sua coleção!");
      return;
    }

    if (isGuest || userId === "guest") {
      const newBook: Book = {
        ...book,
        id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      setBooks(prev => {
        const next = [newBook, ...prev];
        persistGuestBooks(next);
        return next;
      });
      toast.success(book.ownership === "tenho" ? "Livro adicionado ao acervo! 📚" : "Adicionado à lista de desejos! 💫");
      return;
    }

    const insertData = {
      user_id: userId,
      title: book.title,
      author: book.author || null,
      cover: book.cover || null,
      category: book.category || null,
      vibes: book.vibes || [],
      ownership: book.ownership,
      status: book.status,
      total_pages: book.totalPages || 0,
      current_page: book.currentPage || 0,
      rating: book.rating || 0,
    };

    const { data, error } = await supabase.from("books").insert(insertData).select().single();
    if (error) {
      console.error(error);
      toast.error("Erro ao adicionar livro");
      return;
    }

    setBooks(prev => [dbToBook(data as unknown as DbBook, []), ...prev]);
    toast.success(book.ownership === "tenho" ? "Livro adicionado ao acervo! 📚" : "Adicionado à lista de desejos! 💫");
  }, [userId, books, isGuest]);

  const deleteBook = useCallback(async (bookId: string) => {
    try {
      if (!isGuest && userId !== "guest") {
        await supabase.from("journal_notes").delete().eq("book_id", bookId);
        const { error } = await supabase.from("books").delete().eq("id", bookId);
        if (error) {
          toast.error("Erro ao remover do banco de dados");
          return;
        }
      }

      setBooks(prev => {
        const next = prev.filter(b => b.id !== bookId);
        if (isGuest || userId === "guest") persistGuestBooks(next);
        return next;
      });

      setReadingQueue(prev => prev.filter(id => id !== bookId));
      setSelectedBookId(prev => (prev === bookId ? null : prev));
      toast.success("Livro removido do acervo!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir livro");
    }
  }, [isGuest, userId]);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    const recalc = (b: Book): Book => {
      const merged = { ...b, ...updates };
      const total = merged.totalPages !== undefined ? Number(merged.totalPages) : (b.totalPages || 0);
      const current = merged.currentPage !== undefined ? Number(merged.currentPage) : (b.currentPage || 0);
      merged.totalPages = total;
      merged.currentPage = current;
      merged.progress = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
      return merged;
    };

    setBooks(prev => {
      const next = prev.map(b => (b.id === id ? recalc(b) : b));
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });

    if (isGuest || userId === "guest") return;

    const dbUpdates: Partial<DbBook> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.author !== undefined) dbUpdates.author = updates.author;
    if (updates.cover !== undefined) dbUpdates.cover = updates.cover;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.vibes !== undefined) dbUpdates.vibes = updates.vibes;
    if (updates.ownership !== undefined) dbUpdates.ownership = updates.ownership;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.totalPages !== undefined) dbUpdates.total_pages = updates.totalPages;
    if (updates.currentPage !== undefined) dbUpdates.current_page = updates.currentPage;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.review !== undefined) dbUpdates.resenha = updates.review;
    if (updates.quotes !== undefined) dbUpdates.quotes = updates.quotes;
    if (updates.subRatings !== undefined) dbUpdates.sub_ratings = subRatingsToDb(updates.subRatings);
    if (updates.dateFinished !== undefined) dbUpdates.date_finished = updates.dateFinished || null;

    if (Object.keys(dbUpdates).length > 0) persistBook(id, dbUpdates);
  }, [isGuest, userId]);

  const addNote = useCallback(async (bookId: string, note: BookNote) => {
    if (!userId) return;

    if (isGuest || userId === "guest") {
      const saved: BookNote = {
        ...note,
        id: `note_${Date.now()}`,
      };
      setBooks(prev => {
        const next = prev.map(b =>
          b.id === bookId ? { ...b, notes: [...(b.notes || []), saved] } : b
        );
        persistGuestBooks(next);
        return next;
      });
      toast.success("Anotação adicionada! 📝");
      return;
    }

    const { data, error } = await supabase.from("journal_notes").insert({
      user_id: userId,
      book_id: bookId,
      reaction: note.text,
      chapter: note.chapter || null,
    }).select().single();

    if (error) {
      console.error(error);
      toast.error("Erro ao salvar anotação");
      return;
    }

    const saved: BookNote = { ...note, id: (data as { id?: string })?.id };
    setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, notes: [...(b.notes || []), saved] } : b)));
    toast.success("Anotação adicionada! 📝");
  }, [userId, isGuest]);

  const deleteNote = useCallback(async (bookId: string, noteId?: string) => {
    if (!noteId) return;

    if (!isGuest && userId !== "guest") {
      const { error } = await supabase.from("journal_notes").delete().eq("id", noteId);
      if (error) {
        console.error(error);
        toast.error("Erro ao remover anotação");
        return;
      }
    }

    const strip = (b: Book): Book => ({ ...b, notes: (b.notes || []).filter(n => n.id !== noteId) });
    setBooks(prev => {
      const next = prev.map(b => (b.id === bookId ? strip(b) : b));
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });
    toast.success("Anotação apagada!");
  }, [isGuest, userId]);

  const moveToAcervo = useCallback((bookId: string) => {
    updateBook(bookId, { ownership: "tenho", status: "nao-lido" });
    setReadingQueue(prev => prev.filter(id => id !== bookId));
    toast.success("Livro movido para o acervo! 📚");
  }, [updateBook]);

  const startReading = useCallback((bookId: string) => {
    updateBook(bookId, { status: "lendo", ownership: "tenho", currentPage: 0 });
    setReadingQueue(prev => prev.filter(id => id !== bookId));
    toast.success("Boa leitura! 📖");
  }, [updateBook]);

  const finishReading = useCallback((bookId: string) => {
    const book = books.find(b => b.id === bookId);
    const total = book?.totalPages || 0;
    const today = new Date().toISOString().slice(0, 10);
    updateBook(bookId, { status: "lido", currentPage: total, dateFinished: book?.dateFinished || today });
    setReadingGoal(prev => ({ ...prev, current: prev.current + 1 }));
    toast.success("Parabéns por finalizar o livro! 🎉");
  }, [books, updateBook]);

  const updateProgress = useCallback((bookId: string, currentPage: number) => {
    const book = books.find(b => b.id === bookId);
    const validPage = Math.max(0, currentPage);
    const total = book?.totalPages || 0;
    updateBook(bookId, { currentPage: validPage });
    const pct = total > 0 ? Math.min(Math.round((validPage / total) * 100), 100) : 0;
    toast.success(`Progresso atualizado para pág. ${validPage} (${pct}%)`);
  }, [books, updateBook]);

  const addToQueue = useCallback((bookId: string) => {
    setReadingQueue(prev => (prev.includes(bookId) ? prev : [...prev, bookId]));
    toast.success("Adicionado à fila de leitura!");
  }, []);

  const removeFromQueue = useCallback((bookId: string) => {
    setReadingQueue(prev => prev.filter(id => id !== bookId));
  }, []);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setReadingQueue(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  }, []);

  const setGoalTarget = useCallback(async (target: number) => {
    setReadingGoal(prev => ({ ...prev, target }));
    if (isGuest || userId === "guest") {
      localStorage.setItem(GUEST_GOAL_KEY, String(target));
      toast.success("Meta atualizada!");
      return;
    }
    if (!userId) return;

    const year = new Date().getFullYear();
    const { error } = await supabase.from("reading_goals").upsert(
      { user_id: userId, year, goal: target },
      { onConflict: "user_id,year" }
    );
    if (error) {
      console.error(error);
      toast.error("Erro ao salvar meta");
      return;
    }
    toast.success("Meta atualizada!");
  }, [userId, isGuest]);

  const addReview = useCallback((bookId: string, review: string) => {
    updateBook(bookId, { review });
    toast.success("Resenha salva! ✍️");
  }, [updateBook]);

  const addQuote = useCallback((bookId: string, quote: string) => {
    const book = books.find(b => b.id === bookId);
    const quotes = [...(book?.quotes || []), quote];
    updateBook(bookId, { quotes });
    toast.success("Citação adicionada!");
  }, [books, updateBook]);

  const removeQuote = useCallback((bookId: string, index: number) => {
    const book = books.find(b => b.id === bookId);
    const quotes = [...(book?.quotes || [])];
    quotes.splice(index, 1);
    updateBook(bookId, { quotes });
  }, [books, updateBook]);

  const setRating = useCallback((bookId: string, rating: number) => {
    updateBook(bookId, { rating });
  }, [updateBook]);

  const setSubRating = useCallback((bookId: string, label: string, value: number) => {
    const book = books.find(b => b.id === bookId);
    const subRatings = [...(book?.subRatings || [])];
    const idx = subRatings.findIndex(s => s.label.toLowerCase() === label.toLowerCase());
    if (idx >= 0) subRatings[idx] = { label, value };
    else subRatings.push({ label, value });
    updateBook(bookId, { subRatings });
  }, [books, updateBook]);

  const addVibe = useCallback((bookId: string, vibe: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.vibes.some(v => v.toLowerCase() === vibe.toLowerCase())) return;
    updateBook(bookId, { vibes: [...book.vibes, vibe] });
  }, [books, updateBook]);

  const removeVibe = useCallback((bookId: string, vibe: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    updateBook(bookId, { vibes: book.vibes.filter(v => v.toLowerCase() !== vibe.toLowerCase()) });
  }, [books, updateBook]);

  return (
    <BooksContext.Provider value={{
      books, loading, isGuest, loginAsGuest, logoutGuest, addBook, readingQueue,
      readingGoal: readingGoalState, selectedBook, setSelectedBook, updateBook,
      addNote, deleteNote, moveToAcervo, startReading, finishReading, updateProgress,
      addToQueue, removeFromQueue, reorderQueue, setGoalTarget, addReview, addQuote,
      removeQuote, setRating, setSubRating, addVibe, removeVibe, deleteBook,
    }}>
      {children}
    </BooksContext.Provider>
  );
};
