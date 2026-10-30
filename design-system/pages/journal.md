# Diretrizes de Página: Diário de Leitura / Journal (`activeTab = "journal"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "journal"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L147), [`src/components/JournalPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do diário de leitura pessoal do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
O Journal é o caderno de campo do leitor. Seu propósito é registrar pensamentos imediatos, reflexões sobre personagens, hipóteses de enredo e trechos marcantes no calor da leitura:
- Funciona como um diário de bordo com estética de papel encadernado de alta gramatura.
- Permite alternar rapidamente entre diferentes livros que estão sendo lidos simultaneamente.
- Oferece um editor ágil de notas por capítulo ou página, com data e hora automáticas.
- Permite editar notas anteriores inline e atualizar a página em que o leitor se encontra.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho da Página:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Journal de Leitura"*.
   - Subtítulo suave em `Inter` (14px): *"Seu espaço para reflexões, hipóteses e memórias de leitura."*
2. **Carrossel Seletor de Livros em Leitura:**
   - Faixa horizontal deslizável no topo (`overflow-x-auto scrollbar-none`).
   - Cada cartão de livro exibe capa miniatura (40×56px), título da obra, percentual e página atual.
   - O livro ativo é destacado com contorno em `--primary` (Marsala) e fundo enriquecido em `--surface-subtle`.
3. **Módulo de Composição de Nova Anotação:**
   - Cartão com fundo `--surface` e borda limpa de 1px.
   - Campo para capítulo/página de referência (ex.: *"Cap. 4 — Pág. 82"*).
   - Área de texto para a reflexão pessoal (textarea com altura dinâmica e linha de base legível).
   - Botão de ação primária: *"Registrar Nota"* com ícone `Feather` ou `Plus`.
4. **Feed Cronológico de Notas (Ordem Reversa):**
   - Linha do tempo visual conectando as notas da mais recente para a mais antiga.
   - Cada nota exibe carimbo de data/hora, tag do capítulo/página, corpo do texto e botões discretos de editar (`Pencil`) e excluir (`Trash2`).

---

## 3. Organização do Conteúdo
- **Layout em 2 Colunas no Desktop ($\ge 1024\text{px}$):**
  - Coluna Esquerda (~40%): Informações do livro selecionado, barra de progresso, input rápido de atualização de página e formulário de nova anotação.
  - Coluna Direita (~60%): O caderno de notas do livro selecionado, rolável e espaçoso.
- **Layout Vertical em Mobile / Tablet:**
  - Carrossel de seleção $\to$ Formulário de composição $\to$ Feed de notas cronológicas.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Fundo da Área de Redação: `--surface` com leve textura conceitual de papel nobre.
  - Carimbo de Data/Hora: Cor `--text-muted` (contraste $\ge 4.5:1$).
  - Borda de Divisão das Notas: `--border` suave (1px).
  - Acento das Tags de Capítulo: Fundo `--accent-gold-subtle` com texto em `--accent-gold`.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Título do Livro no Topo da Nota: `Fraunces` Medium (18px).
  - Corpo da Nota do Journal: `Inter` Regular (15px), com altura de linha relaxada (`leading-relaxed` ou `1.65`) para leitura acolhedora.
  - Metadados (Data, Hora, Pág.): `Inter` com `font-variant-numeric: tabular-nums`.
- **Espaçamento:**
  - Padding interno dos cartões de nota: 20px.
  - Gap vertical entre notas: `--space-4` (16px).

---

## 5. Componentes e Padrões Visuais
- **Modo de Edição Inline:** Ao clicar no ícone de lápis em uma nota existente, o texto se converte em campo editável in loco, exibindo os botões *"Salvar Alteração"* (`Check`) e *"Cancelar"* (`X`) sem abrir modais externos intrusivos.
- **Exclusão Segura:** O ícone de lixeira aciona um diálogo inline sutil de confirmação antes de remover a nota permanentemente.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Visualização dividida (painel de redação fixo à esquerda e feed de histórico à direita), permitindo escrever enquanto consulta notas anteriores.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Coluna única vertical espaçosa.
- **Mobile ($< 768\text{px}$):**
  - O seletor de livros preserva o toque lateral com `gap-2` e touch targets confortáveis.
  - Os botões de editar e excluir possuem área mínima de 44×44px.
  - O textarea de entrada cresce automaticamente conforme o texto é digitado para não exigir rolagem interna minúscula no teclado móvel.

---

## 7. Interações e Microanimações
- **Inserção de Nota:** A nova anotação surge no topo do feed com animação suave de deslize para baixo (`opacity: 0, y: -10` $\to$ `opacity: 1, y: 0`) em 200ms.
- **Alternância de Livro:** Trocar o livro no carrossel atualiza o feed com transição de crossfade instantânea sem quebra de scroll.

---

## 8. Estados de Interface
- **Estado Vazio (Sem Livros em Leitura):**
  - Ícone `BookOpen` (48px) em `--text-muted`.
  - Mensagem: *"Nenhum livro em leitura ativa para registrar no Journal."*
  - Botão de ação: *"Iniciar Leitura"* direcionando para a aba de Lendo Agora ou Acervo.
- **Estado Vazio (Livro Sem Notas Cadastradas):**
  - Cartão poético com ícone `Feather` e texto: *"Nenhuma anotação registrada ainda para este livro. Registre sua primeira impressão acima!"*

---

## 9. Acessibilidade e Navegação por Teclado
- Foco automático no campo de texto principal ao selecionar um livro para escrever.
- Atalho `⌘ + Enter` ou `Ctrl + Enter` dentro do textarea envia a nota diretamente.
- Leitura estruturada para tecnologias assistivas com `aria-label="Diário de anotações de {título do livro}"`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Foco absoluto na escrita reflexiva pessoal do leitor durante o ato de leitura.
- Vinculação estrita das anotações ao `book.id` ativo, com preservação de carimbos cronológicos imutáveis de data e horário de criação.

