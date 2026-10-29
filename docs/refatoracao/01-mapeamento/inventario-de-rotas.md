# Inventário de Rotas e Telas — Lovrary

> Mapeamento completo e comprovado no código de todas as rotas públicas, rotas protegidas, páginas virtuais (abas de aplicação) e modais principais do Lovrary.

---

## 1. Rotas de Nível de Aplicação (React Router DOM)

Arquivo de roteamento raiz: [src/App.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/App.tsx#L23-L27)

```tsx
<Routes>
  <Route path="/auth" element={<Auth />} />
  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 1.1. `/auth` — Autenticação e Entrada
* **URL:** `/auth`
* **Arquivo Responsável:** [src/pages/Auth.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx)
* **Componentes Utilizados:**
  * [LovraryLogo](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/LovraryLogo.tsx)
  * Ícones Lucide (`BookOpen`, `Mail`, `Lock`, `Loader2`, `User`, `Sparkles`)
  * `toast` via [Sonner](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sonner.tsx)
* **Funcionalidade Principal:**
  * Login com email e senha via Supabase Auth.
  * Cadastro de novos usuários com validação mínima de 6 caracteres na senha e `displayName`.
  * Redirecionamento automático caso já exista sessão ativa.
  * **Modo Demonstração (Convidado):** Botão "Entrar como Convidado (Modo Demo)" que grava `lovrary_guest_session` no `localStorage` e direciona imediatamente para a aplicação sem necessidade de conta ou backend.
* **Serviços e Dados Utilizados:**
  * `supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.getSession` em [src/lib/supabase.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/supabase.ts).
  * `loginAsGuest` via [BooksContext](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx#L20).
* **Dependência de Autenticação:** **Rota Pública**. Redireciona para `/` se já autenticado.

---

### 1.2. `/` — Aplicação Principal (Biblioteca & Hub Literário)
* **URL:** `/`
* **Arquivo Responsável:** [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx) envelopado por [ProtectedRoute.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ProtectedRoute.tsx)
* **Componentes Utilizados:**
  * [Sidebar](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx) (desktop e gaveta mobile)
  * [LovraryLogo](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/LovraryLogo.tsx)
  * [BookDetailModal](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) (modal global acionado por livro selecionado)
  * Sub-páginas renderizadas dinamicamente pelo estado `activeTab` (detalhadas na Seção 2).
* **Funcionalidade Principal:** Hub central da experiência de leitura. Gerencia a exibição da tela ativa, controles globais de busca, filtros de status, filtros de categoria, ordenações e o modal de detalhes do livro.
* **Serviços e Dados Utilizados:** `BooksContext` (todos os livros, livro ativo, modo de convidado, funções de mutação).
* **Dependência de Autenticação:** **Rota Protegida**. Redireciona para `/auth` se o usuário não possuir sessão no Supabase e nem estiver em Modo Convidado.

---

### 1.3. `*` — Página de Destino Desconhecido (404)
* **URL:** Qualquer caminho não mapeado (ex: `/teste`, `/livro/123`)
* **Arquivo Responsável:** [src/pages/NotFound.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/NotFound.tsx)
* **Componentes Utilizados:**
  * [LovraryLogo](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/LovraryLogo.tsx)
  * Ícones Lucide (`Compass`, `ArrowLeft`)
  * Botão de navegação de volta para `/`
* **Funcionalidade Principal:** Exibe mensagem amigável de página não encontrada, preservando a identidade visual da aplicação.
* **Serviços e Dados Utilizados:** `react-router-dom` (`useNavigate`).
* **Dependência de Autenticação:** **Pública**.

---

## 2. Visões e Sub-Páginas Internas (Abas de Aplicação)

Na rota `/`, o [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L100-L150) opera como um gerenciador de rotas virtuais/abas através do estado `activeTab`, acionado pela [Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx#L23-L35).

Abaixo está o inventário de cada uma das 11 abas existentes:

| Aba (`activeTab`) | Nome na Barra | Componente Primário | Finalidade & Recursos |
|---|---|---|---|
| `dashboard` | Início | [ImmersiveReadingHero](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx), [ReaderSkillsSection](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx), [StatsPanel](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPanel.tsx), [ReadingNow](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx), [RecentActivity](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RecentActivity.tsx) | Painel central: livro em leitura no topo, ofensiva diária, ritmo, resumo de metas, leituras ativas, feed de atividades recentes e grid de últimas adições. |
| `acervo` | Meu Acervo | [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L152-L315) + [BookCard](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx) + [CategoryFilter](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/CategoryFilter.tsx) | Catálogo completo dos livros do usuário (`ownership === 'tenho'`). Suporta busca com botão de limpar, filtros por status com contadores (`todos`, `nao-lido`, `lendo`, `lido`, `emprestado`, `abandonado`), filtro dinâmico de gêneros, alternância entre visualização em Grade ou Agrupado por Autor, e 7 opções de ordenação. |
| `lendo` | Lendo Agora | [ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx#L129-L135) (`fullView`) | Foco exclusivo em todos os livros atualmente com status `lendo`. Permite atualizar páginas em tempo real e abrir modal para escolher novo livro para iniciar leitura. |
| `journal` | Journal | [JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx) | Diário de anotações e reflexões durante a leitura. Permite alternar entre os livros em leitura, redigir anotações por capítulo/página, editar registros inline, atualizar página e visualizar o histórico de notas em ordem cronológica reversa. |
| `skills` | Maestria & Skills | [ReaderSkillsSection.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx) | Sistema de gamificação literária. Apresenta o nível de leitor, total de insígnias desbloqueadas e 16 badges calculadas dinamicamente agrupadas em 4 tiers: Bronze, Prata, Ouro Nobre e Diamante Raro. |
| `wishlist` | Lista de Desejos | [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L53) + [BookCard](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx) | Vitrine dos livros marcados com `ownership === 'pretendo'`. Permite buscar, filtrar e abrir os detalhes para converter em livro do acervo próprio (`moveToAcervo`). |
| `fila` | Próxima Leitura | [ReadingQueuePage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx) | Lista ordenada de prioridades para próximas leituras. Permite reordenar itens com botões de subir/descer ([`ArrowUp`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx#L52)/[`ArrowDown`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx#L59)), remover da fila ou iniciar a leitura com 1 clique. |
| `stats` | Registros de Leitura | [StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx) | Painel aprofundado de analytics. Gráficos de barras por mês no ano (Recharts), seletor de ano histórico, filtro por categoria, melhor mês do ano, total de páginas lidas, média de avaliação e distribuição de leituras por gênero. |
| `metas` | Metas | [MetasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx) | Definição da meta de leitura do ano corrente, percentual atingido, livros restantes para a meta, gráfico de barras da distribuição mês a mês e cards informativos. |
| `resenhas` | Resenhas | [ResenhasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ResenhasPage.tsx) | Mapeamento de todos os livros que possuem resenha escrita ou anotações cadastradas. Exibe card com capa, nota por estrelas, trecho da resenha, contador de anotações e citações. |
| `exportar` | Preservar Acervo | [ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx) | Central de backup e cards sociais. Exportação completa do acervo em formato CSV ou JSON. Gerador de cards visuais para compartilhamento em redes sociais com download automático em PNG (utilizando `html-to-image` e contorno de CORS para capas de livros). |

---

## 3. Modais e Drawers de Interação Crítica

Estes componentes atuam como sobreposições estruturais e operam como telas contextuais:

### 3.1. Modal de Detalhes do Livro (`BookDetailModal`)
* **Arquivo:** [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)
* **Gatilho:** Clique em qualquer [BookCard](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx) ou via chamada direta a `setSelectedBook(book)`.
* **Sub-Aba 1 (Journal):** Feed de notas do livro com data, hora e capítulo; input para nova anotação.
* **Sub-Aba 2 (Resenha):** Texto de resenha crítica com modo de edição, avaliação por estrelas principal e sub-avaliações por critério (ex: Enredo, Personagens, Escrita).
* **Sub-Aba 3 (Citações):** Cadastro e exclusão de trechos e frases marcantes do livro.
* **Sub-Aba 4 (Info & Edição):** Atualização do total de páginas, página atual, gênero/categoria com inclusão de gênero customizado, tags de "vibe" da leitura e carrossel de 4 recomendações de livros similares usando a API do Google Books.
* **Ações de Status:** Botão de iniciar leitura, marcar como lido, devolver livro emprestado, abrir modal de empréstimo (com campos "Para quem", data e prazo) e abrir modal de abandono de livro (com página em que parou).

### 3.2. Modal de Adicionar Livro (`AddBookModal`)
* **Arquivo:** [src/components/AddBookModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx)
* **Gatilho:** Botão "Adicionar Livro" na Sidebar fixa ou na versão mobile.
* **Modo Busca Online:** Input de busca com requisição para a Edge Function / Google Books API, paginação dinâmica ("Carregar mais"), alternância entre busca Normal e Aprofundada (eliminando resumos/guias) e botões de adicionar diretamente como "Tenho" (Acervo) ou "Pretendo" (Lista de Desejos).
* **Modo Cadastro Manual:** Formulário completo para livros raros, independentes ou sem registro ISBN (Título, Autor, Total de páginas, Categoria e URL de Capa).

### 3.3. Seletor de Livro para Iniciar Leitura (`ReadingNow Picker`)
* **Arquivo:** [src/components/ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx#L38-L90)
* **Gatilho:** Botão "Adicionar Leitura" na visualização `lendo` ou quando não há livros em leitura.
* **Funcionalidade:** Modal com busca em tempo real entre todos os livros que pertencem ao acervo do usuário que não estão sendo lidos no momento, permitindo iniciar a leitura imediatamente com 1 clique.

### 3.4. Gaveta Mobile de Navegação (`Sidebar Mobile Drawer`)
* **Arquivo:** [src/components/Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx#L79-L112)
* **Gatilho:** Botão de menu hamburguer ([`Menu`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L338)) no cabeçalho sticky mobile.
* **Funcionalidade:** Gaveta deslizante lateral com bloqueio de rolagem do body (`overflow: hidden`), logotipo, botão de novo livro, links das 11 abas com badges de contagem e botão de logout.

