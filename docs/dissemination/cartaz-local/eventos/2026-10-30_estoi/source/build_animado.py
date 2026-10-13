# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar RIGHTS.md.
# Item 8 — versão ANIMADA v2 do cartaz Estoi (decisão do responsável 2026-10-13: composição livre,
# fotografias do acervo com texto animado à frente, convite a visitar o site; SEM QR — o link vai no post).
# MP4 H.264, 30 fps, sem som; 1080×1350 (feed) e 1080×1920 (stories).
# Fotografias: originais do Museu (uso = publicação oficial do projecto, com crédito obrigatório por cena).
# Créditos e legendas copiados do índice do Museu (public/data/museum-index.json); nada inventado.
# Aparamento: só a margem branca uniforme do scan (moldura), nunca o conteúdo da fotografia.
# Uso: PYTHONPATH=<dir com imageio-ffmpeg> python3 build_animado.py
import os, numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

HERE=os.path.dirname(os.path.abspath(__file__)); EV=os.path.dirname(HERE)
REPO=HERE
while REPO!="/" and not os.path.exists(os.path.join(REPO,"CLAUDE.md")): REPO=os.path.dirname(REPO)
ORIG=os.path.join(REPO,"public","media","museum","originals")
LOGODIR=os.path.join(REPO,"public","media","exhibition","updated","logos")
OUT=os.path.join(EV,"animado"); os.makedirs(OUT,exist_ok=True)

MARF=(255,252,247); INK=(30,26,23); INK5=(118,109,100); RED=(168,50,39); HAIR=(230,220,201)
FONTS=os.path.expanduser("~/Library/Fonts/")
def font(name,px,var=None):
    f=ImageFont.truetype(FONTS+name,px)
    if var:
        try: f.set_variation_by_name(var)
        except Exception: pass
    return f
FP=1.0  # escala tipográfica (definida por formato)

# Faixa de Logos canónica (docs/governance/FAIXA_DE_LOGOS_CANONICA.md): ordem fixa + alturas ópticas relativas ao trio
LOGOS=[("logo-projeto-comunitario-milreu.png",0.92),("logo-ccdr-algarve.png",0.99),("logo-associacao-amigos-museu-lyceu-faro.png",0.92),
       ("logo-junta-freguesia-estoi.png",0.92),("Milreu_policromatico.png",1.00),("logo-ualg-completo.png",0.78)]

# Cenas fotográficas: (ficheiro, legenda curta do índice, crédito do índice, textos)
# (ficheiro, legenda, crédito, textos, (ah, av) = ponto de enquadramento horizontal/vertical)
CENAS=[
 ("MM202601.png","Um aspecto do cortejo da Festa da Pinha, em Estoi · 1909",
  "Arquivo Nacional da Torre do Tombo — Foto Artística Samorrinha. Autor: José Viegas Samorrinha. PT/TT/SAM/A/001/000016",
  [("eyebrow","EXPOSIÇÃO ITINERANTE"),("titulo","Entre Ruínas\ne Memórias")],(0.5,0.35)),
 ("MM202608.jpg","Edifício de cultos, potencialmente em 1910",
  "Página ALDEIA DE ESTOI — CULTURA E PATRIMÓNIO, gerida por Luís Barriga",
  [("frase","Memórias da população ligadas às Ruínas Romanas de Milreu.")],(0.55,0.5)),
 ("MM202603.png","Achados romanos de Milreu · 1966-1967",
  "Página ALDEIA DE ESTOI — CULTURA E PATRIMÓNIO, gerida por Luís Barriga",
  [("eyebrow","JUNTA DE FREGUESIA DE ESTOI"),("titulo","30 de Outubro —\n6 de Novembro")],(0.5,0.25)),
 ("MM202613.png","Theodor Hauschild e equipa de escavadores em Milreu · ca. 1981",
  "Coleção de Maria de Lurdes Mendes Martins; fotografia providenciada por Celeste Pimenta e Branca Pimenta",
  [("eyebrow","INAUGURAÇÃO"),("titulo","Sexta-feira,\n30 de Outubro · 21h00"),("frase","Entrada livre · Largo Ossónoba, Estoi")],(0.5,0.92),"topo"),
]
FPS=30; T_CENA=4.2; T_XF=0.7; T_FIM=5.0; ZOOM=1.12

def ease(x): x=min(max(x,0.0),1.0); return 1-(1-x)**3

