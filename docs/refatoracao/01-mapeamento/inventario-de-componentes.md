# Inventário de Componentes — Lovrary

> Mapeamento completo de todos os componentes de domínio, páginas virtuais, primitivos shadcn/ui e componentes compartilhados do projeto.

---

## 1. Componentes de Domínio e Páginas Virtuais (`src/components/`)

| Componente | Caminho Real | Props Principais | Estado Interno | Dependências Chave |
|---|---|---|---|---|
| **Sidebar** | [src/components/Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx) | `activeTab`, `onTabChange`, `isDark`, `onToggleDark`, `collapsed`, `onToggleCollapse`, `mobileOpen`, `onMobileClose` | `addModalOpen` | `useBooks`, `supabase`, `AddBookModal`, `LovraryLogo`, Lucide Icons |
| **BookCard** | [src/components/BookCard.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx) | `book: Book`, `onClick?: () => void` | Sem estado (memoizado com `React.memo`) | `RatingStars`, `getReturnDeadline`, `framer-motion` |
| **BookDetailModal** | [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) | Sem props (consome `selectedBook` do contexto) | `activeTab`, `noteText`, `noteChapter`, `reviewText`, `isEditingReview`, `quoteText`, `newSubLabel`, `newSubRating`, `pageInput`, `totalPagesInput`, `borrowModalOpen`, `borrowPerson`, `borrowDate`, `abandonModalOpen`, `abandonPage`, `recs`, `recsLoading`, etc. | `useBooks`, `searchGoogleBooks`, `RatingStars`, `framer-motion`, `sonner` |
| **AddBookModal** | [src/components/AddBookModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx) | `open: boolean`, `onClose: () => void` | `mode`, `query`, `results`, `loading`, `loadingMore`, `hasMore`, `searchType`, `error`, `addingId`, formulário manual (`manualTitle`, `manualAuthor`, etc.) | `useBooks`, `searchGoogleBooks`, `sanitizeCoverUrl`, `Dialog` (shadcn/ui) |
| **ImmersiveReadingHero** | [src/components/ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx) | `onOpenJournal?: () => void`, `onExploreAcervo?: () => void` | `pageInput`, `isEditingPage`, `justSaved` | `useBooks`, `framer-motion`, `sonner` |
| **ReaderSkillsSection** | [src/components/ReaderSkillsSection.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx) | `compact?: boolean`, `onExploreFull?: () => void` | `selectedSkill`, `activeCategory` | `useBooks`, `calculateReaderSkills`, `framer-motion` |
| **ReadingNow** | [src/components/ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx) | `fullView?: boolean` | `pickerOpen`, `pickerSearch`, `pageInputs` | `useBooks`, `framer-motion` |
| **StatsPanel** | [src/components/StatsPanel.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPanel.tsx) | Sem props (dados do contexto) | Sem estado | `useBooks`, `calculateTotalPagesRead`, `calculateDailyHistory`, `recharts`, `framer-motion` |
| **RecentActivity** | [src/components/RecentActivity.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RecentActivity.tsx) | Sem props (dados do contexto) | Sem estado | `useBooks`, `framer-motion` |
| **JournalPage** | [src/components/JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx) | Sem props | `activeBookId`, `noteText`, `noteChapter`, `pageInput`, `editingNoteId`, `editingText`, `editingChapter` | `useBooks`, `sonner` |
| **ReadingQueuePage** | [src/components/ReadingQueuePage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx) | Sem props | Sem estado | `useBooks`, `framer-motion` |
| **ResenhasPage** | [src/components/ResenhasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ResenhasPage.tsx) | Sem props | Sem estado | `useBooks`, `RatingStars`, `framer-motion` |
| **MetasPage** | [src/components/MetasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx) | Sem props | `editingGoal`, `goalInput` | `useBooks`, `calculateTotalPagesRead`, `framer-motion` |
| **StatsPage** | [src/components/StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx) | Sem props | `categoryFilter`, `yearFilter` | `useBooks`, `recharts`, `framer-motion` |
| **ExportPage** | [src/components/ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx) | Sem props | `selectedBookId`, `exportingPng`, `cardTheme`, `showQuote`, `showReview` | `useBooks`, `html-to-image`, `RatingStars`, `sonner` |
| **CategoryFilter** | [src/components/CategoryFilter.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/CategoryFilter.tsx) | `active: string`, `onChange: (cat: string) => void`, `items?: string[]` | Sem estado | Ícones Lucide |
| **RatingStars** | [src/components/RatingStars.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RatingStars.tsx) | `value: number`, `onChange?: (rating: number) => void`, `size?: "sm" \| "md" \| "lg"`, `showValue?: boolean`, `readOnly?: boolean` | `hoverValue` | Ícones Lucide (`Star`) |
| **LovraryLogo** | [src/components/LovraryLogo.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/LovraryLogo.tsx) | `size?: number`, `className?: string` | Sem estado (SVG puro) | Sem dependências |
| **NextReadingBanner** | [src/components/NextReadingBanner.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/NextReadingBanner.tsx) | Sem props | Sem estado | `useBooks` |
| **WelcomeBanner** | [src/components/WelcomeBanner.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/WelcomeBanner.tsx) | Sem props | Sem estado | `useBooks` |
| **NavLink** | [src/components/NavLink.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/NavLink.tsx) | `to`, `children`, `className`, `activeClassName` | Sem estado | `react-router-dom` |
| **ProtectedRoute** | [src/components/ProtectedRoute.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ProtectedRoute.tsx) | `children: React.ReactNode` | `loading`, `authed` | `supabase`, `useBooks`, `AppStatusScreen`, `Navigate` |
| **AppErrorBoundary** | [src/components/AppErrorBoundary.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppErrorBoundary.tsx) | `children: ReactNode` | `error`, `stack` | `AppStatusScreen`, React Class Component |
| **AppStatusScreen** | [src/components/AppStatusScreen.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppStatusScreen.tsx) | `state: "loading" \| "error" \| "empty"`, `title`, `description`, `locationLabel`, `details`, `actionLabel`, `onAction` | Sem estado | `LovraryLogo`, Lucide Icons |

