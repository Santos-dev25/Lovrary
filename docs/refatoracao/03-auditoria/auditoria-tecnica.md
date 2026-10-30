# Auditoria Técnica e de Front-End — Lovrary

> Auditoria de arquitetura de software, padrões de código React, gestão de estado, performance e manutenibilidade do Lovrary.

---

## 1. Arquitetura de Componentes e Monolitos

### 1.1. O Monolito `BookDetailModal.tsx` (1.757 Linhas)
* **Arquivo:** [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)
* **Diagnóstico Técnico:**
  * O arquivo acumula **1.757 linhas de código** em um único componente funcional React.
  * Viola diretamente o **Princípio da Responsabilidade Única (SRP)** ao concentrar em um único arquivo:
    1. Renderização e controle de 4 abas completas (Journal, Resenha, Citações e Ficha Técnica).
    2. Estados locais para criação, edição e exclusão de anotações.
    3. Estados locais para sub-avaliações por critérios dinâmicos e tags de vibe.
    4. Lógica de busca de recomendações de livros na Google Books API com timeout, cancelamento e fallback local.
    5. Sub-modais aninhados de empréstimo de livro e registro de abandono com inputs de data e páginas.
    6. Mutações diretas no banco de dados através de 18 métodos importados do `BooksContext`.
* **Impacto na Manutenibilidade:** Qualquer ajuste cosmético em uma aba ou campo pode introduzir quebras nas demais áreas do modal. O tempo de leitura e refatoração é excessivo e a escrita de testes unitários torna-se proibitiva.

### 1.2. O Monolito de Estado `BooksContext.tsx` (1.060 Linhas)
* **Arquivo:** [src/context/BooksContext.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx)
* **Diagnóstico Técnico:**
  * Concentra toda a lógica de negócio do sistema: catálogo de livros, fila de leitura, sessões diárias, ofensiva (streak), ritmo (pace), metas anuais, notas de diário, autenticação de convidado e chamadas Supabase.
  * O objeto retornado no `value` do contexto possui **30 propriedades e métodos**.
  * **Problema de Performance:** Como todos os componentes consomem o mesmo `BooksContext`, **qualquer digitação de nota, atualização de página ou mudança de filtro dispara a re-renderização em cascata de toda a árvore de componentes** consumidora de `useBooks` (Sidebar, Hero, Acervo, StatsPanel, etc.).
  * **Recomendação (Stack React Guidelines):** Dividir o contexto em domínios isolados:
    * `CatalogContext` (livros, categorias, filtros)
    * `ReadingSessionContext` (progresso, sessões, streak, pace)
    * `GoalContext` (metas anuais e conquistas)

---

## 2. Reutilização de Código e Duplicação

### 2.1. Duplicação de Formulários e Inputs de Progresso
* **Ocorrências:**
  * [ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx#L25-L53)
  * [ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx#L28-L36)
  * [JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx#L62-L68)
  * [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx#L34)
* **Diagnóstico:** Cada um desses 4 componentes implementa independentemente sua própria lógica de:
  `input de texto -> parseInt -> Math.min(page, totalPages) -> updateProgress() -> toast feedback`.
  Caso a regra de validação mude (por exemplo, impedir páginas negativas ou recalcular streak), é necessário alterar os 4 arquivos individualmente.

### 2.2. Duplicação de Lógica de Formatação e Contadores
* **Ocorrências:**
  * O cálculo de livros concluídos por mês e ano é implementado de forma repetida em [StatsPanel.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPanel.tsx#L41-L48), [StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx#L43-L50) e [MetasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx#L18-L25).
  * Essa triplicação causou o bug onde o `StatsPanel` exibe o total correto, enquanto o `StatsPage` exibe 0 livros lidos por divergir na variável de ano padrão.

---

## 3. Performance, Carregamento e Bundle Size

### 3.1. Ausência de Code-Splitting e Lazy Loading nas Abas
* **Arquivo:** [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L1-L16)
* **Diagnóstico:**
  O `Index.tsx` importa estaticamente no topo do arquivo todos os componentes de abas e páginas:
  ```typescript
  import JournalPage from "@/components/JournalPage";
  import ReadingQueuePage from "@/components/ReadingQueuePage";
  import ResenhasPage from "@/components/ResenhasPage";
  import MetasPage from "@/components/MetasPage";
  import StatsPage from "@/components/StatsPage";
  import ExportPage from "@/components/ExportPage";
  ```
  Isso força o carregamento imediato de bibliotecas pesadas como **Recharts** (gráficos SVG) e **html-to-image** (conversão DOM para Canvas) logo na carga inicial da Home, prejudicando o *Time to Interactive (TTI)* e o *Largest Contentful Paint (LCP)*.
* **Solução:** Utilizar `React.lazy()` e `Suspense` para carregar as abas pesadas (`StatsPage`, `ExportPage`) apenas quando o usuário clicar nelas.

### 3.2. Carregamento de Imagens sem Tratamento de Resolução
* **Arquivo:** [src/components/BookCard.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx#L44-L49)
* **Diagnóstico:** As imagens de capa do Google Books são requisitadas com seus tamanhos originais sem parâmetros de otimização de largura/altura ou formato moderno (WebP). O componente adiciona `loading="lazy"`, mas não reserva dimensões explícitas de `aspect-ratio` no container da imagem pai, podendo provocar micro-deslocamentos de layout (*Cumulative Layout Shift - CLS*).

---

## 4. Análise de Dependências e Utilização de Pacotes

* **Arquivo:** [package.json](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L15-L68)

| Pacote Instalado | Status de Uso | Avaliação Técnica |
|---|:---:|---|
| `@radix-ui/react-*` (26 pacotes) | **Parcialmente Utilizado** | Mais de 10 primitivos instalados (`menubar`, `input-otp`, `hover-card`, `resizable`, `context-menu`) não possuem utilização em nenhum ponto do código de negócio. |
| `html-to-image` | **Ativo** | Essencial para o gerador de cards sociais, porém deve ser carregado sob demanda via dynamic import. |
| `recharts` | **Ativo** | Utilizado em gráficos mensais, mas gera peso significativo no bundle inicial. |
| `framer-motion` | **Ativo** | Utilizado para transições de entrada de cards e modais. Necessário cuidar para respeitar rigorosamente `prefers-reduced-motion`. |
| `vaul` | **Subutilizado** | Instalado no projeto (`src/components/ui/drawer.tsx`), mas **não foi utilizado nos modais principais** (`BookDetailModal` e `AddBookModal`), exatamente onde sua aplicação como Bottom Sheet móvel resolveria as graves quebras de usabilidade observadas. |

---

## 5. Manutenibilidade e Cobertura de Testes

* **Testes Existentes:** A pasta [src/test/](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/test/) possui excelente cobertura para funções utilitárias puras:
  * `stats.test.ts` (cálculo de páginas lidas e devolução de empréstimos)
  * `sessions.test.ts` e `sessionScenario.test.ts` (cálculo de ofensiva/streak e ritmo de leitura)
  * `rateLimit.test.ts` (janela deslizante do cliente Google Books)
  * `acervoSorting.test.ts` (critérios de ordenação)
* **Lacuna Crítica de Testes:** **0% de cobertura de testes de componentes React** (nenhum teste para `BookDetailModal`, `AddBookModal`, `Index.tsx` ou `BooksContext.tsx`), permitindo que regressões visuais e quebras de interação em modais passem despercebidas até a inspeção manual.

