-- UNSEEL · ajuste da etapa 2: tira a defesa PREVISTA da lista pública.
-- Rode no SQL Editor (New query → cole → Run). Pode rodar mais de uma vez.

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
