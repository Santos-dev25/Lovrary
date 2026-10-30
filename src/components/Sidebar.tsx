import { useEffect, useState, useMemo } from "react";
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
  { id: "dashboard", label: "Início", icon: LayoutDashboard },
  { id: "acervo", label: "Meu Acervo", icon: Library },
  { id: "lendo", label: "Lendo Agora", icon: BookOpen },
  { id: "journal", label: "Journal", icon: NotebookPen },
  { id: "skills", label: "Maestria & Skills", icon: Sparkles },
  { id: "wishlist", label: "Lista de Desejos", icon: Heart },
  { id: "fila", label: "Próxima Leitura", icon: Bookmark },
  { id: "stats", label: "Registros de Leitura", icon: BarChart3 },
  { id: "metas", label: "Metas", icon: Target },
  { id: "resenhas", label: "Resenhas", icon: Star },
  { id: "exportar", label: "Preservar Acervo", icon: Download },
];

const Sidebar = ({
  activeTab, onTabChange, isDark, onToggleDark, collapsed, onToggleCollapse,
  mobileOpen, onMobileClose,
}: SidebarProps) => {
  const { books, isGuest, logoutGuest } = useBooks();
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Contagem exata em tempo real por abas ('tenho', 'pretendo', 'lendo', 'lido')
  const tabCounts = useMemo(() => ({
    acervo: books.filter(b => b.ownership === "tenho" && b.status !== "emprestado").length,
    wishlist: books.filter(b => b.ownership === "pretendo").length,
    lendo: books.filter(b => b.status === "lendo").length,
    stats: books.filter(b => b.status === "lido").length,
  }), [books]);

  // Bloqueio de scroll do body com preservação de touch action no drawer móvel
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  // Fechamento pelo teclado com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onMobileClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onMobileClose]);

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
      {/* Overlay com fade e desfoque sutil no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-xs md:hidden animate-fade-in"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-[width,transform] duration-200 ease-in-out z-50
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"} md:translate-x-0
          ${collapsed ? "md:w-[72px]" : "md:w-64"} w-[280px] max-w-[85vw]`}
        role="dialog"
        aria-modal={mobileOpen ? "true" : undefined}
        aria-label="Navegação da Biblioteca"
      >
        {/* Topo com Logo e Identidade Editorial */}
        <div className="flex items-center gap-3 px-4 py-4.5 border-b border-sidebar-border shrink-0">
          <LovraryLogo size={32} />
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-serif text-xl font-bold text-sidebar-primary tracking-tight">Lovrary</span>
              {isGuest && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                  Demo
                </span>
              )}
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="ml-auto md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botão de Ação Primária: Adicionar Livro */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-full min-h-[42px] flex items-center justify-center gap-2.5 px-3.5 py-2.5 bg-sidebar-primary text-sidebar-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            title="Adicionar Livro"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="font-medium">Adicionar Livro</span>}
          </button>
        </div>

        {/* Lista de Navegação Principal */}
        <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <ul className="space-y-1 px-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const count =
                item.id === "acervo"
                  ? tabCounts.acervo
                  : item.id === "lendo"
                  ? tabCounts.lendo
                  : item.id === "wishlist"
                  ? tabCounts.wishlist
                  : item.id === "stats"
                  ? tabCounts.stats
                  : undefined;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNav(item.id)}
                    className={`w-full min-h-[40px] flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary font-semibold border-l-2 border-sidebar-primary shadow-xs"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-sidebar-primary" : "text-muted-foreground"
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate text-left flex-1">{item.label}</span>
                    )}
                    {(!collapsed || mobileOpen) && count !== undefined && count > 0 && (
                      <span
                        className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-numeric font-semibold shrink-0 ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : item.id === "lendo"
                            ? "bg-sidebar-primary/15 text-sidebar-primary"
                            : "bg-sidebar-accent text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Ações do Rodapé: Tema, Sessão e Recolhimento */}
        <div className="border-t border-sidebar-border p-2.5 space-y-1 bg-sidebar shrink-0">
          <button
            onClick={onToggleDark}
            className="w-full min-h-[40px] flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            title={isDark ? "Modo Diurno" : "Modo Noturno"}
          >
            {isDark ? <Sun className="w-4 h-4 text-gold shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {(!collapsed || mobileOpen) && <span>{isDark ? "Modo Diurno" : "Modo Noturno"}</span>}
          </button>

          <button
            onClick={handleLogout}
            className="w-full min-h-[40px] flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            title="Sair"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>{isGuest ? "Sair do Modo Demo" : "Sair"}</span>}
          </button>

          {/* Alternância de recolhimento no Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full min-h-[36px] items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            title={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
            aria-label={collapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronLeft className="w-4 h-4 shrink-0" />}
            {!collapsed && <span>Recolher Barra</span>}
          </button>
        </div>
      </aside>
      <AddBookModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </>
  );
};

export default Sidebar;
