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
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <section className="w-full max-w-xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card">
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-2xl bg-secondary p-3 text-marsala">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            ) : isNotFound ? (
              <Home className="h-6 w-6" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2 text-marsala">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wide">Lovrary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>

            {(locationLabel || details) && (
              <div className="mt-5 space-y-2 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
                {locationLabel && (
                  <p>
                    <span className="font-semibold text-foreground">Etapa:</span> {locationLabel}
                  </p>
                )}
                {details && (
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono leading-5">
                    {details}
                  </pre>
                )}
              </div>
            )}

            {onAction && (
              <button
                type="button"
                onClick={onAction}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                {actionLabel || "Tentar novamente"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AppStatusScreen;