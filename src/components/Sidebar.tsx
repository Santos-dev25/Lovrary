import { useEffect, useState } from "react";
import {
  BookOpen, BarChart3, Heart, NotebookPen, Target, Moon, Sun, Library, Bookmark,
  ChevronLeft, ChevronRight, Download, Star, PlusCircle, LogOut, X, LayoutDashboard, Sparkles
} from "lucide-react";
import { useBooks } from "@/context/BooksContext";
import AddBookModal from "@/components/AddBookModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import LovraryLogo from "@/components/LovraryLogo";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "acervo", label: "Meu Acervo", icon: Library },
  { id: "lendo", label: "Lendo Agora", icon: BookOpen },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "wishlist", label: "Lista de Desejos", icon: Heart },
  { id: "fila", label: "Próxima Leitura", icon: Bookmark },
  { id: "stats", label: "Estatísticas", icon: BarChart3 },
  { id: "metas", label: "Metas", icon: Target },
  { id: "resenhas", label: "Resenhas", icon: Star },
  { id: "exportar", label: "Exportar", icon: Download },
];

const Sidebar = ({
  activeTab, onTabChange, isDark, onToggleDark, collapsed, onToggleCollapse,
  mobileOpen, onMobileClose,
}: SidebarProps) => {
  const { books, isGuest, logoutGuest } = useBooks();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const readingCount = books.filter(b => b.status === "lendo").length;

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = (tab: string) => {
    onTabChange(tab);
    onMobileClose();
  };

  const handleLogout = async () => {
    if (isGuest) {
      logoutGuest();
    } else {
      await supabase.auth.signOut();
    }
    toast.success("Sessão finalizada. Até breve! 📖");
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "md:w-[72px]" : "md:w-64"} w-[260px]`}
      >
        {/* Header with Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
          <LovraryLogo size={34} />
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display text-xl font-bold text-marsala tracking-tight">lovrary</span>
              {isGuest && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  Demo
                </span>
              )}
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="ml-auto md:hidden p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Book Button */}
        <div className="px-3 pt-4">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 gradient-marsala text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity shadow-sm"
            title="Adicionar Livro"
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Adicionar Livro</span>}
          </button>
        </div>

        {/* Nav List */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-secondary text-marsala font-semibold border-l-2 border-marsala shadow-xs"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`}
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-marsala" : "text-muted-foreground"}`} />
                    {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                    {(!collapsed || mobileOpen) && item.id === "lendo" && readingCount > 0 && (
                      <span className="ml-auto bg-marsala/15 text-marsala text-xs px-2 py-0.5 rounded-full font-semibold">
                        {readingCount}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-border p-3 space-y-1.5 bg-card/60">
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isDark ? "Modo Diurno" : "Modo Noturno"}
          >
            {isDark ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4" />}
            {(!collapsed || mobileOpen) && <span>{isDark ? "Modo Diurno" : "Modo Noturno"}</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            {(!collapsed || mobileOpen) && <span>{isGuest ? "Sair do Modo Demo" : "Sair"}</span>}
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Recolher Barra</span>}
          </button>
        </div>
      </aside>
      <AddBookModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
};

export default Sidebar;
