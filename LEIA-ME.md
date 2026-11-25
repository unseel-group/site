# Site do UNSEEL – como publicar e editar

## 1. Publicar no GitHub Pages (uma vez só)

1. Crie uma conta no GitHub (de preferência uma conta do grupo, ex.: `unseel-lab`).
2. Crie um repositório novo e **público**, por exemplo `site`.
3. Na página do repositório, clique em **Add file → Upload files**. Arraste **todo o conteúdo desta pasta**, incluindo a pasta `.github` (no Mac, aperte Cmd+Shift+. para ver pastas ocultas), e clique em **Commit changes**.
4. Vá em **Settings → Pages** e, em *Source*, escolha **GitHub Actions**.
5. Vá em **Settings → Actions → General** e, em *Workflow permissions*, marque **Read and write permissions**. Salve.
6. Vá em **Actions → Atualizar e publicar o site → Run workflow**. Em 1 ou 2 minutos o site estará em
   `https://<nome-da-conta>.github.io/site/`.
7. Opcional: em **Settings → Secrets and variables → Actions → Variables**, crie `OPENALEX_EMAIL` com o e-mail do grupo. O OpenAlex pede isso para dar prioridade nas consultas.

Para usar um endereço próprio (ex.: `unseel.org`), registre o domínio e informe-o em **Settings → Pages → Custom domain**.

## 2. O que se atualiza sozinho (toda segunda-feira)

| O quê | De onde vem | Arquivo |
|---|---|---|
| Publicações de cada membro | ORCID da pessoa → OpenAlex | `data/publicacoes.json` |
| Notícias e entrevistas do coordenador | Google Notícias (português, inglês e espanhol) | `data/midia.json` |

- **Só aparece quem tem ORCID** preenchido em `data/equipe.json`. Peça a cada membro o número do ORCID (e que o mantenha atualizado; no ORCID dá para importar as publicações automaticamente pelo Crossref).
- **Lattes e ResearchGate não permitem leitura automática.** Para itens que só estão no Lattes (livros, capítulos, relatórios), use `data/publicacoes-manuais.json`.
- Uma publicação ou notícia entra em um **projeto** automaticamente quando o título contém uma das `palavras_chave` do projeto (`data/projetos.json`).
- Notícia errada? Em `data/midia.json`, mude `"oculto": false` para `true` (não apague; senão ela volta).
- Para atualizar na hora: **Actions → Atualizar e publicar o site → Run workflow**.

## 3. Editar textos e pessoas

Tudo fica na pasta `data/`. No GitHub, abra o arquivo, clique no lápis ✏️, edite e clique em **Commit changes**. O site é republicado sozinho em cerca de 1 minuto.

| Arquivo | Conteúdo |
|---|---|
| `site.json` | Apresentação, missão, visão, valores, linhas de pesquisa, contato, redes sociais |
| `coordenador.json` | Biografia, formação, atuação, prêmios, livros e links do Victor |
| `equipe.json` | Membros: nível, ativo/egresso, ano de defesa, projetos, ORCID, Lattes, ResearchGate |
| `projetos.json` | Projetos: status, período, resumo, descrição, parceiros, links, palavras-chave |
| `dados.json` | Conjuntos de dados do grupo |
| `publicacoes-manuais.json` | Publicações que não estão no ORCID |
| `galeria.json` | Fotos do carrossel da página inicial (as fotos ficam em `assets/fotos/`) |

**Carrossel de fotos:** suba as fotos na pasta `assets/fotos/` (Add file → Upload files) e cadastre cada uma em `galeria.json`, com título, legenda, data e uma descrição da foto (`alt`). Coloque as mais recentes primeiro. Enquanto houver menos de 3 fotos, o carrossel se completa sozinho com as notícias, os projetos em andamento e as publicações mais recentes.

**Cores dos projetos:** cada projeto tem um campo `cor` em `projetos.json`. Cores claras (como amarelo) recebem texto escuro automaticamente.

