
-- Agrega el campo foto_url a la tabla de perfiles para la foto del usuario
ALTER TABLE public.profiles
ADD COLUMN photo_url text;

-- Permite que los usuarios actualicen su propio perfil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política SELECT: usuario sólo puede ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política UPDATE: usuario sólo puede modificar su propio perfil
CREATE POLICY "Usuarios pueden modificar su propio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política INSERT: (por trigger ya se crean en signup, puede omitirse INSERT directa)
