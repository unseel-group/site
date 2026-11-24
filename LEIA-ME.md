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

## 5. Português e inglês

O site tem as duas línguas. O visitante escolhe na abertura ("Tirar a venda" ou "Remove the blindfold") e pode trocar depois pelos botões PT/EN no cabeçalho. Nos arquivos de `data/`, os campos terminados em `_en` são a versão em inglês (ex.: `missao` e `missao_en`). Se um campo `_en` estiver vazio, aparece o texto em português. Títulos de publicações e notícias aparecem no idioma original.

## 6. Abertura

A abertura com o falcão de tapa-olho aparece só na página inicial, uma vez por visita (ao fechar e reabrir o navegador, aparece de novo). Quem chega por um link direto (ex.: `.../#/equipe`) vai direto ao conteúdo.

## 7. Logo

Os arquivos do kit estão em `assets/logo/` (cor, negativo e mono; símbolo, horizontal, completa e avatar). Os textos das versões com tipografia usam a fonte Montserrat. Para uso em gráficas, converta o texto em curvas.
