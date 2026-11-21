#!/usr/bin/env python3
# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Gera o DOCX do CE001 «Pedido de suporte» a partir dos rascunhos em Markdown.

Uso:
    python3 -I build_ce001_docx.py [--deps CAMINHO] [--out FICHEIRO] [--versao v0.1]

- --deps (ou variável CE001_DEPS): pasta onde está o python-docx instalado com
  `pip --target` (por exemplo, no scratchpad da sessão).
- Lê `../redaccao/*.md` pela ordem de ORDEM, as ilustrações de
  `docs/circuito-educativo/imagens/blueprints/` e, se existir, o ficheiro privado
  `../_private/ce001_nomes_privados.json` para substituir marcas {{NOME}}.
- Grava em `../_private/CE001_<versao>.docx` (pasta ignorada pelo Git).

Convenções do Markdown dos rascunhos:
    # / ## / ###              títulos de nível 1, 2 e 3 (o nível 1 abre página nova)
    | a | b |                 tabelas (células vazias no fim da linha fundem-se na anterior)
    - item / 1. item          listas
    <!-- quebra -->           quebra de página
    <!-- figura: ID | legenda -->   imagem imagens/blueprints/ID_*.png com legenda
    <!-- caixa: título --> … <!-- /caixa -->   caixa sombreada
    [LACUNA: …]               realçado a amarelo (rascunho de revisão)
    *itálico*
