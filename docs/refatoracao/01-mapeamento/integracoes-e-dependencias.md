# Integrações e Dependências — Lovrary

> Mapeamento completo dos serviços externos, bancos de dados, APIs, autenticação, camada serverless e dependências de pacotes do Lovrary.

---

## 1. Integração com o Supabase

O **Supabase** atua como a infraestrutura de Backend-as-a-Service (BaaS) do Lovrary, provendo banco de dados relacional PostgreSQL, autenticação gerenciada e computação serverless via Edge Functions.

### 1.1. Arquitetura de Inicialização e Conexão Híbrida
* **Arquivos Responsáveis:**
  * [src/lib/supabase.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/supabase.ts)
  * [src/integrations/supabase/client.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/integrations/supabase/client.ts)
  * [src/integrations/supabase/types.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/integrations/supabase/types.ts)
* **Validação Condicional de Ambiente:**
  A aplicação verifica dinamicamente se existem credenciais válidas configuradas no ambiente através da constante `isSupabaseConfigured`:
  ```typescript
  export const isSupabaseConfigured = Boolean(
    envUrl && envKey &&
    !envUrl.includes("seu-projeto") &&
    !envUrl.includes("placeholder")
  );
  ```
  Caso as credenciais não estejam presentes no `.env`, o cliente é instanciado em modo seguro de contingência e a aplicação redireciona automaticamente para o **Modo Convidado (Demo)** sem quebrar a execução ou emitir telas brancas.

### 1.2. Schema do Banco de Dados PostgreSQL
O schema é tipado de forma estrita em [src/integrations/supabase/types.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/integrations/supabase/types.ts) e versionado através das migrações SQL em `supabase/migrations/`:

| Tabela | Finalidade Principal | Colunas Chave |
|---|---|---|
| `books` | Catálogo de livros do usuário | `id`, `user_id`, `title`, `author`, `cover`, `category`, `vibes`, `ownership` (`tenho` \| `pretendo`), `status` (`nao-lido` \| `lendo` \| `lido` \| `emprestado` \| `abandonado`), `total_pages`, `current_page`, `rating`, `sub_ratings` (JSON), `quotes` (array text), `resenha`, `date_finished`, `borrowed_from`, `borrowed_to`, `borrowed_date`, `return_date`, `created_at`, `updated_at` |
| `journal_notes` | Diário de anotações e reflexões durante a leitura | `id`, `user_id`, `book_id` (FK `books.id`), `chapter`, `reaction`, `reaction_type`, `created_at` |
| `reading_sessions` | Registro de sessões de leitura individuais (alimenta streak e ritmo) | `id`, `user_id`, `book_id` (FK `books.id`), `session_date` (YYYY-MM-DD), `pages_read`, `start_page`, `end_page`, `duration_minutes`, `notes`, `created_at` |
| `reading_queue` | Fila de leitura ordenada (TBR) | `id`, `user_id`, `book_id` (FK `books.id`), `position` (integer), `created_at`, `updated_at` |
| `reading_goals` | Metas anuais de leitura | `id`, `user_id`, `year` (integer), `goal` (integer target), `created_at` |
| `profiles` | Perfil estendido do leitor | `id` (FK `auth.users.id`), `display_name`, `email`, `created_at`, `updated_at` |

### 1.3. Edge Function: `google-books-search`
* **Arquivo:** [supabase/functions/google-books-search/index.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/supabase/functions/google-books-search/index.ts)
* **Runtime:** Deno Serverless gerenciado pelo Supabase.
* **Finalidade:**
  * Ocultar eventuais chaves de API do Google Books e evitar exposição no frontend.
  * Proteção ativa contra abuso de requisições: implementa **Rate Limiting em memória por IP do cliente** (máximo de 15 buscas por minuto por IP).
  * Retorno do status HTTP `429 Too Many Requests` com cabeçalho `Retry-After` quando o limite é excedido.
  * Sanitização de parâmetros (`query`, `maxResults`, `startIndex`, `searchType`).
  * Cabeçalhos CORS flexíveis para integração com o cliente web.

---

## 2. Integração com a Google Books API

A busca de livros do Lovrary possui uma arquitetura de resiliência em camadas desenvolvida para contornar falhas de rede e limites de requisição da Google Books API.

* **Arquivo de Implementação:** [src/lib/googleBooks.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/lib/googleBooks.ts)

### 2.1. Arquitetura em Duas Camadas
1. **Camada Primária (Serverless):**
   Chama a Edge Function `google-books-search` através de `supabase.functions.invoke("google-books-search", { body: ... })`.
