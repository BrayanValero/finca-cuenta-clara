-- Agregar campos adicionales a la tabla animals para perfiles detallados
ALTER TABLE public.animals 
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS breed TEXT,
ADD COLUMN IF NOT EXISTS observations TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS weight NUMERIC,
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Crear bucket para imágenes de animales si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-images', 'animal-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para el bucket de imágenes de animales
CREATE POLICY "Users can view animal images"
ON storage.objects FOR SELECT
USING (bucket_id = 'animal-images');

CREATE POLICY "Users can upload animal images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'animal-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their animal images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'animal-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their animal images"
ON storage.objects FOR DELETE
USING (bucket_id = 'animal-images' AND auth.role() = 'authenticated');