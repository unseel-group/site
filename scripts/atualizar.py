#!/usr/bin/env python3
"""Atualiza automaticamente os dados do site do UNSEEL.

- data/publicacoes.json: publicações de cada membro da equipe que tem ORCID,
  buscadas no OpenAlex (base aberta que reúne Crossref, ORCID, PubMed etc.).
- data/midia.json: notícias e entrevistas que citam o coordenador, buscadas no
  Google Notícias (RSS).

Roda toda semana pelo GitHub Actions (.github/workflows/publicar.yml), mas
também pode ser rodado à mão:  python3 scripts/atualizar.py
Usa só a biblioteca padrão do Python 3.9+.
"""
import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date
from email.utils import parsedate_to_datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "data")
EMAIL = os.environ.get("OPENALEX_EMAIL", "").strip()
DESDE = os.environ.get("PUBLICACOES_DESDE", "2015-01-01")
UA = "UNSEEL-site/1.0 (atualizacao semanal de publicacoes)"

TIPOS = {
    "article": "artigo", "review": "artigo", "letter": "artigo", "editorial": "artigo",
    "book-chapter": "capitulo", "book": "livro", "dataset": "dados",
    "preprint": "preprint", "dissertation": "tese", "report": "relatorio",
}


# ---------- utilidades ----------

