// UNSEEL · função "agenda-ics"
// Gera o link de agenda (.ics) que cada pessoa assina no Google Agenda.
// O caminho é só um: site → Google. Nada da agenda pessoal volta para o site.
// Como instalar: veja a seção 11 do LEIA-ME.

const SITE = "https://unseel-group.github.io/site/#/membros";
const STATUS: Record<string, string> = { a_fazer: "A fazer", andamento: "Em andamento", revisao: "Em revisão", concluida: "Concluída" };

function esc(s: string) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}
function dobra(linha: string) {          // linhas de no máximo 75 caracteres
  const out: string[] = [];
  let l = linha;
  while (l.length > 74) { out.push(l.slice(0, 74)); l = " " + l.slice(74); }
  out.push(l);
  return out.join("\r\n");
}
const d8 = (iso: string) => iso.replaceAll("-", "");
const t6 = (h: string) => h.slice(0, 5).replace(":", "") + "00";
function maisUmDia(iso: string) {
  const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
function maisUmaHora(h: string) {
  const [hh, mm] = h.split(":").map(Number);
  return String(Math.min(hh + 1, 23)).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const token = u.searchParams.get("t") || "";
  const todas = u.searchParams.get("todas") === "1";
  if (!/^[0-9a-f-]{36}$/i.test(token)) return new Response("Link inválido.", { status: 400 });

  const base = Deno.env.get("SUPABASE_URL")!;
  const chave = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const r = await fetch(base + "/rest/v1/rpc/agenda_ics_dados", {
    method: "POST",
    headers: { apikey: chave, Authorization: "Bearer " + chave, "Content-Type": "application/json" },
    body: JSON.stringify({ t: token, todas }),
  });
  if (!r.ok) return new Response("Erro ao ler a agenda.", { status: 502 });
  const lista = await r.json();

  const agora = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const L: string[] = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//UNSEEL//Atividades//PT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:" + (todas ? "UNSEEL · todas as atividades" : "UNSEEL · minhas atividades"),
    "X-WR-TIMEZONE:America/Sao_Paulo", "REFRESH-INTERVAL;VALUE=DURATION:PT1H", "X-PUBLISHED-TTL:PT1H",
    "BEGIN:VTIMEZONE", "TZID:America/Sao_Paulo", "BEGIN:STANDARD", "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0300", "TZOFFSETTO:-0300", "TZNAME:-03", "END:STANDARD", "END:VTIMEZONE",
  ];
  for (const a of lista) {
    const fim = a.fim || a.inicio;
    const ini = a.hora_inicio
      ? "DTSTART;TZID=America/Sao_Paulo:" + d8(a.inicio) + "T" + t6(a.hora_inicio)
      : "DTSTART;VALUE=DATE:" + d8(a.inicio);
    const ter = a.hora_inicio
      ? "DTEND;TZID=America/Sao_Paulo:" + d8(fim) + "T" + t6(a.hora_fim || maisUmaHora(a.hora_inicio))
      : "DTEND;VALUE=DATE:" + d8(maisUmDia(fim));
    const desc = [
      a.descricao,
      "Situação: " + (STATUS[a.status] || a.status),
      todas && a.responsavel ? "Responsável: " + a.responsavel : "",
      a.link_meet ? "Meet: " + a.link_meet : "",
      "Abrir no site: " + SITE,
    ].filter(Boolean).join("\n");
    L.push("BEGIN:VEVENT", "UID:" + a.id + "@unseel", "DTSTAMP:" + agora,
      "LAST-MODIFIED:" + String(a.atualizado_em).replace(/[-:]/g, "").slice(0, 15) + "Z",
      ini, ter, "SUMMARY:" + esc((a.status === "concluida" ? "✓ " : "") + a.titulo), "DESCRIPTION:" + esc(desc));
    if (a.local) L.push("LOCATION:" + esc(a.local));
    if (a.link_meet) L.push("URL:" + a.link_meet);
    L.push("END:VEVENT");
  }
  L.push("END:VCALENDAR");
  return new Response(L.map(dobra).join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "max-age=900", "Access-Control-Allow-Origin": "*" },
  });
});
