# Auditoria Visual — Lovrary

> Auditoria visual sistemática de todas as telas, componentes e padrões estéticos do Lovrary, fundamentada nos princípios de design intelligence da skill **UI/UX Pro Max**.

---

## 1. Visão Geral e Princípios Estéticos

O Lovrary propõe uma estética inspirada em **"Papel, Tinta e Biblioteca Clássica"** (*Swiss Modernism 2.0* com nuances literárias), fundamentada no tom **Marsala** (vinho nobre), toques de **Dourado** e papel aquecido (*Cream/Parchment*). 

Embora o conceito seja poético e diferenciado, a inspeção visual revelou **inconsistências graves de hierarquia, desbalanceamento de proporções, falhas de contraste WCAG e quebras de layout responsivo**.

---

## 2. Avaliação Individual por Página e Componente

### 2.1. Tela de Autenticação (`/auth`)
* **Evidências:** [01-auth-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/01-auth-desktop.png) e [m01-auth-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m01-auth-mobile.png)
* **Arquivo:** [src/pages/Auth.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx)
* **Problemas Identificados:**
  1. **Hierarquia de Ações Invertida:** O botão *"Acessar no Modo Demonstração"* recebe uma borda e fundo quase invisíveis (`bg-marsala/5`), enquanto o formulário de login tradicional possui destaque massivo. Para usuários novos que desejam experimentar a ferramenta sem cadastro, o botão mais atraente parece secundário.
  2. **Espaçamento e Respiro no Card:** O container centralizado possui padding generoso no desktop (`p-8`), mas no mobile (390px) o card encosta nas margens laterais com espaçamento apertado (`p-6`), gerando sensação de claustrofobia visual.
  3. **Identidade Visual Minimalista Demais:** A tela consiste apenas em um fundo sólido plano com um card branco flutuante. Falta a textura literária e a atmosfera de "entrada em uma biblioteca" que o restante da aplicação busca transmitir.

---

### 2.2. Início / Dashboard (`/`)
* **Evidências:** [02-dashboard-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop.png), [02-dashboard-desktop-full.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop-full.png) e [m02-dashboard-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m02-dashboard-mobile.png)
* **Arquivos:** [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx), [src/components/ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx)
* **Problemas Identificados:**
  1. **Desproporção Severa do Livro no Hero Mobile:**
     * No mobile, o componente `ImmersiveReadingHero` exibe a capa do livro centralizada e empilhada verticalmente. A capa ocupa **320px de altura**, deixando apenas uma fresta para o título e empurrando a barra de progresso, o botão de atualizar página e as ações para fora do viewport visível.
     * Além disso, a capa inicial de demonstração é um retângulo totalmente branco com uma fita dourada genérica, parecendo um elemento não renderizado ou com erro.
  2. **Sobrecarga de Informações Verticais na Home:**
     * A página inicial empilha 6 blocos sequenciais maciços: *Hero Imersivo → Seção de Maestria & Skills → Painel de Estatísticas → Grid Lendo Agora → Feed de Atividade Recente → Grid de Últimas Adições*.
     * No desktop full-page ([02-dashboard-desktop-full.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/02-dashboard-desktop-full.png)), a rolagem ultrapassa 3.200px. O usuário é bombardeado com cards repetidos em 3 lugares diferentes da mesma página.
  3. **Inconsistência de Raios de Borda (Border Radius):**
     * O Hero utiliza `rounded-3xl` (24px), o painel de maestria usa `rounded-2xl` (16px), os badges internos usam `rounded-xl` (12px) e os botões usam `rounded-lg` (8px). A convivência desses raios cria um ritmo desarticulado.

---

### 2.3. Meu Acervo (`tab: acervo`)
* **Evidências:** [06-acervo-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/06-acervo-desktop.png) e [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png)
* **Arquivos:** [src/pages/Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L152-L315), [src/components/BookCard.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx)
* **Problemas Identificados:**
  1. **Poluição Visual por Filtros Duplicados e Empilhados:**
     * Existem duas fileiras de pills de filtro coladas uma embaixo da outra com o mesmo estilo visual (`gradient-marsala`):
       * Linha de Status: `Todos (6)`, `Na Estante (0)`, `Lendo (2)`, `Lidos (4)`...
       * Linha de Categorias: `Todos`, `Autoajuda`, `Biografia`, `Fantasia`...
     * A presença de dois botões chamados **"Todos"** empilhados diretamente gera confusão imediata no leitor.
  2. **Compressão Brutal no Mobile:**
     * No smartphone, a pilha *Header + Título + Input de Busca + Filtro de Status + Filtro de Categorias + Barra de Visualização/Ordenação* ocupa **380px** da tela. O primeiro livro só começa após a metade da viewport.
  3. **Mismatch Visual das Capas:**
     * As imagens dos livros não correspondem aos títulos: *"O Nome do Vento"* tem capa de matemática; *"Rebecca"* tem capa de livro espanhol; *"It: A Coisa"* é uma caixa vazia sem imagem.

