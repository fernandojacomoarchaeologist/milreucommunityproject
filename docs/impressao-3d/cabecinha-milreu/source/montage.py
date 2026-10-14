# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
import bpy, sys
a = sys.argv[sys.argv.index("--")+1:]; out, ins = a[0], a[1:]
ims = [bpy.data.images.load(p) for p in ins]
w, h = ims[0].size; W = w*len(ims)
o = bpy.data.images.new("m", W, h); px = [0.0]*(W*h*4)
for k, im in enumerate(ims):
    s = list(im.pixels)
    for y in range(h):
        px[(y*W + k*w)*4:(y*W + k*w + w)*4] = s[y*w*4:(y+1)*w*4]
o.pixels = px; o.filepath_raw = out; o.file_format = "PNG"; o.save()
