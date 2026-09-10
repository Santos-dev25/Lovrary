import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useBooks } from "@/context/BooksContext";
import AppStatusScreen from "./AppStatusScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isGuest } = useBooks();
  const [loading, setLoading] = useState(!isGuest);
  const [authed, setAuthed] = useState(isGuest);

  useEffect(() => {
    if (isGuest || localStorage.getItem("lovrary_guest_session") === "true") {
      setAuthed(true);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setAuthed(false);
      setLoading(false);
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session || localStorage.getItem("lovrary_guest_session") === "true");
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session || localStorage.getItem("lovrary_guest_session") === "true");
      setLoading(false);
    }).catch(() => {
      setAuthed(false);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, [isGuest]);

  if (loading) {
    return (
      <AppStatusScreen
        state="loading"
        title="Abrindo sua biblioteca..."
        description="Preparando suas leituras, metas e anotações."
        locationLabel="Autenticação"
      />
    );
  }

  if (!authed) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
