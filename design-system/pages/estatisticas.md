# Diretrizes de Página: Registros & Estatísticas (`activeTab = "stats"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "stats"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L145), [`src/components/StatsPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do módulo de análise de dados e estatísticas do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Registros de Leitura" é o observatório analítico do leitor. Seu propósito é transformar a jornada literária em percepção e auto-conhecimento:
- Quantificar livros concluídos, volume de páginas lidas e nota média concedida.
- Revelar o ritmo de leitura ao longo dos meses através de gráficos claros e acessíveis.
- Analisar os gêneros literários mais explorados.
- Permitir a navegação histórica por anos anteriores de leitura.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho & Controles de Filtro:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Registros de Leitura"*.
   - Barra de Filtros:
     - Seletor de Ano Histórico: Dropdown com anos em que houve leituras registradas (`yearFilter`).
     - Seletor de Categoria: Dropdown para isolar o desempenho em gêneros específicos (`categoryFilter`).
2. **Quarteto de Cartões de Métrica (`statCards`):**
   - 4 cartões em grid:
     - 1. *Livros Lidos* (ex.: "18 livros em 2026").
     - 2. *Páginas Lidas* (ex.: "5.420 páginas").
     - 3. *Mês Destaque* (ex.: "Julho — 4 livros").
     - 4. *Nota Média* (ex.: "4.6 de 5 estrelas").
   - Cada cartão possui ícone temático (`BookOpen`, `TrendingUp`, `Award`, `Target`), valor numérico de grande porte e legenda temporal.
3. **Gráfico de Leituras por Mês (Recharts):**
   - Cartão amplo com o gráfico de barras dos 12 meses do ano.
   - Eixo horizontal com nomes dos meses (Jan a Dez).
   - Barras preenchidas com o tom `--primary` (Marsala), com realce no mês de maior destaque.
   - Tooltip flutuante refinado com fundo escuro aveludado e tipografia legível.
4. **Mural de Distribuição por Gênero:**
   - Painel com barras horizontais proporcionais para cada gênero literário lido, indicando percentual e quantidade absoluta.

---

## 3. Organização do Conteúdo
- Grid de 4 cartões no topo $\to$ Gráfico anual de barras no centro $\to$ Distribuição por categorias na base.
- Espaçamento vertical sistemático `--space-6` (24px) entre os blocos analíticos.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície dos Cartões: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Barras do Gráfico: `--primary` (`#6B232D` no Light / `#D46A78` no Dark).
  - Barra do Mês Destaque: `--accent-gold` (`#855F14` no Light / `#E0A93B` no Dark).
  - Linhas de Grade do Gráfico: Cor `--border` com opacidade reduzida (0.5), evitando poluição visual.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Números das Métricas Principais: `Inter` Bold (28px a 32px) com `font-variant-numeric: tabular-nums`.
  - Rótulos dos Eixos e Meses: `Inter` Medium (12px), cor `--text-secondary`.
- **Espaçamento:**
  - Padding dos cartões de métrica: 20px.
  - Altura do gráfico de barras: 260px a 300px no desktop; 200px a 220px no mobile.

---

## 5. Componentes e Padrões Visuais
- **Gráfico Recharts:**
  - `ResponsiveContainer` com largura de 100%.
  - `CartesianGrid` com traço tracejado (`strokeDasharray="3 3"`).
  - Barras com cantos superiores arredondados (`radius={[4, 4, 0, 0]}`).
  - Tooltip customizado com cantos `--radius-md` (8px), fundo `--surface` e borda em `--border`.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Cartões de métrica em 4 colunas alinhadas. Gráfico com todas as 12 legendas dos meses visíveis confortavelmente.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Cartões de métrica em grade 2×2.
- **Mobile ($< 768\text{px}$):**
  - Cartões de métrica em grade 2×2 com padding reduzido (14px).
  - Os seletores de ano e categoria ocupam largura total acima do conteúdo.
  - No gráfico de barras, os rótulos dos meses utilizam abreviações de 3 letras (Jan, Fev, etc.) sem sobreposição ou corte de texto.

---

## 7. Interações e Microanimações
- **Alternância de Ano:** Transição fluida de recálculo dos dados com barras animando a nova altura em 400ms (`ease-out`).
- **Hover no Gráfico:** O mês apontado pelo cursor recebe destaque cromático suave e o tooltip exibe o detalhamento exato.

---

## 8. Estados de Interface
- **Ano Sem Leituras Registradas:**
  - O gráfico exibe linha de base sutil e mensagem: *"Nenhum livro concluído registrado para o ano de {ano}."*
  - Convite para registrar conclusões de livros no acervo.
- **Carregamento:** Skeletons dos 4 cartões e placeholder cinza suave no espaço do gráfico para evitar *Cumulative Layout Shift* (CLS).

---

## 9. Acessibilidade e Navegação por Teclado
- Alternativa textual acessível: O painel oferece sumário semântico dos dados para leitores de tela via tabela oculta (`sr-only`) ou atributos `aria-label`.
- O contraste entre as barras e o fundo do gráfico atende ao critério de acessibilidade não-textual da WCAG ($\ge 3:1$).

---

## 10. Regras Específicas e Diferenciais desta Página
- Esta é a única tela do aplicativo com gráficos vetoriais avançados (`recharts`).
- Concentra a inteligência temporal da biblioteca, permitindo viajar pelos anos históricos de leitura do usuário.

