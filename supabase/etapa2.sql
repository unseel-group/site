-- =====================================================================
-- UNSEEL · Área de membros · ETAPA 2
-- Permissões por área, datas (entrada/defesa), "concluído",
-- egressos sem conta e a lista pública da página Equipe.
-- Rode DEPOIS da etapa 1: SQL Editor → New query → cole tudo → Run.
-- Pode rodar de novo sem problema.
-- =====================================================================

-- 1) Novos campos no perfil ------------------------------------------------
alter table public.perfis add column if not exists ano_entrada     int;
alter table public.perfis add column if not exists defesa_prevista text default '';   -- AAAA-MM
alter table public.perfis add column if not exists defesa_data     text default '';   -- AAAA-MM (quando defendeu)
alter table public.perfis add column if not exists mostrar_no_site boolean not null default true;
alter table public.perfis add column if not exists permissoes      text[] not null default '{}';
alter table public.perfis add column if not exists concluido_em    timestamptz;
alter table public.perfis add column if not exists linkedin        text default '';
alter table public.perfis add column if not exists scholar         text default '';

alter table public.perfis drop constraint if exists perfis_status_check;
alter table public.perfis add constraint perfis_status_check
  check (status in ('pendente', 'aprovado', 'recusado', 'concluido'));

-- 2) Quem pode o quê ---------------------------------------------------------
-- Permissões possíveis: biblioteca, agenda, dados, equipe, projetos, noticias
create or replace function public.tem_permissao(p text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.perfis
    where id = auth.uid() and status = 'aprovado'
      and (papel = 'coordenacao' or p = any(permissoes))
  );
$$;
grant execute on function public.tem_permissao(text) to authenticated;

-- 3) Proteções ao alterar um perfil -----------------------------------------
create or replace function public.protege_papel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    -- papel, situação e permissões: só a coordenação
    if (new.papel is distinct from old.papel or new.status is distinct from old.status
        or new.permissoes is distinct from old.permissoes) and not public.eh_coordenacao() then
      raise exception 'Apenas a coordenação pode alterar papel, situação ou permissões.';
    end if;
    -- quem concluiu não edita mais (coordenação e responsáveis pela equipe podem)
    if old.status = 'concluido' and not public.tem_permissao('equipe') then
      raise exception 'Cadastro concluído: as informações agora são editadas pela coordenação.';
    end if;
  end if;
  if new.status = 'aprovado' and old.status is distinct from 'aprovado' then
    new.aprovado_em := now();
    new.aprovado_por := auth.uid();
  end if;
  if new.status = 'concluido' and old.status is distinct from 'concluido' then
    new.concluido_em := now();
    new.permissoes := '{}';
    if new.papel = 'coordenacao' then new.papel := 'membro'; end if;
  end if;
  new.email := old.email;
  return new;
end $$;

-- 4) Regras de acesso dos perfis (substituem as da etapa 1) ------------------
drop policy if exists "ver perfis" on public.perfis;
create policy "ver perfis" on public.perfis for select to authenticated
  using (
    id = auth.uid()
    or public.eh_coordenacao()
    or public.tem_permissao('equipe')
    or (status in ('aprovado', 'concluido') and public.eh_membro_aprovado())
  );

drop policy if exists "editar o próprio perfil" on public.perfis;
create policy "editar o próprio perfil" on public.perfis for update to authenticated
  using (id = auth.uid() or public.tem_permissao('equipe'))
  with check (id = auth.uid() or public.tem_permissao('equipe'));

-- 5) Pessoas sem conta no site (egressos e outros) ---------------------------
create table if not exists public.pessoas_externas (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  foto_url        text default '',
  nivel           text default '',
  vinculo         text default '',
  tema            text default '',
  lattes          text default '',
  orcid           text default '',
  researchgate    text default '',
  linkedin        text default '',
  ano_entrada     int,
  defesa_data     text default '',          -- AAAA-MM ou AAAA
  situacao        text not null default 'egresso' check (situacao in ('ativo', 'egresso')),
  mostrar_no_site boolean not null default true,
  atualizado_em   timestamptz not null default now(),
  atualizado_por  uuid references auth.users (id)
);
alter table public.pessoas_externas add column if not exists linkedin text default '';
alter table public.pessoas_externas add column if not exists scholar text default '';
create unique index if not exists pessoas_externas_nome on public.pessoas_externas (lower(nome));

