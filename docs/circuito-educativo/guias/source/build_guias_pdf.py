# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
"""Gera os Guias Operacional e Técnico em PDF, com o design system do Projecto, a partir das fontes Markdown.

Pipeline: capítulos .md → HTML com tokens v0.2 (Fraunces, Spectral, Archivo; ink-950, ink-600, red-700, paper) →
PDF pelo Google Chrome em modo headless (--print-to-pdf). As fontes não se distribuem: usam-se as instaladas no Mac.

Uso: python3 -I -X utf8 build_guias_pdf.py <dir-deps-com-markdown> [operacional|tecnico|ambos]
Saída: ../_private/Guia_Operacional_Circuito_Educativo_Milreu_v0.1.pdf e ../_private/Guia_Tecnico_…_v0.1.pdf
"""
import glob
import html
import os
import re
import subprocess
import sys

sys.path.insert(0, sys.argv[1] if len(sys.argv) > 1 else "")
import markdown  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
GUIAS = os.path.abspath(os.path.join(AQUI, ".."))
REPO = os.path.abspath(os.path.join(GUIAS, "..", "..", ".."))
LOGO = os.path.join(REPO, "public", "media", "exhibition", "updated", "logos", "logo-projeto-comunitario-milreu.png")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DATA = "21 de novembro de 2026"

CSS = """
@page { size: A4; margin: 22mm 20mm 20mm 22mm;
  @bottom-center { content: counter(page); font-family: 'Archivo', sans-serif; font-size: 8.5pt; color: #5E554D; }
  @bottom-left { content: "Circuito Educativo – Ruínas Romanas de Milreu · %(titulo)s"; font-family: 'Archivo', sans-serif;
                 font-size: 7.5pt; color: #766D64; } }
@page capa { @bottom-center { content: none; } @bottom-left { content: none; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Spectral', Georgia, serif; font-size: 10.5pt; line-height: 1.5; color: #1E1A17; background: #FFFFFF; }
h1, h2, h3, h4 { font-family: 'Fraunces', Georgia, serif; font-weight: 600; color: #1E1A17; line-height: 1.2;
  break-after: avoid; }
h1 { font-size: 21pt; color: #7E251C; margin: 0 0 14pt; padding-bottom: 6pt; border-bottom: 1px solid #D8CFC2;
  break-before: page; }
h2 { font-size: 13.5pt; margin: 18pt 0 6pt; }
h3 { font-size: 11.5pt; margin: 14pt 0 4pt; }
h4 { font-size: 10.5pt; margin: 12pt 0 4pt; }
p { margin: 0 0 7pt; text-align: justify; hyphens: auto; orphans: 3; widows: 3; }
ul, ol { margin: 0 0 8pt 16pt; padding: 0; } li { margin-bottom: 3pt; }
table { width: 100%%; border-collapse: collapse; margin: 6pt 0 12pt; font-family: 'Archivo', sans-serif;
  font-size: 8.6pt; line-height: 1.35; break-inside: auto; }
thead { display: table-header-group; } tr { break-inside: avoid; }
th { background: #EEE7DB; color: #1E1A17; font-weight: 600; text-align: left; }
th, td { border: 0.6pt solid #D8CFC2; padding: 3.5pt 5pt; vertical-align: top; }
figure { margin: 10pt 0 14pt; break-inside: avoid; text-align: center; }
figure img { max-width: 100%%; max-height: 190mm; }
figcaption { font-family: 'Archivo', sans-serif; font-size: 8.3pt; color: #5E554D; text-align: left; margin-top: 5pt; }
blockquote { margin: 8pt 0; padding: 6pt 10pt; background: #F7F1E7; border-left: 2pt solid #B5AA9B; }
code { font-family: 'Archivo', sans-serif; font-size: 9pt; }
a { color: inherit; text-decoration: none; }
.capa { page: capa; height: 250mm; display: flex; flex-direction: column; justify-content: space-between; }
.capa img { width: 52mm; }
.capa .eyebrow { font-family: 'Archivo', sans-serif; font-size: 9pt; letter-spacing: .14em; text-transform: uppercase;
  color: #7E251C; margin-bottom: 8pt; }
.capa .titulo { font-family: 'Fraunces', serif; font-size: 36pt; font-weight: 600; line-height: 1.05; }
.capa .sub { font-family: 'Spectral', serif; font-size: 15pt; margin-top: 8pt; }
.capa .desc { font-family: 'Spectral', serif; font-style: italic; color: #5E554D; margin-top: 10pt; font-size: 11pt; }
.capa .meta { font-family: 'Archivo', sans-serif; font-size: 9pt; color: #5E554D; line-height: 1.6; }
.capa .meta b { color: #1E1A17; }
.capa .copy { font-family: 'Archivo', sans-serif; font-size: 7.5pt; color: #766D64; }
.indice h1 { break-before: page; }
.indice .i1 { font-family: 'Fraunces', serif; font-weight: 600; font-size: 11pt; margin: 9pt 0 2pt; }
.indice .i2 { font-size: 9.6pt; margin: 0 0 1pt 14pt; color: #453D36; }
"""

