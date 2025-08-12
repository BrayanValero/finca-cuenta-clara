-- Crear el registro faltante para el usuario actual
INSERT INTO public.profiles (id, created_at, updated_at)
VALUES ('5080977e-f333-48b7-8b92-7bc963d05d11', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Verificar que el trigger existe y funciona correctamente para nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (NEW.id, now(), now());
  RETURN NEW;
END;
$$;

-- Asegurar que el trigger esté activo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();