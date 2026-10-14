# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Roda um STL em Z (dados da malha) para a menor pegada e centra-o na origem. Uso: -- <in.stl> <out.stl> <mesa_mm>
import bpy, bmesh, sys, math, mathutils
a = sys.argv[sys.argv.index("--") + 1:]; bed = float(a[2])
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.wm.stl_import(filepath=a[0])
ob = bpy.context.selected_objects[0]; me = ob.data
xy = [(v.co.x, v.co.y) for v in list(me.vertices)[::10]]
def dims(t):
    c, s = math.cos(t), math.sin(t); xs = [x*c - y*s for x, y in xy]; ys = [x*s + y*c for x, y in xy]
    return max(xs) - min(xs), max(ys) - min(ys)
best = min((max(dims(math.radians(d))), math.radians(d)) for d in range(0, 180, 1))
me.transform(mathutils.Matrix.Rotation(best[1], 4, "Z")); me.update()
vs = [v.co for v in me.vertices]; mn = [min(p[i] for p in vs) for i in range(3)]; mx = [max(p[i] for p in vs) for i in range(3)]
me.transform(mathutils.Matrix.Translation((-(mn[0]+mx[0])/2, -(mn[1]+mx[1])/2, -mn[2]))); me.update()
bm = bmesh.new(); bm.from_mesh(me); nm = sum(1 for e in bm.edges if not e.is_manifold); bm.free()
d = [mx[i]-mn[i] for i in range(3)]
print("FIT rot=%d graus dim=%.1fx%.1fx%.1f mm nao_manifold=%d cabe_%d=%s" % (round(math.degrees(best[1])), *d, nm, bed, max(d[0], d[1]) <= bed and d[2] <= bed))
bpy.ops.wm.stl_export(filepath=a[1])
