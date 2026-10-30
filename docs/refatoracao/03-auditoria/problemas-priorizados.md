# Matriz de Problemas Priorizados — Lovrary

> Classificação hierárquica e plano de ação detalhado para resolução de todos os problemas identificados nas auditorias visual, de UX e técnica do Lovrary.

---

## 1. Critérios de Classificação de Severidade

* **CRÍTICO:** Falha funcional, quebra de layout que impede o uso, erro de cálculo que desinforma o usuário ou trava de navegação.
* **ALTO:** Degradação severa da usabilidade, corte de informações essenciais, problemas graves de ergonomia móvel ou violações de contraste WCAG.
* **MÉDIO:** Inconsistência visual evidente, sobrecarga de elementos, duplicações de código ou problemas de performance no carregamento inicial.
* **BAIXO:** Ajuste fino cosmético, polimento estético de micro-interações ou limpeza de dependências não utilizadas.

---

## 2. Tabela Geral de Problemas Classificados

| ID | Severidade | Página / Componente | Arquivo Responsável | Evidência Observada | Impacto |
|:---:|:---:|---|---|---|---|
| **ISSUE-01** | **CRÍTICO** | Modal Detalhes do Livro (`BookDetailModal`) | [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) | [m05-modal-book-detail-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m05-modal-book-detail-mobile.png) | Layout quebrado no mobile: título do livro cortado na base da tela, abas de conteúdo invisíveis e barra de progresso calculando erroneamente 0% para livro 100% lido. |
| **ISSUE-02** | **CRÍTICO** | Catálogo Demo (`mockBooks.ts`) | [mockBooks.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/mockBooks.ts) | [06-acervo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-desktop.png) | Capas dos livros clássicos trocadas por IDs errôneos da Open Library (matemática para fantasia, livro espanhol para Rebecca) e imagem quebrada em "It". |
| **ISSUE-03** | **CRÍTICO** | Registros de Leitura (`StatsPage`) | [StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx#L13-L35) | [12-stats-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/12-stats-desktop.png) | Ano padrão fixo em 2026 exibe página com zeros ("0 lidos", gráfico vazio) enquanto a Sidebar indica 4 livros lidos (finalizados em 2025). Divisão por zero gera "0%". |
| **ISSUE-04** | **ALTO** | Meu Acervo (`Index.tsx` - Toolbar de Filtros) | [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L185-L272) | [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png) | 4 linhas empilhadas de filtros ocupam 45% do viewport mobile; presença de duas tags "Todos" idênticas coladas verticalmente. |
| **ISSUE-05** | **ALTO** | Notificações em Toast (`Sonner`) | [App.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/App.tsx#L3) / [Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx) | [m03-menu-drawer-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m03-menu-drawer-mobile.png) | O toast inferior bloqueia diretamente os botões de ação essenciais na base da gaveta móvel ("Sair do Modo Demo" e "Modo Noturno"). |
| **ISSUE-06** | **ALTO** | Hero Imersivo de Leitura (`ImmersiveReadingHero`) | [ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx) | [m02-dashboard-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m02-dashboard-mobile.png) | Capa gigante desproporcional no mobile empurrando os botões de ação e leitura para baixo da primeira dobra. |
| **ISSUE-07** | **ALTO** | Acessibilidade e Contraste WCAG | [JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx) / [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) | [08-journal-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/08-journal-desktop.png) | Botões desabilitados ou inativos com texto branco sobre rosa claro desbotado com contraste de 2.1:1 (reprovado pelo mínimo WCAG de 4.5:1). |
| **ISSUE-08** | **MÉDIO** | Preservar Acervo (`ExportPage`) | [ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx) | [15-exportar-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/15-exportar-desktop.png) | Estado inicial desértico (85% da tela em branco) e falta de controles visuais para exportação em CSV/JSON. |
| **ISSUE-09** | **MÉDIO** | Monolito de Código (`BookDetailModal.tsx`) | [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) | Código-fonte (1.757 linhas) | Componente com complexidade ciclomática excessiva misturando 4 abas, sub-modais de empréstimo/abandono e busca externa. |
| **ISSUE-10** | **MÉDIO** | Gestão de Estado Global (`BooksContext.tsx`) | [BooksContext.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx) | Código-fonte (1.060 linhas) | Contexto monolítico gigante re-renderiza toda a árvore a cada digitação de anotação ou atualização de página por falta de divisão em contextos especializados. |
| **ISSUE-11** | **MÉDIO** | Performance e Bundle Inicial | [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L11-L16) | Código-fonte | Importação síncrona estática de bibliotecas pesadas (`recharts`, `html-to-image`) sem Code-Splitting (`React.lazy`). |
| **ISSUE-12** | **BAIXO** | Alvos de Toque no Mobile (< 44px) | [ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx#L25) / [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L180) | [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png) | Inputs de página e botão de limpar busca com altura de 32px a 34px, dificultando o toque ágil com o polegar. |
| **ISSUE-13** | **BAIXO** | Inconsistência de Raios de Borda | Vários componentes | [02-dashboard-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop.png) | Mistura de `rounded-3xl`, `rounded-2xl`, `rounded-xl`, `rounded-lg` e `rounded-md` sem uma escala unificada. |

---

## 3. Detalhamento dos Problemas Críticos e Soluções Recomendadas

### ISSUE-01 — Redesign e Correção do `BookDetailModal` no Mobile
* **Arquivo Responsável:** [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)
* **Solução Recomendada (Padrão UI/UX Pro Max):**
  1. **Adoção do Primitivo `Drawer` (Vaul):** Em telas `< 768px`, substituir a caixa de diálogo flutuante por uma **Bottom Sheet deslizante** que ocupa até 90% da altura da tela, com barra de arraste superior para fechamento intuitivo com o polegar.
  2. **Reorganização Hierárquica da Folha Mobile:**
     * Colocar o Título, Autor, Status e Barra de Abas (Journal, Resenha, Citações, Info) no topo imediatamente visível da folha.
     * Permitir rolagem vertical apenas no corpo do conteúdo da aba ativa.
  3. **Correção do Bug de Porcentagem:**
     * Garantir que se `currentPage >= totalPages` e `totalPages > 0`, a porcentagem exiba sempre `100%`, nunca `0%`.

---

### ISSUE-02 — Correção e Padronização das Capas de Demonstração
* **Arquivo Responsável:** [src/data/mockBooks.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/mockBooks.ts)
* **Solução Recomendada:**
  * Substituir todos os IDs incorretos da Open Library por URLs de alta resolução legítimas de cada obra:
    * *O Nome do Vento* (Patrick Rothfuss) -> Capa brasileira ou clássica oficial.
    * *Rebecca* (Daphne du Maurier) -> Capa icônica da edição Intrínseca/Penguin.
    * *Circe* (Madeline Miller) -> Capa oficial dourada/preta.
    * *O Iluminado* (Stephen King) -> Capa oficial brasileira (Suma).
    * *Orgulho e Preconceito* (Jane Austen) -> Capa elegante Penguin Classics.
    * *It: A Coisa* (Stephen King) -> Capa oficial restaurada com protocolo HTTPS.

---

### ISSUE-03 — Resolução dos Registros de Leitura Vazios e Divisão por Zero
* **Arquivo Responsável:** [src/components/StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx)
* **Solução Recomendada:**
  1. **Detecção Inteligente do Ano Padrão:**
     * Em vez de fixar `new Date().getFullYear()` mesmo quando o ano atual não possui livros lidos, o estado inicial do `yearFilter` deve priorizar o ano mais recente que possua livros concluídos (`b.dateFinished`). Se 2026 não tem livros mas 2025 tem 4, a página abre automaticamente em 2025 com os gráficos preenchidos.
  2. **Proteção Contra Divisão por Zero:**
     * No cálculo de porcentagem por categoria (`readCount > 0 ? (count / readCount) * 100 : 0`), garantir retorno de fallback textual limpo quando o total for zero.

---

### ISSUE-04 — Simplificação e Unificação dos Filtros do Acervo
* **Arquivo Responsável:** [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx)
* **Solução Recomendada:**
  1. **Eliminar a Duplicação do Botão "Todos":**
     * Integrar o filtro de categoria diretamente na barra de status ou exibi-lo como um dropdown compacto ou sheet expansível no mobile.
  2. **Toolbar Compacto no Mobile:**
     * No mobile, condensar a busca e os filtros em uma única linha principal com um botão de filtro expansível (ícone de filtro com badge de filtros ativos). Isso devolve **240px de área útil** para o usuário visualizar as capas dos livros imediatamente.

---

### ISSUE-05 — Ajuste de Posicionamento e Z-Index dos Toasts
* **Arquivos Responsáveis:** [src/App.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/App.tsx) e [src/components/ui/sonner.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/sonner.tsx)
* **Solução Recomendada:**
  * Configurar o provedor `Sonner` para exibir toasts em `position="top-center"` no mobile (ou garantir `z-index: 40`, inferior aos menus modais ativos), permitindo que a base da tela e gaveta de navegação continuem operáveis sem obstáculos.

---

### ISSUE-09 e ISSUE-10 — Desacoplamento Arquitetural (Refatoração de Manutenibilidade)
* **Solução Recomendada:**
  1. **Modularização de `BookDetailModal`:**
     * Extrair as 4 abas em componentes isolados: `BookDetailJournal.tsx`, `BookDetailReview.tsx`, `BookDetailQuotes.tsx` e `BookDetailInfo.tsx`.
     * Extrair os sub-modais de empréstimo e abandono em arquivos dedicados (`BorrowBookModal.tsx` e `AbandonBookModal.tsx`).
  2. **Divisão de Contexto:**
     * Segregar os métodos de catálogo dos métodos de sessões de leitura (`ReadingSessionContext`), evitando re-renderizações desnecessárias em formulários de digitação.

