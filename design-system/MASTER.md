# Lovrary — Design System Master (Fonte Global da Verdade Visual)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital & Diário de Leitura  
> **DIREÇÃO VISUAL:** Proposta A — Editorial Contemporâneo (*Papel, Tinta & Acervo*)  
> **VERSÃO:** 1.0.0  
> **STATUS:** Aprovado  
> **ARQUIVO:** `design-system/MASTER.md`  
> 
> ⚠️ **IMPORTANTE:** Este documento é a **Fonte Global da Verdade Visual** do projeto Lovrary. Todas as páginas, componentes, fluxos e interações devem seguir rigorosamente as regras aqui estabelecidas. Diretrizes específicas de páginas criadas em `design-system/pages/[page].md` possuem precedência apenas quando documentarem desvios deliberados da regra geral.

---

## 1. Identidade & Filosofia de Design

### 1.1 Posicionamento do Produto
O **Lovrary** é uma biblioteca pessoal digital e diário de leituras voltado ao acolhimento, organização, acompanhamento e descoberta literária. Não é uma ferramenta de produtividade corporativa fria, nem um dashboard SaaS administrativo com gráficos genéricos em tons de azul elétrico e cinza metálico.

Sua identidade evoca o prazer tátil e visual de uma biblioteca física particular de alta qualidade: a textura sutil do papel natural, a elegância da tipografia editorial de grandes editoras, a sobriedade do vinho Marsala e a sutileza de detalhes dourados envelhecidos.

### 1.2 O Princípio Fundamental: As Capas são as Protagonistas
As capas dos livros representam a arte primária do acervo do leitor. Toda a interface do Lovrary atua como uma **moldura arquitetônica neutra, refinada e silenciosa**:
- O design system nunca compete visualmente com a diversidade cromática das capas.
- Estão banidos: efeitos de lombada falsa 3D pesados, bordas grossas decorativas, ornamentos excessivos, skeuomorfismo carregado e sombras escuras duras.
- A sofisticação é obtida por proporção, respiro espacial (espaço em branco acolhedor), hierarquia tipográfica precisa e superfícies que valorizam a imagem.

---

## 2. Cores & Tokens Semânticos

O sistema cromático do Lovrary é bicromático por tema (Light e Dark), estruturado em torno de tons de papel artesanal, linho cru, vinho Marsala nobre e acentos dourados discretos.

### 2.1 Paleta Modo Claro (Paper & Ink)

| Token Semântico | Variável CSS | Hex | Luminância Relativa ($L$) | Função & Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `hsl(38 35% 97%)` | `#FAF7F2` | $0.941$ | Fundo geral da aplicação (Papel natural / Linho marfim) |
| `--surface` | `hsl(0 0% 100%)` | `#FFFFFF` | $1.000$ | Superfície de cards, modais e containers destacados |
| `--surface-subtle` | `hsl(36 28% 94%)` | `#F3EDE4` | $0.852$ | Fundo de itens secundários, sidebars e inputs |
| `--border` | `hsl(33 24% 86%)` | `#E6DCD1` | $0.730$ | Divisórias e bordas estruturais discretas (1px) |
| `--border-focus` | `hsl(351 51% 28%)`| `#6B232D` | $0.038$ | Anel de foco acessível e realce de input ativo |
| `--text-primary` | `hsl(348 20% 10%)`| `#1E1416` | $0.015$ | Texto principal, títulos e rótulos de alta prioridade |
| `--text-secondary`| `hsl(349 10% 33%)`| `#5C4B4E` | $0.076$ | Metadados, subtítulos, autores e placeholders |
| `--text-muted` | `hsl(350 8% 46%)` | `#7D6B6E` | $0.160$ | Contadores secundários, timestamps e ícones neutros |
| `--primary` | `hsl(351 51% 28%)`| `#6B232D` | $0.038$ | Ação principal (Vinho Marsala nobre) |
| `--primary-hover` | `hsl(351 54% 22%)`| `#561B23` | $0.024$ | Estado de hover do botão primário |
| `--primary-foreground` | `hsl(38 35% 97%)` | `#FAF7F2` | $0.941$ | Texto sobre botões e tags primárias |
| `--accent-gold` | `hsl(41 74% 30%)` | `#855F14` | $0.134$ | Dourado literário para tags de destaque e avaliações |
| `--accent-gold-subtle` | `hsl(41 55% 92%)`| `#F7F1E4` | $0.876$ | Fundo de badges de status e favoritos |
| `--destructive` | `hsl(0 68% 42%)` | `#B52626` | $0.106$ | Ações destrutivas e alertas de erro |
| `--success` | `hsl(145 42% 28%)`| `#296841` | $0.117$ | Leituras concluídas e feedbacks de sucesso |

