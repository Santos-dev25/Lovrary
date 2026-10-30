# Diretrizes de Página: Resenhas Críticas (`activeTab = "resenhas"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "resenhas"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L149), [`src/components/ResenhasPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ResenhasPage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do feed de resenhas críticas do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Minhas Resenhas" é a antologia crítica do leitor. Seu propósito é reunir em uma única linha editorial todas as impressões aprofundadas, ensaios breves e notas de avaliação de livros que o leitor já concluiu ou está analisando:
- Oferecer uma leitura fluida das resenhas registradas pelo leitor, funcionando como um blog literário pessoal.
- Exibir a avaliação formal por estrelas, o trecho da crítica e os contadores de anotações e citações correlacionadas.
- Permitir acesso instantâneo ao livro completo ao clicar sobre qualquer cartão de resenha.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho Editorial:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Minhas Resenhas"*.
   - Contador de resenhas à direita em `Inter` (ex.: *"14 resenhas"*), em números tabulares.
2. **Feed de Cartões de Resenha:**
   - Cada obra com resenha escrita ou notas cadastradas é apresentada em um cartão horizontal amplo e elegante.
   - À esquerda: Capa do livro na proporção 2:3 (64×96px no desktop, 56×84px no mobile), com elevação sutil e cantos arredondados de 8px.
   - À direita:
     - Título da obra em `Fraunces` SemiBold (18px) cor `--text-primary`.
     - Nome do autor em `Inter` Regular (13px) cor `--text-secondary`.
     - Classificação por estrelas douradas (`RatingStars` em tamanho compacto com nota visível).
     - Corpo da resenha formatado com elegância tipográfica e limitação inicial a 3 linhas com reticências suaves (*line-clamp-3*).
     - Rodapé com tags métricas discretas: contador de notas do Journal (`notes.length`) e contador de citações salvas (`quotes.length`) com ícone `Quote`.

---

## 3. Organização do Conteúdo
- Lista vertical fluida com espaçamento sistemático `--space-4` (16px) entre os cartões.
- As resenhas são ordenadas preferencialmente pela data de conclusão ou última atualização, mantendo o feed vivo e recente.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície dos Cartões: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Borda dos Cartões: `--border` (1px).
  - Estrelas de Avaliação: `--accent-gold` (`#855F14` no Light / `#E0A93B` no Dark).
  - Texto da Resenha: `--text-primary` com leitura relaxada.
  - Metadados de Apoio: `--text-muted` (contraste $\ge 4.5:1$).
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Título do Livro: `Fraunces` SemiBold (18px).
  - Corpo da Resenha: `Inter` Regular (14px a 15px), com entrelinha de 1.6 (`leading-relaxed`).
- **Espaçamento:**
  - Padding interno dos cartões: 20px a 24px (desktop) e 16px (mobile).

---

## 5. Componentes e Padrões Visuais
- **Cartão Editorial de Resenha:**
  - Hover com elevação suave (`translateY(-2px)` e expansão de sombra `--shadow-card-hover`).
  - Cursor pointer em todo o container do cartão.
  - A capa do livro atua como âncora visual reconhecível imediatamente pelo leitor.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Disposição horizontal com capa de 64×96px e margem generosa para o texto da crítica.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Idem ao desktop com ajuste proporcional do padding.
- **Mobile ($< 768\text{px}$):**
  - Mantém a estrutura horizontal compacta (capa de 50×75px para não consumir espaço excessivo na tela estreita).
  - O texto da crítica adota `line-clamp-2` para preservar a densidade de leitura do feed móvel.
  - Altura mínima de toque garantida para seleção do card.

---

## 7. Interações e Microanimações
- **Entrada em Cascata:** Os cartões entram na tela com animação sequencial sutil via `framer-motion` (`staggerChildren: 0.05`), transmitindo dinamismo visual leve.
- **Clique no Cartão:** Abre o `BookDetailModal` já ancorado na sub-aba *"Resenha"*, permitindo ao leitor ler o ensaio na íntegra ou editá-lo.

---

## 8. Estados de Interface
- **Estado Vazio (Sem Resenhas Escritas):**
  - Ícone `BookOpen` (44px) em `--text-muted`.
  - Título: *"Nenhuma resenha registrada ainda."*
  - Mensagem explicativa: *"Ao concluir uma leitura ou redigir suas impressões sobre um livro, suas resenhas críticas aparecerão reunidas aqui."*
  - Botão de ação: *"Explorar Leituras Ativas"*, direcionando para a aba de Lendo Agora.

---

## 9. Acessibilidade e Navegação por Teclado
- Cada cartão de resenha é focável por teclado com anel visível.
- A tecla `Enter` ou `Espaço` aciona a abertura dos detalhes do livro.
- As estrelas contêm rótulo audível (ex.: `aria-label="Avaliação: 4.5 de 5 estrelas"`).

---

## 10. Regras Específicas e Diferenciais desta Página
- Esta tela reúne exclusivamente obras que possuem produção reflexiva escrita pelo leitor (`b.review` ou `b.notes.length > 0`).
- Ao contrário do Acervo (focado em catalogação e status), esta página valoriza a palavra escrita e a memória de leitura do usuário.

