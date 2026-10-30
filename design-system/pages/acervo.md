# Diretrizes de Página: Meu Acervo (`activeTab = "acervo"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "acervo"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L152-L315), [`src/components/BookCard.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx), [`src/components/CategoryFilter.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/CategoryFilter.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do catálogo principal do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Meu Acervo" é a grande estante visual do leitor. Nela estão reunidos todos os livros físicos e digitais que o usuário possui (`ownership === 'tenho'`). Seu objetivo é permitir contemplação, exploração fluida, filtragem instantânea e gestão de status do acervo (lidos, lendo, na estante, emprestados e abandonados) com máxima ênfase visual nas capas das obras.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho da Estante:**
   - Título editorial `h2` em `Fraunces` Bold (24px a 28px): *"Meu Acervo"*.
   - Contador de livros discretamente posicionado à direita em `Inter` (ex.: *"48 livros"*), utilizando números tabulares.
2. **Barra de Controle & Busca Unificada:**
   - Campo de busca instantânea com ícone `Search`, botão de limpar (`X`) acessível (44×44px) e suporte a atalho de teclado `⌘K` / `Ctrl+K`.
3. **Trilha de Filtros por Status (Pills Horizontais):**
   - Conjunto de pílulas: *"Todos"*, *"Na Estante"*, *"Lendo"*, *"Lidos"*, *"Emprestados com Você"*, *"Abandonados"*.
   - Cada pílula inclui a contagem de livros entre parênteses em números tabulares.
4. **Trilha de Filtros por Categoria / Gênero (`CategoryFilter`):**
   - Pílulas com rolagem horizontal livre no mobile (`scrollbar-none`) com categorias dinâmicas presentes no acervo.
5. **Barra de Ferramentas de Exibição e Ordenação:**
   - Seletor de modo de visualização: Grade (*Grid*) vs. Agrupado por Autor.
   - Dropdown customizado de ordenação: Últimas Adições, Melhor Avaliados, Data de Leitura, Páginas (mais longos/curtos), Título (A-Z) e Autor (A-Z).
   - Botão *"Limpar Filtros"* que surge dinamicamente quando há filtros ativos.
6. **Mural do Acervo:**
   - Grid denso e harmônico de capas de livros, ou seções agrupadas com títulos de autores em destaque.

---

## 3. Organização do Conteúdo
- **Modo Grade Padrão:** Grade contínua onde cada livro é representado pelo [`BookCard`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx).
- **Modo Agrupado por Autor:** O acervo é seccionado alfabeticamente pelo nome do autor. Cada seção exibe o nome do autor em `Fraunces` SemiBold (18px) acompanhado do contador de obras, seguido pela grade dos livros daquele autor.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores dos Filtros Ativos:**
  - Pílula Selecionada: Fundo sólido em `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark) com texto em `--primary-foreground`.
  - Pílula Inativa: Fundo `--surface` com borda sutil de 1px em `--border`, texto em `--text-secondary`, transitando para `--surface-subtle` em hover.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Títulos de Autor: `Fraunces` SemiBold (18px).
  - Título dos Livros nos Cards: `Inter` SemiBold (14px) ou `Fraunces` (quando sem capa).
  - Contadores: `Inter` com `font-variant-numeric: tabular-nums`.
- **Espaçamento:**
  - Gap do grid de livros: 12px a 16px no mobile e tablet; 16px a 20px no desktop.
  - Padding lateral: 16px (mobile) a 32px (desktop widescreen).

---

## 5. Componentes e Padrões Visuais
- **Padronização da Capa (`BookCard`):**
  - Todas as capas adotam estritamente `aspect-ratio: 2 / 3`.
  - Borda limpa de 1px em `--border` com cantos arredondados `--radius-md` (8px).
  - **Eliminação do Skeuomorfismo Pesado:** A antiga classe `.book-spine-effect` (lombada falsa plástica 3D com gradientes pretos) é removida. A sensação tátil é conferida por uma elevação suave `--shadow-card` e hover de elevação leve (`translateY(-3px)`).
  - **Badge de Status:** Etiqueta discreta na base do card com cantos arredondados e cor semântica (ex.: Lendo em Marsala, Lido em Verde Literário `--success`, Emprestado em Dourado `--accent-gold`).
  - **Fallback de Capa Indisponível:** Livros sem imagem na API recebem um tratamento de capa editorial em linho sutil (`--surface-subtle`), com o título em `Fraunces` e autor em `Inter`, sem ícones de imagem quebrada.

---

## 6. Comportamento Responsivo
- **Desktop Widescreen ($\ge 1280\text{px}$):** Grade de 6 colunas de livros. Barra de ferramentas com ordenação e alternador de visão alinhados na mesma linha horizontal.
- **Desktop Médio ($1024\text{px}$ a $1279\text{px}$):** Grade de 5 colunas de livros.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Grade de 3 a 4 colunas de livros.
- **Mobile ($< 768\text{px}$):**
  - Grade de exatamente 2 colunas com proporção das capas preservada.
  - As trilhas de status e categoria possuem rolagem horizontal fluida por toque (`overflow-x-auto scrollbar-none`) com compensação para não cortar o último chip.
  - A barra de ordenação empilha verticalmente de forma compacta sem quebrar a largura da tela.
  - Zero rolagem horizontal na página inteira.

---

## 7. Interações e Microanimações
- **Busca em Tempo Real:** Filtragem reativa instantânea com transição visual nos cards remanescentes via `framer-motion` (fade e reposicionamento suave).
- **Atalho de Teclado:** Pressionar `⌘K` (Mac) ou `Ctrl+K` (Windows/Linux) direciona o foco imediatamente para o campo de busca.
- **Abertura do Livro:** O clique no `BookCard` abre o `BookDetailModal` (modal central no desktop / bottom sheet drawer no mobile).

---

## 8. Estados de Interface
- **Estado Vazio por Busca/Filtro:** Quando nenhum livro atende aos critérios, renderizar mensagem acolhedora:
  - Ícone `BookOpen` sutil em cor `--text-muted`.
  - Título: *"Nenhum livro encontrado no acervo"*.
  - Subtítulo: *"Tente ajustar os termos de busca ou selecionar outra categoria."*
  - Botão de ação: *"Limpar Filtros"*.
- **Estado Vazio de Primeiro Acesso:** Caso o acervo esteja zerado, exibir convite caloroso para adicionar os primeiros livros com o botão *"Adicionar Livro"*.

---

## 9. Acessibilidade e Navegação por Teclado
- Cada card de livro é um elemento interativo focável com anel de foco acessível (`focus-visible:ring-2 focus-visible:ring-primary`).
- Ao pressionar `Enter` ou `Espaço` em um card focado, o modal de detalhes do livro é aberto.
- O campo de busca possui atributo `aria-label="Buscar no acervo"` e botão de limpeza com `aria-label="Limpar busca"`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Foco exclusivo em obras de posse do usuário (`ownership === 'tenho'`).
- Oferece a funcionalidade exclusiva de alternância entre visualização em Grade Geral e Agrupamento por Autor.
- Possui o seletor mais completo de ordenação da aplicação (7 critérios).

