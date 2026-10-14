const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawQuery = typeof body?.query === "string" ? body.query.trim() : "";

    if (!rawQuery || rawQuery.length < 2) {
      return new Response(JSON.stringify({ error: "Termo de busca inválido (mínimo de 2 caracteres)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_BOOKS_API_KEY");
    if (!apiKey) {
      console.error("[google-books-search] GOOGLE_BOOKS_API_KEY não configurada nos secrets.");
      return new Response(JSON.stringify({ error: "Serviço de busca temporariamente indisponível" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    const data = await res.json();

    if (!res.ok) {
      console.error("[google-books-search] Google API error:", res.status, data);
      return new Response(
        JSON.stringify({ error: "Falha na comunicação com o serviço de livros", status: res.status }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ items: data.items || [], totalItems: data.totalItems || 0 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[google-books-search] Erro inesperado:", err);
    return new Response(JSON.stringify({ error: "Erro interno no servidor ao processar busca." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
