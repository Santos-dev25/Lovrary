-- Adiciona colunas para controle de empréstimos na tabela books
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS borrowed_to TEXT,
ADD COLUMN IF NOT EXISTS borrowed_date TIMESTAMPTZ;