Textos entre colchetes, como `[ESCREVA AQUI]`, aparecem destacados em amarelo no site até serem preenchidos.

Cuidado com a sintaxe: aspas duplas em volta dos textos e vírgula entre os itens. Se o site ficar em branco depois de uma edição, o erro provavelmente está no último arquivo alterado. Dá para colar o conteúdo em https://jsonlint.com para achar o problema.

## 4. Banco de dados (aba Dados)

Organizado como o IBGE: uma **pesquisa** por projeto (Elos, COPE, Bric Bac, SAGE), cada uma com metodologia, **aprovação no comitê de ética** e as **bases de dados**.

1. Coloque os arquivos na pasta `dados/<projeto>/` (ex.: `dados/elos/municipios.csv` e `dados/elos/parecer-cep.pdf`).
2. Em `data/pesquisas.json`, preencha a pesquisa: `metodologia`, `abrangencia` e `etica` (`comite`, `caae`, `parecer`, `data_aprovacao` e `documento`, que é o caminho do PDF do parecer). Para pesquisa sem seres humanos, use `"aplica": false`.
3. Cadastre cada base em `conjuntos`: `titulo`, `descricao`, `arquivo`, `formato`, `variaveis` (dicionário) e, se quiser, `visualizacoes`:
   - `grafico`: `categoria` (coluna para agrupar), `valor` (coluna numérica, opcional) e `agregacao` (`contagem`, `soma` ou `media`). O visitante também pode trocar essas opções na tela.
   - `mapa`: `lat`, `lon`, `rotulo` e `cor_por`. O mapa aparece sozinho quando a base tem colunas de latitude/longitude ou é um GeoJSON (polígonos de municípios, por exemplo).
4. Formatos aceitos para visualização: **CSV** (com vírgula ou ponto e vírgula; a primeira linha é o cabeçalho) e **GeoJSON**. Outros formatos (XLSX, SHP, PDF) podem ser listados só para baixar.

A base "capitais estaduais" é só um **exemplo de formato** (está marcada assim no site). Apague-a quando colocar o banco real do Elos.

**Atenção à privacidade:** publique apenas dados anonimizados e autorizados pelo comitê de ética e pelos termos de consentimento. Nada de nome, CPF, telefone ou endereço de participantes.

## 5. Biblioteca

Acervo com quatro tipos: **Publicações**, **Materiais didáticos**, **Audiovisual** e **Fotos de campo**. O visitante busca pelo título, autor ou palavra-chave e ordena por data (mais recentes ou mais antigos) ou por ordem alfabética (A–Z ou Z–A). Fotos, vídeos e áudios abrem numa janela dentro do site, com setas para passar de um para o outro.

1. Crie a pasta `biblioteca/` (com subpastas como `fotos/`, `didaticos/`, `publicacoes/`, `audiovisual/`) e suba os arquivos.
2. Cadastre cada item em `data/biblioteca.json`: `categoria` (`publicacao`, `didatico`, `audiovisual` ou `foto`), `titulo`, `data` (AAAA-MM-DD ou só AAAA), `autores`, `descricao` e `arquivo` (caminho do arquivo) **ou** `link` (endereço externo, como YouTube ou Google Drive).
3. As publicações de `publicacoes.json` com link (DOI) entram sozinhas na categoria Publicações.

Dicas: fotos em JPG de até ~500 KB (1600 px de largura bastam); vídeos longos é melhor pôr no YouTube e cadastrar só o `link`, porque o GitHub aceita arquivos de até 25 MB pelo navegador.

## 6. Agenda (ligada à Agenda Google do UNSEEL)

A aba **Agenda** mostra o calendário do mês e os próximos compromissos; os 4 próximos também aparecem na página inicial. Os compromissos vêm da **Agenda Google do e-mail do UNSEEL** e são atualizados sozinhos **a cada 3 horas**.

