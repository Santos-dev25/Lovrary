# Índice de Diretrizes Específicas por Página (`design-system/pages/`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **COMO FUNCIONA A HIERARQUIA DE DIRETRIZES:**  
> 1. Ao refatorar ou desenvolver uma página ou modal específico, consulte primeiro o arquivo correspondente abaixo.  
> 2. Se o arquivo da tela documentar uma regra específica ou particularidade, suas regras **têm precedência** para aquela tela.  
> 3. Para todas as regras não mencionadas, consulte rigorosamente a fonte global: [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## Sitemap de Diretrizes por Tela

| Arquivo de Diretriz | Rota / Aba / Componente | Finalidade & Experiência |
| :--- | :--- | :--- |
| [`auth.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/auth.md) | Rota `/auth` ([`Auth.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Auth.tsx)) | Login, Cadastro e Modo Demonstração (Convidado) |
| [`inicio.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/inicio.md) | Rota `/` — Aba `dashboard` | Hero Imersivo, Leitura Ativa, Metas, Feed e Últimas Adições |
| [`acervo.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/acervo.md) | Rota `/` — Aba `acervo` | Estante Geral, Busca ⌘K, Filtros por Status/Gênero, Visão por Autor |
| [`lendo.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/lendo.md) | Rota `/` — Aba `lendo` | Leituras ativas, input de progresso em tempo real e seletor |
| [`journal.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/journal.md) | Rota `/` — Aba `journal` | Diário de leitura por capítulo, reflexões e edição inline |
| [`detalhes-livro.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/detalhes-livro.md) | Modal / Drawer ([`BookDetailModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/BookDetailModal.tsx)) | Ficha técnica, resenha, sub-avaliações, citações, empréstimo e abandono |
| [`adicionar-livro.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/adicionar-livro.md) | Modal ([`AddBookModal.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AddBookModal.tsx)) | Busca Google Books, tipo Normal/Aprofundada e Cadastro Manual |
| [`resenhas.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/resenhas.md) | Rota `/` — Aba `resenhas` | Antologia crítica, resenhas escritas, notas por estrelas e citações |
| [`estatisticas.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/estatisticas.md) | Rota `/` — Aba `stats` | Painel analítico, gráficos Recharts, distribuição por gênero e anos |
| [`metas.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/metas.md) | Rota `/` — Aba `metas` | Meta anual de leitura, ritmo, barra de progresso e projeções |
| [`fila.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/fila.md) | Rota `/` — Aba `fila` | Fila prioritária ordenada, reordenação (subir/descer) e início direto |
| [`wishlist.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/wishlist.md) | Rota `/` — Aba `wishlist` | Lista de desejos pretendidos e conversão direta para o acervo |
| [`skills.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/skills.md) | Rota `/` — Aba `skills` | Maestria literária, títulos de leitor e 16 insígnias em 4 tiers |
| [`exportar.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/exportar.md) | Rota `/` — Aba `exportar` | Backup de dados (JSON/CSV) e gerador de cards para redes sociais |
| [`not-found.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/pages/not-found.md) | Rota `*` ([`NotFound.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/NotFound.tsx)) | Página 404 poética de retorno à estante |
