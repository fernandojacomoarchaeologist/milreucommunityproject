# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — cartaz de evento: Junta de Freguesia de Estoi, 30-10 → 06-11-2026. Dados confirmados pelo responsável (2026-10-12; data revista 2026-10-13).
# Uso: QRPYLIBS=<dir com qrcode> ITEM8_DPI=300 python3 build_estoi.py
import os, sys; HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import cartaz_evento_generator as gen
from PIL import Image
EV=os.path.dirname(HERE); OUT=os.path.join(EV,"final"); gen.OUTP=OUT; os.makedirs(OUT,exist_ok=True)
F={"NOME_DO_LOCAL":"Junta de Freguesia de Estoi","CIDADE_LOCALIDADE":"Estoi · Faro",
   "CREDITO_IMAGEM":"Theodor Hauschild e equipa de escavadores em Milreu, ca. 1981 · Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta",
   "DATA_INICIO":"30 de Outubro","DATA_FIM":"6 de Novembro de 2026",
   "DESTAQUE":"Inauguração · sexta-feira, 30 de Outubro · 21h00",
   "HORARIO":"Segunda a sexta · 9h00 – 12h00 e 14h00 – 18h00\nEncerrado ao fim-de-semana",
   "MORADA":"Largo Ossónoba · 8005-454 Estoi",
   "ENTRADA_CONDICOES":"Entrada livre","IMG_AV":0.9,
   "LOGO_ANFITRIAO":os.path.join(gen.LOGODIR,"logo-junta-freguesia-estoi.png")}  # anfitrião: ficheiro canónico (transparente)
IMG=os.path.join(gen._REPO,"public","media","museum","originals","MM202613.png")
if __name__=="__main__":
    for fmt,(w,h) in [("A3",gen.A3),("A4",gen.A4)]:
        name=f"ITEM8_Estoi_{fmt}"
        gen.render(w,h,F,name,img=IMG,final=True)  # guarda final=True: bloqueia placeholders
        im=Image.open(os.path.join(OUT,name+".png")).convert("RGB")
        im.save(os.path.join(OUT,name+f"_PRINT_sangria3mm_{gen.DPI}dpi.pdf"),resolution=gen.DPI)
        pv=im.copy(); pv.thumbnail((1400,1400)); pv.save(os.path.join(OUT,name+"_preview.png")); os.remove(os.path.join(OUT,name+".png"))
    print("ok")
