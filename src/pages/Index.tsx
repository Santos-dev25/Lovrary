import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import ImmersiveReadingHero from "@/components/ImmersiveReadingHero";
import ReaderSkillsSection from "@/components/ReaderSkillsSection";
import StatsPanel from "@/components/StatsPanel";
import ReadingNow from "@/components/ReadingNow";
import BookCard from "@/components/BookCard";
import CategoryFilter from "@/components/CategoryFilter";
import RecentActivity from "@/components/RecentActivity";
import BookDetailModal from "@/components/BookDetailModal";
import JournalPage from "@/components/JournalPage";
import ReadingQueuePage from "@/components/ReadingQueuePage";
import ResenhasPage from "@/components/ResenhasPage";
import MetasPage from "@/components/MetasPage";
import StatsPage from "@/components/StatsPage";
import ExportPage from "@/components/ExportPage";
import { useBooks } from "@/context/BooksContext";
import { Search, Menu, Users, LayoutGrid, ArrowUpDown, RotateCcw, X } from "lucide-react";
import LovraryLogo from "@/components/LovraryLogo";

import { categories } from "@/data/mockBooks";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "rating-desc" | "date-finished" | "pages-desc" | "pages-asc" | "title-asc" | "author-asc">("recent");

  const { books, setSelectedBook, selectedBook } = useBooks();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Combine standard classifications with any custom classifications present in user's books
  const availableCategories = [
    "Todos",
    ...Array.from(
      new Set([
        ...categories.filter(c => c !== "Todos"),
        ...books.filter(b => b.ownership === "tenho" && b.category).map(b => b.category!),
      ])
    ).sort((a, b) => a.localeCompare(b)),
  ];

  const filteredBooks = useMemo(() => {
    const list = books.filter((b) => {
      if (activeTab === "wishlist") return b.ownership === "pretendo";
      if (activeTab === "lendo") return b.status === "lendo";
      if (b.ownership !== "tenho") return false;
      if (category !== "Todos") {
        const target = category.trim().toLowerCase();
        const catMatch = b.category && b.category.trim().toLowerCase() === target;
        const vibeMatch = b.vibes && b.vibes.some(v => v.trim().toLowerCase() === target);
        if (!catMatch && !vibeMatch) return false;
      }
      if (search) {
        const s = search.trim().toLowerCase();
        const matchTitle = b.title.toLowerCase().includes(s);
        const matchAuthor = b.author.toLowerCase().includes(s);
        const matchCat = b.category?.toLowerCase().includes(s);
        if (!matchTitle && !matchAuthor && !matchCat) return false;
      }
      return true;
    });

    return list.slice().sort((a, b) => {
      if (sortBy === "rating-desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "date-finished") {
        const dateA = a.dateFinished ? new Date(a.dateFinished).getTime() : 0;
        const dateB = b.dateFinished ? new Date(b.dateFinished).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "pages-desc") {
        return (b.totalPages || 0) - (a.totalPages || 0);
      }
      if (sortBy === "pages-asc") {
        return (a.totalPages || 0) - (b.totalPages || 0);
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title, "pt-BR");
      }
      if (sortBy === "author-asc") {
        return (a.author || "").localeCompare(b.author || "", "pt-BR");
      }
      return 0; // "recent" preserves original catalog insertion order
    });
  }, [books, activeTab, category, search, sortBy]);

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          <ImmersiveReadingHero
            onOpenJournal={() => setActiveTab("journal")}
            onExploreAcervo={() => setActiveTab("acervo")}
          />
          <ReaderSkillsSection
            compact
            onExploreFull={() => setActiveTab("skills")}
          />
          <StatsPanel />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <ReadingNow />
            <RecentActivity />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-4">Últimas Adições</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {books.filter(b => b.ownership === "tenho").slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "lendo") {
      return (
        <div className="space-y-6 animate-fade-in">
          <ReadingNow fullView />
        </div>
      );
    }

    if (activeTab === "skills") {
      return (
        <div className="space-y-6 animate-fade-in">
          <ReaderSkillsSection />
        </div>
      );
    }

    if (activeTab === "stats") return <StatsPage />;
    if (activeTab === "metas") return <MetasPage />;
    if (activeTab === "journal") return <JournalPage />;
    if (activeTab === "fila") return <ReadingQueuePage />;
    if (activeTab === "resenhas") return <ResenhasPage />;
    if (activeTab === "exportar") return <ExportPage />;

    // Acervo, Wishlist
    const title = activeTab === "wishlist" ? "Lista de Desejos" : "Meu Acervo";

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">{title}</h2>
          <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{filteredBooks.length} livro(s)</span>
        </div>

        {activeTab === "acervo" && (
          <div className="space-y-3.5">
            {/* Search Input with Clear Button */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por título ou autor no seu acervo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-marsala/30 transition-all shadow-2xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-xl transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <CategoryFilter active={category} onChange={setCategory} items={availableCategories} />

            {/* View Switcher & Sorting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGroupByAuthor(false)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    !groupByAuthor
                      ? "gradient-marsala text-primary-foreground border-transparent shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grade
                </button>
                <button
                  onClick={() => setGroupByAuthor(true)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    groupByAuthor
                      ? "gradient-marsala text-primary-foreground border-transparent shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Por autor
                </button>
              </div>

              {/* Sorting & Filter Reset */}
              <div className="flex items-center gap-2.5 ml-auto">
                <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl shadow-2xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-marsala" />
                  <span className="text-[11px] font-semibold text-muted-foreground hidden sm:inline">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-semibold bg-transparent text-foreground focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="recent" className="bg-card text-foreground">Últimas Adições</option>
                    <option value="rating-desc" className="bg-card text-foreground">★ Melhor Avaliados</option>
                    <option value="date-finished" className="bg-card text-foreground">📅 Data de Leitura</option>
                    <option value="pages-desc" className="bg-card text-foreground">📄 Páginas (Mais longos)</option>
                    <option value="pages-asc" className="bg-card text-foreground">📄 Páginas (Mais curtos)</option>
                    <option value="title-asc" className="bg-card text-foreground">🔤 Título (A-Z)</option>
                    <option value="author-asc" className="bg-card text-foreground">👤 Autor (A-Z)</option>
                  </select>
                </div>

                {(category !== "Todos" || search || sortBy !== "recent") && (
                  <button
                    onClick={() => {
                      setCategory("Todos");
                      setSearch("");
                      setSortBy("recent");
                    }}
                    className="flex items-center gap-1.5 text-xs text-marsala hover:text-marsala-light font-semibold min-h-[36px] px-3 py-1.5 rounded-xl hover:bg-secondary transition-colors"
                    title="Restaurar todos os filtros"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "acervo" && groupByAuthor ? (
          <div className="space-y-8">
            {Array.from(
              filteredBooks.reduce((map, b) => {
                const key = b.author || "Autor desconhecido";
                map.set(key, [...(map.get(key) || []), b]);
                return map;
              }, new Map<string, typeof filteredBooks>())
            )
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([author, list]) => (
                <div key={author}>
                  <h3 translate="no" className="notranslate font-display font-semibold text-base text-foreground mb-3 flex items-center gap-2">
                    {author}
                    <span className="text-xs font-normal text-muted-foreground">({list.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {list.map((book) => (
                      <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-dashed border-border p-8">
            <p className="text-foreground font-display font-medium text-base">Nenhum livro encontrado</p>
            <p className="text-muted-foreground text-xs mt-1">Tente ajustar os termos de busca ou selecione outra categoria.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 h-14 bg-card/90 backdrop-blur border-b border-border">
        <button
          onClick={() => setMobileOpen(true)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 rounded-xl hover:bg-secondary transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <LovraryLogo size={26} />
          <span className="font-display text-lg font-bold text-marsala tracking-tight">lovrary</span>
        </div>
        <div className="w-9" />
      </header>

      <main
        className={`p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? "md:ml-[72px]" : "md:ml-64"
          }`}
      >
        {renderContent()}
      </main>
      {selectedBook && <BookDetailModal />}
    </div>
  );
};

export default Index;
