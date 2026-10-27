// Declaração para suporte a TypeScript no editor (Deno runtime é injetado pelo Supabase)
declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

interface SearchRequestBody {
  query?: string;
  maxResults?: number | string;
  startIndex?: number | string;
  searchType?: "normal" | "deep";
}

// Configurações de Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Janela de 1 minuto
const MAX_REQUESTS_PER_WINDOW = 15;      // Máximo de 15 buscas por minuto por IP

interface ClientRateLimit {
  count: number;
  resetAt: number;
}

// Armazenamento em memória por instância Deno
const ipRateLimits = new Map<string, ClientRateLimit>();

// Limpeza automática de registros expirados para evitar vazamento de memória
const purgeExpiredLimits = (now: number) => {
  for (const [ip, record] of ipRateLimits.entries()) {
    if (now > record.resetAt) {
      ipRateLimits.delete(ip);
    }
  }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset",
};

/**
 * Extrai o IP real do cliente a partir dos cabeçalhos de proxy do Supabase/Cloudflare
 */
const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "anonymous";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const now = Date.now();
  if (Math.random() < 0.1) {
    purgeExpiredLimits(now);
  }

  // 1. Verificação de Rate Limit por IP
  const clientIp = getClientIp(req);
  let limitRecord = ipRateLimits.get(clientIp);

  if (!limitRecord || now > limitRecord.resetAt) {
    limitRecord = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    ipRateLimits.set(clientIp, limitRecord);
  } else {
    limitRecord.count++;
  }

  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - limitRecord.count);
  const resetSeconds = Math.max(1, Math.ceil((limitRecord.resetAt - now) / 1000));

  const rateLimitHeaders = {
    ...corsHeaders,
    "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(limitRecord.resetAt / 1000)),
  };

  // Se excedeu o limite: Retorna HTTP 429 Too Many Requests
  if (limitRecord.count > MAX_REQUESTS_PER_WINDOW) {
    return new Response(
      JSON.stringify({
        error: "Muitas buscas em pouco tempo. Aguarde alguns instantes.",
        retryAfter: resetSeconds,
      }),
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(resetSeconds),
        },
      }
    );
  }

  try {
    const body = ((await req.json().catch(() => ({}))) || {}) as SearchRequestBody;
    const rawQuery = typeof body.query === "string" ? body.query.trim() : "";

    if (!rawQuery || rawQuery.length < 2) {
      return new Response(JSON.stringify({ error: "Termo de busca inválido (mínimo de 2 caracteres)" }), {
        status: 400,
        headers: { ...rateLimitHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_BOOKS_API_KEY");
    if (!apiKey) {
      console.error("[google-books-search] GOOGLE_BOOKS_API_KEY não configurada nos secrets do Supabase.");
      return new Response(JSON.stringify({ error: "Serviço de busca temporariamente indisponível" }), {
        status: 500,
        headers: { ...rateLimitHeaders, "Content-Type": "application/json" },
      });
    }

    const safeQuery = rawQuery.slice(0, 150);
    const safeMaxResults = Math.min(Math.max(parseInt(String(body.maxResults), 10) || 20, 1), 40);
    const safeStartIndex = Math.max(parseInt(String(body.startIndex), 10) || 0, 0);
    const searchType = body.searchType === "deep" ? "deep" : "normal";

    const queryParam = searchType === "deep"
      ? `intitle:${encodeURIComponent(safeQuery)}&printType=books&langRestrict=pt`
      : `${encodeURIComponent(safeQuery)}&printType=books`;

    const url = `https://www.googleapis.com/books/v1/volumes?q=${queryParam}&maxResults=${safeMaxResults}&startIndex=${safeStartIndex}&key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[google-books-search] Google API error:", res.status, data);
      return new Response(
        JSON.stringify({ error: "Falha na comunicação com o serviço de livros", status: res.status }),
        { status: res.status, headers: { ...rateLimitHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ items: data.items || [], totalItems: data.totalItems || 0 }), {
      status: 200,
      headers: { ...rateLimitHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[google-books-search] Erro inesperado:", err);
    return new Response(JSON.stringify({ error: "Erro interno no servidor ao processar busca." }), {
      status: 500,
      headers: { ...rateLimitHeaders, "Content-Type": "application/json" },
    });
  }
});
