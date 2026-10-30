# Diretrizes de Página: Autenticação e Entrada (`/auth`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/auth`  
> **ARQUIVO FONTE:** [`src/pages/Auth.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da tela de autenticação. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A página `/auth` é o portal de entrada do Lovrary. Seu objetivo é acolher o leitor em um ambiente que transmita elegância editorial e serenidade imediata, eliminando a frieza típica de formulários de login corporativos. A página oferece três fluxos de acesso:
1. **Acesso Imediato sem Fricção (Modo Demonstração / Convidado):** Permite explorar 100% da biblioteca com dados locais no `localStorage`, sem depender de internet ou configuração do Supabase.
2. **Login com Conta Supabase:** Para sincronização em nuvem via e-mail e senha.
3. **Criação de Conta:** Cadastro simples com nome de exibição, e-mail e senha.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
- **Fundo da Tela:** Fundo unificado `--background` (papel linho no modo claro `#FAF7F2`; noir pergaminho no escuro `#140E10`). Não utilizar ilustrações 3D infantis nem gradientes neon.
- **Logotipo Editorial:** No topo centralizado, ícone do Lovrary (livro com detalhe dourado) acompanhado da tipografia `Fraunces` SemiBold em cor `--primary` (Marsala `#6B232D`), comunicando herança clássica e acolhimento.
- **Card Central Elevado:** Cartão com largura máxima de `440px`, borda sutil de 1px (`--border`), raio `--radius-xl` (16px) e elevação `--shadow-modal`.
- **Destaque do Modo Demonstração:** Posicionado estrategicamente no topo do card, como um convite tátil para degustação imediata da plataforma com botão enriquecido pelo ícone `Sparkles` dourado.
- **Divisor Editorial:** Linha fina de 1px com rótulo textual centralizado em caixa alta suave: *"OU COM SUA CONTA"*.
- **Alternador de Modo (Entrar / Criar Conta):** Abas em estilo pill contidas em container `--surface-subtle`.
- **Formulário com Labels Persistentes:** Cada campo possui ícone vetorial (`Mail`, `Lock`, `User`) e rótulo visível.

---

## 3. Organização do Conteúdo
1. **Cabeçalho de Boas-Vindas:**
   - Logotipo `LovraryLogo` (56px).
   - Título `h1` em `Fraunces` 28px: *"Lovrary"*.
   - Subtítulo em `Inter` 14px cor `--text-secondary`: *"Sua biblioteca pessoal e diário de leituras."*
2. **Cartão de Acesso:**
   - Botão de Acesso Rápido: *"Acessar no Modo Demonstração"*.
   - Separador estrutural com fundo do card.
   - Segmented Control (Entrar / Criar Conta).
   - Campos de Entrada:
     - `Nome` (visível apenas no modo "Criar Conta").
     - `Email` (com atributo `autoComplete="email"`).
     - `Senha` (com `autoComplete="current-password"` ou `"new-password"`).
   - Botão de Ação Primária: *"Entrar na minha biblioteca"* ou *"Criar minha biblioteca"*.
3. **Rodapé Alternador:** Link discreto no rodapé para alternância rápida entre os modos sem scroll.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície do Card: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Ação Principal: `--primary` (Marsala `#6B232D` no Light / Marsala Rose `#D46A78` no Dark).
  - Destaque Demo: Fundo sutil com borda dourada (`--accent-gold` `#855F14` no Light / `#E0A93B` no Dark).
- **Tipografia:**
  - Título do App: `Fraunces` SemiBold (28px).
  - Labels de Inputs: `Inter` Medium (13px), cor `--text-primary`.
  - Placeholder: `Inter` Regular (14px), cor `--text-secondary`.
  - Botão Primário: `Inter` Medium (14px).
- **Espaçamento:**
  - Padding interno do Card: 32px (Desktop/Tablet) e 20px (Mobile).
  - Gap entre campos: `--space-4` (16px).
  - Gap do botão de demonstração para o divisor: `--space-6` (24px).

---

## 5. Componentes e Padrões Visuais
- **Inputs:** Altura estrita de `44px` com preenchimento lateral compensado para o ícone (`pl-10`), borda de 1px em `--border`, anel de foco em `--border-focus` com anel difuso de 3px.
- **Botão Primário:** Fundo sólido `--primary`, texto `--primary-foreground`, raio `--radius-md` (8px), altura de 44px e efeito sutil de hover (`translateY(-1px)`).
- **Ícones:** Exclusivamente `lucide-react` (`BookOpen`, `Mail`, `Lock`, `User`, `Sparkles`, `Loader2`). Emojis banidos do markup.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Card centralizado perfeitamente na viewport vertical e horizontal. Respiro generoso de margens.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Idem ao desktop, card mantido em 440px de largura máxima.
- **Mobile ($< 768\text{px}$):**
  - O card ocupa `100%` da largura com padding de 16px nas laterais da tela (`max-w-sm`).
  - O cabeçalho com o logotipo reduz levemente (logo de 44px e texto de 24px) para evitar empurrar o botão de ação para baixo da dobra em telas pequenas (390×844px).
  - Nenhum elemento provoca overflow horizontal.

---

## 7. Interações e Microanimações
- **Alternância de Abas (Entrar / Criar Conta):** Transição de fundo animada suave via `framer-motion` ou CSS transition de 150ms.
- **Feedback de Clique:** O botão de demonstração apresenta rotação sutil do ícone de faísca (`group-hover:rotate-12 transition-transform duration-200`).
- **Submissão de Formulário:** Desabilita o botão, exibe spinner `Loader2` giratório e mantém a largura do botão estável sem saltos de layout (*layout shift*).

---

## 8. Estados de Interface
- **Carregando (Loading):** Botão desabilitado com opacidade 0.7 e spinner ativo.
- **Erro:** Notificação via Sonner toast ancorada no canto superior (ou topo central no mobile), com texto explicativo e borda na cor `--destructive`.
- **Sucesso:** Redirecionamento instantâneo para `/` com saudação calorosa.

---

## 9. Acessibilidade e Navegação por Teclado
- Ordem lógica de tabulação: [Modo Demo] $\to$ [Aba Entrar] $\to$ [Aba Criar Conta] $\to$ [Nome, se houver] $\to$ [Email] $\to$ [Senha] $\to$ [Botão Enviar] $\to$ [Alternador inferior].
- O atributo `aria-label` e IDs associados com `htmlFor` nos rótulos garantem leitura fluida por leitores de tela.
- Anéis de foco visíveis em todos os elementos focáveis via `focus-visible:ring-2`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Esta é a única página do Lovrary que não possui a barra lateral de navegação (`Sidebar`) nem a barra inferior mobile.
- Não há carregamento de livros ou estado de acervo nesta rota.
- Deve verificar ativamente no `useEffect` se já existe sessão no Supabase ou flag `lovrary_guest_session` no `localStorage`, redirecionando imediatamente para `/` caso o usuário já esteja autenticado.

