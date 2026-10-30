# Diretrizes de Página: Início / Dashboard (`activeTab = "dashboard"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "dashboard"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx), [`src/components/ImmersiveReadingHero.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx), [`src/components/ReadingNow.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx), [`src/components/StatsPanel.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPanel.tsx), [`src/components/RecentActivity.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/RecentActivity.tsx), [`src/components/ReaderSkillsSection.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da tela inicial do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Início" é o coração caloroso do Lovrary. Seu propósito é reconectar o leitor instantaneamente com seu momento de leitura atual:
- Mostrar o livro que está sendo lido agora com sua capa em destaque majestoso, percentual de conclusão e atalhos rápidos para o Journal de anotações.
- Oferecer uma visão inspiradora do ritmo de leitura (dias consecutivos, livros concluídos no ano e páginas lidas).
- Apresentar o feed de reflexões e as adições mais recentes à estante pessoal.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Hero Imersivo de Leitura (`ImmersiveReadingHero`):**
   - Bloco visual dominante com fundo suave em degradê sutil e acolhedor (vinho Marsala escurecido suave e borda delicada de 1px).
   - Apresenta a capa do livro em leitura na proporção 2:3, com elevação elegante e sombra difusa.
   - Barra de progresso visual de leitura refinada com indicador numérico tabular.
   - Botões de ação direta: *"Anotar no Journal"* e *"Explorar Acervo"*.
   - Caso nenhum livro esteja com status `lendo`, o Hero atua como um convite poético: *"Sua poltrona de leitura está pronta. Que história vamos começar hoje?"*, com botão para escolher um livro da estante.
2. **Faixa Compacta de Maestria Literária (`ReaderSkillsSection compact`):**
   - Faixa horizontal com o nível do leitor, progresso até o próximo título e as últimas insígnias desbloqueadas em pequenos chips dourados e prateados.
3. **Painel de Resumo Rápido (`StatsPanel`):**
   - 4 cartões métricos alinhados em grid: Livros no Acervo, Lendo Agora, Meta Anual (%) e Páginas Registradas.
4. **Grid Duplo Balanceado (Desktop):**
   - Coluna Esquerda: Cartão compacto `ReadingNow` (gerenciamento rápido de página do livro ativo).
   - Coluna Direita: `RecentActivity` (feed com as últimas notas de journal, conclusões e avaliações).
5. **Seção de Últimas Adições:**
   - Título editorial `h3` em `Fraunces`: *"Últimas Adições ao Acervo"*.
   - Grid horizontal de 5 cards de livros (`BookCard`) com capas destacadas e clique para detalhes.

---

## 3. Organização do Conteúdo
- O ritmo vertical da tela utiliza espaçamento sistemático `--space-6` (24px) e `--space-8` (32px), evitando a sensação de um dashboard administrativo comprimido.
- Os cartões possuem respiro interno generoso (20px a 24px) e cantos arredondados `--radius-xl` (16px).

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores:**
  - Fundo geral: `--background` (`#FAF7F2` no Light / `#140E10` no Dark).
  - Superfície dos Cartões: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Detalhe de Barra de Progresso: `--primary` (Marsala) preenchendo trilha em `--surface-subtle`.
  - Acentos Dourados: Ícones de chama literária (ofensiva) e troféu utilizam `--accent-gold`.
- **Tipografia:**
  - Saudação do Hero e Título da Seção: `Fraunces` SemiBold (24px / 28px).
  - Título do Livro no Hero: `Fraunces` Medium (20px).
  - Números e Métricas: `Inter` SemiBold com `font-variant-numeric: tabular-nums`.
  - Rótulos e Metadados: `Inter` Regular (13px / 14px), cor `--text-secondary`.
- **Espaçamento:**
  - Grid de Últimas Adições: 5 colunas no desktop, 3 no tablet, 2 no mobile com gap de 16px.

---

## 5. Componentes e Padrões Visuais
- **Capa do Livro no Hero:** A capa deve ser renderizada com `aspect-ratio: 2 / 3`, borda sutil de 1px e `border-radius: var(--radius-lg)`. Estão banidas classes de lombada falsa 3D pesadas (`.book-spine-effect`) e ornamentos excessivos.
- **Cartões de Métrica (`StatsPanel`):** Ícone em container circular discreto, valor numérico destacado e legenda abaixo com contraste $\ge 4.5:1$.
- **Feed de Atividades (`RecentActivity`):** Linha do tempo visual suave com pequenos pontos demarcadores e citações de notas em estilo itálico poético.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Hero em layout horizontal de 2 colunas (capa à esquerda ou direita, texto e controles ao lado). Grid de 2 colunas para `ReadingNow` e `RecentActivity`. Grid de 5 colunas para as últimas adições.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Hero mantém disposição horizontal ou vertical fluida. Grid de métricas em 2×2.
- **Mobile ($< 768\text{px}$):**
  - O Hero se organiza verticalmente com a capa centralizada (largura de 140px a 160px).
  - Os botões de ação ocupam largura total (`w-full`) com altura de 44px para facilitar o toque com o polegar.
  - O grid duplo de `ReadingNow` e `RecentActivity` se transforma em pilha vertical de coluna única.
  - O grid de últimas adições adota 2 colunas com proporção mantida.

---

## 7. Interações e Microanimações
- **Entrada da Tela:** Animação suave `fade-in` de 200ms com leve deslocamento vertical de 4px (`translateY(4px) -> translateY(0)`).
- **Hover nos Cards de Livro:** Elevação sutil de 2px a 3px com transição de sombra em 200ms (`ease-out`).
- **Atualização de Progresso:** Ao atualizar a página lida, a barra de progresso anima fluidamente sem recarregar a tela.

---

## 8. Estados de Interface
- **Estado Vazio (Sem Livros em Leitura):** O Hero não exibe erro nem fica em branco; exibe um convite editorial para selecionar uma obra do acervo ou adicionar um novo livro.
- **Estado Vazio (Biblioteca Recém-Criada):** Cartão de boas-vindas incentivando o leitor a adicionar seu primeiro livro com o botão de busca rápida.
- **Carregamento:** Skeleton screens sutis respeitando a geometria dos cards, sem spinners bloqueantes no centro da tela.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco claramente delineado ao navegar por Tab entre os cards de livros e botões do Hero.
- A barra de progresso possui os atributos semânticos `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"` e `aria-valuemax="100"`.
- Textos alternativos das capas trazem o nome do livro e do autor de forma descritiva.

---

## 10. Regras Específicas e Diferenciais desta Página
- Esta é a única tela do aplicativo que reúne um resumo executivo transversal de todas as outras áreas (leitura ativa, estatísticas, maestria, journal e acervo).
- Serve como ponto de ancoragem para o leitor retornar após qualquer sessão de registro literário.