def apara_moldura(im):
    """Remove só a moldura branca/uniforme do scan: linhas/colunas de borda quase brancas (<= 12 % por lado)."""
    a=np.asarray(im.convert("L")).astype(np.float32); H,W=a.shape
    def borda(v,lim):
        # tolera uma linha escura de 1-3 px no limite do scan antes da moldura branca
        k=0
        while k<min(4,lim) and v[k]<=232: k+=1
        if k>=min(4,lim) or v[k]<=232: return 0
        n=k
        while n<lim and v[n]>232: n+=1
        return n
    rows=a.mean(1); cols=a.mean(0)
    t=borda(rows,int(H*.12)); b=borda(rows[::-1],int(H*.12)); l=borda(cols,int(W*.12)); r=borda(cols[::-1],int(W*.12))
    m=max(4,int(min(W,H)*0.004))  # folga para o fio cinzento da margem
    return im.crop((l+m if l else 0,t+m if t else 0,W-(r+m if r else 0),H-(b+m if b else 0)))

def cover(im,W,H):
    k=max(W/im.size[0],H/im.size[1]); return im.resize((round(im.size[0]*k)+1,round(im.size[1]*k)+1),Image.LANCZOS)

def wrap(d,t,f,maxw):
    out=[]
    for pa in t.split("\n"):
        ln=""
        for w in pa.split():
            tt=(ln+" "+w).strip()
            if d.textlength(tt,font=f)<=maxw or not ln: ln=tt
            else: out.append(ln); ln=w
        out.append(ln)
    return out

def camada_texto(W,H,linhas,mx,ybase):
    """Painel inferior chapado (INK 78 %) + textos; devolve lista de (RGBA, y0, y1) por elemento, de baixo p/ cima."""
    d=ImageDraw.Draw(Image.new("RGBA",(1,1))); cw=W-2*mx
    # eyebrow claro sobre o painel escuro; o tique vermelho marca a assinatura
    estilos={"eyebrow":(font("Archivo.ttf",round(30*FP),"Bold"),(236,230,222),1.25,6),
             "titulo":(font("Fraunces.ttf",round(96*FP),"SemiBold"),MARF,1.04,0),
             "frase":(font("Spectral-Italic.ttf",round(50*FP)),MARF,1.25,0)}
    blocos=[]
    for k,t in linhas:
        f,col,lh,ls=estilos[k]; ls_=round(ls*FP)
        if k=="titulo":
            px=f.size
            while px>40 and any(d.textlength(l,font=f)>cw for l in t.split("\n")):
                px-=2; f=font("Fraunces.ttf",px,"SemiBold")
        ls_lines=wrap(d,t,f,cw)
        h=round(f.size*lh)*len(ls_lines); blocos.append((k,f,col,lh,ls_,ls_lines,h))
    gap=round(22*FP); total=sum(b[-1] for b in blocos)+gap*(len(blocos)-1)
    y=ybase-total; camadas=[]
    for k,f,col,lh,ls,lines,h in blocos:
        L=Image.new("RGBA",(W,H),(0,0,0,0)); dd=ImageDraw.Draw(L); yy=y
        if k=="eyebrow": dd.rectangle([mx,yy+round(4*FP),mx+round(8*FP),yy+f.size],fill=RED+(255,)); x0=mx+round(22*FP)
        else: x0=mx
        for ln in lines:
            if ls:
                cx=x0
                for ch in ln: dd.text((cx,yy),ch,font=f,fill=col+(255,)); cx+=dd.textlength(ch,font=f)+ls
            else: dd.text((x0,yy),ln,font=f,fill=col+(255,))
            yy+=round(f.size*lh)
        camadas.append((L,y,y+h)); y+=h+gap
    return camadas, ybase-total

def logo_band(W,H_trio,maxw):
    ims=[]
    for fn,k in LOGOS:
        im=Image.open(os.path.join(LOGODIR,fn)).convert("RGBA"); a=np.asarray(im)[:,:,3]
        ys,xs=np.where(a>16); im=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1)); ims.append((im,k))
    def lay(Hh):
        it=[(im,Hh*k*im.size[0]/im.size[1],Hh*k) for im,k in ims]; g=0.6*Hh
        return it,g,sum(w for _,w,_ in it)+g*(len(it)-1)
    it,g,tot=lay(H_trio)
    if tot>maxw: H_trio*=maxw/tot; it,g,tot=lay(H_trio)
    band=Image.new("RGBA",(round(tot)+2,round(H_trio)+2),(0,0,0,0)); x=0.0
    for im,w,h in it:
        r=im.resize((max(1,round(w)),max(1,round(h))),Image.LANCZOS); band.alpha_composite(r,(round(x),round((H_trio-h)/2))); x+=w+g
    return band

