# Diretrizes de Página: Preservação & Exportação (`activeTab = "exportar"`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `/` com `activeTab = "exportar"`  
> **ARQUIVOS FONTE:** [`src/pages/Index.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/Index.tsx#L150), [`src/components/ExportPage.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/ExportPage.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da central de backup e geração de cartões sociais do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A aba "Preservar Acervo" atende a dois propósitos nobres e indispensáveis para o leitor:
1. **Soberania e Preservação dos Dados Pessoais:** Garantir que o usuário seja o dono incontestável do seu histórico de leitura, permitindo exportar todo o acervo, resenhas, citações e anotações em formatos universais e abertos (JSON e CSV).
2. **Compartilhamento Literário Elegante:** Gerador de cartões gráficos em alta definição para redes sociais (Instagram, Twitter/X, WhatsApp) com a capa do livro, citação favorita, avaliação por estrelas e selo editorial do Lovrary, gerado via `html-to-image` e baixado em formato PNG.

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Cabeçalho:**
   - Título editorial `h2` em `Fraunces` Bold (28px): *"Preservar Acervo & Compartilhar"*.
   - Subtítulo em `Inter` (14px): *"Seus dados pertencem a você. Exporte seus registros ou crie cartões visuais para compartilhar suas leituras."*
2. **Painel de Backup & Exportação de Dados:**
   - Cartão com fundo `--surface` e borda limpa de 1px.
   - Resumo do acervo: Total de livros, notas de journal e citações que serão incluídos no arquivo.
   - Botão 1: *"Exportar em JSON"* (com metadados completos e hierarquia de notas).
   - Botão 2: *"Exportar em CSV"* (planilha compatível com Excel e Google Sheets).
3. **Estúdio de Criação de Cards Sociais:**
   - Seletor do livro desejado entre as obras que possuem resenha ou anotação.
   - Alternador de Formato do Card:
     - Opção A: *"Card Visual Completo"* (Capa em destaque + Avaliação + Trecho crítico).
     - Opção B: *"Citação em Destaque"* (Formato tipográfico com aspas nobres e nome da obra).
   - **Canvas de Pré-Visualização do Card:**
     - Moldura renderizada em proporção otimizada para feed/stories com estética editorial impecável, fundo papel ou noir e assinatura elegante *"Lovrary • Biblioteca Pessoal"*.
   - Botão Primário de Ação: *"Baixar Imagem PNG"* com ícone `Download`.

---

## 3. Organização do Conteúdo
- No desktop ($\ge 1024\text{px}$), o estúdio de cards sociais organiza-se lado a lado: Controles e seletores à esquerda (~45%) e pré-visualização ao vivo do cartão gerado à direita (~55%).
- No mobile, o layout empilha os controles seguidos pelo preview redimensionado e pelo botão de download fixado.

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície dos Painéis: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Botão Primário de Download: `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark).
  - Card Gerado para Download: Design independente calibrado para exibição perfeita tanto em feeds claros quanto escuros, utilizando a paleta oficial do Lovrary.
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Cartão Social: Título da obra em `Fraunces` SemiBold e citações em `Inter` itálico de alta legibilidade.
- **Espaçamento:**
  - Padding dos painéis: 24px.

---

## 5. Componentes e Padrões Visuais
- **Tratamento de CORS e Conversão de Imagens:**
  - Conforme implementado em `ExportPage.tsx`, as capas remotas são pré-convertidas em `DataURL` (Base64) em memória antes da renderização pelo `html-to-image`, prevenindo falhas de exportação por restrições de cross-origin.
- **Botões de Ação:** Altura de 44px com ícones vetoriais `Download`, `FileText`, `Image` e `Sparkles`.

---

## 6. Comportamento Responsivo
- **Desktop ($\ge 1024\text{px}$):** Controles e preview visual alinhados em duas colunas confortáveis.
- **Tablet ($768\text{px}$ a $1023\text{px}$):** Disposição vertical com preview centralizado.
- **Mobile ($< 768\text{px}$):**
  - O preview do card aplica escala reduzida proporcional (`transform: scale(...)` ou `max-w-xs mx-auto`) para caber integralmente na viewport estreita sem provocar overflow lateral.
  - O botão de download permanece acessível no final da rolagem com largura total (`w-full`).

---

## 7. Interações e Microanimações
- **Ao Clicar em Baixar Imagem:** O botão exibe spinner animado `Loader2` durante a rasterização do canvas e exibe feedback de sucesso via toast Sonner assim que o arquivo PNG é entregue ao navegador.
- **Ao Trocar de Livro:** A pré-visualização atualiza instantaneamente a capa e o texto correspondente.

---

## 8. Estados de Interface
- **Sem Livros Elegíveis para Cartão:** Mensagem indicando que é necessário possuir ao menos um livro com resenha ou anotação para gerar cartões sociais.
- **Processando Exportação:** Botão desabilitado com indicador de progresso ativo, impedindo múltiplos cliques concorrentes.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco linear através dos seletores de formato, livro e botões de exportação.
- O canvas de preview possui `aria-hidden="true"` enquanto os controles expõem rótulos descritivos para tecnologias assistivas.

---

## 10. Regras Específicas e Diferenciais desta Página
- Única tela do sistema com rotinas de serialização de dados (JSON/CSV) e manipulação gráfica de DOM para PNG (`html-to-image`).
- Consolida o compromisso ético do Lovrary com a portabilidade irrestrita dos dados do usuário.