---

## 2. Primitivos de Interface shadcn/ui (`src/components/ui/`)

O projeto possui **48 componentes primitivos** instalados sob a pasta [src/components/ui/](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/):

1. [`accordion.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/accordion.tsx) — Acordeão colapsável baseado em `@radix-ui/react-accordion`.
2. [`alert-dialog.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/alert-dialog.tsx) — Diálogos modais de confirmação destrutiva baseados em `@radix-ui/react-alert-dialog`.
3. [`alert.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/alert.tsx) — Faixa de aviso e feedback em linha com variantes default e destructive.
4. [`aspect-ratio.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/aspect-ratio.tsx) — Manutenção de proporção geométrica de elementos baseada em `@radix-ui/react-aspect-ratio`.
5. [`avatar.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/avatar.tsx) — Imagem de perfil com fallback textual baseada em `@radix-ui/react-avatar`.
6. [`badge.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/badge.tsx) — Selos compactos de status com variantes semânticas.
7. [`breadcrumb.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/breadcrumb.tsx) — Trilha de navegação estrutural.
8. [`button.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/button.tsx) — Botão universal com `class-variance-authority` (default, destructive, outline, secondary, ghost, link).
9. [`calendar.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/calendar.tsx) — Seletor de datas baseado em `react-day-picker`.
10. [`card.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/card.tsx) — Container de conteúdo estruturado (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
11. [`carousel.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/carousel.tsx) — Carrossel tátil baseado em `embla-carousel-react`.
12. [`chart.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/chart.tsx) — Integração visual de temas e tooltips para gráficos `recharts`.
13. [`checkbox.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/checkbox.tsx) — Caixa de seleção baseada em `@radix-ui/react-checkbox`.
14. [`collapsible.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/collapsible.tsx) — Seções expansíveis baseadas em `@radix-ui/react-collapsible`.
15. [`command.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/command.tsx) — Paleta de comando acessível baseada em `cmdk`.
16. [`context-menu.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/context-menu.tsx) — Menu de contexto ao clique direito baseado em `@radix-ui/react-context-menu`.
17. [`dialog.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/dialog.tsx) — Modal estrutural baseado em `@radix-ui/react-dialog`.
18. [`drawer.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/drawer.tsx) — Gaveta inferior móvel baseada em `vaul`.
19. [`dropdown-menu.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/dropdown-menu.tsx) — Menus suspensos baseados em `@radix-ui/react-dropdown-menu`.
20. [`form.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/form.tsx) — Integração com `react-hook-form` e `zod`.
21. [`hover-card.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/hover-card.tsx) — Card de pré-visualização ao passar o mouse baseado em `@radix-ui/react-hover-card`.
22. [`input-otp.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/input-otp.tsx) — Campo numérico para códigos OTP baseado em `input-otp`.
23. [`input.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/input.tsx) — Campo de texto estilizado com suporte a foco e temas.
24. [`label.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/label.tsx) — Rótulos acessíveis baseados em `@radix-ui/react-label`.
25. [`menubar.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/menubar.tsx) — Barra de menus persistente no padrão desktop baseada em `@radix-ui/react-menubar`.
26. [`navigation-menu.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/navigation-menu.tsx) — Menus de navegação ricos baseados em `@radix-ui/react-navigation-menu`.
27. [`pagination.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/pagination.tsx) — Componente de controle e exibição de páginas.
28. [`popover.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/popover.tsx) — Painel flutuante posicionado baseado em `@radix-ui/react-popover`.
29. [`progress.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/progress.tsx) — Barra de progresso visual baseada em `@radix-ui/react-progress`.
30. [`radio-group.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/radio-group.tsx) — Grupo de botões de rádio baseados em `@radix-ui/react-radio-group`.
31. [`resizable.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/resizable.tsx) — Painéis redimensionáveis baseados em `react-resizable-panels`.
32. [`scroll-area.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/scroll-area.tsx) — Barra de rolagem customizada baseada em `@radix-ui/react-scroll-area`.
33. [`select.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/select.tsx) — Campo select estilizado baseado em `@radix-ui/react-select`.
34. [`separator.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/separator.tsx) — Divisor horizontal ou vertical baseado em `@radix-ui/react-separator`.
35. [`sheet.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sheet.tsx) — Painel lateral deslizante baseado em `@radix-ui/react-dialog`.
36. [`sidebar.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sidebar.tsx) — Componente estrutural base de sidebar do shadcn.
37. [`skeleton.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/skeleton.tsx) — Placeholder animado para estados de carregamento.
38. [`slider.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/slider.tsx) — Controle deslizante baseado em `@radix-ui/react-slider`.
39. [`sonner.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sonner.tsx) — Provedor de notificações toast baseado em `sonner`.
40. [`switch.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/switch.tsx) — Interruptor alternador baseado em `@radix-ui/react-switch`.
41. [`table.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/table.tsx) — Tabelas com `TableHeader`, `TableBody`, `TableRow`, `TableCell`.
42. [`tabs.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/tabs.tsx) — Abas de navegação interna baseadas em `@radix-ui/react-tabs`.
43. [`textarea.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/textarea.tsx) — Campo de texto multilinha estilizado.
44. [`toast.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/toast.tsx) — Notificações em balão baseadas em `@radix-ui/react-toast`.
45. [`toaster.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/toaster.tsx) — Componente montador dos toasts Radix.
46. [`toggle-group.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/toggle-group.tsx) — Grupo de alternância baseado em `@radix-ui/react-toggle-group`.
47. [`toggle.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/toggle.tsx) — Botão de estado binário baseado em `@radix-ui/react-toggle`.
48. [`tooltip.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/tooltip.tsx) — Dica de contexto flutuante baseada em `@radix-ui/react-tooltip`.

---

## 3. Mapeamento de Componentes Compartilhados Destacados

### 3.1. Header e Barra Superior
* **Implementação Mobile:** Definido diretamente em [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L332-L345). É um header fixo (`sticky top-0 z-30`), com fundo translúcido `backdrop-blur`, botão de abertura de menu hamburguer com alvo de toque de 44×44px, logotipo vetorial centralizado e nome "Lovrary" na fonte Fraunces com cor Marsala.

### 3.2. Sidebar e Navegação Principal
* **Implementação:** [src/components/Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx).
* **Uso:** Presente na visualização geral da aplicação.
* **Comportamento Híbrido:**
  * No Desktop: barra lateral fixa que pode ser expandida (256px) ou recolhida em modo compacto (72px com ícones e tooltips).
  * No Mobile: gaveta deslizante (`z-50`) com sobreposição de fundo escurecido e bloqueio da rolagem do documento.
* **Badges Numéricos em Tempo Real:** Calcula dinamicamente o número exato de livros nas abas "Meu Acervo", "Lendo Agora", "Lista de Desejos" e "Registros de Leitura".

### 3.3. Cards de Livro (`BookCard`)
* **Implementação:** [src/components/BookCard.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx).
* **Utilizado em:**
  * Tela Inicial (grid de "Últimas Adições" no [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L120)).
  * Aba "Meu Acervo" (modo grade e modo agrupado por autor no [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L294)).
  * Aba "Lista de Desejos" ([Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L53)).
* **Detalhes Visuais & Acessibilidade:**
  * Proporção de aspecto 2/3 com lombada física (`book-spine-effect`).
  * Badges semânticos de status (`Lido`, `Lendo`, `Na Estante`, `Emprestado com Você`, `Abandonado`).
  * Alertas visuais de prazo de devolução para empréstimos.
  * Otimização com `loading="lazy"` nas capas e elevação em hover de 200ms via Framer Motion.

### 3.4. Modais Principais
* **`BookDetailModal`:**
  * Montado condicionalmente na raiz do [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L353) sempre que `selectedBook !== null`.
  * Isolamento de estado e rolagem, transição com `framer-motion` (`AnimatePresence`).
* **`AddBookModal`:**
  * Montado via [Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx#L210), disponível de forma global.
  * Baseado em [Dialog](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/dialog.tsx) do Radix UI.

### 3.5. Botões e Ações
* **Primitivo `Button`:** [src/components/ui/button.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/button.tsx) com foco acessível e variantes pré-estilizadas.
* **Botões de Ação com Gradiente Marsala:** Classes `.gradient-marsala text-primary-foreground` usadas para ações primárias de destaque (ex: "Adicionar Livro", "Salvar", botões de início de leitura).

### 3.6. Formulários e Campos de Busca
* **Busca no Acervo:** Input com ícone de lupa, botão de limpar busca (`X`) e resposta em tempo real via `useMemo` em [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L165-L183).
* **Busca na API Google Books:** Input com alternância entre modo Normal e modo Aprofundado, debounce e botão de carregar mais em [src/components/AddBookModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx#L52).
* **Busca no Seletor de Livro:** Campo de filtro rápido entre livros do acervo para iniciar leitura em [src/components/ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx#L58).

### 3.7. Elementos de Feedback e Tratamento de Exceções
* **Toasts:** Implementação dual:
  * [Sonner](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sonner.tsx) para toasts contextuais modernos e fluidos.
  * [Toaster](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/toaster.tsx) baseado no Radix Toast para notificações de sistema.
* **Diagnóstico de Falhas:** [AppErrorBoundary.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppErrorBoundary.tsx) captura quebras de renderização do React e renderiza a tela [AppStatusScreen.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppStatusScreen.tsx) com rastreamento da pilha e botão de recuperação.