2. **Camada de Contingência (Client-Side Fallback):**
   Caso a Edge Function retorne erro ou o Supabase não esteja configurado, aciona automaticamente a busca direta via `fetch("https://www.googleapis.com/books/v1/volumes?...")`.

### 2.2. Mecanismos de Proteção e Resiliência
* **Cache em Memória com TTL:** `Map<string, { items: GoogleBookItem[]; timestamp: number }>` com tempo de expiração de 24 horas (`CACHE_TTL_MS`).
* **Cache em `sessionStorage`:** Permite que buscas recentes permaneçam instantâneas mesmo se o usuário recarregar a aba do navegador.
* **In-Flight Caching (Deduplicação de Requisições):** Se duas buscas idênticas forem disparadas simultaneamente, a segunda aguarda a mesma Promise da primeira, evitando chamadas duplicadas.
* **Rate Limiter no Cliente:** Janela deslizante de 10 segundos limitando a no máximo 10 requisições simultâneas.
* **Sanitização de Capas:** A função `sanitizeCoverUrl()` garante que apenas links com protocolo seguro HTTPS sejam aceitos, convertendo automaticamente URLs inseguras `http://` retornadas pela API do Google para `https://` para evitar bloqueios de conteúdo misto (*mixed content*).
* **Filtro de Busca Aprofundada (`searchType: "deep"`):** Utiliza expressões regulares para eliminar resumos comerciais, guias de estudo e apostilas de terceiros (ex: `summary of`, `study guide for`, `resumo de`).

---

## 3. Solução de CORS para Exportação de Imagens e Redes Sociais

