import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
}

export interface GoogleBookItem {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

// -------------------------------------------------------------
// RATE LIMITING & CACHE DEFINITIONS
// -------------------------------------------------------------
const cache = new Map<string, { items: GoogleBookItem[]; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<{ items: GoogleBookItem[]; error?: string }>>();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const RATE_LIMIT_WINDOW_MS = 10_000; // 10 segundos
const MAX_REQUESTS_PER_WINDOW = 10; // Máximo 10 requisições por janela
const requestTimestamps: number[] = [];

/**
 * Valida se a taxa de requisições está dentro do limite seguro.
 */
const checkRateLimit = (): boolean => {
  const now = Date.now();
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
};

/**
 * Sanitiza URLs de capas garantindo protocolo seguro HTTPS.
 */
export const sanitizeCoverUrl = (url?: string): string => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  // Permite apenas https:// ou data:image/ seguro
  if (/^https:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^http:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }
  if (/^data:image\/(png|jpeg|jpg|webp);base64,/i.test(trimmed)) {
    return trimmed;
  }
  return "";
};

export interface SearchGoogleBooksOptions {
  maxResults?: number;
  startIndex?: number;
  searchType?: "normal" | "deep";
}

const SUMMARY_PATTERNS = [
  /summary\s+of/i,
  /study\s+guide\s+for/i,
  /resumo\s+de/i,
  /an[aá]lise\s+de/i,
  /workbook\s+for/i,
  /guia\s+de\s+estudo/i,
  /resenha\s+de/i,
];

/**
 * Busca resiliente e rate-limited na Google Books API com suporte a busca Normal, Aprofundada e Paginação.
 */
export const searchGoogleBooks = async (
  query: string,
  optionsOrMaxResults: number | SearchGoogleBooksOptions = 20
): Promise<{ items: GoogleBookItem[]; totalItems?: number; error?: string }> => {
  const options: SearchGoogleBooksOptions =
    typeof optionsOrMaxResults === "number"
      ? { maxResults: optionsOrMaxResults }
      : optionsOrMaxResults || {};

  const cleanQuery = (query || "").trim().slice(0, 120);
  if (cleanQuery.length < 2) {
    return { items: [], totalItems: 0 };
  }

  const safeLimit = Math.min(Math.max(Number(options.maxResults) || 20, 1), 40);
  const startIndex = Math.max(0, Number(options.startIndex) || 0);
  const searchType = options.searchType || "normal";
  const cacheKey = `${searchType}_${cleanQuery.toLowerCase()}_${safeLimit}_${startIndex}`;

  // 1. Checagem de Cache em Memória com TTL
  const now = Date.now();
  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (now - entry.timestamp < CACHE_TTL_MS) {
      return { items: entry.items };
    }
    cache.delete(cacheKey);
  }

