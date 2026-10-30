# Diretrizes Específicas de Páginas (Overrides)

Esta pasta receberá os arquivos de diretrizes específicas de cada página (ex.: `biblioteca.md`, `detalhes-livro.md`, `estatisticas.md`), documentando apenas os desvios e regras particulares de cada tela com base no mapeamento real do Lovrary.

### Como funciona a hierarquia:
1. Ao refatorar ou desenvolver uma página específica (ex.: "Biblioteca"), o agente/desenvolvedor deve consultar primeiro `design-system/pages/[nome-da-pagina].md`.
2. Se o arquivo da página existir, suas regras **sobrescrevem** o arquivo Master.
3. Se não existir, aplicam-se exclusivamente as regras globais de `design-system/MASTER.md`.

