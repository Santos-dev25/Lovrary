import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useBooks } from "@/context/BooksContext";
import { BookOpen, Mail, Lock, Loader2, User, Sparkles } from "lucide-react";
import { toast } from "sonner";
import LovraryLogo from "@/components/LovraryLogo";

const Auth = () => {
  const navigate = useNavigate();
  const { loginAsGuest, isGuest } = useBooks();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isGuest || localStorage.getItem("lovrary_guest_session") === "true") {
      navigate("/", { replace: true });
      return;
    }

    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, isGuest]);

  const handleGuestEntry = () => {
    loginAsGuest();
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Preencha email e senha");
      return;
    }

    if (!isSupabaseConfigured) {
      toast.info("Supabase não configurado no .env. Entrando no modo de demonstração.");
      handleGuestEntry();
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        if (password.length < 6) {
          toast.error("A senha precisa ter ao menos 6 caracteres");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Bem-vindo(a) ao Lovrary 📚");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro de autenticação";
      if (msg.includes("Invalid login")) {
        toast.error("Email ou senha inválidos");
      } else if (msg.includes("registered")) {
        toast.error("Este email já está cadastrado. Faça login.");
      } else if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
        toast.error("Limite de e-mails do Supabase atingido. Tente novamente mais tarde.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <LovraryLogo size={56} className="mb-3" />
          <h1 className="font-display text-3xl font-bold text-marsala tracking-tight">lovrary</h1>
          <p className="text-sm text-muted-foreground mt-1">Sua biblioteca e diário pessoal de leituras</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          {/* Guest demo shortcut button */}
          <button
            type="button"
            onClick={handleGuestEntry}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-marsala/30 bg-marsala/5 hover:bg-marsala/10 text-marsala text-sm font-semibold transition-all shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
            <span>Acessar no Modo Demonstração</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider shrink-0">
              ou com sua conta
            </span>
            <div className="border-t border-border w-full" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-secondary rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                mode === "login"
                  ? "gradient-marsala text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                mode === "signup"
                  ? "gradient-marsala text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Como devemos te chamar?"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  autoComplete="email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                />
              </div>
              {mode === "signup" && (
                <p className="text-[11px] text-muted-foreground mt-1.5">Mínimo de 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 gradient-marsala text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  {mode === "login" ? "Entrar na minha biblioteca" : "Criar minha biblioteca"}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === "login" ? "Novo por aqui? " : "Já tem uma conta? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-marsala font-semibold hover:underline"
          >
            {mode === "login" ? "Criar conta" : "Fazer login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