def cartao_final(W,H,mx):
    """Cartão final em papel MARF: convite ao site + identidade + Faixa de Logos canónica + art. 16.º. Devolve camadas."""
    camadas=[]; cw=W-2*mx
    def L(): return Image.new("RGBA",(W,H),(0,0,0,0))
    y=round(H*0.30)
    a=L(); d=ImageDraw.Draw(a); f=font("Spectral-Italic.ttf",round(54*FP)); d.text((mx,y),"Saiba mais e acompanhe a agenda em",font=f,fill=INK5+(255,)); h=round(f.size*1.3)
    camadas.append((a,y,y+h)); y+=h+round(14*FP)
    a=L(); d=ImageDraw.Draw(a); px=round(118*FP); f=font("Fraunces.ttf",px,"SemiBold")
    while d.textlength("projectomilreu.pt",font=f)>cw: px-=2; f=font("Fraunces.ttf",px,"SemiBold")
    d.text((mx,y),"projectomilreu.pt",font=f,fill=RED+(255,)); h=round(px*1.15)
    d.rectangle([mx,y+h+round(6*FP),mx+round(140*FP),y+h+round(14*FP)],fill=RED+(255,))
    camadas.append((a,y,y+h+round(14*FP))); y+=h+round(70*FP)
    a=L(); d=ImageDraw.Draw(a); f=font("Fraunces.ttf",round(52*FP),"SemiBold"); f2=font("Spectral-Regular.ttf",round(40*FP))
    d.text((mx,y),"Entre Ruínas e Memórias",font=f,fill=INK+(255,)); yy=y+round(52*FP*1.25)
    for ln in ["Junta de Freguesia de Estoi","30 de Outubro — 6 de Novembro de 2026"]:
        d.text((mx,yy),ln,font=f2,fill=INK+(255,)); yy+=round(40*FP*1.35)
    camadas.append((a,y,yy));
    # rodapé institucional
    yb=H-round(H*0.20)
    a=L(); d=ImageDraw.Draw(a)
    d.line([(mx,yb),(W-mx,yb)],fill=HAIR+(255,),width=max(1,round(2*FP)))
    yy=yb+round(26*FP)
    d.text((mx,yy),"Projecto Comunitário de Milreu",font=font("Spectral-Medium.ttf",round(34*FP)),fill=INK+(255,)); yy+=round(46*FP)
    d.text((mx,yy),"MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026",font=font("Archivo.ttf",round(22*FP),"Medium"),fill=INK5+(255,)); yy+=round(44*FP)
    d.text((mx,yy),"APOIO INSTITUCIONAL E PARCERIAS",font=font("Archivo.ttf",round(22*FP),"Bold"),fill=INK+(255,)); yy+=round(40*FP)
    band=logo_band(W,round(64*FP),cw); a.alpha_composite(band,(mx,yy)); yy+=band.size[1]+round(22*FP)
    d.text((mx,yy),"Apoiado pela CCDR Algarve, I.P.",font=font("Spectral-Italic.ttf",round(28*FP)),fill=INK5+(255,)); yy+=round(40*FP)
    camadas.append((a,yb,yy))
    return camadas

def compoe(base,camada,p,slide):
    """Alpha-composite da camada com opacidade p e deslize vertical (px)."""
    L,y0,y1=camada
    if p<=0: return
    dy=round(slide*(1-p)); a=L
    if p<1:
        a=L.copy(); al=np.asarray(a)[:,:,3].astype(np.float32)*p; arr=np.asarray(a).copy(); arr[:,:,3]=al.astype(np.uint8); a=Image.fromarray(arr)
    base.alpha_composite(a,(0,dy))

