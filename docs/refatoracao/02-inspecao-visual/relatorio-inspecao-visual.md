# Relatório de Inspeção Visual Completa — Lovrary

> Inspeção visual automatizada e sensorial realizada em Desktop (1440×900) e Mobile (390×844) em todas as rotas e componentes identificados no inventário.

---

## 1. Resumo Executivo

* **Ambiente de Teste:** Servidor local Vite (`http://localhost:8080/`) executado com Google Chrome headless via Playwright.
* **Resoluções Inspecionadas:** Desktop (1440×900) e Mobile (390×844 - iPhone 14/15 profile).
* **Total de Screenshots Capturados:** **39 imagens** organizadas na pasta [docs/refatoracao/02-inspecao-visual/screenshots/](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/).
* **Overlow Horizontal Detectado:** 0 páginas com transbordamento (`scrollWidth <= windowWidth`).
* **Erros de Console Registrados:** 6 ocorrências (status HTTP 429 de rate-limiting em chamadas sucessivas na API de livros e logs esperados de rota 404).

---

## 2. Inventário de Telas Inspecionadas e Screenshots

| Página / Rota | Resolução | Screenshot de Referência | Status de Navegação |
|---|---|---|---|
| **Autenticação (Auth)** | 1440×900 | [01-auth-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/01-auth-desktop.png) | Acessível |
| **Início (Dashboard - Light)** | 1440×900 | [02-dashboard-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop.png) / [Full](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop-full.png) | Acessível via Demo |
| **Início (Dashboard - Dark)** | 1440×900 | [03-dashboard-dark-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/03-dashboard-dark-desktop.png) | Acessível |
| **Modal Adicionar Livro** | 1440×900 | [04-modal-add-book-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/04-modal-add-book-desktop.png) | Acessível |
| **Modal Detalhes - Journal** | 1440×900 | [05-modal-book-detail-journal-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/05-modal-book-detail-journal-desktop.png) | Acessível |
| **Modal Detalhes - Resenha** | 1440×900 | [05-modal-book-detail-resenha-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/05-modal-book-detail-resenha-desktop.png) | Acessível |
| **Modal Detalhes - Citações** | 1440×900 | [05-modal-book-detail-quotes-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/05-modal-book-detail-quotes-desktop.png) | Acessível |
| **Modal Detalhes - Ficha Técnica** | 1440×900 | [05-modal-book-detail-info-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/05-modal-book-detail-info-desktop.png) | Acessível |
| **Meu Acervo (Grid Geral)** | 1440×900 | [06-acervo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-desktop.png) | Acessível |
| **Meu Acervo (Busca em Tempo Real)** | 1440×900 | [06-acervo-search-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-search-desktop.png) | Acessível |
| **Meu Acervo (Filtro 'Lidos')** | 1440×900 | [06-acervo-filter-lidos-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-filter-lidos-desktop.png) | Acessível |
| **Meu Acervo (Agrupado por Autor)** | 1440×900 | [06-acervo-group-author-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-group-author-desktop.png) | Acessível |
| **Lendo Agora** | 1440×900 | [07-lendo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/07-lendo-desktop.png) | Acessível |
| **Journal** | 1440×900 | [08-journal-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/08-journal-desktop.png) | Acessível |
| **Maestria & Skills** | 1440×900 | [09-skills-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/09-skills-desktop.png) | Acessível |
| **Lista de Desejos (Wishlist)** | 1440×900 | [10-wishlist-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/10-wishlist-desktop.png) | Acessível |
| **Próxima Leitura (Fila TBR)** | 1440×900 | [11-fila-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/11-fila-desktop.png) | Acessível |
| **Registros de Leitura (Stats)** | 1440×900 | [12-stats-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/12-stats-desktop.png) | Acessível |
| **Metas de Leitura** | 1440×900 | [13-metas-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/13-metas-desktop.png) | Acessível |
| **Resenhas** | 1440×900 | [14-resenhas-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/14-resenhas-desktop.png) | Acessível |
| **Preservar Acervo (Exportar)** | 1440×900 | [15-exportar-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/15-exportar-desktop.png) | Acessível |
| **Rota 404 (NotFound)** | 1440×900 | [16-404-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/16-404-desktop.png) | Acessível |
| **Auth Mobile** | 390×844 | [m01-auth-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m01-auth-mobile.png) | Acessível |
| **Dashboard Mobile** | 390×844 | [m02-dashboard-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m02-dashboard-mobile.png) / [Full](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m02-dashboard-mobile-full.png) | Acessível |
| **Gaveta de Navegação Mobile** | 390×844 | [m03-menu-drawer-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m03-menu-drawer-mobile.png) | Acessível |
| **Meu Acervo Mobile** | 390×844 | [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png) | Acessível |
| **Modal Detalhes Mobile** | 390×844 | [m05-modal-book-detail-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m05-modal-book-detail-mobile.png) | Acessível |
| **Modal Adicionar Livro Mobile** | 390×844 | [m06-modal-add-book-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m06-modal-add-book-mobile.png) | Acessível |
| **Lando Agora Mobile** | 390×844 | [m07-lendo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m07-lendo-mobile.png) | Acessível |
| **Journal Mobile** | 390×844 | [m08-journal-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m08-journal-mobile.png) | Acessível |
| **Maestria & Skills Mobile** | 390×844 | [m09-skills-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m09-skills-mobile.png) | Acessível |
| **Próxima Leitura Mobile** | 390×844 | [m10-fila-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m10-fila-mobile.png) | Acessível |
| **Registros de Leitura Mobile** | 390×844 | [m11-stats-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m11-stats-mobile.png) | Acessível |
| **Metas Mobile** | 390×844 | [m12-metas-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m12-metas-mobile.png) | Acessível |
| **Resenhas Mobile** | 390×844 | [m13-resenhas-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m13-resenhas-mobile.png) | Acessível |
| **Preservar Acervo Mobile** | 390×844 | [m14-exportar-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m14-exportar-mobile.png) | Acessível |
| **NotFound Mobile** | 390×844 | [m15-404-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m15-404-mobile.png) | Acessível |

