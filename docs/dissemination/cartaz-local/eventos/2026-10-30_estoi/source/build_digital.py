# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — versão ONLINE do cartaz Estoi (4:5 feed e 9:16 stories), a partir do mesmo gerador e dos mesmos campos.
# Uso: QRPYLIBS=<dir com qrcode> python3 build_digital.py
import os, sys; HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
os.environ.setdefault("ITEM8_DPI","200")
import cartaz_evento_generator as gen
from build_estoi import F, IMG, EV
from PIL import Image
OUT=os.path.join(EV,"digital"); gen.OUTP=OUT; os.makedirs(OUT,exist_ok=True)
FORMATOS={  # nome: (largura mm, altura mm, px finais, IMG_RATIO)
  "1080x1350":(240,300,(1080,1350),0.33),
  "1080x1920":(216,384,(1080,1920),0.46),
}
def digital(nome,TW,TH,px,ratio,fields=F,outdir=OUT):
    gen.OUTP=outdir
    tmp=f"_tmp_{nome}"; gen.render(TW,TH,dict(fields,IMG_RATIO=ratio,IMG_TRIM=0.035),tmp,img=IMG,final=True)  # IMG_TRIM: margem branca do scan
    im=Image.open(os.path.join(outdir,tmp+".png")).convert("RGB"); os.remove(os.path.join(outdir,tmp+".png"))
    b=gen.P(3); im=im.crop((b,b,im.size[0]-b,im.size[1]-b)).resize(px,Image.LANCZOS)  # sem sangria
    return im
if __name__=="__main__":
    for nome,(TW,TH,px,ratio) in FORMATOS.items():
        im=digital(nome,TW,TH,px,ratio)
        im.save(os.path.join(OUT,f"ITEM8_Estoi_{nome}.png"),optimize=True)
        im.save(os.path.join(OUT,f"ITEM8_Estoi_{nome}.jpg"),quality=90,optimize=True,progressive=True)
    print("ok")