def anima(W,H,nome):
    global FP
    FP=W/1080*(1.0 if H/W<1.5 else 1.08)
    mx=round(80*FP); slide=round(36*FP)
    fotos=[cover(apara_moldura(Image.open(os.path.join(ORIG,fn)).convert("RGB")),round(W*ZOOM),round(H*ZOOM)) for fn,*_ in CENAS]
    textos=[]; creds=[]; topos=[]
    posicoes=[]
    for (fn,leg,cred,linhas,_,*pos) in CENAS:
        topo=bool(pos and pos[0]=="topo")
        cam,ytop=camada_texto(W,H,linhas,mx,H-round(150*FP))
        if topo:
            # texto no topo (zona livre da fotografia); o painel vai do topo até ao fim do texto
            alt=(H-round(150*FP))-ytop; cam,ytop=camada_texto(W,H,linhas,mx,round(110*FP)+alt)
        textos.append(cam); topos.append(ytop); posicoes.append((topo,ytop+alt if topo else None))
        C=Image.new("RGBA",(W,H),(0,0,0,0)); d=ImageDraw.Draw(C); fc=font("Spectral-Italic.ttf",round(22*FP)); yy=H-round(92*FP)
        for ln in wrap(d,leg+" — "+cred,fc,W-2*mx)[:3]:
            d.text((mx,yy),ln,font=fc,fill=(236,230,222,235)); yy+=round(22*FP*1.3)
        creds.append((C,0,H))
    # painel chapado (sem gradiente) à medida do texto de cada cena
    paineis=[]
    for yt,(topo,yfim) in zip(topos,posicoes):
        P_=Image.new("RGBA",(W,H),(0,0,0,0)); d_=ImageDraw.Draw(P_)
        if topo:
            d_.rectangle([0,0,W,yfim+round(56*FP)],fill=INK+(199,))
            d_.rectangle([0,H-round(118*FP),W,H],fill=INK+(199,))  # faixa do crédito
        else: d_.rectangle([0,yt-round(64*FP),W,H],fill=INK+(199,))
        paineis.append(P_)
    fim=cartao_final(W,H,mx)
    n=len(CENAS); T_FOTOS=n*T_CENA; DUR=T_FOTOS+T_FIM
    out=os.path.join(OUT,f"ITEM8_Estoi_{nome}_animado.mp4")
    wr=imageio_ffmpeg.write_frames(out,(W,H),fps=FPS,codec="libx264",pix_fmt_out="yuv420p",quality=6,macro_block_size=2,
                                   output_params=["-movflags","+faststart"]); wr.send(None)
    def foto_frame(i,t_local):
        F=fotos[i]; z=ZOOM-(ZOOM-1.0)*min(t_local/(T_CENA+T_XF),1.0)  # zoom lento contínuo
        cw_,ch_=round(W*ZOOM/z),round(H*ZOOM/z); ah,av=CENAS[i][4]
        x0=round((F.size[0]-cw_)*ah); y0=round((F.size[1]-ch_)*av)
        return F.crop((x0,y0,x0+cw_,y0+ch_)).resize((W,H),Image.BILINEAR)
    for fi in range(int(DUR*FPS)):
        t=fi/FPS
        if t<T_FOTOS:
            i=int(t//T_CENA); tl=t-i*T_CENA
            fr=foto_frame(i,tl)
            if tl>T_CENA-T_XF and i+1<n:  # transição cruzada para a cena seguinte
                fr=Image.blend(fr,foto_frame(i+1,tl-T_CENA),ease((tl-(T_CENA-T_XF))/T_XF))
            elif tl>T_CENA-T_XF and i+1==n:  # última cena → cartão final
                fr=Image.blend(fr,Image.new("RGB",(W,H),MARF),ease((tl-(T_CENA-T_XF))/T_XF))
            base=fr.convert("RGBA")
            pa=1.0 if i>0 else ease(tl/0.6)
            if i==n-1 and tl>T_CENA-T_XF: pa=1-ease((tl-(T_CENA-T_XF))/T_XF)
            compoe(base,(paineis[i],0,H),pa,0)
            compoe(base,creds[i],pa*ease((tl-0.3)/0.6)*(1-ease((tl-(T_CENA-T_XF))/(T_XF*0.7))),0)
            for k,cam in enumerate(textos[i]):
                pin=ease((tl-0.35-k*0.28)/0.65); pout=1-ease((tl-(T_CENA-T_XF-0.15))/0.45)
                compoe(base,cam,min(pin,pout),slide)
        else:
            tl=t-T_FOTOS; base=Image.new("RGBA",(W,H),MARF+(255,))
            for k,cam in enumerate(fim): compoe(base,cam,ease((tl-0.15-k*0.32)/0.7),slide)
        wr.send(np.asarray(base.convert("RGB")).tobytes())
    wr.close(); return out,DUR

if __name__=="__main__":
    for nome,(W,H) in [("1080x1350",(1080,1350)),("1080x1920",(1080,1920))]:
        o,d=anima(W,H,nome); print(os.path.basename(o),f"{d:.1f}s",os.path.getsize(o)//1024,"KB")