---

## 3. Problemas Visuais Encontrados

### 3.1. Inconsistência Severa nas Capas de Livros de Demonstração (Mock Data)
* **Evidência:** Visível em [06-acervo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-desktop.png) e [02-dashboard-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop.png).
* **Diagnóstico:** As URLs de capas cadastradas no `mockBooks.ts` apontam para IDs arbitrários ou incorretos da Open Library:
  * *"O Nome do Vento"* exibe a capa de *"The Mathematical Experience"*.
  * *"Rebecca"* exibe a capa *"Historia del mundo para rebeldes y sonámbulos"*.
  * *"Circe"* exibe a capa *"Mastery / Robert Greene"*.
  * *"O Iluminado"* exibe a capa *"Paradise Planned"*.
  * *"It: A Coisa"* possui URL com falha de carregamento, resultando em card em branco.
* **Impacto:** Destrói a imersão poética e literária da aplicação logo no primeiro contato.

### 3.2. Poluição e Duplicação de Filtros em "Meu Acervo"
* **Evidência:** Visível em [06-acervo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-desktop.png) e [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png).
* **Diagnóstico:** A tela apresenta duas fileiras consecutivas de pílulas com visual idêntico:
  * Linha 1 (Status): `Todos (6)`, `Na Estante (0)`, `Lendo (2)`, `Lidos (4)`...
  * Linha 2 (Categorias): `Todos`, `Autoajuda`, `Biografia`, `Fantasia`...
  * Há dois botões chamados **"Todos"** empilhados diretamente um sobre o outro com o mesmo fundo Marsala.
* **Impacto Mobile Crítico:** No smartphone (390px), as 4 linhas de controles (Busca + Filtro de Status + Filtro de Categoria + Barra Grade/Autor/Ordenação) consomem **380px da altura de 844px** (~45% do viewport), forçando o usuário a rolar antes mesmo de conseguir visualizar um único livro.

### 3.3. Hero de Leitura Desproporcional no Mobile
* **Evidência:** Visível em [m02-dashboard-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m02-dashboard-mobile.png).
* **Diagnóstico:** A capa do livro no componente `ImmersiveReadingHero` é renderizada com altura vertical excessiva em formato coluna única, empurrando o título do livro, a barra de progresso e as ações para baixo do fold.
* **Impacto:** O leitor precisa rolar a tela inteira para conseguir atualizar sua página atual.

### 3.4. Layout Quebrado do Modal de Detalhes no Mobile (`BookDetailModal`)
* **Evidência:** Visível em [m05-modal-book-detail-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m05-modal-book-detail-mobile.png).
* **Diagnóstico:** O componente foi projetado como uma caixa modal de desktop e reduzido em escala para telas móveis:
  * O bloco superior (capa, avaliação e progresso) ocupa quase 100% da viewport visível.
  * O título do livro (*"O Nome do Vento"*) fica na parte inferior do modal e é **cortado pela borda inferior da tela**.
  * As 4 abas essenciais (Journal, Resenha, Citações e Ficha Técnica) ficam completamente invisíveis no primeiro plano.
  * **Bug de Cálculo Visual:** No livro concluído *"O Nome do Vento"*, o texto exibe *"Página 656 de 656"*, porém o percentual ao lado exibe erroneamente **"0%"**.

### 3.5. Tela "Registros de Leitura" (StatsPage) Vazia por Falha de Ano Padrão
* **Evidência:** Visível em [12-stats-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/12-stats-desktop.png) e [m11-stats-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m11-stats-mobile.png).
* **Diagnóstico:** O badge da Sidebar indica `Registros de Leitura (4)` (4 livros lidos). Ao abrir a tela, o filtro de ano padrão é fixado em `2026`. Como todos os livros concluídos do acervo demo foram finalizados em `2025`, a tela renderiza:
  * *Livros Lidos: 0 em 2026*
  * *Páginas Lidas: 0 em 2026*
  * *Mês Destaque: Dez 0 livro(s)*
  * *Gráfico mensal Recharts completamente vazio*.
  * Na seção *Por Categoria*, divisão por zero resulta em: `Terror 2 livro(s) • 0%`, `Fantasia 1 livro(s) • 0%`.