A linha de copyright dos rascunhos (> © …) não entra no DOCX.
Fontes: só fontes de sistema (Georgia e Arial); nenhum ficheiro de fonte é distribuído.
"""
import argparse
import glob
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
CE001 = os.path.dirname(AQUI)
REDACCAO = os.path.join(CE001, "redaccao")
PRIVADO = os.path.join(CE001, "_private")
BLUEPRINTS = os.path.join(os.path.dirname(CE001), "imagens", "blueprints")

ORDEM = [
    "00_ficha_tecnica_e_registo.md",
    "01_sumario_do_pedido.md",
    "02_projecto_e_circuito.md",
    "03_origem.md",
    "04_fundamentacao.md",
    "05_fases.md",
    "06_primeira_entrega.md",
    "07_actividades.md",
    "08_cronograma.md",
    "09_materiais.md",
    "10_custo_por_actividade.md",
    "11_custo_por_categoria.md",
    "12_condicoes.md",
    "13_riscos_e_proximos_passos.md",
    "AA_anexo_A_orcamentos.md",
    "AB_anexo_B_ilustracoes.md",
    "AC_anexo_C_bibliografia.md",
    "AD_anexo_D_materiais.md",
    "AE_anexo_E_glossario.md",
]

FONTE_TEXTO = "Georgia"
FONTE_TITULOS = "Arial"
COR_TINTA = (0x2B, 0x24, 0x20)      # preto aquecido para títulos
COR_SECUNDARIA = (0x6B, 0x5E, 0x55)
SOMBRA_CABECALHO = "E9E4DE"
SOMBRA_CAIXA = "F3F0EC"


def argumentos():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--deps", default=os.environ.get("CE001_DEPS"))
    p.add_argument("--versao", default="v0.1")
    p.add_argument("--data", default="21 de novembro de 2026")
    p.add_argument("--out", default=None)
    p.add_argument("--apenas", default=None,
                   help="lista de rascunhos separados por vírgulas, sem capa (para pré-visualizar)")
    return p.parse_args()


A = argumentos()
if A.deps:
    sys.path.insert(0, A.deps)
try:
    from docx import Document
    from docx.enum.section import WD_ORIENT  # noqa: F401
    from docx.enum.table import WD_TABLE_ALIGNMENT
    from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_COLOR_INDEX
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Cm, Pt, RGBColor
except ImportError:
    sys.exit("python-docx não encontrado: indicar --deps ou CE001_DEPS")

NOMES = {}
_f = os.path.join(PRIVADO, "ce001_nomes_privados.json")
if os.path.exists(_f):
    with open(_f, encoding="utf-8") as fh:
        NOMES = json.load(fh)


def substituir_marcas(texto):
    def troca(m):
        chave = m.group(1)
        return NOMES.get(chave, "[LACUNA: nome %s]" % chave)
    return re.sub(r"\{\{([A-Z_]+)\}\}", troca, texto)


# ---------------------------------------------------------------- utilitários XML

def sombrear(celula, cor):
    tcPr = celula._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), cor)
    tcPr.append(shd)


def campo(paragrafo, instrucao, texto_provisorio=""):
    """Insere um campo do Word (PAGE, TOC, …)."""
    r1 = paragrafo.add_run()
    fc1 = OxmlElement("w:fldChar")
    fc1.set(qn("w:fldCharType"), "begin")
    fc1.set(qn("w:dirty"), "true")
    r1._r.append(fc1)
    r2 = paragrafo.add_run()
    it = OxmlElement("w:instrText")
    it.set(qn("xml:space"), "preserve")
    it.text = instrucao
    r2._r.append(it)
    r3 = paragrafo.add_run()
    fc3 = OxmlElement("w:fldChar")
    fc3.set(qn("w:fldCharType"), "separate")
    r3._r.append(fc3)
    if texto_provisorio:
        paragrafo.add_run(texto_provisorio)
    r5 = paragrafo.add_run()
    fc5 = OxmlElement("w:fldChar")
    fc5.set(qn("w:fldCharType"), "end")
    r5._r.append(fc5)


def lingua_pt(estilo):
    rPr = estilo.element.get_or_add_rPr()
    lang = OxmlElement("w:lang")
    lang.set(qn("w:val"), "pt-PT")
    rPr.append(lang)


def repetir_cabecalho(linha):
    trPr = linha._tr.get_or_add_trPr()
    el = OxmlElement("w:tblHeader")
    el.set(qn("w:val"), "true")
    trPr.append(el)


def actualizar_campos_ao_abrir(doc):
    settings = doc.settings.element
    el = OxmlElement("w:updateFields")
    el.set(qn("w:val"), "true")
    settings.append(el)


# ---------------------------------------------------------------- texto em linha

PADRAO_LINHA = re.compile(r"(\[LACUNA:[^\]]*\]|\*[^*\s][^*]*\*|`[^`]*`)")


def escrever(paragrafo, texto, tamanho=None, negrito=False, cor=None):
    texto = substituir_marcas(texto)
    for parte in PADRAO_LINHA.split(texto):
        if not parte:
            continue
        if parte.startswith("[LACUNA:"):
            r = paragrafo.add_run(parte)
            r.font.highlight_color = WD_COLOR_INDEX.YELLOW
            r.bold = True
        elif parte.startswith("*") and parte.endswith("*") and len(parte) > 2:
            r = paragrafo.add_run(parte[1:-1])
            r.italic = True
        elif parte.startswith("`") and parte.endswith("`"):
            r = paragrafo.add_run(parte[1:-1])
        else:
            r = paragrafo.add_run(parte)
        if tamanho:
            r.font.size = Pt(tamanho)
        if negrito:
            r.bold = True
        if cor:
            r.font.color.rgb = RGBColor(*cor)
    return paragrafo


# ---------------------------------------------------------------- documento base

def preparar_documento():
    doc = Document()
    sec = doc.sections[0]
    sec.page_height, sec.page_width = Cm(29.7), Cm(21.0)
    sec.top_margin = sec.bottom_margin = Cm(2.5)
    sec.left_margin = sec.right_margin = Cm(2.5)
    sec.header_distance = sec.footer_distance = Cm(1.2)
    sec.different_first_page_header_footer = True

    st = doc.styles["Normal"]
    st.font.name = FONTE_TEXTO
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONTE_TEXTO)
    st.font.size = Pt(10.5)
    st.paragraph_format.space_after = Pt(6)
    st.paragraph_format.line_spacing = 1.15
    lingua_pt(st)
    for nome, tam, antes, depois in (("Heading 1", 17, 0, 12), ("Heading 2", 13, 14, 6), ("Heading 3", 11, 10, 4)):
        h = doc.styles[nome]
        h.font.name = FONTE_TITULOS
        rf = h.element.rPr.rFonts
        for att in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
            rf.set(qn(att), FONTE_TITULOS)
        for att in ("w:asciiTheme", "w:hAnsiTheme", "w:eastAsiaTheme", "w:cstheme"):
            if rf.get(qn(att)) is not None:
                del rf.attrib[qn(att)]
        h.font.size = Pt(tam)
        h.font.bold = True
        h.font.color.rgb = RGBColor(*COR_TINTA)
        h.paragraph_format.space_before = Pt(antes)
        h.paragraph_format.space_after = Pt(depois)
        h.paragraph_format.keep_with_next = True
        lingua_pt(h)

    # rodapé com número de página (não aparece na capa)
    rod = sec.footer.paragraphs[0]
    rod.alignment = WD_ALIGN_PARAGRAPH.CENTER
    escrever(rod, "CE001 – Pedido de suporte · %s · rascunho para revisão · página " % A.versao, tamanho=8, cor=COR_SECUNDARIA)
    campo(rod, "PAGE", "1")
    for r in rod.runs:
        r.font.size = Pt(8)
    actualizar_campos_ao_abrir(doc)
    return doc


def capa(doc):
    def linha(texto, tam, negrito=False, cor=COR_TINTA, antes=0, depois=6, fonte=FONTE_TITULOS):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(antes)
        p.paragraph_format.space_after = Pt(depois)
        r = p.add_run(texto)
        r.font.size = Pt(tam)
        r.bold = negrito
        r.font.name = fonte
        r.font.color.rgb = RGBColor(*cor)
        return p

    linha("Projecto Comunitário de Milreu", 11, cor=COR_SECUNDARIA, antes=60)
    linha("CE001 – Pedido de suporte", 28, negrito=True, antes=24, depois=4)
    linha("Circuito Educativo – Ruínas Romanas de Milreu", 16, depois=40)
    linha("Relatório contextual e pedido de apoio", 12, cor=COR_SECUNDARIA, depois=60, fonte=FONTE_TEXTO)

    linha("Destinatário", 9, negrito=True, cor=COR_SECUNDARIA, depois=2)
    linha("Município de Faro (NIPC 506 579 425)", 11, depois=0, fonte=FONTE_TEXTO)
    linha("através do Museu Municipal de Faro", 11, depois=0, fonte=FONTE_TEXTO)
    linha("Largo Dom Afonso III, n.º 14, 8000-167 Faro", 11, depois=24, fonte=FONTE_TEXTO)

    linha("Autor", 9, negrito=True, cor=COR_SECUNDARIA, depois=2)
    linha("Fernando Rodrigues de Jácomo", 11, depois=0, fonte=FONTE_TEXTO)
    linha("Doutoramento em Arqueologia, Universidade do Algarve", 11, depois=24, fonte=FONTE_TEXTO)

    linha("Versão %s · %s" % (A.versao, A.data), 11, depois=4, fonte=FONTE_TEXTO)
    p = linha("", 10)
    r = p.add_run("Rascunho para revisão do investigador. Não enviar. Contém lacunas assinaladas a amarelo.")
    r.font.size = Pt(10)
    r.bold = True
    r.font.highlight_color = WD_COLOR_INDEX.YELLOW
    linha("© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.", 8,
          cor=COR_SECUNDARIA, antes=60, fonte=FONTE_TEXTO)
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


def indice(doc):
    h = doc.add_heading("Índice", level=1)
    h.paragraph_format.page_break_before = True
    p = doc.add_paragraph()
    campo(p, 'TOC \\o "1-2" \\h \\z \\u',
          "O índice é um campo do Word: ao abrir o ficheiro, aceitar a actualização dos campos "
          "ou usar «Actualizar campo» (botão direito sobre este texto).")


# ---------------------------------------------------------------- blocos

def celulas(linha):
    c = [x.strip() for x in linha.strip().strip("|").split("|")]
    # fundir células vazias no fim da linha na última preenchida
    while len(c) > 1 and c[-1] == "":
        c.pop()
    return c


def tabela(doc, linhas, contentor=None, tamanho=None):
    cab = celulas(linhas[0])
    corpo = [celulas(l) for l in linhas[2:]]
    ncol = len(cab)
    if tamanho is None:
        tamanho = 7.5 if ncol >= 7 else 8.5 if ncol >= 4 else 9.5
    alvo = contentor if contentor is not None else doc
    t = alvo.add_table(rows=1 + len(corpo), cols=ncol)
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for j, txt in enumerate(cab):
        cel = t.rows[0].cells[j]
        cel.paragraphs[0].paragraph_format.space_after = Pt(0)
        escrever(cel.paragraphs[0], txt, tamanho=tamanho, negrito=True)
        sombrear(cel, SOMBRA_CABECALHO)
    repetir_cabecalho(t.rows[0])
    for i, fila in enumerate(corpo, start=1):
        if len(fila) < ncol:
            ultima = t.rows[i].cells[len(fila) - 1]
            ultima.merge(t.rows[i].cells[ncol - 1])
        for j, txt in enumerate(fila[:ncol]):
            cel = t.rows[i].cells[j]
            cel.paragraphs[0].paragraph_format.space_after = Pt(0)
            cel.paragraphs[0].paragraph_format.line_spacing = 1.0
            negr = fila[0].startswith("Total")
            escrever(cel.paragraphs[0], txt, tamanho=tamanho, negrito=negr)
    if contentor is None:
        doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


def figura(doc, ident, legenda):
    cand = sorted(glob.glob(os.path.join(BLUEPRINTS, ident + "_*.png")))
    if not cand:
        escrever(doc.add_paragraph(), "[LACUNA: imagem %s não encontrada]" % ident)
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(cand[0], width=Cm(16))
    lp = doc.add_paragraph()
    lp.paragraph_format.space_after = Pt(14)
    r = lp.add_run(substituir_marcas(legenda))
    r.italic = True
    r.font.size = Pt(9)
    r.font.color.rgb = RGBColor(*COR_SECUNDARIA)


def lista(alvo, texto, numero=None, tamanho=None):
    if numero:
        p = alvo.add_paragraph()
        pf = p.paragraph_format
        pf.left_indent = Cm(0.75)
        pf.first_line_indent = Cm(-0.5)
        r = p.add_run("%s. " % numero)
        if tamanho:
            r.font.size = Pt(tamanho)
    else:
        p = alvo.add_paragraph(style="List Bullet")
        pf = p.paragraph_format
    pf.space_after = Pt(3)
    escrever(p, texto, tamanho=tamanho)
    return p


def processar(doc, texto, primeiro_ficheiro=False):
    linhas = texto.split("\n")
    i = 0
    paragrafo = []
    caixa = None  # célula da caixa activa

    def alvo():
        return caixa if caixa is not None else doc

    def despejar():
        if paragrafo:
            txt = " ".join(s.strip() for s in paragrafo)
            p = alvo().add_paragraph()
            if txt.startswith("Fonte:"):
                escrever(p, txt, tamanho=8.5, cor=COR_SECUNDARIA)
            else:
                escrever(p, txt)
            paragrafo.clear()

    while i < len(linhas):
        l = linhas[i]
        s = l.strip()
        if s.startswith("> ©"):
            i += 1
            continue
        m_fig = re.match(r"<!--\s*figura:\s*([A-Za-z0-9\-]+)\s*\|\s*(.*?)\s*-->", s)
        m_cx = re.match(r"<!--\s*caixa:\s*(.*?)\s*-->", s)
        if m_fig:
            despejar()
            figura(doc, m_fig.group(1), m_fig.group(2))
        elif m_cx:
            despejar()
            t = doc.add_table(rows=1, cols=1)
            t.style = "Table Grid"
            caixa = t.rows[0].cells[0]
            sombrear(caixa, SOMBRA_CAIXA)
            escrever(caixa.paragraphs[0], m_cx.group(1), negrito=True)
        elif s.startswith("<!-- /caixa"):
            despejar()
            caixa = None
            doc.add_paragraph()
        elif s.startswith("<!-- quebra"):
            despejar()
            doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
        elif s.startswith("#"):
            despejar()
            nivel = len(s) - len(s.lstrip("#"))
            titulo = s[nivel:].strip()
            h = doc.add_heading(level=min(nivel, 3))
            if nivel == 1 and not primeiro_ficheiro:
                h.paragraph_format.page_break_before = True
            escrever(h, titulo)
        elif s.startswith("|"):
            despejar()
            bloco = []
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                bloco.append(linhas[i])
                i += 1
            tabela(doc, bloco, contentor=caixa)
            continue
        elif re.match(r"^- ", s):
            despejar()
            lista(alvo(), s[2:])
        elif re.match(r"^\d+\. ", s):
            despejar()
            n, resto = s.split(". ", 1)
            lista(alvo(), resto, numero=n)
        elif s == "":
            despejar()
        elif s.startswith("<!--"):
            despejar()
        else:
            paragrafo.append(s)
        i += 1
    despejar()


def main():
    doc = preparar_documento()
    ordem = ORDEM
    if A.apenas:
        ordem = [n.strip() for n in A.apenas.split(",")]
    else:
        capa(doc)
    for k, nome in enumerate(ordem):
        caminho = os.path.join(REDACCAO, nome)
        with open(caminho, encoding="utf-8") as fh:
            texto = fh.read()
        processar(doc, texto, primeiro_ficheiro=(k == 0))
        if nome.startswith("00_") and not A.apenas:
            indice(doc)
    destino = A.out or os.path.join(PRIVADO, "CE001_%s.docx" % A.versao)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    doc.save(destino)
    print(destino)


if __name__ == "__main__":
    main()