**Configurar (uma vez só):**
1. Na Agenda Google do UNSEEL (no computador), passe o mouse sobre a agenda na lista da esquerda → ⋮ → **Configurações e compartilhamento**.
2. Em **Permissões de acesso a eventos**, marque **Disponibilizar publicamente** e escolha **Ver todos os detalhes do evento**.
3. Mais abaixo, em **Integrar agenda**, copie o **Endereço público no formato iCal** (termina em `basic.ics`).
4. No GitHub, abra `data/agenda.json`, clique no lápis e cole o endereço entre as aspas de `"google_ics": ""`. Salve com **Commit changes**.

**Tipo de cada compromisso:** comece o título no Google com uma etiqueta entre colchetes: `[Reunião]`, `[Viagem]`, `[Organizamos]` ou `[Participamos]` (ex.: `[Viagem] Campo em Petrópolis`). A etiqueta define a cor no site e não aparece no título. Sem etiqueta, o site tenta adivinhar pelo título ou classifica como "Outros".

**Privacidade:** como a agenda fica pública, use-a só para o que pode ser visto por todos. O site retira automaticamente links de Google Meet, Zoom e Teams e ignora eventos marcados como **Particular** no Google. Compromissos pessoais devem ficar em outra agenda.

**Feriados:** o calendário mostra sozinho os feriados nacionais, o estadual de SP (9 de julho), os de São José dos Campos (19 de março e 27 de julho) e os pontos facultativos (Carnaval, Quarta de Cinzas, Corpus Christi, Dia do Servidor, vésperas de Natal e Ano-Novo). Em `data/agenda.json`, no bloco `feriados`, dá para esconder um grupo, acrescentar datas (`extras`) ou tirar datas (`remover`).

Também é possível cadastrar compromissos à mão em `data/agenda.json` (campo `eventos`), inclusive reuniões que se repetem (`"repetir": {"freq": "semanal", "ate": "2027-06-30"}`).

## 7. Área de membros (login, perfis e aprovação) — sem custo

Usa o plano gratuito do **Supabase** para contas e banco de dados. O GitHub "visita" o Supabase a cada 3 horas para ele não pausar por falta de uso.

**Configurar (uma vez):**
1. Em https://supabase.com clique em **Start your project** e entre (de preferência com o e-mail do UNSEEL). Crie um projeto **Free**, nome `unseel`, região **South America (São Paulo)**. Guarde a senha do banco num lugar seguro.
2. No projeto, abra **SQL Editor → New query**, cole todo o conteúdo de `supabase/etapa1.sql` e clique em **Run**.
3. **Authentication → Sign In / Providers → Email**: desligue **Confirm email** (a aprovação do coordenador já faz o controle). Salve.
4. **Authentication → URL Configuration**: em *Site URL* coloque `https://unseel-group.github.io/site/` e em *Redirect URLs* adicione `https://unseel-group.github.io/site/**`.
5. **Project Settings → API** (ou *API Keys*): copie a **Project URL** e a chave **anon / publishable**. No GitHub, edite `data/membros.json` e cole as duas. **Nunca** use a chave *service_role / secret*.
6. O Victor cria a conta em **Área de membros → Criar conta**. Depois, no **SQL Editor**, rode (com o e-mail dele):
   `update public.perfis set papel = 'coordenacao', status = 'aprovado' where email = 'email-do-victor@...';`
7. A partir daí, cada novo cadastro aparece para o Victor em **Área de membros → Equipe e permissões**.

**Etapa 2** (rode `supabase/etapa2.sql` no SQL Editor, uma vez): permissões por área (Biblioteca, Agenda, Banco de dados, Equipe, Projetos, Notícias), ano de entrada e defesa prevista no cadastro, LinkedIn e Google Acadêmico, situação **Concluído** (a pessoa deixa de editar e vira egressa), **Pessoas sem conta** (egressos cadastrados pela coordenação) e a lista pública que alimenta a página **Equipe** e a **linha do tempo**. Quem marcar "Mostrar meu perfil na página pública" aparece na Equipe; e-mails nunca são públicos.