* **Impacto:** Passa a impressão imediata de que a funcionalidade de analytics está quebrada.

### 3.6. Tela "Preservar Acervo" com Grande Vazio Estrutural
* **Evidência:** Visível em [15-exportar-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/15-exportar-desktop.png).
* **Diagnóstico:** Ao acessar a aba sem clicar previamente em um livro da lista superior, 85% da página fica em branco sem qualquer mensagem de instrução ou estado de seleção. Além disso, as opções de exportar o acervo em CSV e JSON não possuem botões na interface.

### 3.7. Baixo Contraste e Acessibilidade em Botões (WCAG)
* **Evidência:** Visível em [08-journal-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/08-journal-desktop.png) e no botão de envio de notas do `BookDetailModal`.
* **Diagnóstico:** Botões desabilitados ou em estado inativo usam texto branco sobre fundo rosa claro/marsala translúcido (`bg-marsala/40` ou `opacity-50`), resultando em taxa de contraste de ~2.1:1, reprovada pelo critério WCAG AA (mínimo de 4.5:1).

---

## 4. Problemas de Interação e Mobile UX

1. **Sobreposição do Toast em Ações Críticas Mobile:**
   * O toast flutuante (Sonner) posicionado na base da tela sobrepõe os botões inferiores da gaveta mobile (como "Sair do Modo Demo" e o seletor de tema em [m03-menu-drawer-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m03-menu-drawer-mobile.png)), impedindo toques imediatos.
2. **Padrão de Modal inadequado para Smartphone:**
   * O `BookDetailModal` em celulares deveria seguir o padrão nativo de **Bottom Sheet** (gaveta inferior deslizante com abas fixas no topo e fechamento por arraste), em vez de um modal flutuante centralizado que transborda a tela vertical.
3. **Alvos de Toque em Inputs Numéricos:**
   * Os inputs para registrar página atual (ex: campo "Pág." no card hero e no modal) possuem altura e padding inferiores a 44px, dificultando o toque com o polegar em dispositivos móveis.

---

## 5. Diagnóstico de Erros de Console

Foram capturados 6 registros de console durante a navegação automatizada:
1. `Failed to load resource: the server responded with a status of 429 ()`: Ocorrido durante a execução de buscas automatizadas em sequência na API do Google Books / Edge Function. Demonstra que o rate-limiter de segurança está operacional, mas o feedback visual para o usuário quando o limite é atingido precisa ser mais suave e não deve quebrar a UI.
2. `404 Error: User attempted to access non-existent route: /rota-inexistente-teste`: Log intencional disparado pelo manipulador de rotas da aplicação durante a validação da rota de contingência.

---

## 6. Elementos que Precisam de Redesign (Plano de Melhorias UI/UX)

Com base nas diretrizes do **UI/UX Pro Max**:

| Prioridade | Componente / Área | Problema Identificado | Proposta de Redesign |
|:---:|---|---|---|
| **P1** | [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) | Modal não adaptado para mobile: corta título do livro, esconde as abas de conteúdo e calcula percentual errado (0%). | Converter em **Bottom Sheet responsiva** no mobile; mover o título e abas para o topo da folha; corrigir o cálculo de progresso para exibir 100% em livros lidos. |
| **P1** | [mockBooks.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/mockBooks.ts) | Capas de livros trocadas e livros com imagens quebradas no acervo de demonstração. | Atualizar os links de capa com imagens legítimas, de alta definição e protocolo HTTPS verificado para cada título da lista demo. |
| **P2** | [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx) (Acervo) | 4 fileiras empilhadas de filtros consumindo metade da tela mobile e duplicação da tag "Todos". | Compactar a barra de filtros mobile em um componente colapsável/horizontal unificado; remover a duplicidade das tags "Todos". |
| **P2** | [StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx) | Ano padrão fixo em 2026 exibe gráficos vazios e zeros mesmo com livros concluídos em 2025. | Selecionar automaticamente como ano padrão o ano mais recente que possua leituras concluídas registradas; corrigir divisão por zero na porcentagem de categorias. |
| **P2** | [ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx) | Capa do livro excessivamente alta no mobile empurrando os botões de ação e leitura. | Adotar layout horizontal compacto no mobile (capa de 64×96px alinhada ao lado do título e progresso). |
| **P3** | [ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx) | Tela desértica sem livro selecionado e ausência de botões para download em CSV/JSON. | Selecionar o primeiro livro por padrão; incluir painel superior com botões de backup ("Exportar Acervo em CSV" e "Exportar Backup Completo JSON"). |
| **P3** | [JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx) | Baixo contraste de cores no botão de adicionar anotação quando inativo/desabilitado. | Ajustar tokens semânticos de botão desabilitado para atender o índice de contraste WCAG AA (4.5:1). |

