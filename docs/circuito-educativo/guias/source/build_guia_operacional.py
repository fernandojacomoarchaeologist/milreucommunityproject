#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Gera o DOCX do Guia Operacional do Circuito Educativo – Ruínas Romanas de Milreu.

Lê os capítulos Markdown de guias/operacional/ (por ordem do nome do ficheiro) e
produz guias/_private/Guia_Operacional_Circuito_Educativo_Milreu_v0.1.docx, em A4,
com capa, ficha técnica, índice (campo TOC), números de página e figuras legendadas.
Usa só fontes de sistema (Georgia e Arial).

Uso: python3 -I -X utf8 build_guia_operacional.py <caminho-para-python-docx>
"""
import glob
import os
import re
import sys

if len(sys.argv) > 1:
    sys.path.insert(0, sys.argv[1])

from docx import Document  # noqa: E402
from docx.enum.section import WD_SECTION  # noqa: E402
from docx.enum.table import WD_TABLE_ALIGNMENT  # noqa: E402
from docx.enum.text import WD_ALIGN_PARAGRAPH  # noqa: E402
from docx.oxml import OxmlElement  # noqa: E402
from docx.oxml.ns import qn  # noqa: E402
from docx.shared import Cm, Pt, RGBColor  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP_DIR = os.path.normpath(os.path.join(AQUI, "..", "operacional"))
SAIDA = os.path.normpath(os.path.join(AQUI, "..", "_private", "Guia_Operacional_Circuito_Educativo_Milreu_v0.1.docx"))

INK = RGBColor(0x1E, 0x1A, 0x17)
RED = RGBColor(0xA8, 0x32, 0x27)
GREY = RGBColor(0x6B, 0x63, 0x5C)
CORPO = "Georgia"
TITULOS = "Arial"
TITULO_DOC = "Guia Operacional"
SUBTITULO = "Circuito Educativo – Ruínas Romanas de Milreu"
VERSAO = "Versão 0.1 · 21 de novembro de 2026"
COPY = ("© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. "
        "Consultar RIGHTS.md. Os direitos de terceiros sobre obras citadas e imagens de referência mantêm-se.")


def fonte(run, nome=CORPO, tam=None, cor=None, negrito=None, italico=None):
    run.font.name = nome
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.append(rfonts)
    for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(a), nome)
    if tam:
        run.font.size = Pt(tam)
    if cor is not None:
        run.font.color.rgb = cor
    if negrito is not None:
        run.bold = negrito
    if italico is not None:
        run.italic = italico


def estilos(doc):
    st = doc.styles
    n = st["Normal"]
    n.font.name = CORPO
    n.font.size = Pt(10.5)
    n.font.color.rgb = INK
    n.element.rPr.rFonts.set(qn("w:eastAsia"), CORPO)
    pf = n.paragraph_format
    pf.space_after = Pt(6)
    pf.line_spacing = 1.2
    for nome, tam, cor, antes, depois in (("Heading 1", 18, INK, 0, 10), ("Heading 2", 13, RED, 14, 6),
                                          ("Heading 3", 11, INK, 10, 4), ("Title", 30, INK, 0, 6)):
        s = st[nome]
        s.font.name = TITULOS
        s.font.size = Pt(tam)
        s.font.bold = nome != "Title"
        s.font.color.rgb = cor
        rpr = s.element.get_or_add_rPr()
        rf = rpr.find(qn("w:rFonts"))
        if rf is None:
            rf = OxmlElement("w:rFonts")
            rpr.append(rf)
        for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
            rf.set(qn(a), TITULOS)
        for t in list(rf.attrib.keys()):
            if t.endswith("Theme"):
                del rf.attrib[t]
        s.paragraph_format.space_before = Pt(antes)
        s.paragraph_format.space_after = Pt(depois)
        s.paragraph_format.keep_with_next = True


def campo(par, instr):
    r = par.add_run()
    f1 = OxmlElement("w:fldChar")
    f1.set(qn("w:fldCharType"), "begin")
    it = OxmlElement("w:instrText")
    it.set(qn("xml:space"), "preserve")
    it.text = instr
    f2 = OxmlElement("w:fldChar")
    f2.set(qn("w:fldCharType"), "separate")
    t = OxmlElement("w:t")
    t.text = "Actualize o índice (F9 ou clique direito, «Actualizar campo»)." if "TOC" in instr else "1"
    f3 = OxmlElement("w:fldChar")
    f3.set(qn("w:fldCharType"), "end")
    r._r.append(f1)
    r._r.append(it)
    r._r.append(f2)
    r._r.append(t)
    r._r.append(f3)
    return r


def actualizar_campos_ao_abrir(doc):
    s = doc.settings.element
    u = OxmlElement("w:updateFields")
    u.set(qn("w:val"), "true")
    s.append(u)


def inline(par, texto, tam=None, cor=None, base_italico=False):
    """Escreve texto com *itálico* e **negrito** simples."""
    partes = re.split(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)", texto)
    for p in partes:
        if not p:
            continue
        if p.startswith("**"):
            r = par.add_run(p[2:-2])
            fonte(r, tam=tam, cor=cor, negrito=True, italico=base_italico)
        elif p.startswith("*"):
            r = par.add_run(p[1:-1])
            fonte(r, tam=tam, cor=cor, italico=not base_italico)
        elif p.startswith("`"):
            r = par.add_run(p[1:-1])
            fonte(r, tam=tam, cor=cor, italico=base_italico)
        else:
            r = par.add_run(p)
            fonte(r, tam=tam, cor=cor, italico=base_italico)


def sombrear(celula, hexcor):
    tcpr = celula._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hexcor)
    tcpr.append(shd)


def bordas(tabela):
    tbl = tabela._tbl
    tblpr = tbl.tblPr
    b = OxmlElement("w:tblBorders")
    for lado in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{lado}")
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), "4")
        e.set(qn("w:space"), "0")
        e.set(qn("w:color"), "B8ADA2")
        b.append(e)
    tblpr.append(b)
    w = tblpr.find(qn("w:tblW"))
    if w is None:
        w = OxmlElement("w:tblW")
        tblpr.append(w)
    w.set(qn("w:type"), "pct")
    w.set(qn("w:w"), "5000")


def tabela(doc, linhas):
    cab = [c.strip() for c in linhas[0].strip("|").split("|")]
    corpo = [[c.strip() for c in l.strip().strip("|").split("|")] for l in linhas[2:]]
    t = doc.add_table(rows=1 + len(corpo), cols=len(cab))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    bordas(t)
    for j, c in enumerate(cab):
        cel = t.rows[0].cells[j]
        cel.paragraphs[0].text = ""
        inline(cel.paragraphs[0], c, tam=9)
        for r in cel.paragraphs[0].runs:
            r.bold = True
        sombrear(cel, "EFE7DD")
    for i, linha in enumerate(corpo, 1):
        for j in range(len(cab)):
            c = linha[j] if j < len(linha) else ""
            cel = t.rows[i].cells[j]
            inline(cel.paragraphs[0], c, tam=9)
    for row in t.rows:
        for cel in row.cells:
            for p in cel.paragraphs:
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.05
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


class Contador:
    figura = 0


def figura(doc, legenda, caminho):
    if not os.path.exists(caminho):
        raise FileNotFoundError(caminho)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(caminho, width=Cm(16))
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.LEFT
    c.paragraph_format.space_after = Pt(12)
    inline(c, legenda, tam=8.5, cor=GREY, base_italico=False)


def capitulo(doc, caminho, primeiro):
    with open(caminho, encoding="utf8") as f:
        linhas = f.read().split("\n")
    base = os.path.dirname(caminho)
    i = 0
    paragrafo = []

    def despejar():
        if paragrafo:
            texto = " ".join(x.strip() for x in paragrafo)
            p = doc.add_paragraph()
            p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            inline(p, texto)
            paragrafo.clear()

    while i < len(linhas):
        l = linhas[i]
        s = l.strip()
        if s.startswith("> ©") or s.startswith("<!--"):
            i += 1
            continue
        if not s:
            despejar()
            i += 1
            continue
        if s.startswith("# "):
            despejar()
            h = doc.add_heading(s[2:].strip(), level=1)
            h.paragraph_format.page_break_before = not primeiro
        elif s.startswith("## "):
            despejar()
            doc.add_heading(s[3:].strip(), level=2)
        elif s.startswith("### "):
            despejar()
            doc.add_heading(s[4:].strip(), level=3)
        elif s.startswith("!["):
            despejar()
            m = re.match(r"!\[(.*)\]\((.*)\)", s)
            figura(doc, m.group(1), os.path.normpath(os.path.join(base, m.group(2))))
        elif s.startswith("|"):
            despejar()
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                bloco.append(linhas[i].strip())
                i += 1
            tabela(doc, bloco)
            continue
        elif s.startswith("- "):
            despejar()
            p = doc.add_paragraph(style="List Bullet")
            inline(p, s[2:])
        elif re.match(r"^\d+\. ", s):
            despejar()
            num, resto = s.split(" ", 1)
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Cm(0.9)
            p.paragraph_format.first_line_indent = Cm(-0.6)
            p.paragraph_format.space_after = Pt(3)
            fonte(p.add_run(num + " "), negrito=True)
            inline(p, resto)
        else:
            paragrafo.append(s)
        i += 1
    despejar()


def cabecalho_rodape(seccao):
    seccao.different_first_page_header_footer = False
    h = seccao.header.paragraphs[0]
    h.text = ""
    h.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    fonte(h.add_run(f"{TITULO_DOC} · {SUBTITULO}"), TITULOS, 8, GREY)
    f = seccao.footer.paragraphs[0]
    f.text = ""
    f.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = campo(f, "PAGE")
    fonte(r, TITULOS, 9, GREY)


def capa(doc):
    for _ in range(6):
        doc.add_paragraph()
    p = doc.add_paragraph()
    fonte(p.add_run("PROJECTO COMUNITÁRIO DE MILREU"), TITULOS, 10, RED, True)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(4)
    fonte(p.add_run(TITULO_DOC), TITULOS, 34, INK, True)
    p = doc.add_paragraph()
    fonte(p.add_run(SUBTITULO), CORPO, 18, INK)
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    fonte(p.add_run("Actividade a actividade: como preparar, conduzir, adaptar e avaliar as estações e componentes "
                    "do Circuito Educativo"), CORPO, 12, GREY, italico=True)
    for _ in range(10):
        doc.add_paragraph()
    p = doc.add_paragraph()
    fonte(p.add_run("Fernando Rodrigues de Jácomo"), TITULOS, 11, INK, True)
    p = doc.add_paragraph()
    fonte(p.add_run(VERSAO), TITULOS, 10, GREY)
    p = doc.add_paragraph()
    fonte(p.add_run("Documento de trabalho para revisão. Nenhuma actividade foi ainda testada com público."), TITULOS, 9, RED)


def ficha_tecnica(doc):
    p = doc.add_paragraph()
    p.paragraph_format.page_break_before = True
    fonte(p.add_run("Ficha técnica"), TITULOS, 14, INK, True)
    linhas = [
        ("Título", f"{TITULO_DOC} – {SUBTITULO}"),
        ("Iniciativa", "Circuito Educativo – Ruínas Romanas de Milreu, segunda iniciativa do Projecto Comunitário de Milreu"),
        ("Autoria e coordenação", "Fernando Rodrigues de Jácomo, responsável do projecto, no âmbito da investigação de "
                                  "doutoramento em Arqueologia na Universidade do Algarve"),
        ("Destinatários", "Educadores, voluntários e parceiros do Circuito: Município de Faro / Museu Municipal de Faro, "
                          "AAMLF, Junta de Freguesia de Estoi e equipa das Ruínas Romanas de Milreu"),
        ("Versão e data", VERSAO),
        ("Estado", "Rascunho para revisão do responsável. O Circuito está planeado e não executado; durações, lotações e "
                   "resultados são propostas a verificar nos testes de 2027. Os papéis dos parceiros são propostas a acordar."),
        ("Fontes", "Documentos de concepção do Circuito (18, 19 e 21 de novembro de 2026), registo de decisões do "
                   "responsável até 21 de novembro de 2026, análises bibliográficas do projecto e publicações citadas "
                   "em cada capítulo"),
        ("Ilustrações", "Desenhos conceptuais CE-BP-02a, 02b, 03, 04 e 05, não à escala e sem valor de documento de "
                        "Milreu; esquemas de organização elaborados para este guia"),
        ("Grafia", "Português de Portugal, grafia anterior ao Acordo Ortográfico de 1990, salvo em títulos e nomes "
                   "oficiais citados"),
        ("Direitos", COPY),
    ]
    t = doc.add_table(rows=len(linhas), cols=2)
    bordas(t)
    for i, (k, v) in enumerate(linhas):
        a, b = t.rows[i].cells
        a.width = Cm(4)
        b.width = Cm(12.5)
        fonte(a.paragraphs[0].add_run(k), TITULOS, 9, INK, True)
        sombrear(a, "EFE7DD")
        fonte(b.paragraphs[0].add_run(v), CORPO, 9.5, INK)


def indice(doc):
    p = doc.add_paragraph()
    p.paragraph_format.page_break_before = True
    fonte(p.add_run("Índice"), TITULOS, 14, INK, True)
    campo(doc.add_paragraph(), 'TOC \\o "1-2" \\h \\z \\u')


def main():
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
    sec.left_margin = sec.right_margin = Cm(2.3)
    sec.top_margin = Cm(2.4)
    sec.bottom_margin = Cm(2.2)
    sec.different_first_page_header_footer = True
    estilos(doc)
    core = doc.core_properties
    core.title = f"{TITULO_DOC} – {SUBTITULO}"
    core.author = "Fernando Rodrigues de Jácomo"
    core.subject = "Projecto Comunitário de Milreu"
    capa(doc)
    ficha_tecnica(doc)
    indice(doc)
    nova = doc.add_section(WD_SECTION.NEW_PAGE)
    nova.different_first_page_header_footer = False
    nova.header.is_linked_to_previous = False
    nova.footer.is_linked_to_previous = False
    cabecalho_rodape(nova)
    # a 1.ª secção (capa, ficha, índice) fica sem cabeçalho na capa
    fich = sorted(glob.glob(os.path.join(CAP_DIR, "[0-9][0-9]_*.md")))
    for k, f in enumerate(fich):
        capitulo(doc, f, primeiro=(k == 0))
    actualizar_campos_ao_abrir(doc)
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from estilo_ds import aplicar_ds
    aplicar_ds(doc)
    doc.save(SAIDA)
    print("gravado:", SAIDA, "capítulos:", len(fich))


if __name__ == "__main__":
    main()