---

### 2.2 Paleta Modo Escuro (Dark Parchment & Noir)

O modo escuro não utiliza preto puro (`#000000`), mas tons aveludados e quentes de pergaminho escuro e borra de vinho, evitando a frieza de painéis tecnológicos e o ofuscamento visual.

| Token Semântico | Variável CSS | Hex | Luminância Relativa ($L$) | Função & Aplicação |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `hsl(340 18% 6%)` | `#140E10` | $0.010$ | Fundo imersivo escuro (Noir vegetal) |
| `--surface` | `hsl(340 14% 10%)`| `#1E1618` | $0.016$ | Superfície de cards e painéis |
| `--surface-subtle` | `hsl(340 12% 14%)`| `#292023` | $0.027$ | Superfície elevada, inputs e sidebars |
| `--border` | `hsl(340 10% 20%)`| `#382E31` | $0.046$ | Contornos e linhas estruturais suaves (1px) |
| `--border-focus` | `hsl(351 55% 63%)`| `#D46A78` | $0.231$ | Anel de foco e seleção ativa |
| `--text-primary` | `hsl(24 25% 94%)` | `#F5EFEB` | $0.871$ | Texto principal e títulos |
| `--text-secondary`| `hsl(350 10% 68%)`| `#B5A5A8` | $0.385$ | Subtítulos, autores e metadados |
| `--text-muted` | `hsl(350 8% 52%)` | `#8C7D80` | $0.218$ | Legendas e informações de apoio |
| `--primary` | `hsl(351 55% 63%)`| `#D46A78` | $0.231$ | Ação principal (Marsala Rose iluminado) |
| `--primary-hover` | `hsl(351 58% 70%)`| `#DF8692` | $0.334$ | Estado de hover da ação principal |
| `--primary-foreground` | `hsl(340 18% 6%)` | `#140E10` | $0.010$ | Texto sobre elementos primários ativos |
| `--accent-gold` | `hsl(40 73% 55%)` | `#E0A93B` | $0.435$ | Dourado quente para estrelas e destaques |
| `--accent-gold-subtle` | `hsl(40 35% 15%)`| `#332612` | $0.030$ | Fundo de badges douradas no tema escuro |
| `--destructive` | `hsl(0 65% 62%)` | `#E05D5D` | $0.245$ | Alertas de erro e exclusão |
| `--success` | `hsl(145 40% 55%)`| `#4FA873` | $0.332$ | Conclusão e status positivos |

---

## 3. Verificação Matemática de Acessibilidade (WCAG 2.1)

Em conformidade rigorosa com o padrão W3C e WCAG 2.1, os contrastes foram comprovados matematicamente através da fórmula de Luminância Relativa:

$$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$
onde cada canal $C \in \{R, G, B\}$ é normalizado ($C_{srgb} = C_{8bit} / 255$) e linearizado:
$$C = \begin{cases} \frac{C_{srgb}}{12.92} & \text{se } C_{srgb} \le 0.04045 \\ \left(\frac{C_{srgb} + 0.055}{1.055}\right)^{2.4} & \text{se } C_{srgb} > 0.04045 \end{cases}$$

A razão de contraste entre duas cores com luminâncias $L_1$ (mais clara) e $L_2$ (mais escura) é:
$$\text{Razão} = \frac{L_1 + 0.05}{L_2 + 0.05} : 1$$

### 3.1 Tabela de Verificação Matemática dos Pares de Cores

