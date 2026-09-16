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

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim();

  // 3. Primary: Direct Google Books API call with VITE_GOOGLE_BOOKS_API_KEY
  try {
    const limit = Math.min(Math.max(maxResults, 1), 40);
    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=${limit}`;
    
    if (apiKey) {
      url += `&key=${apiKey}`;
    }

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
        const items = sanitizeGoogleBooks(data.items);
        saveToCache(cacheKey, items);
        return { items };
      }
    } else {
      console.warn(`Google Books API response status: ${res.status}. Falling back to Open Library.`);
    }
  } catch (err) {
    console.warn("Direct Google Books search error, trying fallbacks:", err);
  }

  // 4. Secondary: Try Supabase Edge Function if Supabase is properly configured
  if (isSupabaseConfigured) {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("google-books-search", {
        body: { query: cleanQuery, maxResults },
      });

      if (!fnError && data?.items && Array.isArray(data.items) && data.items.length > 0) {
        const items = sanitizeGoogleBooks(data.items);
        saveToCache(cacheKey, items);
        return { items };
      }
    } catch (e) {
      console.warn("Supabase edge function search unavailable:", e);
    }
  }

  // 5. Fallback Resilience: Open Library Search API (Free, No API key needed, never rate-limited)
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}&limit=${Math.min(maxResults, 20)}`;
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
    console.warn("Open Library fallback search failed:", olErr);
  }

  return {
    items: [],
    error: apiKey
      ? "Nenhum livro encontrado para esta busca."
      : "Busca limitada pelo Google. Configure VITE_GOOGLE_BOOKS_API_KEY no seu ambiente para máxima velocidade.",
  };
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

const sanitizeOpenLibrary = (docs: any[]): GoogleBookItem[] => {
  return docs.map((doc) => {
    const coverId = doc.cover_i;
    const secureCover = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "";

    return {
      id: doc.key || String(Math.random()),
      volumeInfo: {
        title: doc.title || "Sem título",
        authors: doc.author_name || ["Autor desconhecido"],
        description: doc.first_sentence?.[0] || "",
        pageCount: doc.number_of_pages_median || 0,
        categories: doc.subject?.slice(0, 3) || [],
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
