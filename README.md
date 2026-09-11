# Lovrary — Diário & Acervo Pessoal de Leituras

Uma aplicação web moderna, elegante e focada na experiência literária (UI/UX editorial). Permite que os leitores organizem sua estante de livros físicos e digitais, acompanhem o progresso de leitura em tempo real, mantenham um *journal* com citações e anotações por capítulo, monitorem metas anuais e compartilhem resenhas visuais.

---

## 🚀 Tecnologias Utilizadas

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) com plugin SWC
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com tokens HSL personalizados (Marsala, Warm Paper & Antique Gold)
- **Componentes Primitivos**: [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/)
- **Animações**: [Framer Motion](https://www.framer-motion.com/)
- **Gráficos & Dados**: [Recharts](https://recharts.org/) + [TanStack Query](https://tanstack.com/query)
- **Backend & Autenticação**: [Supabase](https://supabase.com/) (com suporte integrado a Modo Demonstração/Offline)
- **APIs Externas**: Google Books API para busca automática de títulos, autores e capas em alta resolução

---

## 📁 Estrutura do Projeto

```text
Lovrary/
├── .agents/                 # Configurações de agentes de IA
├── dist/                    # Build de produção gerado
├── public/                  # Arquivos públicos e favicon
├── src/                     # Código fonte da aplicação
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes modulares de UI e páginas do painel
│   ├── context/             # Context API para gerenciamento de estado (BooksContext)
│   ├── data/                # Dados mockados e definições de tipos para modo offline
│   ├── hooks/               # Hooks customizados (responsividade, notificações)
│   ├── lib/                 # Utilitários, cliente Supabase e serviço Google Books
│   ├── pages/               # Páginas principais (Dashboard, Auth, 404)
│   ├── index.css            # Sistema de design, paletas HSL e suporte a tema escuro
│   └── main.tsx             # Ponto de entrada com tratamento de falhas resiliente
├── supabase/                # Migrations e Edge Functions do Supabase
├── .env.example             # Exemplo de variáveis de ambiente
├── bun.lock / bun.lockb     # Lockfiles do gerenciador de pacotes Bun
├── components.json          # Configurações de componentes UI
├── eslint.config.js         # Regras de linting de código
├── index.html               # Template HTML raiz da aplicação
├── package.json             # Dependências e scripts de execução
├── playwright.config.ts     # Configuração de testes E2E com Playwright
├── tailwind.config.ts       # Configurações do framework CSS
├── tsconfig.*.json          # Configurações estritas do TypeScript
├── vite.config.ts           # Configuração do bundler Vite
└── vitest.config.ts         # Configuração de testes unitários
```

---

## 🛠️ Configuração e Execução

### 1. Pré-requisitos

- Node.js 18+ instalado
- npm ou bun

### 2. Instalação das dependências

```bash
npm install
```

### 3. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Preencha com as suas credenciais:

```env
# Supabase (Obrigatório para sincronização em nuvem; opcional se utilizar Modo Demonstração)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-anon-aqui

# (Opcional) Google Books API Key
VITE_GOOGLE_BOOKS_API_KEY=sua-chave-opcional-aqui
```

> **Nota:** Caso execute o projeto sem configurar o Supabase, você pode utilizar o **Modo Visitante / Demonstração** na tela inicial para testar todas as funcionalidades do dashboard com dados locais salvos no navegador.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:5173` *(ou a porta informada no seu terminal)*

### 5. Compilação para Produção

```bash
npm run build
```

---

## 🎨 Identidade Visual e Princípios de Design

- **Tipografia**: *Fraunces* (serifa editorial com personalidade para títulos e destaques) e *Inter* (sans-serif para legibilidade superior em dados e corpos de texto).
- **Paleta Harmônica**: Marsala nobre (`#722F37`), papel creme suave e acentos em ouro antigo, mantendo a atmosfera aconchegante de biblioteca tanto no modo diurno quanto no modo noturno profundo.
- **Micro-interações**: Feedback visual sutil em barras de progresso, estados hover e transições suaves de abas.

---

## 📄 Licença e Autoria

© 2026 Cauã Dos Santos Nascimento.

Distribuído sob a licença Apache 2.0. Veja o arquivo [LICENSE](./LICENSE.txt) para mais detalhes.
