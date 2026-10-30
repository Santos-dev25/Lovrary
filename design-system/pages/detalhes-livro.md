# Diretrizes de Página: Detalhes do Livro (`BookDetailModal`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **COMPONENTE:** Modal / Bottom Sheet Global de Detalhes do Livro  
> **ARQUIVO FONTE:** [`src/components/BookDetailModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da tela mais rica e detalhada do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
O `BookDetailModal` é o coração contemplativo e documental do Lovrary. É a experiência completa de abrir um livro da sua estante particular:
- Apresentar a obra com reverência visual (capa em destaque e metadados organizados).
- Permitir o gerenciamento do ciclo de vida do livro (iniciar leitura, atualizar páginas, concluir, emprestar para um amigo ou abandonar).
- Centralizar em 4 sub-abas toda a produção intelectual do leitor associada àquela obra: Journal de leitura, Resenha crítica detalhada com notas por critério, Citações marcantes e Ficha técnica com sugestões de leituras similares.

---

## 2. Hierarquia Visual e Distribuição dos Elementos

### Estrutura em 2 Colunas (Desktop $\ge 768\text{px}$):
1. **Coluna Esquerda (~38% — Vitrine Física & Ações Rápidas):**
   - Fundo levemente diferenciado em `--surface-subtle`.
   - **Capa Protagonista:** Imagem ampla na proporção 2:3, com cantos arredondados `--radius-lg` (12px), borda de 1px em `--border` e sombra difusa elegante `--shadow-card`. (Banida a classe antiga de lombada 3D plástica `.book-spine-effect`).
   - **Identidade da Obra:** Título em `Fraunces` SemiBold (20px) e Autor em `Inter` Regular (14px).
   - **Badge de Status:** Pill semântica no rodapé da capa ou logo abaixo (ex.: *"Lido"*, *"Lendo"*, *"Na Estante"*, *"Emprestado"*).
   - **Classificação por Estrelas:** Componente `RatingStars` dourado com suporte a meias-estrelas.
   - **Botão Primário de Ação de Ciclo de Vida:**
     - Se `nao-lido`: *"Iniciar Leitura"* com ícone `Play`.
     - Se `lendo`: *"Atualizar Progresso"* ou *"Marcar como Lido"*.
     - Se `lido`: *"Revisar Resenha"*.
     - Se `wishlist`: *"Adicionar ao Meu Acervo"*.
   - **Menu de Ações Secundárias (`MoreHorizontal`):** Ações de registrar empréstimo, registrar abandono ou excluir livro.

2. **Coluna Direita (~62% — Conteúdo Intelectual & Sub-Abas):**
   - **Barra de Navegação em Abas:**
     - Aba 1: *"Journal"* (com contador de anotações do livro).
     - Aba 2: *"Resenha"* (avaliação detalhada e sub-critérios).
     - Aba 3: *"Citações"* (com contador de frases salvas).
     - Aba 4: *"Ficha Técnica"* (detalhes, vibes e recomendações similares).
   - **Área de Conteúdo Rolável:** Scroll independente unificado, garantindo que a coluna esquerda permaneça estável como referência visual enquanto o leitor explora textos extensos.

---

## 3. Organização do Conteúdo por Sub-Aba

### Sub-Aba 1: Journal do Livro
- Histórico cronológico das notas exclusivas daquele livro com data, hora e capítulo.
- Campo rápido para registrar uma nova anotação diretamente sem precisar sair do modal.

### Sub-Aba 2: Resenha Crítica & Avaliação Editorial
- Exibição da resenha escrita em parágrafos limpos com tipografia relaxada `Inter` (15px).
- Modo de edição com textarea expansível e botão *"Salvar Resenha"*.
- **Sub-Avaliações por Critério:** Grid de critérios com estrelas individuais (ex.: *Enredo*, *Personagens*, *Escrita*, *Ritmo*), permitindo avaliação analítica da obra.

### Sub-Aba 3: Citações Favoritas
- Lista de trechos marcantes destacados pelo leitor, apresentados com aspas editoriais douradas (`Quote`) e formatação em itálico de alta legibilidade.
- Botão *"Nova Citação"* com campo para frase e página.

### Sub-Aba 4: Ficha Técnica & Recomendações
- Dados estruturados: Total de páginas, editora, ano de publicação, categoria e tags de "Vibe" da obra.
- **Carrossel de Livros Similares:** 4 sugestões obtidas via Google Books API com capas e botão de 1 clique para adicionar à Lista de Desejos.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície Principal: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Superfície da Coluna Esquerda: `--surface-subtle`.
  - Estrelas de Avaliação: Dourado nobre `--accent-gold` (`#855F14` no Light / `#E0A93B` no Dark).
  - Citações: Fundo sutil com borda lateral esquerda de 3px em `--primary` (Marsala).
- **Tipografia:**
  - Título do Livro: `Fraunces` SemiBold (20px a 24px).
  - Resenhas e Citações: `Inter` Regular (15px, `leading-relaxed`).
  - Metadados: `Inter` com `font-variant-numeric: tabular-nums`.

---

## 5. Componentes e Padrões Visuais
- **Primitiva de Diálogo Unificada:**
  - Em telas $\ge 768\text{px}$, utiliza o componente [`src/components/ui/dialog.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/dialog.tsx) centralizado, com largura máxima de 920px e altura de até 88vh.
  - Em telas $< 768\text{px}$, utiliza o componente [`src/components/ui/drawer.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/drawer.tsx) (Bottom Sheet ancorado na base com altura máxima de 92vh).

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Grade balanceada de 2 colunas. A capa e as ações principais permanecem sempre visíveis à esquerda sem sumir na rolagem.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Grade de 2 colunas mais compacta (coluna esquerda com 35% de largura).
- **Mobile ($< 768\text{px}$ — Bottom Sheet Drawer):**
  - O modal se transforma em uma folha inferior deslizante (`DrawerContent`) com puxador tátil no topo (`pill` de 36×4px).
  - A capa é exibida no topo em formato compacto (110×160px) com o título e ações principais logo abaixo.
  - As 4 abas são acessadas por botões horizontais com toque suave.
  - Deslizar o dedo para baixo no topo da folha fecha o modal instantaneamente.
  - O botão de fechar flutuante possui área mínima de 44×44px.

---

## 7. Interações e Microanimações
- **Abertura e Fechamento:** Entrada via animação suave de escala e opacidade no desktop (200ms) e transição de subida do fundo no mobile via `vaul` / `framer-motion`.
- **Alternância de Sub-Abas:** Transição instantânea sem reflow e sem saltos de barra de rolagem.

---

## 8. Estados de Interface
- **Carregamento de Recomendações:** Skeletons horizontais na aba de Ficha Técnica enquanto a API do Google Books responde.
- **Submissão de Ações (Salvar Resenha, Adicionar Nota):** Feedback imediato via toast e atualização do contador na aba correspondente.
- **Exclusão de Livro:** Banner de confirmação com destaque visual de destruição em `--destructive` antes de efetivar o descarte.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco automático aprisionado no modal (*focus trap*) enquanto aberto, impedindo foco na tela de fundo.
- Tecla `Escape` fecha o modal imediatamente e retorna o foco para o card que o acionou.
- As abas possuem atributos semânticos `role="tablist"`, `role="tab"` e `role="tabpanel"`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Esta é a experiência mais complexa da aplicação, integrando operações de 6 tabelas/entidades distintas (livro, resenha, sub-avaliações, notas, citações e recomendações).
- É a vitrine oficial de exibição de um livro no Lovrary; nenhuma outra tela oferece tantas ferramentas simultâneas para uma única obra.

