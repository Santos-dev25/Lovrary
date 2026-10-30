# Diretrizes de Página: Rota Não Encontrada / 404 (`*`)

> **PROJETO:** Lovrary — Biblioteca Pessoal Digital  
> **ROTA:** `*` (Catch-all)  
> **ARQUIVOS FONTE:** [`src/pages/NotFound.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/pages/NotFound.tsx), [`src/components/AppStatusScreen.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppStatusScreen.tsx)  
> **FONTE GLOBAL DA VERDADE:** [`design-system/MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md)  
> 
> ⚠️ **IMPORTANTE:** Este documento estabelece as especificações de experiência visual e comportamental da tela de erro 404 do Lovrary. Para tokens de cores, tipografia e escala de espaçamento, consulte o [`MASTER.md`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/design-system/MASTER.md).

---

## 1. Objetivo e Propósito da Página
A rota 404 é a salvaguarda de navegação do Lovrary:
- Acolher o leitor quando um link quebrado ou endereço inexistente for digitado.
- Evitar mensagens de erro técnicas e assustadoras ("404 Not Found" bruto).
- Oferecer uma metáfora literária poética de desvio de percurso na biblioteca (*"Esta página parece ter sido arrancada ou ainda não foi escrita"*).
- Fornecer um caminho de retorno seguro e evidente para a estante principal (`/`).

---

## 2. Hierarquia Visual e Distribuição dos Elementos
1. **Fundo Unificado:** Fundo `--background` pleno (`#FAF7F2` no Light / `#140E10` no Dark).
2. **Card Central de Estado (`AppStatusScreen`):**
   - Cartão com largura máxima de 560px, borda suave de 1px em `--border`, cantos arredondados `--radius-xl` (16px) e elevação `--shadow-card`.
   - À esquerda: Ícone `Compass` ou `Home` em container com fundo `--surface-subtle` e cor `--primary`.
   - À direita:
     - Badge superior editorial: Ícone `BookOpen` e texto *"LOVRARY"*.
     - Título `h1` em `Fraunces` Bold (24px a 28px): *"Página não encontrada"*.
     - Descrição em `Inter` Regular (14px): *"O endereço acessado não corresponde a nenhuma estante ou sala configurada no Lovrary."*
     - Rótulo de rota técnica suave com a URL digitada para transparência de diagnóstico.
     - Botão de Ação Primária: *"Voltar para a biblioteca"* com ícone `Home` ou `ArrowLeft`.

---

## 3. Organização do Conteúdo
- Card único centralizado no centro exato da viewport (`min-h-screen flex items-center justify-center`).

---

## 4. Aplicação de Cores, Tipografia e Espaçamentos do MASTER.md
- **Cores Semânticas:**
  - Superfície do Card: `--surface` (`#FFFFFF` no Light / `#1E1618` no Dark).
  - Ação Primária: `--primary` (Marsala `#6B232D` no Light / `#D46A78` no Dark).
- **Tipografia:**
  - Título Principal: `Fraunces` Bold (28px).
  - Texto Explicativo: `Inter` Regular (14px), cor `--text-secondary`.
- **Espaçamento:**
  - Padding interno: 28px (desktop) e 20px (mobile).

---

## 5. Componentes e Padrões Visuais
- Utiliza a primitiva compartilhada [`src/components/AppStatusScreen.tsx`](file:///c:/Users/windows%2011/Documents/GitHub/Lovrary/src/components/AppStatusScreen.tsx).
- Botão de retorno com altura de 44px e foco visível.

---

## 6. Comportamento Responsivo
- **Desktop e Tablet:** Card centralizado com margens generosas.
- **Mobile ($< 768\text{px}$):** Card ocupa 100% da largura útil (`w-full max-w-sm`) com padding de 16px nas laterais, sem corte de texto ou overflow horizontal.

---

## 7. Interações e Microanimações
- **Clique no Botão de Retorno:** Redireciona o usuário de volta para a raiz `/` com transição suave.

---

## 8. Estados de Interface
- Registra no console via `console.error` a rota desconhecida acessada para fins de auditoria e telemetria local.

---

## 9. Acessibilidade e Navegação por Teclado
- Foco automático no botão de retorno ao carregar a tela.
- Atributos semânticos `role="main"` e `role="region"`.

---

## 10. Regras Específicas e Diferenciais desta Página
- Não renderiza a `Sidebar` nem cabeçalhos móveis para manter o foco total na ação de retorno.
- Catch-all universal para qualquer caminho não registrado no React Router DOM.

