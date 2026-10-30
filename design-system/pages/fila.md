# Diretrizes de Página: Próxima Leitura / Fila (`activeTab = "fila"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "fila"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L148), [`src/components/ReadingQueuePage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da fila de leitura ordenada do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Próxima Leitura" resolve um dilema clássico de todo leitor: *"O que vou ler a seguir?"*.
Seu propósito é permitir que o usuário organize uma sequência ordenada de prioridades para suas próximas jornadas literárias:
- Definir uma ordem clara (1º, 2º, 3º...) entre os livros não lidos do seu acervo.
- Reordenar a fila facilmente com botões de subir e descer.
- Iniciar a leitura do próximo livro com apenas 1 clique (mudando automaticamente o status para `lendo`).
- Selecionar e enfileirar novas obras a partir de uma vitrine de livros disponíveis na estante.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Próxima Leitura"*.
   - Subtítulo em `Inter` Regular (14px): *"Organize a ordem dos livros que você pretende ler a seguir."*
2. **Lista Ordenada da Fila Ativa:**
   - Lista de itens em formato de cartões horizontais compactos.
   - À extrema esquerda: Número da posição na fila (1, 2, 3...) destacado em `Fraunces` Bold (20px), cor `--primary` (Marsala).
   - Capa miniatura na proporção 2:3 (48×72px) com clique para abrir detalhes completos.
   - Informações centrais: Título da obra em `Fraunces` SemiBold (15px), autor e total de páginas em `Inter` Regular (12px).
   - Conjunto de Ações à Direita:
     - Botão *"Subir na Fila"* (`ArrowUp`), desabilitado no primeiro item.
     - Botão *"Descer na Fila"* (`ArrowDown`), desabilitado no último item.
     - Botão *"Começar a Ler"* (`Play`) destacado em tom Marsala.
     - Botão *"Remover da Fila"* (`X`).
3. **Seção de Livros Disponíveis para Adicionar:**
   - Título da seção `h3` em `Inter` SemiBold (16px): *"Livros na Estante Disponíveis para Enfileirar"*.
   - Grid de cards compactos com capas e botão de 1 clique *"Adicionar à Fila"*.

---

## 3. Organização do Conteúdo
- Pilha vertical da fila no topo $\to$ Divisória estrutural $\to$ Grid de livros disponíveis na base.
- Espaçamento vertical sistemático `--space-6` (24px).

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície dos Itens da Fila: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Número de Posição: `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark).
  - Botão Iniciar Leitura: Fundo sutil com texto em `--primary` e hover iluminado.
  - Botão Excluir: Cor `--text-muted`, transitando para `--destructive` em hover.
- **Tipografia:**
  - Número de Ordem: `Fraunces` Bold (20px).
  - Título do Livro: `Fraunces` SemiBold (15px).
  - Metadados: `Inter` Regular (12px) com números tabulares.
- **Espaçamento:**
  - Padding dos itens da fila: 14px a 16px.
  - Gap vertical entre itens da fila: 8px a 12px.

---

## 5. Componentes e Padrões Visuais
- **Itens Reordenáveis da Fila:**
  - Borda de 1px em `--border` com raio `--radius-md` (8px).
  - Transição de reposicionamento suave via `framer-motion` (`layout` prop) ao clicar em subir ou descer.
  - Touch targets de todos os botões com área mínima de 44×44px no mobile.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Disposição horizontal fluida com todos os botões de ação alinhados à direita. Grid inferior de livros disponíveis em 4 a 5 colunas.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Grid inferior em 3 colunas.
- **Mobile ($< 768\text{px}$):**
  - O item da fila mantém estrutura horizontal com o número de ordem e capa compactos (40×60px).
  - Os botões de ação agrupam-se à direita com espaçamento de 4px a 6px entre si.
  - O grid inferior de livros disponíveis adota 2 colunas com proporção mantida.

---

## 7. Interações e Microanimações
- **Reordenação (Subir/Descer):** Animação fluida de troca de posição entre os dois elementos afetados (`transition: transform 200ms ease`).
- **Iniciar Leitura:** O livro sai da fila com animação de fade suave e o usuário recebe feedback de confirmação via toast.

---

## 8. Estados de Interface
- **Fila Vazia:**
  - Ilustração editorial com ícone `BookOpen` (44px) em `--text-muted`.
  - Mensagem: *"Sua fila de próxima leitura está vazia."*
  - Orientação: *"Selecione livros abaixo da sua estante para montar sua lista de prioridades."*
- **Todos os Livros Já Estão na Fila (Sem Livros Disponíveis):**
  - Mensagem discreta informando que todos os livros não lidos do acervo já fazem parte da fila.

---

## 9. Acessibilidade e Navegação por Teclado
- Os botões de subir e descer possuem rótulos acessíveis: `aria-label="Mover {título} para cima na fila"` e `aria-label="Mover {título} para baixo na fila"`.
- Estado desabilitado dos botões respeita o atributo semântico `disabled` e opacidade reduzida (0.3).

---

## 10. Regras Específicas e Diferenciais desta Página
- Gerencia o estado exclusivo `readingQueue` do `BooksContext` (uma lista indexada e ordenada de IDs).
- É a única tela onde a posição relativa de um livro em relação aos outros pode ser alterada manualmente com persistência na nuvem.

