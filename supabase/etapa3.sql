-- =====================================================================
-- UNSEEL · Área de membros · ETAPA 3 (atividades no estilo ClickUp)
-- Cole tudo no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo sem problema (não apaga dados).
-- Precisa que as etapas 1 e 2 já tenham sido rodadas.
-- =====================================================================

-- 1) Atividades --------------------------------------------------------------
create table if not exists public.atividades (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null,
  descricao     text not null default '',
  inicio        date not null,
  fim           date,
  hora_inicio   time,
  hora_fim      time,
  status        text not null default 'a_fazer'
                check (status in ('a_fazer', 'andamento', 'revisao', 'concluida')),
  prioridade    text not null default 'normal'
                check (prioridade in ('baixa', 'normal', 'alta', 'urgente')),
  tipo          text not null default 'tarefa'
                check (tipo in ('tarefa', 'reuniao', 'prazo', 'viagem', 'organizado', 'participacao', 'outro')),
  local         text not null default '',
  link_meet     text not null default '',
  responsavel   uuid references public.perfis (id) on delete set null,
  participantes uuid[] not null default '{}',
  publico       boolean not null default false,     -- aparece na agenda pública do site
  criado_por    uuid references public.perfis (id) on delete set null,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists atividades_inicio on public.atividades (inicio);
create index if not exists atividades_participantes on public.atividades using gin (participantes);

create or replace function public.protege_atividade() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.atualizado_em := now();
  if tg_op = 'INSERT' then
    if auth.uid() is not null then new.criado_por := auth.uid(); end if;
    if new.responsavel is null then new.responsavel := auth.uid(); end if;
  end if;
  if auth.uid() is not null then
    -- só a coordenação cria ou passa atividade para outra pessoa
    if new.responsavel is distinct from auth.uid()
       and (tg_op = 'INSERT' or new.responsavel is distinct from old.responsavel)
       and not public.eh_coordenacao() then
      raise exception 'Só a coordenação pode definir outra pessoa como responsável. Marque a pessoa como participante.';
    end if;
    -- publicar no site: coordenação ou quem cuida da Agenda
    if new.publico and (tg_op = 'INSERT' or not old.publico) and not public.tem_permissao('agenda') then
      raise exception 'Só a coordenação ou quem cuida da Agenda pode publicar na agenda do site.';
    end if;
  end if;
  if new.fim is not null and new.fim < new.inicio then new.fim := null; end if;
  return new;
end $$;

drop trigger if exists antes_de_salvar_atividade on public.atividades;
create trigger antes_de_salvar_atividade before insert or update on public.atividades
  for each row execute function public.protege_atividade();

alter table public.atividades enable row level security;

drop policy if exists "atividades: ver" on public.atividades;
create policy "atividades: ver" on public.atividades for select to authenticated
  using (public.eh_membro_aprovado());

drop policy if exists "atividades: criar" on public.atividades;
create policy "atividades: criar" on public.atividades for insert to authenticated
  with check (public.eh_membro_aprovado());

drop policy if exists "atividades: editar" on public.atividades;
create policy "atividades: editar" on public.atividades for update to authenticated
  using (public.eh_membro_aprovado() and (public.eh_coordenacao() or responsavel = auth.uid()
         or criado_por = auth.uid() or auth.uid() = any (participantes)))
  with check (public.eh_membro_aprovado());

drop policy if exists "atividades: apagar" on public.atividades;
create policy "atividades: apagar" on public.atividades for delete to authenticated
  using (public.eh_coordenacao() or responsavel = auth.uid() or criado_por = auth.uid());

-- 2) Comentários ---------------------------------------------------------------
create table if not exists public.atividade_comentarios (
  id           uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references public.atividades (id) on delete cascade,
  autor        uuid references public.perfis (id) on delete set null default auth.uid(),
  texto        text not null,
  mencoes      uuid[] not null default '{}',     -- quem foi marcado com @ (para os avisos por e-mail)
  notificado   boolean not null default false,
  criado_em    timestamptz not null default now()
);
create index if not exists comentarios_atividade on public.atividade_comentarios (atividade_id, criado_em);
alter table public.atividade_comentarios enable row level security;

drop policy if exists "comentarios: ver" on public.atividade_comentarios;
create policy "comentarios: ver" on public.atividade_comentarios for select to authenticated
  using (public.eh_membro_aprovado());
drop policy if exists "comentarios: criar" on public.atividade_comentarios;
create policy "comentarios: criar" on public.atividade_comentarios for insert to authenticated
  with check (public.eh_membro_aprovado() and autor = auth.uid());
drop policy if exists "comentarios: editar" on public.atividade_comentarios;
create policy "comentarios: editar" on public.atividade_comentarios for update to authenticated
  using (autor = auth.uid()) with check (autor = auth.uid());
