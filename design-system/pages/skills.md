# Diretrizes de Página: Maestria & Insígnias (`activeTab = "skills"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "skills"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L140), [`src/components/ReaderSkillsSection.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx), [`src/data/readerSkills.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/readerSkills.ts)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do sistema de maestria e insígnias literárias do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Maestria & Skills" é a celebração do desenvolvimento intelectual do leitor:
- Evitar uma gamificação ruidosa e infantil com confetes excessivos ou sirenes coloridas.
- Propor uma estética de honraria acadêmica clássica e medalhística nobre (tons de bronze, prata antiga, ouro lavrado e diamante sutil).
- Apresentar o título honorário de leitor (ex.: *"Leitor Voraz"*, *"Erudito da Estante"*, *"Bibliotecário de Histórias"*).
- Exibir as 16 insígnias calculadas dinamicamente a partir dos hábitos reais do usuário (livros lidos, notas no journal, citações destacadas e diversidade de gêneros).
- Abrir modal com os critérios transparentes de desbloqueio de cada insígnia ao clicar sobre ela.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho de Honraria:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Maestria Literária"*.
   - Subtítulo em `Inter` (14px): *"Suas leituras, anotações e citações desenvolvem seu perfil literário."*
2. **Painel do Nível do Leitor:**
   - Cartão com moldura elegante em `--surface`, destacando o Título Atual de Leitor em `Fraunces` SemiBold (22px).
   - Barra de evolução até o próximo título honorário com percentual em números tabulares.
   - Contador de insígnias conquistadas (ex.: *"9 de 16 insígnias desbloqueadas"*).
3. **Mural das 16 Insígnias Organizadas por Tiers:**
   - Seção 1: **Bronze** (Fundamentos de Hábito & Primeiras Páginas).
   - Seção 2: **Prata** (Constância & Diversidade de Gêneros).
   - Seção 3: **Ouro Nobre** (Aprofundamento Crítico & Diário Ativo).
   - Seção 4: **Diamante Raro** (Marcos Literários Excepcionais).
4. **Modal de Detalhes da Insígnia:**
   - Ao clicar em qualquer medalha (bloqueada ou conquistada), abre-se um diálogo elegante com o ícone em tamanho grande, nome da insígnia, descrição literária poética, barra de progresso do critério e data de conquista (quando aplicável).

---

## 3. Organização do Conteúdo
- Grid de cartões de medalhas divididos claramente por seções de prestígio (Bronze $\to$ Prata $\to$ Ouro $\to$ Diamante).
- As medalhas bloqueadas são representadas em tons sutis monocromáticos com ícone `Lock` discreto, mantendo a curiosidade e o estímulo sem parecerem quebradas.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores por Tier (Calibradas para Harmonia Editorial):**
  - **Bronze:** Fundo âmbar suave (`bg-amber-900/10`), borda em tom couro/bronze (`#8C5523`).
  - **Prata:** Fundo ardósia suave (`bg-slate-500/10`), borda prateada discreta (`#8A94A6`).
  - **Ouro Nobre:** Fundo com brilho dourado translúcido, borda e acento em `--accent-gold` (`#855F14` no Light / `#E0A93B` no Dark).
  - **Diamante Raro:** Fundo Marsala enriquecido com leve reflexo acetinado (`#6B232D` no Light / `#D46A78` no Dark).
- **Tipografia:**
  - Título Principal e Nome das Insígnias: `Fraunces` SemiBold.
  - Critérios e Descrições: `Inter` Regular (13px), com alto contraste de leitura.
- **Espaçamento:**
  - Grid de medalhas: 4 colunas no desktop, 2 colunas no mobile com gap de 16px.

---

## 5. Componentes e Padrões Visuais
- **Cartão de Insígnia (`ReaderSkillsSection`):**
  - Container quadrado com cantos arredondados `--radius-xl` (16px), borda de 1px.
  - Ícone central amplo em círculo sutil com cores do respectivo tier.
  - Indicador de estado: Selo de concluído (`CheckCircle2`) ou barra de progresso em miniatura.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Grade de 4 colunas para cada tier, permitindo visualização panorâmica da coleção de insígnias.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Grade de 3 colunas.
- **Mobile ($< 768\text{px}$):**
  - Grade de 2 colunas com proporções quadradas confortáveis.
  - O painel do nível de leitor no topo se ajusta para empilhar métricas verticalmente sem cortar texto.

---

## 7. Interações e Microanimações
- **Hover na Insígnia Conquistada:** Leve elevação com halo de luz suave nas cores do tier (`box-shadow` suave tingido pelo dourado ou Marsala).
- **Abertura do Modal de Detalhes:** Transição suave via `framer-motion` (fade e leve zoom).

---

## 8. Estados de Interface
- **Insígnia Conquistada:** Cores vivas do tier ativas, data de conquista gravada e selo de realização.
- **Insígnia em Progresso:** Cores desaturadas suaves com barra de avanço (ex.: *"7/10 livros lidos"*).
- **Insígnia Bloqueada:** Ícone de cadeado discreto com texto explicativo do desafio a ser superado.

---

## 9. Acessibilidade e Navegação por Teclado
- Todas as medalhas são focáveis via Tab com anel de foco bem delineado.
- Teclas `Enter` ou `Espaço` abrem o diálogo de detalhes da medalha com anúncio semântico via `aria-haspopup="dialog"`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Concentra toda a lógica de conquistas baseada no motor [`src/data/readerSkills.ts`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/readerSkills.ts).
- É a área lúdica e de reconhecimento do Lovrary, projetada com sobriedade aristocrática para afastar a estética de jogos descartáveis.

