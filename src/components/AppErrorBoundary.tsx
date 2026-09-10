import { Component, type ErrorInfo, type ReactNode } from "react";
import AppStatusScreen from "./AppStatusScreen";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  error: Error | null;
  stack?: string;
};

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Lovrary] erro durante renderização", error, errorInfo);
    this.setState({ stack: errorInfo.componentStack || undefined });
  }

  render() {
    if (this.state.error) {
      return (
        <AppStatusScreen
          state="error"
          title="Algo quebrou durante a renderização"
          description="A tela branca foi substituída por este diagnóstico. Abaixo está o ponto mais provável onde o React interrompeu a interface."
          locationLabel="React render"
          details={`${this.state.error.name}: ${this.state.error.message}${this.state.stack ? `\n${this.state.stack}` : ""}`}
          actionLabel="Recarregar página"
          onAction={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;