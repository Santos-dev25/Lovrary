import { AlertTriangle, BookOpen, Home, Loader2, RefreshCw } from "lucide-react";

type AppStatusScreenProps = {
  title: string;
  description: string;
  state?: "loading" | "error" | "not-found";
  locationLabel?: string;
  details?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const AppStatusScreen = ({
  title,
  description,
  state = "loading",
  locationLabel,
  details,
  actionLabel,
  onAction,
}: AppStatusScreenProps) => {
  const isLoading = state === "loading";
  const isNotFound = state === "not-found";

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 animate-fade-in">
      <section className="w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-card">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-primary/10 p-3 text-primary">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            ) : isNotFound ? (
              <Home className="h-6 w-6" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider font-sans">Lovrary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">{title}</h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground font-sans">{description}</p>

            {(locationLabel || details) && (
              <div className="mt-4 space-y-2 rounded-xl border border-border bg-secondary/30 p-3.5 text-xs text-muted-foreground font-sans">
                {locationLabel && (
                  <p>
                    <span className="font-semibold text-foreground">Etapa:</span> {locationLabel}
                  </p>
                )}
                {details && (
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-5">
                    {details}
                  </pre>
                )}
              </div>
            )}

            {onAction && (
              <button
                type="button"
                onClick={onAction}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>{actionLabel || "Tentar novamente"}</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AppStatusScreen;
