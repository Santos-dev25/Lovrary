# Auditoria de Experiência do Usuário (UX) — Lovrary

> Avaliação de usabilidade, fluxos de interação, acessibilidade e ergonomia mobile do Lovrary com base nas diretrizes da skill **UI/UX Pro Max**.

---

## 1. Facilidade de Navegação e Arquitetura de Informação

### 1.1. Complexidade da Barra de Navegação (11 Destinos)
* **Arquivo:** [src/components/Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx#L23-L35)
* **Problema:** A Sidebar apresenta **11 itens de menu no mesmo nível hierárquico**:
  `Início`, `Meu Acervo`, `Lendo Agora`, `Journal`, `Maestria & Skills`, `Lista de Desejos`, `Próxima Leitura`, `Registros de Leitura`, `Metas`, `Resenhas`, `Preservar Acervo`.
* **Diagnóstico UX (Lei de Miller & Sobrecarga Cognitiva):**
  * Itens com forte sobreposição funcional não estão agrupados. Por exemplo:
    * *"Lendo Agora"* e *"Journal"* tratam estritamente dos mesmos livros que o leitor está lendo no momento.
    * *"Registros de Leitura"* e *"Metas"* tratam ambos de estatísticas e progresso temporal.
    * *"Resenhas"* e *"Preservar Acervo"* tratam de saída/compartilhamento de avaliações.
* **Impacto no Mobile:** Na gaveta deslizante, o usuário precisa rolar o menu vertical para enxergar itens como "Resenhas" e "Preservar Acervo", e a barra inferior de ações entra em conflito com o indicador de gestos do sistema operacional.

---

## 2. Clareza das Ações e Fluxos de Usuário

### 2.1. Conflito entre Ações no Modal de Detalhes
* **Arquivo:** [src/components/BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx#L230-L350)
* **Problema:** Na barra de ações do livro, existem múltiplos botões concorrentes:
  * *"Marcar como Concluído"* (botão principal em Marsala)
  * *"Desisti deste livro (Abandonar)"* (botão secundário outline)
  * *"Peguei Emprestado"* (botão secundário azul claro)
  * *"Mais Opções"* (dropdown contendo Devolver, Emprestar, Excluir)
* **Diagnóstico UX:**
  * Para um livro que já está marcado como `lido`, o botão principal muda para *"Iniciar Releitura"*, mas o botão *"Peguei Emprestado"* continua visível, gerando um estado ilógico (um livro do acervo pessoal já concluído oferecendo a opção de ser pego emprestado).
  * O botão de "Desisti deste livro" utiliza a palavra negativa "Desisti" em vez do padrão literário "Abandonar Leitura".

### 2.2. Fluxo Truncado em "Preservar Acervo"
* **Arquivo:** [src/components/ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx)
* **Problema:** O fluxo de geração de card visual exige que o usuário clique em um pequeno card de livro no topo, mas não há nenhuma indicação visual ou instrução textual de que os cards são clicáveis para abrir o gerador de imagem. Usuários que entram na página veem uma tela vazia e supõem que a ferramenta não funciona.

---

## 3. Feedback de Interações e Notificações (Toasts)

### 3.1. Sobreposição de Toasts em Áreas de Ação Críticas no Mobile
* **Evidência:** [m03-menu-drawer-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m03-menu-drawer-mobile.png) e [m04-acervo-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m04-acervo-mobile.png)
* **Problema:** As notificações em toast (`sonner`) são posicionadas no rodapé central da tela com `z-index` elevado:
  * Ao abrir a gaveta móvel, o toast *"Bem-vindo(a) ao Modo Demonstração!"* cobre exatamente os botões de **"Sair do Modo Demo"** e **"Modo Noturno"**.
  * No card do Hero, o toast cobre o botão *"Escrever no Journal"*.
* **Diagnóstico UX:** Viola a diretriz de **Não Bloquear Interações Primárias**. Toasts devem ser temporários, não intrusivos ou posicionados no topo em dispositivos móveis (`position: top-center`).

---

## 4. Estados Vazios (Empty States) e Estados de Carregamento

| Aba / Tela | Estado Vazio Atual | Avaliação UX | Recomendações (UI/UX Pro Max) |
|---|---|:---:|---|
| **Início (Hero)** | Exibe mensagem poética de convite à leitura. | **Boa** | Mantém a atmosfera acolhedora com botão para explorar acervo. |
| **Meu Acervo** | Caixa pontilhada *"Nenhum livro encontrado. Tente ajustar os termos..."*. | **Regular** | Falta um botão direto de ação rápida: *"Limpar Filtros"* ou *"Adicionar este livro"*. |
| **Journal** | Mensagem estática *"Nenhum livro em leitura. Comece a ler um livro..."*. | **Regular** | Falta botão primário de ação: *"Escolher Livro para Ler Agora"*. |
| **Próxima Leitura** | Texto *"Nenhum livro na fila"*. | **Fraca** | Não guia o leitor com uma lista de sugestões dos livros não lidos do seu acervo. |
| **Registros (Stats)** | Exibe gráfico vazio com eixos em zero e médias com traço `—`. | **Crítica** | Passa a impressão de erro de software. Deveria exibir alerta inteligente: *"Você não possui leituras finalizadas em 2026. Deseja ver os registros de 2025?"*. |
| **Preservar Acervo** | Espaço em branco total. | **Crítica** | Deve selecionar automaticamente o último livro lido para exibir o preview imediatamente. |

---

## 5. Ergonomia Mobile e Áreas Clicáveis (Touch Targets)

Conforme a regra **Priority 2: Touch & Interaction** da skill UI/UX Pro Max:

### 5.1. Alvos de Toque Inferiores a 44×44px
* **Evidência:**
  * O input de atualização rápida de página no Hero mobile ([ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx#L25)) possui altura de apenas **34px**.
  * O botão de "Limpar busca" (`X`) no campo de busca do Acervo possui área de toque de **32×32px**.
  * As estrelas de avaliação interativas do `BookDetailModal` possuem espaçamento de toque inferior a 8px, causando erros frequentes de seleção do valor de nota ao tocar com o polegar.

### 5.2. Modal Centralizado vs. Padrão Nativo Bottom Sheet
* **Evidência:** [m05-modal-book-detail-mobile.png](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/docs/refatoracao/02-inspecao-visual/screenshots/m05-modal-book-detail-mobile.png)
* **Diagnóstico UX:** Modais flutuantes centralizados com rolagem interna em celulares são considerados um anti-pattern severo na UX moderna. O usuário tem dificuldade para alcançar o botão de fechar no canto superior direito (`top: 16px, right: 16px`), a rolagem compete com a página de fundo e o teclado virtual cobre os campos de digitação.
* **Solução:** Em telas `< 768px`, o `BookDetailModal` e o `AddBookModal` devem utilizar o primitivo `Drawer` (baseado em [Vaul](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/package.json#L66)) como uma folha inferior deslizante (*Bottom Sheet*) com barra de arraste (*grab handle*).

---

## 6. Acessibilidade (WCAG 2.1)

### 6.1. Contraste de Cores (Critério WCAG AA 1.4.3)
1. **Botões em Estado Desabilitado:**
   * Textos brancos sobre fundos rosa claro desbotados (`text-white bg-marsala/40`) em [JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx) e [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) atingem contraste de **2.1:1**, violando o patamar mínimo de 4.5:1.
2. **Subtítulos e Metadados Secundários em Modo Diurno:**
   * Textos em classe `text-muted-foreground` (`hsl(350 12% 38%)`) sobre cartões em tom de papel claro atingem contraste limítrofe de ~3.8:1 em tamanhos de fonte reduzidos (10px - 11px), dificultando a leitura para pessoas com baixa acuidade visual.

### 6.2. Leitores de Tela e Semântica de Foco
* **Navegação de Abas no Modal de Detalhes:** As abas *"Journal"*, *"Resenha"*, *"Citações"* e *"Ficha Técnica"* utilizam tags `<button>` genéricas em vez da estrutura semântica com papéis ARIA adequados (`role="tablist"`, `role="tab"`, `aria-selected="true/false"` e `aria-controls`).
* **Trapping de Foco em Modais:** Durante os testes automatizados, elementos do fundo da página (como itens da Sidebar) continuavam recebendo eventos de foco via tabulação do teclado mesmo com o modal aberto sobre a tela.

