-- Adiciona colunas para gestão de livros pegos emprestados (bibliotecas, amigos, etc.)
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS borrowed_from TEXT,
ADD COLUMN IF NOT EXISTS borrowed_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS return_date TIMESTAMPTZ;