* **Arquivo de Implementação:** [src/components/ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx#L13-L65)

Ao gerar imagens em PNG dos cards literários para download via biblioteca [html-to-image](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L52), qualquer imagem externa de capa que não forneça cabeçalhos `Access-Control-Allow-Origin: *` polui o elemento HTML `<canvas>` do navegador, gerando o erro de segurança *"Tainted Canvas"*.

O Lovrary contorna esse problema através de uma **estratégia tripla de conversão para Data URL Base64**:
1. **Tentativa Direta via Fetch CORS:** Dispara um `fetch(src, { mode: "cors" })` e converte o Blob para Data URL local via `FileReader`.
2. **Tentativa com Elemento Image e Canvas em Memória:** Cria um objeto `new Image()` com `crossOrigin = "anonymous"`, renderiza em canvas temporário e extrai o `canvas.toDataURL("image/png")`.
3. **Fallback com Proxy CDN Aberto:** Caso os dois passos anteriores falhem (comum em servidores de imagens do Google Books ou Open Library), o Lovrary redireciona a requisição através do proxy de imagens gratuito com CORS liberado `https://images.weserv.nl/?url=...`.

---

## 4. Gerenciamento de Estado Global: `BooksContext`

* **Arquivo de Implementação:** [src/context/BooksContext.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx)

O `BooksContext` unifica todos os estados da biblioteca em uma única camada de acesso para os componentes:

### 4.1. Principais Dados e Estados Gerenciados
* `books: Book[]`: Lista completa de livros cadastrados.
* `selectedBook: Book | null`: Livro selecionado atualmente para exibição ou edição no modal de detalhes.
* `readingQueue: string[]`: Array ordenado com os IDs dos livros da fila de leitura.
* `readingGoal: { year, target, current }`: Meta de leitura anual e progresso apurado.
* `readingSessions: ReadingSession[]`: Histórico cronológico das sessões de leitura diárias.
* `streak: StreakResult`: Métricas da ofensiva calculadas dinamicamente (`currentStreak`, `longestStreak`, `readToday`).
* `readingPace: ReadingPaceResult`: Ritmo de páginas lidas por dia e estimativa de conclusão.
* `isGuest: boolean`: Indica se a sessão atual está rodando em modo demonstração local.

### 4.2. Estratégia de Persistência Dual
* **Modo Autenticado (Supabase):** Qualquer mutação (`addBook`, `updateBook`, `deleteBook`, `addNote`, `recordReadingSession`, etc.) executa imediatamente a mutação no banco PostgreSQL via cliente Supabase e reflete o estado na UI.
* **Modo Convidado / Demo (`localStorage`):** Quando em modo convidado, todas as mutações são serializadas e gravadas nas chaves `lovrary_guest_books`, `lovrary_guest_goal`, `lovrary_guest_sessions` e `lovrary_queue` no `localStorage` do navegador, proporcionando experiência 100% funcional mesmo sem conexão de banco.

---

## 5. Inventário de Dependências de Pacotes (`package.json`)

Arquivo de referência: [package.json](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L15-L97)

### 5.1. Dependências de Produção (`dependencies`)

| Pacote | Versão | Finalidade no Projeto |
|---|---|---|
| `react` / `react-dom` | `^18.3.1` | Biblioteca central de interface e renderização DOM. |
| `react-router-dom` | `^6.30.6` | Roteamento declarativo de páginas (`/auth`, `/`, `*`). |
| `@supabase/supabase-js` | `^2.104.1` | Cliente SDK do Supabase (Auth, PostgreSQL, Edge Functions). |
| `@tanstack/react-query` | `^5.83.0` | Gerenciamento assíncrono de dados e cache de requisições. |
| `tailwindcss` | `^3.4.17` | Framework CSS utilitário para estilização e design tokens. |
| `tailwindcss-animate` | `^1.0.7` | Animações CSS utilitárias para acordeões e transições de tela. |
| `framer-motion` | `^11` | Animações de entrada, transições de cards, modais e feedback táctil. |
| `recharts` | `^2.15.4` | Biblioteca de gráficos SVG para registros mensais de leitura e metas. |
| `lucide-react` | `^0.462.0` | Biblioteca completa de ícones vetoriais em SVG. |
| `html-to-image` | `^1.11.13` | Renderização e conversão de nós DOM para imagens PNG para download. |
| `sonner` | `^1.7.4` | Notificações em toast modernas, empilháveis e fluidas. |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^2.6.0` | Mesclagem condicional inteligente de classes Tailwind sem conflitos (`cn`). |
| `class-variance-authority` | `^0.7.1` | Criação de variantes de estilo tipadas para componentes shadcn/ui. |
| `date-fns` | `^3.6.0` | Utilitários modernos para cálculo e manipulação de datas. |
| `zod` | `^3.25.76` | Validação de schemas e tipagem estrita de formulários. |
| `react-hook-form` / `@hookform/resolvers` | `^7.61.1` / `^3.10.0` | Gerenciamento de formulários performático e sem re-renderizações excessivas. |
| `cmdk` | `^1.1.1` | Primitivo para paletas de comando e buscas acessíveis. |
| `embla-carousel-react` | `^8.6.0` | Motor de carrossel tátil com suporte a toque e swipe. |
| `vaul` | `^0.9.9` | Primitivo de gavetas móveis inferiores com física realista. |
| `next-themes` | `^0.3.0` | Suporte e sincronização de temas (Light/Dark). |
| `react-day-picker` | `^8.10.1` | Componente de calendário para seleção de datas. |
| `react-resizable-panels` | `^2.1.9` | Painéis com divisores arrastáveis e redimensionáveis. |
| `input-otp` | `^1.4.2` | Campo de entrada formatado para códigos de verificação de um único uso. |
| **Primitivos Radix UI** (`@radix-ui/react-*`) | `^1.x` - `^2.x` | Coleção de 26 primitivos de acessibilidade (Dialog, Dropdown, Tooltip, etc.). |

### 5.2. Dependências de Desenvolvimento (`devDependencies`)

| Pacote | Versão | Finalidade no Projeto |
|---|---|---|
| `vite` | `^5.4.21` | Ferramenta de build, dev server com HMR e empacotamento de assets. |
| `@vitejs/plugin-react-swc` | `^3.11.0` | Compilador SWC ultrarrápido para React e TypeScript no Vite. |
| `typescript` | `^5.8.3` | Verificação estática de tipos. |
| `eslint` / `typescript-eslint` | `^9.32.0` / `^8.38.0` | Linter com regras estritas para código limpo e padrões de Hooks. |
| `vitest` | `^3.2.4` | Test runner rápido e nativo do ecossistema Vite para testes unitários. |
| `@testing-library/react` | `^16.0.0` | Utilitários para teste de componentes React simulando comportamento do usuário. |
| `@testing-library/jest-dom` | `^6.6.0` | Matchers customizados do DOM para asserções do Vitest. |
| `jsdom` | `^20.0.3` | Implementação do ambiente DOM em JavaScript puro para execução de testes. |
| `@playwright/test` | `^1.57.0` | Framework para automação e execução de testes E2E em navegadores reais. |
| `postcss` / `autoprefixer` | `^8.5.6` / `^10.4.21` | Processamento CSS e adição automática de prefixos de compatibilidade. |
| `@tailwindcss/typography` | `^0.5.16` | Plugin oficial do Tailwind para formatação estilizada de textos longos (`prose`). |