def ler(nome, padrao=None):
    caminho = os.path.join(DADOS, nome)
    if not os.path.exists(caminho):
        return padrao
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def gravar(nome, obj):
    with open(os.path.join(DADOS, nome), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
        f.write("\n")


def baixar(url, tentativas=3):
    ultimo = None
    for i in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            ultimo = e
            time.sleep(2 * (i + 1))
    raise RuntimeError(f"falha ao baixar {url}: {ultimo}")


def norm(texto):
    texto = unicodedata.normalize("NFKD", texto or "")
    return "".join(c for c in texto if not unicodedata.combining(c)).lower()


def limpar_html(texto):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", texto or "")).strip()


def projetos_por_texto(texto, projetos):
    """Liga um texto aos projetos cujas palavras-chave aparecem nele.

    Siglas curtas em maiúsculas (ex.: SAGE, COPE) só valem como palavra inteira
    e com a mesma caixa, para não confundir com 'message' ou 'coping'.
    As demais valem no início de palavra, sem diferenciar acentos e caixa.
    """
    achados = []
    base = norm(texto)
    for p in projetos:
        for k in p.get("palavras_chave", []):
            k = k.strip()
            if not k:
                continue
            if k.isupper() and len(k.replace(" ", "")) <= 8:
                ok = re.search(r"(?<![A-Za-z0-9])" + re.escape(k) + r"(?![A-Za-z0-9])", texto or "")
            else:
                ok = re.search(r"(?<![a-z0-9])" + re.escape(norm(k)), base)
            if ok:
                achados.append(p["id"])
                break
    return achados


# ---------- publicações (OpenAlex) ----------

def obras_do_orcid(orcid):
    obras, cursor = [], "*"
    campos = "id,doi,display_name,publication_year,publication_date,type,primary_location,authorships"
    while cursor:
        params = {
            "filter": f"author.orcid:https://orcid.org/{orcid},from_publication_date:{DESDE}",
            "per_page": "200", "cursor": cursor, "select": campos,
        }
        if EMAIL:
            params["mailto"] = EMAIL
        url = "https://api.openalex.org/works?" + urllib.parse.urlencode(params)
        dados = json.loads(baixar(url))
        obras.extend(dados.get("results", []))
        cursor = dados.get("meta", {}).get("next_cursor")
        if not dados.get("results"):
            break
        time.sleep(0.3)
    return obras


def atualizar_publicacoes():
    equipe = ler("equipe.json", {"membros": []})["membros"]
    projetos = ler("projetos.json", {"projetos": []})["projetos"]
    anterior = ler("publicacoes.json", {"itens": []})
    antigos = {i["id"]: i for i in anterior.get("itens", [])}

    novos, falharam = {}, set()
    for m in equipe:
        orcid = (m.get("orcid") or "").strip().replace("https://orcid.org/", "")
        if not re.fullmatch(r"\d{4}-\d{4}-\d{4}-\d{3}[\dX]", orcid):
            continue
        try:
            obras = obras_do_orcid(orcid)
            print(f"  {m['nome']}: {len(obras)} obras")
        except Exception as e:  # noqa: BLE001
            print(f"  ! {m['nome']}: {e}", file=sys.stderr)
            falharam.add(m["id"])
            continue
        for w in obras:
            doi = (w.get("doi") or "").lower()
            chave = doi.replace("https://doi.org/", "doi:") if doi else w["id"].rsplit("/", 1)[-1]
            item = novos.get(chave)
            if item is None:
                loc = w.get("primary_location") or {}
                fonte = (loc.get("source") or {}).get("display_name") or ""
                nomes = [a.get("author", {}).get("display_name", "") for a in w.get("authorships", [])]
                autores_texto = ", ".join(n for n in nomes[:6] if n) + (" et al." if len(nomes) > 6 else "")
                titulo = limpar_html(w.get("display_name"))
                if not titulo:
                    continue
                item = {
                    "id": chave,
                    "titulo": titulo,
                    "ano": w.get("publication_year"),
                    "data": w.get("publication_date") or "",
                    "tipo": TIPOS.get(w.get("type"), "outro"),
                    "veiculo": fonte,
                    "url": w.get("doi") or loc.get("landing_page_url") or w["id"],
                    "autores_texto": autores_texto,
                    "autores": [],
                    "projetos": projetos_por_texto(titulo, projetos),
                    "origem": "openalex",
                }
                velho = antigos.get(chave, {})
                for campo in ("oculto", "projetos_extra"):  # ajustes feitos à mão
                    if campo in velho:
                        item[campo] = velho[campo]
                novos[chave] = item
            if m["id"] not in item["autores"]:
                item["autores"].append(m["id"])

    # se a busca de alguém falhou, mantém o que já tinha dessa pessoa
    for chave, velho in antigos.items():
        if chave not in novos and set(velho.get("autores", [])) & falharam:
            novos[chave] = velho

    if not novos and antigos:
        print("  nenhuma publicação nova obtida; mantendo arquivo anterior")
        return
    itens = sorted(novos.values(), key=lambda i: (i.get("data") or str(i.get("ano") or "")), reverse=True)
    gravar("publicacoes.json", {
        "_como_editar": "Gerado automaticamente. Para esconder um item, use \"oculto\": true. "
                        "Para ligar a um projeto à mão, use \"projetos_extra\": [\"id-do-projeto\"]. "
                        "Esses dois campos são preservados nas próximas atualizações.",
        "atualizado_em": date.today().isoformat(),
        "itens": itens,
    })
    print(f"publicacoes.json: {len(itens)} itens")


# ---------- mídia (Google Notícias) ----------

def buscar_noticias(termo, hl, gl, ceid):
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": termo, "hl": hl, "gl": gl, "ceid": ceid})
    raiz = ET.fromstring(baixar(url))
    for it in raiz.iter("item"):
        titulo = (it.findtext("title") or "").strip()
        fonte = (it.findtext("source") or "").strip()
        if fonte and titulo.endswith(" - " + fonte):
            titulo = titulo[: -len(" - " + fonte)].strip()
        data = ""
        try:
            data = parsedate_to_datetime(it.findtext("pubDate")).date().isoformat()
        except Exception:  # noqa: BLE001
            pass
        yield {"titulo": titulo, "fonte": fonte, "data": data, "url": (it.findtext("link") or "").strip()}


def atualizar_midia():
    coord = ler("coordenador.json", {})
    projetos = ler("projetos.json", {"projetos": []})["projetos"]
    atual = ler("midia.json", {"itens": []})
    itens = atual.get("itens", [])
    vistos = {norm(i["titulo"]) for i in itens} | {i.get("url") for i in itens}

    novos = 0
    for termo in coord.get("busca_midia", []):
        for idioma in (("pt-BR", "BR", "BR:pt-419"), ("en-US", "US", "US:en"), ("es-419", "MX", "MX:es-419")):
            try:
                resultados = list(buscar_noticias(termo, *idioma))
            except Exception as e:  # noqa: BLE001
                print(f"  ! notícias '{termo}' {idioma[0]}: {e}", file=sys.stderr)
                continue
            for n in resultados:
                if not n["titulo"] or norm(n["titulo"]) in vistos or n["url"] in vistos:
                    continue
                vistos.update({norm(n["titulo"]), n["url"]})
                itens.append({
                    **n, "tipo": "noticia", "pessoas": [coord.get("id", "")],
                    "projetos": projetos_por_texto(n["titulo"], projetos),
                    "origem": "google-noticias", "oculto": False,
                })
                novos += 1
            time.sleep(1)

    itens.sort(key=lambda i: i.get("data") or "", reverse=True)
    atual["itens"] = itens
    atual["atualizado_em"] = date.today().isoformat()
    gravar("midia.json", atual)
    print(f"midia.json: {novos} novos, {len(itens)} no total")


if __name__ == "__main__":
    for etapa in (atualizar_publicacoes, atualizar_midia):
        try:
            etapa()
        except Exception as e:  # noqa: BLE001
            print(f"! {etapa.__name__} falhou: {e}", file=sys.stderr)
