# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — versão ANIMADA do cartaz Estoi (MP4 H.264, 30 fps). Parte da arte final online (digital/*.png):
# a fotografia entra com zoom lento (Ken Burns) e os blocos de informação revelam-se em cascata (fade + deslize).
# Nenhum conteúdo novo: cada fotograma é composto apenas com pixels da arte aprovada.
# Uso: PYTHONPATH=<dir com imageio-ffmpeg> python3 build_animado.py
import os, numpy as np
from PIL import Image
import imageio_ffmpeg
HERE=os.path.dirname(os.path.abspath(__file__)); EV=os.path.dirname(HERE)
SRC=os.path.join(EV,"digital"); OUT=os.path.join(EV,"animado"); os.makedirs(OUT,exist_ok=True)
MARF=np.array([255,252,247]); RED=np.array([168,50,39]); CRED=np.array([24,20,18])
FPS=30; DUR=14.0; T_FOTO=1.0; STAGGER=0.32; T_BLOCO=0.6; SLIDE=28
def ease(x): x=min(max(x,0.0),1.0); return 1-(1-x)**3
def faixas(a):
    """Devolve (y_credito, y_fim_foto, blocos[(y0,y1)]) por segmentação de linhas da arte."""
    rows=a.reshape(a.shape[0],-1,3)
    red=np.where((np.abs(rows-RED).sum(2)<40).mean(1)>0.9)[0]; y_red_end=int(red.max())+1 if len(red) else 0
    dark=np.where((np.abs(rows[:y_red_end]-CRED).sum(2)<30).mean(1)>0.6)[0]; y_cred=int(dark.min()) if len(dark) else y_red_end
    tinta=(np.abs(rows[y_red_end:]-MARF).sum(2)>24).any(1)
    blocos=[]; y=0; n=len(tinta)
    while y<n:
        if tinta[y]:
            y0=y
            while y<n and tinta[y]: y+=1
            blocos.append([y0+y_red_end,y+y_red_end])
        else: y+=1
    junt=[]
    for b in blocos:  # junta linhas da mesma família (intervalo < 14 px) e fios finos ao bloco seguinte
        if junt and (b[0]-junt[-1][1]<14 or junt[-1][1]-junt[-1][0]<5): junt[-1][1]=b[1]
        else: junt.append(b)
    return y_cred, y_red_end, junt
def anima(nome):
    S=np.asarray(Image.open(os.path.join(SRC,f"ITEM8_Estoi_{nome}.png")).convert("RGB")).astype(np.float32)
    H,W,_=S.shape; y_cred,y_red,blocos=faixas(S.astype(int))
    foto=Image.fromarray(S[:y_cred].astype(np.uint8))
    out=os.path.join(OUT,f"ITEM8_Estoi_{nome}_animado.mp4")
    wr=imageio_ffmpeg.write_frames(out,(W,H),fps=FPS,codec="libx264",pix_fmt_out="yuv420p",quality=8,
                                   macro_block_size=2,output_params=["-movflags","+faststart"])
    wr.send(None)
    base=np.empty_like(S); base[:]=MARF
    for i in range(int(DUR*FPS)):
        t=i/FPS; fr=base.copy()
        z=1.10-0.10*ease(t/6.0)  # zoom lento 1.10 -> 1.00
        fw,fh=round(W/z),round(y_cred/z); x0=(W-fw)//2; y0=(y_cred-fh)//2
        fo=np.asarray(foto.crop((x0,y0,x0+fw,y0+fh)).resize((W,y_cred),Image.LANCZOS)).astype(np.float32)
        a=ease(t/0.8); fr[:y_cred]=MARF*(1-a)+fo*a
        fr[y_cred:y_red]=MARF*(1-a)+S[y_cred:y_red]*a  # crédito + fio vermelho com a fotografia
        for k,(b0,b1) in enumerate(blocos):
            p=ease((t-T_FOTO-k*STAGGER)/T_BLOCO)
            if p<=0: continue
            dy=round(SLIDE*(1-p)); d0=b0+dy; d1=min(H,b1+dy); h=d1-d0
            fr[d0:d1]=fr[d0:d1]*(1-p)+S[b0:b0+h]*p
        wr.send(np.clip(fr,0,255).astype(np.uint8).tobytes())
    wr.close()
    return out,len(blocos)
if __name__=="__main__":
    for nome in ["1080x1350","1080x1920"]:
        o,n=anima(nome); print(os.path.basename(o),n,"blocos",os.path.getsize(o)//1024,"KB")