CFG = {
    "operacional": {
        "titulo": "Guia Operacional",
        "desc": "Actividade a actividade: como preparar, conduzir, adaptar e avaliar as estações e componentes do Circuito.",
        "publico": "Educadores, voluntários e parceiros do Circuito",
        "pasta": "operacional",
        "saida": "Guia_Operacional_Circuito_Educativo_Milreu_v0.1.pdf",
    },
    "tecnico": {
        "titulo": "Guia Técnico",
        "desc": "Preparação, instalação, operação e armazenamento, actividade a actividade.",
        "publico": "Técnicos de museu, locais anfitriões e responsáveis de segurança",
        "pasta": "tecnico",
        "saida": "Guia_Tecnico_Circuito_Educativo_Milreu_v0.1.pdf",
    },
}


def capitulos(chave):
    pasta = os.path.join(GUIAS, CFG[chave]["pasta"])
    if chave == "tecnico":
        src = open(os.path.join(AQUI, "build_guia_tecnico.py"), encoding="utf8").read()
        bloco = src[src.index("ORDEM"):]
        bloco = bloco[bloco.index("[") + 1:bloco.index("]")]
        nomes = re.findall(r'"([^"]+\.md)"', bloco)
        return [os.path.join(pasta, n) for n in nomes if os.path.exists(os.path.join(pasta, n))]
    return sorted(glob.glob(os.path.join(pasta, "[0-9][0-9]_*.md")))


def figura(src, legenda, base):
    caminho = os.path.normpath(os.path.join(base, src.strip()))
    if not os.path.exists(caminho):
        return ""
    return (f'\n\n<figure><img src="file://{caminho}" alt=""><figcaption>{html.escape(legenda.strip())}'
            f'</figcaption></figure>\n\n')


def preparar(md, base):
    linhas = md.split("\n")
    while linhas and (linhas[0].startswith("> ©") or not linhas[0].strip()):
        linhas.pop(0)
    md = "\n".join(linhas)
    md = re.sub(r"<!--\s*figura:\s*([^|]+?)\s*\|\s*(.*?)\s*-->", lambda m: figura(m.group(1), m.group(2), base), md, flags=re.S)
    md = re.sub(r"^!\[(.*?)\]\(([^)]+)\)\s*$", lambda m: figura(m.group(2), m.group(1), base), md, flags=re.M)
    md = re.sub(r"<!--.*?-->", "", md, flags=re.S)
    return md


def construir(chave):
    cfg = CFG[chave]
    corpo, entradas, n = [], [], 0
    conv = markdown.Markdown(extensions=["tables", "sane_lists"])
    for f in capitulos(chave):
        base = os.path.dirname(f)
        h = conv.reset().convert(preparar(open(f, encoding="utf8").read(), base))

        def ancora(m):
            nonlocal n
            n += 1
            nivel, texto = m.group(1), m.group(2)
            limpo = re.sub(r"<[^>]+>", "", texto)
            if nivel in ("1", "2"):
                entradas.append((nivel, limpo, f"s{n}"))
            return f'<h{nivel} id="s{n}">{texto}</h{nivel}>'

        h = re.sub(r"<h([1-4])>(.*?)</h\1>", ancora, h, flags=re.S)
        corpo.append(h)
    indice = ['<section class="indice"><h1>Índice</h1>']
    for nivel, texto, ident in entradas:
        indice.append(f'<div class="i{nivel}"><a href="#{ident}">{html.escape(texto)}</a></div>')
    indice.append("</section>")
    capa = f"""
<section class="capa">
  <div><img src="file://{LOGO}" alt="Projecto Comunitário de Milreu"></div>
  <div>
    <div class="eyebrow">Projecto Comunitário de Milreu</div>
    <div class="titulo">{cfg['titulo']}</div>
    <div class="sub">Circuito Educativo – Ruínas Romanas de Milreu</div>
    <div class="desc">{cfg['desc']}</div>
  </div>
  <div class="meta">
    <b>Fernando Rodrigues de Jácomo</b><br>Coordenador do Circuito Educativo · Doutoramento em Arqueologia, Universidade do Algarve<br>
    Destinatários: {cfg['publico']}<br>Versão 0.1 · {DATA}<br>
    Documento de trabalho para revisão. Nenhuma actividade foi ainda testada com público.
  </div>
  <div class="copy">© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
  Os direitos de terceiros mantêm-se com os respectivos titulares.</div>
</section>"""
    doc = (f'<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><title>{cfg["titulo"]}</title>'
           f'<style>{CSS % {"titulo": cfg["titulo"]}}</style></head><body>{capa}{"".join(indice)}{"".join(corpo)}</body></html>')
    destino_html = os.path.join(GUIAS, "_private", cfg["saida"].replace(".pdf", ".html"))
    destino_pdf = os.path.join(GUIAS, "_private", cfg["saida"])
    open(destino_html, "w", encoding="utf8").write(doc)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files",
                    f"--print-to-pdf={destino_pdf}", "file://" + destino_html],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=600)
    os.remove(destino_html)
    print(destino_pdf, f"{os.path.getsize(destino_pdf) // 1024} KB", f"{len(entradas)} entradas no índice")


if __name__ == "__main__":
    alvo = sys.argv[2] if len(sys.argv) > 2 else "ambos"
    for k in (["operacional", "tecnico"] if alvo == "ambos" else [alvo]):
        construir(k)
