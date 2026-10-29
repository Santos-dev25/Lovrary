# Estrutura do Projeto — Lovrary

> Mapeamento técnico detalhado da arquitetura, diretórios, scripts e configurações do Lovrary.

---

## 1. Visão Geral da Arquitetura

O **Lovrary** é uma Single Page Application (SPA) moderna focada em organização de biblioteca pessoal, registro imersivo de leitura, journal reflexivo, metas e gamificação literária.

### Principais Pilares Arquiteturais
* **Core & Build:** [React 18.3.1](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L56) + [Vite 5.4.21](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L95) com plugin SWC ([@vitejs/plugin-react-swc](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L84)) e [TypeScript 5.8.3](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L93).
* **Estilização & Design System:** [Tailwind CSS 3.4.17](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/tailwind.config.ts) estendido com paleta literária exclusiva (Marsala, Cream, Gold, Warm Gray), tipografia curada ([Fraunces](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/index.css#L1) para títulos/serif e [Inter](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/index.css#L1) para corpo/numéricos), suporte nativo a Dark Mode e animações via [Framer Motion](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L51).
* **Componentes Primitivos:** [shadcn/ui](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/components.json) baseado em [Radix UI](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L17-L43) (acessibilidade WAI-ARIA, modais, tooltips, sheets, dropdowns, etc.).
* **Camada de Dados & Estado Global:** [React Context API](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx) ([`BooksContext`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx#L61)) com arquitetura híbrida resiliente: sincronização em tempo real com [Supabase](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/supabase.ts) e suporte completo a modo offline/convidado via `localStorage`.
* **APIs Externas & Backend Serverless:** Supabase Edge Function ([`google-books-search`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/supabase/functions/google-books-search/index.ts)) protegendo requisições com rate-limiting, com fallback client-side para a Google Books API.
* **Testes & Qualidade:** [Vitest 3.2.4](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/vitest.config.ts) com `@testing-library/react` para testes unitários/integração e [Playwright 1.57.0](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/playwright.config.ts) para testes E2E.

---

## 2. Scripts Disponíveis no `package.json`

Arquivo de referência: [package.json](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L6-L14)

| Script | Comando | Finalidade |
|---|---|---|
| `dev` | `vite` | Inicia o servidor local de desenvolvimento com HMR ultrarrápido (Vite). |
| `build` | `vite build` | Compila o bundle otimizado de produção em `dist/`. |
| `build:dev` | `vite build --mode development` | Executa a compilação do bundle em modo desenvolvimento (diagnósticos). |
| `lint` | `eslint .` | Analisa a qualidade do código TypeScript/React via ESLint 9 flat config. |
| `preview` | `vite preview` | Executa localmente o servidor de visualização dos arquivos gerados no `dist/`. |
| `test` | `vitest run` | Executa a suíte de testes unitários uma única vez via Vitest. |
| `test:watch` | `vitest` | Executa os testes no modo contínuo (watch mode). |

---

## 3. Árvore de Diretórios do Projeto

```
Lovrary/
├── .agents/                        # Configurações de agentes e skills (UI/UX Pro Max, Security, etc.)
│   └── skills/
│       ├── frontend-design/
│       ├── security-audit/
│       └── ui-ux-pro-max/
├── dist/                           # Artefatos gerados pelo build de produção
├── docs/                           # Documentações e relatórios técnicos
│   └── refatoracao/
│       └── 01-mapeamento/          # Documentos deste mapeamento
├── public/                         # Ativos estáticos públicos (favicon, robots, placeholder)
├── src/                            # Código-fonte principal da aplicação
│   ├── assets/                     # Imagens e logotipos locais (lovrary-logo.png)
│   ├── components/                 # Componentes React de negócio e páginas virtuais
│   │   └── ui/                     # Primitivos shadcn/ui baseados em Radix UI (48 componentes)
│   ├── context/                    # Contextos React (BooksContext.tsx)
│   ├── data/                       # Dados mock, catálogos estáticos e definições de skills
│   ├── hooks/                      # Custom hooks reutilizáveis (use-mobile, use-toast, useBooks)
│   ├── integrations/               # Clientes e tipos gerados de integrações
│   │   └── supabase/               # Cliente Supabase tipado e schema (types.ts, client.ts)
│   ├── lib/                        # Utilitários de integração e infra (googleBooks, supabase, utils)
│   ├── pages/                      # Páginas de alto nível do roteador (Auth, Index, NotFound)
│   ├── test/                       # Suíte de testes unitários e de integração (Vitest)
│   ├── utils/                      # Funções puras de lógica matemática (sessions.ts, stats.ts)
│   ├── App.css                     # Estilos complementares de layout
│   ├── App.tsx                     # Componente raiz, provedores e definição de rotas
│   ├── index.css                   # Definição de tokens de design, temas e utilitários Tailwind
│   ├── main.tsx                    # Ponto de entrada React DOM
│   └── vite-env.d.ts               # Declarações de ambiente Vite
├── supabase/                       # Infraestrutura e migrações do Supabase
│   ├── config.toml                 # Configuração de projeto Supabase
│   ├── functions/                  # Edge Functions Serverless Deno
│   │   └── google-books-search/    # Proxy seguro com rate limit para a API do Google Books
│   └── migrations/                 # Migrações SQL versionadas do banco de dados PostgreSQL
├── components.json                 # Configuração do gerador de componentes shadcn/ui
├── eslint.config.js                # Regras e plugins do ESLint 9 (Flat Config)
├── index.html                      # HTML de entrada da SPA
├── package.json                    # Dependências, metadados e scripts
├── playwright.config.ts            # Configurações de testes E2E Playwright
├── postcss.config.js               # Pipeline PostCSS (Tailwind e Autoprefixer)
├── tailwind.config.ts              # Configuração de temas, cores, fontes e keyframes
├── tsconfig.json                   # Configurações raiz do compilador TypeScript
├── tsconfig.app.json               # Configurações do compilador para a aplicação (src/)
├── tsconfig.node.json              # Configurações do compilador para scripts Node/Vite
└── vite.config.ts                  # Configuração do Vite e aliases de importação (@ -> src)
```

---

## 4. Estrutura Detalhada de `src/`

### 4.1. `src/pages/` (Páginas do Roteador)
* [`Auth.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx): Tela de autenticação completa (Login, Cadastro com validação de senha e redirecionamento, e botão de acesso direto como Convidado / Modo Demo).
* [`Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx): Orquestrador central da aplicação. Gerencia o estado de visualização ativo (`activeTab`), filtros de status, categoria, ordenação, busca em tempo real, alternância de tema Dark/Light e abertura do modal de detalhes do livro.
* [`NotFound.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/NotFound.tsx): Página 404 estilizada com botão de retorno seguro ao início.

### 4.2. `src/components/` (Componentes de Domínio)
* **Navegação & Estrutura:**
  * [`Sidebar.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx): Barra lateral de navegação com 11 destinos, contadores de livros em tempo real por status, botão de adição rápida de livros, alternância de tema noturno/diurno, logout e recolhimento responsivo.
  * [`LovraryLogo.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/LovraryLogo.tsx): Logotipo vetorial estilizado com livro aberto em tons Marsala e Dourado.
  * [`NavLink.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/NavLink.tsx): Utilitário de links com estado ativo.
* **Telas / Abas do Sistema (Sub-páginas montadas pelo `Index.tsx`):**
  * [`ImmersiveReadingHero.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx): Hero de topo da Dashboard com saudação de acordo com o horário, livro ativo em leitura, progresso, input rápido de atualização de página e métricas de ofensiva (streak).
  * [`ReaderSkillsSection.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx): Painel de Maestria & Skills com badges distribuídas em 4 tiers (Bronze, Prata, Ouro Nobre, Diamante Raro) e 4 categorias.
  * [`StatsPanel.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPanel.tsx): Resumo estatístico da Home (livros lidos no ano, páginas totais, progresso da meta, mini gráfico Recharts e histórico de leitura dos últimos 30 dias).
  * [`ReadingNow.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx): Gerenciador de leituras em andamento com barra de progresso, percentual, atualização rápida de página e modal seletor para iniciar a leitura de novos livros do acervo.
  * [`RecentActivity.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RecentActivity.tsx): Linha do tempo de atividades recentes (conclusões de livros, anotações criadas, avaliações atribuídas).
  * [`JournalPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx): Diário literário com seleção de livro em leitura, adição/edição de anotações por capítulo/página, atualização de progresso e feed em ordem cronológica reversa.
  * [`ReadingQueuePage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx): Fila de próximas leituras com controles de ordenação prioritária (subir/descer) e atalho para iniciar a leitura imediatamente.
  * [`ResenhasPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ResenhasPage.tsx): Mosaico de resenhas com avaliação por estrelas, contagem de anotações e citações.
  * [`MetasPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx): Planejamento anual de leitura com edição da meta numérica, cálculo de livros restantes e gráfico de evolução mês a mês.
  * [`StatsPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx): Página detalhada de Registros de Leitura com gráficos de barras mensais (Recharts), filtros por ano e categoria, distribuição percentual por gênero e médias.
  * [`ExportPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx): Central de preservação e compartilhamento de acervo (Exportação em CSV/JSON e gerador de cards sociais com download em PNG via `html-to-image`).
* **Cards & Filtros:**
  * [`BookCard.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx): Card de livro com visual realista de lombada (`book-spine-effect`), badge de status colorido, tags de empréstimo/prazo, indicador de notas e hover com elevação suave.
  * [`CategoryFilter.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/CategoryFilter.tsx): Carrossel horizontal de filtros por categoria/gênero.
  * [`RatingStars.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RatingStars.tsx): Componente reutilizável de avaliação por estrelas (interativo ou somente leitura) com suporte a fração de meio ponto e valores numéricos.
* **Modais Principais:**
  * [`BookDetailModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx): O modal mais complexo do projeto (~1.750 linhas). Contém 4 abas (Journal, Resenha, Citações, Informações), controle de status (Lendo, Lido, Abandonado, Emprestado, Na Estante), modal embutido de empréstimo, modal de abandono de livro, sub-avaliações por critério, tags de vibes, edição de gênero e carrossel de recomendações de livros similares usando a API do Google Books.
  * [`AddBookModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx): Modal de cadastro com 2 modalidades: Busca online via Google Books API (com paginação 'carregar mais', modo normal ou busca aprofundada) e Formulário Manual completo com campos de título, autor, páginas, categoria e capa.
* **Tratamento de Erros e Telas de Sistema:**
  * [`AppErrorBoundary.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppErrorBoundary.tsx): Error Boundary React que captura exceções de renderização e exibe diagnóstico visual amigável.
  * [`AppStatusScreen.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppStatusScreen.tsx): Tela unificada de carregamento, erros e status de sistema.
  * [`ProtectedRoute.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ProtectedRoute.tsx): Guarda de rota que verifica se o usuário possui sessão ativa no Supabase ou no Modo Convidado local antes de liberar a visualização principal.

### 4.3. `src/components/ui/` (Primitivos shadcn/ui)
Contém 48 primitivos encapsulando acessibilidade, comportamentos e temas:
`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle-group`, `toggle`, `tooltip`.

### 4.4. `src/context/` e `src/hooks/`
* [`BooksContext.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx): Contexto central que gerencia lista de livros, livro selecionado, anotações, sessões de leitura (`reading_sessions`), ofensiva (`streak`), ritmo de leitura (`readingPace`), fila de leitura, meta anual, modo guest e sincronização com banco.
* [`useBooks.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/hooks/useBooks.ts): Hook de consumo direto do contexto de livros.
* [`use-mobile.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/hooks/use-mobile.tsx): Hook responsivo que detecta se o viewport atual está abaixo do breakpoint móvel (768px).
* [`use-toast.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/hooks/use-toast.ts): Hook para controle programático dos toasts baseados em Radix.

### 4.5. `src/lib/`, `src/utils/` e `src/data/`
* [`googleBooks.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/googleBooks.ts): Cliente resiliente para pesquisa de livros. Possui sanitização de URLs para HTTPS, cache em memória com TTL de 24h, cache em `sessionStorage`, deduplicação de requisições concorrentes (In-Flight Caching) e limitação de taxa (10 req/10s).
* [`supabase.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/supabase.ts): Inicialização do cliente Supabase com checagem dinâmica de variáveis de ambiente (`isSupabaseConfigured`).
* [`utils.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/utils.ts): Função utilitária padrão `cn()` combinando `clsx` e `tailwind-merge`.
* [`sessions.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/utils/sessions.ts): Funções puras de cálculo de ofensiva (`calculateStreak`), histórico diário de páginas e estimativa de ritmo de leitura/dias para terminar livro.
* [`stats.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/utils/stats.ts): Funções puras para cálculo exato de páginas lidas (`calculateTotalPagesRead`) e prazos de devolução de livros emprestados (`getReturnDeadline`).
* [`mockBooks.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/mockBooks.ts): Tipos TypeScript centrais (`Book`, `BookNote`, `BookStatus`) e dados de demonstração para novos usuários.
* [`readerSkills.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/readerSkills.ts): Catálogo de 16 insígnias e motor de cálculo dinâmico de conquistas (`calculateReaderSkills`).

---

## 5. Configuração de Estilos e Design Tokens

* **Arquivo de Configuração:** [tailwind.config.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/tailwind.config.ts)
* **Arquivo CSS Global:** [src/index.css](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/index.css)
* **Tipografia:**
  * `font-display`: `"Fraunces", Georgia, serif` (utilizado para todos os títulos h1–h6, identidade poética e literária).
  * `font-body`: `"Inter", system-ui, sans-serif` (utilizado para o corpo de texto, botões e controles).
  * `font-numeric`: `"Inter"` com `tabular-nums` e `font-feature-settings: "tnum", "cv11"` para alinhamento contábil de páginas, anos e percentuais sem layout shift.
* **Tokens de Cor Semânticos:**
  * `marsala`: Cor primária da marca (`hsl(348 52% 30%)` no tema claro; `hsl(348 60% 62%)` no tema escuro).
  * `gold`: Cor de destaque e conquistas (`hsl(35 86% 33%)` claro; `hsl(38 90% 67%)` escuro).
  * `background` / `card`: Papel literário no tema claro (`hsl(30 25% 96%)` / `hsl(30 22% 99%)`) e madeira mogno escura no tema escuro (`hsl(350 16% 7%)` / `hsl(350 14% 11%)`).
* **Acessibilidade e Micro-interações:**
  * Respeito absoluto a `prefers-reduced-motion` no [index.css](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/index.css#L138-L148).
  * Efeito de lombada física de livro (`.book-spine-effect`) aplicado nas capas para sensação tátil e artesanal.

