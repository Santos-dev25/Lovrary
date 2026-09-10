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
lovrary-shelfie-journal/
├── src/
│   ├── assets/              # Recursos estáticos
│   ├── components/          # Componentes modulares de UI e páginas do painel
│   │   ├── ui/              # Componentes base (botões, inputs, diálogos, etc.)
│   │   ├── LovraryLogo.tsx  # Identidade visual em vetor SVG otimizado
│   │   ├── BookCard.tsx     # Card de livro com estética física de encadernação
│   │   ├── StatsPanel.tsx   # Painel analítico de páginas e metas
│   │   ├── ReadingNow.tsx   # Acompanhamento de leitura em andamento
│   │   └── ...
│   ├── context/             # Context API para gerenciamento de estado (BooksContext)
│   ├── data/                # Dados mockados e definições de tipos para modo offline
│   ├── hooks/               # Hooks customizados (responsividade, notificações)
│   ├── lib/                 # Utilitários, cliente Supabase e serviço Google Books
│   ├── pages/               # Páginas principais (Dashboard, Auth, 404)
│   ├── index.css            # Sistema de design, paletas HSL e suporte a tema escuro
│   └── main.tsx             # Ponto de entrada com tratamento de falhas resiliente
├── supabase/                # Migrations e Edge Functions do Supabase
└── public/                  # Arquivos públicos e favicon
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

Acesse: `http://localhost:8080`

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

## 📄 Licença
Distribuído sob licença proprietária e autoral.