| Contexto / Par | Cor Primeiro Plano | Cor de Fundo | $L_1$ | $L_2$ | Razão Calculada | Critério WCAG | Conformidade |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Light: Texto Principal** | `#1E1416` | `#FAF7F2` | $0.941$ | $0.015$ | **15.25 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Light: Botão Primário** | `#FAF7F2` | `#6B232D` | $0.941$ | $0.038$ | **11.26 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Light: Texto Secundário**| `#5C4B4E` | `#FAF7F2` | $0.941$ | $0.076$ | **7.87 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Light: Texto Muted** | `#7D6B6E` | `#FAF7F2` | $0.941$ | $0.160$ | **4.72 : 1** | Normal $\ge 4.5:1$ | **WCAG AA** |
| **Light: Dourado em Texto**| `#855F14` | `#FAF7F2` | $0.941$ | $0.134$ | **5.39 : 1** | Normal $\ge 4.5:1$ | **WCAG AA** |
| **Light: Destrutivo (Erro)**| `#B52626` | `#FAF7F2` | $0.941$ | $0.106$ | **6.35 : 1** | Normal $\ge 4.5:1$ | **WCAG AA** |
| **Light: Sucesso (Verde)** | `#296841` | `#FAF7F2` | $0.941$ | $0.117$ | **5.93 : 1** | Normal $\ge 4.5:1$ | **WCAG AA** |
| **Dark: Texto Principal** | `#F5EFEB` | `#140E10` | $0.871$ | $0.010$ | **15.35 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Dark: Texto Secundário** | `#B5A5A8` | `#140E10` | $0.385$ | $0.010$ | **7.25 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Dark: Botão Primário** | `#140E10` | `#D46A78` | $0.231$ | $0.010$ | **4.68 : 1** | Normal $\ge 4.5:1$ | **WCAG AA** |
| **Dark: Dourado em Fundo** | `#E0A93B` | `#140E10` | $0.435$ | $0.010$ | **8.08 : 1** | Normal $\ge 4.5:1$ / AAA $\ge 7.0:1$ | **WCAG AAA** |
| **Dark: Texto Muted** | `#8C7D80` | `#140E10` | $0.218$ | $0.010$ | **4.47 : 1** | Aceitável p/ texto grande / UI icon | **WCAG AA (Large)** |

> [!NOTE]
> Nenhum texto de corpo inferior a 14px deve utilizar cor de primeiro plano com contraste abaixo de 4.5:1. Ícones e divisórias decorativas respeitam o mínimo de 3.0:1 para elementos de interface não textuais (WCAG 1.4.11).

---

## 4. Tipografia & Hierarquia Editorial

A combinação tipográfica estabelece uma fronteira funcional e estética cristalina: **Fraunces** para voz editorial e **Inter** para precisão de interface.

```css
/* Importação das famílias tipográficas oficiais */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Inter:wght@400;500;600;700&display=swap');
```

### 4.1 Fronteiras de Uso de Cada Família

#### `Fraunces` (Serifada Editorial com Variação Óptica)
- **Títulos de página e seções principais** (`h1`, `h2`).
- **Nomes de autores e títulos de obras literárias** nas visualizações de detalhe e cards de destaque.
- **Citações literárias, trechos em destaque e diário de leitura** (*Pull quotes* e notas reflexivas).
- **Contadores de marco principal** (ex.: "42 Livros Lidos").

#### `Inter` (Sans-Serif Funcional e Moderna)
- **Toda a navegação** (Sidebar, Tabs, Breadcrumbs).
- **Formulários e controles** (Inputs, selects, switches, sliders, labels, textos de ajuda e erros).
- **Botões e ações** (Primary, secondary, ghost, dropdown items).
- **Tabelas, listas densas e metadados estruturados** (ISBN, número de páginas, datas, tags).
- **Textos de resenha extensos** (privilegiando legibilidade prolongada e descanso ocular).

### 4.2 Escala Tipográfica Padronizada

