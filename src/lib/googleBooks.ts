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

/**
 * Busca resiliente e rate-limited na Google Books API com fallback para Open Library.
 */
export const searchGoogleBooks = async (
  query: string,
  maxResults = 20
): Promise<{ items: GoogleBookItem[]; error?: string }> => {
  // 1. Sanitização e validação de tamanho de query (Prevenção de DoS e injeção de parâmetros)
  const cleanQuery = (query || "").trim().slice(0, 120);
  if (cleanQuery.length < 2) {
    return { items: [] };
  }

  const safeLimit = Math.min(Math.max(Number(maxResults) || 20, 1), 40);
  const cacheKey = `${cleanQuery.toLowerCase()}_${safeLimit}`;

  // 2. Checagem de Cache em Memória com TTL
  const now = Date.now();
  if (cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (now - entry.timestamp < CACHE_TTL_MS) {
      return { items: entry.items };
    }
    cache.delete(cacheKey);
  }

  // 3. Checagem de SessionStorage com TTL
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

  // 4. Deduplicação de requisições concorrentes idênticas (In-Flight Caching)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  // 5. Execução protegida por Rate Limiter
  const requestPromise = (async (): Promise<{ items: GoogleBookItem[]; error?: string }> => {
    if (!checkRateLimit()) {
      return {
        items: [],
        error: "Muitas buscas em sequência. Aguarde alguns segundos para pesquisar novamente.",
      };
    }

    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim();

    // Tentativa 1: Google Books API direta com chave
    try {
      let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=${safeLimit}`;
      if (apiKey) {
        url += `&key=${encodeURIComponent(apiKey)}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          const items = sanitizeGoogleBooks(data.items);
          saveToCache(cacheKey, items);
          return { items };
        }
      }
    } catch (err) {
      console.warn("[Google Books] Falha na chamada direta, tentando contingência:", err);
    }

    // Tentativa 2: Supabase Edge Function se configurada
    if (isSupabaseConfigured) {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("google-books-search", {
          body: { query: cleanQuery, maxResults: safeLimit },
        });

        if (!fnError && data?.items && Array.isArray(data.items) && data.items.length > 0) {
          const items = sanitizeGoogleBooks(data.items);
          saveToCache(cacheKey, items);
          return { items };
        }
      } catch (e) {
        console.warn("[Supabase Edge Function] Indisponível:", e);
      }
    }

    // Tentativa 3: Open Library Search API (Totalmente aberta, sem limites rígidos de quota)
    try {
      const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}&limit=${Math.min(safeLimit, 20)}`;
      const olRes = await fetch(olUrl);
      if (olRes.ok) {
        const olData = await olRes.json();
        if (olData?.docs && Array.isArray(olData.docs) && olData.docs.length > 0) {
          const items = sanitizeOpenLibrary(olData.docs);
          saveToCache(cacheKey, items);
          return { items };
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
