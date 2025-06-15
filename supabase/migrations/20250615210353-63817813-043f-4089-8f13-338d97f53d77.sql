
-- Crear bucket público para avatares
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Política para permitir acceso público a los archivos del bucket 'avatars'
-- Permite leer archivos a cualquiera
create policy "Public read access for avatars"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Permite que los usuarios carguen archivos a su propio usuario y carpeta
create policy "Logged in users can upload to avatars"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
  );

-- Permite que los usuarios eliminen archivos que hayan subido (si quieres puedes ajustar esta política)
create policy "Logged in users can delete their avatars"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
  );
