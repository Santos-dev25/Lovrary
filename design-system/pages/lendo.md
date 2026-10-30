# Diretrizes de Página: Lendo Agora (`activeTab = "lendo"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "lendo"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L129-L135), [`src/components/ReadingNow.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da tela de leituras ativas do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Lendo Agora" é o santuário da leitura ativa. Enquanto o "Acervo" é uma estante panorâmica, esta página é a escrivaninha de trabalho do leitor:
- Foco total nas obras que estão sendo consumidas no momento presente.
- Atualização sem atrito da página atual de cada livro.
- Cálculo em tempo real do percentual lido, páginas restantes e ritmo de avanço.
- Acesso rápido para abrir o Journal de anotações ou o modal com todos os detalhes da obra.
- Abertura de um seletor para puxar um novo livro da estante e iniciar uma leitura.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho da Página:**
   - Título editorial `h2` em `Fraunces` Bold (24px a 28px): *"Lendo Agora"*.
   - Botão de Ação Primária ou Secundária no topo: *"Iniciar Nova Leitura"* (abre o modal seletor).
2. **Cards Expandidos de Leitura Ativa:**
   - Cada livro em leitura é apresentado em um cartão amplo e imersivo (`ReadingNow` em modo `fullView`), com proporções generosas.
   - À esquerda (ou topo no mobile): Imagem da capa com proporção 2:3 e elevação delicada.
   - À direita (ou abaixo no mobile):
     - Título da obra em `Fraunces` Medium (20px).
     - Nome do autor e categoria em `Inter` Regular (14px).
     - Barra de progresso visual espessa (8px a 10px) com cantos arredondados e transição suave.
     - Indicador numérico tabular: *"Página 142 de 320 (44%) • Faltam 178 páginas"*.
     - Linha de Ação Rápida de Progresso: Campo numérico de entrada da página atual, botão *"Salvar"* e atalhos rápidos (`+10 pág.`, `+25 pág.`).
     - Botão *"Anotar no Journal"* com ícone `Feather` ou `BookOpen`.

---

## 3. Organização do Conteúdo
- Caso haja múltiplos livros em leitura simultânea, eles são organizados em uma pilha vertical com espaçamento generoso `--space-6` (24px) entre si.
- Cada cartão é um módulo independente e autocontido, permitindo atualizar o progresso de um livro sem afetar o estado visual dos demais.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície do Card: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Trilha da Barra de Progresso: `--surface-subtle` (`#F3EDE4` no Light / `#292023` no Dark).
  - Preenchimento da Barra: `--primary` (Vinho Marsala `#6B232D` no Light / Marsala Rose `#D46A78` no Dark).
  - Ícones de Ação: Cor `--text-secondary`, transitando para `--primary` em foco ou hover.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Títulos dos Livros: `Fraunces` SemiBold (20px).
  - Números de Páginas e Percentuais: `Inter` SemiBold com `font-variant-numeric: tabular-nums`.
- **Espaçamento:**
  - Padding interno dos cartões: 24px (desktop) e 16px (mobile).
  - Gap interno entre elementos: `--space-4` (16px).

---

## 5. Componentes e Padrões Visuais
- **Capa do Livro:** `aspect-ratio: 2 / 3` mantido rigorosamente. Borda suave de 1px em `--border`.
- **Controle de Atualização de Página:** Input numérico com altura de 44px, alinhado com o botão de confirmação.
- **Modal Seletor de Livro (`ReadingNow Picker`):**
  - Modal sobreposto com campo de busca interna entre os livros com status `nao-lido`.
  - Lista de livros com capas compactas (40×60px) e botão *"Iniciar Leitura"* em 1 clique.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Disposição horizontal do cartão de leitura: capa de 140px à esquerda, informações, barra de progresso e controles de página à direita.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Idem ao desktop com ajuste proporcional do padding.
- **Mobile ($< 768\text{px}$):**
  - O cartão se converte em layout vertical em coluna única.
  - A capa é centralizada no topo (largura de 120px a 140px).
  - O input numérico e o botão de salvar ocupam 100% da largura, facilitando o toque em telas sensíveis.
  - O botão de novo livro no cabeçalho se ajusta como ícone ou botão compacto de 44px.

---

## 7. Interações e Microanimações
- **Atualização de Páginas:** Ao salvar a nova página, a barra de progresso se expande com curva `ease-out` de 300ms, acompanhada de feedback tátil e sutil via toast.
- **Conclusão de Leitura:** Caso a página atual atinja o total de páginas da obra, o sistema apresenta feedback comemorativo discreto sugerindo a transição automática para o status `lido` e convite para escrever a resenha.

---

## 8. Estados de Interface
- **Estado Vazio (Sem Livros em Leitura):**
  - Ilustração editorial suave com ícone `BookOpen` (48px) em `--text-muted`.
  - Mensagem: *"Nenhum livro em leitura no momento."*
  - Subtítulo: *"Sua biblioteca pessoal está à espera. Escolha uma obra do seu acervo para iniciar uma nova jornada literária."*
  - Botão Primário: *"Escolher um Livro da Estante"*, abrindo imediatamente o picker de seleção.
- **Carregamento:** Skeleton screen simulando a capa e a barra de progresso horizontal.

---

## 9. Acessibilidade e Navegação por Teclado
- O input de página possui `type="number"`, `min="0"`, `max="{totalPages}"` e rótulo acessível via `aria-label="Atualizar página atual"`.
- Tecla `Enter` dentro do input de página dispara a atualização automaticamente sem exigir clique no botão.
- O picker de novo livro possui suporte completo a navegação por setas e tecla `Escape` para fechar.

---

## 10. Regras Específicas e Diferenciais desta Página
- Foco restrito a obras com `status === 'lendo'`.
- Ao contrário do acervo geral, cada livro aqui expõe controles operacionais de leitura imediata (input de progresso, atalhos rápidos e acesso direto às anotações de leitura).