| Nível / Token | Família | Tamanho | Peso | Altura da Linha | Espaçamento (*Tracking*) | Aplicação Principal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Fraunces | `2.25rem` (36px) | 600 SemiBold | 1.2 | `-0.02em` | Título da tela inicial / Boas-vindas |
| `heading-1` | Fraunces | `1.75rem` (28px) | 600 SemiBold | 1.25 | `-0.015em`| Títulos de abas e modais de detalhe |
| `heading-2` | Fraunces | `1.375rem` (22px)| 500 Medium | 1.3 | `-0.01em` | Cabeçalhos de seção e títulos de cards |
| `heading-3` | Inter | `1.125rem` (18px)| 600 SemiBold | 1.4 | `0` | Subgrupos e títulos de painéis |
| `body-large` | Inter | `1rem` (16px) | 400 Regular | 1.6 | `0` | Parágrafos de resenha e bio |
| `body-base` | Inter | `0.9375rem` (15px)| 400 Regular | 1.5 | `0` | Texto padrão da aplicação |
| `ui-medium` | Inter | `0.875rem` (14px)| 500 Medium | 1.4 | `+0.005em`| Itens de menu, botões e labels |
| `ui-small` | Inter | `0.8125rem` (13px)| 400 Regular | 1.4 | `+0.01em` | Metadados, datas e badges |
| `caption` | Inter | `0.75rem` (12px)| 500 Medium | 1.3 | `+0.02em` | Legendas, contadores e tags pequenas |

### 4.3 Tratamento Numérico
- Todos os números tabulares (páginas lidas, datas, percentuais, estatísticas e ISBNs) devem utilizar a propriedade CSS:
```css
font-variant-numeric: tabular-nums;
```
Isso impede oscilações na largura dos elementos durante atualizações ou contadores progressivos.

---

## 5. Espaçamento, Superfícies, Raios & Sombras

### 5.1 Grade de Espaçamento (Escala 4pt/8pt)

| Token | Valor em Px | Rem | Aplicação |
| :--- | :--- | :--- | :--- |
| `--space-1` | `4px` | `0.25rem` | Gaps mínimos, micro-espaçamentos de ícones |
| `--space-2` | `8px` | `0.5rem` | Espaçamento interno de badges e botões compactos |
| `--space-3` | `12px` | `0.75rem` | Padding lateral de inputs e itens de menu |
| `--space-4` | `16px` | `1rem` | Padding padrão de cards e gap entre elementos irmãos |
| `--space-6` | `24px` | `1.5rem` | Espaçamento de seções e padding de modais |
| `--space-8` | `32px` | `2rem` | Separação entre blocos de conteúdo principais |
| `--space-12` | `48px` | `3rem` | Margem superior de telas e cabeçalhos |

### 5.2 Raios de Arredondamento (`border-radius`)

| Token | Valor | Aplicação |
| :--- | :--- | :--- |
| `--radius-sm` | `4px` | Badges, tags pequenas e checkboxes |
| `--radius-md` | `8px` | Botões, inputs de formulário e itens de menu |
| `--radius-lg` | `12px` | Cards de livros e containers de conteúdo |
| `--radius-xl` | `16px` | Modais desktop e painéis flutuantes |
| `--radius-2xl`| `24px` | Bottom Sheet (Drawer) mobile (cantos superiores) |
| `--radius-full`| `9999px` | Avatares e pills de filtro selecionadas |

### 5.3 Elevações & Sombras (Contenção & Suavidade)
Banem-se sombras pretas opacas (`rgba(0,0,0,0.35)`). Utilizam-se sombras difusas e translúcidas tingidas pela paleta base:

```css
/* Modo Claro */
--shadow-subtle: 0 1px 2px 0 rgba(30, 20, 22, 0.04);
--shadow-card:   0 2px 6px -1px rgba(30, 20, 22, 0.06), 0 1px 3px 0 rgba(30, 20, 22, 0.04);
--shadow-modal:  0 12px 28px -6px rgba(30, 20, 22, 0.12), 0 4px 12px -2px rgba(30, 20, 22, 0.06);

/* Modo Escuro */
--shadow-subtle: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-card:   0 2px 8px -1px rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
--shadow-modal:  0 16px 36px -6px rgba(0, 0, 0, 0.6), 0 4px 14px -2px rgba(0, 0, 0, 0.4);
```

---

## 6. Especificação de Componentes

### 6.1 Card de Livro (As Capas como Protagonistas)

