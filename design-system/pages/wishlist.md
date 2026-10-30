# Diretrizes de Página: Lista de Desejos (`activeTab = "wishlist"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "wishlist"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L153), [`src/components/BookCard.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da vitrine de desejos literários do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Lista de Desejos" é a vitrine de aspirações literárias do leitor:
- Guardar obras que o leitor ainda não comprou ou não pegou emprestado, mas tem profundo interesse em ler (`ownership === 'pretendo'`).
- Manter o acervo pessoal físico limpo e sem confusão entre "livros que possuo" e "livros que pretendo ter".
- Permitir a conversão instantânea de qualquer item da lista de desejos em um livro real do acervo (`moveToAcervo`) assim que o leitor o adquirir.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Lista de Desejos"*.
   - Contador à direita em `Inter` (ex.: *"12 livros desejados"*), em números tabulares.
2. **Barra de Busca Rápida:**
   - Campo de filtragem para localizar rapidamente um título ou autor entre os livros desejados.
3. **Mural de Capas Desejadas:**
   - Grade idêntica à do Acervo, garantindo harmonia visual e protagonismo absoluto às capas das obras na proporção 2:3.
   - Badge distintiva nos cartões: Etiqueta sutil *"Pretendo Ler"* em tom dourado suave (`--accent-gold-subtle` com texto em `--accent-gold`).
4. **Ação de Aquisição / Conversão:**
   - Ao abrir os detalhes do livro ou no menu rápido do card, o botão de destaque é *"Adicionar ao Meu Acervo"* (`moveToAcervo`), mudando instantaneamente o status do livro para "Na Estante" (`nao-lido`) e a propriedade para `tenho`.

---

## 3. Organização do Conteúdo
- Grade contínua e espaçosa de cards de livros (`BookCard`), sem menus laterais adicionais ou excesso de painéis secundários.
- Espaçamento vertical sistemático `--space-6` (24px).

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Fundo Geral: `--background` (`#FAF7F2` no Light / `#140E10` no Dark).
  - Superfície dos Cards: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Badge de Desejo: Dourado literário `--accent-gold` (`#855F14` no Light / `#E0A93B` no Dark).
  - Botão Mover para Acervo: `--primary` (Marsala).
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Títulos dos Livros: `Inter` SemiBold (14px).
  - Metadados: `Inter` Regular (12px), cor `--text-secondary`.
- **Espaçamento:**
  - Gap do grid de livros: 12px a 16px no mobile e tablet; 16px a 20px no desktop.

---

## 5. Componentes e Padrões Visuais
- **Consistência do `BookCard`:** O mesmo componente refinado do acervo é utilizado aqui, garantindo proporção 2:3, borda de 1px e elevação suave `--shadow-card`.
- **Diferenciação Sutil:** As obras na Wishlist não exibem barra de progresso ou número de páginas lidas, concentrando-se na capa, título, autor e categoria.

---

## 6. Comportamento Responsivo
- **Desktop Widescreen ($\ge 1280\text{px}$):** Grade de 6 colunas de livros.
- **Desktop Médio ($1024\text{px}$ a $1279\text{px}$):** Grade de 5 colunas de livros.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Grade de 3 a 4 colunas de livros.
- **Mobile ($< 768\text{px}$):** Grade de exatamente 2 colunas, com toque lateral livre e sem overflow.

---

## 7. Interações e Microanimações
- **Conversão para Acervo:** Ao clicar em *"Mover para o Acervo"*, o livro transita suavemente para fora da lista de desejos com feedback via Sonner toast (*"Livro adicionado com sucesso à sua estante!"*).

---

## 8. Estados de Interface
- **Lista de Desejos Vazia:**
  - Ilustração editorial acolhedora com ícone `Sparkles` dourado.
  - Título: *"Sua Lista de Desejos está vazia."*
  - Mensagem: *"Encontrou um livro interessante que pretende ler no futuro? Busque e adicione à sua lista de desejos para não esquecer."*
  - Botão Primário: *"Buscar Novos Livros"*, abrindo diretamente o `AddBookModal`.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco por teclado sequencial entre os cards da lista.
- Rótulos acessíveis em cada card informando o título e que o livro está na lista de desejos.

---

## 10. Regras Específicas e Diferenciais desta Página
- Filtra estritamente livros onde `ownership === 'pretendo'`.
- Possui o fluxo exclusivo de transição de estado `moveToAcervo`, conectando o desejo do leitor à posse real da obra na estante.

