#!/usr/bin/env python3
"""Traz os compromissos da Agenda Google do UNSEEL para data/agenda-google.json.

Usa o "endereço público no formato iCal" da agenda, informado em
data/agenda.json no campo "google_ics". Roda pelo GitHub Actions a cada 3 horas
(.github/workflows/publicar.yml), mas pode ser rodado à mão:
    python3 scripts/agenda.py
Só usa a biblioteca padrão do Python 3.9+.

Tipo do compromisso: escreva no começo do título, entre colchetes, um destes:
[Reunião] [Viagem] [Organizamos] [Participamos]  (ou [Meeting] [Trip] [Hosting] [Attending]).
Sem marcação, o site tenta adivinhar pelo título (ex.: "reunião", "campo", "viagem").
Links de videochamada (Meet, Zoom, Teams) são retirados, porque o site é público.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone

try:
    from zoneinfo import ZoneInfo
except ImportError:  # Python < 3.9
    ZoneInfo = None

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DADOS = os.path.join(RAIZ, "data")
FUSO = "America/Sao_Paulo"
JANELA_ANTES, JANELA_DEPOIS = 365, 400  # dias

TIPOS = [
    ("reuniao", r"reuni[aã]o|meeting|semin[aá]rio interno|encontro do grupo"),
    ("viagem", r"viagem|trabalho de campo|\bcampo\b|trip|fieldwork|visita t[eé]cnica"),
    ("organizado", r"organizamos|organiza[cç][aã]o|hosting|promovido pelo|realiza[cç][aã]o unseel"),
    ("participacao", r"participamos|participa[cç][aã]o|attending|apresenta[cç][aã]o|congresso|simp[oó]sio|confer[eê]ncia|workshop|webin[aá]rio"),
]
VIDEO = re.compile(r"(https?://\S*(meet\.google|zoom\.us|teams\.microsoft|teams\.live|webex)\S*)", re.I)


def fuso():
    return ZoneInfo(FUSO) if ZoneInfo else timezone(timedelta(hours=-3))


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": "UNSEEL-site/1.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def desdobrar(texto):
    linhas = []
    for l in texto.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if l.startswith((" ", "\t")) and linhas:
            linhas[-1] += l[1:]
        else:
            linhas.append(l)
    return linhas


def desescapar(v):
    return v.replace("\\n", "\n").replace("\\N", "\n").replace("\\,", ",").replace("\\;", ";").replace("\\\\", "\\")


def ler_eventos(texto):
    eventos, atual = [], None
    for l in desdobrar(texto):
        if l == "BEGIN:VEVENT":
            atual = {}
        elif l == "END:VEVENT":
            if atual is not None:
                eventos.append(atual)
            atual = None
        elif atual is not None and ":" in l:
            chave, valor = l.split(":", 1)
            nome, *params = chave.split(";")
            p = dict(x.split("=", 1) for x in params if "=" in x)
            atual.setdefault(nome.upper(), []).append((p, valor))
    return eventos


def quando(campo):
    """Devolve (datetime local ou date, dia_inteiro)."""
    p, v = campo
    v = v.strip()
    if p.get("VALUE") == "DATE" or re.fullmatch(r"\d{8}", v):
        return date(int(v[:4]), int(v[4:6]), int(v[6:8])), True
    dt = datetime.strptime(v[:15], "%Y%m%dT%H%M%S")
    if v.endswith("Z"):
        dt = dt.replace(tzinfo=timezone.utc).astimezone(fuso())
    elif "TZID" in p and ZoneInfo:
        try:
            dt = dt.replace(tzinfo=ZoneInfo(p["TZID"])).astimezone(fuso())
        except Exception:  # noqa: BLE001
            dt = dt.replace(tzinfo=fuso())
    else:
        dt = dt.replace(tzinfo=fuso())
    return dt, False


def so_data(x):
    return x if isinstance(x, date) and not isinstance(x, datetime) else x.date()


DIAS = {"MO": 0, "TU": 1, "WE": 2, "TH": 3, "FR": 4, "SA": 5, "SU": 6}


def repeticoes(inicio, regra, limite):
    """Expande uma RRULE simples (DAILY/WEEKLY/MONTHLY/YEARLY, INTERVAL, COUNT, UNTIL, BYDAY semanal)."""
    r = dict(x.split("=", 1) for x in regra.split(";") if "=" in x)
    freq, passo = r.get("FREQ", ""), int(r.get("INTERVAL", "1"))
    conta = int(r["COUNT"]) if "COUNT" in r else None
    ate = None
    if "UNTIL" in r:
        u = r["UNTIL"]
        ate = date(int(u[:4]), int(u[4:6]), int(u[6:8]))
    ate = min(ate, limite) if ate else limite
    d0 = so_data(inicio)
    saida = []
    if freq == "WEEKLY":
        dias = sorted(DIAS[x[-2:]] for x in r.get("BYDAY", "").split(",") if x[-2:] in DIAS) or [d0.weekday()]
        semana = d0 - timedelta(days=d0.weekday())
        while semana <= ate and (conta is None or len(saida) < conta):
            for wd in dias:
                d = semana + timedelta(days=wd)
                if d < d0 or d > ate or (conta is not None and len(saida) >= conta):
                    continue
                saida.append(d)
            semana += timedelta(weeks=passo)
    elif freq in ("DAILY", "MONTHLY", "YEARLY"):
        k = 0
        while (conta is None or len(saida) < conta) and k < 5000:
            if freq == "DAILY":
                d = d0 + timedelta(days=passo * k)
            else:
                a, m = divmod(d0.month - 1 + passo * k * (12 if freq == "YEARLY" else 1), 12)
                try:
                    d = date(d0.year + a, m + 1, d0.day)
                except ValueError:  # ex.: dia 31 em mês curto: pula esse mês
                    k += 1
                    continue
            if d > ate:
                break
            saida.append(d)
            k += 1
    else:
        saida.append(d0)
    return saida


def tipo_e_titulo(titulo):
    m = re.match(r"\s*\[([^\]]+)\]\s*(.*)", titulo)
    rotulo, resto = (m.group(1), m.group(2)) if m else ("", titulo)
    alvo = (rotulo or titulo).lower()
    for tipo, padrao in TIPOS:
        if re.search(padrao, alvo, re.I):
            return tipo, resto.strip() or titulo
    return "outro", resto.strip() or titulo


def limpar_descricao(texto):
    texto = VIDEO.sub("", desescapar(texto or ""))
    linhas = [l for l in texto.split("\n") if not re.search(r"(google meet|videochamada|video call|join with|participar com|dial-in|PIN:|meet\.google)", l, re.I)]
    texto = re.sub(r"<[^>]+>", " ", "\n".join(linhas))
    return re.sub(r"\s+\n", "\n", re.sub(r"[ \t]+", " ", texto)).strip()[:600]


def main():
    cfg = json.load(open(os.path.join(DADOS, "agenda.json"), encoding="utf-8"))
    url = (cfg.get("google_ics") or "").strip()
    if not url.startswith("https://"):
        print("agenda: campo google_ics vazio em data/agenda.json; nada a fazer")
        return
    eventos = ler_eventos(baixar(url))
    hoje = date.today()
    ini, fim = hoje - timedelta(days=JANELA_ANTES), hoje + timedelta(days=JANELA_DEPOIS)

    substituidos = {}  # UID -> datas com versão própria (RECURRENCE-ID)
    for e in eventos:
        if "RECURRENCE-ID" in e:
            substituidos.setdefault(e["UID"][0][1], set()).add(so_data(quando(e["RECURRENCE-ID"][0])[0]))

    saida = []
    for e in eventos:
        if "DTSTART" not in e or e.get("STATUS", [({}, "")])[0][1].upper() == "CANCELLED":
            continue
        if e.get("CLASS", [({}, "PUBLIC")])[0][1].upper() in ("PRIVATE", "CONFIDENTIAL"):
            continue
        comeco, dia_todo = quando(e["DTSTART"][0])
        termino = quando(e["DTEND"][0])[0] if "DTEND" in e else comeco
        dur = so_data(termino) - so_data(comeco)
        if dia_todo and dur.days >= 1:
            dur -= timedelta(days=1)  # no iCal o fim de dia inteiro é exclusivo
        titulo = desescapar(e.get("SUMMARY", [({}, "(sem título)")])[0][1])
        tipo, titulo = tipo_e_titulo(titulo)
        hora = "" if dia_todo else comeco.strftime("%Hh%M").replace("h00", "h") + (
            "–" + termino.strftime("%Hh%M").replace("h00", "h") if termino != comeco and not dur.days else "")
        uid = e.get("UID", [({}, "")])[0][1]
        excluidas = set()
        for p, v in e.get("EXDATE", []):
            for parte in v.split(","):
                excluidas.add(so_data(quando((p, parte))[0]))
        if "RRULE" in e and "RECURRENCE-ID" not in e:
            datas = repeticoes(comeco, e["RRULE"][0][1], fim)
            datas = [d for d in datas if d not in excluidas and d not in substituidos.get(uid, set())]
        else:
            datas = [so_data(comeco)]
        base = {
            "titulo": titulo, "tipo": tipo, "hora": hora,
            "local": desescapar(e.get("LOCATION", [({}, "")])[0][1]).strip(),
            "descricao": limpar_descricao(e.get("DESCRIPTION", [({}, "")])[0][1]),
            "link": next((v for p, v in e.get("URL", []) if v.startswith("http") and not VIDEO.search(v)), ""),
            "origem": "google",
        }
        if VIDEO.search(base["local"]):
            base["local"] = ""
        for d in datas:
            if d + dur < ini or d > fim:
                continue
            ev = dict(base, inicio=d.isoformat())
            if dur.days:
                ev["fim"] = (d + dur).isoformat()
            saida.append(ev)

    saida.sort(key=lambda x: (x["inicio"], x["hora"]))
    m = re.search(r"/calendar/ical/([^/]+)/", url)
    assinar = "https://calendar.google.com/calendar/embed?src=" + m.group(1) + "&ctz=" + urllib.parse.quote(FUSO) if m else ""
    with open(os.path.join(DADOS, "agenda-google.json"), "w", encoding="utf-8") as f:
        json.dump({"atualizado_em": datetime.now(fuso()).strftime("%Y-%m-%d %H:%M"), "assinar": assinar, "eventos": saida}, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"agenda-google.json: {len(saida)} compromissos")


if __name__ == "__main__":
    try:
        main()
    except Exception as erro:  # noqa: BLE001
        print(f"! agenda falhou: {erro}", file=sys.stderr)
