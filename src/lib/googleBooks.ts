import { supabase } from "@/lib/supabase";

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

// In-memory cache for the current session to conserve free quota
const cache = new Map<string, GoogleBookItem[]>();

export const searchGoogleBooks = async (
  query: string,
  maxResults = 20
): Promise<{ items: GoogleBookItem[]; error?: string }> => {
  const cleanQuery = query.trim();
  if (!cleanQuery) return { items: [] };

  const cacheKey = `${cleanQuery.toLowerCase()}_${maxResults}`;

  // 1. Check in-memory cache
  if (cache.has(cacheKey)) {
    return { items: cache.get(cacheKey)! };
  }

  // 2. Check sessionStorage cache
  try {
    const cachedJson = sessionStorage.getItem(`gbooks_${cacheKey}`);
    if (cachedJson) {
      const parsed = JSON.parse(cachedJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cache.set(cacheKey, parsed);
        return { items: parsed };
      }
    }
  } catch {}

  // 3. Try Supabase Edge Function first
  try {
    const { data, error: fnError } = await supabase.functions.invoke("google-books-search", {
      body: { query: cleanQuery, maxResults },
    });

    if (!fnError && data?.items && Array.isArray(data.items)) {
      const items = sanitizeGoogleBooks(data.items);
      saveToCache(cacheKey, items);
      return { items };
    }
  } catch (e) {
    console.warn("Supabase edge function search unavailable, falling back to direct API:", e);
  }

  // 4. Fallback: Direct Google Books API call
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
      cleanQuery
    )}&maxResults=${Math.min(Math.max(maxResults, 1), 40)}&printType=books`;
    
    if (apiKey) {
      url += `&key=${apiKey.trim()}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 429) {
        return { items: [], error: "Muitas buscas em pouco tempo. Aguarde alguns instantes." };
      }
      if (res.status === 403) {
        return { items: [], error: "Limite da API do Google Books atingido. Adicione uma chave no .env ou use o modo manual." };
      }
      return { items: [], error: `Erro na busca (${res.status}).` };
    }

    const data = await res.json();
    const items = sanitizeGoogleBooks(data?.items || []);
    saveToCache(cacheKey, items);
    return { items };
  } catch (err: any) {
    console.error("Direct Google Books search error:", err);
    return { items: [], error: "Erro de conexão ao buscar livros. Verifique sua internet." };
  }
};

const sanitizeGoogleBooks = (rawItems: any[]): GoogleBookItem[] => {
  return (rawItems || []).map((item) => {
    const v = item.volumeInfo || {};
    const thumb = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || "";
    const secureCover = thumb ? thumb.replace("http://", "https://") : "";

    return {
      id: item.id || String(Math.random()),
      volumeInfo: {
        title: v.title || "Sem título",
        authors: v.authors || ["Autor desconhecido"],
        description: v.description || "",
        pageCount: v.pageCount || 0,
        categories: v.categories || [],
        imageLinks: secureCover ? { thumbnail: secureCover, smallThumbnail: secureCover } : undefined,
      },
    };
  });
};

const saveToCache = (key: string, items: GoogleBookItem[]) => {
  if (!items || items.length === 0) return;
  cache.set(key, items);
  try {
    sessionStorage.setItem(`gbooks_${key}`, JSON.stringify(items.slice(0, 20)));
  } catch {}
};
