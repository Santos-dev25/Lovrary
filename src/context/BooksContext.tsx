import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { type Book, type BookNote, mockBooks } from "@/data/mockBooks";
import { sanitizeCoverUrl } from "@/lib/googleBooks";
import {
  type ReadingSession,
  type StreakResult,
  type ReadingPaceResult,
  calculateStreak,
  calculateReadingPace,
  getLocalDateString,
  offsetDateString,
} from "@/utils/sessions";
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
  updateNote: (bookId: string, noteId: string, updates: { text: string; chapter?: string }) => Promise<void>;
  deleteNote: (bookId: string, noteId?: string) => Promise<void>;
  moveToAcervo: (bookId: string) => void;
  startReading: (bookId: string) => void;
  finishReading: (bookId: string) => void;
  updateProgress: (bookId: string, currentPage: number, durationMinutes?: number) => void;
  readingSessions: ReadingSession[];
  recordReadingSession: (session: {
    bookId: string;
    pagesRead: number;
    startPage?: number | null;
    endPage?: number | null;
    durationMinutes?: number | null;
    notes?: string | null;
    sessionDate?: string;
  }) => Promise<void>;
  streak: StreakResult;
  readingPace: ReadingPaceResult;
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
const GUEST_SESSIONS_KEY = "lovrary_guest_sessions";

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
      if (localStorage.getItem(GUEST_KEY) === "true") {
        return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
      }
      return [];
    } catch { return []; }
  });
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>(() => {
    try {
      if (localStorage.getItem(GUEST_KEY) === "true") {
        return JSON.parse(localStorage.getItem(GUEST_SESSIONS_KEY) || "[]");
      }
      return [];
    } catch { return []; }
  });
  const [readingGoalConfig, setReadingGoalConfig] = useState({ year: new Date().getFullYear(), target: 12 });

  // Cálculo reativo e instantâneo dos livros lidos no ano da meta (sem necessidade de F5)
  const booksReadThisYear = useMemo(() => {
    return books.filter((b) => {
      if (b.status !== "lido") return false;
      if (b.dateFinished) {
        const d = new Date(b.dateFinished);
        return !isNaN(d.getTime()) && d.getFullYear() === readingGoalConfig.year;
      }
      return true;
    }).length;
  }, [books, readingGoalConfig.year]);

  const readingGoal = useMemo(() => ({
    year: readingGoalConfig.year,
    target: readingGoalConfig.target,
    current: booksReadThisYear,
  }), [readingGoalConfig, booksReadThisYear]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => localStorage.getItem(GUEST_KEY) === "true");

  const booksRef = useRef<Book[]>(books);
  useEffect(() => {
    booksRef.current = books;
  }, [books]);

  const readingQueueRef = useRef<string[]>(readingQueue);
  useEffect(() => {
    readingQueueRef.current = readingQueue;
  }, [readingQueue]);

  const readingSessionsRef = useRef<ReadingSession[]>(readingSessions);
  useEffect(() => {
    readingSessionsRef.current = readingSessions;
  }, [readingSessions]);

  const activeReadingBook = useMemo(() => books.find(b => b.status === "lendo"), [books]);
  const activeBookRemainingPages = activeReadingBook && activeReadingBook.totalPages
    ? Math.max(0, activeReadingBook.totalPages - (activeReadingBook.currentPage || 0))
    : undefined;

  const streak = useMemo(() => calculateStreak(readingSessions), [readingSessions]);
  const readingPace = useMemo(
    () => calculateReadingPace(readingSessions, activeBookRemainingPages),
    [readingSessions, activeBookRemainingPages]
  );

  const selectedBook = useMemo(() => books.find(b => b.id === selectedBookId) || null, [books, selectedBookId]);
  const setSelectedBook = useCallback((b: Book | null) => {
    setSelectedBookId(b ? b.id : null);
  }, []);

  // Persistência local da fila EXCLUSIVAMENTE para o Modo Convidado / Visitante
  useEffect(() => {
    if (isGuest || userId === "guest") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(readingQueue));
    }
  }, [readingQueue, isGuest, userId]);

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
      const storedGoal = localStorage.getItem(GUEST_GOAL_KEY);
      const target = storedGoal ? Number(storedGoal) : 12;
      setReadingGoalConfig({ year, target });

      const storedQueue = localStorage.getItem(QUEUE_KEY);
      const guestQueue = storedQueue ? JSON.parse(storedQueue) : ["6", "7"];
      setReadingQueue(guestQueue);

      const storedSessions = localStorage.getItem(GUEST_SESSIONS_KEY);
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        setReadingSessions(parsed);
        readingSessionsRef.current = parsed;
      } else {
        const todayStr = getLocalDateString();
        const yesterdayStr = offsetDateString(todayStr, -1);
        const twoDaysAgoStr = offsetDateString(todayStr, -2);
        const sampleSessions: ReadingSession[] = [
          { id: "guest_s1", bookId: "1", pagesRead: 28, durationMinutes: 35, sessionDate: twoDaysAgoStr },
          { id: "guest_s2", bookId: "1", pagesRead: 34, durationMinutes: 45, sessionDate: yesterdayStr },
          { id: "guest_s3", bookId: "1", pagesRead: 22, durationMinutes: 25, sessionDate: todayStr },
        ];
        setReadingSessions(sampleSessions);
        readingSessionsRef.current = sampleSessions;
        localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(sampleSessions));
      }
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
    localStorage.removeItem(GUEST_BOOKS_KEY);
    localStorage.removeItem(GUEST_GOAL_KEY);
    localStorage.removeItem(QUEUE_KEY);
    localStorage.removeItem(GUEST_SESSIONS_KEY);
    setIsGuest(false);
    setUserId(null);
    setBooks([]);
    setReadingQueue([]);
    setReadingSessions([]);
    readingSessionsRef.current = [];
    setSelectedBookId(null);
  }, []);

  // Load from Supabase DB (com filtro defensivo por user_id e migração da fila)
  const loadAll = useCallback(async (_uid: string) => {
    setLoading(true);
    try {
      const [
        { data: booksData, error: booksErr },
        { data: notesData },
        { data: goalData },
        { data: queueData, error: queueErr },
        { data: sessionsData, error: sessionsErr },
      ] = await Promise.all([
        supabase.from("books").select("*").eq("user_id", _uid).order("created_at", { ascending: false }),
        supabase.from("journal_notes").select("*").eq("user_id", _uid).order("created_at", { ascending: true }),
        supabase.from("reading_goals").select("*").eq("user_id", _uid).eq("year", new Date().getFullYear()).maybeSingle(),
        supabase.from("reading_queue").select("book_id, position").eq("user_id", _uid).order("position", { ascending: true }),
        supabase.from("reading_sessions").select("*").eq("user_id", _uid).order("session_date", { ascending: false }),
      ]);

      if (booksErr) throw booksErr;
      if (queueErr) {
        console.warn("[Lovrary] Aviso ao carregar reading_queue:", queueErr);
      }
      if (sessionsErr) {
        console.warn("[Lovrary] Aviso ao carregar reading_sessions:", sessionsErr);
      }

      const allBooks = (booksData || []).map(b => dbToBook(b as unknown as DbBook, (notesData || []) as unknown as DbNote[]));
      setBooks(allBooks);

      const mappedSessions: ReadingSession[] = (sessionsData || []).map((s: {
        id: string;
        book_id: string;
        user_id: string;
        pages_read: number;
        start_page: number | null;
        end_page: number | null;
        duration_minutes: number | null;
        session_date: string;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }) => ({
        id: s.id,
        bookId: s.book_id,
        userId: s.user_id,
        pagesRead: s.pages_read || 0,
        startPage: s.start_page,
        endPage: s.end_page,
        durationMinutes: s.duration_minutes,
        sessionDate: s.session_date,
        notes: s.notes,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
      setReadingSessions(mappedSessions);
      readingSessionsRef.current = mappedSessions;

      const year = new Date().getFullYear();
      if (goalData && typeof (goalData as { goal?: number }).goal === "number") {
        setReadingGoalConfig({ year, target: (goalData as { goal: number }).goal });
      } else {
        setReadingGoalConfig({ year, target: 12 });
      }

      // Fila vinda do banco de dados
      let remoteQueue = (queueData || []).map(q => q.book_id);

      // Migração Transparente: Se houver dados legados no localStorage, migra para o Supabase
      try {
        const rawLocal = localStorage.getItem(QUEUE_KEY);
        if (rawLocal) {
          const localQueue = JSON.parse(rawLocal);
          if (Array.isArray(localQueue) && localQueue.length > 0) {
            // Apenas IDs que realmente pertencem aos livros cadastrados do usuário
            const validLocalIds = localQueue.filter(id => allBooks.some(b => b.id === id));
            
            // Se a fila remota do usuário ainda estava vazia mas ele tinha itens locais
            if (remoteQueue.length === 0 && validLocalIds.length > 0) {
              const rowsToInsert = validLocalIds.map((bookId, idx) => ({
                user_id: _uid,
                book_id: bookId,
                position: idx,
              }));
              const { error: insertErr } = await supabase.from("reading_queue").insert(rowsToInsert);
              if (!insertErr) {
                remoteQueue = validLocalIds;
              }
            }
          }
          // Limpa com segurança a chave legada do localStorage após a migração
          localStorage.removeItem(QUEUE_KEY);
        }
      } catch (migErr) {
        console.warn("[Lovrary] Aviso na migração automática da fila:", migErr);
      }

      setReadingQueue(remoteQueue);
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
        // Limpeza completa de sessão
        setUserId(null);
        setBooks([]);
        setReadingQueue([]);
        setReadingSessions([]);
        readingSessionsRef.current = [];
        setSelectedBookId(null);
        localStorage.removeItem(QUEUE_KEY);
        localStorage.removeItem(GUEST_SESSIONS_KEY);
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

  // Helper to persist Supabase com proteção BOLA
  const persistBook = async (id: string, updates: Partial<DbBook>) => {
    if (isGuest || userId === "guest" || !userId) return;
    // Remove campos que nunca podem ser alterados pelo cliente para evitar adulteração de posse
    const { id: _ignoredId, user_id: _ignoredUserId, ...safeUpdates } = updates as any;
    const { error } = await supabase
      .from("books")
      .update(safeUpdates)
      .eq("id", id)
      .eq("user_id", userId);
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
    const currentBooks = booksRef.current;
    if (
      currentBooks.find(
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
      title: String(book.title || "").trim().slice(0, 250),
      author: String(book.author || "Autor desconhecido").trim().slice(0, 150),
      cover: sanitizeCoverUrl(book.cover),
      category: String(book.category || "Outros").trim().slice(0, 50),
      vibes: Array.isArray(book.vibes) ? book.vibes.slice(0, 10).map(v => String(v).trim().slice(0, 30)) : [],
      ownership: book.ownership === "pretendo" ? "pretendo" : "tenho",
      status: ["lido", "lendo", "nao-lido"].includes(book.status) ? book.status : "nao-lido",
      total_pages: Math.max(0, Math.min(Number(book.totalPages) || 0, 100000)),
      current_page: Math.max(0, Math.min(Number(book.currentPage) || 0, 100000)),
      rating: Math.max(0, Math.min(5, Number(book.rating) || 0)),
    };

    const { data, error } = await supabase.from("books").insert(insertData).select().single();
    if (error) {
      console.error(error);
      toast.error("Erro ao adicionar livro");
      return;
    }

    setBooks(prev => [dbToBook(data as unknown as DbBook, []), ...prev]);
    toast.success(book.ownership === "tenho" ? "Livro adicionado ao acervo! 📚" : "Adicionado à lista de desejos! 💫");
  }, [userId, isGuest]);

  const deleteBook = useCallback(async (bookId: string) => {
    const previousBooks = booksRef.current;
    const previousQueue = readingQueue;
    const previousSessions = readingSessionsRef.current;

    // 1. Atualização otimista imediata na UI (0ms de atraso perceptível)
    setBooks(prev => {
      const next = prev.filter(b => b.id !== bookId);
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });

    setReadingQueue(prev => prev.filter(id => id !== bookId));
    setReadingSessions(prev => {
      const next = prev.filter(s => s.bookId !== bookId);
      if (isGuest || userId === "guest") {
        localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(next));
      }
      readingSessionsRef.current = next;
      return next;
    });
    setSelectedBookId(prev => (prev === bookId ? null : prev));
    toast.success("Livro removido do acervo!");

    if (isGuest || userId === "guest" || !userId) return;

    // 2. Persistência assíncrona com rollback em caso de falha de rede
    try {
      await supabase.from("journal_notes").delete().eq("book_id", bookId).eq("user_id", userId);
      await supabase.from("reading_sessions").delete().eq("book_id", bookId).eq("user_id", userId);
      const { error } = await supabase.from("books").delete().eq("id", bookId).eq("user_id", userId);
      if (error) throw error;
    } catch (e) {
      console.error("Erro ao excluir livro no Supabase:", e);
      setBooks(previousBooks);
      setReadingQueue(previousQueue);
      setReadingSessions(previousSessions);
      readingSessionsRef.current = previousSessions;
      toast.error("Erro ao sincronizar exclusão com o servidor. Ação desfeita.");
    }
  }, [isGuest, userId, readingQueue]);

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
    if (updates.title !== undefined) dbUpdates.title = String(updates.title).trim().slice(0, 250);
    if (updates.author !== undefined) dbUpdates.author = String(updates.author).trim().slice(0, 150);
    if (updates.cover !== undefined) dbUpdates.cover = sanitizeCoverUrl(updates.cover);
    if (updates.category !== undefined) dbUpdates.category = String(updates.category).trim().slice(0, 50);
    if (updates.vibes !== undefined) dbUpdates.vibes = Array.isArray(updates.vibes) ? updates.vibes.slice(0, 10).map(v => String(v).trim().slice(0, 30)) : [];
    if (updates.ownership !== undefined) dbUpdates.ownership = updates.ownership;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.totalPages !== undefined) dbUpdates.total_pages = Math.max(0, Math.min(Number(updates.totalPages) || 0, 100000));
    if (updates.currentPage !== undefined) dbUpdates.current_page = Math.max(0, Math.min(Number(updates.currentPage) || 0, 100000));
    if (updates.rating !== undefined) dbUpdates.rating = Math.max(0, Math.min(5, Number(updates.rating) || 0));
    if (updates.review !== undefined) dbUpdates.resenha = String(updates.review).slice(0, 5000);
    if (updates.quotes !== undefined) dbUpdates.quotes = Array.isArray(updates.quotes) ? updates.quotes.slice(0, 50).map(q => String(q).slice(0, 500)) : [];
    if (updates.subRatings !== undefined) dbUpdates.sub_ratings = subRatingsToDb(updates.subRatings);
    if (updates.dateFinished !== undefined) dbUpdates.date_finished = updates.dateFinished || null;

    if (Object.keys(dbUpdates).length > 0) persistBook(id, dbUpdates);
  }, [isGuest, userId]);

  const addNote = useCallback(async (bookId: string, note: BookNote) => {
    if (!userId) return;

    const safeText = String(note.text || "").trim().slice(0, 2000);
    const safeChapter = note.chapter ? String(note.chapter).trim().slice(0, 100) : "";
    const tempId = `temp_note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const optimisticNote: BookNote = {
      ...note,
      id: tempId,
      text: safeText,
      chapter: safeChapter,
    };

    // Resposta instantânea na interface
    setBooks(prev => {
      const next = prev.map(b => (b.id === bookId ? { ...b, notes: [...(b.notes || []), optimisticNote] } : b));
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });
    toast.success("Anotação adicionada! 📝");

    if (isGuest || userId === "guest") return;

    try {
      const { data, error } = await supabase.from("journal_notes").insert({
        user_id: userId,
        book_id: bookId,
        reaction: safeText,
        chapter: safeChapter || null,
      }).select().single();

      if (error) throw error;

      if (data?.id) {
        setBooks(prev => prev.map(b => {
          if (b.id !== bookId) return b;
          return {
            ...b,
            notes: (b.notes || []).map(n => (n.id === tempId ? { ...n, id: data.id } : n)),
          };
        }));
      }
    } catch (err) {
      console.error("Erro ao salvar anotação:", err);
      // Rollback
      setBooks(prev => prev.map(b => (b.id === bookId ? { ...b, notes: (b.notes || []).filter(n => n.id !== tempId) } : b)));
      toast.error("Erro ao salvar anotação na nuvem.");
    }
  }, [userId, isGuest]);

  const deleteNote = useCallback(async (bookId: string, noteId?: string) => {
    if (!noteId) return;

    const previousBooks = booksRef.current;
    const strip = (b: Book): Book => ({ ...b, notes: (b.notes || []).filter(n => n.id !== noteId) });

    // Atualização otimista imediata
    setBooks(prev => {
      const next = prev.map(b => (b.id === bookId ? strip(b) : b));
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });

    if (isGuest || userId === "guest" || !userId) return;

    try {
      const { error } = await supabase.from("journal_notes").delete().eq("id", noteId).eq("user_id", userId);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao remover anotação:", err);
      setBooks(previousBooks);
      toast.error("Erro ao sincronizar exclusão da anotação.");
    }
  }, [isGuest, userId]);

  const updateNote = useCallback(async (bookId: string, noteId: string, updates: { text: string; chapter?: string }) => {
    if (!noteId) return;

    const previousBooks = booksRef.current;
    const safeText = String(updates.text || "").trim().slice(0, 2000);
    const safeChapter = updates.chapter ? String(updates.chapter).trim().slice(0, 100) : "";

    // Atualização otimista imediata
    setBooks(prev => {
      const next = prev.map(b => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          notes: (b.notes || []).map(n => {
            if (n.id !== noteId) return n;
            return {
              ...n,
              text: safeText,
              chapter: safeChapter || n.chapter,
            };
          }),
        };
      });
      if (isGuest || userId === "guest") persistGuestBooks(next);
      return next;
    });

    toast.success("Anotação atualizada! ✍️");

    if (isGuest || userId === "guest" || !userId) return;

    try {
      const { error } = await supabase
        .from("journal_notes")
        .update({
          reaction: safeText,
          chapter: safeChapter || null,
        })
        .eq("id", noteId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (err) {
      console.error("Erro ao atualizar anotação:", err);
      setBooks(previousBooks);
      toast.error("Erro ao sincronizar edição no servidor.");
    }
  }, [isGuest, userId]);

  const moveToAcervo = useCallback((bookId: string) => {
    updateBook(bookId, { ownership: "tenho", status: "nao-lido" });
    setReadingQueue(prev => prev.filter(id => id !== bookId));
    if (userId && !isGuest && userId !== "guest") {
      supabase.from("reading_queue").delete().eq("user_id", userId).eq("book_id", bookId).then();
    }
    toast.success("Livro movido para o acervo! 📚");
  }, [updateBook, userId, isGuest]);

  const startReading = useCallback((bookId: string) => {
    updateBook(bookId, { status: "lendo", ownership: "tenho", currentPage: 0 });
    setReadingQueue(prev => prev.filter(id => id !== bookId));
    if (userId && !isGuest && userId !== "guest") {
      supabase.from("reading_queue").delete().eq("user_id", userId).eq("book_id", bookId).then();
    }
    toast.success("Boa leitura! 📖");
  }, [updateBook, userId, isGuest]);

  const recordReadingSession = useCallback(async (params: {
    bookId: string;
    pagesRead: number;
    startPage?: number | null;
    endPage?: number | null;
    durationMinutes?: number | null;
    notes?: string | null;
    sessionDate?: string;
  }) => {
    if (params.pagesRead <= 0) return;
    const sessionDate = params.sessionDate || getLocalDateString();
    const tempId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newSession: ReadingSession = {
      id: tempId,
      bookId: params.bookId,
      userId: userId || undefined,
      pagesRead: params.pagesRead,
      startPage: params.startPage ?? null,
      endPage: params.endPage ?? null,
      durationMinutes: params.durationMinutes ?? null,
      sessionDate,
      notes: params.notes ?? null,
      createdAt: new Date().toISOString(),
    };

    const nextSessions = [newSession, ...readingSessionsRef.current];
    readingSessionsRef.current = nextSessions;
    setReadingSessions(nextSessions);

    if (isGuest || userId === "guest") {
      localStorage.setItem(GUEST_SESSIONS_KEY, JSON.stringify(nextSessions));
      return;
    }

    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("reading_sessions")
        .insert({
          user_id: userId,
          book_id: params.bookId,
          pages_read: params.pagesRead,
          start_page: params.startPage ?? null,
          end_page: params.endPage ?? null,
          duration_minutes: params.durationMinutes ?? null,
          session_date: sessionDate,
          notes: params.notes ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao registrar reading_session no Supabase:", error);
      } else if (data?.id) {
        setReadingSessions(prev =>
          prev.map(s => (s.id === tempId ? { ...s, id: data.id } : s))
        );
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar sessão de leitura:", err);
    }
  }, [userId, isGuest]);

  const finishReading = useCallback((bookId: string) => {
    const book = booksRef.current.find(b => b.id === bookId);
    const total = book?.totalPages || 0;
    const oldPage = book?.currentPage || 0;
    const today = getLocalDateString();
    updateBook(bookId, { status: "lido", currentPage: total, dateFinished: book?.dateFinished || today });
    toast.success("Parabéns por finalizar o livro! 🎉");

    if (total > oldPage) {
      recordReadingSession({
        bookId,
        pagesRead: total - oldPage,
        startPage: oldPage,
        endPage: total,
      });
    }
  }, [updateBook, recordReadingSession]);

  const updateProgress = useCallback((bookId: string, currentPage: number, durationMinutes?: number) => {
    const book = booksRef.current.find(b => b.id === bookId);
    const oldPage = book?.currentPage || 0;
    const validPage = Math.max(0, currentPage);
    const total = book?.totalPages || 0;
    updateBook(bookId, { currentPage: validPage });
    const pct = total > 0 ? Math.min(Math.round((validPage / total) * 100), 100) : 0;
    toast.success(`Progresso atualizado para pág. ${validPage} (${pct}%)`);

    if (validPage > oldPage) {
      recordReadingSession({
        bookId,
        pagesRead: validPage - oldPage,
        startPage: oldPage,
        endPage: validPage,
        durationMinutes: durationMinutes ?? null,
      });
    }
  }, [updateBook, recordReadingSession]);

  const addToQueue = useCallback((bookId: string) => {
    const currentQueue = readingQueueRef.current;
    if (currentQueue.includes(bookId)) return;

    const newQueue = [...currentQueue, bookId];
    readingQueueRef.current = newQueue;
    setReadingQueue(newQueue);
    toast.success("Adicionado à fila de leitura!");

    if (isGuest || userId === "guest") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      return;
    }
    if (!userId) return;

    const position = newQueue.length - 1;
    supabase
      .from("reading_queue")
      .upsert({ user_id: userId, book_id: bookId, position }, { onConflict: "user_id,book_id" })
      .then(({ error }) => {
        if (error) {
          console.error("Erro ao adicionar à fila no Supabase:", error);
          toast.error("Erro ao sincronizar fila com a nuvem.");
        }
      });
  }, [userId, isGuest]);

  const removeFromQueue = useCallback((bookId: string) => {
    const newQueue = readingQueueRef.current.filter(id => id !== bookId);
    readingQueueRef.current = newQueue;
    setReadingQueue(newQueue);

    if (isGuest || userId === "guest") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
      return;
    }
    if (!userId) return;

    supabase
      .from("reading_queue")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .then(({ error }) => {
        if (error) {
          console.error("Erro ao remover da fila no Supabase:", error);
          toast.error("Erro ao sincronizar remoção da fila.");
        }
      });
  }, [userId, isGuest]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    const arr = [...readingQueueRef.current];
    if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) return;

    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    readingQueueRef.current = arr;
    setReadingQueue(arr);

    if (isGuest || userId === "guest") {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
      return;
    }
    if (!userId) return;

    // Atualiza a posição de todos os itens da fila no Supabase em lote
    const payload = arr.map((bookId, position) => ({
      user_id: userId,
      book_id: bookId,
      position,
    }));

    supabase
      .from("reading_queue")
      .upsert(payload, { onConflict: "user_id,book_id" })
      .then(({ error }) => {
        if (error) {
          console.error("Erro ao reordenar fila no Supabase:", error);
          toast.error("Erro ao sincronizar ordem da fila.");
        }
      });
  }, [userId, isGuest]);

  const setGoalTarget = useCallback(async (target: number) => {
    const safeTarget = Math.max(1, Math.min(parseInt(String(target)) || 12, 1000));
    setReadingGoalConfig(prev => ({ ...prev, target: safeTarget }));
    toast.success("Meta atualizada!");

    if (isGuest || userId === "guest") {
      localStorage.setItem(GUEST_GOAL_KEY, String(safeTarget));
      return;
    }
    if (!userId) return;

    const year = new Date().getFullYear();
    const { error } = await supabase.from("reading_goals").upsert(
      { user_id: userId, year, goal: safeTarget },
      { onConflict: "user_id,year" }
    );
    if (error) {
      console.error(error);
      toast.error("Erro ao sincronizar meta na nuvem");
    }
  }, [userId, isGuest]);

  const addReview = useCallback((bookId: string, review: string) => {
    const safeReview = String(review || "").trim().slice(0, 5000);
    updateBook(bookId, { review: safeReview });
    toast.success("Resenha salva! ✍️");
  }, [updateBook]);

  const addQuote = useCallback((bookId: string, quote: string) => {
    const book = booksRef.current.find(b => b.id === bookId);
    const safeQuote = String(quote || "").trim().slice(0, 500);
    if (!safeQuote) return;
    const quotes = [...(book?.quotes || []), safeQuote];
    updateBook(bookId, { quotes });
    toast.success("Citação adicionada!");
  }, [updateBook]);

  const removeQuote = useCallback((bookId: string, index: number) => {
    const book = booksRef.current.find(b => b.id === bookId);
    const quotes = [...(book?.quotes || [])];
    quotes.splice(index, 1);
    updateBook(bookId, { quotes });
  }, [updateBook]);

  const setRating = useCallback((bookId: string, rating: number) => {
    updateBook(bookId, { rating });
  }, [updateBook]);

  const setSubRating = useCallback((bookId: string, label: string, value: number) => {
    const book = booksRef.current.find(b => b.id === bookId);
    const subRatings = [...(book?.subRatings || [])];
    const idx = subRatings.findIndex(s => s.label.toLowerCase() === label.toLowerCase());
    if (idx >= 0) subRatings[idx] = { label, value };
    else subRatings.push({ label, value });
    updateBook(bookId, { subRatings });
  }, [updateBook]);

  const addVibe = useCallback((bookId: string, vibe: string) => {
    const book = booksRef.current.find(b => b.id === bookId);
    if (!book || book.vibes.some(v => v.toLowerCase() === vibe.toLowerCase())) return;
    updateBook(bookId, { vibes: [...book.vibes, vibe] });
  }, [updateBook]);

  const removeVibe = useCallback((bookId: string, vibe: string) => {
    const book = booksRef.current.find(b => b.id === bookId);
    if (!book) return;
    updateBook(bookId, { vibes: book.vibes.filter(v => v.toLowerCase() !== vibe.toLowerCase()) });
  }, [updateBook]);

  const contextValue = useMemo(() => ({
    books, loading, isGuest, loginAsGuest, logoutGuest, addBook, readingQueue,
    readingGoal, selectedBook, setSelectedBook, updateBook,
    addNote, updateNote, deleteNote, moveToAcervo, startReading, finishReading, updateProgress,
    readingSessions, recordReadingSession, streak, readingPace,
    addToQueue, removeFromQueue, reorderQueue, setGoalTarget, addReview, addQuote,
    removeQuote, setRating, setSubRating, addVibe, removeVibe, deleteBook,
  }), [
    books, loading, isGuest, loginAsGuest, logoutGuest, addBook, readingQueue,
    readingGoal, selectedBook, setSelectedBook, updateBook,
    addNote, updateNote, deleteNote, moveToAcervo, startReading, finishReading, updateProgress,
    readingSessions, recordReadingSession, streak, readingPace,
    addToQueue, removeFromQueue, reorderQueue, setGoalTarget, addReview, addQuote,
    removeQuote, setRating, setSubRating, addVibe, removeVibe, deleteBook,
  ]);

  return (
    <BooksContext.Provider value={contextValue}>
      {children}
    </BooksContext.Provider>
  );
};