drop policy if exists "comentarios: apagar" on public.atividade_comentarios;
create policy "comentarios: apagar" on public.atividade_comentarios for delete to authenticated
  using (autor = auth.uid() or public.eh_coordenacao());

-- 3) Anexos (arquivos até 10 MB ou links, ex.: Google Drive) -------------------
create table if not exists public.atividade_anexos (
  id           uuid primary key default gen_random_uuid(),
  atividade_id uuid not null references public.atividades (id) on delete cascade,
  nome         text not null,
  caminho      text,          -- arquivo guardado no Supabase (pasta "anexos")
  link         text,          -- ou um link externo
  tamanho      bigint,
  autor        uuid references public.perfis (id) on delete set null default auth.uid(),
  criado_em    timestamptz not null default now()
);
alter table public.atividade_anexos enable row level security;

drop policy if exists "anexos: ver" on public.atividade_anexos;
create policy "anexos: ver" on public.atividade_anexos for select to authenticated
  using (public.eh_membro_aprovado());
drop policy if exists "anexos: criar" on public.atividade_anexos;
create policy "anexos: criar" on public.atividade_anexos for insert to authenticated
  with check (public.eh_membro_aprovado() and autor = auth.uid());
drop policy if exists "anexos: apagar" on public.atividade_anexos;
create policy "anexos: apagar" on public.atividade_anexos for delete to authenticated
  using (autor = auth.uid() or public.eh_coordenacao());

-- pasta privada de arquivos: só membros aprovados abrem
insert into storage.buckets (id, name, public, file_size_limit)
values ('anexos', 'anexos', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists "anexos: abrir" on storage.objects;
create policy "anexos: abrir" on storage.objects for select to authenticated
  using (bucket_id = 'anexos' and public.eh_membro_aprovado());
drop policy if exists "anexos: enviar" on storage.objects;
create policy "anexos: enviar" on storage.objects for insert to authenticated
  with check (bucket_id = 'anexos' and public.eh_membro_aprovado()
              and (storage.foldername(name))[2] = auth.uid()::text);
drop policy if exists "anexos: remover" on storage.objects;
create policy "anexos: remover" on storage.objects for delete to authenticated
  using (bucket_id = 'anexos' and ((storage.foldername(name))[2] = auth.uid()::text or public.eh_coordenacao()));

-- 4) Link pessoal para o Google Agenda (só do site para a agenda da pessoa) ----
create table if not exists public.agenda_tokens (
  perfil_id uuid primary key references public.perfis (id) on delete cascade default auth.uid(),
  token     uuid not null default gen_random_uuid(),
  criado_em timestamptz not null default now()
);
alter table public.agenda_tokens enable row level security;
drop policy if exists "token: o próprio" on public.agenda_tokens;
create policy "token: o próprio" on public.agenda_tokens for all to authenticated
  using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

-- usado pela função "agenda-ics" (o token funciona como senha do link)
drop function if exists public.agenda_ics_dados(uuid, boolean);
create function public.agenda_ics_dados(t uuid, todas boolean default false)
returns table (id uuid, titulo text, descricao text, inicio date, fim date, hora_inicio time, hora_fim time,
               local text, link_meet text, status text, tipo text, responsavel text, atualizado_em timestamptz)
language sql stable security definer set search_path = public as $$
  with quem as (
    select p.id from public.agenda_tokens k join public.perfis p on p.id = k.perfil_id
    where k.token = t and p.status = 'aprovado'
  )
  select a.id, a.titulo, a.descricao, a.inicio, a.fim, a.hora_inicio, a.hora_fim, a.local, a.link_meet,
         a.status, a.tipo, coalesce(r.nome, ''), a.atualizado_em
  from public.atividades a
  join quem on true
  left join public.perfis r on r.id = a.responsavel
  where a.inicio >= current_date - 120
    and (todas or a.responsavel = quem.id or quem.id = any (a.participantes) or a.criado_por = quem.id);
$$;
revoke all on function public.agenda_ics_dados(uuid, boolean) from public;
grant execute on function public.agenda_ics_dados(uuid, boolean) to anon, authenticated;

-- 5) Atividades marcadas como públicas aparecem na Agenda do site ------------
drop function if exists public.agenda_publica();
create function public.agenda_publica()
returns table (id uuid, titulo text, inicio date, fim date, hora text, tipo text, local text, descricao text)
language sql stable security definer set search_path = public as $$
  select a.id, a.titulo, a.inicio, a.fim,
         coalesce(to_char(a.hora_inicio, 'HH24:MI'), '') || coalesce('–' || to_char(a.hora_fim, 'HH24:MI'), ''),
         case when a.tipo in ('reuniao', 'viagem', 'organizado', 'participacao') then a.tipo else 'outro' end,
         a.local, a.descricao
  from public.atividades a
  where a.publico and a.inicio >= current_date - 400
  order by a.inicio;
$$;
grant execute on function public.agenda_publica() to anon, authenticated;