---

### 2.4. Modal de Detalhes do Livro (`BookDetailModal`)
* **Evidências:** [05-modal-book-detail-journal-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/05-modal-book-detail-journal-desktop.png) e [m05-modal-book-detail-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m05-modal-book-detail-mobile.png)
* **Arquivo:** [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)
* **Problemas Identificados:**
  1. **Layout Mobile Inutilizável:**
     * Em telas móveis (390px), o modal abre como uma caixa flutuante com altura excessiva.
     * O topo exibe capa gigante e barra de progresso. O título do livro (*"O Nome do Vento"*) fica na parte de baixo e é **cortado pela margem inferior da tela**.
     * As 4 abas (Journal, Resenha, Citações, Ficha Técnica) não são visíveis sem uma rolagem profunda, que concorre com a rolagem da própria página.
  2. **Corte de Conteúdo no Desktop:**
     * No desktop, a coluna direita (Journal de anotações) corta o último card de nota na margem inferior sem indicação de que há mais conteúdo abaixo (ausência de scrollbar visível ou gradiente de fade).
  3. **Contraste Deficiente do Botão de Ação:**
     * O botão *"Registrar no Diário"* utiliza fundo rosa claro desbotado (`bg-marsala/40`) com tipografia branca, resultando em taxa de contraste de apenas **2.1:1** (violando o mínimo WCAG de 4.5:1).

---

### 2.5. Registros de Leitura / Estatísticas (`tab: stats`)
* **Evidência:** [12-stats-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/12-stats-desktop.png)
* **Arquivo:** [src/components/StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx)
* **Problemas Identificados:**
  1. **Sensação de Interface "Quebrada" por Seleção de Ano Errada:**
     * O leitor visualiza o badge lateral indicando `4 livros lidos`. Ao clicar na página, se depara com *"0 Livros Lidos em 2026"*, *"0 Páginas Lidas"*, *"Mês Destaque: Dez 0 livro(s)"* e um gráfico Recharts vazio sem barras.
     * O ano selecionado por padrão é 2026, mas os dados do mock pertencem a 2025.
  2. **Falha Tipográfica e de Cálculo em Categorias:**
     * A tabela inferior exibe: `Terror 2 livro(s) • 0%`, `Fantasia 1 livro(s) • 0%`. A divisão por zero quando não há livros no ano corrente gera strings de 0% sem sentido.
     * Os textos em cinza claro (`text-muted-foreground`) sobre fundo claro quase somem na visualização diurna.

---

### 2.6. Preservar Acervo / Exportar (`tab: exportar`)
* **Evidência:** [15-exportar-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/15-exportar-desktop.png)
* **Arquivo:** [src/components/ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx)
* **Problemas Identificados:**
  1. **Vazio Estrutural Excessivo (Dead Space):**
     * A página exibe apenas 4 cartões de livros no topo e **85% da tela permanece como um deserto em branco**, sem instrução ("Selecione um livro acima para gerar seu card social").
  2. **Ausência Visual de Recursos de Exportação:**
     * A aba se chama *"Preservar Acervo"*, mas visualmente não há qualquer botão ou menção a download de backup em CSV ou JSON.

---

### 2.7. Modo Noturno (Dark Mode)
* **Evidência:** [03-dashboard-dark-desktop.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/03-dashboard-dark-desktop.png)
* **Arquivo:** [src/index.css](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/index.css#L65-L118)
* **Problemas Identificados:**
  1. **Bordas com Contraste Excessivo em Elementos Secundários:**
     * Algumas bordas de cards e divisores usam `border-border` com opacidade que gera linhas esbranquiçadas duras no fundo escuro, em vez de sutis separações tonais.
  2. **Badges Amarelas com Legibilidade Comprometida:**
     * No badge "Lendo" sobre capa escura, o amarelo ouro (`hsl(38 90% 67%)`) com texto escuro gera uma mancha luminosa excessiva que compete com a tipografia do título do livro.

