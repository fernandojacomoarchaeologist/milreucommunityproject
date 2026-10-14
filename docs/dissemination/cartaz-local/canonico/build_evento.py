# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — gera os 3 TIPOS CANÓNICOS de uma paragem a partir do seu evento.json:
#   1. cartaz geral (impressão)  -> <evento>/final/  (A3/A4 RGB + preview + CMYK_PDFX/)
#   2. animação (vídeo)          -> <evento>/animado/ (MP4 1080×1350 e 1080×1920)
#   3. post de rede social       -> <evento>/social/  (1080×1350, 1080×1080, 1080×1920)
# Uso: QRPYLIBS=<qrcode> PYTHONPATH=<pikepdf,reportlab,imageio-ffmpeg> python3 build_evento.py <pasta do evento> [impressao|animacao|social ...]
import os, sys
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
if len(sys.argv)<2: raise SystemExit("uso: python3 build_evento.py <pasta do evento> [impressao|animacao|social ...]")
pasta=sys.argv[1]; tipos=sys.argv[2:] or ["impressao","animacao","social"]
import evento_lib as L
L.carregar(pasta)  # valida o evento.json antes de gerar qualquer coisa
if "impressao" in tipos:
    import cartaz_impressao; cartaz_impressao.gerar(pasta)
if "social" in tipos:
    import post_social; post_social.gerar(pasta)
if "animacao" in tipos:
    import animacao; animacao.gerar(pasta)
print("ok:",", ".join(tipos))