create or replace function public.carimbo_externa() returns trigger
language plpgsql security definer set search_path = public as $$
begin new.atualizado_em := now(); new.atualizado_por := auth.uid(); return new; end $$;
drop trigger if exists antes_de_salvar_externa on public.pessoas_externas;
create trigger antes_de_salvar_externa before insert or update on public.pessoas_externas
  for each row execute function public.carimbo_externa();

alter table public.pessoas_externas enable row level security;
drop policy if exists "externas: ver" on public.pessoas_externas;
create policy "externas: ver" on public.pessoas_externas for select to authenticated
  using (public.eh_membro_aprovado());
drop policy if exists "externas: criar" on public.pessoas_externas;
create policy "externas: criar" on public.pessoas_externas for insert to authenticated
  with check (public.tem_permissao('equipe'));
drop policy if exists "externas: editar" on public.pessoas_externas;
create policy "externas: editar" on public.pessoas_externas for update to authenticated
  using (public.tem_permissao('equipe')) with check (public.tem_permissao('equipe'));
drop policy if exists "externas: apagar" on public.pessoas_externas;
create policy "externas: apagar" on public.pessoas_externas for delete to authenticated
  using (public.tem_permissao('equipe'));

-- 6) Fotos: responsáveis pela equipe também podem enviar (pasta externos/ e de membros)
drop policy if exists "fotos: enviar a própria" on storage.objects;
create policy "fotos: enviar a própria" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and ((storage.foldername(name))[1] = auth.uid()::text or public.tem_permissao('equipe')));
drop policy if exists "fotos: trocar a própria" on storage.objects;
create policy "fotos: trocar a própria" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and ((storage.foldername(name))[1] = auth.uid()::text or public.tem_permissao('equipe')));

-- 7) Lista pública da página Equipe (sem e-mail, só quem aceitou aparecer) ----
drop function if exists public.equipe_publica();
create function public.equipe_publica()
returns table (id text, origem text, nome text, foto_url text, nivel text, vinculo text, tema text,
               lattes text, orcid text, researchgate text, linkedin text, scholar text, ano_entrada int,
               defesa_data text, situacao text, papel text)
language sql stable security definer set search_path = public as $$
  -- a defesa PREVISTA não sai daqui: é só para o cadastro e a coordenação
  select p.id::text, 'perfil', p.nome, p.foto_url, p.nivel, p.vinculo, p.tema, p.lattes, p.orcid, p.researchgate, p.linkedin, p.scholar,
         p.ano_entrada, p.defesa_data,
         case when p.status = 'concluido' then 'egresso' else 'ativo' end, p.papel
  from public.perfis p
  where p.status in ('aprovado', 'concluido') and p.mostrar_no_site and p.nome <> ''
  union all
  select 'x-' || e.id::text, 'externa', e.nome, e.foto_url, e.nivel, e.vinculo, e.tema, e.lattes, e.orcid, e.researchgate, e.linkedin, e.scholar,
         e.ano_entrada, e.defesa_data, e.situacao, 'membro'
  from public.pessoas_externas e
  where e.mostrar_no_site;
$$;
grant execute on function public.equipe_publica() to anon, authenticated;

-- 8) Egressos que já constavam no site antigo (complete depois pelo site) -----
insert into public.pessoas_externas (nome, nivel, situacao) values
  ('Lucia Calderón', 'assistente', 'egresso'),
  ('Miguel Trejo Rangel', 'doutorado', 'egresso'),
  ('Adriano Mota Ferreira', 'doutorado', 'egresso'),
  ('Aloisio Lelis de Paula', 'doutorado', 'egresso'),
  ('Luciana Bravo', 'doutorado', 'egresso'),
  ('Maurício Barone', 'doutorado', 'egresso'),
  ('Henrique Forini', 'doutorado', 'egresso'),
  ('Melissa da Silva Oliveira', 'doutorado', 'egresso')
on conflict ((lower(nome))) do nothing;
