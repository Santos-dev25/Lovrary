import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// Verifica se há credenciais válidas do Supabase configuradas no ambiente
export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  !envUrl.includes("seu-projeto") &&
  !envUrl.includes("placeholder")
);

const SUPABASE_URL = isSupabaseConfigured ? envUrl : "https://placeholder-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured ? envKey : "placeholder-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: isSupabaseConfigured,
  },
});
