#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.
"""Relatório de visitas do site (Umami Cloud, link de partilha só de leitura).

Uso:
  MILREU_UMAMI_SHARE=<url-ou-id-de-partilha> python3 scripts/analytics/umami_report.py \
      --start 2026-10-14 --end 2026-10-20 --out <ficheiro.md>

O link de partilha NÃO é versionado (quem o tiver vê as estatísticas): vem só da variável de ambiente.
Funil (visitantes únicos no período):
  visita → Museu (qualquer página /museu…) | Agenda (/exposicoes…) | Inquérito (sessões com o evento
  funil-inquerito = clique no link do SurveyMonkey).
Datas em Europe/Lisbon. Só stdlib.
"""
import argparse, json, os, sys, urllib.request, urllib.parse
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

GATEWAY = "https://gateway-eu.umami.is/api"
TZ = ZoneInfo("Europe/Lisbon")
WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]


def get(path, token=None, params=None):
    url = f"{GATEWAY}/{path}" + (f"?{urllib.parse.urlencode(params)}" if params else "")
    req = urllib.request.Request(url, headers={"User-Agent": "milreu-report/1"})
    if token:
        req.add_header("x-umami-share-token", token)
        req.add_header("x-umami-share-context", "1")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", required=True, help="AAAA-MM-DD (inclusive, Lisboa)")
    ap.add_argument("--end", required=True, help="AAAA-MM-DD (inclusive, Lisboa)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--json-out")
    a = ap.parse_args()
    share = os.environ.get("MILREU_UMAMI_SHARE", "").rstrip("/").split("/")[-1]
    if not share:
        sys.exit("Falta MILREU_UMAMI_SHARE (link de partilha do Umami).")
    s = get(f"share/{share}")
    token, site = s["token"], s["websiteId"]
    start = datetime.fromisoformat(a.start).replace(tzinfo=TZ)
    end = datetime.fromisoformat(a.end).replace(tzinfo=TZ) + timedelta(days=1) - timedelta(milliseconds=1)
    rng = {"startAt": int(start.timestamp() * 1000), "endAt": int(end.timestamp() * 1000)}
    W = f"websites/{site}"

    stats = get(f"{W}/stats", token, rng)
    def visitors(**flt):
        return get(f"{W}/stats", token, {**rng, **flt})["visitors"]
    def event_sessions(name):
        return get(f"{W}/sessions", token, {**rng, "event": name, "pageSize": 1})["count"]
    def metric(kind, limit=15):
        return get(f"{W}/metrics", token, {**rng, "type": kind, "limit": limit})

    total = stats["visitors"]
    funnel = [
        ("Museu de Memórias (qualquer página /museu…)", visitors(path="c./museu")),
        ("Agenda da exposição (/exposicoes…)", visitors(path="c./exposicoes")),
        ("Inquérito 2026 (clique no SurveyMonkey)", event_sessions("funil-inquerito")),
    ]
    sessions = get(f"{W}/sessions", token, {**rng, "pageSize": 500})["data"]
    hours, days = [0] * 24, [0] * 7
    for ses in sessions:
        t = datetime.fromisoformat(ses["firstAt"].replace("Z", "+00:00")).astimezone(TZ)
        hours[t.hour] += 1
        days[(t.weekday() + 1) % 7] += 1
    # Sinais de tráfego automático (não é exclusão automática; fica para decisão humana).
    suspects = [x for x in sessions if x.get("screen") == "2000x2000" or (x.get("country") == "SE" and x.get("city") == "Luleå")]

    data = {"period": [a.start, a.end], "stats": stats, "funnel": funnel,
            "pages": metric("path"), "referrers": metric("referrer"), "countries": metric("country"),
            "cities": metric("city"), "devices": metric("device"), "events": metric("event"),
            "hours": hours, "days": days, "sessions": len(sessions), "suspects": len(suspects)}
    if a.json_out:
        json.dump(data, open(a.json_out, "w"), ensure_ascii=False, indent=2)

    pct = lambda n: f"{(100 * n / total):.0f} %" if total else "—"
    rows = lambda items, label: "\n".join(f"| {i['x'] or '(directo)'} | {i['y']} |" for i in items) or f"| (sem {label}) | 0 |"
    peak = max(range(24), key=lambda h: hours[h]) if any(hours) else None
    md = f"""# Relatório de visitas — projectomilreu.pt

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.

**Período:** {a.start} a {a.end} (hora de Lisboa) · **Fonte:** Umami Cloud (sem cookies, dados na UE) · gerado {datetime.now(TZ):%Y-%m-%d %H:%M}

## Resumo
| Indicador | Valor |
|---|---|
| Visitantes únicos | **{total}** |
| Visitas (sessões) | {stats['visits']} |
| Páginas vistas | {stats['pageviews']} |
| Taxa de rejeição (só 1 página) | {pct(stats['bounces']) if stats['visits'] else '—'} das visitas |
| Tempo total | {stats['totaltime']} s |

## Funil — visitantes únicos
| Passo | Visitantes | % dos visitantes |
|---|---|---|
| Visita ao site | {total} | 100 % |
""" + "\n".join(f"| → {name} | {n} | {pct(n)} |" for name, n in funnel) + f"""

*Os passos não são exclusivos: a mesma pessoa pode ir ao Museu e à Agenda.*

## De onde vêm
### Sites de origem
| Origem | Visitantes |
|---|---|
{rows(data['referrers'], 'origem')}

### Países
| País | Visitantes |
|---|---|
{rows(data['countries'], 'país')}

### Cidades
| Cidade | Visitantes |
|---|---|
{rows(data['cities'], 'cidade')}

## Quando
Início das visitas por hora (Lisboa): {', '.join(f'{h}h={n}' for h, n in enumerate(hours) if n) or 'sem visitas'}.
{f'Hora de maior procura: **{peak}h**.' if peak is not None else ''}
Por dia da semana: {', '.join(f'{WEEKDAYS[d]}={n}' for d, n in enumerate(days) if n) or 'sem visitas'}.

## Páginas mais vistas
| Página | Visualizações |
|---|---|
{rows(data['pages'], 'páginas')}

## Notas de leitura
- Visitantes únicos = estimativa diária sem cookies (não identifica pessoas).
- Não conta: quem pede «Do Not Track», a Área Colaborativa e navegadores automatizados (o Umami descarta-os).
- **Possível tráfego automático:** {len(suspects)} de {len(sessions)} sessões com sinais de robô (ex.: pré-visualização de links do Facebook, Luleå/Suécia, ecrã 2000×2000). Não foram retiradas dos números; avaliar.
- Visitas de teste do projecto (equipa/Claude) não são separáveis automaticamente; ver o handoff do Item 2.
"""
    open(a.out, "w").write(md)
    print(f"OK {a.out}: {total} visitantes, funil {[n for _, n in funnel]}, suspeitas {len(suspects)}")


if __name__ == "__main__":
    main()
