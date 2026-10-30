# Diretrizes de Página: Metas de Leitura (`activeTab = "metas"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "metas"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L146), [`src/components/MetasPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental do módulo de metas e ritmo de leitura do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Metas" é a bússola de disciplina e realização literária do leitor:
- Definir e ajustar a meta quantitativa de livros a serem lidos no ano corrente.
- Acompanhar visualmente o percentual atingido, livros concluídos e livros restantes.
- Avaliar a distribuição mensal de livros finalizados para identificar picos de ritmo e períodos de descanso.
- Oferecer encorajamento positivo sem cobranças ou notificações agressivas.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Metas de Leitura"*.
2. **Cartão Principal da Meta Anual:**
   - Cartão amplo e destacado com fundo `--surface` e borda limpa de 1px.
   - Cabeçalho do Cartão:
     - Ícone temático `Target` em container com fundo `--primary`.
     - Título: *"Meta {ano}"* em `Fraunces` Bold (20px).
     - Subtítulo em números tabulares: *"{lidos} de {alvo} livros concluídos"*.
     - Botão de edição inline: *"Editar Meta"*, que se converte em input numérico + botões *"Salvar"* e *"Cancelar"*.
   - **Grande Barra de Progresso:**
     - Trilha espessa de 24px com cantos arredondados `--radius-full`.
     - Barra interna preenchida com `--primary` (Marsala) que anima de zero até o percentual atingido, com o valor percentual impresso no interior.
3. **Cards de Apoio de Ritmo:**
   - Trio de cartões complementares:
     - 1. *Livros Lidos no Ano*: Contagem absoluta com ícone `CheckCircle2` ou `Award`.
     - 2. *Restantes para a Meta*: Quantidade de livros que faltam para atingir o objetivo com ícone `BookOpen`.
     - 3. *Ritmo Atual*: Estimativa amigável de ritmo (ex.: *"1.5 livro/mês"*).
4. **Gráfico Mensal de Desempenho:**
   - Visualização de barras dos 12 meses indicando quantos livros foram finalizados em cada mês do ano da meta.

---

## 3. Organização do Conteúdo
- Cartão principal com a barra de progresso no topo $\to$ Cards de ritmo no centro $\to$ Distribuição mensal na base.
- Espaçamento vertical `--space-6` (24px) mantendo o alinhamento visual equilibrado.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície dos Cartões: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Trilha da Barra de Progresso: `--surface-subtle`.
  - Preenchimento da Barra: `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark).
  - Ícone da Meta: Dourado `--accent-gold` para conotação nobre de realização.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Percentual da Meta: `Inter` Bold (18px a 24px) com `font-variant-numeric: tabular-nums`.
  - Rótulos e Textos de Ajuda: `Inter` Regular (13px / 14px), cor `--text-secondary`.
- **Espaçamento:**
  - Padding do cartão principal: 24px (desktop) e 16px (mobile).

---

## 5. Componentes e Padrões Visuais
- **Edição Inline de Meta:**
  - Ao clicar em *"Editar Meta"*, o texto se transforma em um campo numérico compacto com largura de 80px e altura de 36px, com foco automático.
  - Salvar com tecla `Enter` ou botão com cor `--primary`.
- **Barra de Progresso com Transição Suave:**
  - Animação via CSS / `framer-motion` com duração de 1.2s e curva de desaceleração suave (`easeOut`).

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Cartão principal de largura total. Cards de apoio em 3 colunas lado a lado.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Cards de apoio em 3 colunas ou 2 colunas proporcionais.
- **Mobile ($< 768\text{px}$):**
  - O cabeçalho da meta empilha o botão de editar abaixo do título.
  - A barra de progresso preserva altura de 24px com texto legível.
  - Os cartões de apoio organizam-se em coluna única ou grade 2 colunas compacta.

---

## 7. Interações e Microanimações
- **Ao Salvar Meta:** Atualização imediata do percentual e recálculo dos livros restantes sem recarregamento da tela.
- **Meta Atingida (100%):** Exibição de insígnia comemorativa com ícone `Sparkles` dourado e mensagem calorosa de parabéns.

---

## 8. Estados de Interface
- **Meta Não Definida (ou Zero):** Mensagem convidando a definir um objetivo para o ano: *"Quantos livros você deseja ler neste ano?"*.
- **Meta Ultrapassada (>100%):** A barra atinge 100% com estilo dourado e indicação do excedente (ex.: *"125% — Meta superada!"*).

---

## 9. Acessibilidade e Navegação por Teclado
- A barra de progresso possui os atributos `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"` e `aria-valuemax="{meta}"`.
- O input de edição suporta incrementos e decrementos via setas do teclado (`ArrowUp` / `ArrowDown`).

---

## 10. Regras Específicas e Diferenciais desta Página
- Concentra a gestão da variável `readingGoalConfig` (ano e alvo), que é sincronizada diretamente com o Supabase e persistida no perfil do usuário.

