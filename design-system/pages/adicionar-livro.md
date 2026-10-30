# Diretrizes de Página: Adicionar Livro (`AddBookModal`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **COMPONENTE:** Modal de Busca e Cadastro de Livros  
> **ARQUIVO FONTE:** [`src/components/AddBookModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do fluxo de cadastro e adição de novas obras ao Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
O `AddBookModal` é a porta de entrada de novas histórias para o Lovrary. Seu propósito é tornar a catalogação de livros uma experiência ágil, prazerosa e sem atrito:
- Oferecer busca integrada na base global do Google Books com enriquecimento automático de capa, autor, número de páginas e categoria.
- Disponibilizar alternância inteligente entre busca "Normal" e busca "Aprofundada" (filtrando resumos e guias genéricos).
- Permitir ao leitor decidir em 1 clique se a obra já pertence ao seu acervo físico (*"+ Tenho"*) ou se entrará na lista de leitura futura (*"+ Pretendo"*).
- Fornecer um formulário manual refinado para obras independentes, edições raras ou títulos sem registro ISBN.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho do Modal:**
   - Título editorial `DialogTitle` em `Fraunces` SemiBold (20px): *"Adicionar à Biblioteca"*.
   - Botão fechar (`X`) acessível no canto superior direito (44×44px).
2. **Alternador de Modo (Busca Online / Manual):**
   - Abas em estilo pill no topo do container:
     - Aba 1: *"Buscar Online"* com ícone `Search`.
     - Aba 2: *"Cadastro Manual"* com ícone `PenLine`.
3. **Modo Busca Online:**
   - Barra de Alternância de Tipo de Busca:
     - *"Normal"*: Busca ampla e instantânea.
     - *"Aprofundada"*: Busca com filtros de precisão para eliminar edições espúrias.
   - Campo de Busca: Input amplo com ícone `Search`, botão *"Buscar"* e suporte à tecla `Enter`.
   - Área de Resultados com Rolagem Interna:
     - Lista de livros retornados com capa em miniatura na proporção 2:3, título em `Fraunces` (15px), autor, ano e total de páginas.
     - Botões de Ação Direta em cada item:
       - Botão *"Tenho"*: Adiciona ao acervo pessoal com status `nao-lido`.
       - Botão *"Pretendo"*: Adiciona à Lista de Desejos (`wishlist`).
       - Caso o livro já esteja cadastrado na biblioteca, o botão exibe *"Já no Acervo"* e fica desabilitado.
   - Botão *"Carregar Mais Livros"* no rodapé da lista quando houver mais resultados disponíveis.
4. **Modo Cadastro Manual:**
   - Formulário com campos estruturados:
     - Título da Obra (obrigatório).
     - Autor (obrigatório).
     - Total de Páginas (numérico).
     - Categoria / Gênero (dropdown com opções padronizadas).
     - URL da Imagem de Capa (opcional, com preview em tempo real ao lado).
   - Botão de Ação Primária: *"Salvar Livro no Acervo"*.

---

## 3. Organização do Conteúdo
- No modo busca, a área de resultados possui altura fixa com rolagem suave (`max-h-[60vh]`), mantendo o campo de busca e os seletores sempre fixos no topo do modal.
- No modo manual, os campos organizam-se em grid de 2 colunas no desktop (Título e Autor em destaque, páginas e gênero ao lado) e preview da capa à direita.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície do Modal: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Botão Primário (*"Tenho"* / Salvar): `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark).
  - Botão Secundário (*"Pretendo"*): Fundo `--surface-subtle` com borda em `--border` e texto em `--text-primary`.
  - Chip de Busca Aprofundada Ativa: Acento dourado `--accent-gold`.
- **Tipografia:**
  - Título do Modal: `Fraunces` SemiBold (20px).
  - Títulos dos Resultados: `Inter` SemiBold (14px).
  - Metadados dos Resultados: `Inter` Regular (12px), cor `--text-secondary`.
- **Espaçamento:**
  - Padding do modal: 24px.
  - Gap da lista de resultados: `--space-3` (12px) entre cada item.

---

## 5. Componentes e Padrões Visuais
- **Primitiva de Modal:** Implementado com [`src/components/ui/dialog.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ui/dialog.tsx).
- **Cartão de Resultado da Busca:**
  - Capa de livro com altura de 64px e proporção 2:3, com cantos arredondados de 4px.
  - Alinhamento horizontal limpo: [Capa] $\to$ [Metadados] $\to$ [Botões de Ação à Direita].
  - Transição de fundo sutil para `--surface-subtle` ao passar o mouse.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 768\text{px}$):** Modal centralizado com largura de 640px a 720px. Os botões de adicionar acomodam-se lado a lado no canto direito de cada resultado.
- **Mobile ($< 768\text{px}$):**
  - Modal adaptado como Drawer inferior ou Dialog de tela cheia compacta (`w-[95vw]` com margens mínimas).
  - Cada item de resultado empilha os botões de ação abaixo do título para garantir área de clique confortável sem esmagamento de texto.
  - Altura mínima de toque de 44px garantida em todos os botões.

---

## 7. Interações e Microanimações
- **Busca:** Exibe spinner animado `Loader2` no botão durante o fetch na API do Google Books.
- **Feedback de Adição:** Ao clicar em *"Tenho"* ou *"Pretendo"*, o botão exibe breve animação de confirmação (`Check`) e exibe notificação Sonner toast sem fechar o modal, permitindo catalogar múltiplos livros em sequência.

---

## 8. Estados de Interface
- **Estado Inicial (Sem Busca):** Mensagem de orientação convidando a digitar um título, autor ou ISBN.
- **Carregando:** Skeleton dos itens da lista de livros.
- **Nenhum Resultado Encontrado:** Mensagem clara com botão de atalho: *"Não encontramos este livro. Deseja cadastrá-lo manualmente?"*, alternando para a aba de cadastro manual em 1 clique.
- **Erro de Conexão ou Rate Limit:** Mensagem amigável com opção de tentar novamente ou recorrer ao cadastro manual.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco automático inserido no input de busca assim que o modal se abre.
- Suporte à tecla `Escape` para fechar o diálogo.
- Todos os campos do formulário manual possuem rótulos acessíveis vinculados por `htmlFor`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Integração externa direta com a Google Books API (via Edge Function do Supabase ou fetch direto de contingência).
- Suporte a catalogação contínua (o usuário pode buscar e adicionar 5 livros seguidos sem que o modal se feche involuntariamente).

