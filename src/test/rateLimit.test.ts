import { describe, it, expect, vi, beforeEach } from "vitest";

// Simulador da lógica de Rate Limiting da Edge Function para testes unitários
interface ClientRateLimit {
  count: number;
  resetAt: number;
}

const createRateLimiter = (maxRequests = 15, windowMs = 60_000) => {
  const ipRateLimits = new Map<string, ClientRateLimit>();

  const getClientIp = (headers: Record<string, string>): string => {
    const forwardedFor = headers["x-forwarded-for"];
    if (forwardedFor) {
      const firstIp = forwardedFor.split(",")[0]?.trim();
      if (firstIp) return firstIp;
    }
    return headers["cf-connecting-ip"] || headers["x-real-ip"] || "anonymous";
  };

  const check = (headers: Record<string, string>, now = Date.now()) => {
    const clientIp = getClientIp(headers);
    let limitRecord = ipRateLimits.get(clientIp);

    if (!limitRecord || now > limitRecord.resetAt) {
      limitRecord = {
        count: 1,
        resetAt: now + windowMs,
      };
      ipRateLimits.set(clientIp, limitRecord);
    } else {
      limitRecord.count++;
    }

    const remaining = Math.max(0, maxRequests - limitRecord.count);
    const retryAfter = Math.max(1, Math.ceil((limitRecord.resetAt - now) / 1000));
    const isLimited = limitRecord.count > maxRequests;

    return {
      clientIp,
      isLimited,
      status: isLimited ? 429 : 200,
      count: limitRecord.count,
      remaining,
      retryAfter,
      body: isLimited
        ? { error: "Muitas buscas em pouco tempo. Aguarde alguns instantes.", retryAfter }
        : null,
    };
  };

  const purge = (now = Date.now()) => {
    for (const [ip, record] of ipRateLimits.entries()) {
      if (now > record.resetAt) {
        ipRateLimits.delete(ip);
      }
    }
  };

  return { check, purge, ipRateLimits };
};

describe("Edge Function Rate Limiting (google-books-search)", () => {
  let limiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    limiter = createRateLimiter(15, 60_000);
  });

  describe("Extração segura de IP do cliente", () => {
    it("deve extrair o IP primário do cabeçalho x-forwarded-for quando atrás de proxy", () => {
      const res = limiter.check({ "x-forwarded-for": "203.0.113.195, 70.41.3.18" });
      expect(res.clientIp).toBe("203.0.113.195");
    });

    it("deve usar cf-connecting-ip se x-forwarded-for não estiver presente", () => {
      const res = limiter.check({ "cf-connecting-ip": "198.51.100.4" });
      expect(res.clientIp).toBe("198.51.100.4");
    });

    it("deve fazer fallback para 'anonymous' quando nenhum cabeçalho de IP for provido", () => {
      const res = limiter.check({});
      expect(res.clientIp).toBe("anonymous");
    });
  });

  describe("Controle de taxa e status HTTP 429", () => {
    it("deve permitir requisições até o limite máximo configurado (15 requisições/min)", () => {
      const headers = { "x-forwarded-for": "10.0.0.1" };
      for (let i = 1; i <= 15; i++) {
        const res = limiter.check(headers);
        expect(res.isLimited).toBe(false);
        expect(res.status).toBe(200);
        expect(res.count).toBe(i);
        expect(res.remaining).toBe(15 - i);
      }
    });

    it("deve retornar HTTP 429 com mensagem amigável e Retry-After na 16ª requisição", () => {
      const headers = { "x-forwarded-for": "10.0.0.1" };
      // Realiza 15 requisições normais
      for (let i = 1; i <= 15; i++) {
        limiter.check(headers);
      }

      // 16ª requisição
      const blocked = limiter.check(headers);
      expect(blocked.isLimited).toBe(true);
      expect(blocked.status).toBe(429);
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfter).toBeGreaterThan(0);
      expect(blocked.body?.error).toBe("Muitas buscas em pouco tempo. Aguarde alguns instantes.");
    });

    it("deve isolar limites por IP diferente", () => {
      const ipA = { "x-forwarded-for": "192.168.1.1" };
      const ipB = { "x-forwarded-for": "192.168.1.2" };

      // Esgota limite do IP A
      for (let i = 1; i <= 16; i++) {
        limiter.check(ipA);
      }

      const resA = limiter.check(ipA);
      expect(resA.status).toBe(429);

      // IP B continua livre com status 200
      const resB = limiter.check(ipB);
      expect(resB.status).toBe(200);
      expect(resB.count).toBe(1);
    });

    it("deve resetar o contador e liberar o IP após a expiração da janela (60s)", () => {
      const headers = { "x-forwarded-for": "10.0.0.5" };
      const startTime = 1000000;

      // 16 requisições no instante inicial
      for (let i = 1; i <= 16; i++) {
        limiter.check(headers, startTime);
      }
      expect(limiter.check(headers, startTime).status).toBe(429);

      // Após 61 segundos (janela expirada)
      const afterWindow = startTime + 61_000;
      const resAfter = limiter.check(headers, afterWindow);

      expect(resAfter.status).toBe(200);
      expect(resAfter.isLimited).toBe(false);
      expect(resAfter.count).toBe(1);
    });

    it("deve expurgar registros antigos da memória sem vazamento", () => {
      const headers = { "x-forwarded-for": "10.0.0.9" };
      const startTime = 1000000;
      limiter.check(headers, startTime);

      expect(limiter.ipRateLimits.has("10.0.0.9")).toBe(true);

      // Purge 61 segundos depois
      limiter.purge(startTime + 61_000);
      expect(limiter.ipRateLimits.has("10.0.0.9")).toBe(false);
    });
  });
});