  // 2. Checagem de SessionStorage com TTL
  try {
    const cachedRaw = sessionStorage.getItem(`gbooks_${cacheKey}`);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (parsed && Array.isArray(parsed.items) && now - (parsed.timestamp || 0) < CACHE_TTL_MS) {
        cache.set(cacheKey, { items: parsed.items, timestamp: parsed.timestamp });
        return { items: parsed.items };
      }
    }
  } catch {}

  // 3. Deduplicação de requisições concorrentes idênticas (In-Flight Caching)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  // 4. Execução protegida por Rate Limiter
  const requestPromise = (async (): Promise<{ items: GoogleBookItem[]; totalItems?: number; error?: string }> => {
    if (!checkRateLimit()) {
      return {
        items: [],
        error: "Muitas buscas em sequência. Aguarde alguns segundos para pesquisar novamente.",
      };
    }

    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim();

    // -------------------------------------------------------------
    // MODO NORMAL (FOCO EM VELOCIDADE MÁXIMA E RESPOSTA DIRETA)
    // -------------------------------------------------------------
    if (searchType === "normal") {
      try {
        let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=${safeLimit}&startIndex=${startIndex}`;
        if (apiKey) {
          url += `&key=${encodeURIComponent(apiKey)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
            const items = sanitizeGoogleBooks(data.items);
            saveToCache(cacheKey, items);
            return { items, totalItems: Number(data.totalItems) || items.length };
          }
        }
      } catch (err) {
        console.warn("[Google Books Normal] Falha na chamada direta, tentando contingência:", err);
      }
    }

    // -------------------------------------------------------------
    // MODO APROFUNDADO (FOCO EM PRECISÃO, INTITLE E FILTROS SANITIZADOS)
    // -------------------------------------------------------------
    if (searchType === "deep") {
      try {
        // a) Query direcionada
        let url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(cleanQuery)}&printType=books&langRestrict=pt&maxResults=${safeLimit}&startIndex=${startIndex}`;
        if (apiKey) {
          url += `&key=${encodeURIComponent(apiKey)}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
            const sanitized = sanitizeGoogleBooks(data.items);

            // b) Sanitização no Frontend: descarta resumos/guias
            const filtered = sanitized.filter((item) => {
              const title = item.volumeInfo.title || "";
              const desc = item.volumeInfo.description || "";
              return !SUMMARY_PATTERNS.some((p) => p.test(title) || p.test(desc));
            });

            // Se o filtro manteve resultados, retorna imediatamente
            if (filtered.length > 0) {
              saveToCache(cacheKey, filtered);
              return { items: filtered, totalItems: Number(data.totalItems) || filtered.length };
            }
          }
        }

        // c) Regra de Segurança: se o filtro ou a query direcionada zerar resultados,
        // faz fallback automático para a busca normal e ordena por livros com capa e páginas
        console.info("[Google Books Deep] Fallback automático para busca normal...");
        const fallbackRes = await searchGoogleBooks(query, {
          maxResults: safeLimit,
          startIndex,
          searchType: "normal",
        });

        if (fallbackRes.items.length > 0) {
          const sorted = [...fallbackRes.items].sort((a, b) => {
            const aCover = Boolean(a.volumeInfo.imageLinks?.thumbnail);
            const bCover = Boolean(b.volumeInfo.imageLinks?.thumbnail);
            if (aCover && !bCover) return -1;
            if (!aCover && bCover) return 1;
            return (b.volumeInfo.pageCount || 0) - (a.volumeInfo.pageCount || 0);
          });
          saveToCache(cacheKey, sorted);
          return { items: sorted, totalItems: fallbackRes.totalItems };
        }
      } catch (err) {
        console.warn("[Google Books Deep] Falha na busca aprofundada, tentando contingência:", err);
      }
    }

    // -------------------------------------------------------------
    // CONTINGÊNCIAS (Supabase Edge Function & Open Library)
    // -------------------------------------------------------------
    // Tentativa 2: Supabase Edge Function se configurada
    if (isSupabaseConfigured) {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("google-books-search", {
          body: { query: cleanQuery, maxResults: safeLimit, startIndex },
        });

        if (!fnError && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          const items = sanitizeGoogleBooks(data.items);
          saveToCache(cacheKey, items);
          return { items, totalItems: Number(data.totalItems) || items.length };
        }
      } catch (e) {
        console.warn("[Supabase Edge Function] Indisponível:", e);
      }
    }

    // Tentativa 3: Open Library Search API (Fallback aberto)
    try {
      const page = Math.floor(startIndex / safeLimit) + 1;
      const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}&limit=${Math.min(safeLimit, 20)}&page=${page}`;
      const olRes = await fetch(olUrl);
      if (olRes.ok) {
        const olData = await olRes.json();
        if (olData?.docs && Array.isArray(olData.docs) && olData.docs.length > 0) {
          const items = sanitizeOpenLibrary(olData.docs);
          saveToCache(cacheKey, items);
          return { items, totalItems: Number(olData.numFound) || items.length };
        }
      }
    } catch (olErr) {
      console.warn("[Open Library] Falha no fallback:", olErr);
    }

    return {
      items: [],
      error: "Nenhum livro encontrado para esta busca.",
    };
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  try {
    return await requestPromise;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
};

const sanitizeGoogleBooks = (rawItems: any[]): GoogleBookItem[] => {
  return (rawItems || []).map((item) => {
    const v = item.volumeInfo || {};
    const thumb = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || "";
    const secureCover = sanitizeCoverUrl(thumb);

    return {
      id: String(item.id || Math.random().toString(36).substring(2, 9)),
      volumeInfo: {
        title: String(v.title || "Sem título").slice(0, 250),
        authors: Array.isArray(v.authors) ? v.authors.map((a: any) => String(a).slice(0, 100)) : ["Autor desconhecido"],
        description: String(v.description || "").slice(0, 2000),
        pageCount: Math.max(0, Math.min(parseInt(v.pageCount) || 0, 100000)),
        categories: Array.isArray(v.categories) ? v.categories.map((c: any) => String(c).slice(0, 50)) : [],
        imageLinks: secureCover ? { thumbnail: secureCover, smallThumbnail: secureCover } : undefined,
      },
    };
  });
};

const sanitizeOpenLibrary = (docs: any[]): GoogleBookItem[] => {
  return docs.map((doc) => {
    const coverId = doc.cover_i;
    const rawCover = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "";
    const secureCover = sanitizeCoverUrl(rawCover);

    return {
      id: String(doc.key || Math.random().toString(36).substring(2, 9)),
      volumeInfo: {
        title: String(doc.title || "Sem título").slice(0, 250),
        authors: Array.isArray(doc.author_name) ? doc.author_name.map((a: any) => String(a).slice(0, 100)) : ["Autor desconhecido"],
        description: String(doc.first_sentence?.[0] || "").slice(0, 2000),
        pageCount: Math.max(0, Math.min(parseInt(doc.number_of_pages_median) || 0, 100000)),
        categories: Array.isArray(doc.subject) ? doc.subject.slice(0, 3).map((s: any) => String(s).slice(0, 50)) : [],
        imageLinks: secureCover ? { thumbnail: secureCover, smallThumbnail: secureCover } : undefined,
      },
    };
  });
};

const saveToCache = (key: string, items: GoogleBookItem[]) => {
  if (!items || items.length === 0) return;
  const timestamp = Date.now();
  cache.set(key, { items, timestamp });
  try {
    sessionStorage.setItem(`gbooks_${key}`, JSON.stringify({ items: items.slice(0, 20), timestamp }));
  } catch {}
};
