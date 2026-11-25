-- =====================================================================
-- UNSEEL · Área de membros · ETAPA 1 (cadastro, perfis, aprovação)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo sem problema (não apaga dados).
-- =====================================================================

-- 1) Perfis dos membros -------------------------------------------------
create table if not exists public.perfis (
  id            uuid primary key references auth.users (id) on delete cascade,
  nome          text not null default '',
  email         text not null default '',
  foto_url      text default '',
  nivel         text default '',          -- coordenacao, pesquisador, doutorado, mestrado, iniciacao, assistente
  vinculo       text default '',          -- ex.: PGCST/INPE
  tema          text default '',
  lattes        text default '',
  orcid         text default '',
  researchgate  text default '',
  papel         text not null default 'membro'   check (papel in ('membro', 'coordenacao')),
  status        text not null default 'pendente' check (status in ('pendente', 'aprovado', 'recusado')),
  criado_em     timestamptz not null default now(),
  aprovado_em   timestamptz,
  aprovado_por  uuid references auth.users (id)
);

-- 2) Quem é coordenação / membro aprovado (usado pelas regras abaixo) ---
create or replace function public.eh_coordenacao() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and papel = 'coordenacao' and status = 'aprovado');
$$;

create or replace function public.eh_membro_aprovado() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and status = 'aprovado');
$$;

-- 3) Cria o perfil sozinho quando alguém se cadastra ---------------------
create or replace function public.novo_usuario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome, email, nivel, vinculo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'nivel', ''),
    coalesce(new.raw_user_meta_data ->> 'vinculo', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.novo_usuario();

-- 4) Só a coordenação muda papel e situação (aprovação) -----------------
create or replace function public.protege_papel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() vazio = comando rodado pelo administrador no SQL Editor: liberado
  if auth.uid() is not null
     and (new.papel is distinct from old.papel or new.status is distinct from old.status)
     and not public.eh_coordenacao() then
    raise exception 'Apenas a coordenação pode alterar papel ou aprovação.';
  end if;
  if new.status = 'aprovado' and old.status is distinct from 'aprovado' then
    new.aprovado_em := now();
    new.aprovado_por := auth.uid();
  end if;
  new.email := old.email;  -- o e-mail vem da conta, não se edita aqui
  return new;
end $$;

drop trigger if exists antes_de_alterar_perfil on public.perfis;
create trigger antes_de_alterar_perfil before update on public.perfis
  for each row execute function public.protege_papel();

-- 5) Regras de acesso (Row Level Security) ------------------------------
alter table public.perfis enable row level security;

drop policy if exists "ver perfis" on public.perfis;
create policy "ver perfis" on public.perfis for select to authenticated
  using (
    id = auth.uid()                                         -- o próprio perfil
    or public.eh_coordenacao()                              -- coordenação vê todos
    or (status = 'aprovado' and public.eh_membro_aprovado())-- membros aprovados veem os aprovados
  );

drop policy if exists "editar o próprio perfil" on public.perfis;
create policy "editar o próprio perfil" on public.perfis for update to authenticated
  using (id = auth.uid() or public.eh_coordenacao())
  with check (id = auth.uid() or public.eh_coordenacao());

drop policy if exists "coordenação remove" on public.perfis;
create policy "coordenação remove" on public.perfis for delete to authenticated
  using (public.eh_coordenacao());

-- 6) Fotos de perfil (bucket público, 2 MB, só imagens) -----------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "fotos: ver" on storage.objects;
create policy "fotos: ver" on storage.objects for select
  using (bucket_id = 'fotos');

drop policy if exists "fotos: enviar a própria" on storage.objects;
create policy "fotos: enviar a própria" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fotos: trocar a própria" on storage.objects;
create policy "fotos: trocar a própria" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fotos: apagar a própria" on storage.objects;
create policy "fotos: apagar a própria" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 7) Mantém o projeto acordado (o plano gratuito pausa após 1 semana parado)
create or replace function public.ping() returns text
language sql stable as $$ select 'ok'::text $$;
grant execute on function public.ping() to anon, authenticated;

-- =====================================================================
-- DEPOIS QUE O VICTOR CRIAR A CONTA NO SITE, rode isto UMA vez
-- (troque o e-mail pelo dele) para torná-lo coordenador:
--
--   update public.perfis set papel = 'coordenacao', status = 'aprovado'
--   where email = 'EMAIL-DO-VICTOR@exemplo.com';
--
-- (Rode pelo SQL Editor; ali você age como administrador do banco.)
-- =====================================================================