Toda semana o GitHub também busca, pelo ORCID de cada pessoa, os indicadores do OpenAlex (trabalhos, citações, índice h) e as datas de formação registradas no ORCID. **O cadastro sempre prevalece.** Para quem ainda está no grupo, as datas do ORCID são só sugestão no formulário; para quem **já defendeu**, se o ano de entrada ou de defesa estiver em branco, a linha do tempo usa o ORCID automaticamente. A defesa *prevista* nunca aparece no site público: é só para o cadastro e a coordenação.

## 8. Português e inglês

O site tem as duas línguas. O visitante escolhe na abertura ("Tirar a venda" ou "Remove the blindfold") e pode trocar depois pelos botões PT/EN no cabeçalho. Nos arquivos de `data/`, os campos terminados em `_en` são a versão em inglês (ex.: `missao` e `missao_en`). Se um campo `_en` estiver vazio, aparece o texto em português. Títulos de publicações e notícias aparecem no idioma original.

## 9. Abertura

A abertura com o falcão de tapa-olho aparece só na página inicial, uma vez por visita (ao fechar e reabrir o navegador, aparece de novo). Quem chega por um link direto (ex.: `.../#/equipe`) vai direto ao conteúdo.

## 10. Logo

Os arquivos do kit estão em `assets/logo/` (cor, negativo e mono; símbolo, horizontal, completa e avatar). Os textos das versões com tipografia usam a fonte Montserrat. Para uso em gráficas, converta o texto em curvas.

## 11. Atividades (estilo ClickUp) — etapa 3

Na Área de membros, a aba **Atividades** substitui o ClickUp: cada pessoa cria as próprias atividades com data, horário, situação (A fazer, Em andamento, Em revisão, Concluída), prioridade, participantes marcados com @, link do Meet, comentários e anexos. Dá para ver em **Lista**, **Quadro** (arrastar entre colunas) ou **Calendário**. Todos os membros aprovados veem as atividades do grupo; a coordenação edita, comenta e cria atividades para qualquer pessoa.

**Ligar no Supabase (uma vez só):**

1. **SQL Editor → New query**: cole o conteúdo de `supabase/etapa3.sql` e clique em **Run**.
2. **Edge Functions → Deploy a new function → Via Editor**. Dê o nome `agenda-ics`, apague o código de exemplo, cole o conteúdo de `supabase/functions/agenda-ics/index.ts` e clique em **Deploy**.
3. Ainda na função `agenda-ics`, abra **Details** (ou Settings) e **desligue** a opção de verificar JWT ("Enforce JWT verification" / "Verify JWT"). Salve. Sem isso o Google Agenda não consegue ler o link.

**Google Agenda (mão única: site → agenda pessoal):** na aba Atividades, botão **Ligar ao meu Google Agenda**. Cada pessoa copia o seu link e adiciona no Google Agenda em *Outras agendas → Do URL*. O Google atualiza sozinho de algumas em algumas horas. O que está na agenda pessoal nunca vem para o site.

**Agenda pública:** quem é da coordenação ou tem a permissão **Agenda** pode marcar "Mostrar na agenda pública do site" numa atividade. Título, data, horário, local e detalhes aparecem na página Agenda; Meet, comentários e anexos não.

**Anexos:** até 10 MB por arquivo (o plano gratuito tem 1 GB no total). Para arquivos maiores, use o Google Drive e anexe o link.

## 12. Botões de compartilhar

Em **Publicações**, **Na mídia** e **Biblioteca**, cada item tem botões de **WhatsApp**, **Instagram** e **Copiar link**. No celular, o botão do Instagram abre o menu de compartilhar do aparelho (de onde se escolhe Instagram, story etc.). No computador, ele copia o link para colar no Instagram, porque o Instagram não aceita compartilhamento direto pelo navegador.