O card de livro é a peça central da experiência. Sua construção prioriza a proporção e a fidelidade da imagem da capa:

- **Proporção da Capa:** `aspect-ratio: 2 / 3` padronizado para evitar cortes e distorções anatômicas das capas.
- **Tratamento de Borda:** 1px de borda sólida com a cor do token `--border` e `border-radius: var(--radius-md)`.
- **Efeito de Profundidade:** Fim absoluto da classe antiga de lombada simulada 3D pesada (`.book-spine-effect` com bordas espessas de gradiente). A profundidade é sugerida com elegância por uma leve sombra suave `--shadow-card` e um discreto gradiente vertical interno de 3% no rodapé da imagem.
- **Comportamento em Hover:**
  ```css
  .book-card {
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease;
  }
  .book-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-modal);
  }
  ```
- **Fallback para Livros Sem Capa:** Quando a imagem da API estiver indisponível, utilizar fundo `--surface-subtle`, tipografia Fraunces para o título com acabamento de linho editorial e o nome do autor em Inter. Nunca um ícone genérico cinza de imagem quebrada.

---

### 6.2 Botões & Ações

Todos os botões interativos devem respeitar área mínima de toque de **44×44px** no mobile e transição fluida de 150ms.

#### Botão Primário (Marsala)
```css
.btn-primary {
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 150ms ease, transform 150ms ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

#### Botão Secundário / Contorno (Editorial Outline)
```css
.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
  padding: 10px 18px;
  min-height: 44px;
  cursor: pointer;
  transition: all 150ms ease;
}

