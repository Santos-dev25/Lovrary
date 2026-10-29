# Mapeamento dos Fluxos de Usuário — Lovrary

> Detalhamento passo a passo de como o usuário navega, interage e realiza as principais tarefas no Lovrary.

---

## Fluxo 1: Entrar na Aplicação e Gerenciar Sessão

### 1.1. Entrada com Conta Própria (Supabase Auth)
1. O usuário acessa a aplicação pela raiz `/`.
2. O componente [ProtectedRoute.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ProtectedRoute.tsx) intercepta a navegação e verifica se há sessão ativa.
3. Não havendo sessão, o usuário é direcionado para a rota `/auth`.
4. Na tela [Auth.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx):
   * **Modo Login:** O usuário digita email e senha e clica em "Entrar na Biblioteca". O Supabase valida as credenciais (`signInWithPassword`). Em caso de sucesso, emite toast e redireciona para `/`.
   * **Modo Cadastro:** O usuário clica em "Criar conta", preenche Nome, Email e Senha (mínimo de 6 caracteres). O Supabase cria o usuário (`signUp`) e envia os metadados. O perfil é automaticamente provisionado.

### 1.2. Entrada como Convidado (Modo Demonstração)
1. Na tela de autenticação, o usuário clica no botão com ícone de brilho: **"Entrar como Convidado (Modo Demo)"**.
2. A função `loginAsGuest()` do [BooksContext.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/context/BooksContext.tsx#L20) é disparada:
   * Grava a flag `lovrary_guest_session = "true"` no `localStorage`.
   * Inicializa o catálogo em memória com a coleção de livros de demonstração ([mockBooks.ts](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/data/mockBooks.ts)).
   * Sincroniza meta anual inicial e sessões simuladas.
3. O usuário é redirecionado para `/` imediatamente, com indicador visual **"Demo"** no cabeçalho da Sidebar.

### 1.3. Encerramento de Sessão (Logout)
1. Na parte inferior da Sidebar, o usuário clica em **"Sair"** (ou "Sair do Modo Demo").
2. Se estiver em Modo Demo: remove todas as chaves temporárias do `localStorage` (`lovrary_guest_session`, `lovrary_guest_books`, etc.).
3. Se autenticado via Supabase: executa `supabase.auth.signOut()`.
4. Emite toast de despedida: *"Sessão finalizada. Até breve! 📖"* e redireciona para `/auth`.

---

## Fluxo 2: Navegação Geral e Descoberta

### 2.1. Navegação Desktop
1. A [Sidebar.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/Sidebar.tsx) permanece fixada à esquerda com 11 opções de destino.
2. Cada botão exibe ícone, nome da seção e, quando aplicável, um badge com o número exato de livros naquele estado (`acervo`, `lendo`, `wishlist`, `stats`).
3. O usuário pode alternar entre as telas com 1 clique (o estado `activeTab` no [Index.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx) é atualizado sem recarregar a página).
4. O usuário pode recolher a barra para o modo compacto (72px) clicando em "Recolher Barra" para maximizar a área de leitura.

### 2.2. Navegação Mobile
1. Em telas menores que 768px, a Sidebar fica oculta por padrão e surge um header fixo com o logotipo do Lovrary e o botão de menu hamburguer.
2. Ao tocar no menu, a gaveta lateral surge com transição suave e o scroll da tela de fundo é bloqueado (`overflow: hidden`).
3. Ao selecionar qualquer destino, a aba é alterada e a gaveta fecha automaticamente.

### 2.3. Alternância de Modo Claro / Escuro
1. O usuário clica no botão "Modo Noturno" / "Modo Diurno" na base da Sidebar.
2. O estado `isDark` alterna e atualiza a classe `.dark` no elemento raiz `<html>`.
3. Todas as variáveis de cores semânticas (Marsala, Gold, Background de papel claro vs. madeira mogno escura) se adaptam instantaneamente.

---

## Fluxo 3: Adicionar Livros (Acervo ou Lista de Desejos)

1. O usuário clica no botão de destaque com gradiente **"Adicionar Livro"** na Sidebar (ou através do Hero da Home).
2. O modal [AddBookModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx) é aberto.

### Modalidade A: Busca Online (Google Books API)
1. O usuário digita o título ou autor (ex: *"Duna"* ou *"Machado de Assis"*).
2. O usuário pode optar pelo modo **Normal** ou modo **Aprofundado** (este último filtra automaticamente resumos e apostilas de estudo).
3. A aplicação aciona a função `searchGoogleBooks()`:
   * Consulta a Edge Function do Supabase (com rate limiting de servidor por IP).
   * Se indisponível, aciona a contingência direta client-side com cache duplo (memória + `sessionStorage`).
4. Os resultados aparecem em lista com capa tratada em HTTPS, título, autores, total de páginas e categoria mapeada para o português.
5. Se houver mais de 20 resultados, o botão "Carregar mais livros" fica disponível.
6. Em cada resultado, o usuário tem dois botões de ação:
   * **"+ Tenho"**: Adiciona ao Acervo próprio (`ownership = "tenho"` e `status = "nao-lido"`).
   * **"+ Desejo"**: Adiciona à Lista de Desejos (`ownership = "pretendo"`).

### Modalidade B: Cadastro Manual
1. Caso o livro não conste no Google Books, o usuário clica na aba **"Cadastro Manual"**.
2. Preenche os campos: Título (obrigatório), Autor, Total de páginas, Categoria (seleção ou "Outros") e URL da Imagem de Capa.
3. Escolhe se deseja cadastrar como **"Adicionar ao Acervo (Tenho)"** ou **"Adicionar à Lista de Desejos (Pretendo)"**.
4. O livro é persistido e entra imediatamente na biblioteca.

---

## Fluxo 4: Pesquisar, Filtrar e Explorar o Acervo

Na aba **"Meu Acervo"**:
1. **Busca Textual em Tempo Real:** O usuário digita qualquer termo no campo de busca. O sistema filtra instantaneamente por título, autor ou gênero/categoria. Um botão "X" permite limpar a busca com 1 clique.
2. **Filtro por Status da Leitura:** O usuário seleciona um dos pills superiores com contadores integrados:
   * `Todos` (total de livros do acervo)
   * `Na Estante` (livros não lidos)
   * `Lendo` (leituras em andamento)
   * `Lidos` (livros concluídos)
   * `Emprestados com Você` (livros de terceiros emprestados a você)
   * `Abandonados` (leituras interrompidas)
3. **Filtro por Categoria / Gênero:** O usuário seleciona tags de categoria no carrossel horizontal [CategoryFilter.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/CategoryFilter.tsx). A lista inclui tanto as categorias padrão quanto gêneros customizados criados pelo usuário.
4. **Modos de Exibição:** O usuário pode alternar entre:
   * **Grade:** Mosaico responsivo de capas com 2 colunas no celular até 6 colunas em telas amplas.
   * **Por Autor:** Agrupamento alfabético por escritor com cabeçalho dedicado e contagem de obras de cada autor.
5. **Ordenação:** Menu seletor com 7 critérios:
   * *Últimas Adições* (ordem de inserção)
   * *★ Melhor Avaliados* (nota por estrelas decrescente)
   * *📅 Data de Leitura* (data de término mais recente)
   * *📄 Páginas (Mais longos / Mais curtos)*
   * *🔤 Título (A-Z)* ou *👤 Autor (A-Z)*
6. **Limpeza Global:** Se qualquer filtro estiver ativo, surge o botão "Limpar" com ícone de rotação para restaurar a visão padrão.

---

## Fluxo 5: Visualizar Detalhes e Ficha Completa do Livro

1. Ao clicar em qualquer [BookCard.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookCard.tsx), a ficha [BookDetailModal.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx) se abre sobre a tela.
2. O cabeçalho apresenta a capa com efeito de relevo, título, autor, status atual e menu de ações rápidas.
3. O usuário navega entre 4 abas contextuais:
   * **Aba Journal:** Exibe as anotações feitas durante a leitura desse livro. Permite registrar nova nota com capítulo/página e texto reflexivo.
   * **Aba Resenha:** Permite escrever ou editar a resenha crítica geral, definir a nota principal de 1 a 5 estrelas e adicionar sub-critérios (ex: "Ritmo: 4", "Personagens: 5").
   * **Aba Citações:** Registro de trechos marcantes com botão de exclusão individual.
   * **Aba Info:** Permite editar total de páginas, atualizar o gênero (incluindo gêneros personalizados), adicionar tags de "Vibes" (ex: "Leitura Noturna", "Chorei Horrores") e visualizar recomendações de livros semelhantes geradas pela API do Google Books baseadas no autor ou gênero.
4. **Operações de Empréstimo:** O usuário pode abrir o modal de empréstimo para registrar com quem o livro está e definir uma data limite de devolução.
5. **Operação de Abandono:** O usuário pode marcar o livro como "Abandonado", informando em qual página interrompeu a leitura para que essas páginas continuem sendo contabilizadas nas estatísticas de leitura.

---

## Fluxo 6: Registro de Leitura, Ofensiva (Streak) e Ritmo

O usuário pode atualizar o progresso de uma leitura por múltiplos pontos de entrada:

### 6.1. Pelo Hero da Página Inicial ([ImmersiveReadingHero.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ImmersiveReadingHero.tsx))
1. O leitor visualiza o livro que está lendo no topo da Home, acompanhado de uma saudação poética personalizada conforme o turno do dia ("Bom dia, leitora ☕", "Boa tarde 📖", "Boa noite 🕯️").
2. Clica no botão de edição de página ou digita a página em que parou no input numérico.
3. Clica em "Salvar" ou pressiona Enter.
4. O progresso em percentual é recalculado, a ofensiva diária (`streak`) é confirmada, a sessão de leitura é registrada e um toast de sucesso confirma o novo ritmo.

### 6.2. Pela Tela "Lendo Agora" ([ReadingNow.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingNow.tsx))
1. O usuário visualiza todos os livros que está lendo simultaneamente.
2. Pode atualizar a página atual de cada um individualmente.
3. Pode clicar em "Concluir Livro" quando terminar a leitura, o que altera o status para `lido`, define a data de conclusão de hoje e abre a ficha para avaliação e resenha.

### 6.3. Pelo Diário de Leitura ([JournalPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/JournalPage.tsx))
1. O leitor seleciona qual livro em andamento deseja registrar.
2. Digita sua anotação e informa a página/capítulo.
3. Ao salvar, a anotação entra no histórico do livro e o progresso é sincronizado.

---

## Fluxo 7: Fila de Próximas Leituras (TBR)

1. Na aba **"Próxima Leitura"** ([ReadingQueuePage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReadingQueuePage.tsx)):
2. O leitor visualiza a lista ordenada de livros planejados numerados de 1 a N.
3. **Reordenação:** Clica nos botões de seta para cima ou para baixo para reposicionar as prioridades.
4. **Iniciar Leitura:** Clica no botão "Iniciar Leitura" com ícone de Play em qualquer livro da fila para promovê-lo instantaneamente ao status `lendo`.
5. **Adição à Fila:** Na seção inferior, o sistema lista os livros do acervo ainda não lidos que não estão na fila, com botão "+ Adicionar à Fila".

---

## Fluxo 8: Maestria & Badges do Leitor

1. Na aba **"Maestria & Skills"** ([ReaderSkillsSection.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ReaderSkillsSection.tsx)):
2. O leitor visualiza seu nível de experiência e a contagem de insígnias conquistadas (ex: 7 de 16).
3. As insígnias são organizadas em 4 tiers de conquista:
   * **Bronze:** Primeiros passos (ex: "Primeira Página", "Colecionador Iniciante").
   * **Prata:** Hábitos consistentes (ex: "Semana Imersiva", "Explorador de Gêneros").
   * **Ouro Nobre:** Conquistas avançadas (ex: "Maratonista Literário", "Crítico Dedicado").
   * **Diamante Raro:** Maestria máxima (ex: "Mestre da Biblioteca", "Devorador de Páginas").
4. Ao clicar em qualquer insígnia, um modal detalhado exibe os requisitos exatos, o progresso percentual para alcançá-la e a data em que foi conquistada.

---

## Fluxo 9: Metas Anuais e Estatísticas

1. Na aba **"Metas"** ([MetasPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/MetasPage.tsx)):
   * O leitor clica no botão de editar meta e define a quantidade de livros pretendida para o ano (ex: 24 livros).
   * O sistema exibe o percentual concluído e calcula quantos livros faltam para atingir o objetivo.
2. Na aba **"Registros de Leitura"** ([StatsPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/StatsPage.tsx)):
   * Exibe gráfico de barras com a distribuição de livros concluídos em cada mês do ano via Recharts.
   * Permite filtrar por ano histórico e por categoria específica.
   * Apresenta cards com o total de páginas lidas, média de estrelas atribuídas e distribuição percentual por gênero literário.

---

## Fluxo 10: Preservação do Acervo e Compartilhamento Social

Na aba **"Preservar Acervo"** ([ExportPage.tsx](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx)):

### 10.1. Backup de Dados (CSV e JSON)
* **Exportar CSV:** Gera arquivo estruturado com títulos, autores, total de páginas, status, avaliações e datas de leitura, pronto para planilhas.
* **Exportar JSON:** Gera cópia integral de segurança contendo todas as notas de journal, citações, resenhas e metadados.

### 10.2. Gerador de Cards Visuais para Redes Sociais
1. O usuário escolhe um dos livros concluídos do seu acervo.
2. Configura os elementos visuais do card:
   * Escolha de paleta/tema (Marsala Nobre, Papel Literário, Escuro Clássico).
   * Alternância para exibir ou ocultar a citação favorita.
   * Alternância para exibir ou ocultar a resenha e avaliação por estrelas.
3. O preview interativo do card é atualizado em tempo real.
4. O usuário clica em **"Baixar Imagem PNG"**.
5. O sistema processa o elemento via `html-to-image`, aplica o tratamento especial de CORS na imagem da capa e inicia o download da imagem em alta resolução.

