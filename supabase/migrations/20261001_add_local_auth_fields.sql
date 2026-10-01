ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE public.users ADD CONSTRAINT users_username_length CHECK (username IS NULL OR char_length(username) BETWEEN 3 AND 30);
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON public.users (username) WHERE username IS NOT NULL;
