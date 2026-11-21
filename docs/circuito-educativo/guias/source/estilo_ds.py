# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Aplica o design system do Projecto (tokens v0.2) a um documento python-docx já construído.

Fonte dos valores: packages/design-tokens/v0.2/tokens.css
- texto principal ink-950 #1E1A17; texto secundário ink-600 #5E554D; assinatura red-700 #7E251C (só títulos de capítulo);
- superfícies: paper-100 #F7F1E7 (caixas), paper-150 #EEE7DB (cabeçalhos de tabela); bordas ink-200 #D8CFC2;
- tipografia: Fraunces (títulos), Spectral (corpo), Archivo (rótulos, tabelas, legendas).
As fontes não se distribuem com o documento (regra do projecto): o Word usa-as se estiverem instaladas e, se não estiverem,
substitui-as por fontes do sistema.
O logótipo do Projecto é inserido na capa a partir do ficheiro original, sem alteração.
"""
import os

from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

TITULOS, CORPO, ROTULOS = "Fraunces", "Spectral", "Archivo"
INK950 = RGBColor(0x1E, 0x1A, 0x17)
INK600 = RGBColor(0x5E, 0x55, 0x4D)
RED700 = RGBColor(0x7E, 0x25, 0x1C)
PAPER150, BORDA = "EEE7DB", "D8CFC2"
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
LOGO = os.path.join(REPO, "public", "media", "exhibition", "updated", "logos", "logo-projeto-comunitario-milreu.png")
VERMELHOS = {"A83227", "AA2A1E", "7E251C", "C44738"}


def _fonte(run_or_style_font, element, nome):
    run_or_style_font.name = nome
    rpr = element.get_or_add_rPr()
    rf = rpr.find(qn("w:rFonts"))
    if rf is None:
        rf = OxmlElement("w:rFonts")
        rpr.append(rf)
    for a in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
        rf.set(qn(a), nome)


def _estilos(doc):
    for nome, fonte, cor in (("Normal", CORPO, INK950), ("Title", TITULOS, INK950), ("Heading 1", TITULOS, RED700),
                             ("Heading 2", TITULOS, INK950), ("Heading 3", TITULOS, INK950),
                             ("Caption", ROTULOS, INK600), ("List Bullet", CORPO, INK950)):
        try:
            s = doc.styles[nome]
        except KeyError:
            continue
        _fonte(s.font, s.element, fonte)
        s.font.color.rgb = cor


def _cor_hex(run):
    try:
        c = run.font.color.rgb
        return str(c) if c is not None else None
    except Exception:
        return None


def _runs_paragrafo(p, em_tabela):
    estilo = (p.style.name if p.style is not None else "") or ""
    for r in p.runs:
        if estilo.startswith("Heading") or estilo == "Title":
            _fonte(r.font, r._element, TITULOS)
        elif em_tabela or estilo == "Caption":
            _fonte(r.font, r._element, ROTULOS)
        else:
            _fonte(r.font, r._element, CORPO)
        h = _cor_hex(r)
        if h is None:
            continue
        if h.upper() in VERMELHOS:
            r.font.color.rgb = RED700
        elif h.upper() not in ("FFFFFF",):
            # cinzentos e pretos passam aos tons de tinta do sistema
            lum = int(h[0:2], 16) + int(h[2:4], 16) + int(h[4:6], 16)
            r.font.color.rgb = INK600 if lum > 200 else INK950


def _bordas(tabela):
    tblPr = tabela._tbl.tblPr
    b = tblPr.find(qn("w:tblBorders"))
    if b is None:
        b = OxmlElement("w:tblBorders")
        tblPr.append(b)
    for lado in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = b.find(qn("w:" + lado))
        if e is None:
            e = OxmlElement("w:" + lado)
            b.append(e)
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), "4")
        e.set(qn("w:color"), BORDA)


def _sombra(celula, cor):
    tcPr = celula._tc.get_or_add_tcPr()
    for s in tcPr.findall(qn("w:shd")):
        tcPr.remove(s)
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), cor)
    tcPr.append(shd)


def _logo(doc):
    if not os.path.exists(LOGO):
        return
    corpo = doc.element.body
    primeiro = corpo[0]
    p = doc.add_paragraph()
    p.add_run().add_picture(LOGO, width=Cm(5.0))
    p.paragraph_format.space_after = Pt(18)
    corpo.remove(p._p)
    primeiro.addprevious(p._p)


def aplicar_ds(doc, logo=True):
    """Aplica estilos, fontes, cores e tabelas do design system; insere o logótipo na capa."""
    _estilos(doc)
    for p in doc.paragraphs:
        _runs_paragrafo(p, False)
    for t in doc.tables:
        _bordas(t)
        for i, row in enumerate(t.rows):
            for c in row.cells:
                if i == 0:
                    _sombra(c, PAPER150)
                for p in c.paragraphs:
                    _runs_paragrafo(p, True)
                    if i == 0:
                        for r in p.runs:
                            r.bold = True
    for s in doc.sections:
        for p in list(s.footer.paragraphs) + list(s.header.paragraphs):
            for r in p.runs:
                _fonte(r.font, r._element, ROTULOS)
                r.font.color.rgb = INK600
    if logo:
        _logo(doc)
    return doc
