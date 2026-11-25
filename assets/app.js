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
  function pessoa(id) { return (D.equipe.membros || []).find(function (m) { return m.id === id; }); }
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
  function itemPub(p) {
    var tit = url(p.url) ? '<a class="tit" href="' + url(p.url) + '" target="_blank" rel="noopener">' + esc(p.titulo) + '</a>' : '<span class="tit">' + esc(p.titulo) + '</span>';
    var sub = [autoresDe(p), esc(p.veiculo), esc(p.ano)].filter(Boolean).join(' · ');
    return '<li>' + tit + '<p class="sub">' + sub + '</p><ul class="chips"><li><span class="chip tipo">' + esc(t('tipos')[p.tipo] || p.tipo || '') + '</span></li>' +
      (p.projetos || []).map(chipProjeto).join('') + '</ul></li>';
  }
  function listaPubs(lista, vazio) {
    return lista.length ? '<ul class="lista">' + lista.map(itemPub).join('') + '</ul>' : '<p class="vazio">' + esc(vazio || t('sem_pubs')) + '</p>';
  }
  function itemNoticia(n) {
    return '<li>' + (url(n.url) ? '<a class="tit" href="' + url(n.url) + '" target="_blank" rel="noopener">' + esc(n.titulo) + '</a>' : '<span class="tit">' + esc(n.titulo) + '</span>') +
      '<p class="sub">' + [esc(n.fonte), dataFmt(n.data)].filter(Boolean).join(' · ') + '</p>' + chipsProjetos(n.projetos) + '</li>';
  }
  function listaNoticias(lista, vazio) {
    return lista.length ? '<ul class="lista">' + lista.map(itemNoticia).join('') + '</ul>' : '<p class="vazio">' + esc(vazio || t('sem_not')) + '</p>';
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
    var links = c ? c.links : { lattes: m.lattes, orcid: m.orcid, researchgate: m.researchgate };
    var pubs = publicacoes().filter(function (p) { return (p.autores || []).indexOf(id) >= 0; });
    var nots = noticias().filter(function (n) { return (n.pessoas || []).indexOf(id) >= 0; });
    var lista = function (tt, arr) { return arr && arr.length ? '<h3 style="margin-top:28px">' + tt + '</h3><ul>' + arr.map(function (x) { return '<li>' + txt(x) + '</li>'; }).join('') + '</ul>' : ''; };
    var lk = [];
    if (links) {
      if (url(links.lattes)) lk.push(link(links.lattes, t('curriculo')));
      if (links.orcid) lk.push(link(orcidUrl(links.orcid), 'ORCID'));
      if (url(links.researchgate)) lk.push(link(links.researchgate, 'ResearchGate'));
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
      '</div></div>' +
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
      '<p class="lead">' + t('equipe_lead') + '</p>' +
      '<div class="filtros" role="group">' +
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
    lista.forEach(function (p) { if (p.ano !== anoAtual) { fecha(); anoAtual = p.ano; } buf.push(itemPub(p)); });
    fecha();
    if (!lista.length) html += '<p class="vazio">' + t('nada') + '</p>';
    document.getElementById('lista-pubs').innerHTML = html;
  }

  P.midia = function () {
    return '<section class="secao"><p class="olho">' + t('imprensa') + '</p><h1>' + t('na_midia') + '</h1>' +
      '<p class="aviso">' + t('aviso_midia') + (D.midia.atualizado_em ? t('ultima_busca') + dataFmt(D.midia.atualizado_em) + ')' : '') + '.</p>' +
      listaNoticias(noticias()) + '</section>';
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
      chipsProjetos(x.projeto ? [x.projeto] : []) + acao + '</div></article>';
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
    publicacoes: 'publicacoes', manuais: 'publicacoes-manuais', midia: 'midia', dados: 'dados', galeria: 'galeria', pesquisas: 'pesquisas', biblioteca: 'biblioteca', agenda: 'agenda', agendaGoogle: 'agenda-google' };
  Promise.all(Object.keys(arquivos).map(function (k) {
    return fetch('data/' + arquivos[k] + '.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; })
      .then(function (j) { D[k] = j || {}; });
  })).then(function () {
    aplicarIdioma();
    window.addEventListener('hashchange', function () { rota(); });
    rota();
    ligarAbertura();
  });
})();
