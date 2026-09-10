import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppStatusScreen from "@/components/AppStatusScreen";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppStatusScreen
      state="not-found"
      title="Rota não encontrada"
      description="A aplicação carregou, mas o endereço acessado não corresponde a nenhuma tela configurada no Lovrary."
      locationLabel={`React Router: ${location.pathname}`}
      actionLabel="Voltar para a biblioteca"
      onAction={() => window.location.assign("/")}
    />
  );
};

export default NotFound;
