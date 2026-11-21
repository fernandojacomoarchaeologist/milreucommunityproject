#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Verificador mecânico da skill escrita-sem-sinais-ia.

Uso: verificar_texto.py <ficheiro .md|.txt|.docx> [--json]
Saída: 0 sem ocorrências críticas; 2 com ocorrências críticas; 3 erro de uso.
Não corrige nada: produz uma lista para revisão humana.
"""
import json
import re
import sys
import zipfile

# Grafia AO90 onde o projecto usa pré-AO90 (palavra -> forma pré-AO90)
AO90 = {
    r"projetos?": "projecto(s)", r"projet(ar|ado|ada|ados|adas)": "project-",
    r"atividades?": "actividade(s)", r"ativ[oa]s?": "activo/a", r"atua(l|is)": "actual/actuais",
    r"atualmente": "actualmente", r"objetivos?": "objectivo(s)", r"obje(to|tos)": "objecto(s)",
    r"cole(ção|ções)": "colecção/ões", r"sele(ção|ções)": "selecção/ões", r"prote(ção|ções)": "protecção",
    r"dire(ção|ções)": "direcção", r"a(ção|ções)": "acção/acções", r"arquitetur\w*": "arquitectura",
    r"arquitetónic\w*": "arquitectónico", r"diretor(es|a|as)?": "director", r"coletiv\w*": "colectivo",
    r"exat[oa]s?": "exacto/a", r"exatamente": "exactamente", r"efetiv\w*": "efectivo",
    r"perspetiva\w*": "perspectiva", r"aspetos?": "aspecto(s)", r"respetiv\w*": "respectivo",
    r"letiv[oa]s?": "lectivo/a", r"ótim[oa]s?": "óptimo/a", r"receção": "recepção",
    r"conceção": "concepção", r"interven(ção)": "(ok: intervenção mantém-se)",
}
AO90_OK = {"intervenção", "intervenções", "ação"}  # 'ação' tratado abaixo; intervenção é igual nas duas normas
AO90.pop(r"interven(ção)")

PTBR = {
    r"equipe": "equipa", r"registr(o|os|ar|ado|ada)": "registo/registar", r"contat(o|os|ar)": "contacto/contactar",
    r"usuári[oa]s?": "utilizador", r"celular(es)?": "telemóvel", r"planejament\w*": "planeamento",
    r"planej(ar|ado|ada)": "planear", r"conosco": "connosco", r"ensino fundamental": "1.º/2.º ciclo",
    r"ônibus": "autocarro", r"fatura(s)?": "factura (pré-AO90)", r"time": "equipa (se for o sentido)",
}

SINAIS = [
    "além disso", "por outro lado", "dessa forma", "desta forma", "nesse sentido", "neste sentido", "ademais",
    "por conseguinte", "em suma", "em conclusão", "é importante", "vale ressaltar", "vale a pena referir",
    "cabe mencionar", "cumpre salientar", "convém observar", "importa referir", "importa salientar",
    "crucial", "fundamental", "vital", "notável", "revolucionári", "transformador", "inovador", "inovadora",
    "extraordinári", "impressionante", "ecossistema", "jornada", "pilares", "resiliência", "disrupção",
    "empoderamento", "holístic", "multifacetad", "sinergia", "papel fundamental", "desempenha um papel",
    "rico património", "riquíssimo", "potenciar", "alavancar", "impulsionar", "fomentar", "viabilizar",
    "proporcionar", "não é apenas", "não apenas", "mais do que um", "mais do que uma", "não se resume",
    "num mundo", "na era digital", "mais do que nunca", "significativamente", "profundamente",
    "inegavelmente", "amplamente", "espero que", "não hesite", "venho por este meio",
    "agradeço antecipadamente", "agradecemos antecipadamente", "tapeçaria", "abrir portas", "farol",
    "marco histórico", "testemunho vivo", "dna do", "catalisador", "valioso contributo", "sem dúvida",
    "uma abordagem", "abordagem integrada", "de forma holística", "a nível de",
]

RESIDUOS = ["[lacuna", "todo:", "[inserir", "[adicionar", "aaaa-mm-dd", "**", "](", "contentreference",
            "oaicite", "oai_citation", "turn0", "【", ":::", "utm_source", "[cite", "espero que isto ajude",
            "posso desenvolver", "se desejar, posso"]


def ler(caminho):
    if caminho.lower().endswith(".docx"):
        with zipfile.ZipFile(caminho) as z:
            xml = z.read("word/document.xml").decode("utf8")
        paras = []
        for p in re.findall(r"<w:p[ >].*?</w:p>", xml, flags=re.S):
            t = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, flags=re.S))
            t = (t.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                  .replace("&quot;", '"').replace("&apos;", "'"))
            paras.append(t)
        return paras, False
    with open(caminho, encoding="utf8") as f:
        return f.read().split("\n"), caminho.lower().endswith(".md")


def verificar(caminho):
    linhas, md = ler(caminho)
    oc = {"ao90": [], "ptbr": [], "sinais": [], "residuos": [], "limites": [], "estatisticas": {}}
    for n, linha in enumerate(linhas, 1):
        if md and (linha.startswith("> ©") or linha.startswith("<!--") or linha.startswith("```")):
            continue
        low = linha.lower()
        for pad, sug in AO90.items():
            for m in re.finditer(r"(?<![\wÀ-ÿ])" + pad + r"(?![\wÀ-ÿ])", low):
                oc["ao90"].append({"linha": n, "palavra": m.group(0), "sugestao": sug})
        for pad, sug in PTBR.items():
            for m in re.finditer(r"(?<![\wÀ-ÿ])" + pad + r"(?![\wÀ-ÿ])", low):
                oc["ptbr"].append({"linha": n, "palavra": m.group(0), "sugestao": sug})
        for s in SINAIS:
            if s in low:
                oc["sinais"].append({"linha": n, "expressao": s})
        for r in RESIDUOS:
            if md and r in ("**", "]("):
                continue  # Markdown legítimo em .md; só conta em .docx/.txt
            if r in low:
                oc["residuos"].append({"linha": n, "residuo": r})
    texto = "\n".join(linhas)
    palavras = max(1, len(re.findall(r"\w+", texto)))
    oc["estatisticas"] = {
        "palavras": palavras,
        "travessoes_por_1000": round(1000 * texto.count("—") / palavras, 1),
        "negritos": texto.count("**") // 2,
    }
    if md:  # limites de caracteres por secção
        atual, limite, corpo, ini = None, None, [], 0
        def fechar():
            if atual and limite:
                t = "\n".join(corpo).strip()
                oc["limites"].append({"secao": atual, "linha": ini, "limite": limite, "caracteres": len(t),
                                      "excede": len(t) > limite})
        for n, linha in enumerate(linhas, 1):
            if linha.startswith("#"):
                fechar()
                atual, limite, corpo, ini = linha.lstrip("# ").strip(), None, [], n
                continue
            m = re.match(r"\s*<!--\s*limite:\s*(\d+)\s*-->", linha)
            if m and atual:
                limite = int(m.group(1))
                continue
            if atual:
                corpo.append(linha)
        fechar()
    criticos = len(oc["residuos"]) + sum(1 for l in oc["limites"] if l["excede"])
    return oc, criticos


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        print(__doc__)
        return 3
    oc, criticos = verificar(args[0])
    if "--json" in sys.argv:
        print(json.dumps(oc, ensure_ascii=False, indent=1))
    else:
        print(f"Ficheiro: {args[0]}")
        print(f"Estatísticas: {oc['estatisticas']}")
        for chave, titulo in [("residuos", "RESÍDUOS (crítico)"), ("ao90", "Grafia AO90"), ("ptbr", "PT-BR"),
                              ("sinais", "Expressões-sinal")]:
            print(f"\n## {titulo}: {len(oc[chave])}")
            for o in oc[chave][:200]:
                print("  ", o)
        if oc["limites"]:
            print("\n## Limites de caracteres")
            for l in oc["limites"]:
                marca = "EXCEDE" if l["excede"] else "ok"
                print(f"   [{marca}] {l['secao']}: {l['caracteres']}/{l['limite']}")
    return 2 if criticos else 0


if __name__ == "__main__":
    sys.exit(main())
