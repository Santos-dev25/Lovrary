# Lovrary — Diário & Acervo Pessoal de Leituras

Uma aplicação web moderna, elegante e focada na experiência literária (UI/UX editorial). Permite que leitores organizem sua estante de livros físicos e digitais, acompanhem o progresso de leitura em tempo real, mantenham um *journal* com citações e reflexões por capítulo, monitorem metas anuais com gráficos analíticos, desenvolvam *Reader Skills* (conquistas) e compartilhem resenhas visuais geradas em imagem.

🌐 **Deploy em produção:** [https://lovrary-orcin.vercel.app/](https://lovrary-orcin.vercel.app/)

---

## ✨ Funcionalidades Principais

- 📚 **Gestão Completa de Acervo**:
  - Classificação por status: *Lendo*, *Lido*, *Pretendo Ler* (Wishlist) e *Abandonado*.
  - Filtros por gênero/vibes, busca textual em tempo real e agrupamento por autor.
  - Ordenação múltipla: mais recentes, melhor avaliação (com suporte a meias-estrelas), data de término, volume de páginas, título e autor.
- ⏱️ **Acompanhamento de Leitura Ativa**:
  - Hero imersivo com livro em foco, progresso percentual e atualização ágil de páginas lidas.
- 📖 **Fila de Leituras**:
  - Lista de prioridades para organizar os próximos livros da fila.
- ✍️ **Diário & Journal Literário**:
  - Registro de citações favoritas e anotações reflexivas categorizadas por capítulo e data.
- 🏆 **Habilidades do Leitor (*Reader Skills*)**:
  - Gamificação literária com cálculo dinâmico de pontuação e níveis por consistência, variedade de gêneros e metas cumpridas.
- 📊 **Metas & Estatísticas Analíticas**:
  - Acompanhamento de metas anuais de livros e páginas lidas.
  - Gráficos visuais (via Recharts) para distribuição de gêneros e ritmo de leitura.
- 🎨 **Estúdio de Resenhas & Exportação Visual**:
  - Redação de resenhas detalhadas e exportação de cards estilizados em imagem (`html-to-image`) prontos para redes sociais.
- 🔍 **Busca de Livros Multi-Camada & Resiliente**:
  - Rota primária segura via Supabase Edge Function (`google-books-search`) com chave protegida no servidor.
  - Contingência local direta na Google Books API com sanitização de capas (HTTPS), rate limiting e cache em memória/sessão.
  - Fallback secundário integrado com a [Open Library Search API](https://openlibrary.org/).
- 🛡️ **Modo Visitante / Demonstração (Zero Setup)**:
  - Permite explorar e usar todas as funcionalidades imediatamente no navegador com dados locais (`localStorage`), sem necessidade de configurar banco de dados.

---

## 🚀 Tecnologias Utilizadas

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) com plugin SWC
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com tokens HSL personalizados (*Marsala*, *Warm Paper* e *Antique Gold*)
- **Componentes & Ícones**: [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/)
- **Animações**: [Framer Motion](https://www.framer-motion.com/) + Tailwind CSS Animate
- **Gráficos & Estado**: [Recharts](https://recharts.org/) + [TanStack Query](https://tanstack.com/query)
- **Notificações**: [Sonner](https://sonner.emilkowal.ski/)
- **Exportação de Imagens**: [html-to-image](https://github.com/bubkoo/html-to-image)
- **Backend & Autenticação**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS, Storage e Edge Functions)
- **APIs de Consulta**: Google Books API e Open Library API
- **Testes & Qualidade**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/) + [ESLint](https://eslint.org/)

---

## 📁 Estrutura do Projeto

```text
Lovrary/
├── .agents/                 # Configurações e diretrizes dos agentes de IA
├── public/                  # Favicons, robôs e assets públicos estáticos
├── src/                     # Código-fonte principal da aplicação
│   ├── assets/              # Identidade visual e imagens estáticas
│   ├── components/          # Componentes modulares, modais e páginas do painel
│   │   └── ui/              # Componentes de interface base (Radix / Tailwind)
│   ├── context/             # Gerenciamento de estado global (BooksContext)
│   ├── data/                # Mock inicial, listas de gêneros e regras de Reader Skills
│   ├── hooks/               # Custom hooks (responsividade, notificações)
│   ├── integrations/        # Integração e tipos TypeScript gerados do Supabase
│   ├── lib/                 # Clientes de API, cliente Supabase, busca resiliente e utils
│   ├── pages/               # Rotas principais (Index/Dashboard, Auth, NotFound)
│   ├── test/                # Testes unitários (Vitest / Testing Library)
│   ├── App.tsx              # Componente raiz com roteador e provedores globais
│   ├── index.css            # Variáveis de tema HSL, tipografia e reset global
│   └── main.tsx             # Ponto de entrada com montagem e error handling
├── supabase/                # Infraestrutura Supabase
│   ├── functions/           # Edge Functions (ex: google-books-search)
│   └── migrations/          # Migrações SQL e políticas de segurança RLS
├── .env.example             # Modelo das variáveis de ambiente necessárias
├── bun.lock / bun.lockb     # Lockfiles de dependências (Bun)
├── package-lock.json        # Lockfile de dependências (npm)
├── package.json             # Scripts de execução e dependências do projeto
├── playwright.config.ts     # Configuração da suíte de testes E2E
├── tailwind.config.ts       # Configurações de tema, fontes e extensões Tailwind
├── tsconfig.*.json          # Configurações estritas do compilador TypeScript
├── vercel.json              # Configurações de roteamento SPA para deploy na Vercel
├── vite.config.ts           # Configuração de build e plugins do Vite
└── vitest.config.ts         # Configuração de execução de testes unitários
```

---

## 🛠️ Configuração e Execução

### 1. Pré-requisitos

- **Node.js** 18+ (ou **Bun**)
- Gerenciador de pacotes: `npm`, `bun` ou `yarn`

### 2. Instalação das dependências

```bash
npm install
```

### 3. Variáveis de Ambiente

Copie o arquivo de exemplo para criar o seu `.env`:

```bash
cp .env.example .env
```

Preencha com suas configurações:

```env
# Supabase - Obrigatório para autenticação e sincronização na nuvem
# (Opcional caso utilize exclusivamente o Modo Demonstração/Offline)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Google Books API - OPCIONAL (Apenas para desenvolvimento local sem Edge Function)
# Em produção, a busca passa com segurança pela Edge Function do Supabase.
VITE_GOOGLE_BOOKS_API_KEY=sua-chave-google-aqui
```

> **Nota:** Se você iniciar a aplicação sem credenciais do Supabase, o sistema ativará automaticamente o **Modo Visitante / Demonstração**, permitindo usar e testar todas as funcionalidades do acervo com dados salvos no `localStorage` do seu navegador.
> *(Compatibilidade: `VITE_SUPABASE_PUBLISHABLE_KEY` também é reconhecida como fallback para `VITE_SUPABASE_ANON_KEY`).*

### 4. Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento local no Vite (`http://localhost:5173`) |
| `npm run build` | Compila o bundle otimizado de produção na pasta `dist/` |
| `npm run preview` | Executa localmente o servidor de visualização do build de produção |
| `npm run test` | Executa os testes unitários via Vitest |
| `npm run test:watch` | Executa os testes unitários no modo observador iterativo |
| `npm run lint` | Executa a validação estática de código com o ESLint |

---

## 🎨 Identidade Visual e Princípios de Design

- **Tipografia Editorial**:
  - *Fraunces*: Família serifada para títulos, destaques e identidade acolhedora de livraria/biblioteca.
  - *Inter*: Família sem serifa para máxima legibilidade em corpos de texto, formulários e métricas numéricas.
- **Paleta Harmônica de Cores**:
  - Tons de **Marsala** nobre (`#722F37`), papel creme suave e detalhes em ouro antigo, adaptando-se tanto ao tema claro quanto ao tema escuro profundo.
- **Interatividade & Micro-animações**:
  - Transições suaves entre abas, barras de progresso animadas e feedback visual em ações do usuário.

---

## 🤖 AI-Assisted Development & Engenharia

Este projeto combina fluxos de prototipagem assistida por IA com engenharia de software rigorosa:

- **Ideação e Prototipagem:** A estrutura de layout inicial e o esboço dos componentes foram gerados utilizando a plataforma Lovable como acelerador de setup.
- **Auditoria & Refinamento:** O projeto passou por revisões de usabilidade, coerência de UI/UX e boas práticas de código.
- **Hardening, Segurança e Tolerância a Falhas:**
  - Isolamento de segredos em variáveis de ambiente e Edge Functions no Supabase.
  - Sanitização de URLs de imagens externas (bloqueio de protocolos inseguros e mitigação de injeção).
  - Rate limiting e deduplicação de requisições concorrentes (*in-flight caching*).
  - Contingência com busca em camadas (Edge Function → Google Books direta → Open Library).
  - Tolerância completa a falhas de rede através do Modo Visitante/Offline.

---

## 📄 Licença e Autoria

© 2026 Cauã Dos Santos Nascimento.

Distribuído sob a licença [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).
