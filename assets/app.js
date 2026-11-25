/* Site do UNSEEL — lê os arquivos em data/ e monta as páginas, em português ou inglês.
   Para mudar textos, pessoas, projetos ou fotos, edite os arquivos .json em data/.
   Campos terminados em _en são a versão em inglês (se faltarem, aparece o português). */
(function () {
  'use strict';

  var D = {};
  var main = document.getElementById('conteudo');
  var raiz = document.documentElement;
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var limpezas = [];
  var lang = 'pt';
  var salvo = null;
  try { salvo = localStorage.getItem('unseel-idioma'); } catch (e) { /* sem armazenamento */ }
  lang = salvo === 'en' || salvo === 'pt' ? salvo : (/^pt/i.test(navigator.language || 'pt') ? 'pt' : 'en');

  /* ---------- textos da interface ---------- */
  var T = {
    pt: {
      menu: 'Menu', nav_inicio: 'Início', nav_coord: 'Coordenação', nav_equipe: 'Equipe', nav_projetos: 'Projetos',
      nav_pubs: 'Publicações', nav_midia: 'Na mídia', nav_dados: 'Dados', nav_contato: 'Contato', fale: 'Fale conosco',
      carregando: 'Carregando…', pular: 'Pular para o conteúdo',
      conheca: 'Conheça os projetos', faca_parte: 'Faça parte',
      destaques_olho: 'Acontecendo agora', destaques: 'Destaques', tudo_midia: 'Tudo na mídia →',
      n_pubs: 'publicações no site', n_ativos: 'pesquisadores e estudantes ativos', n_proj: 'projetos', n_anos: 'anos de pesquisa (desde 2019)',
      quem_olho: 'Quem somos', quem_tit: 'Pesquisa sobre as dimensões sociais dos desastres',
      missao: 'Missão', visao: 'Visão', valores: 'Valores',
      nome_olho: 'Sobre o nome', por_que: 'Por que UNSEEL?', linhas: 'Linhas de pesquisa',
      proj_olho: 'Pesquisa em ação', projetos: 'Projetos', todos_proj: 'Todos os projetos →', explorar: 'Explorar o projeto →',
      pubs_rec: 'Publicações recentes', ver_todas: 'Ver todas →', na_midia: 'Na mídia',
      sem_pubs: 'Nenhuma publicação ainda.', sem_not: 'Nenhuma notícia ainda.',
      st_and: 'Em andamento', st_prep: 'Em preparação', st_conc: 'Concluído', st_concs: 'Concluídos',
      tag_midia: 'Na mídia', tag_proj: 'Projeto em andamento', tag_pub: 'Nova publicação', tag_foto: 'Foto',
      pausar: 'Pausar', tocar: 'Tocar', ant: 'Destaque anterior', prox: 'Próximo destaque', ir: 'Ir para o destaque ',
      niveis: { coordenacao: 'Coordenação', pesquisador: 'Pesquisadores', doutorado: 'Doutorado', mestrado: 'Mestrado', iniciacao: 'Iniciação científica', assistente: 'Assistentes de pesquisa' },
      nivel1: { coordenacao: 'Coordenador', pesquisador: 'Pesquisador(a)', doutorado: 'Doutorado', mestrado: 'Mestrado', iniciacao: 'Iniciação científica', assistente: 'Assistente de pesquisa' },
      defendeu: 'defendeu em ', andamento: 'em andamento', egresso: 'egresso(a)',
      tipos: { artigo: 'Artigo', capitulo: 'Capítulo', livro: 'Livro', relatorio: 'Relatório', dados: 'Dados', preprint: 'Preprint', tese: 'Tese/Dissertação', dissertacao: 'Dissertação', outro: 'Outro' },
      coord_olho: 'Coordenação', voltar_equipe: '← Equipe', nao_achou: 'Pessoa não encontrada', voltar: 'Voltar',
      formacao: 'Formação', atuacao: 'Atuação', premios: 'Prêmios', livros: 'Livros', curriculo: 'Currículo Lattes', site_antigo: 'Site anterior',
      ver_todas_n: 'Ver todas', sem_pubs_pessoa: 'As publicações aparecem aqui automaticamente quando o ORCID estiver cadastrado na equipe.', sem_not_pessoa: 'Sem notícias por enquanto.',
      pessoas_olho: 'Pessoas', equipe: 'Equipe', equipe_lead: 'Pesquisadores, estudantes e egressos do UNSEEL. Quem tem ORCID cadastrado tem as publicações atualizadas automaticamente.',
      situacao: 'Situação', ativos: 'Ativos', egressos: 'Egressos', todos: 'Todos', todas: 'Todas', nivel: 'Nível', projeto: 'Projeto', defesa: 'Defesa',
      ja_def: 'Já defendeu', nao_def: 'Ainda não defendeu', pessoa1: ' pessoa', pessoas: ' pessoas', ninguem: 'Ninguém com esses filtros.',
      proj_lead: 'Cada projeto reúne sua equipe, publicações, notícias e dados.', proj_nao: 'Projeto não encontrado', voltar_proj: '← Projetos',
      periodo: 'Período', financiamento: 'Financiamento', parceiros: 'Parceiros', links: 'Links', participantes: 'Participantes',
      sem_part: 'Marque o projeto no cadastro de cada pessoa (data/equipe.json) para ela aparecer aqui.',
      publicacoes: 'Publicações', noticias: 'Notícias', dados: 'Dados',
      sem_pubs_proj: 'Publicações com as palavras-chave do projeto no título aparecem aqui automaticamente.', sem_not_proj: 'Sem notícias deste projeto por enquanto.',
      prod_olho: 'Produção', aviso_pubs: 'Artigos atualizados automaticamente toda semana a partir do ORCID de cada membro (via OpenAlex)', ultima: ', última atualização em ',
      aviso_pubs2: '. Livros, capítulos e relatórios que só constam no Lattes são incluídos à mão.', grafico: 'Publicações por ano — clique em um ano para filtrar',
      buscar: 'Buscar', busca_ph: 'Título, autor, revista…', ano: 'Ano', pessoa: 'Pessoa', tipo: 'Tipo', pub1: ' publicação', pubs: ' publicações', sem_data: 'Sem data', nada: 'Nada encontrado com esses filtros.',
      imprensa: 'Imprensa', aviso_midia: 'Notícias e entrevistas encontradas automaticamente toda semana no Google Notícias', ultima_busca: ' (última busca em ',
      ciencia: 'Ciência aberta', dados_lead: 'Bases de dados produzidas pelo grupo, com descrição, licença e link para acesso.', sem_dados: 'Nenhum conjunto de dados publicado ainda.',
      ano_c: 'Ano', autoria: 'Autoria', repositorio: 'Repositório', formato: 'Formato', licenca: 'Licença', acessar: 'Acessar os dados',
      contato: 'Contato', fale_tit: 'Fale conosco', email: 'E-mail', onde: 'Onde estamos', redes: 'Redes sociais', quer: 'Quer fazer parte do grupo?',
      quero: 'Quero fazer parte', assunto: 'Quero fazer parte do UNSEEL', ou: 'ou escreva para ',
      rodape_auto: 'Publicações e notícias atualizadas automaticamente toda semana.', inicio_aria: 'UNSEEL – página inicial',
      banco: 'Banco de dados', banco_lead: 'Dados coletados nas pesquisas do UNSEEL, organizados por pesquisa, com a aprovação ética, o dicionário de variáveis e os arquivos para baixar ou ver em tabela, gráfico e mapa.',
      pesquisa_pref: 'Pesquisa ', base1: ' base', bases_n: ' bases', etica_tit: 'Aprovação ética', comite: 'Comitê', caae: 'CAAE', parecer: 'Parecer', data_aprov: 'Aprovado em',
      ver_parecer: 'Ver parecer de aprovação (PDF)', parecer_pend: 'Documento do parecer ainda não anexado.', nao_aplica: 'Não se aplica (pesquisa sem participação de seres humanos).',
      metodologia: 'Metodologia', abrangencia: 'Abrangência', bases_tit: 'Bases de dados', sem_bases: 'Nenhuma base publicada ainda.',
      partilhar: 'Compartilhar', copiar_link: 'Copiar link', link_copiado: 'Link copiado. É só colar onde quiser.', ig_copiado: 'Link copiado. Abra o Instagram e cole no story, na bio ou numa mensagem.', copie_aqui: 'Copie o link:',
      visualizar: 'Visualizar', fechar: 'Fechar', baixar: 'Baixar', dicionario: 'Dicionário de variáveis', variavel: 'Variável', descricao: 'Descrição',
      tabela: 'Tabela', grafico_t: 'Gráfico', mapa: 'Mapa', exemplo_aviso: 'Exemplo de formato — não são dados da pesquisa.', linhas_n: ' linhas', mostrando: ' · mostrando as primeiras ',
      carregando_dados: 'Carregando dados…', erro_dados: 'Não foi possível abrir o arquivo.', categoria: 'Categoria', valor: 'Valor', agregacao: 'Agregação',
      contagem: 'Contagem', soma: 'Soma', media: 'Média', mapa_sem_base: 'Mapa de fundo indisponível aqui; os pontos estão posicionados pelas coordenadas.',
      outras: 'Outras bases', ver_banco: 'Ver o banco de dados da pesquisa →', atualizado: 'Atualizado em', busca_pesq: 'Buscar pesquisa', voltar_dados: '← Banco de dados',
      etica_ok: 'Aprovação ética registrada', etica_pend: 'Aprovação ética a preencher', etica_na: 'Sem exigência de comitê de ética', filtrar: 'Filtrar linhas…',
      nav_biblioteca: 'Biblioteca', acervo: 'Acervo', biblioteca: 'Biblioteca',
      bib_lead: 'Publicações, materiais didáticos, audiovisual e fotos de trabalhos de campo do UNSEEL. Busque pelo título e ordene como preferir.',
      bib_busca: 'Título, autor, palavra-chave…', ordenar: 'Ordenar por', o_recentes: 'Mais recentes', o_antigos: 'Mais antigos', o_az: 'Título (A–Z)', o_za: 'Título (Z–A)',
      c_publicacao: 'Publicações', c_didatico: 'Materiais didáticos', c_audiovisual: 'Audiovisual', c_foto: 'Fotos de campo',
      c1_publicacao: 'Publicação', c1_didatico: 'Material didático', c1_audiovisual: 'Audiovisual', c1_foto: 'Foto de campo',
      item1: ' item', itens: ' itens', bib_vazia: 'A biblioteca ainda está vazia.', ver_foto: 'Ver foto', assistir: 'Assistir / ouvir', abrir: 'Abrir',
      ant_item: 'Item anterior', prox_item: 'Próximo item',
      nav_agenda: 'Agenda', agenda: 'Agenda', ag_olho: 'Calendário do grupo', ag_lead: 'Reuniões do grupo, viagens de trabalho e eventos que o UNSEEL organiza ou de que participa. Clique em um dia para ver os detalhes.',
      ag_reuniao: 'Reunião do grupo', ag_viagem: 'Viagem de trabalho', ag_organizado: 'Evento que organizamos', ag_participacao: 'Evento em que participamos', ag_outro: 'Outros',
      ag_vazio: 'Nenhum compromisso agendado.', ag_dia_vazio: 'Nada marcado neste dia.', ag_mes_ant: 'Mês anterior', ag_mes_prox: 'Próximo mês', ag_hoje: 'Hoje',
      ag_proximos: 'Próximos compromissos', ag_google: 'Abrir na Agenda Google', ag_sinc: 'Sincronizado com a Agenda Google em ', ag_comp: 'compromissos', ag_ver: 'Ver calendário completo →', ag_dica: 'Passe o mouse ou toque num dia para ver os detalhes. Feriados em vermelho.',
      ag_feriado: 'Feriados', ag_prox_fer: 'Próximo feriado', fer_nacional: 'Feriado nacional', fer_sp: 'Feriado estadual (SP)', fer_sjc: 'Feriado municipal (São José dos Campos)', fer_facultativo: 'Ponto facultativo',
      nav_membros: 'Área de membros',
      tl_tit: 'Linha do tempo do grupo', tl_dica: 'Arraste para os lados · clique numa foto para ver a trajetória', tl_criacao: 'Criação do grupo', tl_entraram: 'Entraram', tl_defenderam: 'Defenderam', tl_previstas: 'Defesas previstas',
      tl_pessoa: 'Linha do tempo', ev_entrada: 'Entrou no UNSEEL', ev_defesa: 'Defendeu', ev_prevista: 'Defesa prevista para ',
      m_trab: ' trabalhos', m_cit: ' citações', m_h: ' índice h', m_i10: ' índice i10', m_fonte: 'Indicadores calculados pelo OpenAlex a partir do ORCID; podem diferir do Google Acadêmico.',
      ultimas: 'Últimas notícias'
    },
    en: {
      menu: 'Menu', nav_inicio: 'Home', nav_coord: 'Coordinator', nav_equipe: 'Team', nav_projetos: 'Projects',
      nav_pubs: 'Publications', nav_midia: 'In the media', nav_dados: 'Data', nav_contato: 'Contact', fale: 'Contact us',
      carregando: 'Loading…', pular: 'Skip to content',
      conheca: 'Explore our projects', faca_parte: 'Join us',
      destaques_olho: 'Happening now', destaques: 'Highlights', tudo_midia: 'All media coverage →',
      n_pubs: 'publications on this site', n_ativos: 'active researchers and students', n_proj: 'projects', n_anos: 'years of research (since 2019)',
      quem_olho: 'Who we are', quem_tit: 'Research on the social dimensions of disasters',
      missao: 'Mission', visao: 'Vision', valores: 'Values',
      nome_olho: 'About the name', por_que: 'Why UNSEEL?', linhas: 'Research lines',
      proj_olho: 'Research in action', projetos: 'Projects', todos_proj: 'All projects →', explorar: 'Explore the project →',
      pubs_rec: 'Recent publications', ver_todas: 'See all →', na_midia: 'In the media',
      sem_pubs: 'No publications yet.', sem_not: 'No news yet.',
      st_and: 'Ongoing', st_prep: 'In preparation', st_conc: 'Completed', st_concs: 'Completed',
      tag_midia: 'In the media', tag_proj: 'Ongoing project', tag_pub: 'New publication', tag_foto: 'Photo',
      pausar: 'Pause', tocar: 'Play', ant: 'Previous highlight', prox: 'Next highlight', ir: 'Go to highlight ',
      niveis: { coordenacao: 'Coordination', pesquisador: 'Researchers', doutorado: 'PhD', mestrado: "Master's", iniciacao: 'Undergraduate research', assistente: 'Research assistants' },
      nivel1: { coordenacao: 'Coordinator', pesquisador: 'Researcher', doutorado: 'PhD', mestrado: "Master's", iniciacao: 'Undergraduate research', assistente: 'Research assistant' },
      defendeu: 'defended in ', andamento: 'in progress', egresso: 'alumni',
      tipos: { artigo: 'Article', capitulo: 'Chapter', livro: 'Book', relatorio: 'Report', dados: 'Dataset', preprint: 'Preprint', tese: 'Thesis', dissertacao: 'Dissertation', outro: 'Other' },
      coord_olho: 'Coordinator', voltar_equipe: '← Team', nao_achou: 'Person not found', voltar: 'Back',
      formacao: 'Education', atuacao: 'Positions', premios: 'Awards', livros: 'Books', curriculo: 'Lattes CV', site_antigo: 'Previous website',
      ver_todas_n: 'See all', sem_pubs_pessoa: 'Publications appear here automatically once an ORCID is registered.', sem_not_pessoa: 'No news yet.',
      pessoas_olho: 'People', equipe: 'Team', equipe_lead: "UNSEEL's researchers, students and alumni. Members with an ORCID have their publications updated automatically.",
      situacao: 'Status', ativos: 'Active', egressos: 'Alumni', todos: 'All', todas: 'All', nivel: 'Level', projeto: 'Project', defesa: 'Defence',
      ja_def: 'Defended', nao_def: 'Not yet defended', pessoa1: ' person', pessoas: ' people', ninguem: 'No one matches these filters.',
      proj_lead: 'Each project brings together its team, publications, news and data.', proj_nao: 'Project not found', voltar_proj: '← Projects',
      periodo: 'Period', financiamento: 'Funding', parceiros: 'Partners', links: 'Links', participantes: 'Team',
      sem_part: 'Tag the project in each person\'s record (data/equipe.json) to list them here.',
      publicacoes: 'Publications', noticias: 'News', dados: 'Data',
      sem_pubs_proj: "Publications with the project's keywords in their title appear here automatically.", sem_not_proj: 'No news about this project yet.',
      prod_olho: 'Output', aviso_pubs: "Articles are updated automatically every week from each member's ORCID (via OpenAlex)", ultima: ', last updated on ',
      aviso_pubs2: '. Books, chapters and reports listed only on Lattes are added by hand.', grafico: 'Publications per year — click a year to filter',
      buscar: 'Search', busca_ph: 'Title, author, journal…', ano: 'Year', pessoa: 'Person', tipo: 'Type', pub1: ' publication', pubs: ' publications', sem_data: 'Undated', nada: 'Nothing matches these filters.',
      imprensa: 'Press', aviso_midia: 'News and interviews found automatically every week on Google News', ultima_busca: ' (last search on ',
      ciencia: 'Open science', dados_lead: 'Datasets produced by the group, with description, licence and access link.', sem_dados: 'No datasets published yet.',
      ano_c: 'Year', autoria: 'Authors', repositorio: 'Repository', formato: 'Format', licenca: 'Licence', acessar: 'Access the data',
      contato: 'Contact', fale_tit: 'Contact us', email: 'Email', onde: 'Where we are', redes: 'Social media', quer: 'Want to join the group?',
      quero: 'I want to join', assunto: 'I want to join UNSEEL', ou: 'or write to ',
      rodape_auto: 'Publications and news are updated automatically every week.', inicio_aria: 'UNSEEL – home',
      banco: 'Database', banco_lead: "Data collected in UNSEEL's research, organised by study, with ethics approval, variable dictionary and files to download or explore as a table, chart and map.",
      pesquisa_pref: 'Study: ', base1: ' dataset', bases_n: ' datasets', etica_tit: 'Ethics approval', comite: 'Committee', caae: 'CAAE', parecer: 'Approval no.', data_aprov: 'Approved on',
      ver_parecer: 'View approval document (PDF)', parecer_pend: 'Approval document not yet attached.', nao_aplica: 'Not applicable (no human participants).',
      metodologia: 'Methodology', abrangencia: 'Coverage', bases_tit: 'Datasets', sem_bases: 'No datasets published yet.',
      partilhar: 'Share', copiar_link: 'Copy link', link_copiado: 'Link copied. Paste it wherever you like.', ig_copiado: 'Link copied. Open Instagram and paste it in a story, your bio or a message.', copie_aqui: 'Copy the link:',
      visualizar: 'Explore', fechar: 'Close', baixar: 'Download', dicionario: 'Variable dictionary', variavel: 'Variable', descricao: 'Description',
      tabela: 'Table', grafico_t: 'Chart', mapa: 'Map', exemplo_aviso: 'Format example — not research data.', linhas_n: ' rows', mostrando: ' · showing the first ',
      carregando_dados: 'Loading data…', erro_dados: 'Could not open the file.', categoria: 'Category', valor: 'Value', agregacao: 'Aggregation',
      contagem: 'Count', soma: 'Sum', media: 'Mean', mapa_sem_base: 'Base map unavailable here; points are placed by their coordinates.',
      outras: 'Other datasets', ver_banco: "See the study's database →", atualizado: 'Updated on', busca_pesq: 'Search studies', voltar_dados: '← Database',
      etica_ok: 'Ethics approval on record', etica_pend: 'Ethics approval to be added', etica_na: 'No ethics committee required', filtrar: 'Filter rows…',
      nav_biblioteca: 'Library', acervo: 'Collection', biblioteca: 'Library',
      bib_lead: "UNSEEL's publications, teaching materials, audiovisual content and fieldwork photos. Search by title and sort as you like.",
      bib_busca: 'Title, author, keyword…', ordenar: 'Sort by', o_recentes: 'Newest first', o_antigos: 'Oldest first', o_az: 'Title (A–Z)', o_za: 'Title (Z–A)',
      c_publicacao: 'Publications', c_didatico: 'Teaching materials', c_audiovisual: 'Audiovisual', c_foto: 'Fieldwork photos',
      c1_publicacao: 'Publication', c1_didatico: 'Teaching material', c1_audiovisual: 'Audiovisual', c1_foto: 'Fieldwork photo',
      item1: ' item', itens: ' items', bib_vazia: 'The library is still empty.', ver_foto: 'View photo', assistir: 'Watch / listen', abrir: 'Open',
      ant_item: 'Previous item', prox_item: 'Next item',
      nav_agenda: 'Calendar', agenda: 'Calendar', ag_olho: 'Group calendar', ag_lead: 'Group meetings, work trips and events UNSEEL hosts or attends. Click a day to see the details.',
      ag_reuniao: 'Group meeting', ag_viagem: 'Work trip', ag_organizado: 'Event we host', ag_participacao: 'Event we attend', ag_outro: 'Other',
      ag_vazio: 'Nothing scheduled.', ag_dia_vazio: 'Nothing on this day.', ag_mes_ant: 'Previous month', ag_mes_prox: 'Next month', ag_hoje: 'Today',
      ag_proximos: 'Coming up', ag_google: 'Open in Google Calendar', ag_sinc: 'Synced with Google Calendar on ', ag_comp: 'events', ag_ver: 'Full calendar →', ag_dica: 'Hover over or tap a day to see the details. Holidays in red.',
      ag_feriado: 'Holidays', ag_prox_fer: 'Next holiday', fer_nacional: 'National holiday', fer_sp: 'State holiday (São Paulo)', fer_sjc: 'Municipal holiday (São José dos Campos)', fer_facultativo: 'Optional day off (public sector)',
      nav_membros: 'Members area',
      tl_tit: 'Group timeline', tl_dica: 'Scroll sideways · click a photo to see the trajectory', tl_criacao: 'Group founded', tl_entraram: 'Joined', tl_defenderam: 'Defended', tl_previstas: 'Expected defences',
      tl_pessoa: 'Timeline', ev_entrada: 'Joined UNSEEL', ev_defesa: 'Defended', ev_prevista: 'Defence expected in ',
      m_trab: ' works', m_cit: ' citations', m_h: ' h-index', m_i10: ' i10-index', m_fonte: 'Indicators computed by OpenAlex from the ORCID record; they may differ from Google Scholar.',
      ultimas: 'Latest news'
    }
  };
  function t(k) { return (T[lang] && T[lang][k] != null) ? T[lang][k] : T.pt[k]; }
  function loc(o, campo) {
    if (!o) return '';
    if (lang === 'en') { var v = o[campo + '_en']; if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) return v; }
    return o[campo];
  }
  var PALETA = ['#13294B', '#176F80', '#427568', '#2F5E86', '#0F4E5A', '#1F4F6E'];

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function txt(s) { return esc(s).replace(/\[([^\]]+)\]/g, '<mark class="pendente">[$1]</mark>'); }
  function url(u) { u = String(u || '').trim(); return /^(https?:|mailto:)/i.test(u) ? esc(u) : ''; }
  function caminho(u) { u = String(u || '').trim(); if (!u) return ''; return /^https?:/i.test(u) || /^[\w./-]+$/.test(u) ? esc(u) : ''; }
  function link(u, rotulo, cls) {
    var h = url(u);
    return h ? '<a href="' + h + '" target="_blank" rel="noopener"' + (cls ? ' class="' + cls + '"' : '') + '>' + rotulo + '</a>' : rotulo;
  }
  function cor(c) { return /^#[0-9a-f]{3,8}$/i.test(c || '') ? c : '#176F80'; }
  function corPessoa(id) { var h = 0; String(id).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return PALETA[h % PALETA.length]; }
  function iniciais(nome) {
    var p = String(nome).split(/\s+/).filter(Boolean);
    return esc(((p[0] || '')[0] || '') + ((p.length > 1 ? p[p.length - 1][0] : '') || ''));
  }
  function pessoa(id) { return (D.equipe.membros || []).find(function (m) { return m.id === id || m.id_site === id; }); }
  function projeto(id) { return (D.projetos.projetos || []).find(function (p) { return p.id === id; }); }
  function orcidUrl(o) { return o ? 'https://orcid.org/' + String(o).replace('https://orcid.org/', '') : ''; }
  function pendente(s) { return !s || /^\[.*\]$/.test(String(s).trim()); }
  function dataFmt(s) {
    if (!s) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return esc(s);
    return lang === 'en' ? m[1] + '-' + m[2] + '-' + m[3] : m[3] + '/' + m[2] + '/' + m[1];
  }
  function status(st) { return { 'em-andamento': t('st_and'), 'em-preparacao': t('st_prep'), concluido: t('st_conc') }[st] || st; }
  function params() {
    var o = {};
    (location.hash.split('?')[1] || '').split('&').forEach(function (kv) { if (kv) { var a = kv.split('='); o[decodeURIComponent(a[0])] = decodeURIComponent(a[1] || ''); } });
    return o;
  }
  function onda(de, para, inverte) {
    return '<svg viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true" style="background:' + de + ';display:block;width:100%;height:48px"><path fill="' + para + '" d="' +
      (inverte ? 'M0 0 C360 48 720 0 1080 24 C1260 36 1380 32 1440 24 L1440 48 L0 48 Z' : 'M0 24 C240 0 480 48 720 24 C960 0 1200 48 1440 24 L1440 48 L0 48 Z') + '"/></svg>';
  }
  function curvas(n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var cx = [16, 82, 62, 30][i % 4], cy = [28, 24, 78, 82][i % 4], k = 1 + Math.floor(i / 4);
      s += '<ellipse cx="' + cx + '%" cy="' + cy + '%" rx="' + (6 * k) + '%" ry="' + (9 * k) + '%" style="animation-delay:' + (0.12 * i).toFixed(2) + 's"/>';
    }
    return s;
  }

  /* ---------- dados combinados ---------- */
  function publicacoes() {
    var auto = (D.publicacoes.itens || []).map(function (p) { var o = Object.assign({}, p); o.projetos = (p.projetos || []).concat(p.projetos_extra || []); return o; });
    var man = (D.manuais.publicacoes || []).map(function (p, i) { return Object.assign({ id: 'manual-' + i, origem: 'manual' }, p); });
    return auto.concat(man).filter(function (p) { return !p.oculto && p.titulo; }).sort(function (a, b) {
      return String(b.data || b.ano || '').localeCompare(String(a.data || a.ano || ''));
    });
  }
  function noticias() {
    return (D.midia.itens || []).filter(function (n) { return !n.oculto && n.titulo; })
      .sort(function (a, b) { return String(b.data || '').localeCompare(String(a.data || '')); });
  }
  function autoresDe(p) {
    if (p.autores_texto) return esc(p.autores_texto);
    return (p.autores || []).map(function (id) { var m = pessoa(id); return m ? esc(m.nome) : ''; }).filter(Boolean).join(', ');
  }

  /* ---------- pedaços ---------- */
  function chipProjeto(id) {
    var p = projeto(id); if (!p) return '';
    return '<li><a class="chip proj" style="--cor:' + cor(p.cor) + '" href="#/projeto/' + esc(id) + '">' + esc(loc(p, 'nome')) + '</a></li>';
  }
  function chipsProjetos(ids) {
    ids = (ids || []).filter(projeto);
    return ids.length ? '<ul class="chips">' + ids.map(chipProjeto).join('') + '</ul>' : '';
  }
  /* ---------- compartilhar (WhatsApp, Instagram, copiar link) ---------- */
  var ICO_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.9L2.3 21.7l4.9-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1c0 1.2.9 2.4 1 2.6.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z"/></svg>';
  var ICO_IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.9-8.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 4c2.6 0 2.9 0 3.9.1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 3.9s0 2.9-.1 3.9c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-3.9.1s-2.9 0-3.9-.1c-2.6-.1-3.9-1.4-4-4C4 14.9 4 14.6 4 12s0-2.9.1-3.9c.1-2.6 1.4-3.9 4-4C9.1 4 9.4 4 12 4zm0-1.7c-2.6 0-3 0-4 .1-3.6.2-5.5 2.1-5.7 5.7-.1 1-.1 1.4-.1 4s0 3 .1 4c.2 3.6 2.1 5.5 5.7 5.7 1 .1 1.4.1 4 .1s3 0 4-.1c3.6-.2 5.5-2.1 5.7-5.7.1-1 .1-1.4.1-4s0-3-.1-4c-.2-3.6-2.1-5.5-5.7-5.7-1-.1-1.4-.1-4-.1z"/></svg>';
  var ICO_LINK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zm-2.8 5.7a4 4 0 0 1-2.9-6.8l2.1-2.1a1 1 0 0 1 1.4 1.4l-2.1 2.1a2 2 0 0 0 2.8 2.8l2.1-2.1a1 1 0 1 1 1.4 1.4l-2.1 2.1a4 4 0 0 1-2.7 1.2zm7.8-6.7a1 1 0 0 1-.7-1.7l2.1-2.1a2 2 0 0 0-2.8-2.8l-2.1 2.1a1 1 0 0 1-1.4-1.4l2.1-2.1a4 4 0 0 1 5.6 5.6l-2.1 2.1a1 1 0 0 1-.7.3z"/></svg>';
  function linkAbsoluto(u) { try { return u ? new URL(u, location.href).href : ''; } catch (e) { return ''; } }
  function botoesPartilha(titulo, link) {
    var l = linkAbsoluto(link); if (!l) return '';
    var texto = encodeURIComponent((titulo ? titulo + ' — ' : '') + l);
    var dados = ' data-tit="' + esc(titulo || '') + '" data-url="' + esc(l) + '"';
    return '<div class="partilha" role="group" aria-label="' + esc(t('partilhar')) + '"><span class="partilha-rot">' + t('partilhar') + '</span>' +
      '<a class="partilha-bt wa" href="https://wa.me/?text=' + texto + '" target="_blank" rel="noopener" title="WhatsApp">' + ICO_WA + '<span>WhatsApp</span></a>' +
      '<button type="button" class="partilha-bt ig" data-partilha="ig"' + dados + ' title="Instagram">' + ICO_IG + '<span>Instagram</span></button>' +
      '<button type="button" class="partilha-bt" data-partilha="copiar"' + dados + '>' + ICO_LINK + '<span>' + t('copiar_link') + '</span></button></div>';
  }
  function copiarTexto(s) {
    var antigo = function () { return new Promise(function (ok, falha) {
      var ta = document.createElement('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : falha(); } catch (e) { falha(e); }
      ta.remove();
    }); };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(s).catch(antigo);
    return antigo();
  }
  function avisoRapido(msg) {
    var el = document.getElementById('aviso-rapido');
    if (!el) { el = document.createElement('div'); el.id = 'aviso-rapido'; el.className = 'aviso-rapido'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on');
    clearTimeout(avisoRapido.t); avisoRapido.t = setTimeout(function () { el.classList.remove('on'); }, 3200);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-partilha]'); if (!b) return;
    var l = b.getAttribute('data-url'), tit = b.getAttribute('data-tit');
    if (b.getAttribute('data-partilha') === 'ig' && navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      navigator.share({ title: tit, text: tit, url: l }).catch(function () {});
      return;
    }
    copiarTexto(l).then(function () { avisoRapido(b.getAttribute('data-partilha') === 'ig' ? t('ig_copiado') : t('link_copiado')); }, function () { window.prompt(t('copie_aqui'), l); });
  });
  function itemPub(p, partilha) {
    var tit = url(p.url) ? '<a class="tit" href="' + url(p.url) + '" target="_blank" rel="noopener">' + esc(p.titulo) + '</a>' : '<span class="tit">' + esc(p.titulo) + '</span>';
    var sub = [autoresDe(p), esc(p.veiculo), esc(p.ano)].filter(Boolean).join(' · ');
    return '<li>' + tit + '<p class="sub">' + sub + '</p><ul class="chips"><li><span class="chip tipo">' + esc(t('tipos')[p.tipo] || p.tipo || '') + '</span></li>' +
      (p.projetos || []).map(chipProjeto).join('') + '</ul>' + (partilha ? botoesPartilha(p.titulo, p.url) : '') + '</li>';
  }
  function listaPubs(lista, vazio) {
    return lista.length ? '<ul class="lista">' + lista.map(itemPub).join('') + '</ul>' : '<p class="vazio">' + esc(vazio || t('sem_pubs')) + '</p>';
  }
  function itemNoticia(n, partilha) {
    return '<li>' + (url(n.url) ? '<a class="tit" href="' + url(n.url) + '" target="_blank" rel="noopener">' + esc(n.titulo) + '</a>' : '<span class="tit">' + esc(n.titulo) + '</span>') +
      '<p class="sub">' + [esc(n.fonte), dataFmt(n.data)].filter(Boolean).join(' · ') + '</p>' + chipsProjetos(n.projetos) + (partilha ? botoesPartilha(n.titulo, n.url) : '') + '</li>';
  }
  function listaNoticias(lista, vazio, partilha) {
    return lista.length ? '<ul class="lista">' + lista.map(function (n) { return itemNoticia(n, partilha); }).join('') + '</ul>' : '<p class="vazio">' + esc(vazio || t('sem_not')) + '</p>';
  }
  function situacaoTexto(m) {
    if (m.nivel === 'coordenacao') return esc(t('nivel1').coordenacao);
    var n = t('nivel1')[m.nivel] || '';
    if (m.nivel === 'doutorado' || m.nivel === 'mestrado') {
      if (m.defesa) return esc(n) + ' · ' + t('defendeu') + esc(m.defesa);
      return esc(n) + ' · ' + (m.situacao === 'ativo' ? t('andamento') : t('egresso'));
    }
    return esc(n) + (m.situacao === 'egresso' ? ' · ' + t('egresso') : '');
  }
  function linksPessoa(m) {
    var l = [];
    if (url(m.lattes)) l.push(link(m.lattes, 'Lattes'));
    if (m.orcid) l.push(link(orcidUrl(m.orcid), 'ORCID'));
    if (url(m.researchgate)) l.push(link(m.researchgate, 'ResearchGate'));
    if (url(m.scholar)) l.push(link(m.scholar, 'Google Acadêmico'));
    if (url(m.linkedin)) l.push(link(m.linkedin, 'LinkedIn'));
    return l.length ? '<div class="links-pessoa">' + l.join('') + '</div>' : '';
  }
  function avatar(m, grande) {
    var f = caminho(m.foto);
    return '<div class="avatar' + (grande ? ' grande' : '') + '" style="--cor:' + corPessoa(m.id) + '" aria-hidden="true">' + (f ? '<img src="' + f + '" alt="">' : iniciais(m.nome)) + '</div>';
  }
  function cartaoPessoa(m) {
    var tema = loc(m, 'tema');
    return '<div class="cartao pessoa surge">' + avatar(m) + '<div>' +
      '<h3><a href="#/pessoa/' + esc(m.id) + '">' + esc(m.nome) + '</a></h3>' +
      '<p class="meta">' + situacaoTexto(m) + '</p>' +
      (m.vinculo ? '<p class="meta">' + esc(m.vinculo) + '</p>' : '') +
      (tema ? '<p class="meta">' + esc(tema) + '</p>' : '') +
      linksPessoa(m) + '</div></div>';
  }
  function cartaoProjeto(p) {
    return '<a class="projeto-card surge" style="--cor:' + cor(p.cor) + '" href="#/projeto/' + esc(p.id) + '">' +
      '<span><span class="selo">' + esc(status(p.status)) + '</span></span>' +
      '<h3>' + esc(loc(p, 'nome')) + '</h3><span class="meta">' + txt(p.periodo) + '</span>' +
      '<p>' + txt(loc(p, 'resumo')) + '</p><span class="ir">' + t('explorar') + '</span></a>';
  }
  function opcoes(lista, atual, todos) {
    return '<option value="">' + esc(todos) + '</option>' + lista.map(function (o) {
      return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(atual || '') ? ' selected' : '') + '>' + esc(o[1]) + '</option>';
    }).join('');
  }

  /* ---------- carrossel ---------- */
  function slidesCarrossel() {
    var fotos = ((D.galeria && D.galeria.itens) || []).filter(function (g) { return caminho(g.imagem); }).map(function (g) {
      return { img: caminho(g.imagem), alt: g.alt || '', tag: g.data ? dataFmt(g.data) : t('tag_foto'), titulo: loc(g, 'titulo'), texto: loc(g, 'legenda'), link: g.link, cor: '#13294B' };
    });
    if (fotos.length >= 3) return fotos;
    var extra = [];
    noticias().slice(0, 2).forEach(function (n) { extra.push({ tag: t('tag_midia'), titulo: n.titulo, texto: [n.fonte, dataFmt(n.data)].filter(Boolean).join(' · '), link: n.url, cor: '#13294B' }); });
    (D.projetos.projetos || []).filter(function (p) { return p.status === 'em-andamento' && !pendente(loc(p, 'resumo')); }).forEach(function (p) {
      var nc = loc(p, 'nome_completo');
      extra.push({ tag: t('tag_proj'), titulo: loc(p, 'nome') + (pendente(nc) ? '' : ' — ' + nc), texto: loc(p, 'resumo'), link: '#/projeto/' + p.id, cor: cor(p.cor) });
    });
    publicacoes().slice(0, 2).forEach(function (p) { extra.push({ tag: t('tag_pub'), titulo: p.titulo, texto: [p.veiculo, p.ano].filter(Boolean).join(' · '), link: p.url, cor: '#176F80' }); });
    return fotos.concat(extra).slice(0, 8);
  }
  function htmlCarrossel() {
    var ss = slidesCarrossel();
    if (!ss.length) return '';
    var slides = ss.map(function (s, i) {
      var interno = s.link && String(s.link).charAt(0) === '#';
      var href = interno ? esc(s.link) : url(s.link);
      var abre = href ? '<a class="slide" href="' + href + '"' + (interno ? '' : ' target="_blank" rel="noopener"') : '<div class="slide"';
      return abre + ' style="--cor:' + cor(s.cor) + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' / ' + ss.length + '">' +
        (s.img ? '<img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="' + (i ? 'lazy' : 'eager') + '"><span class="vela"></span>' : '') +
        '<span class="txt"><span class="tag">' + esc(s.tag) + '</span><h3>' + esc(s.titulo) + '</h3>' + (s.texto ? '<p>' + txt(s.texto) + '</p>' : '') + '</span>' +
        (href ? '</a>' : '</div>');
    }).join('');
    return '<div class="carrossel" aria-roledescription="carousel" aria-label="' + esc(t('destaques')) + '">' +
      '<div class="trilho" id="trilho" tabindex="0">' + slides + '</div>' +
      '<div class="controles"><div class="pontos" id="pontos">' + ss.map(function (_, i) { return '<button type="button" aria-label="' + esc(t('ir') + (i + 1)) + '"' + (i ? '' : ' aria-current="true"') + '></button>'; }).join('') + '</div>' +
      '<button type="button" class="pausa" id="pausa" aria-pressed="false">' + t('pausar') + '</button>' +
      '<button type="button" class="seta" id="ant" aria-label="' + esc(t('ant')) + '">‹</button><button type="button" class="seta" id="prox" aria-label="' + esc(t('prox')) + '">›</button></div></div>';
  }
  function ligarCarrossel() {
    var trilho = document.getElementById('trilho'); if (!trilho) return;
    var slides = Array.prototype.slice.call(trilho.children);
    var pontos = Array.prototype.slice.call(document.getElementById('pontos').children);
    var pausa = document.getElementById('pausa');
    var atual = 0, parado = semMovimento, emFoco = false;
    if (parado) { pausa.textContent = t('tocar'); pausa.setAttribute('aria-pressed', 'true'); }
    function ir(i) {
      atual = (i + slides.length) % slides.length;
      trilho.scrollTo({ left: slides[atual].offsetLeft - slides[0].offsetLeft, behavior: semMovimento ? 'auto' : 'smooth' });
    }
    function marcar() {
      var x = trilho.scrollLeft, melhor = 0, dist = Infinity;
      slides.forEach(function (s, i) { var d = Math.abs(s.offsetLeft - slides[0].offsetLeft - x); if (d < dist) { dist = d; melhor = i; } });
      atual = melhor;
      slides.forEach(function (s, i) { s.classList.toggle('atual', i === melhor); });
      pontos.forEach(function (p, i) { if (i === melhor) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current'); });
    }
    var tm; trilho.addEventListener('scroll', function () { clearTimeout(tm); tm = setTimeout(marcar, 80); });
    pontos.forEach(function (p, i) { p.addEventListener('click', function () { ir(i); }); });
    document.getElementById('ant').addEventListener('click', function () { ir(atual - 1); });
    document.getElementById('prox').addEventListener('click', function () { ir(atual + 1); });
    trilho.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); } });
    pausa.addEventListener('click', function () { parado = !parado; pausa.textContent = parado ? t('tocar') : t('pausar'); pausa.setAttribute('aria-pressed', String(parado)); });
    var caixa = trilho.parentNode;
    caixa.addEventListener('mouseenter', function () { emFoco = true; });
    caixa.addEventListener('mouseleave', function () { emFoco = false; });
    caixa.addEventListener('focusin', function () { emFoco = true; });
    caixa.addEventListener('focusout', function () { emFoco = false; });
    var timer = setInterval(function () { if (!parado && !emFoco && !document.hidden && !raiz.classList.contains('com-abertura')) ir(atual + 1); }, 6000);
    limpezas.push(function () { clearInterval(timer); });
    marcar();
  }

  /* ---------- números e surgimento ---------- */
  function ligarNumeros() {
    var els = document.querySelectorAll('[data-conta]'); if (!els.length) return;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || raiz.classList.contains('com-abertura')) return;
        obs.unobserve(e.target);
        var fim = +e.target.getAttribute('data-conta'), ini = performance.now();
        if (semMovimento) { e.target.textContent = fim; return; }
        (function passo(tt) { var k = Math.min(1, (tt - ini) / 1400); e.target.textContent = Math.round(fim * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(passo); })(ini);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { obs.observe(el); });
    limpezas.push(function () { obs.disconnect(); });
  }
  function ligarSurgir() {
    var els = document.querySelectorAll('.surge:not(.visivel)'); if (!els.length) return;
    if (semMovimento || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('visivel'); }); return; }
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (el) { obs.observe(el); });
    limpezas.push(function () { obs.disconnect(); });
  }


  /* ---------- equipe vinda do cadastro (Supabase) + linha do tempo ---------- */
  function nomeChave(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  function carregarEquipePublica() {
    var cfg = D.membros || {};
    if (!/^https:\/\//.test(cfg.supabase_url || '') || !cfg.supabase_anon_key || !window.fetch) return Promise.resolve();
    var tempo = new Promise(function (ok) { setTimeout(function () { ok(null); }, 5000); });
    var busca = fetch(cfg.supabase_url.replace(/\/$/, '') + '/rest/v1/rpc/equipe_publica', {
      method: 'POST', headers: { apikey: cfg.supabase_anon_key, 'Content-Type': 'application/json' }, body: '{}'
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return Promise.race([busca, tempo]).then(function (lista) {
      if (!Array.isArray(lista) || !lista.length) return;
      var membros = (D.equipe.membros || []);
      lista.forEach(function (x) {
        var novo = { id: x.id, origem: x.origem, nome: x.nome, foto: x.foto_url, nivel: x.nivel || (x.papel === 'coordenacao' ? 'coordenacao' : ''),
          situacao: x.situacao === 'egresso' ? 'egresso' : 'ativo', vinculo: x.vinculo, tema: x.tema, lattes: x.lattes, orcid: x.orcid, researchgate: x.researchgate,
          linkedin: x.linkedin, scholar: x.scholar, ano_entrada: x.ano_entrada, defesa_data: x.defesa_data || '',
          defesa: String(x.defesa_data || '').slice(0, 4), projetos: [] };
        var igual = membros.find(function (m) { return nomeChave(m.nome) === nomeChave(x.nome); });
        if (igual) {
          igual.id_site = x.id;
          Object.keys(novo).forEach(function (k) { if (k !== 'id' && k !== 'projetos' && novo[k] != null && novo[k] !== '') igual[k] = novo[k]; });
          if (igual.nivel === 'coordenacao' && x.situacao !== 'egresso') igual.situacao = 'ativo';
        } else membros.push(novo);
      });
      D.equipe.membros = membros;
    });
  }
  function carregarAgendaSite() {
    var cfg = D.membros || {};
    if (!/^https:\/\//.test(cfg.supabase_url || '') || !cfg.supabase_anon_key || !window.fetch) return Promise.resolve();
    var tempo = new Promise(function (ok) { setTimeout(function () { ok(null); }, 4000); });
    var busca = fetch(cfg.supabase_url.replace(/\/$/, '') + '/rest/v1/rpc/agenda_publica', {
      method: 'POST', headers: { apikey: cfg.supabase_anon_key, 'Content-Type': 'application/json' }, body: '{}'
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return Promise.race([busca, tempo]).then(function (lista) {
      if (!Array.isArray(lista)) return;
      D.agendaSite = lista.map(function (x) { return { titulo: x.titulo, inicio: x.inicio, fim: x.fim && x.fim !== x.inicio ? x.fim : '', hora: x.hora || '', tipo: x.tipo || 'outro', local: x.local || '', descricao: x.descricao || '', link: '', projeto: '' }; });
    });
  }
  function anosPessoa(m) {
    // o cadastro sempre prevalece; o ORCID só completa o que falta de quem JÁ DEFENDEU (egressos)
    var entrada = +m.ano_entrada || null;
    var defesa = +String(m.defesa || m.defesa_data || '').slice(0, 4) || null;
    var auto = false;
    if (m.situacao === 'egresso' && (!entrada || !defesa)) {
      var f = D.orcidFormacao && D.orcidFormacao[String(m.orcid || '').trim()];
      if (f && f.length) {
        var alvo = f.filter(function (x) { return /inpe|espaciais|unesp|estadual paulista|cemaden/i.test(x.instituicao || ''); });
        var s = (alvo.length ? alvo : f).slice().sort(function (a, b) { return (b.inicio || 0) - (a.inicio || 0); })[0];
        if (!entrada && s.inicio) { entrada = +s.inicio; auto = true; }
        if (!defesa && s.fim) { defesa = +s.fim; auto = true; }
      }
    }
    return { entrada: entrada, defesa: defesa, auto: auto };
  }
  function avatarTl(m, cls) {
    var f = caminho(m.foto);
    return '<a class="tl-av' + (cls ? ' ' + cls : '') + '" href="#/pessoa/' + esc(m.id) + '" title="' + esc(m.nome) + '" style="--cor:' + corPessoa(m.id) + '">' +
      (f ? '<img src="' + f + '" alt="' + esc(m.nome) + '">' : '<span aria-hidden="true">' + iniciais(m.nome) + '</span><span class="sr">' + esc(m.nome) + '</span>') + '</a>';
  }
  function linhaGrupo() {
    var ms = (D.equipe.membros || []).filter(function (m) { return m.nivel !== 'coordenacao'; });
    var info = ms.map(function (m) { return { m: m, a: anosPessoa(m) }; });
    var pubs = {}; publicacoes().forEach(function (p) { if (p.ano) pubs[p.ano] = (pubs[p.ano] || 0) + 1; });
    var hoje = new Date().getFullYear();
    var anos = info.map(function (x) { return x.a.entrada; }).filter(Boolean);
    var ini = Math.min.apply(null, anos.concat([2019])), fim = hoje;
    var cols = '';
    for (var y = ini; y <= fim; y++) {
      var ent = info.filter(function (x) { return x.a.entrada === y; }), def = info.filter(function (x) { return x.a.defesa === y; });
      var bloco = function (rot, lista, cls) { return lista.length ? '<div class="tl-bloco"><span class="tl-tag">' + rot + '</span><div class="tl-avs">' + lista.map(function (x) { return avatarTl(x.m, cls); }).join('') + '</div></div>' : ''; };
      cols += '<div class="tl-ano' + (y === hoje ? ' atual' : '') + (y > hoje ? ' futuro' : '') + '"><span class="tl-rotulo">' + y + '</span><span class="tl-ponto" aria-hidden="true"></span>' +
        (y === 2019 ? '<div class="tl-bloco"><span class="tl-tag">' + t('tl_criacao') + '</span></div>' : '') +
        bloco(t('tl_entraram'), ent, '') + bloco(t('tl_defenderam'), def, 'defendeu') +
        (pubs[y] ? '<a class="tl-pubs" href="#/publicacoes?ano=' + y + '"><b>' + pubs[y] + '</b> ' + (pubs[y] === 1 ? t('pub1') : t('pubs')).trim() + '</a>' : '') + '</div>';
    }
    return '<div class="tl-caixa"><div class="cabeca-secao"><h2 style="font-size:1.5rem">' + t('tl_tit') + '</h2><span class="meta">' + t('tl_dica') + '</span></div>' +
      '<div class="tl" id="tl-grupo" tabindex="0" aria-label="' + esc(t('tl_tit')) + '"><div class="tl-trilho">' + cols + '</div></div></div>';
  }
  function linhaPessoa(m, pubs) {
    var a = anosPessoa(m), ev = [];
    if (a.entrada) ev.push({ ano: a.entrada, ordem: 0, html: '<strong>' + t('ev_entrada') + '</strong>' + (m.nivel && t('nivel1')[m.nivel] ? ' · ' + esc(t('nivel1')[m.nivel]) : '') + '' });
    var porAno = {}; pubs.forEach(function (p) { if (p.ano) (porAno[p.ano] = porAno[p.ano] || []).push(p); });
    Object.keys(porAno).forEach(function (y) {
      var ps = porAno[y];
      ev.push({ ano: +y, ordem: 1, html: '<strong>' + ps.length + (ps.length === 1 ? t('pub1') : t('pubs')) + '</strong><ul>' + ps.slice(0, 6).map(function (p) {
        return '<li>' + (url(p.url) ? '<a href="' + url(p.url) + '" target="_blank" rel="noopener">' + esc(p.titulo) + '</a>' : esc(p.titulo)) + (p.veiculo ? ' <span class="meta">· ' + esc(p.veiculo) + '</span>' : '') + '</li>';
      }).join('') + (ps.length > 6 ? '<li><a href="#/publicacoes?pessoa=' + esc(m.id) + '&ano=' + y + '">+' + (ps.length - 6) + '</a></li>' : '') + '</ul>' });
    });
    if (a.defesa) ev.push({ ano: a.defesa, ordem: 2, cls: 'defendeu', html: '<strong>' + t('ev_defesa') + '</strong>' + (m.defesa_data && /^\d{4}-\d{2}/.test(m.defesa_data) ? ' · ' + esc(m.defesa_data.slice(5, 7) + '/' + m.defesa_data.slice(0, 4)) : '') });
    if (!ev.length) return '';
    ev.sort(function (x, y) { return x.ano - y.ano || x.ordem - y.ordem; });
    return '<div class="bloco"><h2>' + t('tl_pessoa') + '</h2><ol class="tlp">' + ev.map(function (e) {
      return '<li class="tlp-item' + (e.cls ? ' ' + e.cls : '') + '"><span class="tlp-ano">' + e.ano + '</span><span class="tlp-ponto" aria-hidden="true"></span><div class="tlp-txt">' + e.html + '</div></li>';
    }).join('') + '</ol></div>';
  }
  function metricasHtml(m) {
    var x = D.metricas && D.metricas[String(m.orcid || '').trim()];
    if (!x) return '';
    var item = function (n, rot) { return n != null ? '<span><b>' + Number(n).toLocaleString(lang === 'en' ? 'en' : 'pt-BR') + '</b>' + rot + '</span>' : ''; };
    return '<div class="metricas">' + item(x.trabalhos, t('m_trab')) + item(x.citacoes, t('m_cit')) + item(x.h, t('m_h')) + item(x.i10, t('m_i10')) + '</div><p class="meta" style="font-size:.78rem">' + t('m_fonte') + '</p>';
  }

  /* ---------- páginas ---------- */
  var P = {};

  P.inicio = function () {
    var s = D.site;
    var nots = noticias();
    var projs = (D.projetos.projetos || []).slice().sort(function (a, b) { return (a.status === 'concluido') - (b.status === 'concluido'); });
    var pubs = publicacoes();
    var ativos = (D.equipe.membros || []).filter(function (m) { return m.situacao === 'ativo'; }).length;
    var anos = new Date().getFullYear() - 2019;
    var valores = (s.valores || []).map(function (v) { return '<li><strong>' + txt(loc(v, 'titulo')) + '</strong> — ' + txt(loc(v, 'texto')) + '</li>'; }).join('');
    var letreiro = nots.length ? '<div class="letreiro" aria-label="' + esc(t('ultimas')) + '"><div class="letreiro-trilho">' +
      [0, 1].map(function (k) { return nots.slice(0, 8).map(function (n) { return '<a href="' + url(n.url) + '" target="_blank" rel="noopener"' + (k ? ' tabindex="-1" aria-hidden="true"' : '') + '>' + esc(n.titulo) + (n.fonte ? ' — ' + esc(n.fonte) : '') + '</a>'; }).join(''); }).join('') +
      '</div></div>' : '';
    setTimeout(function () { ligarCarrossel(); ligarNumeros(); }, 0);

    return '<section class="heroi">' +
      '<img class="falcao" src="assets/logo/UNSEEL_simbolo_negativo.svg" alt="">' +
      '<div class="heroi-in"><div class="heroi-txt">' +
      '<p class="olho">' + esc(loc(s, 'nome_pt')) + '</p>' +
      '<h1><span class="un">UN</span>SEEL</h1>' +
      '<p class="sub">' + esc(s.nome) + '</p>' +
      '<p class="lead">' + txt(loc(s, 'chamada')) + '</p>' +
      '<div class="botoes"><a class="botao" href="#/projetos">' + t('conheca') + '</a><a class="botao claro" href="#/contato">' + t('faca_parte') + '</a></div>' +
      '</div></div></section>' +
      letreiro +

      '<section class="faixa"><div class="in"><div class="cabeca-secao"><div><p class="olho">' + t('destaques_olho') + '</p><h2>' + t('destaques') + '</h2></div><a class="mais" href="#/midia">' + t('tudo_midia') + '</a></div>' + htmlCarrossel() + '</div></section>' +

      '<section class="faixa f-nevoa"><div class="in numeros">' +
      '<div class="numero"><b data-conta="' + pubs.length + '">0</b><span>' + t('n_pubs') + '</span></div>' +
      '<div class="numero"><b data-conta="' + ativos + '">0</b><span>' + t('n_ativos') + '</span></div>' +
      '<div class="numero"><b data-conta="' + projs.length + '">0</b><span>' + t('n_proj') + '</span></div>' +
      '<div class="numero"><b data-conta="' + anos + '">0</b><span>' + t('n_anos') + '</span></div>' +
      '</div></section>' +

      '<section class="faixa"><div class="in"><div class="cabeca-secao"><div><p class="olho">' + t('ag_olho') + '</p><h2>' + t('ag_proximos') + '</h2></div><a class="mais" href="#/agenda">' + t('ag_ver') + '</a></div>' +
      '<div class="ag-home">' + blocoProximos(4) + '</div></div></section>' +

      '<section class="faixa"><div class="in"><p class="olho">' + t('quem_olho') + '</p><h2>' + t('quem_tit') + '</h2><p class="quem">' + txt(loc(s, 'descricao')) + '</p>' +
      '<div class="mvv" style="margin-top:40px">' +
      '<div class="cartao c1 surge"><h3>' + t('missao') + '</h3><p>' + txt(loc(s, 'missao')) + '</p></div>' +
      '<div class="cartao c2 surge"><h3>' + t('visao') + '</h3><p>' + txt(loc(s, 'visao')) + '</p></div>' +
      '<div class="cartao c3 surge"><h3>' + t('valores') + '</h3><ul class="valores">' + valores + '</ul></div>' +
      '</div></div></section>' +

      onda('#fff', '#EEF3F4') +
      '<section class="faixa f-nevoa"><div class="in duas"><div><p class="olho">' + t('nome_olho') + '</p><h2>' + t('por_que') + '</h2><p>' + txt(loc(s, 'sobre_o_nome')) + '</p></div>' +
      '<div><h3 style="font-size:1.3rem">' + t('linhas') + '</h3><ul class="linhas">' + (loc(s, 'linhas_de_pesquisa') || []).map(function (l) { return '<li class="linha surge">' + esc(l) + '</li>'; }).join('') + '</ul></div></div></section>' +
      onda('#EEF3F4', '#fff', true) +

      '<section class="faixa"><div class="in"><div class="cabeca-secao"><div><p class="olho">' + t('proj_olho') + '</p><h2>' + t('projetos') + '</h2></div><a class="mais" href="#/projetos">' + t('todos_proj') + '</a></div><div class="grade">' + projs.map(cartaoProjeto).join('') + '</div></div></section>' +

      onda('#fff', '#13294B') +
      '<section class="faixa f-marinho"><div class="in grade g2">' +
      '<div><div class="cabeca-secao"><h2>' + t('pubs_rec') + '</h2><a class="mais" href="#/publicacoes">' + t('ver_todas') + '</a></div>' + listaPubs(pubs.slice(0, 5)) + '</div>' +
      '<div><div class="cabeca-secao"><h2>' + t('na_midia') + '</h2><a class="mais" href="#/midia">' + t('ver_todas') + '</a></div>' + listaNoticias(nots.slice(0, 5)) + '</div>' +
      '</div></section>';
  };

  P.coordenacao = function () { return paginaPessoa(D.coordenador.id, true); };

  function paginaPessoa(id, ehCoord) {
    var m = pessoa(id) || { id: id };
    var c = (ehCoord || id === D.coordenador.id) ? D.coordenador : null;
    var nome = (c && c.nome) || m.nome;
    if (!nome) return '<section class="secao"><h1>' + t('nao_achou') + '</h1><a href="#/equipe">' + t('voltar') + '</a></section>';
    var links = c ? c.links : { lattes: m.lattes, orcid: m.orcid, researchgate: m.researchgate, linkedin: m.linkedin, scholar: m.scholar };
    var pubs = publicacoes().filter(function (p) { return (p.autores || []).indexOf(id) >= 0; });
    var nots = noticias().filter(function (n) { return (n.pessoas || []).indexOf(id) >= 0; });
    var lista = function (tt, arr) { return arr && arr.length ? '<h3 style="margin-top:28px">' + tt + '</h3><ul>' + arr.map(function (x) { return '<li>' + txt(x) + '</li>'; }).join('') + '</ul>' : ''; };
    var lk = [];
    if (links) {
      if (url(links.lattes)) lk.push(link(links.lattes, t('curriculo')));
      if (links.orcid) lk.push(link(orcidUrl(links.orcid), 'ORCID'));
      if (url(links.researchgate)) lk.push(link(links.researchgate, 'ResearchGate'));
      if (url(links.scholar)) lk.push(link(links.scholar, 'Google Acadêmico'));
      if (url(links.linkedin)) lk.push(link(links.linkedin, 'LinkedIn'));
      if (url(links.site_antigo)) lk.push(link(links.site_antigo, t('site_antigo')));
    }
    var tema = loc(m, 'tema');
    var perfilFoto = Object.assign({}, m, { foto: (c && c.foto) || m.foto, nome: nome });
    return '<section class="secao">' + (ehCoord ? '<p class="olho">' + t('coord_olho') + '</p>' : '<a class="voltar" href="#/equipe">' + t('voltar_equipe') + '</a>') +
      '<div class="duas"><div class="cartao perfil">' +
      '<div style="display:flex;justify-content:center;margin-bottom:16px">' + avatar(perfilFoto, true) + '</div>' +
      '<h1 style="font-size:1.7rem">' + esc(nome) + '</h1>' +
      '<p class="meta">' + (c ? esc(loc(c, 'titulo')) : situacaoTexto(m)) + '</p>' +
      (m.vinculo ? '<p class="meta">' + esc(m.vinculo) + '</p>' : '') +
      (lk.length ? '<div class="links-pessoa" style="justify-content:center;margin-top:14px">' + lk.join('') + '</div>' : '') +
      '</div><div>' +
      (c ? '<p class="lead" style="max-width:none">' + txt(loc(c, 'bio')) + '</p>' : (tema ? '<p class="lead">' + esc(tema) + '</p>' : '')) +
      (c ? lista(t('formacao'), loc(c, 'formacao')) + lista(t('atuacao'), loc(c, 'atuacao')) + lista(t('premios'), loc(c, 'premios')) + lista(t('livros'), loc(c, 'livros')) : '') +
      ((m.projetos || []).filter(projeto).length ? '<h3 style="margin-top:28px">' + t('projetos') + '</h3>' + chipsProjetos(m.projetos) : '') +
      metricasHtml(c ? Object.assign({}, m, { orcid: (c.links || {}).orcid || m.orcid }) : m) +
      '</div></div>' + linhaPessoa(Object.assign({}, m, { nome: nome }), pubs) +
      '<div class="bloco grade g2"><div><div class="cabeca-secao"><h2>' + t('pubs_rec') + '</h2>' + (pubs.length ? '<a class="mais" href="#/publicacoes?pessoa=' + esc(id) + '">' + t('ver_todas_n') + ' (' + pubs.length + ') →</a>' : '') + '</div>' +
      listaPubs(pubs.slice(0, 8), t('sem_pubs_pessoa')) + '</div>' +
      '<div><div class="cabeca-secao"><h2>' + t('na_midia') + '</h2></div>' + listaNoticias(nots.slice(0, 8), t('sem_not_pessoa')) + '</div></div>' +
      '</section>';
  }
  P.pessoa = function (id) { return paginaPessoa(id, false); };

  P.equipe = function () {
    var q = params();
    var sit = q.situacao == null ? 'ativo' : q.situacao;
    var projs = (D.projetos.projetos || []).map(function (p) { return [p.id, loc(p, 'nome')]; });
    var nv = t('niveis');
    var niveis = Object.keys(nv).map(function (k) { return [k, nv[k]]; });
    setTimeout(ligarEquipe, 0);
    return '<section class="secao"><p class="olho">' + t('pessoas_olho') + '</p><h1>' + t('equipe') + '</h1>' +
      '<p class="lead">' + t('equipe_lead') + '</p>' + linhaGrupo() +
      '<div class="filtros" role="group" style="margin-top:36px">' +
      '<div class="rot">' + t('situacao') + '<div class="segmentado" id="f-sit">' +
      [['ativo', t('ativos')], ['egresso', t('egressos')], ['', t('todos')]].map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] === sit) + '">' + esc(o[1]) + '</button>'; }).join('') +
      '</div></div>' +
      '<label>' + t('nivel') + '<select id="f-nivel">' + opcoes(niveis, q.nivel, t('todos')) + '</select></label>' +
      '<label>' + t('projeto') + '<select id="f-proj">' + opcoes(projs, q.projeto, t('todos')) + '</select></label>' +
      '<label>' + t('defesa') + '<select id="f-def">' + opcoes([['sim', t('ja_def')], ['nao', t('nao_def')]], q.defesa, t('todas')) + '</select></label>' +
      '</div><div id="lista-equipe"></div></section>';
  };
  var filtroEquipe = {};
  function ligarEquipe() {
    var tl = document.getElementById('tl-grupo'); if (tl) tl.scrollLeft = tl.scrollWidth;
    var q = params();
    filtroEquipe = { situacao: q.situacao == null ? 'ativo' : q.situacao, nivel: q.nivel || '', projeto: q.projeto || '', defesa: q.defesa || '' };
    var seg = document.getElementById('f-sit'); if (!seg) return;
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      filtroEquipe.situacao = b.getAttribute('data-v');
      seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      desenharEquipe();
    });
    [['f-nivel', 'nivel'], ['f-proj', 'projeto'], ['f-def', 'defesa']].forEach(function (p) {
      document.getElementById(p[0]).addEventListener('change', function (e) { filtroEquipe[p[1]] = e.target.value; desenharEquipe(); });
    });
    desenharEquipe();
  }
  function desenharEquipe() {
    var f = filtroEquipe, nv = t('niveis');
    var ms = (D.equipe.membros || []).filter(function (m) {
      if (f.situacao && m.situacao !== f.situacao && m.nivel !== 'coordenacao') return false;
      if (f.nivel && m.nivel !== f.nivel) return false;
      if (f.projeto && (m.projetos || []).indexOf(f.projeto) < 0) return false;
      if (f.defesa === 'sim' && !m.defesa) return false;
      if (f.defesa === 'nao' && (m.defesa || ['doutorado', 'mestrado'].indexOf(m.nivel) < 0)) return false;
      return true;
    });
    var html = '<p class="contagem">' + ms.length + (ms.length === 1 ? t('pessoa1') : t('pessoas')) + '</p>';
    Object.keys(nv).forEach(function (n) {
      var g = ms.filter(function (m) { return m.nivel === n; });
      if (g.length) html += '<h2 style="font-size:1.3rem;margin-top:30px">' + esc(nv[n]) + '</h2><div class="grade">' + g.map(cartaoPessoa).join('') + '</div>';
    });
    if (!ms.length) html += '<p class="vazio">' + t('ninguem') + '</p>';
    document.getElementById('lista-equipe').innerHTML = html;
    ligarSurgir();
  }

  P.projetos = function () {
    var ps = D.projetos.projetos || [];
    var grupo = function (st, tt) {
      var g = ps.filter(function (p) { return p.status === st; });
      return g.length ? '<h2 style="margin-top:40px">' + tt + '</h2><div class="grade">' + g.map(cartaoProjeto).join('') + '</div>' : '';
    };
    return '<section class="secao"><p class="olho">' + t('proj_olho') + '</p><h1>' + t('projetos') + '</h1><p class="lead">' + t('proj_lead') + '</p>' +
      grupo('em-andamento', t('st_and')) + grupo('em-preparacao', t('st_prep')) + grupo('concluido', t('st_concs')) + '</section>';
  };

  P.projeto = function (id) {
    var p = projeto(id);
    if (!p) return '<section class="secao"><h1>' + t('proj_nao') + '</h1><a href="#/projetos">' + t('voltar') + '</a></section>';
    var membros = (D.equipe.membros || []).filter(function (m) { return (m.projetos || []).indexOf(id) >= 0; });
    var pubs = publicacoes().filter(function (x) { return (x.projetos || []).indexOf(id) >= 0; });
    var nots = noticias().filter(function (n) { return (n.projetos || []).indexOf(id) >= 0; });
    var dados = (D.dados.conjuntos || []).filter(function (d) { return d.projeto === id; });
    var parc = loc(p, 'parceiros') || [];
    var ficha = '<dl class="ficha"><dt>' + t('periodo') + '</dt><dd>' + txt(p.periodo) + '</dd>' +
      (p.financiamento ? '<dt>' + t('financiamento') + '</dt><dd>' + txt(loc(p, 'financiamento')) + '</dd>' : '') +
      (parc.length ? '<dt>' + t('parceiros') + '</dt><dd>' + parc.map(esc).join('; ') + '</dd>' : '') + '</dl>';
    var links = (p.links || []).map(function (l) { return '<li>' + link(l.url, esc(l.titulo || l.url)) + '</li>'; }).join('');
    return '<section class="faixa topo-projeto" style="--cor:' + cor(p.cor) + '"><div class="in">' +
      '<a class="voltar" href="#/projetos">' + t('voltar_proj') + '</a><div><span class="selo">' + esc(status(p.status)) + '</span></div>' +
      '<h1 style="margin-top:14px;font-size:clamp(2.6rem,7vw,4.6rem)">' + esc(loc(p, 'nome')) + '</h1><p class="lead" style="font-weight:600">' + txt(loc(p, 'nome_completo')) + '</p>' +
      '<p class="lead">' + txt(loc(p, 'resumo')) + '</p>' + ficha + '</div></section>' +
      '<section class="secao"><p class="lead" style="max-width:860px">' + txt(loc(p, 'descricao')) + '</p>' + (links ? '<h3>' + t('links') + '</h3><ul>' + links + '</ul>' : '') +
      '<div class="bloco"><h2>' + t('participantes') + '</h2>' + (membros.length ? '<div class="grade">' + membros.map(cartaoPessoa).join('') + '</div>' : '<p class="vazio">' + t('sem_part') + '</p>') + '</div>' +
      '<div class="bloco grade g2"><div><h2>' + t('publicacoes') + '</h2>' + listaPubs(pubs, t('sem_pubs_proj')) + '</div>' +
      '<div><h2>' + t('noticias') + '</h2>' + listaNoticias(nots, t('sem_not_proj')) + '</div></div>' +
      (dados.length ? '<div class="bloco"><h2>' + t('dados') + '</h2><div class="grade g2">' + dados.map(cartaoDados).join('') + '</div></div>' : '') +
      (pesquisa(id) ? '<div class="bloco"><h2>' + t('banco') + '</h2><div class="pesq-lista">' + linhaPesquisa(pesquisa(id)) + '</div></div>' : '') +
      '</section>';
  };

  P.publicacoes = function () {
    var q = params();
    var todas = publicacoes();
    var anos = Array.from(new Set(todas.map(function (p) { return p.ano; }).filter(Boolean))).sort().reverse().map(function (a) { return [a, a]; });
    var pessoas = (D.equipe.membros || []).filter(function (m) { return todas.some(function (p) { return (p.autores || []).indexOf(m.id) >= 0; }); }).map(function (m) { return [m.id, m.nome]; });
    var projs = (D.projetos.projetos || []).map(function (p) { return [p.id, loc(p, 'nome')]; });
    var tp = t('tipos');
    var tipos = Array.from(new Set(todas.map(function (p) { return p.tipo; }).filter(Boolean))).map(function (x) { return [x, tp[x] || x]; });
    setTimeout(ligarPubs, 0);
    return '<section class="secao"><p class="olho">' + t('prod_olho') + '</p><h1>' + t('publicacoes') + '</h1>' +
      '<p class="aviso">' + t('aviso_pubs') + (D.publicacoes.atualizado_em ? t('ultima') + dataFmt(D.publicacoes.atualizado_em) : '') + t('aviso_pubs2') + '</p>' +
      '<ul class="anos" id="grafico-anos" aria-label="' + esc(t('grafico')) + '"></ul>' +
      '<div class="filtros" role="search">' +
      '<label>' + t('buscar') + '<input type="search" id="f-busca" placeholder="' + esc(t('busca_ph')) + '"></label>' +
      '<label>' + t('ano') + '<select id="f-ano">' + opcoes(anos, q.ano, t('todos')) + '</select></label>' +
      '<label>' + t('pessoa') + '<select id="f-pessoa">' + opcoes(pessoas, q.pessoa, t('todas')) + '</select></label>' +
      '<label>' + t('projeto') + '<select id="f-projeto">' + opcoes(projs, q.projeto, t('todos')) + '</select></label>' +
      '<label>' + t('tipo') + '<select id="f-tipo">' + opcoes(tipos, q.tipo, t('todos')) + '</select></label>' +
      '</div><div id="lista-pubs"></div></section>';
  };
  function ligarPubs() {
    ['f-busca', 'f-ano', 'f-pessoa', 'f-projeto', 'f-tipo'].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener('input', desenharPubs); });
    document.getElementById('grafico-anos').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var sel = document.getElementById('f-ano');
      sel.value = sel.value === b.getAttribute('data-ano') ? '' : b.getAttribute('data-ano');
      desenharPubs();
    });
    desenharPubs();
  }
  function desenharPubs() {
    var v = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    var semAcento = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var busca = semAcento(v('f-busca'));
    var base = publicacoes().filter(function (p) {
      if (v('f-pessoa') && (p.autores || []).indexOf(v('f-pessoa')) < 0) return false;
      if (v('f-projeto') && (p.projetos || []).indexOf(v('f-projeto')) < 0) return false;
      if (v('f-tipo') && p.tipo !== v('f-tipo')) return false;
      if (busca && semAcento([p.titulo, p.veiculo, autoresDe(p)].join(' ')).indexOf(busca) < 0) return false;
      return true;
    });
    var cont = {}; base.forEach(function (p) { if (p.ano) cont[p.ano] = (cont[p.ano] || 0) + 1; });
    var ks = Object.keys(cont).sort(), max = Math.max.apply(null, ks.map(function (k) { return cont[k]; }).concat([1]));
    document.getElementById('grafico-anos').innerHTML = ks.map(function (k) {
      return '<li><span class="q">' + cont[k] + '</span><button type="button" data-ano="' + esc(k) + '" aria-pressed="' + (v('f-ano') === k) + '" aria-label="' + esc(k) + ': ' + cont[k] + t('pubs') + '" style="height:' + Math.max(6, Math.round(110 * cont[k] / max)) + 'px"></button><span class="a">' + esc(k) + '</span></li>';
    }).join('');
    var lista = base.filter(function (p) { return !v('f-ano') || String(p.ano) === v('f-ano'); });
    var html = '<p class="contagem">' + lista.length + (lista.length === 1 ? t('pub1') : t('pubs')) + '</p>';
    var anoAtual = null, buf = [];
    var fecha = function () { if (buf.length) { html += '<p class="ano">' + esc(anoAtual || t('sem_data')) + '</p><ul class="lista">' + buf.join('') + '</ul>'; buf = []; } };
    lista.forEach(function (p) { if (p.ano !== anoAtual) { fecha(); anoAtual = p.ano; } buf.push(itemPub(p, true)); });
    fecha();
    if (!lista.length) html += '<p class="vazio">' + t('nada') + '</p>';
    document.getElementById('lista-pubs').innerHTML = html;
  }

  P.midia = function () {
    return '<section class="secao"><p class="olho">' + t('imprensa') + '</p><h1>' + t('na_midia') + '</h1>' +
      '<p class="aviso">' + t('aviso_midia') + (D.midia.atualizado_em ? t('ultima_busca') + dataFmt(D.midia.atualizado_em) + ')' : '') + '.</p>' +
      listaNoticias(noticias(), null, true) + '</section>';
  };

  function cartaoDados(d) {
    var p = projeto(d.projeto);
    return '<div class="cartao dado surge" style="--cor:' + (p ? cor(p.cor) : '#176F80') + '"><h3>' + (url(d.url) ? '<a href="' + url(d.url) + '" target="_blank" rel="noopener">' + esc(d.titulo) + '</a>' : esc(d.titulo)) + '</h3>' +
      '<p>' + txt(loc(d, 'descricao')) + '</p><dl class="ficha">' +
      (d.ano ? '<dt>' + t('ano_c') + '</dt><dd>' + esc(d.ano) + '</dd>' : '') +
      (d.autores ? '<dt>' + t('autoria') + '</dt><dd>' + esc(d.autores) + '</dd>' : '') +
      (d.repositorio ? '<dt>' + t('repositorio') + '</dt><dd>' + esc(d.repositorio) + '</dd>' : '') +
      (d.formato ? '<dt>' + t('formato') + '</dt><dd>' + txt(d.formato) + '</dd>' : '') +
      (d.licenca ? '<dt>' + t('licenca') + '</dt><dd>' + txt(d.licenca) + '</dd>' : '') + '</dl>' +
      chipsProjetos(d.projeto ? [d.projeto] : []) +
      (url(d.url) ? '<p style="margin-top:14px"><a class="botao" href="' + url(d.url) + '" target="_blank" rel="noopener">' + t('acessar') + '</a></p>' : '') + '</div>';
  }
  /* ---------- banco de dados (estilo IBGE: pesquisas → bases → tabela/gráfico/mapa) ---------- */
  function nomePesq(pr) { return t('pesquisa_pref') + String(loc(pr, 'nome')).replace(/^Projeto\s+/i, '').replace(/\s+Project$/i, ''); }
  function pesquisa(id) { return ((D.pesquisas && D.pesquisas.pesquisas) || []).find(function (p) { return p.id === id; }); }
  function eticaStatus(pq) {
    var e = pq.etica || {};
    if (e.aplica === false) return ['na', t('etica_na')];
    return pendente(e.caae) ? ['pend', t('etica_pend')] : ['ok', t('etica_ok') + ' · CAAE ' + esc(e.caae)];
  }
  function linhaPesquisa(pq) {
    var pr = projeto(pq.id) || { nome: pq.id, cor: '#176F80' };
    var n = (pq.conjuntos || []).length, et = eticaStatus(pq);
    return '<a class="pesq-linha surge" style="--cor:' + cor(pr.cor) + '" href="#/pesquisa/' + esc(pq.id) + '">' +
      '<span class="pesq-marca" aria-hidden="true"></span>' +
      '<span class="pesq-corpo"><span class="pesq-nome">' + esc(nomePesq(pr)) + '</span>' +
      '<span class="pesq-meta">' + [esc(status(pr.status)), txt(pr.periodo || ''), txt(loc(pq, 'abrangencia') || '')].filter(Boolean).join(' · ') + '</span>' +
      '<span class="pesq-etica e-' + et[0] + '">' + et[1] + '</span></span>' +
      '<span class="pesq-num"><b>' + n + '</b>' + (n === 1 ? t('base1') : t('bases_n')) + '</span></a>';
  }
  P.dados = function () {
    var pqs = (D.pesquisas && D.pesquisas.pesquisas) || [];
    var outras = D.dados.conjuntos || [];
    setTimeout(function () {
      var b = document.getElementById('f-pesq'); if (!b) return;
      b.addEventListener('input', function () {
        var q = b.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        document.querySelectorAll('.pesq-linha').forEach(function (el) {
          el.hidden = q && el.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf(q) < 0;
        });
      });
    }, 0);
    return '<section class="secao"><p class="olho">' + t('ciencia') + '</p><h1>' + t('banco') + '</h1>' +
      '<p class="lead">' + t('banco_lead') + '</p>' +
      '<div class="filtros" role="search"><label>' + t('busca_pesq') + '<input type="search" id="f-pesq"></label></div>' +
      '<div class="pesq-lista">' + pqs.map(linhaPesquisa).join('') + '</div>' +
      (outras.length ? '<div class="bloco"><h2>' + t('outras') + '</h2><div class="grade g2">' + outras.map(cartaoDados).join('') + '</div></div>' : '') +
      '</section>';
  };

  P.pesquisa = function (id) {
    var pq = pesquisa(id), pr = projeto(id);
    if (!pq || !pr) return '<section class="secao"><h1>' + t('proj_nao') + '</h1><a href="#/dados">' + t('voltar') + '</a></section>';
    var e = pq.etica || {};
    var doc = caminho(e.documento);
    var etica = e.aplica === false
      ? '<p>' + t('nao_aplica') + (loc(e, 'obs') ? ' ' + txt(loc(e, 'obs')) : '') + '</p>'
      : '<dl class="ficha"><dt>' + t('comite') + '</dt><dd>' + txt(e.comite) + '</dd><dt>' + t('caae') + '</dt><dd>' + txt(e.caae) + '</dd>' +
        '<dt>' + t('parecer') + '</dt><dd>' + txt(e.parecer) + '</dd>' + (e.data_aprovacao ? '<dt>' + t('data_aprov') + '</dt><dd>' + dataFmt(e.data_aprovacao) + '</dd>' : '') + '</dl>' +
        (loc(e, 'obs') ? '<p>' + txt(loc(e, 'obs')) + '</p>' : '') +
        (doc ? '<a class="botao" href="' + doc + '" target="_blank" rel="noopener">' + t('ver_parecer') + '</a>' : '<p class="vazio">' + t('parecer_pend') + '</p>');
    var cs = pq.conjuntos || [];
    setTimeout(function () { ligarConjuntos(pq); }, 0);
    return '<section class="faixa topo-projeto" style="--cor:' + cor(pr.cor) + '"><div class="in">' +
      '<a class="voltar" href="#/dados">' + t('voltar_dados') + '</a><div><span class="selo">' + esc(status(pr.status)) + '</span></div>' +
      '<h1 style="margin-top:14px">' + esc(nomePesq(pr)) + '</h1>' +
      '<p class="lead" style="font-weight:600">' + txt(loc(pr, 'nome_completo')) + '</p>' +
      '<dl class="ficha"><dt>' + t('periodo') + '</dt><dd>' + txt(pr.periodo) + '</dd>' + (loc(pq, 'abrangencia') ? '<dt>' + t('abrangencia') + '</dt><dd>' + txt(loc(pq, 'abrangencia')) + '</dd>' : '') + '</dl>' +
      '<a class="botao claro" href="#/projeto/' + esc(id) + '">' + esc(loc(pr, 'nome')) + ' →</a></div></section>' +
      '<section class="secao"><div class="grade g2 pesq-info">' +
      '<div class="cartao"><h2 style="font-size:1.35rem">' + t('metodologia') + '</h2><p>' + txt(loc(pq, 'metodologia')) + '</p></div>' +
      '<div class="cartao etica"><h2 style="font-size:1.35rem">' + t('etica_tit') + '</h2>' + etica + '</div></div>' +
      '<div class="bloco"><h2>' + t('bases_tit') + '</h2>' + (cs.length ? cs.map(cartaoConjunto).join('') : '<p class="vazio">' + t('sem_bases') + '</p>') + '</div>' +
      '</section>';
  };

  function cartaoConjunto(c, i) {
    var arq = caminho(c.arquivo);
    var vars = c.variaveis || [];
    return '<article class="conjunto">' +
      (c.exemplo ? '<p class="exemplo">' + t('exemplo_aviso') + '</p>' : '') +
      '<div class="conj-cabeca"><div><h3>' + esc(loc(c, 'titulo')) + '</h3><p>' + txt(loc(c, 'descricao')) + '</p>' +
      '<p class="meta">' + [esc(c.formato), c.atualizado ? t('atualizado') + ' ' + dataFmt(c.atualizado) : '', c.licenca ? txt(c.licenca) : ''].filter(Boolean).join(' · ') + '</p></div>' +
      '<div class="conj-acoes">' + (arq ? '<button type="button" class="botao" data-ver="' + i + '" aria-expanded="false" aria-controls="vis-' + i + '">' + t('visualizar') + '</button>' +
      '<a class="botao contorno" href="' + arq + '" download>' + t('baixar') + ' ' + esc(c.formato || '') + '</a>' : '') + '</div></div>' +
      (vars.length ? '<details class="dicionario"><summary>' + t('dicionario') + ' (' + vars.length + ')</summary><div class="scroll"><table><thead><tr><th>' + t('variavel') + '</th><th>' + t('descricao') + '</th></tr></thead><tbody>' +
        vars.map(function (v) { return '<tr><td><code>' + esc(v.nome) + '</code></td><td>' + txt(loc(v, 'descricao')) + '</td></tr>'; }).join('') + '</tbody></table></div></details>' : '') +
      '<div class="vis" id="vis-' + i + '" hidden></div></article>';
  }

  function lerCSV(texto) {
    texto = texto.replace(/^﻿/, '');
    var prim = texto.split(/\r?\n/)[0] || '';
    var sep = (prim.split(';').length > prim.split(',').length) ? ';' : ',';
    var linhas = [], campo = '', linha = [], aspas = false;
    for (var i = 0; i < texto.length; i++) {
      var ch = texto[i];
      if (aspas) {
        if (ch === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else aspas = false; } else campo += ch;
      } else if (ch === '"') aspas = true;
      else if (ch === sep) { linha.push(campo); campo = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && texto[i + 1] === '\n') i++; linha.push(campo); campo = ''; if (linha.join('') !== '') linhas.push(linha); linha = []; }
      else campo += ch;
    }
    if (campo !== '' || linha.length) { linha.push(campo); if (linha.join('') !== '') linhas.push(linha); }
    var cab = (linhas.shift() || []).map(function (h) { return h.trim(); });
    return { colunas: cab, linhas: linhas.map(function (l) { var o = {}; cab.forEach(function (h, k) { o[h] = l[k] == null ? '' : l[k].trim(); }); return o; }) };
  }
  function numero(v) { if (v == null || v === '') return NaN; return Number(String(v).replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); }

  function ligarConjuntos(pq) {
    document.querySelectorAll('[data-ver]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-ver'), c = pq.conjuntos[i], caixa = document.getElementById('vis-' + i);
        var abrir = caixa.hidden;
        caixa.hidden = !abrir;
        b.setAttribute('aria-expanded', String(abrir));
        b.textContent = abrir ? t('fechar') : t('visualizar');
        if (abrir && !caixa.getAttribute('data-ok')) abrirConjunto(c, caixa);
      });
    });
  }
  function abrirConjunto(c, caixa) {
    caixa.innerHTML = '<p class="meta">' + t('carregando_dados') + '</p>';
    fetch(caminho(c.arquivo).replace(/&amp;/g, '&')).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (texto) {
      var geo = null, dados;
      if (/\.(geo)?json$/i.test(c.arquivo)) {
        geo = JSON.parse(texto);
        var feats = geo.features || [];
        var cols = []; feats.forEach(function (f) { Object.keys(f.properties || {}).forEach(function (k) { if (cols.indexOf(k) < 0) cols.push(k); }); });
        dados = { colunas: cols, linhas: feats.map(function (f) { return f.properties || {}; }) };
      } else dados = lerCSV(texto);
      var vz = c.visualizacoes || {};
      var mapaCfg = vz.mapa || {};
      var lat = mapaCfg.lat || dados.colunas.find(function (k) { return /^(lat|latitude)$/i.test(k); });
      var lon = mapaCfg.lon || dados.colunas.find(function (k) { return /^(lon|lng|long|longitude)$/i.test(k); });
      var temMapa = !!geo || (lat && lon && dados.colunas.indexOf(lat) >= 0 && dados.colunas.indexOf(lon) >= 0);
      var abas = [['tabela', t('tabela')], ['grafico', t('grafico_t')]].concat(temMapa ? [['mapa', t('mapa')]] : []);
      caixa.setAttribute('data-ok', '1');
      caixa.innerHTML = '<div class="abas" role="tablist">' + abas.map(function (a, k) { return '<button type="button" role="tab" data-aba="' + a[0] + '" aria-selected="' + (k === 0) + '">' + a[1] + '</button>'; }).join('') + '</div><div class="aba-corpo"></div>';
      var corpo = caixa.querySelector('.aba-corpo');
      var mostrar = function (qual) {
        caixa.querySelectorAll('[data-aba]').forEach(function (x) { x.setAttribute('aria-selected', String(x.getAttribute('data-aba') === qual)); });
        if (qual === 'tabela') verTabela(corpo, dados);
        if (qual === 'grafico') verGrafico(corpo, dados, vz.grafico || {});
        if (qual === 'mapa') verMapa(corpo, dados, geo, { lat: lat, lon: lon, rotulo: mapaCfg.rotulo, cor_por: mapaCfg.cor_por });
      };
      caixa.querySelector('.abas').addEventListener('click', function (e) { var x = e.target.closest('[data-aba]'); if (x) mostrar(x.getAttribute('data-aba')); });
      mostrar(vz.abrir_em && abas.some(function (a) { return a[0] === vz.abrir_em; }) ? vz.abrir_em : 'tabela');
    }).catch(function () { caixa.innerHTML = '<p class="vazio">' + t('erro_dados') + '</p>'; });
  }

  function verTabela(corpo, dados) {
    var estado = { q: '', col: null, asc: true }, LIM = 200;
    corpo.innerHTML = '<div class="tab-ctrl"><input type="search" class="tab-busca" placeholder="' + esc(t('filtrar')) + '" aria-label="' + esc(t('filtrar')) + '"><span class="meta tab-n"></span></div><div class="scroll tabela-dados"></div>';
    var alvo = corpo.querySelector('.tabela-dados'), nEl = corpo.querySelector('.tab-n');
    function desenhar() {
      var q = estado.q.toLowerCase();
      var rs = dados.linhas.filter(function (r) { return !q || dados.colunas.some(function (k) { return String(r[k]).toLowerCase().indexOf(q) >= 0; }); });
      if (estado.col) {
        var k = estado.col;
        rs = rs.slice().sort(function (a, b) {
          var x = numero(a[k]), y = numero(b[k]);
          var r = (!isNaN(x) && !isNaN(y)) ? x - y : String(a[k]).localeCompare(String(b[k]), 'pt');
          return estado.asc ? r : -r;
        });
      }
      nEl.textContent = rs.length + t('linhas_n') + (rs.length > LIM ? t('mostrando') + LIM : '');
      alvo.innerHTML = '<table><thead><tr>' + dados.colunas.map(function (k) {
        var s = estado.col === k ? (estado.asc ? 'ascending' : 'descending') : 'none';
        return '<th aria-sort="' + s + '"><button type="button" data-col="' + esc(k) + '">' + esc(k) + (estado.col === k ? (estado.asc ? ' ▲' : ' ▼') : '') + '</button></th>';
      }).join('') + '</tr></thead><tbody>' + rs.slice(0, LIM).map(function (r) {
        return '<tr>' + dados.colunas.map(function (k) { var v = r[k]; return '<td' + (!isNaN(numero(v)) ? ' class="num"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
    }
    corpo.querySelector('.tab-busca').addEventListener('input', function (e) { estado.q = e.target.value; desenhar(); });
    alvo.addEventListener('click', function (e) {
      var b = e.target.closest('[data-col]'); if (!b) return;
      var k = b.getAttribute('data-col');
      if (estado.col === k) estado.asc = !estado.asc; else { estado.col = k; estado.asc = true; }
      desenhar();
    });
    desenhar();
  }

  function verGrafico(corpo, dados, cfg) {
    var numericas = dados.colunas.filter(function (k) { var vs = dados.linhas.slice(0, 50).map(function (r) { return numero(r[k]); }); return vs.length && vs.filter(function (v) { return !isNaN(v); }).length >= vs.length * 0.8; });
    var cats = dados.colunas.filter(function (k) { return numericas.indexOf(k) < 0; });
    var estado = { cat: cfg.categoria || cats[0] || dados.colunas[0], val: cfg.valor || '', ag: cfg.agregacao || (cfg.valor ? 'soma' : 'contagem') };
    var sel = function (id, lista, atual) { return '<select data-g="' + id + '">' + lista.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === atual ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>'; };
    corpo.innerHTML = '<div class="tab-ctrl graf-ctrl">' +
      '<label>' + t('categoria') + sel('cat', dados.colunas.map(function (k) { return [k, k]; }), estado.cat) + '</label>' +
      '<label>' + t('valor') + sel('val', [['', t('contagem')]].concat(numericas.map(function (k) { return [k, k]; })), estado.val) + '</label>' +
      '<label>' + t('agregacao') + sel('ag', [['soma', t('soma')], ['media', t('media')]], estado.ag === 'media' ? 'media' : 'soma') + '</label>' +
      '</div><div class="barras" role="img"></div>';
    var alvo = corpo.querySelector('.barras');
    corpo.querySelector('[data-g=ag]').disabled = !estado.val;
    function desenhar() {
      var grupos = {};
      dados.linhas.forEach(function (r) {
        var g = r[estado.cat] === '' ? '—' : r[estado.cat];
        grupos[g] = grupos[g] || { n: 0, s: 0 };
        grupos[g].n++;
        if (estado.val) { var v = numero(r[estado.val]); if (!isNaN(v)) grupos[g].s += v; }
      });
      var lista = Object.keys(grupos).map(function (g) {
        var x = grupos[g];
        return [g, !estado.val ? x.n : (estado.ag === 'media' ? x.s / x.n : x.s)];
      }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 30);
      var max = Math.max.apply(null, lista.map(function (x) { return x[1]; }).concat([1]));
      var fmt = function (v) { return (Math.round(v * 100) / 100).toLocaleString(lang === 'en' ? 'en' : 'pt-BR'); };
      alvo.setAttribute('aria-label', (estado.val ? estado.val : t('contagem')) + ' / ' + estado.cat);
      alvo.innerHTML = lista.map(function (x, k) {
        return '<div class="barra"><span class="b-rot">' + esc(x[0]) + '</span><span class="b-trilho"><span class="b-fill" style="width:' + (100 * x[1] / max).toFixed(1) + '%;--cor:' + PALETA[k % PALETA.length] + '"></span></span><span class="b-val">' + fmt(x[1]) + '</span></div>';
      }).join('');
    }
    corpo.querySelectorAll('[data-g]').forEach(function (s) {
      s.addEventListener('change', function () {
        var k = s.getAttribute('data-g');
        if (k === 'cat') estado.cat = s.value; if (k === 'val') estado.val = s.value; if (k === 'ag') estado.ag = s.value;
        corpo.querySelector('[data-g=ag]').disabled = !estado.val;
        desenhar();
      });
    });
    desenhar();
  }

  var leafletPromessa = null;
  function carregarLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromessa) return leafletPromessa;
    leafletPromessa = new Promise(function (ok, falha) {
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      s.onload = function () { window.L ? ok(window.L) : falha(); };
      s.onerror = falha;
      document.head.appendChild(s);
      setTimeout(function () { if (!window.L) falha(); }, 8000);
    });
    leafletPromessa.catch(function () { leafletPromessa = null; });
    return leafletPromessa;
  }
  function coresPor(dados, campo) {
    var m = {}, n = 0;
    if (campo) dados.linhas.forEach(function (r) { var v = r[campo]; if (!(v in m)) m[v] = PALETA[(n++) % PALETA.length]; });
    return m;
  }
  function verMapa(corpo, dados, geo, cfg) {
    var cores = coresPor(dados, cfg.cor_por);
    var legenda = cfg.cor_por ? '<ul class="legenda">' + Object.keys(cores).map(function (k) { return '<li><span style="background:' + cores[k] + '"></span>' + esc(k) + '</li>'; }).join('') + '</ul>' : '';
    corpo.innerHTML = '<div class="mapa" id="mapa-vis"></div>' + legenda + '<p class="meta mapa-nota"></p>';
    var div = corpo.querySelector('.mapa');
    var pontos = geo ? null : dados.linhas.map(function (r) { return { lat: numero(r[cfg.lat]), lon: numero(r[cfg.lon]), r: r }; }).filter(function (p) { return !isNaN(p.lat) && !isNaN(p.lon); });
    var popup = function (r) {
      var tit = cfg.rotulo ? '<strong>' + esc(r[cfg.rotulo]) + '</strong><br>' : '';
      return tit + Object.keys(r).filter(function (k) { return k !== cfg.rotulo && k !== cfg.lat && k !== cfg.lon; }).slice(0, 8).map(function (k) { return esc(k) + ': ' + esc(r[k]); }).join('<br>');
    };
    carregarLeaflet().then(function (L) {
      if (!document.body.contains(div)) return;
      var mapa = L.map(div, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 18 }).addTo(mapa);
      var camada;
      if (geo) {
        camada = L.geoJSON(geo, {
          style: function (f) { var c = cores[(f.properties || {})[cfg.cor_por]] || '#176F80'; return { color: c, weight: 1.5, fillColor: c, fillOpacity: 0.45 }; },
          pointToLayer: function (f, ll) { var c = cores[(f.properties || {})[cfg.cor_por]] || '#176F80'; return L.circleMarker(ll, { radius: 7, color: '#fff', weight: 1.5, fillColor: c, fillOpacity: 0.9 }); },
          onEachFeature: function (f, l) { l.bindPopup(popup(f.properties || {})); }
        }).addTo(mapa);
      } else {
        camada = L.featureGroup(pontos.map(function (p) {
          return L.circleMarker([p.lat, p.lon], { radius: 7, color: '#fff', weight: 1.5, fillColor: cores[p.r[cfg.cor_por]] || '#176F80', fillOpacity: 0.9 }).bindPopup(popup(p.r));
        })).addTo(mapa);
      }
      try { mapa.fitBounds(camada.getBounds(), { padding: [24, 24] }); } catch (e) { mapa.setView([-14, -52], 4); }
      limpezas.push(function () { mapa.remove(); });
    }).catch(function () {
      // sem Leaflet: pontos desenhados sobre um quadro simples, pelas coordenadas
      corpo.querySelector('.mapa-nota').textContent = t('mapa_sem_base');
      var ps = pontos || [];
      if (!ps.length) return;
      var la = ps.map(function (p) { return p.lat; }), lo = ps.map(function (p) { return p.lon; });
      var mnLa = Math.min.apply(null, la), mxLa = Math.max.apply(null, la), mnLo = Math.min.apply(null, lo), mxLo = Math.max.apply(null, lo);
      var padLa = (mxLa - mnLa) * 0.08 || 1, padLo = (mxLo - mnLo) * 0.08 || 1;
      mnLa -= padLa; mxLa += padLa; mnLo -= padLo; mxLo += padLo;
      var desenhar = function () {
        var W = div.clientWidth, H = div.clientHeight;
        var esc2 = Math.min(W / (mxLo - mnLo), H / (mxLa - mnLa));
        var ox = (W - (mxLo - mnLo) * esc2) / 2, oy = (H - (mxLa - mnLa) * esc2) / 2;
        div.innerHTML = '<svg width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(t('mapa')) + '">' + ps.map(function (p) {
          var x = ox + (p.lon - mnLo) * esc2, y = oy + (mxLa - p.lat) * esc2;
          return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="7" fill="' + (cores[p.r[cfg.cor_por]] || '#176F80') + '" stroke="#fff" stroke-width="1.5"><title>' + esc(cfg.rotulo ? p.r[cfg.rotulo] : '') + '</title></circle>' +
            (cfg.rotulo ? '<text x="' + (x + 10).toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" font-size="11" fill="#4A5568">' + esc(p.r[cfg.rotulo]) + '</text>' : '');
        }).join('') + '</svg>';
      };
      desenhar();
      var ro = new ResizeObserver(desenhar); ro.observe(div);
      limpezas.push(function () { ro.disconnect(); });
    });
  }

  /* ---------- biblioteca ---------- */
  var ICONES = {
    publicacao: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
    didatico: '<path d="M3 8l9-4 9 4-9 4z"/><path d="M7 10v5c3 2 7 2 10 0v-5"/><path d="M21 8v6"/>',
    audiovisual: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
    foto: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M8 6l2-2h4l2 2"/><circle cx="12" cy="13" r="3.5"/>'
  };
  var CORES_CAT = { publicacao: '#13294B', didatico: '#427568', audiovisual: '#176F80', foto: '#2F5E86' };
  function tipoArquivo(a) {
    var m = /\.([a-z0-9]+)(\?|#|$)/i.exec(String(a || '')); var e = m ? m[1].toLowerCase() : '';
    if (/^(jpe?g|png|webp|gif|avif)$/.test(e)) return 'imagem';
    if (/^(mp4|webm|mov|m4v)$/.test(e)) return 'video';
    if (/^(mp3|m4a|wav|ogg)$/.test(e)) return 'audio';
    return e ? e.toUpperCase() : '';
  }
  function itensBiblioteca() {
    var b = D.biblioteca || {};
    var man = (b.itens || []).filter(function (x) { return x.titulo && (x.arquivo || x.link); }).map(function (x, i) {
      return { id: 'b' + i, cat: x.categoria || 'publicacao', titulo: loc(x, 'titulo'), data: String(x.data || ''), autores: x.autores || '', desc: loc(x, 'descricao') || '',
        arquivo: caminho(x.arquivo), link: url(x.link), capa: caminho(x.capa), projeto: x.projeto || '', tags: x.tags || [] };
    });
    if (b.incluir_publicacoes_automaticas !== false) {
      publicacoes().forEach(function (p, i) {
        if (!url(p.url)) return;
        man.push({ id: 'p' + i, cat: 'publicacao', titulo: p.titulo, data: String(p.data || p.ano || ''), autores: p.autores_texto || (p.autores || []).map(function (id) { var m = pessoa(id); return m ? m.nome : ''; }).filter(Boolean).join(', '),
          desc: [p.veiculo, t('tipos')[p.tipo]].filter(Boolean).join(' · '), arquivo: '', link: url(p.url), capa: '', projeto: (p.projetos || [])[0] || '', tags: [] });
      });
    }
    return man;
  }
  var estadoBib = { cat: '', q: '', ordem: 'recentes' };
  P.biblioteca = function () {
    var q = params();
    estadoBib = { cat: q.categoria || '', q: '', ordem: 'recentes' };
    setTimeout(ligarBiblioteca, 0);
    return '<section class="secao"><p class="olho">' + t('acervo') + '</p><h1>' + t('biblioteca') + '</h1>' +
      '<p class="lead">' + t('bib_lead') + '</p>' +
      '<div class="cats" id="bib-cats" role="group" aria-label="' + esc(t('categoria')) + '"></div>' +
      '<div class="filtros" role="search">' +
      '<label>' + t('buscar') + '<input type="search" id="bib-busca" placeholder="' + esc(t('bib_busca')) + '"></label>' +
      '<label>' + t('ordenar') + '<select id="bib-ordem">' +
      [['recentes', t('o_recentes')], ['antigos', t('o_antigos')], ['az', t('o_az')], ['za', t('o_za')]].map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('') +
      '</select></label></div>' +
      '<p class="contagem" id="bib-n"></p><div class="bib-grade" id="bib-lista"></div>' +
      '<dialog class="visor" id="visor" aria-label="' + esc(t('visualizar')) + '"><div class="visor-in"><button type="button" class="visor-x" id="visor-x" aria-label="' + esc(t('fechar')) + '">×</button>' +
      '<button type="button" class="visor-nav ant" id="visor-ant" aria-label="' + esc(t('ant_item')) + '">‹</button><div class="visor-midia" id="visor-midia"></div>' +
      '<button type="button" class="visor-nav prox" id="visor-prox" aria-label="' + esc(t('prox_item')) + '">›</button><div class="visor-legenda" id="visor-leg"></div></div></dialog>' +
      '</section>';
  };
  function ligarBiblioteca() {
    var busca = document.getElementById('bib-busca'); if (!busca) return;
    busca.addEventListener('input', function () { estadoBib.q = busca.value; desenharBiblioteca(); });
    document.getElementById('bib-ordem').addEventListener('change', function (e) { estadoBib.ordem = e.target.value; desenharBiblioteca(); });
    document.getElementById('bib-cats').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]'); if (!b) return;
      estadoBib.cat = b.getAttribute('data-cat'); desenharBiblioteca();
    });
    var visor = document.getElementById('visor');
    document.getElementById('visor-x').addEventListener('click', function () { fecharVisor(); });
    document.getElementById('visor-ant').addEventListener('click', function () { moverVisor(-1); });
    document.getElementById('visor-prox').addEventListener('click', function () { moverVisor(1); });
    visor.addEventListener('click', function (e) { if (e.target === visor) fecharVisor(); });
    visor.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') moverVisor(1); if (e.key === 'ArrowLeft') moverVisor(-1); });
    visor.addEventListener('close', function () { document.getElementById('visor-midia').innerHTML = ''; });
    document.getElementById('bib-lista').addEventListener('click', function (e) {
      var b = e.target.closest('[data-abrir]'); if (!b) return;
      abrirVisor(+b.getAttribute('data-abrir'));
    });
    desenharBiblioteca();
  }
  var listaAtual = [], posVisor = 0;
  function semAc(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function desenharBiblioteca() {
    var todos = itensBiblioteca();
    var cats = [['', t('todos')], ['publicacao', t('c_publicacao')], ['didatico', t('c_didatico')], ['audiovisual', t('c_audiovisual')], ['foto', t('c_foto')]];
    document.getElementById('bib-cats').innerHTML = cats.map(function (c) {
      var n = todos.filter(function (x) { return !c[0] || x.cat === c[0]; }).length;
      return '<button type="button" data-cat="' + c[0] + '" aria-pressed="' + (estadoBib.cat === c[0]) + '"' + (c[0] ? ' style="--cor:' + CORES_CAT[c[0]] + '"' : '') + '>' + esc(c[1]) + ' <span>' + n + '</span></button>';
    }).join('');
    var q = semAc(estadoBib.q);
    var lista = todos.filter(function (x) {
      if (estadoBib.cat && x.cat !== estadoBib.cat) return false;
      if (q && semAc([x.titulo, x.autores, x.desc, (x.tags || []).join(' ')].join(' ')).indexOf(q) < 0) return false;
      return true;
    });
    var col = function (a, b) { return a.titulo.localeCompare(b.titulo, lang === 'en' ? 'en' : 'pt', { sensitivity: 'base' }); };
    lista.sort({
      recentes: function (a, b) { return b.data.localeCompare(a.data) || col(a, b); },
      antigos: function (a, b) { return (a.data || '9999').localeCompare(b.data || '9999') || col(a, b); },
      az: col, za: function (a, b) { return col(b, a); }
    }[estadoBib.ordem]);
    listaAtual = lista;
    document.getElementById('bib-n').textContent = lista.length + (lista.length === 1 ? t('item1') : t('itens'));
    document.getElementById('bib-lista').innerHTML = lista.length ? lista.map(cartaoBib).join('') :
      '<p class="vazio">' + (todos.length ? t('nada') : t('bib_vazia')) + '</p>';
  }
  function cartaoBib(x, i) {
    var tipo = tipoArquivo(x.arquivo);
    var capa = x.capa || (tipo === 'imagem' ? x.arquivo : '');
    var visivel = tipo === 'imagem' || tipo === 'video' || tipo === 'audio';
    var alvo = x.arquivo || x.link;
    var ano = (x.data || '').slice(0, 4);
    var topo = capa
      ? '<span class="bib-capa"><img src="' + capa + '" alt="" loading="lazy"></span>'
      : '<span class="bib-capa bib-icone" style="--cor:' + CORES_CAT[x.cat] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[x.cat] || ICONES.publicacao) + '</svg></span>';
    var acao = visivel
      ? '<button type="button" class="bib-acao" data-abrir="' + i + '">' + (tipo === 'imagem' ? t('ver_foto') : t('assistir')) + '</button>'
      : '<a class="bib-acao" href="' + alvo + '" target="_blank" rel="noopener"' + (x.arquivo ? ' download' : '') + '>' + (x.arquivo ? t('baixar') + (tipo ? ' ' + esc(tipo) : '') : t('abrir')) + '</a>';
    return '<article class="bib-item surge">' +
      (visivel ? '<button type="button" class="bib-capa-bt" data-abrir="' + i + '" aria-label="' + esc(x.titulo) + '">' + topo + '</button>' : topo) +
      '<div class="bib-corpo"><span class="bib-cat" style="--cor:' + CORES_CAT[x.cat] + '">' + esc(t('c1_' + x.cat)) + (ano ? ' · ' + esc(ano) : '') + '</span>' +
      '<h3>' + esc(x.titulo) + '</h3>' + (x.autores ? '<p class="meta">' + esc(x.autores) + '</p>' : '') +
      (x.desc ? '<p class="bib-desc">' + txt(x.desc) + '</p>' : '') +
      chipsProjetos(x.projeto ? [x.projeto] : []) + acao + botoesPartilha(x.titulo, alvo) + '</div></article>';
  }
  function abrirVisor(i) {
    var visor = document.getElementById('visor');
    posVisor = i; mostrarVisor();
    if (!visor.open) { if (visor.showModal) visor.showModal(); else visor.setAttribute('open', ''); }
  }
  function visiveis() { return listaAtual.map(function (x, i) { return [x, i]; }).filter(function (p) { return /^(imagem|video|audio)$/.test(tipoArquivo(p[0].arquivo)); }); }
  function moverVisor(d) {
    var vs = visiveis(); if (!vs.length) return;
    var k = vs.findIndex(function (p) { return p[1] === posVisor; });
    posVisor = vs[(k + d + vs.length) % vs.length][1]; mostrarVisor();
  }
  function mostrarVisor() {
    var x = listaAtual[posVisor]; if (!x) return;
    var tipo = tipoArquivo(x.arquivo), m = document.getElementById('visor-midia');
    m.innerHTML = tipo === 'imagem' ? '<img src="' + x.arquivo + '" alt="' + esc(x.titulo) + '">'
      : tipo === 'video' ? '<video src="' + x.arquivo + '" controls autoplay playsinline></video>'
      : '<audio src="' + x.arquivo + '" controls autoplay></audio>';
    document.getElementById('visor-leg').innerHTML = '<strong>' + esc(x.titulo) + '</strong>' + (x.data ? ' · ' + dataFmt(x.data) : '') +
      (x.desc ? '<br>' + txt(x.desc) : '') + ' <a href="' + x.arquivo + '" download>' + t('baixar') + '</a>';
    var n = visiveis().length;
    document.getElementById('visor-ant').hidden = n < 2; document.getElementById('visor-prox').hidden = n < 2;
  }
  function fecharVisor() { var v = document.getElementById('visor'); if (v.close) v.close(); else v.removeAttribute('open'); document.getElementById('visor-midia').innerHTML = ''; }

  /* ---------- agenda ---------- */
  var TIPOS_AG = ['reuniao', 'viagem', 'organizado', 'participacao', 'outro', 'feriado'];
  var CORES_AG = { reuniao: '#176F80', viagem: '#427568', organizado: '#13294B', participacao: '#2F5E86', outro: '#6B7A8C', feriado: '#A0412D' };
  function dIso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dDe(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function somaDias(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function compromissos() {
    var lista = [];
    var hoje = new Date(), limite = somaDias(hoje, 400);
    ((D.agenda && D.agenda.eventos) || []).forEach(function (e) {
      var ini = dDe(e.inicio); if (!ini || !e.titulo) return;
      var fim = dDe(e.fim), dur = fim ? Math.round((fim - ini) / 864e5) : 0;
      var base = { titulo: loc(e, 'titulo'), tipo: TIPOS_AG.indexOf(e.tipo) >= 0 ? e.tipo : 'outro', hora: e.hora || '', local: e.local || '', descricao: loc(e, 'descricao') || '', link: e.link || '', projeto: e.projeto || '' };
      var pular = e.pular || [], r = e.repetir;
      var datas = [ini];
      if (r && r.freq) {
        var ate = dDe(r.ate) || limite, d = ini, k = 0;
        datas = [];
        while (d <= ate && d <= limite && k < 500) {
          if (pular.indexOf(dIso(d)) < 0) datas.push(d);
          k++;
          d = r.freq === 'mensal' ? new Date(ini.getFullYear(), ini.getMonth() + k, ini.getDate()) : somaDias(ini, k * (r.freq === 'quinzenal' ? 14 : 7));
        }
      }
      datas.forEach(function (d) { lista.push(Object.assign({}, base, { inicio: dIso(d), fim: dur ? dIso(somaDias(d, dur)) : '' })); });
    });
    (D.agendaSite || []).forEach(function (e) { if (e.inicio && e.titulo) lista.push(Object.assign({}, e, { tipo: TIPOS_AG.indexOf(e.tipo) >= 0 ? e.tipo : 'outro' })); });
    ((D.agendaGoogle && D.agendaGoogle.eventos) || []).forEach(function (e) {
      if (e.inicio && e.titulo) lista.push(Object.assign({ tipo: 'outro' }, e, { tipo: TIPOS_AG.indexOf(e.tipo) >= 0 ? e.tipo : 'outro' }));
    });
    return lista.sort(function (a, b) { return (a.inicio + a.hora).localeCompare(b.inicio + b.hora); });
  }

  /* feriados: nacionais, estado de SP e São José dos Campos (sede do INPE) */
  function pascoa(a) {
    var b = a % 19, c = Math.floor(a / 100), d = a % 100, e = Math.floor(c / 4), f = c % 4, g = Math.floor((c + 8) / 25), h = Math.floor((c - g + 1) / 3);
    var i = (19 * b + c - e - h + 15) % 30, k = Math.floor(d / 4), l = d % 4, m = (32 + 2 * f + 2 * k - i - l) % 7, n = Math.floor((b + 11 * i + 22 * m) / 451);
    var mes = Math.floor((i + m - 7 * n + 114) / 31), dia = ((i + m - 7 * n + 114) % 31) + 1;
    return new Date(a, mes - 1, dia);
  }
  var NOMES_FER = {
    confra: ['Confraternização Universal', "New Year's Day"], carnaval: ['Carnaval', 'Carnival'], cinzas: ['Quarta-feira de Cinzas (até 14h)', 'Ash Wednesday (until 2 pm)'],
    sjose: ['Dia de São José, padroeiro da cidade', "St Joseph's Day (city patron)"], paixao: ['Sexta-feira Santa', 'Good Friday'], tiradentes: ['Tiradentes', 'Tiradentes Day'],
    trabalho: ['Dia do Trabalho', 'Labour Day'], corpus: ['Corpus Christi', 'Corpus Christi'], rev32: ['Revolução Constitucionalista de 1932', '1932 Constitutionalist Revolution'],
    aniv: ['Aniversário de São José dos Campos', 'São José dos Campos anniversary'], indep: ['Independência do Brasil', 'Independence Day'],
    aparecida: ['Nossa Senhora Aparecida', 'Our Lady of Aparecida'], servidor: ['Dia do Servidor Público', 'Public Servants Day'], finados: ['Finados', "All Souls' Day"],
    republica: ['Proclamação da República', 'Republic Day'], consciencia: ['Dia Nacional de Zumbi e da Consciência Negra', 'Black Consciousness Day'],
    vnatal: ['Véspera de Natal (após 14h)', 'Christmas Eve (after 2 pm)'], natal: ['Natal', 'Christmas'], vano: ['Véspera de Ano-Novo (após 14h)', "New Year's Eve (after 2 pm)"]
  };
  function feriados(ano) {
    var cfg = (D.agenda && D.agenda.feriados) || {};
    var P = pascoa(ano), lista = [];
    function add(d, k, ab) {
      if (ab === 'nacional' && cfg.nacionais === false) return;
      if (ab === 'sp' && cfg.estado_sp === false) return;
      if (ab === 'sjc' && cfg.sao_jose_dos_campos === false) return;
      if (ab === 'facultativo' && cfg.pontos_facultativos === false) return;
      lista.push({ inicio: dIso(d), titulo: NOMES_FER[k][lang === 'en' ? 1 : 0], tipo: 'feriado', abrangencia: ab, hora: '', local: '', descricao: '', link: '', projeto: '' });
    }
    var F = function (m, d) { return new Date(ano, m - 1, d); };
    add(F(1, 1), 'confra', 'nacional');
    add(somaDias(P, -48), 'carnaval', 'facultativo'); add(somaDias(P, -47), 'carnaval', 'facultativo'); add(somaDias(P, -46), 'cinzas', 'facultativo');
    add(F(3, 19), 'sjose', 'sjc');
    add(somaDias(P, -2), 'paixao', 'nacional');
    add(F(4, 21), 'tiradentes', 'nacional'); add(F(5, 1), 'trabalho', 'nacional');
    add(somaDias(P, 60), 'corpus', 'facultativo');
    add(F(7, 9), 'rev32', 'sp'); add(F(7, 27), 'aniv', 'sjc');
    add(F(9, 7), 'indep', 'nacional'); add(F(10, 12), 'aparecida', 'nacional'); add(F(10, 28), 'servidor', 'facultativo');
    add(F(11, 2), 'finados', 'nacional'); add(F(11, 15), 'republica', 'nacional'); add(F(11, 20), 'consciencia', 'nacional');
    add(F(12, 24), 'vnatal', 'facultativo'); add(F(12, 25), 'natal', 'nacional'); add(F(12, 31), 'vano', 'facultativo');
    (cfg.extras || []).forEach(function (x) { var d = dDe(x.data); if (d && d.getFullYear() === ano) lista.push({ inicio: x.data, titulo: loc(x, 'titulo'), tipo: 'feriado', abrangencia: x.abrangencia || 'sjc', hora: '', local: '', descricao: '', link: '', projeto: '' }); });
    (cfg.remover || []).forEach(function (r) { lista = lista.filter(function (x) { return x.inicio !== r; }); });
    return lista;
  }
  function feriadosEm(m) { return feriados(m.getFullYear() - 1).concat(feriados(m.getFullYear()), feriados(m.getFullYear() + 1)); }
  function noDia(ev, iso) { return ev.inicio === iso || (ev.fim && ev.inicio <= iso && ev.fim >= iso); }
  function proximos(n) {
    var hoje = dIso(new Date());
    return compromissos().filter(function (e) { return (e.fim || e.inicio) >= hoje; }).slice(0, n);
  }
  function fmtDia(iso, opc) { var d = dDe(iso); return d ? d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', opc) : ''; }
  function itemAgenda(e) {
    var d = dDe(e.inicio);
    var periodo = e.fim ? fmtDia(e.inicio, { day: 'numeric', month: 'short' }) + ' – ' + fmtDia(e.fim, { day: 'numeric', month: 'short' }) : fmtDia(e.inicio, { weekday: 'long' });
    return '<li class="ag-item" style="--cor:' + CORES_AG[e.tipo] + '">' +
      '<span class="ag-data"><b>' + d.getDate() + '</b>' + esc(fmtDia(e.inicio, { month: 'short' }).replace('.', '')) + '</span>' +
      '<span class="ag-corpo"><span class="ag-tipo">' + esc(e.tipo === 'feriado' ? t('fer_' + e.abrangencia) : t('ag_' + e.tipo)) + '</span>' +
      '<strong>' + (url(e.link) ? '<a href="' + url(e.link) + '" target="_blank" rel="noopener">' + esc(e.titulo) + '</a>' : esc(e.titulo)) + '</strong>' +
      '<span class="meta">' + [esc(periodo), esc(e.hora), esc(e.local)].filter(Boolean).join(' · ') + '</span>' +
      (e.descricao ? '<span class="ag-desc">' + esc(e.descricao) + '</span>' : '') + chipsProjetos(e.projeto ? [e.projeto] : []) + '</span></li>';
  }
  function blocoProximos(n) {
    var ps = proximos(n);
    return ps.length ? '<ul class="ag-lista">' + ps.map(itemAgenda).join('') + '</ul>' : '<p class="vazio">' + t('ag_vazio') + '</p>';
  }
  var estadoAg = { mes: null, dia: null, tipos: {} };
  P.agenda = function () {
    var hoje = new Date();
    estadoAg = { mes: new Date(hoje.getFullYear(), hoje.getMonth(), 1), dia: dIso(hoje), tipos: {} };
    TIPOS_AG.forEach(function (x) { estadoAg.tipos[x] = true; });
    var assinar = D.agendaGoogle && url(D.agendaGoogle.assinar);
    setTimeout(ligarAgenda, 0);
    return '<section class="secao"><p class="olho">' + t('ag_olho') + '</p><h1>' + t('agenda') + '</h1>' +
      '<p class="lead">' + t('ag_lead') + '</p>' +
      '<div class="cats" id="ag-tipos" role="group" aria-label="' + esc(t('tipo')) + '">' + TIPOS_AG.map(function (x) {
        return '<button type="button" data-tipo="' + x + '" aria-pressed="true" style="--cor:' + CORES_AG[x] + '"><i class="ag-pt"></i>' + esc(t('ag_' + x)) + '</button>';
      }).join('') + '</div>' +
      '<div class="ag-grade"><div class="cal">' +
      '<div class="cal-topo"><button type="button" class="seta" id="cal-ant" aria-label="' + esc(t('ag_mes_ant')) + '">‹</button>' +
      '<h2 id="cal-mes" aria-live="polite"></h2><button type="button" class="seta" id="cal-prox" aria-label="' + esc(t('ag_mes_prox')) + '">›</button>' +
      '<button type="button" class="pausa" id="cal-hoje">' + t('ag_hoje') + '</button></div>' +
      '<div class="cal-dias" id="cal-dias"></div><div class="cal-pop" id="cal-pop" role="tooltip" hidden></div>' +
      '<p class="meta cal-dica">' + t('ag_dica') + '</p></div>' +
      '<div class="ag-lado"><h2 id="ag-dia-tit" style="font-size:1.3rem"></h2><div id="ag-dia"></div>' +
      '<h2 style="font-size:1.3rem;margin-top:32px">' + t('ag_proximos') + '</h2><div id="ag-prox"></div>' +
      (assinar ? '<p style="margin-top:20px"><a class="botao contorno" href="' + assinar + '" target="_blank" rel="noopener">' + t('ag_google') + '</a></p>' : '') +
      (D.agendaGoogle && D.agendaGoogle.atualizado_em ? '<p class="meta">' + t('ag_sinc') + esc(D.agendaGoogle.atualizado_em) + '</p>' : '') +
      '</div></div></section>';
  };
  function ligarAgenda() {
    var dias = document.getElementById('cal-dias'); if (!dias) return;
    document.getElementById('cal-ant').addEventListener('click', function () { estadoAg.mes = new Date(estadoAg.mes.getFullYear(), estadoAg.mes.getMonth() - 1, 1); desenharAgenda(); });
    document.getElementById('cal-prox').addEventListener('click', function () { estadoAg.mes = new Date(estadoAg.mes.getFullYear(), estadoAg.mes.getMonth() + 1, 1); desenharAgenda(); });
    document.getElementById('cal-hoje').addEventListener('click', function () { var h = new Date(); estadoAg.mes = new Date(h.getFullYear(), h.getMonth(), 1); estadoAg.dia = dIso(h); desenharAgenda(); });
    var pop = document.getElementById('cal-pop'), fixo = false;
    function mostrarPop(b) {
      var iso = b.getAttribute('data-dia');
      var evs = compromissos().concat(feriadosEm(dDe(iso))).filter(function (e) { return estadoAg.tipos[e.tipo] && noDia(e, iso); });
      if (!evs.length) { pop.hidden = true; return; }
      pop.innerHTML = '<strong class="pop-dia">' + esc(fmtDia(iso, { weekday: 'long', day: 'numeric', month: 'long' })) + '</strong>' + evs.map(function (e) {
        return '<span class="pop-ev" style="--cor:' + CORES_AG[e.tipo] + '"><span class="ag-tipo">' + esc(e.tipo === 'feriado' ? t('fer_' + e.abrangencia) : t('ag_' + e.tipo)) + '</span><b>' + esc(e.titulo) + '</b>' +
          '<span class="meta">' + [e.fim ? esc(fmtDia(e.inicio, { day: 'numeric', month: 'short' }) + ' – ' + fmtDia(e.fim, { day: 'numeric', month: 'short' })) : '', esc(e.hora), esc(e.local)].filter(Boolean).join(' · ') + '</span></span>';
      }).join('');
      pop.hidden = false;
      var cx = b.closest('.cal').getBoundingClientRect(), r = b.getBoundingClientRect();
      var w = pop.offsetWidth, x = r.left - cx.left + r.width / 2 - w / 2;
      x = Math.max(0, Math.min(x, cx.width - w));
      var y = r.bottom - cx.top + 8;
      if (r.bottom + pop.offsetHeight + 16 > window.innerHeight && r.top - cx.top - pop.offsetHeight - 8 > 0) y = r.top - cx.top - pop.offsetHeight - 8;
      pop.style.left = x + 'px'; pop.style.top = y + 'px';
    }
    function esconderPop() { if (!fixo) pop.hidden = true; }
    dias.addEventListener('mouseover', function (e) { var b = e.target.closest('.cal-dia.tem'); if (b && !fixo) mostrarPop(b); });
    dias.addEventListener('mouseleave', esconderPop);
    dias.addEventListener('focusin', function (e) { var b = e.target.closest('.cal-dia.tem'); if (b) mostrarPop(b); else if (!fixo) pop.hidden = true; });
    dias.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dia]'); if (!b) return;
      estadoAg.dia = b.getAttribute('data-dia'); desenharAgenda();
      var nb = dias.querySelector('[data-dia="' + estadoAg.dia + '"]');
      if (nb && nb.classList.contains('tem')) { fixo = true; mostrarPop(nb); nb.focus(); } else { fixo = false; pop.hidden = true; }
    });
    document.addEventListener('click', function fora(e) {
      if (!document.body.contains(dias)) { document.removeEventListener('click', fora); return; }
      if (!e.target.closest('.cal-dia') && !e.target.closest('#cal-pop')) { fixo = false; pop.hidden = true; }
    });
    document.addEventListener('keydown', function esc2(e) {
      if (!document.body.contains(dias)) { document.removeEventListener('keydown', esc2); return; }
      if (e.key === 'Escape') { fixo = false; pop.hidden = true; }
    });
    ['cal-ant', 'cal-prox', 'cal-hoje'].forEach(function (id) { document.getElementById(id).addEventListener('click', function () { fixo = false; pop.hidden = true; }); });
    document.getElementById('ag-tipos').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tipo]'); if (!b) return;
      var k = b.getAttribute('data-tipo'); estadoAg.tipos[k] = !estadoAg.tipos[k];
      b.setAttribute('aria-pressed', String(estadoAg.tipos[k])); desenharAgenda();
    });
    desenharAgenda();
  }
  function desenharAgenda() {
    var m = estadoAg.mes, hoje = dIso(new Date());
    var comp = compromissos().filter(function (e) { return estadoAg.tipos[e.tipo]; });
    var todos = comp.concat(estadoAg.tipos.feriado ? feriadosEm(m) : []);
    var tm = m.toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', { month: 'long', year: 'numeric' });
    document.getElementById('cal-mes').textContent = tm.charAt(0).toUpperCase() + tm.slice(1);
    var semana = [];
    for (var w = 0; w < 7; w++) semana.push(new Date(2024, 0, 1 + w).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', { weekday: 'short' }).replace('.', ''));
    var primeiro = (m.getDay() + 6) % 7, nDias = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    var html = semana.map(function (s) { return '<span class="cal-sem" aria-hidden="true">' + esc(s) + '</span>'; }).join('');
    for (var v = 0; v < primeiro; v++) html += '<span class="cal-vazio"></span>';
    for (var d = 1; d <= nDias; d++) {
      var iso = dIso(new Date(m.getFullYear(), m.getMonth(), d));
      var evs = todos.filter(function (e) { return noDia(e, iso); }).sort(function (a, b) { return (a.tipo === 'feriado' ? 0 : 1) - (b.tipo === 'feriado' ? 0 : 1) || (a.hora || '').localeCompare(b.hora || ''); });
      var fer = evs.some(function (e) { return e.tipo === 'feriado' && e.abrangencia !== 'facultativo'; });
      var chips = evs.slice(0, 3).map(function (e) {
        var cheio = e.tipo === 'feriado' || e.fim || !e.hora;
        return '<span class="cal-ev' + (cheio ? ' cheio' : '') + (e.tipo === 'feriado' ? ' fer' + (e.abrangencia === 'facultativo' ? ' fac' : '') : '') + '" style="--cor:' + CORES_AG[e.tipo] + '">' +
          (cheio ? '' : '<i></i>' + esc((e.hora || '').split(/[–-]/)[0]) + ' ') + esc(e.titulo) + '</span>';
      }).join('');
      html += '<button type="button" class="cal-dia' + (iso === hoje ? ' hoje' : '') + (iso === estadoAg.dia ? ' sel' : '') + (evs.length ? ' tem' : '') + (fer ? ' feriado' : '') + '" data-dia="' + iso + '" aria-pressed="' + (iso === estadoAg.dia) + '"' +
        ' aria-label="' + esc(fmtDia(iso, { day: 'numeric', month: 'long' })) + (evs.length ? ': ' + esc(evs.map(function (e) { return e.titulo; }).join('; ')) : '') + '">' +
        '<span class="n">' + d + '</span>' + chips + (evs.length > 3 ? '<span class="cal-mais">+' + (evs.length - 3) + '</span>' : '') + '</button>';
    }
    document.getElementById('cal-dias').innerHTML = html;
    var doDia = todos.filter(function (e) { return noDia(e, estadoAg.dia); });
    document.getElementById('ag-dia-tit').textContent = fmtDia(estadoAg.dia, { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('ag-dia').innerHTML = doDia.length ? '<ul class="ag-lista">' + doDia.map(itemAgenda).join('') + '</ul>' : '<p class="vazio">' + t('ag_dia_vazio') + '</p>';
    var ps = comp.filter(function (e) { return (e.fim || e.inicio) >= hoje; }).slice(0, 6);
    var proxFer = feriadosEm(new Date()).filter(function (e) { return e.inicio >= hoje && e.abrangencia !== 'facultativo'; }).sort(function (a, b) { return a.inicio.localeCompare(b.inicio); })[0];
    document.getElementById('ag-prox').innerHTML = (ps.length ? '<ul class="ag-lista">' + ps.map(itemAgenda).join('') + '</ul>' : '<p class="vazio">' + t('ag_vazio') + '</p>') +
      (proxFer && estadoAg.tipos.feriado ? '<h3 style="font-size:1.05rem;margin-top:24px">' + t('ag_prox_fer') + '</h3><ul class="ag-lista">' + itemAgenda(proxFer) + '</ul>' : '');
  }


  /* =================== ÁREA DE MEMBROS (Supabase) =================== */
  var TM = {
    pt: {
      area: 'Área de membros', entrar: 'Entrar', criar: 'Criar conta', sair: 'Sair', email: 'E-mail', senha: 'Senha', nome: 'Nome completo',
      nivel: 'Nível', vinculo: 'Vínculo (pode marcar mais de um)', outro: 'Outro', qual: 'Qual instituição?', tema: 'Tema de pesquisa',
      lattes: 'Link do Lattes', orcid: 'ORCID (só o número)', researchgate: 'Link do ResearchGate', linkedin: 'Link do LinkedIn', scholar: 'Link do Google Acadêmico',
      ano_entrada: 'Ano de entrada no grupo', prev_curta: 'Defesa prevista', defesa_prevista: 'Defesa prevista (mês/ano) · visível só para você e a coordenação', defesa_data: 'Defesa realizada (mês/ano)',
      mostrar: 'Mostrar meu perfil na página pública Equipe', mostrar_x: 'Mostrar na página pública Equipe',
      senha_regra: 'Mínimo de 8 caracteres.', esqueci: 'Esqueci minha senha', enviar_link: 'Enviar link para redefinir', voltar_entrar: 'Voltar para entrar',
      nao_config: 'A área de membros ainda não foi ligada ao Supabase. Veja a seção "Área de membros" do LEIA-ME.',
      erro_conexao: 'Não foi possível conectar à área de membros agora. Tente de novo em instantes.',
      intro: 'Espaço interno do UNSEEL. Novos cadastros ficam aguardando aprovação da coordenação.',
      conta_criada: 'Conta criada! Seu cadastro agora aguarda a aprovação da coordenação.', confira_email: 'Conta criada! Confira seu e-mail para confirmar o cadastro e depois entre aqui.',
      link_enviado: 'Se houver uma conta com esse e-mail, você vai receber um link para criar uma nova senha.',
      nova_senha: 'Crie uma nova senha', salvar_senha: 'Salvar nova senha', senha_ok: 'Senha alterada.',
      pendente_tit: 'Cadastro aguardando aprovação', pendente: 'Recebemos seu cadastro. Assim que a coordenação aprovar, você terá acesso à área de membros. Enquanto isso, já pode completar seu perfil.',
      recusado: 'Seu cadastro não foi aprovado. Em caso de dúvida, fale com a coordenação do grupo.',
      concluido: 'Seu ciclo no UNSEEL foi concluído. Suas informações e sua trajetória continuam na página Equipe. Para corrigir algo, fale com a coordenação. Obrigado por fazer parte!',
      ola: 'Olá, ', meu_perfil: 'Meu perfil', membros: 'Membros', gestao: 'Equipe e permissões', externas: 'Pessoas sem conta',
      salvar: 'Salvar', salvo: 'Salvo.', salvando: 'Salvando…', cancelar: 'Cancelar', editar: 'Editar', apagar: 'Apagar', confirmar_apagar: 'Clique de novo para confirmar',
      foto: 'Foto', trocar_foto: 'Trocar foto', foto_dica: 'JPG, PNG ou WebP. A foto é reduzida automaticamente.', foto_ok: 'Foto atualizada.', foto_depois: 'Salve primeiro; depois você poderá enviar a foto.',
      sem_pendentes: 'Nenhum cadastro aguardando aprovação.', aguardando: 'Aguardando aprovação', aprovar: 'Aprovar', recusar: 'Recusar', todos_membros: 'Pessoas com conta',
      papel: 'Papel', situacao: 'Situação', permissoes: 'Pode cuidar de', membro: 'Membro', coordenacao: 'Coordenação',
      st_pendente: 'Pendente', st_aprovado: 'Ativo', st_recusado: 'Recusado', st_concluido: 'Concluído · acesso encerrado', st_ativo: 'Ativo', st_egresso: 'Egresso',
      perm_biblioteca: 'Biblioteca', perm_agenda: 'Agenda', perm_dados: 'Banco de dados', perm_equipe: 'Equipe', perm_projetos: 'Projetos', perm_noticias: 'Notícias',
      perm_dica: 'Escolha o que cada pessoa pode alterar no site: clique em uma área para liberar e clique de novo para retirar. Quem é da coordenação já tem acesso a tudo. A área "Equipe" também permite editar perfis e cadastrar pessoas sem conta, como egressos.',
      conc_dica: 'Quando alguém defender, mude a situação para "Concluído". A pessoa deixa de editar o site, mas o perfil continua público, entre os egressos. Depois, clique em Editar e informe a data da defesa.',
      desde: 'Cadastro em ', ad_pessoa: 'Adicionar pessoa', ext_intro: 'Egressos e outras pessoas que não têm conta no site. As informações aparecem na página Equipe e na linha do tempo.',
      sugestao_orcid: 'Sugestão do ORCID: ', usar: 'usar', erro: 'Algo deu errado: ', obrigatorio: 'Preencha nome, e-mail e senha.', nome_obrig: 'Preencha o nome.',
      atividades: 'Atividades', guia: 'Guia da coordenação', nova_atv: 'Nova atividade', editar_atv: 'Editar atividade', v_lista: 'Lista', v_quadro: 'Quadro', v_cal: 'Calendário',
      mostrar_de: 'Mostrar', f_minhas: 'Minhas atividades', f_todas: 'Todas do grupo', f_pessoa: 'De uma pessoa', busca_atv: 'Título, local…', sinc_bt: 'Ligar ao meu Google Agenda',
      falta_sql3: 'As atividades ainda não foram ligadas ao banco. Rode o arquivo supabase/etapa3.sql no Supabase (veja o LEIA-ME, seção 11).',
      st_a_fazer: 'A fazer', st_andamento: 'Em andamento', st_revisao: 'Em revisão', st_concluida: 'Concluída',
      prioridade: 'Prioridade', pr_baixa: 'Baixa', pr_normal: 'Normal', pr_alta: 'Alta', pr_urgente: 'Urgente',
      a_tipo: 'Tipo', ta_tarefa: 'Tarefa', ta_reuniao: 'Reunião', ta_prazo: 'Prazo / entrega', ta_viagem: 'Viagem / campo', ta_organizado: 'Evento que organizamos', ta_participacao: 'Evento em que participamos', ta_outro: 'Outro',
      responsavel: 'Responsável', resp_dica: 'Para incluir colegas, marque em Participantes.', participantes: 'Participantes', ph_parts: 'Digite @ ou o nome para marcar alguém', dica_parts: 'Quem for marcado vê a atividade em "Minhas atividades".',
      ninguem: 'Ninguém marcado ainda.', tirar: 'Tirar',
      a_titulo: 'O que vai ser feito', ph_titulo: 'Ex.: Escrever o capítulo 3', a_inicio: 'Data', a_fim: 'Até (se durar vários dias)', a_hi: 'Começa às', a_hf: 'Termina às',
      a_local: 'Local', ph_local: 'Sala, cidade ou "online"', a_meet: 'Link do Google Meet', criar_meet: 'Criar reunião no Meet', dica_meet: 'O botão abre o Meet numa nova aba com a sua conta Google. Copie o link da reunião e cole no campo ao lado.',
      a_desc: 'Detalhes', ph_desc: 'Anotações, combinados… Use @ para citar alguém.', a_publico: 'Mostrar na agenda pública do site (título, data, horário, local e detalhes)',
      obrig_atv: 'Preencha o que vai ser feito e a data.', no_site: 'No site', quando: 'Quando', criado_por: 'Criada por', entrar_meet: 'Entrar no Meet', add_google: 'Adicionar ao Google Agenda',
      anexos: 'Anexos', anexar_arq: 'Anexar arquivo', anexar_link: 'Anexar link', dica_anexo: 'Arquivos até 10 MB. Para arquivos maiores, coloque no Google Drive e anexe o link.', ph_link_nome: 'Nome (ex.: Planilha de campo)',
      arq_grande: 'Arquivo maior que 10 MB. Coloque no Google Drive e anexe o link.', enviando: 'Enviando…', sem_anexos: 'Nenhum anexo.',
      comentarios: 'Comentários', ph_com: 'Escreva um comentário. Digite @ para marcar alguém.', enviar: 'Enviar', sem_com: 'Nenhum comentário ainda.',
      g_atrasadas: 'Atrasadas', g_hoje: 'Hoje', g_semana: 'Próximos 7 dias', g_depois: 'Mais adiante', g_concluidas: 'Concluídas',
      vazio_minhas: 'Você ainda não tem atividades. Clique em "+ Nova atividade" para criar a primeira.', vazio: 'Nenhuma atividade encontrada.',
      dica_quadro: 'Arraste um cartão para outra coluna para mudar a situação. Clique para abrir.', dica_cal: 'Clique num dia vazio para criar uma atividade nessa data. As cores indicam o responsável.', clique_dia: 'Clique para criar uma atividade neste dia',
      sinc_tit: 'Ver as atividades no seu Google Agenda', sinc_lead: 'O caminho é só um: o que for criado aqui no site aparece no seu Google Agenda. O que está na sua agenda pessoal continua só seu e não vem para o site.',
      sinc_minhas: 'Link das minhas atividades (as que sou responsável ou fui marcada/o)', sinc_todas: 'Link de todas as atividades do grupo (só a coordenação vê este)',
      sinc_p1: 'Clique em <b>Copiar link</b>.', sinc_p2: 'Abra o Google Agenda no computador, na tela de adicionar agenda por URL:', sinc_abrir: 'Abrir o Google Agenda',
      sinc_p3: 'Cole o link no campo <b>URL da agenda</b> e clique em <b>Adicionar agenda</b>.', sinc_p4: 'Pronto. Uma agenda chamada <b>UNSEEL · minhas atividades</b> aparece na lista "Outras agendas" e também no celular.',
      sinc_obs: 'O Google atualiza essas agendas sozinho, de algumas em algumas horas. Para uma atividade aparecer na hora, abra a atividade e use o botão "Adicionar ao Google Agenda".',
      sinc_seg: 'Guarde o link só para você: quem tiver o link vê suas atividades.', sinc_novo: 'Gerar um link novo', sinc_novo_conf: 'Clique de novo: o link antigo vai parar de funcionar',
      guia_curto: 'Como fazer (só a coordenação vê estas instruções)', guia_lead: 'Passo a passo de tudo o que é tarefa da coordenação. Clique em um item para abrir as instruções.', guia_pessoas: 'Pessoas e permissões', guia_atv: 'Atividades e agenda',
      editar_de: 'Editar: '
    },
    en: {
      area: 'Members area', entrar: 'Sign in', criar: 'Create account', sair: 'Sign out', email: 'Email', senha: 'Password', nome: 'Full name',
      nivel: 'Level', vinculo: 'Affiliation (tick all that apply)', outro: 'Other', qual: 'Which institution?', tema: 'Research topic',
      lattes: 'Lattes link', orcid: 'ORCID (number only)', researchgate: 'ResearchGate link', linkedin: 'LinkedIn link', scholar: 'Google Scholar link',
      ano_entrada: 'Year joined the group', prev_curta: 'Expected defence', defesa_prevista: 'Expected defence (month/year) · visible only to you and the coordinator', defesa_data: 'Defence date (month/year)',
      mostrar: 'Show my profile on the public Team page', mostrar_x: 'Show on the public Team page',
      senha_regra: 'At least 8 characters.', esqueci: 'Forgot my password', enviar_link: 'Send reset link', voltar_entrar: 'Back to sign in',
      nao_config: 'The members area is not connected to Supabase yet. See the "Área de membros" section of the README.',
      erro_conexao: 'Could not reach the members area right now. Please try again shortly.',
      intro: "UNSEEL's internal space. New accounts wait for approval by the coordinator.",
      conta_criada: 'Account created! It now awaits approval by the coordinator.', confira_email: 'Account created! Check your email to confirm it, then sign in here.',
      link_enviado: 'If an account exists for this email, you will receive a link to set a new password.',
      nova_senha: 'Set a new password', salvar_senha: 'Save new password', senha_ok: 'Password changed.',
      pendente_tit: 'Awaiting approval', pendente: 'We received your registration. Once the coordinator approves it, you will have access. Meanwhile you can complete your profile.',
      recusado: 'Your registration was not approved. If in doubt, contact the group coordinator.',
      concluido: 'Your time at UNSEEL is complete. Your information and trajectory remain on the Team page. To correct anything, contact the coordinator. Thank you for being part of it!',
      ola: 'Hello, ', meu_perfil: 'My profile', membros: 'Members', gestao: 'Team & permissions', externas: 'People without an account',
      salvar: 'Save', salvo: 'Saved.', salvando: 'Saving…', cancelar: 'Cancel', editar: 'Edit', apagar: 'Delete', confirmar_apagar: 'Click again to confirm',
      foto: 'Photo', trocar_foto: 'Change photo', foto_dica: 'JPG, PNG or WebP. The photo is resized automatically.', foto_ok: 'Photo updated.', foto_depois: 'Save first; then you can upload the photo.',
      sem_pendentes: 'No registrations awaiting approval.', aguardando: 'Awaiting approval', aprovar: 'Approve', recusar: 'Decline', todos_membros: 'People with an account',
      papel: 'Role', situacao: 'Status', permissoes: 'Can manage', membro: 'Member', coordenacao: 'Coordinator',
      st_pendente: 'Pending', st_aprovado: 'Active', st_recusado: 'Declined', st_concluido: 'Completed · access closed', st_ativo: 'Active', st_egresso: 'Alumni',
      perm_biblioteca: 'Library', perm_agenda: 'Calendar', perm_dados: 'Database', perm_equipe: 'Team', perm_projetos: 'Projects', perm_noticias: 'News',
      perm_dica: 'Choose what each person can change on the site: click an area to grant it and click again to remove it. The coordinator already has access to everything. The "Team" area also allows editing profiles and adding people without an account, such as alumni.',
      conc_dica: 'When someone defends, change their status to "Completed". They can no longer edit the site, but their profile stays public, among the alumni. Then click Edit and enter the defence date.',
      desde: 'Registered on ', ad_pessoa: 'Add person', ext_intro: 'Alumni and other people without an account. Their information appears on the Team page and timeline.',
      sugestao_orcid: 'ORCID suggests: ', usar: 'use', erro: 'Something went wrong: ', obrigatorio: 'Please fill in name, email and password.', nome_obrig: 'Please fill in the name.',
      atividades: 'Activities', guia: "Coordinator's guide", nova_atv: 'New activity', editar_atv: 'Edit activity', v_lista: 'List', v_quadro: 'Board', v_cal: 'Calendar',
      mostrar_de: 'Show', f_minhas: 'My activities', f_todas: 'Whole group', f_pessoa: 'One person', busca_atv: 'Title, place…', sinc_bt: 'Connect to my Google Calendar',
      falta_sql3: 'Activities are not connected to the database yet. Run supabase/etapa3.sql in Supabase (see README, section 11).',
      st_a_fazer: 'To do', st_andamento: 'In progress', st_revisao: 'In review', st_concluida: 'Done',
      prioridade: 'Priority', pr_baixa: 'Low', pr_normal: 'Normal', pr_alta: 'High', pr_urgente: 'Urgent',
      a_tipo: 'Type', ta_tarefa: 'Task', ta_reuniao: 'Meeting', ta_prazo: 'Deadline', ta_viagem: 'Trip / fieldwork', ta_organizado: 'Event we organise', ta_participacao: 'Event we attend', ta_outro: 'Other',
      responsavel: 'Owner', resp_dica: 'To include colleagues, add them as Participants.', participantes: 'Participants', ph_parts: 'Type @ or a name to tag someone', dica_parts: 'Tagged people see the activity under "My activities".',
      ninguem: 'Nobody tagged yet.', tirar: 'Remove',
      a_titulo: 'What will be done', ph_titulo: 'E.g. Write chapter 3', a_inicio: 'Date', a_fim: 'Until (if it lasts several days)', a_hi: 'Starts at', a_hf: 'Ends at',
      a_local: 'Place', ph_local: 'Room, city or "online"', a_meet: 'Google Meet link', criar_meet: 'Create a Meet', dica_meet: 'The button opens Meet in a new tab with your Google account. Copy the meeting link and paste it in the field.',
      a_desc: 'Details', ph_desc: 'Notes, agreements… Use @ to mention someone.', a_publico: 'Show on the public calendar of the website (title, date, time, place and details)',
      obrig_atv: 'Please fill in what will be done and the date.', no_site: 'On website', quando: 'When', criado_por: 'Created by', entrar_meet: 'Join Meet', add_google: 'Add to Google Calendar',
      anexos: 'Attachments', anexar_arq: 'Attach file', anexar_link: 'Attach link', dica_anexo: 'Files up to 10 MB. For larger files, use Google Drive and attach the link.', ph_link_nome: 'Name (e.g. Field spreadsheet)',
      arq_grande: 'File larger than 10 MB. Put it on Google Drive and attach the link.', enviando: 'Uploading…', sem_anexos: 'No attachments.',
      comentarios: 'Comments', ph_com: 'Write a comment. Type @ to tag someone.', enviar: 'Send', sem_com: 'No comments yet.',
      g_atrasadas: 'Overdue', g_hoje: 'Today', g_semana: 'Next 7 days', g_depois: 'Later', g_concluidas: 'Done',
      vazio_minhas: 'You have no activities yet. Click "+ New activity" to create the first one.', vazio: 'No activities found.',
      dica_quadro: 'Drag a card to another column to change its status. Click to open.', dica_cal: 'Click an empty day to create an activity on that date. Colours show the owner.', clique_dia: 'Click to create an activity on this day',
      sinc_tit: 'See activities in your Google Calendar', sinc_lead: 'One way only: what is created here shows up in your Google Calendar. Your personal calendar stays private and never comes to the website.',
      sinc_minhas: 'Link to my activities (owned or tagged)', sinc_todas: 'Link to all group activities (coordinator only)',
      sinc_p1: 'Click <b>Copy link</b>.', sinc_p2: 'Open Google Calendar on a computer, on the "add calendar from URL" screen:', sinc_abrir: 'Open Google Calendar',
      sinc_p3: 'Paste the link in <b>URL of calendar</b> and click <b>Add calendar</b>.', sinc_p4: 'Done. A calendar called <b>UNSEEL · minhas atividades</b> appears under "Other calendars", on your phone too.',
      sinc_obs: 'Google refreshes these calendars on its own every few hours. For an activity to appear immediately, open it and use "Add to Google Calendar".',
      sinc_seg: 'Keep this link to yourself: anyone with it can see your activities.', sinc_novo: 'Generate a new link', sinc_novo_conf: 'Click again: the old link will stop working',
      guia_curto: 'How to (only the coordinator sees these instructions)', guia_lead: 'Step-by-step instructions for everything the coordinator does. Click an item to open it.', guia_pessoas: 'People and permissions', guia_atv: 'Activities and calendar',
      editar_de: 'Edit: '
    }
  };
  function tm(k) { return (TM[lang] && TM[lang][k]) || TM.pt[k] || k; }
  var PERMS = ['biblioteca', 'agenda', 'dados', 'equipe', 'projetos', 'noticias'];
  var sb = null, sbPromessa = null, perfilAtual = null, abaMembros = 'atividades', modoEntrar = 'entrar', recuperando = false;

  function carregarSupabase() {
    if (sb) return Promise.resolve(sb);
    if (sbPromessa) return sbPromessa;
    var cfg = D.membros || {};
    if (!/^https:\/\//.test(cfg.supabase_url || '') || !cfg.supabase_anon_key) return Promise.reject(new Error('config'));
    sbPromessa = new Promise(function (ok, falha) {
      function criar() {
        try {
          sb = window.supabase.createClient(cfg.supabase_url, cfg.supabase_anon_key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
          sb.auth.onAuthStateChange(function (evento) {
            if (evento === 'PASSWORD_RECOVERY') { recuperando = true; if (location.hash.indexOf('#/membros') !== 0) location.hash = '#/membros'; else iniciarMembros(); }
            if (evento === 'SIGNED_OUT') { perfilAtual = null; }
          });
          ok(sb);
        } catch (e) { falha(e); }
      }
      if (window.supabase && window.supabase.createClient) return criar();
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = criar;
      s.onerror = function () { sbPromessa = null; falha(new Error('script')); };
      document.head.appendChild(s);
    });
    return sbPromessa;
  }

  P.membros = function () {
    setTimeout(iniciarMembros, 0);
    return '<section class="secao membros"><p class="olho">UNSEEL</p><h1>' + tm('area') + '</h1>' +
      '<div id="m-area" aria-live="polite"><p class="meta">' + t('carregando') + '</p></div>' +
      '<dialog class="m-dialogo" id="m-dialogo"><div id="m-dialogo-in"></div></dialog></section>';
  };
  function caixa() { return document.getElementById('m-area'); }
  function aviso(msg, tipo, onde) {
    var el = (onde || document).querySelector('.m-aviso') || document.getElementById('m-aviso');
    if (el) { el.textContent = msg; el.className = 'm-aviso ' + (tipo || ''); el.hidden = !msg; }
  }
  function iniciarMembros() {
    if (!caixa()) return;
    carregarSupabase().then(function () { return sb.auth.getSession(); }).then(function (r) {
      var sessao = r && r.data && r.data.session;
      if (recuperando && sessao) return telaNovaSenha();
      if (!sessao) return telaEntrar();
      return carregarPerfil(sessao.user);
    }).catch(function (e) {
      caixa().innerHTML = '<p class="aviso">' + esc(e && e.message === 'config' ? tm('nao_config') : tm('erro_conexao')) + '</p>';
    });
  }

  /* ---- campos reutilizáveis ---- */
  var VINCULOS = ['Cemaden', 'UNESP', 'INPE'];
  function campoVinculo(px, atual) {
    var partes = String(atual || '').split(/\s*[·,;]\s*/).filter(Boolean);
    var outros = partes.filter(function (x) { return VINCULOS.indexOf(x) < 0; }).join(', ');
    return '<fieldset class="m-vinculo"><legend>' + tm('vinculo') + '</legend><div class="m-opcoes">' +
      VINCULOS.map(function (v) { return '<label class="m-check"><input type="checkbox" name="' + px + '-vinc" value="' + v + '"' + (partes.indexOf(v) >= 0 ? ' checked' : '') + '> ' + v + '</label>'; }).join('') +
      '<label class="m-check"><input type="checkbox" id="' + px + '-vinc-outro"' + (outros ? ' checked' : '') + '> ' + tm('outro') + '</label></div>' +
      '<input id="' + px + '-vinc-qual" placeholder="' + esc(tm('qual')) + '" value="' + esc(outros) + '"' + (outros ? '' : ' hidden') + '></fieldset>';
  }
  function ligarVinculo(px) {
    var cb = document.getElementById(px + '-vinc-outro'), qual = document.getElementById(px + '-vinc-qual');
    if (cb) cb.addEventListener('change', function () { qual.hidden = !cb.checked; if (cb.checked) qual.focus(); });
  }
  function lerVinculo(px) {
    var v = Array.prototype.map.call(document.querySelectorAll('input[name="' + px + '-vinc"]:checked'), function (x) { return x.value; });
    var cb = document.getElementById(px + '-vinc-outro'), qual = document.getElementById(px + '-vinc-qual');
    if (cb && cb.checked && qual.value.trim()) v.push(qual.value.trim());
    return v.join(' · ');
  }
  var NIVEIS_OPC = ['doutorado', 'mestrado', 'iniciacao', 'pesquisador', 'assistente', 'coordenacao'];
  function selNivel(id, atual) {
    var nv = t('nivel1');
    return '<select id="' + id + '"><option value="">—</option>' + NIVEIS_OPC.map(function (k) { return '<option value="' + k + '"' + (atual === k ? ' selected' : '') + '>' + esc(nv[k]) + '</option>'; }).join('') + '</select>';
  }
  function selAno(id, atual) {
    var h = new Date().getFullYear(), o = '<option value="">—</option>';
    for (var a = h + 1; a >= 2005; a--) o += '<option value="' + a + '"' + (String(atual) === String(a) ? ' selected' : '') + '>' + a + '</option>';
    return '<select id="' + id + '">' + o + '</select>';
  }
  function campo(id, rot, val, tipo, extra) { return '<label>' + rot + '<input id="' + id + '" type="' + (tipo || 'text') + '" value="' + esc(val || '') + '"' + (extra || '') + '></label>'; }
  function mesAno(v) { v = String(v || ''); return /^\d{4}-\d{2}/.test(v) ? v.slice(0, 7) : (/^\d{4}$/.test(v) ? v + '-01' : ''); }

  /* Formulário de pessoa (perfil próprio, edição pela coordenação ou pessoa sem conta) */
  function formPessoa(px, p, tipo) {   // tipo: 'proprio' | 'gestao' | 'externa'
    var sug = sugestaoOrcid(p.orcid);
    return '<div class="m-campos">' + campo(px + '-nome', tm('nome'), p.nome) + '<label>' + tm('nivel') + selNivel(px + '-nivel', p.nivel) + '</label>' +
      campoVinculo(px, p.vinculo) + campo(px + '-tema', tm('tema'), p.tema) +
      '<label>' + tm('ano_entrada') + selAno(px + '-entrada', p.ano_entrada) + (sug && sug.inicio && !p.ano_entrada ? '<small>' + tm('sugestao_orcid') + sug.inicio + ' <button type="button" class="m-link" data-usar="' + px + '-entrada" data-valor="' + sug.inicio + '">' + tm('usar') + '</button></small>' : '') + '</label>' +
      (tipo !== 'externa' ? campo(px + '-prevista', tm('defesa_prevista'), mesAno(p.defesa_prevista), 'month') : '') +
      (tipo !== 'proprio' ? campo(px + '-defesa', tm('defesa_data'), mesAno(p.defesa_data), 'month') : '') +
      (tipo === 'externa' ? '<label>' + tm('situacao') + '<select id="' + px + '-situacao"><option value="egresso"' + (p.situacao !== 'ativo' ? ' selected' : '') + '>' + tm('st_egresso') + '</option><option value="ativo"' + (p.situacao === 'ativo' ? ' selected' : '') + '>' + tm('st_ativo') + '</option></select></label>' : '') +
      campo(px + '-lattes', tm('lattes'), p.lattes, 'url') + campo(px + '-orcid', tm('orcid'), p.orcid) +
      campo(px + '-rg', tm('researchgate'), p.researchgate, 'url') + campo(px + '-li', tm('linkedin'), p.linkedin, 'url') + campo(px + '-gs', tm('scholar'), p.scholar, 'url') +
      '<label class="m-check m-largo"><input type="checkbox" id="' + px + '-mostrar"' + (p.mostrar_no_site === false ? '' : ' checked') + '> ' + (tipo === 'proprio' ? tm('mostrar') : tm('mostrar_x')) + '</label>' +
      '</div>';
  }
  function lerPessoa(px, tipo) {
    var v = function (id) { var el = document.getElementById(px + '-' + id); return el ? el.value.trim() : ''; };
    var d = { nome: v('nome'), nivel: v('nivel'), vinculo: lerVinculo(px), tema: v('tema'), ano_entrada: v('entrada') ? +v('entrada') : null,
      lattes: v('lattes'), orcid: v('orcid').replace('https://orcid.org/', ''), researchgate: v('rg'), linkedin: v('li'), scholar: v('gs'),
      mostrar_no_site: document.getElementById(px + '-mostrar').checked };
    if (tipo !== 'externa') d.defesa_prevista = v('prevista');
    if (tipo !== 'proprio') d.defesa_data = v('defesa');
    if (tipo === 'externa') d.situacao = v('situacao') || 'egresso';
    return d;
  }
  function ligarForm(px, raizEl) {
    ligarVinculo(px);
    (raizEl || document).querySelectorAll('[data-usar]').forEach(function (b) {
      b.addEventListener('click', function () { document.getElementById(b.getAttribute('data-usar')).value = b.getAttribute('data-valor'); b.parentNode.remove(); });
    });
  }
  function sugestaoOrcid(orcid) {
    var f = D.orcidFormacao && D.orcidFormacao[String(orcid || '').trim()];
    if (!f || !f.length) return null;
    var alvo = f.filter(function (x) { return /inpe|espaciais|unesp|estadual paulista|cemaden/i.test(x.instituicao || ''); });
    alvo = (alvo.length ? alvo : f).slice().sort(function (a, b) { return (b.inicio || 0) - (a.inicio || 0); })[0];
    return alvo || null;
  }

  /* ---- entrar / criar conta ---- */
  function telaEntrar() {
    var criar = modoEntrar === 'criar', esqueci = modoEntrar === 'esqueci';
    caixa().innerHTML = '<p class="lead">' + tm('intro') + '</p>' +
      '<div class="m-cartao' + (criar ? ' largo' : '') + '">' +
      (esqueci ? '' : '<div class="abas" role="tablist"><button type="button" role="tab" data-modo="entrar" aria-selected="' + !criar + '">' + tm('entrar') + '</button><button type="button" role="tab" data-modo="criar" aria-selected="' + criar + '">' + tm('criar') + '</button></div>') +
      '<form id="m-form" class="m-form" novalidate>' +
      (criar ? campo('c-nome', tm('nome'), '', 'text', ' autocomplete="name" required') : '') +
      campo('m-email', tm('email'), '', 'email', ' autocomplete="email" required') +
      (esqueci ? '' : '<label>' + tm('senha') + '<input id="m-senha" type="password" minlength="8" autocomplete="' + (criar ? 'new-password' : 'current-password') + '" required>' + (criar ? '<small>' + tm('senha_regra') + '</small>' : '') + '</label>') +
      (criar ? '<label>' + tm('nivel') + selNivel('c-nivel', '') + '</label>' + campoVinculo('c', '') +
        '<div class="m-dupla"><label>' + tm('ano_entrada') + selAno('c-entrada', '') + '</label>' + campo('c-prevista', tm('defesa_prevista'), '', 'month') + '</div>' +
        campo('c-li', tm('linkedin'), '', 'url') + campo('c-gs', tm('scholar'), '', 'url') : '') +
      '<p id="m-aviso" class="m-aviso" hidden></p>' +
      '<button type="submit" class="botao">' + (esqueci ? tm('enviar_link') : criar ? tm('criar') : tm('entrar')) + '</button>' +
      (esqueci ? '<button type="button" class="m-link" data-modo="entrar">' + tm('voltar_entrar') + '</button>' : (!criar ? '<button type="button" class="m-link" data-modo="esqueci">' + tm('esqueci') + '</button>' : '')) +
      '</form></div>';
    caixa().querySelectorAll('[data-modo]').forEach(function (b) { b.addEventListener('click', function () { modoEntrar = b.getAttribute('data-modo'); telaEntrar(); }); });
    if (criar) ligarVinculo('c');
    document.getElementById('m-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('m-email').value.trim();
      var btn = e.target.querySelector('[type=submit]'); btn.disabled = true;
      var fim = function () { btn.disabled = false; };
      if (esqueci) {
        sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + '#/membros' }).then(function () { aviso(tm('link_enviado'), 'ok'); fim(); });
        return;
      }
      var senha = document.getElementById('m-senha').value;
      if (criar) {
        var nome = document.getElementById('c-nome').value.trim();
        if (!nome || !email || senha.length < 8) { aviso(tm('obrigatorio') + ' ' + tm('senha_regra'), 'erro'); fim(); return; }
        var extras = { ano_entrada: document.getElementById('c-entrada').value ? +document.getElementById('c-entrada').value : null, defesa_prevista: document.getElementById('c-prevista').value, linkedin: document.getElementById('c-li').value.trim(), scholar: document.getElementById('c-gs').value.trim() };
        sb.auth.signUp({ email: email, password: senha, options: { data: { nome: nome, nivel: document.getElementById('c-nivel').value, vinculo: lerVinculo('c') }, emailRedirectTo: location.origin + location.pathname + '#/membros' } })
          .then(function (r) {
            fim();
            if (r.error) return aviso(tm('erro') + r.error.message, 'erro');
            if (r.data && r.data.session) {
              aviso(tm('conta_criada'), 'ok');
              sb.from('perfis').update(extras).eq('id', r.data.user.id).then(function () { setTimeout(iniciarMembros, 700); });
            } else aviso(tm('confira_email'), 'ok');
          });
      } else {
        sb.auth.signInWithPassword({ email: email, password: senha }).then(function (r) {
          fim();
          if (r.error) return aviso(tm('erro') + r.error.message, 'erro');
          iniciarMembros();
        });
      }
    });
  }

  function telaNovaSenha() {
    caixa().innerHTML = '<div class="m-cartao"><h2>' + tm('nova_senha') + '</h2><form id="m-form" class="m-form">' +
      '<label>' + tm('senha') + '<input id="m-senha" type="password" minlength="8" autocomplete="new-password" required><small>' + tm('senha_regra') + '</small></label>' +
      '<p id="m-aviso" class="m-aviso" hidden></p><button type="submit" class="botao">' + tm('salvar_senha') + '</button></form></div>';
    document.getElementById('m-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var s = document.getElementById('m-senha').value;
      if (s.length < 8) return aviso(tm('senha_regra'), 'erro');
      sb.auth.updateUser({ password: s }).then(function (r) {
        if (r.error) return aviso(tm('erro') + r.error.message, 'erro');
        recuperando = false; aviso(tm('senha_ok'), 'ok'); setTimeout(iniciarMembros, 900);
      });
    });
  }

  function carregarPerfil(user) {
    return sb.from('perfis').select('*').eq('id', user.id).maybeSingle().then(function (r) {
      if (r.error) throw r.error;
      perfilAtual = r.data || { id: user.id, email: user.email, nome: '', status: 'pendente', papel: 'membro', permissoes: [] };
      telaPainel();
    }).catch(function (e) { caixa().innerHTML = '<p class="aviso">' + esc(tm('erro') + (e.message || e)) + '</p>'; });
  }
  function fotoPerfil(p, grande) {
    var f = url(p.foto_url);
    return '<div class="avatar' + (grande ? ' grande' : '') + '" style="--cor:' + corPessoa(p.id) + '" aria-hidden="true">' + (f ? '<img src="' + f + '" alt="">' : iniciais(p.nome || p.email || '?')) + '</div>';
  }
  function souCoord() { return perfilAtual && perfilAtual.papel === 'coordenacao' && perfilAtual.status === 'aprovado'; }
  function posso(perm) { return souCoord() || (perfilAtual && perfilAtual.status === 'aprovado' && (perfilAtual.permissoes || []).indexOf(perm) >= 0); }

  function telaPainel() {
    var p = perfilAtual, aprovado = p.status === 'aprovado';
    var simples = function (msg) {
      caixa().innerHTML = '<div class="m-topo">' + fotoPerfil(p) + '<div><strong>' + esc(p.nome || p.email) + '</strong><span class="meta">' + esc(p.email) + '</span></div><button type="button" class="botao contorno" id="m-sair">' + tm('sair') + '</button></div><div class="aviso">' + msg + '</div>';
      document.getElementById('m-sair').addEventListener('click', sair);
    };
    if (p.status === 'recusado') return simples(tm('recusado'));
    if (p.status === 'concluido') return simples(tm('concluido'));
    var abas = [];
    if (aprovado) abas.push(['atividades', tm('atividades')]);
    abas.push(['perfil', tm('meu_perfil')]);
    if (aprovado) abas.push(['membros', tm('membros')]);
    if (posso('equipe')) { abas.push(['gestao', tm('gestao') + ' <span class="m-badge" id="m-qtd"></span>']); abas.push(['externas', tm('externas')]); }
    if (souCoord()) abas.push(['guia', tm('guia')]);
    if (!abas.some(function (a) { return a[0] === abaMembros; })) abaMembros = aprovado ? 'atividades' : 'perfil';
    var perms = (p.permissoes || []).map(function (x) { return tm('perm_' + x); });
    caixa().innerHTML = '<div class="m-topo">' + fotoPerfil(p) + '<div><strong>' + esc(tm('ola') + (p.nome || p.email)) + '</strong><span class="meta">' +
      esc([souCoord() ? tm('coordenacao') : tm('membro'), perms.join(', '), p.email].filter(Boolean).join(' · ')) + '</span></div>' +
      '<button type="button" class="botao contorno" id="m-sair">' + tm('sair') + '</button></div>' +
      (!aprovado ? '<div class="aviso m-pendente"><strong>' + tm('pendente_tit') + '</strong><br>' + tm('pendente') + '</div>' : '') +
      '<div class="abas" role="tablist">' + abas.map(function (a) { return '<button type="button" role="tab" data-aba-m="' + a[0] + '" aria-selected="' + (abaMembros === a[0]) + '">' + a[1] + '</button>'; }).join('') + '</div>' +
      '<div id="m-corpo"></div>';
    document.getElementById('m-sair').addEventListener('click', sair);
    caixa().querySelectorAll('[data-aba-m]').forEach(function (b) { b.addEventListener('click', function () { abaMembros = b.getAttribute('data-aba-m'); telaPainel(); }); });
    if (posso('equipe')) contarPendentes();
    ({ atividades: telaAtividades, perfil: telaPerfil, membros: telaMembros, gestao: telaGestao, externas: telaExternas, guia: telaGuia }[abaMembros] || telaPerfil)();
  }
  function sair() { sb.auth.signOut().then(function () { perfilAtual = null; modoEntrar = 'entrar'; iniciarMembros(); }); }

  function telaPerfil() {
    var p = perfilAtual;
    document.getElementById('m-corpo').innerHTML = '<form id="m-perfil" class="m-form m-perfil">' +
      '<div class="m-foto">' + fotoPerfil(p, true) + '<label class="botao contorno m-arquivo">' + tm('trocar_foto') + '<input id="m-foto" type="file" accept="image/jpeg,image/png,image/webp"></label><small>' + tm('foto_dica') + '</small></div>' +
      '<div>' + formPessoa('p', p, 'proprio') + '<p id="m-aviso" class="m-aviso" hidden></p><button type="submit" class="botao" style="margin-top:14px">' + tm('salvar') + '</button></div></form>';
    ligarForm('p');
    document.getElementById('m-foto').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      enviarFoto(f, p.id + '/perfil.jpg', 'perfis', p.id).then(function (np) { if (np) { perfilAtual = np; telaPainel(); aviso(tm('foto_ok'), 'ok'); } });
    });
    document.getElementById('m-perfil').addEventListener('submit', function (e) {
      e.preventDefault();
      aviso(tm('salvando'));
      sb.from('perfis').update(lerPessoa('p', 'proprio')).eq('id', p.id).select().single().then(function (r) {
        if (r.error) return aviso(tm('erro') + r.error.message, 'erro');
        perfilAtual = r.data; aviso(tm('salvo'), 'ok');
      });
    });
  }

  function reduzirFoto(arquivo) {
    return new Promise(function (ok, falha) {
      var img = new Image(), u = URL.createObjectURL(arquivo);
      img.onload = function () {
        var lado = 480, w = img.naturalWidth, h = img.naturalHeight, s = Math.min(w, h);
        var c = document.createElement('canvas'); c.width = lado; c.height = lado;
        c.getContext('2d').drawImage(img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, lado, lado);
        URL.revokeObjectURL(u);
        c.toBlob(function (b) { b ? ok(b) : falha(new Error('foto')); }, 'image/jpeg', 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(u); falha(new Error('foto')); };
      img.src = u;
    });
  }
  function enviarFoto(arquivo, caminhoFoto, tabela, id) {
    aviso(tm('salvando'));
    return reduzirFoto(arquivo).then(function (blob) {
      return sb.storage.from('fotos').upload(caminhoFoto, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '60' });
    }).then(function (r) {
      if (r.error) throw r.error;
      var pub = sb.storage.from('fotos').getPublicUrl(caminhoFoto).data.publicUrl + '?v=' + Date.now();
      return sb.from(tabela).update({ foto_url: pub }).eq('id', id).select().single();
    }).then(function (r) {
      if (r.error) throw r.error;
      return r.data;
    }).catch(function (e) { aviso(tm('erro') + (e.message || e), 'erro'); return null; });
  }

  function linksPerfil(m) { return linksPessoa(m); }
  function telaMembros() {
    var alvo = document.getElementById('m-corpo');
    alvo.innerHTML = '<p class="meta">' + t('carregando') + '</p>';
    sb.from('perfis').select('id,nome,email,foto_url,nivel,vinculo,tema,lattes,orcid,researchgate,linkedin,scholar,papel,permissoes').eq('status', 'aprovado').order('nome').then(function (r) {
      if (r.error) { alvo.innerHTML = '<p class="aviso">' + esc(tm('erro') + r.error.message) + '</p>'; return; }
      alvo.innerHTML = '<div class="grade">' + r.data.map(function (m) {
        var extra = [t('nivel1')[m.nivel] || '', m.papel === 'coordenacao' ? tm('coordenacao') : ''].concat((m.permissoes || []).map(function (x) { return tm('perm_' + x); })).filter(Boolean).join(' · ');
        return '<div class="cartao pessoa">' + fotoPerfil(m) + '<div><h3>' + esc(m.nome || m.email) + '</h3>' +
          '<p class="meta">' + esc(extra) + '</p>' + (m.vinculo ? '<p class="meta">' + esc(m.vinculo) + '</p>' : '') + (m.tema ? '<p class="meta">' + esc(m.tema) + '</p>' : '') +
          '<p class="meta"><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a></p>' + linksPerfil(m) + '</div></div>';
      }).join('') + '</div>';
    });
  }

  function contarPendentes() {
    sb.from('perfis').select('id', { count: 'exact', head: true }).eq('status', 'pendente').then(function (r) {
      var el = document.getElementById('m-qtd'); if (el && r.count) el.textContent = r.count;
    });
  }

  /* ---- gestão: aprovação, papéis, situação, permissões ---- */
  var listaGestao = [];
  function telaGestao() {
    var alvo = document.getElementById('m-corpo'), coord = souCoord();
    alvo.innerHTML = '<p class="meta">' + t('carregando') + '</p>';
    sb.from('perfis').select('*').order('nome').then(function (r) {
      if (r.error) { alvo.innerHTML = '<p class="aviso">' + esc(tm('erro') + r.error.message) + '</p>'; return; }
      listaGestao = r.data;
      var pend = r.data.filter(function (x) { return x.status === 'pendente'; });
      var outros = r.data.filter(function (x) { return x.status !== 'pendente'; });
      var pendHtml = pend.map(function (m) {
        return '<li class="m-pend">' + fotoPerfil(m) + '<div class="m-pend-info"><strong>' + esc(m.nome || '—') + '</strong><span class="meta">' + esc(m.email) + '</span>' +
          '<span class="meta">' + esc([t('nivel1')[m.nivel] || '', m.vinculo, m.ano_entrada ? tm('ano_entrada') + ': ' + m.ano_entrada : ''].filter(Boolean).join(' · ')) + '</span><span class="meta">' + tm('desde') + dataFmt(String(m.criado_em).slice(0, 10)) + '</span></div>' +
          '<div class="m-acoes">' + (coord ? '<button type="button" class="botao" data-acao="aprovar" data-id="' + esc(m.id) + '">' + tm('aprovar') + '</button><button type="button" class="botao contorno" data-acao="recusar" data-id="' + esc(m.id) + '">' + tm('recusar') + '</button>' : '') +
          '<button type="button" class="botao contorno" data-editar="' + esc(m.id) + '">' + tm('editar') + '</button></div></li>';
      }).join('');
      var cartao = function (m) {
        var eu = m.id === perfilAtual.id, dis = (!coord || eu) ? ' disabled' : '';
        return '<li class="m-gest">' + fotoPerfil(m) + '<div class="m-gest-info"><strong>' + esc(m.nome || '—') + '</strong><span class="meta">' + esc(m.email) + '</span>' +
          (m.defesa_prevista ? '<span class="meta">' + tm('prev_curta') + ': ' + esc(String(m.defesa_prevista).slice(5, 7) + '/' + String(m.defesa_prevista).slice(0, 4)) + '</span>' : '') +
          '<div class="m-gest-ctrl"><label>' + tm('papel') + '<select data-campo="papel" data-id="' + esc(m.id) + '"' + dis + '><option value="membro"' + (m.papel === 'membro' ? ' selected' : '') + '>' + tm('membro') + '</option><option value="coordenacao"' + (m.papel === 'coordenacao' ? ' selected' : '') + '>' + tm('coordenacao') + '</option></select></label>' +
          '<label>' + tm('situacao') + '<select data-campo="status" data-id="' + esc(m.id) + '"' + dis + '>' + ['aprovado', 'concluido', 'pendente', 'recusado'].map(function (s) { return '<option value="' + s + '"' + (m.status === s ? ' selected' : '') + '>' + tm('st_' + s) + '</option>'; }).join('') + '</select></label></div>' +
          (m.papel !== 'coordenacao' && m.status === 'aprovado' ? '<div class="m-perms" role="group" aria-label="' + esc(tm('permissoes')) + '"><span class="meta">' + tm('permissoes') + ':</span>' + PERMS.map(function (pm) {
            var on = (m.permissoes || []).indexOf(pm) >= 0;
            return '<button type="button" class="m-perm" data-perm="' + pm + '" data-id="' + esc(m.id) + '" aria-pressed="' + on + '"' + (coord ? '' : ' disabled') + '>' + tm('perm_' + pm) + '</button>';
          }).join('') + '</div>' : '') + '</div>' +
          '<button type="button" class="botao contorno" data-editar="' + esc(m.id) + '">' + tm('editar') + '</button></li>';
      };
      alvo.innerHTML = '<p id="m-aviso" class="m-aviso" hidden></p>' + (coord ? guiaCoord(['aprovar', 'permissoes', 'concluir', 'editar']) : '') +
        '<h2 style="font-size:1.3rem">' + tm('aguardando') + '</h2>' + (pend.length ? '<ul class="m-lista">' + pendHtml + '</ul>' : '<p class="vazio">' + tm('sem_pendentes') + '</p>') +
        '<h2 style="font-size:1.3rem;margin-top:36px">' + tm('todos_membros') + '</h2>' +
        '<ul class="m-lista">' + outros.map(cartao).join('') + '</ul>';
      alvo.querySelectorAll('[data-acao]').forEach(function (b) { b.addEventListener('click', function () { mudarPerfil(b.getAttribute('data-id'), { status: b.getAttribute('data-acao') === 'aprovar' ? 'aprovado' : 'recusado' }); }); });
      alvo.querySelectorAll('select[data-campo]').forEach(function (s) { s.addEventListener('change', function () { var d = {}; d[s.getAttribute('data-campo')] = s.value; mudarPerfil(s.getAttribute('data-id'), d); }); });
      alvo.querySelectorAll('[data-perm]').forEach(function (b) {
        b.addEventListener('click', function () {
          var m = listaGestao.find(function (x) { return x.id === b.getAttribute('data-id'); }), pm = b.getAttribute('data-perm');
          var lista = (m.permissoes || []).slice(), k = lista.indexOf(pm);
          if (k >= 0) lista.splice(k, 1); else lista.push(pm);
          mudarPerfil(m.id, { permissoes: lista });
        });
      });
      alvo.querySelectorAll('[data-editar]').forEach(function (b) { b.addEventListener('click', function () { editarPessoa('perfis', listaGestao.find(function (x) { return x.id === b.getAttribute('data-editar'); })); }); });
    });
  }
  function mudarPerfil(id, dados) {
    sb.from('perfis').update(dados).eq('id', id).then(function (r) {
      if (r.error) return aviso(tm('erro') + r.error.message, 'erro');
      if (id === perfilAtual.id) return carregarPerfil({ id: id, email: perfilAtual.email });
      telaPainel();
    });
  }

  /* ---- pessoas sem conta ---- */
  var listaExternas = [];
  function telaExternas() {
    var alvo = document.getElementById('m-corpo');
    alvo.innerHTML = '<p class="meta">' + t('carregando') + '</p>';
    sb.from('pessoas_externas').select('*').order('nome').then(function (r) {
      if (r.error) { alvo.innerHTML = '<p class="aviso">' + esc(tm('erro') + r.error.message) + '</p>'; return; }
      listaExternas = r.data;
      alvo.innerHTML = (souCoord() ? guiaCoord(['externas']) : '') + '<p class="meta">' + tm('ext_intro') + '</p><p><button type="button" class="botao" id="m-nova">+ ' + tm('ad_pessoa') + '</button></p>' +
        '<ul class="m-lista">' + r.data.map(function (m) {
          return '<li class="m-pend">' + fotoPerfil(m) + '<div class="m-pend-info"><strong>' + esc(m.nome) + '</strong>' +
            '<span class="meta">' + esc([t('nivel1')[m.nivel] || '', tm('st_' + m.situacao), m.ano_entrada ? '↳ ' + m.ano_entrada : '', m.defesa_data ? '🎓 ' + String(m.defesa_data).slice(0, 4) : ''].filter(Boolean).join(' · ')) + '</span>' +
            (m.vinculo ? '<span class="meta">' + esc(m.vinculo) + '</span>' : '') + '</div>' +
            '<div class="m-acoes"><button type="button" class="botao contorno" data-editar-x="' + esc(m.id) + '">' + tm('editar') + '</button></div></li>';
        }).join('') + '</ul>';
      document.getElementById('m-nova').addEventListener('click', function () { editarPessoa('pessoas_externas', { nome: '', situacao: 'egresso', mostrar_no_site: true }); });
      alvo.querySelectorAll('[data-editar-x]').forEach(function (b) { b.addEventListener('click', function () { editarPessoa('pessoas_externas', listaExternas.find(function (x) { return x.id === b.getAttribute('data-editar-x'); })); }); });
    });
  }

  /* ---- janela de edição (perfil de outra pessoa ou pessoa sem conta) ---- */
  function editarPessoa(tabela, p) {
    var dlg = document.getElementById('m-dialogo'), dentro = document.getElementById('m-dialogo-in');
    var externa = tabela === 'pessoas_externas', novo = externa && !p.id;
    dentro.innerHTML = '<form id="e-form" class="m-form"><div class="m-dlg-topo"><h2>' + esc(novo ? tm('ad_pessoa') : tm('editar_de') + (p.nome || p.email || '')) + '</h2><button type="button" class="visor-x" data-fechar aria-label="' + esc(tm('cancelar')) + '">×</button></div>' +
      (novo ? '' : '<div class="m-foto m-foto-linha">' + fotoPerfil(p) + '<label class="botao contorno m-arquivo">' + tm('trocar_foto') + '<input id="e-foto" type="file" accept="image/jpeg,image/png,image/webp"></label></div>') +
      formPessoa('e', p, externa ? 'externa' : 'gestao') +
      '<p class="m-aviso" hidden></p><div class="m-acoes"><button type="submit" class="botao">' + tm('salvar') + '</button><button type="button" class="botao contorno" data-fechar>' + tm('cancelar') + '</button>' +
      (externa && !novo ? '<button type="button" class="m-link m-perigo" id="e-apagar">' + tm('apagar') + '</button>' : '') + '</div>' +
      (novo ? '<p class="meta">' + tm('foto_depois') + '</p>' : '') + '</form>';
    ligarForm('e', dentro);
    dentro.querySelectorAll('[data-fechar]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    var recarregar = function () { dlg.close(); telaPainel(); };
    var fotoInput = document.getElementById('e-foto');
    if (fotoInput) fotoInput.addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      enviarFoto(f, (externa ? 'externos/' + p.id : p.id) + '/perfil.jpg', tabela, p.id).then(function (np) { if (np) { aviso(tm('foto_ok'), 'ok', dentro); p.foto_url = np.foto_url; dentro.querySelector('.m-foto .avatar').outerHTML = fotoPerfil(np); } });
    });
    var apagar = document.getElementById('e-apagar'), confirmar = false;
    if (apagar) apagar.addEventListener('click', function () {
      if (!confirmar) { confirmar = true; apagar.textContent = tm('confirmar_apagar'); return; }
      sb.from(tabela).delete().eq('id', p.id).then(function (r) { if (r.error) return aviso(tm('erro') + r.error.message, 'erro', dentro); recarregar(); });
    });
    document.getElementById('e-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var d = lerPessoa('e', externa ? 'externa' : 'gestao');
      if (!d.nome) return aviso(tm('nome_obrig'), 'erro', dentro);
      aviso(tm('salvando'), '', dentro);
      var op = novo ? sb.from(tabela).insert(d).select().single() : sb.from(tabela).update(d).eq('id', p.id).select().single();
      op.then(function (r) {
        if (r.error) return aviso(tm('erro') + r.error.message, 'erro', dentro);
        if (novo) { editarPessoa(tabela, r.data); aviso(tm('salvo'), 'ok', dentro); return; }
        recarregar();
      });
    });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }

  /* =================== ATIVIDADES (estilo ClickUp) =================== */
  var ST_ATV = ['a_fazer', 'andamento', 'revisao', 'concluida'];
  var COR_ST = { a_fazer: '#6B7A8C', andamento: '#176F80', revisao: '#C9A227', concluida: '#427568' };
  var PRIO = ['baixa', 'normal', 'alta', 'urgente'];
  var TIPOS_ATV = ['tarefa', 'reuniao', 'prazo', 'viagem', 'organizado', 'participacao', 'outro'];
  var atv = { lista: [], pessoas: [], vista: 'lista', filtro: 'minhas', mes: null, busca: '' };
  function eu() { return perfilAtual && perfilAtual.id; }
  var CORES_CAL = ['#176F80', '#9A6200', '#6B4E9B', '#A0412D', '#2F7D4F', '#2F5E86', '#A8336E', '#13294B'];
  function corCal(id) { var k = atv.pessoas.findIndex(function (p) { return p.id === id; }); return k < 0 ? '#6B7A8C' : CORES_CAL[k % CORES_CAL.length]; }
  function pessoaAtv(id) { return atv.pessoas.find(function (p) { return p.id === id; }) || null; }
  function nomeCurto(p) { return p ? String(p.nome || p.email || '').split(' ')[0] : ''; }
  function minha(a) { return a.responsavel === eu() || (a.participantes || []).indexOf(eu()) >= 0; }
  function podeEditarAtv(a) { return souCoord() || a.responsavel === eu() || a.criado_por === eu() || (a.participantes || []).indexOf(eu()) >= 0; }
  function podeApagarAtv(a) { return souCoord() || a.responsavel === eu() || a.criado_por === eu(); }
  function hhmm(h) { return h ? String(h).slice(0, 5) : ''; }
  function quandoAtv(a) {
    var d = fmtDia(a.inicio, { weekday: 'short', day: 'numeric', month: 'short' });
    if (a.fim && a.fim !== a.inicio) d += ' – ' + fmtDia(a.fim, { day: 'numeric', month: 'short' });
    var h = hhmm(a.hora_inicio) + (a.hora_fim ? '–' + hhmm(a.hora_fim) : '');
    return d + (h ? ' · ' + h : '');
  }
  function miniAvatar(p, tit) {
    if (!p) return '';
    var f = url(p.foto_url);
    return '<span class="atv-av" style="--cor:' + corPessoa(p.id) + '" title="' + esc(tit || p.nome || '') + '">' + (f ? '<img src="' + f + '" alt="">' : esc(iniciais(p.nome || p.email || '?'))) + '</span>';
  }
  function avataresAtv(a) {
    var r = pessoaAtv(a.responsavel);
    var ps = (a.participantes || []).filter(function (id) { return id !== a.responsavel; }).map(pessoaAtv).filter(Boolean);
    return '<span class="atv-avs">' + miniAvatar(r, tm('responsavel') + ': ' + (r ? r.nome : '')) + ps.slice(0, 4).map(function (p) { return miniAvatar(p); }).join('') +
      (ps.length > 4 ? '<span class="atv-av mais">+' + (ps.length - 4) + '</span>' : '') + '</span>';
  }
  function pilulaSt(s) { return '<span class="atv-st" style="--cor:' + COR_ST[s] + '">' + esc(tm('st_' + s)) + '</span>'; }
  function bandeira(p) { return p === 'alta' || p === 'urgente' ? '<span class="atv-prio ' + p + '" title="' + esc(tm('prioridade') + ': ' + tm('pr_' + p)) + '">⚑ ' + esc(tm('pr_' + p)) + '</span>' : ''; }

  function carregarAtividades() {
    return Promise.all([
      sb.from('atividades').select('*').order('inicio').order('hora_inicio'),
      sb.from('perfis').select('id,nome,email,foto_url,papel').eq('status', 'aprovado').order('nome')
    ]).then(function (rs) {
      if (rs[0].error) throw rs[0].error;
      atv.lista = rs[0].data || []; atv.pessoas = rs[1].data || [];
    });
  }
  function filtradas() {
    var b = String(atv.busca || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return atv.lista.filter(function (a) {
      if (atv.filtro === 'minhas' && !minha(a)) return false;
      if (atv.filtro !== 'minhas' && atv.filtro !== 'todas' && a.responsavel !== atv.filtro && (a.participantes || []).indexOf(atv.filtro) < 0) return false;
      if (b && [a.titulo, a.descricao, a.local].join(' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf(b) < 0) return false;
      return true;
    });
  }

  function telaAtividades() {
    var alvo = document.getElementById('m-corpo');
    alvo.innerHTML = '<p class="meta">' + t('carregando') + '</p>';
    carregarAtividades().then(function () {
      if (!atv.mes) { var h = new Date(); atv.mes = new Date(h.getFullYear(), h.getMonth(), 1); }
      var opcPessoas = atv.pessoas.map(function (p) { return '<option value="' + esc(p.id) + '"' + (atv.filtro === p.id ? ' selected' : '') + '>' + esc(p.nome || p.email) + '</option>'; }).join('');
      alvo.innerHTML = (souCoord() ? guiaCoord(['atividades', 'comentar', 'publicar']) : '') +
        '<div class="atv-barra">' +
        '<button type="button" class="botao" id="atv-nova">+ ' + tm('nova_atv') + '</button>' +
        '<div class="atv-vistas" role="tablist">' + [['lista', tm('v_lista')], ['quadro', tm('v_quadro')], ['calendario', tm('v_cal')]].map(function (v) {
          return '<button type="button" role="tab" data-vista="' + v[0] + '" aria-selected="' + (atv.vista === v[0]) + '">' + v[1] + '</button>';
        }).join('') + '</div>' +
        '<label class="atv-filtro">' + tm('mostrar_de') + '<select id="atv-filtro"><option value="minhas"' + (atv.filtro === 'minhas' ? ' selected' : '') + '>' + tm('f_minhas') + '</option><option value="todas"' + (atv.filtro === 'todas' ? ' selected' : '') + '>' + tm('f_todas') + '</option><optgroup label="' + esc(tm('f_pessoa')) + '">' + opcPessoas + '</optgroup></select></label>' +
        '<label class="atv-filtro">' + t('buscar') + '<input type="search" id="atv-busca" value="' + esc(atv.busca) + '" placeholder="' + esc(tm('busca_atv')) + '"></label>' +
        '<button type="button" class="botao contorno atv-sinc-bt" id="atv-sinc">' + ICO_CAL + tm('sinc_bt') + '</button>' +
        '</div><div id="atv-corpo"></div>';
      document.getElementById('atv-nova').addEventListener('click', function () { formAtividade(null, {}); });
      document.getElementById('atv-sinc').addEventListener('click', abrirSincronizacao);
      alvo.querySelectorAll('[data-vista]').forEach(function (b) { b.addEventListener('click', function () { atv.vista = b.getAttribute('data-vista'); telaAtividades(); }); });
      document.getElementById('atv-filtro').addEventListener('change', function (e) { atv.filtro = e.target.value; desenharAtv(); });
      document.getElementById('atv-busca').addEventListener('input', function (e) { atv.busca = e.target.value; desenharAtv(); });
      desenharAtv();
    }).catch(function (e) {
      alvo.innerHTML = '<div class="aviso">' + esc(/atividades|relation|schema cache/i.test(e.message || '') ? tm('falta_sql3') : tm('erro') + (e.message || e)) + '</div>';
    });
  }
  var ICO_CAL = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zM5 9h14v10H5V9zm2 2v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/></svg>';

  function desenharAtv() {
    var c = document.getElementById('atv-corpo'); if (!c) return;
    var lista = filtradas();
    if (atv.vista === 'quadro') c.innerHTML = vistaQuadro(lista);
    else if (atv.vista === 'calendario') c.innerHTML = vistaCalendario(lista);
    else c.innerHTML = vistaLista(lista);
    c.querySelectorAll('[data-atv]').forEach(function (el) {
      el.addEventListener('click', function (e) { if (e.target.closest('select,a')) return; e.stopPropagation(); abrirAtividade(el.getAttribute('data-atv')); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target === el) abrirAtividade(el.getAttribute('data-atv')); });
    });
    c.querySelectorAll('select[data-st]').forEach(function (s) { s.addEventListener('change', function () { mudarAtv(s.getAttribute('data-st'), { status: s.value }); }); });
    if (atv.vista === 'quadro') ligarArrastar(c);
    if (atv.vista === 'calendario') {
      document.getElementById('ac-ant').addEventListener('click', function () { atv.mes = new Date(atv.mes.getFullYear(), atv.mes.getMonth() - 1, 1); desenharAtv(); });
      document.getElementById('ac-prox').addEventListener('click', function () { atv.mes = new Date(atv.mes.getFullYear(), atv.mes.getMonth() + 1, 1); desenharAtv(); });
      document.getElementById('ac-hoje').addEventListener('click', function () { var h = new Date(); atv.mes = new Date(h.getFullYear(), h.getMonth(), 1); desenharAtv(); });
      c.querySelectorAll('[data-novo-dia]').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target.closest('[data-atv]')) return; formAtividade(null, { inicio: d.getAttribute('data-novo-dia') }); }); });
    }
  }

  function linhaAtv(a) {
    var ed = podeEditarAtv(a), atrasada = a.status !== 'concluida' && (a.fim || a.inicio) < dIso(new Date());
    return '<li class="atv-linha' + (a.status === 'concluida' ? ' feita' : '') + '" data-atv="' + esc(a.id) + '" tabindex="0" style="--cor:' + COR_ST[a.status] + '">' +
      '<span class="atv-marca" aria-hidden="true"></span>' +
      '<span class="atv-info"><strong>' + esc(a.titulo) + '</strong><span class="meta' + (atrasada ? ' atrasada' : '') + '">' + esc(quandoAtv(a)) + (a.local ? ' · ' + esc(a.local) : '') + '</span>' +
      '<span class="atv-tags">' + bandeira(a.prioridade) + '<span class="atv-tipo">' + esc(tm('ta_' + a.tipo)) + '</span>' + (a.link_meet ? '<span class="atv-tipo meet">Meet</span>' : '') + (a.publico ? '<span class="atv-tipo pub">' + tm('no_site') + '</span>' : '') + '</span></span>' +
      avataresAtv(a) +
      (ed ? '<select class="atv-st-sel" data-st="' + esc(a.id) + '" aria-label="' + esc(tm('situacao')) + '" style="--cor:' + COR_ST[a.status] + '">' + ST_ATV.map(function (s) { return '<option value="' + s + '"' + (a.status === s ? ' selected' : '') + '>' + esc(tm('st_' + s)) + '</option>'; }).join('') + '</select>' : pilulaSt(a.status)) +
      '</li>';
  }
  function vistaLista(lista) {
    if (!lista.length) return '<div class="atv-vazio"><p>' + (atv.filtro === 'minhas' ? tm('vazio_minhas') : tm('vazio')) + '</p></div>';
    var hoje = dIso(new Date()), sem = dIso(somaDias(new Date(), 7));
    var grupos = [['atrasadas', []], ['hoje', []], ['semana', []], ['depois', []], ['concluidas', []]];
    lista.forEach(function (a) {
      var fim = a.fim || a.inicio;
      var g = a.status === 'concluida' ? 4 : fim < hoje ? 0 : (a.inicio <= hoje ? 1 : a.inicio <= sem ? 2 : 3);
      grupos[g][1].push(a);
    });
    grupos[4][1].reverse();
    return grupos.map(function (g) {
      if (!g[1].length) return '';
      var corpo = '<ul class="atv-lista">' + g[1].map(linhaAtv).join('') + '</ul>';
      var tit = esc(tm('g_' + g[0])) + ' <span class="atv-n">' + g[1].length + '</span>';
      return g[0] === 'concluidas' ? '<details class="atv-grupo"><summary><h3>' + tit + '</h3></summary>' + corpo + '</details>'
        : '<section class="atv-grupo' + (g[0] === 'atrasadas' ? ' atrasadas' : '') + '"><h3>' + tit + '</h3>' + corpo + '</section>';
    }).join('');
  }
  function vistaQuadro(lista) {
    return '<p class="meta atv-dica">' + tm('dica_quadro') + '</p><div class="atv-quadro">' + ST_ATV.map(function (s) {
      var col = lista.filter(function (a) { return a.status === s; });
      if (s === 'concluida') col = col.slice().reverse().slice(0, 30);
      return '<section class="atv-col" data-col="' + s + '" style="--cor:' + COR_ST[s] + '"><h3>' + esc(tm('st_' + s)) + ' <span class="atv-n">' + col.length + '</span></h3>' +
        '<div class="atv-cards">' + col.map(function (a) {
          return '<article class="atv-card" data-atv="' + esc(a.id) + '" tabindex="0" draggable="' + podeEditarAtv(a) + '"><strong>' + esc(a.titulo) + '</strong>' +
            '<span class="meta">' + esc(quandoAtv(a)) + '</span><span class="atv-card-pe">' + bandeira(a.prioridade) + avataresAtv(a) + '</span></article>';
        }).join('') + '</div>' + (s === 'a_fazer' ? '<button type="button" class="m-link atv-add-col" id="atv-add-col">+ ' + tm('nova_atv') + '</button>' : '') + '</section>';
    }).join('') + '</div>';
  }
  function ligarArrastar(c) {
    var arrastando = null;
    var add = document.getElementById('atv-add-col'); if (add) add.addEventListener('click', function () { formAtividade(null, {}); });
    c.querySelectorAll('.atv-card[draggable="true"]').forEach(function (k) {
      k.addEventListener('dragstart', function (e) { arrastando = k.getAttribute('data-atv'); k.classList.add('arrastando'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', arrastando); });
      k.addEventListener('dragend', function () { k.classList.remove('arrastando'); });
    });
    c.querySelectorAll('.atv-col').forEach(function (col) {
      col.addEventListener('dragover', function (e) { if (arrastando) { e.preventDefault(); col.classList.add('alvo'); } });
      col.addEventListener('dragleave', function () { col.classList.remove('alvo'); });
      col.addEventListener('drop', function (e) {
        e.preventDefault(); col.classList.remove('alvo');
        var id = arrastando; arrastando = null; if (!id) return;
        var a = atv.lista.find(function (x) { return x.id === id; });
        if (a && a.status !== col.getAttribute('data-col')) mudarAtv(id, { status: col.getAttribute('data-col') });
      });
    });
  }
  function vistaCalendario(lista) {
    var m = atv.mes, hoje = dIso(new Date());
    var tit = m.toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', { month: 'long', year: 'numeric' });
    var semana = []; for (var w = 0; w < 7; w++) semana.push(new Date(2024, 0, 1 + w).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', { weekday: 'short' }).replace('.', ''));
    var primeiro = (m.getDay() + 6) % 7, nDias = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    var fer = feriadosEm(m);
    var html = '<div class="cal atv-cal"><div class="cal-topo"><button type="button" class="seta" id="ac-ant" aria-label="' + esc(t('ag_mes_ant')) + '">‹</button><h2>' + esc(tit.charAt(0).toUpperCase() + tit.slice(1)) + '</h2>' +
      '<button type="button" class="seta" id="ac-prox" aria-label="' + esc(t('ag_mes_prox')) + '">›</button><button type="button" class="pausa" id="ac-hoje">' + t('ag_hoje') + '</button></div><div class="cal-dias">' +
      semana.map(function (s) { return '<span class="cal-sem">' + esc(s) + '</span>'; }).join('');
    for (var v = 0; v < primeiro; v++) html += '<span class="cal-vazio"></span>';
    for (var d = 1; d <= nDias; d++) {
      var iso = dIso(new Date(m.getFullYear(), m.getMonth(), d));
      var evs = lista.filter(function (a) { return a.inicio === iso || (a.fim && a.inicio <= iso && a.fim >= iso); });
      var f = fer.filter(function (x) { return x.inicio === iso; })[0];
      html += '<div class="cal-dia atv-dia' + (iso === hoje ? ' hoje' : '') + (f && f.abrangencia !== 'facultativo' ? ' feriado' : '') + '" data-novo-dia="' + iso + '" title="' + esc(tm('clique_dia')) + '">' +
        '<span class="n">' + d + '</span>' + (f ? '<span class="cal-ev fer' + (f.abrangencia === 'facultativo' ? ' fac' : '') + '">' + esc(f.titulo) + '</span>' : '') +
        evs.slice(0, 4).map(function (a) {
          return '<button type="button" class="cal-ev atv-ev' + (a.status === 'concluida' ? ' feita' : '') + '" data-atv="' + esc(a.id) + '" style="--cor:' + corCal(a.responsavel) + '">' + (a.hora_inicio ? '<b>' + hhmm(a.hora_inicio) + '</b> ' : '') + esc(a.titulo) + '</button>';
        }).join('') + (evs.length > 4 ? '<span class="cal-mais">+' + (evs.length - 4) + '</span>' : '') + '</div>';
    }
    var quem = Array.from(new Set(lista.map(function (a) { return a.responsavel; }))).map(pessoaAtv).filter(Boolean);
    return html + '</div><p class="meta cal-dica">' + tm('dica_cal') + '</p>' +
      (quem.length > 1 ? '<ul class="atv-legenda">' + quem.map(function (p) { return '<li><i style="background:' + corCal(p.id) + '"></i>' + esc(p.nome) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  }

  function mudarAtv(id, dados) {
    return sb.from('atividades').update(dados).eq('id', id).select().single().then(function (r) {
      if (r.error) { avisoRapido(tm('erro') + r.error.message); return null; }
      var k = atv.lista.findIndex(function (x) { return x.id === id; }); if (k >= 0) atv.lista[k] = r.data;
      desenharAtv(); return r.data;
    });
  }

  /* --- marcar pessoas com @ (participantes e comentários) --- */
  function caixaMencao(input, aoEscolher, modoTexto) {
    var lista = document.createElement('ul'); lista.className = 'mencao-lista'; lista.hidden = true; lista.setAttribute('role', 'listbox');
    input.parentNode.insertBefore(lista, input.nextSibling);
    var achados = [], pos = 0, inicioTermo = -1;
    function termo() {
      if (!modoTexto) return input.value.replace(/^@/, '').trim();
      var antes = input.value.slice(0, input.selectionStart), m = /(^|\s)@([^\s@]*)$/.exec(antes);
      inicioTermo = m ? antes.length - m[2].length - 1 : -1;
      return m ? m[2] : null;
    }
    function semAc(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function mostrar() {
      var q = termo();
      if (q === null || (!modoTexto && !q && document.activeElement !== input)) { lista.hidden = true; return; }
      achados = atv.pessoas.filter(function (p) { return semAc(p.nome + ' ' + p.email).indexOf(semAc(q)) >= 0; }).slice(0, 6);
      pos = 0;
      lista.innerHTML = achados.map(function (p, i) { return '<li role="option" data-i="' + i + '" aria-selected="' + (i === 0) + '">' + miniAvatar(p) + esc(p.nome || p.email) + '</li>'; }).join('');
      lista.hidden = !achados.length;
    }
    function escolher(i) {
      var p = achados[i]; if (!p) return;
      if (modoTexto) {
        var fimT = input.selectionStart;
        input.value = input.value.slice(0, inicioTermo) + '@' + p.nome + ' ' + input.value.slice(fimT);
        var c = inicioTermo + p.nome.length + 2; input.setSelectionRange(c, c);
      } else input.value = '';
      lista.hidden = true; input.focus(); if (aoEscolher) aoEscolher(p);
    }
    input.addEventListener('input', mostrar);
    input.addEventListener('focus', function () { if (!modoTexto) mostrar(); });
    input.addEventListener('blur', function () { setTimeout(function () { lista.hidden = true; }, 180); });
    input.addEventListener('keydown', function (e) {
      if (lista.hidden) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); pos = (pos + (e.key === 'ArrowDown' ? 1 : -1) + achados.length) % achados.length; lista.querySelectorAll('li').forEach(function (li, i) { li.setAttribute('aria-selected', String(i === pos)); }); }
      else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); escolher(pos); }
      else if (e.key === 'Escape') { lista.hidden = true; }
    });
    lista.addEventListener('mousedown', function (e) { var li = e.target.closest('li'); if (li) { e.preventDefault(); escolher(+li.getAttribute('data-i')); } });
  }
  function mencoesNoTexto(texto) {
    var s = String(texto || '').toLowerCase();
    return atv.pessoas.filter(function (p) { return p.nome && s.indexOf('@' + p.nome.toLowerCase()) >= 0; }).map(function (p) { return p.id; });
  }
  function textoComMencoes(texto) {
    var h = esc(texto);
    atv.pessoas.slice().sort(function (a, b) { return (b.nome || '').length - (a.nome || '').length; }).forEach(function (p) {
      if (!p.nome) return;
      var alvo = '@' + esc(p.nome);
      h = h.split(alvo).join('<span class="mencao' + (p.id === eu() ? ' eu' : '') + '">' + alvo + '</span>');
    });
    return h.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g, '<br>');
  }

  /* --- formulário: nova atividade / editar --- */
  function dlgAtv() { return document.getElementById('m-dialogo'); }
  function abrirDlg(html, largo) {
    var dlg = dlgAtv(), dentro = document.getElementById('m-dialogo-in');
    dlg.classList.toggle('largo', !!largo);
    dentro.innerHTML = html;
    dentro.querySelectorAll('[data-fechar]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    return dentro;
  }
  function formAtividade(a, pre) {
    var novo = !a; a = a || Object.assign({ titulo: '', descricao: '', inicio: dIso(new Date()), status: 'a_fazer', prioridade: 'normal', tipo: 'tarefa', responsavel: eu(), participantes: [], local: '', link_meet: '', publico: false }, pre || {});
    var parts = (a.participantes || []).slice();
    var sel = function (id, lista, atual, pref, dis) { return '<select id="' + id + '"' + (dis ? ' disabled' : '') + '>' + lista.map(function (x) { return '<option value="' + x + '"' + (atual === x ? ' selected' : '') + '>' + esc(tm(pref + x)) + '</option>'; }).join('') + '</select>'; };
    var dentro = abrirDlg('<form id="a-form" class="m-form atv-form" novalidate><div class="m-dlg-topo"><h2>' + esc(novo ? tm('nova_atv') : tm('editar_atv')) + '</h2><button type="button" class="visor-x" data-fechar aria-label="' + esc(tm('cancelar')) + '">×</button></div>' +
      '<label>' + tm('a_titulo') + ' *<input id="a-titulo" value="' + esc(a.titulo) + '" required placeholder="' + esc(tm('ph_titulo')) + '"></label>' +
      '<div class="atv-form-grade">' +
      campo('a-inicio', tm('a_inicio') + ' *', a.inicio, 'date') + campo('a-fim', tm('a_fim'), a.fim || '', 'date') +
      campo('a-hi', tm('a_hi'), hhmm(a.hora_inicio), 'time') + campo('a-hf', tm('a_hf'), hhmm(a.hora_fim), 'time') +
      '<label>' + tm('situacao') + sel('a-status', ST_ATV, a.status, 'st_') + '</label>' +
      '<label>' + tm('prioridade') + sel('a-prio', PRIO, a.prioridade, 'pr_') + '</label>' +
      '<label>' + tm('a_tipo') + sel('a-tipo', TIPOS_ATV, a.tipo, 'ta_') + '</label>' +
      '<label>' + tm('responsavel') + '<select id="a-resp"' + (souCoord() ? '' : ' disabled') + '>' + atv.pessoas.map(function (p) { return '<option value="' + esc(p.id) + '"' + (a.responsavel === p.id ? ' selected' : '') + '>' + esc(p.nome || p.email) + '</option>'; }).join('') + '</select>' +
      (souCoord() ? '' : '<small>' + tm('resp_dica') + '</small>') + '</label></div>' +
      '<div class="atv-campo-parts"><span class="rot">' + tm('participantes') + '</span><div class="atv-chips" id="a-chips"></div>' +
      '<div class="mencao-caixa"><input id="a-parts" autocomplete="off" placeholder="' + esc(tm('ph_parts')) + '"></div><small>' + tm('dica_parts') + '</small></div>' +
      campo('a-local', tm('a_local'), a.local, 'text', ' placeholder="' + esc(tm('ph_local')) + '"') +
      '<div class="atv-meet"><label>' + tm('a_meet') + '<input id="a-meet" type="url" value="' + esc(a.link_meet) + '" placeholder="https://meet.google.com/abc-defg-hij"></label>' +
      '<a class="botao contorno" href="https://meet.google.com/new" target="_blank" rel="noopener">' + tm('criar_meet') + '</a><small>' + tm('dica_meet') + '</small></div>' +
      '<label>' + tm('a_desc') + '<div class="mencao-caixa"><textarea id="a-desc" rows="4" placeholder="' + esc(tm('ph_desc')) + '">' + esc(a.descricao) + '</textarea></div></label>' +
      (posso('agenda') ? '<label class="m-check m-largo"><input type="checkbox" id="a-pub"' + (a.publico ? ' checked' : '') + '> ' + tm('a_publico') + '</label>' : '') +
      '<p class="m-aviso" hidden></p><div class="m-acoes"><button type="submit" class="botao">' + tm('salvar') + '</button><button type="button" class="botao contorno" data-fechar>' + tm('cancelar') + '</button></div></form>', true);
    function chips() {
      document.getElementById('a-chips').innerHTML = parts.map(function (id) { var p = pessoaAtv(id); return p ? '<span class="atv-chip">' + miniAvatar(p) + esc(p.nome) + '<button type="button" data-tirar="' + esc(id) + '" aria-label="' + esc(tm('tirar') + ' ' + p.nome) + '">×</button></span>' : ''; }).join('') || '<span class="meta">' + tm('ninguem') + '</span>';
      dentro.querySelectorAll('[data-tirar]').forEach(function (b) { b.addEventListener('click', function () { parts = parts.filter(function (x) { return x !== b.getAttribute('data-tirar'); }); chips(); }); });
    }
    chips();
    caixaMencao(document.getElementById('a-parts'), function (p) { if (parts.indexOf(p.id) < 0) parts.push(p.id); chips(); }, false);
    caixaMencao(document.getElementById('a-desc'), function (p) { if (parts.indexOf(p.id) < 0 && p.id !== document.getElementById('a-resp').value) { parts.push(p.id); chips(); } }, true);
    document.getElementById('a-titulo').focus();
    document.getElementById('a-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var d = { titulo: v('a-titulo'), inicio: v('a-inicio'), fim: v('a-fim') || null, hora_inicio: v('a-hi') || null, hora_fim: v('a-hf') || null,
        status: v('a-status'), prioridade: v('a-prio'), tipo: v('a-tipo'), responsavel: v('a-resp') || eu(), participantes: parts, local: v('a-local'), link_meet: v('a-meet'), descricao: v('a-desc') };
      if (document.getElementById('a-pub')) d.publico = document.getElementById('a-pub').checked;
      if (!d.titulo || !d.inicio) return aviso(tm('obrig_atv'), 'erro', dentro);
      if (d.link_meet && !/^https?:\/\//.test(d.link_meet)) d.link_meet = 'https://' + d.link_meet;
      aviso(tm('salvando'), '', dentro);
      var op = novo ? sb.from('atividades').insert(d).select().single() : sb.from('atividades').update(d).eq('id', a.id).select().single();
      op.then(function (r) {
        if (r.error) return aviso(tm('erro') + r.error.message, 'erro', dentro);
        var k = atv.lista.findIndex(function (x) { return x.id === r.data.id; });
        if (k >= 0) atv.lista[k] = r.data; else atv.lista.push(r.data);
        atv.lista.sort(function (x, y) { return (x.inicio + (x.hora_inicio || '')).localeCompare(y.inicio + (y.hora_inicio || '')); });
        desenharAtv(); abrirAtividade(r.data.id);
        avisoRapido(tm('salvo'));
      });
    });
  }

  /* --- detalhe: informações, comentários e anexos --- */
  function linkGoogle(a) {
    var dt = function (iso, h) { return iso.replace(/-/g, '') + (h ? 'T' + h.slice(0, 5).replace(':', '') + '00' : ''); };
    var fim = a.fim || a.inicio, datas;
    if (a.hora_inicio) {
      var hf = a.hora_fim || (('0' + Math.min(23, +a.hora_inicio.slice(0, 2) + 1)).slice(-2) + a.hora_inicio.slice(2, 5));
      datas = dt(a.inicio, a.hora_inicio) + '/' + dt(fim, hf);
    } else datas = dt(a.inicio) + '/' + dt(dIso(somaDias(dDe(fim), 1)));
    var det = [a.descricao, a.link_meet ? 'Meet: ' + a.link_meet : ''].filter(Boolean).join('\n\n');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(a.titulo) + '&dates=' + datas + '&ctz=America/Sao_Paulo' +
      (det ? '&details=' + encodeURIComponent(det) : '') + (a.local ? '&location=' + encodeURIComponent(a.local) : '');
  }
  function abrirAtividade(id) {
    var a = atv.lista.find(function (x) { return x.id === id; }); if (!a) return;
    var ed = podeEditarAtv(a), r = pessoaAtv(a.responsavel), criador = pessoaAtv(a.criado_por);
    var ps = (a.participantes || []).map(pessoaAtv).filter(Boolean);
    var dentro = abrirDlg('<div class="atv-det"><div class="m-dlg-topo"><div><span class="atv-tipo">' + esc(tm('ta_' + a.tipo)) + '</span>' + (a.publico ? ' <span class="atv-tipo pub">' + tm('no_site') + '</span>' : '') +
      '<h2>' + esc(a.titulo) + '</h2></div><button type="button" class="visor-x" data-fechar aria-label="' + esc(t('fechar')) + '">×</button></div>' +
      '<div class="atv-det-acoes">' + (ed ? '<label class="atv-st-grande">' + tm('situacao') + '<select id="d-status" style="--cor:' + COR_ST[a.status] + '">' + ST_ATV.map(function (s) { return '<option value="' + s + '"' + (a.status === s ? ' selected' : '') + '>' + esc(tm('st_' + s)) + '</option>'; }).join('') + '</select></label>' : pilulaSt(a.status)) +
      (url(a.link_meet) ? '<a class="botao" href="' + url(a.link_meet) + '" target="_blank" rel="noopener">' + tm('entrar_meet') + '</a>' : '') +
      '<a class="botao contorno" href="' + esc(linkGoogle(a)) + '" target="_blank" rel="noopener">' + ICO_CAL + tm('add_google') + '</a>' +
      (ed ? '<button type="button" class="botao contorno" id="d-editar">' + tm('editar') + '</button>' : '') +
      (podeApagarAtv(a) ? '<button type="button" class="m-link m-perigo" id="d-apagar">' + tm('apagar') + '</button>' : '') + '</div>' +
      '<dl class="atv-ficha"><dt>' + tm('quando') + '</dt><dd>' + esc(quandoAtv(a)) + '</dd>' +
      '<dt>' + tm('responsavel') + '</dt><dd>' + (r ? miniAvatar(r) + esc(r.nome) : '—') + '</dd>' +
      '<dt>' + tm('participantes') + '</dt><dd>' + (ps.length ? ps.map(function (p) { return '<span class="atv-chip">' + miniAvatar(p) + esc(p.nome) + '</span>'; }).join(' ') : '—') + '</dd>' +
      '<dt>' + tm('prioridade') + '</dt><dd>' + esc(tm('pr_' + a.prioridade)) + '</dd>' +
      (a.local ? '<dt>' + tm('a_local') + '</dt><dd>' + esc(a.local) + '</dd>' : '') +
      (criador ? '<dt>' + tm('criado_por') + '</dt><dd>' + esc(criador.nome) + ' · ' + esc(dataFmt(String(a.criado_em).slice(0, 10))) + '</dd>' : '') + '</dl>' +
      (a.descricao ? '<div class="atv-desc">' + textoComMencoes(a.descricao) + '</div>' : '') +
      '<section class="atv-sec"><h3>' + tm('anexos') + '</h3><ul class="atv-anexos" id="d-anexos"><li class="meta">' + t('carregando') + '</li></ul>' +
      '<div class="atv-anexar"><label class="botao contorno m-arquivo">' + tm('anexar_arq') + '<input type="file" id="d-arq"></label>' +
      '<button type="button" class="botao contorno" id="d-link-bt">' + tm('anexar_link') + '</button><small>' + tm('dica_anexo') + '</small></div>' +
      '<form id="d-link-form" class="atv-link-form" hidden><input id="d-link-nome" placeholder="' + esc(tm('ph_link_nome')) + '"><input id="d-link-url" type="url" placeholder="https://drive.google.com/…"><button type="submit" class="botao">' + tm('salvar') + '</button></form></section>' +
      '<section class="atv-sec"><h3>' + tm('comentarios') + '</h3><ul class="atv-coms" id="d-coms"><li class="meta">' + t('carregando') + '</li></ul>' +
      '<form id="d-com-form" class="atv-com-form">' + miniAvatar(perfilAtual) + '<div class="mencao-caixa"><textarea id="d-com" rows="2" placeholder="' + esc(tm('ph_com')) + '"></textarea></div><button type="submit" class="botao">' + tm('enviar') + '</button></form></section>' +
      '<p class="m-aviso" hidden></p></div>', true);
    var st = document.getElementById('d-status');
    if (st) st.addEventListener('change', function () { mudarAtv(a.id, { status: st.value }).then(function (n) { if (n) { a = n; st.style.setProperty('--cor', COR_ST[n.status]); } }); });
    var bEd = document.getElementById('d-editar'); if (bEd) bEd.addEventListener('click', function () { formAtividade(a); });
    var bAp = document.getElementById('d-apagar'), conf = false;
    if (bAp) bAp.addEventListener('click', function () {
      if (!conf) { conf = true; bAp.textContent = tm('confirmar_apagar'); return; }
      sb.from('atividades').delete().eq('id', a.id).then(function (rr) {
        if (rr.error) return aviso(tm('erro') + rr.error.message, 'erro', dentro);
        atv.lista = atv.lista.filter(function (x) { return x.id !== a.id; }); dlgAtv().close(); desenharAtv();
      });
    });
    caixaMencao(document.getElementById('d-com'), null, true);
    carregarComentarios(a); carregarAnexos(a);
    document.getElementById('d-com-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var ta = document.getElementById('d-com'), txt = ta.value.trim(); if (!txt) return;
      var b = e.target.querySelector('button'); b.disabled = true;
      sb.from('atividade_comentarios').insert({ atividade_id: a.id, autor: eu(), texto: txt, mencoes: mencoesNoTexto(txt) }).then(function (rr) {
        b.disabled = false;
        if (rr.error) return aviso(tm('erro') + rr.error.message, 'erro', dentro);
        ta.value = ''; carregarComentarios(a);
      });
    });
    document.getElementById('d-arq').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      if (f.size > 10485760) return aviso(tm('arq_grande'), 'erro', dentro);
      aviso(tm('enviando'), '', dentro);
      var nomeLimpo = f.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_');
      var caminho = a.id + '/' + eu() + '/' + Date.now() + '-' + nomeLimpo;
      sb.storage.from('anexos').upload(caminho, f, { contentType: f.type || 'application/octet-stream' }).then(function (rr) {
        if (rr.error) throw rr.error;
        return sb.from('atividade_anexos').insert({ atividade_id: a.id, nome: f.name, caminho: caminho, tamanho: f.size, autor: eu() });
      }).then(function (rr) { if (rr.error) throw rr.error; aviso('', '', dentro); carregarAnexos(a); })
        .catch(function (er) { aviso(tm('erro') + (er.message || er), 'erro', dentro); });
    });
    var lf = document.getElementById('d-link-form');
    document.getElementById('d-link-bt').addEventListener('click', function () { lf.hidden = !lf.hidden; if (!lf.hidden) document.getElementById('d-link-url').focus(); });
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var u = document.getElementById('d-link-url').value.trim(), n = document.getElementById('d-link-nome').value.trim();
      if (!u) return;
      if (!/^https?:\/\//.test(u)) u = 'https://' + u;
      sb.from('atividade_anexos').insert({ atividade_id: a.id, nome: n || u, link: u, autor: eu() }).then(function (rr) {
        if (rr.error) return aviso(tm('erro') + rr.error.message, 'erro', dentro);
        lf.reset(); lf.hidden = true; carregarAnexos(a);
      });
    });
  }
  function quandoCom(ts) {
    var d = new Date(ts); if (isNaN(d)) return '';
    return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-BR', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function carregarComentarios(a) {
    sb.from('atividade_comentarios').select('*').eq('atividade_id', a.id).order('criado_em').then(function (r) {
      var ul = document.getElementById('d-coms'); if (!ul) return;
      if (r.error) { ul.innerHTML = '<li class="aviso">' + esc(r.error.message) + '</li>'; return; }
      ul.innerHTML = r.data.length ? r.data.map(function (c) {
        var p = pessoaAtv(c.autor) || { id: c.autor, nome: '?' };
        return '<li class="atv-com">' + miniAvatar(p) + '<div><span class="atv-com-topo"><b>' + esc(p.nome) + '</b> <span class="meta">' + esc(quandoCom(c.criado_em)) + '</span>' +
          (c.autor === eu() || souCoord() ? ' <button type="button" class="m-link m-perigo" data-apagar-com="' + esc(c.id) + '">' + tm('apagar') + '</button>' : '') + '</span>' +
          '<p>' + textoComMencoes(c.texto) + '</p></div></li>';
      }).join('') : '<li class="meta">' + tm('sem_com') + '</li>';
      ul.querySelectorAll('[data-apagar-com]').forEach(function (b) {
        var conf = false;
        b.addEventListener('click', function () {
          if (!conf) { conf = true; b.textContent = tm('confirmar_apagar'); return; }
          sb.from('atividade_comentarios').delete().eq('id', b.getAttribute('data-apagar-com')).then(function () { carregarComentarios(a); });
        });
      });
    });
  }
  function tamanhoFmt(n) { return n > 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  function carregarAnexos(a) {
    sb.from('atividade_anexos').select('*').eq('atividade_id', a.id).order('criado_em').then(function (r) {
      var ul = document.getElementById('d-anexos'); if (!ul) return;
      if (r.error) { ul.innerHTML = '<li class="aviso">' + esc(r.error.message) + '</li>'; return; }
      ul.innerHTML = r.data.length ? r.data.map(function (x) {
        var p = pessoaAtv(x.autor);
        return '<li>' + (x.caminho ? '<button type="button" class="m-link" data-baixar="' + esc(x.caminho) + '">📎 ' + esc(x.nome) + '</button>' : '<a href="' + url(x.link) + '" target="_blank" rel="noopener">🔗 ' + esc(x.nome) + '</a>') +
          '<span class="meta">' + [x.tamanho ? tamanhoFmt(x.tamanho) : '', p ? nomeCurto(p) : ''].filter(Boolean).join(' · ') + '</span>' +
          (x.autor === eu() || souCoord() ? '<button type="button" class="m-link m-perigo" data-apagar-anx="' + esc(x.id) + '" data-cam="' + esc(x.caminho || '') + '">' + tm('apagar') + '</button>' : '') + '</li>';
      }).join('') : '<li class="meta">' + tm('sem_anexos') + '</li>';
      ul.querySelectorAll('[data-baixar]').forEach(function (b) {
        b.addEventListener('click', function () {
          sb.storage.from('anexos').createSignedUrl(b.getAttribute('data-baixar'), 3600).then(function (rr) {
            if (rr.error) return avisoRapido(tm('erro') + rr.error.message);
            window.open(rr.data.signedUrl, '_blank', 'noopener');
          });
        });
      });
      ul.querySelectorAll('[data-apagar-anx]').forEach(function (b) {
        var conf = false;
        b.addEventListener('click', function () {
          if (!conf) { conf = true; b.textContent = tm('confirmar_apagar'); return; }
          var cam = b.getAttribute('data-cam');
          (cam ? sb.storage.from('anexos').remove([cam]) : Promise.resolve()).then(function () {
            return sb.from('atividade_anexos').delete().eq('id', b.getAttribute('data-apagar-anx'));
          }).then(function () { carregarAnexos(a); });
        });
      });
    });
  }

  /* --- ligar ao Google Agenda pessoal (mão única: site → Google) --- */
  function abrirSincronizacao() {
    var dentro = abrirDlg('<div class="atv-sinc"><div class="m-dlg-topo"><h2>' + tm('sinc_tit') + '</h2><button type="button" class="visor-x" data-fechar aria-label="' + esc(t('fechar')) + '">×</button></div>' +
      '<p class="lead">' + tm('sinc_lead') + '</p><div id="sinc-corpo"><p class="meta">' + t('carregando') + '</p></div></div>', true);
    function obterToken(novo) {
      var me = eu();
      var antes = novo ? sb.from('agenda_tokens').delete().eq('perfil_id', me) : Promise.resolve();
      return antes.then(function () { return sb.from('agenda_tokens').select('token').eq('perfil_id', me).maybeSingle(); }).then(function (r) {
        if (r.error) throw r.error;
        if (r.data && r.data.token) return r.data.token;
        return sb.from('agenda_tokens').insert({ perfil_id: me }).select('token').single().then(function (rr) { if (rr.error) throw rr.error; return rr.data.token; });
      });
    }
    function mostrar(token) {
      var base = String((D.membros || {}).supabase_url || '').replace(/\/$/, '') + '/functions/v1/agenda-ics?t=' + token;
      var bloco = function (rot, link) {
        return '<div class="sinc-link"><span class="rot">' + rot + '</span><div class="sinc-linha"><input readonly value="' + esc(link) + '" onclick="this.select()"><button type="button" class="botao" data-copiar="' + esc(link) + '">' + t('copiar_link') + '</button></div></div>';
      };
      document.getElementById('sinc-corpo').innerHTML =
        bloco(tm('sinc_minhas'), base) + (souCoord() ? bloco(tm('sinc_todas'), base + '&todas=1') : '') +
        '<ol class="passos"><li>' + tm('sinc_p1') + '</li><li>' + tm('sinc_p2') + ' <a href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl" target="_blank" rel="noopener">' + tm('sinc_abrir') + '</a></li><li>' + tm('sinc_p3') + '</li><li>' + tm('sinc_p4') + '</li></ol>' +
        '<p class="aviso">' + tm('sinc_obs') + '</p>' +
        '<p class="meta">' + tm('sinc_seg') + ' <button type="button" class="m-link" id="sinc-novo">' + tm('sinc_novo') + '</button></p>';
      dentro.querySelectorAll('[data-copiar]').forEach(function (b) { b.addEventListener('click', function () { copiarTexto(b.getAttribute('data-copiar')).then(function () { avisoRapido(t('link_copiado')); }); }); });
      var conf = false, bn = document.getElementById('sinc-novo');
      bn.addEventListener('click', function () {
        if (!conf) { conf = true; bn.textContent = tm('sinc_novo_conf'); return; }
        obterToken(true).then(mostrar);
      });
    }
    obterToken(false).then(mostrar).catch(function (e) { document.getElementById('sinc-corpo').innerHTML = '<p class="aviso">' + esc(tm('erro') + (e.message || e)) + '</p>'; });
  }

  /* =================== GUIA DA COORDENAÇÃO (só aparece para a coordenação) =================== */
  var GUIA = {
    aprovar: ['Aprovar quem se cadastrou', [
      'Quando alguém cria uma conta, aparece um número vermelho na aba <b>Equipe e permissões</b>.',
      'Clique nessa aba. No alto da página fica a lista <b>Aguardando aprovação</b>.',
      'Confira o nome e o e-mail. Se a pessoa é mesmo do grupo, clique em <b>Aprovar</b>. Se não for, clique em <b>Recusar</b>.',
      'Pronto: a pessoa aprovada já consegue entrar e usar a área de membros. Ela não recebe e-mail avisando; se quiser, mande uma mensagem dizendo que já pode entrar.'
    ]],
    permissoes: ['Dar ou tirar permissões', [
      'Na aba <b>Equipe e permissões</b>, procure a pessoa na lista <b>Pessoas com conta</b>.',
      'Embaixo do nome aparecem os botões <b>Biblioteca, Agenda, Banco de dados, Equipe, Projetos e Notícias</b>.',
      'Clique num botão para <b>liberar</b> aquela área (ele fica azul). Clique de novo para <b>retirar</b> (ele fica branco). Salva sozinho.',
      'O que cada um permite: <b>Agenda</b> = publicar atividades na agenda pública do site; <b>Equipe</b> = editar o perfil dos colegas e cadastrar egressos; as outras áreas serão usadas nas próximas etapas.',
      'Você, como coordenação, já pode tudo. Não precisa marcar nada para você.'
    ]],
    coord: ['Colocar outra pessoa na coordenação', [
      'Na lista <b>Pessoas com conta</b>, ache a pessoa.',
      'No campo <b>Papel</b>, troque de <b>Membro</b> para <b>Coordenação</b>.',
      'Essa pessoa passa a poder tudo, igual a você. Use só para quem vai dividir a coordenação.'
    ]],
    concluir: ['Quando alguém defender ou sair do grupo', [
      'Na aba <b>Equipe e permissões</b>, ache a pessoa.',
      'No campo <b>Situação</b>, escolha <b>Concluído · acesso encerrado</b>.',
      'A pessoa deixa de editar o site e perde as permissões. O perfil e a trajetória dela continuam na página pública <b>Equipe</b>, agora como egressa.',
      'Depois, clique em <b>Editar</b> ao lado do nome e preencha <b>Defesa realizada (mês/ano)</b>. Clique em <b>Salvar</b>. A defesa passa a aparecer na linha do tempo.',
      'A <b>defesa prevista</b> só você e a própria pessoa veem. Ela nunca aparece no site nem na linha do tempo.'
    ]],
    externas: ['Cadastrar egressos e pessoas sem conta', [
      'Abra a aba <b>Pessoas sem conta</b>.',
      'Clique em <b>+ Adicionar pessoa</b>.',
      'Preencha o nome e o que souber: nível, vínculo, ano de entrada, data da defesa, links. Em <b>Situação</b>, deixe <b>Egresso</b> para quem já saiu.',
      'Clique em <b>Salvar</b>. A janela continua aberta: agora você pode clicar em <b>Trocar foto</b> e escolher a foto da pessoa.',
      'Para corrigir depois, clique em <b>Editar</b> ao lado do nome. Para tirar alguém do site, clique em Editar → <b>Apagar</b> e clique de novo para confirmar.'
    ]],
    editar: ['Corrigir os dados ou a foto de alguém', [
      'Na aba <b>Equipe e permissões</b> (para quem tem conta) ou <b>Pessoas sem conta</b> (egressos), clique em <b>Editar</b> ao lado do nome.',
      'Mude o que precisar e clique em <b>Salvar</b>.',
      'Para a foto, clique em <b>Trocar foto</b> e escolha a imagem no computador. Ela é cortada e reduzida sozinha.',
      'O que está no cadastro sempre vale mais do que o que o site busca sozinho no ORCID.'
    ]],
    atividades: ['Acompanhar e criar atividades para a equipe', [
      'Abra a aba <b>Atividades</b>. Em <b>Mostrar</b>, escolha <b>Todas</b> para ver o grupo inteiro, ou o nome de uma pessoa para ver só as dela.',
      'Troque a visualização em <b>Lista</b> (por prazo), <b>Quadro</b> (colunas por situação) ou <b>Calendário</b> (mês).',
      'Para criar uma atividade para alguém: clique em <b>+ Nova atividade</b>, preencha o título e a data e, em <b>Responsável</b>, escolha a pessoa. Só a coordenação pode escolher outra pessoa como responsável.',
      'Clique em qualquer atividade para abrir: ali você muda a situação, edita, comenta e vê os anexos de todo mundo.'
    ]],
    comentar: ['Comentar e marcar pessoas com @', [
      'Abra a atividade e desça até <b>Comentários</b>.',
      'Escreva o comentário. Para marcar alguém, digite <b>@</b> e o começo do nome; escolha a pessoa na lista que aparece.',
      'Clique em <b>Enviar</b>. O nome marcado fica destacado. (O aviso por e-mail para quem foi marcado é a próxima etapa.)'
    ]],
    publicar: ['Publicar uma atividade na agenda pública do site', [
      'Ao criar ou editar uma atividade, marque <b>Mostrar na agenda pública do site</b>.',
      'Use para eventos abertos: lives, seminários, defesas abertas, eventos que o grupo organiza.',
      'O título, a data, o horário, o local e a descrição aparecem na página <b>Agenda</b> do site. O link do Meet, os comentários e os anexos <b>não</b> aparecem.',
      'Para dar essa possibilidade a outra pessoa, libere a permissão <b>Agenda</b> para ela.'
    ]],
    google: ['Ver as atividades no seu Google Agenda', [
      'Na aba <b>Atividades</b>, clique em <b>Ligar ao meu Google Agenda</b>.',
      'Copie o link. Você tem dois: <b>só as minhas</b> e <b>todas do grupo</b>.',
      'Clique em <b>Abrir o Google Agenda</b>, cole o link no campo <b>URL da agenda</b> e clique em <b>Adicionar agenda</b>.',
      'Pronto. O que for criado no site aparece no seu Google Agenda (o Google atualiza sozinho, de algumas em algumas horas). O que está na sua agenda pessoal <b>não</b> vem para o site.'
    ]],
    senha: ['Se alguém esqueceu a senha', [
      'Peça para a pessoa clicar em <b>Esqueci minha senha</b> na tela de entrar.',
      'Ela recebe um e-mail com um link para criar uma senha nova.',
      'Se o e-mail não chegar, peça para olhar a caixa de spam. O serviço gratuito manda poucos e-mails por hora; se muita gente pedir ao mesmo tempo, espere um pouco.'
    ]]
  };
  function guiaCoord(chaves, aberto) {
    return '<div class="guia"><p class="guia-tit">' + ICO_GUIA + tm('guia_curto') + '</p>' + chaves.map(function (k) {
      var g = GUIA[k];
      return '<details class="guia-item"' + (aberto ? ' open' : '') + '><summary>' + g[0] + '</summary><ol>' + g[1].map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol></details>';
    }).join('') + '</div>';
  }
  var ICO_GUIA = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ico"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
  function telaGuia() {
    document.getElementById('m-corpo').innerHTML = '<div class="guia-pagina"><p class="lead">' + tm('guia_lead') + '</p>' +
      '<h2>' + tm('guia_pessoas') + '</h2>' + guiaCoord(['aprovar', 'permissoes', 'concluir', 'externas', 'editar', 'coord', 'senha']) +
      '<h2>' + tm('guia_atv') + '</h2>' + guiaCoord(['atividades', 'comentar', 'publicar', 'google']) + '</div>';
  }

  P.contato = function () {
    var c = D.site.contato || {};
    var redes = (D.site.redes || []).filter(function (r) { return url(r.url); });
    var email = pendente(c.email) ? '<p>' + txt(c.email) + '</p>' : '<p><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></p>';
    var mailFaca = pendente(c.email) ? '' : '<a class="botao" href="mailto:' + esc(c.email) + '?subject=' + encodeURIComponent(t('assunto')) + '">' + t('quero') + '</a><p style="margin-top:10px;font-size:.9rem">' + t('ou') + esc(c.email) + '</p>';
    return '<section class="secao"><p class="olho">' + t('contato') + '</p><h1>' + t('fale_tit') + '</h1>' +
      '<div class="grade g2 contato-grade"><div class="cartao"><h3>' + t('email') + '</h3>' + email +
      '<h3 style="margin-top:20px">' + t('onde') + '</h3><p>' + txt(loc(c, 'endereco')) + '</p>' +
      (redes.length ? '<h3 style="margin-top:20px">' + t('redes') + '</h3><ul class="chips">' + redes.map(function (r) { return '<li>' + link(r.url, esc(r.nome), 'chip') + '</li>'; }).join('') + '</ul>' : '') +
      '</div><div class="cartao"><h3>' + t('quer') + '</h3><p>' + txt(loc(c, 'faca_parte')) + '</p>' + mailFaca + '</div></div></section>';
  };

  /* ---------- idioma ---------- */
  function aplicarIdioma() {
    raiz.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.querySelectorAll('[data-i]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i')); });
    document.querySelectorAll('.idioma button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    document.querySelector('.topo .marca').setAttribute('aria-label', t('inicio_aria'));
    document.querySelector('.pular').textContent = t('pular');
    var inst = (D.site.instituicoes || []).map(function (i) { return link(i.url, esc(i.nome)); }).join(' · ');
    document.getElementById('rodape-inst').innerHTML = esc(loc(D.site, 'nome_pt') || '') + (inst ? ' — ' + inst : '');
    document.getElementById('rodape-auto').textContent = t('rodape_auto');
  }
  function mudarIdioma(novo) {
    lang = novo === 'en' ? 'en' : 'pt';
    try { localStorage.setItem('unseel-idioma', lang); } catch (e) { /* ok */ }
    aplicarIdioma();
    rota(true);
  }
  document.querySelectorAll('.idioma button').forEach(function (b) { b.addEventListener('click', function () { mudarIdioma(b.getAttribute('data-lang')); }); });

  /* ---------- abertura: tirar a venda ---------- */
  function ligarAbertura() {
    var ab = document.getElementById('abertura');
    if (!raiz.classList.contains('com-abertura')) { entrarTopo(); return; }
    var video = document.getElementById('abertura-video');
    var pular = document.getElementById('pular-abertura');
    var entrar = document.getElementById('entrar-abertura');
    var saiu = false;
    function sair() {
      if (saiu) return; saiu = true;
      try { sessionStorage.setItem('unseel-aberto', '1'); } catch (e) { /* ok */ }
      ab.classList.add('saindo');
      setTimeout(function () {
        raiz.classList.remove('com-abertura');
        try { video.pause(); } catch (e) { /* ok */ }
        ab.remove();
        entrarTopo();
        rota(true);
        main.focus({ preventScroll: true });
      }, semMovimento ? 0 : 900);
    }
    function pedirClique() { pular.hidden = true; entrar.hidden = false; entrar.focus(); }
    pular.addEventListener('click', sair);
    entrar.addEventListener('click', sair);
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); sair(); } });
    if (semMovimento) { pedirClique(); return; }   // quem pede menos movimento vê só a imagem final
    video.addEventListener('ended', function () { setTimeout(sair, 700); });
    video.addEventListener('error', sair, true);
    var p = video.play();
    if (p && p.catch) p.catch(pedirClique);       // autoplay bloqueado: mostra a imagem final e o botão
    setTimeout(function () { if (!saiu && video.paused && entrar.hidden) pedirClique(); }, 2500);
    setTimeout(function () { if (!saiu && entrar.hidden) sair(); }, 15000);   // segurança
    pular.focus();
  }
  function entrarTopo() {
    var topo = document.getElementById('topo');
    topo.classList.add('entrada');
    setTimeout(function () { topo.classList.remove('entrada'); }, 1600);
  }
  window.addEventListener('scroll', function () {
    document.getElementById('topo').classList.toggle('compacto', window.scrollY > 40);
  }, { passive: true });

  /* ---------- roteador ---------- */
  function rota(manterRolagem) {
    limpezas.forEach(function (f) { try { f(); } catch (e) { /* nada */ } });
    limpezas = [];
    var h = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
    var partes = h.split('/');
    var nome = partes[0] || 'inicio';
    if (/access_token=|type=recovery|error_description=/.test(location.hash)) { nome = 'membros'; partes = ['membros']; }  // volta do e-mail de senha
    var fn = P[nome] || P.inicio;
    main.innerHTML = fn(partes[1] ? decodeURIComponent(partes[1]) : undefined);
    var base = { pessoa: 'equipe', projeto: 'projetos', pesquisa: 'dados' }[nome] || (P[nome] ? nome : 'inicio');
    document.querySelectorAll('nav#nav>a').forEach(function (a) {
      var alvo = a.getAttribute('href').replace(/^#\/?/, '') || 'inicio';
      a.classList.toggle('ativo', alvo === base);
      if (alvo === base) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.getElementById('nav').classList.remove('aberto');
    document.querySelector('.menu-btn').setAttribute('aria-expanded', 'false');
    if (manterRolagem !== true) window.scrollTo(0, 0);
    setTimeout(ligarSurgir, 0);
  }

  document.querySelector('.menu-btn').addEventListener('click', function () {
    var nav = document.getElementById('nav');
    var aberto = nav.classList.toggle('aberto');
    this.setAttribute('aria-expanded', String(aberto));
  });

  /* ---------- carga ---------- */
  var arquivos = { site: 'site', coordenador: 'coordenador', equipe: 'equipe', projetos: 'projetos',
    publicacoes: 'publicacoes', manuais: 'publicacoes-manuais', midia: 'midia', dados: 'dados', galeria: 'galeria', pesquisas: 'pesquisas', biblioteca: 'biblioteca', agenda: 'agenda', agendaGoogle: 'agenda-google', membros: 'membros', orcidFormacao: 'orcid-formacao', metricas: 'metricas' };
  Promise.all(Object.keys(arquivos).map(function (k) {
    return fetch('data/' + arquivos[k] + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (j) { D[k] = j || {}; });
  })).then(function () {
    aplicarIdioma();
    Promise.all([carregarEquipePublica(), carregarAgendaSite()]).then(function () {
      window.addEventListener('hashchange', function () { rota(); });
      rota();
      ligarAbertura();
    });
  });
})();