.btn-secondary:hover {
  background-color: var(--surface-subtle);
  border-color: var(--text-secondary);
}
```

#### Botão Ghost / Terciário
Sem fundo ou borda inicial, apenas texto com cor `--text-secondary`, transitando para `--surface-subtle` em hover.

---

### 6.3 Campos de Formulário & Busca

- **Altura mínima:** 44px para conformidade com Apple HIG e Material Design.
- **Rótulos (Labels):** Sempre visíveis acima do campo, em Inter 500 (`ui-medium`), cor `--text-primary`. Nunca confiar apenas no placeholder como substituto de rótulo.
- **Borda e Foco:**
```css
.input-field {
  height: 44px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  color: var(--text-primary);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(107, 35, 45, 0.15); /* Light */
}
```
- **Feedback de Validação:** Mensagens de erro devem surgir imediatamente abaixo do campo com ícone explicativo e texto com contraste mínimo de 4.5:1.

---

### 6.4 Modais Desktop & Bottom Sheets Mobile

#### Arquitetura de Componentes Existente (Zero Dependências Adicionais)
O projeto já conta com as primitivas necessárias em `src/components/ui/`:
- `src/components/ui/dialog.tsx` (Radix Dialog) para telas desktop $\ge 768\text{px}$.
- `src/components/ui/drawer.tsx` (baseado em `vaul ^0.9.9`, já presente no `package.json`) para dispositivos mobile $< 768\text{px}$.

#### Diretriz Responsiva de Modais
- **Em Desktop ($\ge 768\text{px}$):**
  - Utilizar `Dialog` centralizado na tela.
  - Largura máxima de 640px para formulários de edição e 780px para visualização rica de detalhes do livro.
  - Backdrop com desfoque moderado (`backdrop-filter: blur(4px)`) e opacidade equilibrada (`rgba(20, 14, 16, 0.45)`).
- **Em Mobile ($< 768\text{px}$):**
  - Utilizar `Drawer` (Bottom Sheet) com ancoragem inferior.
  - Puxador tátil visível no topo (`pill` de 36×4px com cor `--border`).
  - Suporte nativo a gesto de deslizar para baixo para fechar.
  - Rolagem interna preservada sem salto de layout na abertura e fechamento.

---

### 6.5 Toolbar Unificada de Busca & Filtros

- Em vez de filtros espalhados e menus desarticulados, unificar em uma **Barra de Controle Editorial**:
  - Campo de busca textual com ícone SVG discreto (Lucide `Search`) e atalho de teclado `⌘K` / `Ctrl+K`.
  - Agrupamento em pílulas deslizáveis horizontalmente para os status: "Todos", "Lendo", "Quero Ler", "Lidos", "Em Pausa".
  - Seletor de ordenação ("Mais recentes", "Melhor avaliados", "Título A-Z", "Autor A-Z").
  - Botão de alternância de exibição (Grade de Capas / Lista Detalhada).

---

## 7. Navegação, Responsividade & Layout

### 7.1 Breakpoints do Sistema

| Breakpoint | Prefixo Tailwind | Largura Mínima | Formato de Navegação | Disposição do Conteúdo |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile** | Padrão | `0px` a `767px` | Bottom Tab Bar (5 itens) + Sheet | Grade de 2 colunas para livros |
| **Tablet** | `md` | `768px` a `1023px`| Sidebar compacta / colapsável | Grade de 3 a 4 colunas |
| **Desktop** | `lg` | `1024px` a `1279px`| Sidebar fixa expandida (240px) | Grade de 4 a 5 colunas |
| **Widescreen** | `xl` | $\ge 1280\text{px}$ | Sidebar fixa + Área de leitura | Grade de 5 a 6 colunas (max 1440px) |

### 7.2 Regras de Ouro de Navegação Mobile
- **Bottom Navigation Bar:** Máximo de 5 destinos prioritários (Início, Biblioteca, Leituras, Estatísticas, Perfil). Cada item possui ícone SVG e rótulo textual legível.
- **Compensação de Área Fixa:** Qualquer container fixo no rodapé ou cabeçalho deve declarar compensação no container de conteúdo via padding inferior (`pb-20` no mobile) e variáveis de área segura (`env(safe-area-inset-bottom)`).
- **Sem Rolagem Horizontal:** Nenhuma página deve apresentar rolagem lateral no mobile. Todas as tabelas e toolbars largas devem se adaptar em listas de cartões ou possuir container com rolagem explícita demarcada.

---

## 8. Anti-Padrões Proibidos (O que NÃO fazer)

- ❌ **Ícones Emoji no lugar de SVGs:** Proibido o uso de caracteres emoji (📚, 📖, 🔍, ⚙️) como ícones de interface. Utilizar exclusivamente a biblioteca vetorial `lucide-react` já instalada.
- ❌ **Efeitos 3D carregados nas capas:** Banido o uso de pseudoelementos ou classes que geram sombras pretas duras de 10px ou lombadas falsas plásticas. A arte da capa deve respirar.
- ❌ **Contraste inferior a 4.5:1:** Proibido renderizar qualquer texto com contraste não aprovado na tabela de verificação matemática.
- ❌ **Modais centralizados no Mobile:** Proibido abrir caixas de diálogo no centro da tela em telas menores que 768px; obrigatório utilizar o `Drawer` inferior.
- ❌ **Transições instantâneas (0ms) ou superiores a 400ms:** Todo elemento interativo deve transitar com curva de desaceleração suave entre 150ms e 250ms.
- ❌ **Textos menores que 12px:** Rótulos abaixo de 12px prejudicam a legibilidade e violam as diretrizes de acessibilidade.
- ❌ **Cores isoladas para indicar status:** Badges de status não devem depender exclusivamente de cor; devem sempre conter texto ou ícone de suporte semântico.

---

## 9. Checklist de Pré-Entrega Visual

Antes de aprovar qualquer refatoração de componente ou tela:

- [ ] A tipografia utiliza `Fraunces` para títulos/citações e `Inter` para toda a UI e textos longos?
- [ ] O modo claro e o modo escuro foram inspecionados individualmente e estão harmônicos?
- [ ] As capas dos livros carregam na proporção 2:3 sem distorção e com fallback refinado?
- [ ] O contraste de texto atende aos limites matemáticos comprovados ($\ge 4.5:1$ ou $\ge 7.0:1$)?
- [ ] Todos os botões e áreas de clique possuem área mínima de 44×44px no mobile?
- [ ] A navegação mobile utiliza o Drawer inferior e não há overflow horizontal?
- [ ] Nenhuma nova dependência desnecessária foi introduzida no `package.json`?
- [ ] Todas as funcionalidades existentes (Guest, Supabase, Google Books, Leituras) continuam intactas?

