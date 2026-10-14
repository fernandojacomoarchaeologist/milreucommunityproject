# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Prepara a malha (GLB gerado por IA) à escala real e divide-a em 2 partes com furos para pinos.
# Uso: Blender -b -P prep_split.py -- <in.glb> <prefixo_saida> <altura_mm> <corte_base_frac> <junta_frac> [voxel_mm]
import bpy, bmesh, sys, math, mathutils
a = sys.argv[sys.argv.index("--") + 1:]
src, pref, H, cutb, jf = a[0], a[1], float(a[2]), float(a[3]), float(a[4])
vox = float(a[5]) if len(a) > 5 else 0.4
PIN_D, PIN_FOLGA, PIN_PROF = 6.0, 0.3, 10.0       # pino impresso Ø6 mm; furo Ø6,6 mm; 10 mm em cada parte

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
ms = [o for o in bpy.context.scene.objects if o.type == "MESH"]
for o in ms: o.select_set(True)
bpy.context.view_layer.objects.active = ms[0]
if len(ms) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def bb(o):
    v = [o.matrix_world @ x.co for x in o.data.vertices]
    return (mathutils.Vector([min(p[i] for p in v) for i in range(3)]),
            mathutils.Vector([max(p[i] for p in v) for i in range(3)]))

def cut_fill(o, z, keep_above):
    bm = bmesh.new(); bm.from_mesh(o.data)
    r = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, z),
                               plane_no=(0, 0, 1), clear_inner=keep_above, clear_outer=not keep_above)
    bmesh.ops.holes_fill(bm, edges=[e for e in r["geom_cut"] if isinstance(e, bmesh.types.BMEdge)], sides=0)
    bm.to_mesh(o.data); bm.free()

def keep_largest(o):                                    # remove ilhas soltas (artefactos da IA)
    bm = bmesh.new(); bm.from_mesh(o.data); seen = set(); parts = []
    for f in bm.faces:
        if f in seen: continue
        st, comp = [f], []
        seen.add(f)
        while st:
            g = st.pop(); comp.append(g)
            for e in g.edges:
                for h in e.link_faces:
                    if h not in seen: seen.add(h); st.append(h)
        parts.append(comp)
    parts.sort(key=len, reverse=True)
    kill = {v for c in parts[1:] for f in c for v in f.verts}
    bmesh.ops.delete(bm, geom=list(kill), context="VERTS")
    bm.to_mesh(o.data); bm.free(); return len(parts)

def stats(o, tag):
    bm = bmesh.new(); bm.from_mesh(o.data)
    nm = sum(1 for e in bm.edges if not e.is_manifold); vol = bm.calc_volume(signed=False)
    area = sum(f.calc_area() for f in bm.faces); bm.free()
    mn, mx = bb(o)
    print("STATS %s faces=%d nao_manifold=%d vol_cm3=%.0f area_cm2=%.0f dim_mm=%.1fx%.1fx%.1f"
          % (tag, len(o.data.polygons), nm, vol / 1000, area / 100, *(mx - mn)))

# 1) base plana no modelo normalizado, depois escala para que a altura final seja H
mn, mx = bb(ob); cut_fill(ob, mn.z + (mx.z - mn.z) * cutb, keep_above=True)
mn, mx = bb(ob); s = H / (mx.z - mn.z)
ob.scale = (s, s, s); bpy.ops.object.transform_apply(scale=True)
mn, mx = bb(ob); ob.location -= mathutils.Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
bpy.ops.object.transform_apply(location=True)

bm = bmesh.new(); bm.from_mesh(ob.data)               # junta vértices separados nas costuras de textura
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.01)
bm.to_mesh(ob.data); bm.free()
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.fill_holes(sides=0); bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode="OBJECT")
stats(ob,"pos_escala")
# 2) malha estanque + limpeza de ilhas
rm = ob.modifiers.new("vox", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = vox
bpy.ops.object.modifier_apply(modifier=rm.name)
stats(ob,"pos_remesh")
print("ILHAS", keep_largest(ob))
stats(ob, "inteira")

# 3) reduzir (antes da divisão) para ficheiros manejáveis
dm = ob.modifiers.new("dec", "DECIMATE"); dm.ratio = 250000 / len(ob.data.polygons)
bpy.ops.object.modifier_apply(modifier=dm.name); stats(ob, "reduzida")

def boolean(part, cutter, op):
    b = part.modifiers.new("b", "BOOLEAN"); b.operation = op; b.object = cutter; b.solver = "EXACT"
    bpy.context.view_layer.objects.active = part; bpy.ops.object.modifier_apply(modifier=b.name)

# 4) divisão na junta com caixa booleana (robusto para secções com vários contornos)
zj = H * jf
top = ob.copy(); top.data = ob.data.copy(); bpy.context.scene.collection.objects.link(top)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, zj + H)); box = bpy.context.active_object
box.scale = (4 * H, 4 * H, 2 * H); bpy.ops.object.transform_apply(scale=True)
boolean(ob, box, "DIFFERENCE"); ob.name = "parte1_rosto_pescoco"
boolean(top, box, "INTERSECT"); top.name = "parte2_penteado"
bpy.data.objects.remove(box, do_unlink=True)

# 5) furos para 2 pinos, simétricos ao centro da secção de junta
sec = [v.co.copy() for v in ob.data.vertices if abs(v.co.z - zj) < 1e-3]
cx = sum(p.x for p in sec) / len(sec); cy = sum(p.y for p in sec) / len(sec)
span = max(p.y for p in sec) - min(p.y for p in sec)
holes = [(cx, cy - span * 0.22), (cx, cy + span * 0.22)]
print("SECCAO pontos=%d centro=(%.1f,%.1f) extensao_y=%.1f" % (len(sec), cx, cy, span))
for part in (ob, top):
    for (hx, hy) in holes:
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=(PIN_D + PIN_FOLGA * 2) / 2,
                                            depth=PIN_PROF * 2 + 1, location=(hx, hy, zj))
        cyl = bpy.context.active_object; boolean(part, cyl, "DIFFERENCE"); bpy.data.objects.remove(cyl, do_unlink=True)

# 6) parte 2 virada (junta na mesa); rodar cada parte em Z para a menor pegada na mesa 220x220
def place(part, flip):
    bpy.ops.object.select_all(action="DESELECT"); part.select_set(True); bpy.context.view_layer.objects.active = part
    if flip:
        part.rotation_euler = (math.pi, 0, 0); bpy.ops.object.transform_apply(rotation=True)
    xy = [(v.co.x, v.co.y) for v in list(part.data.vertices)[::20]]
    best = None
    for d in range(0, 180, 3):
        t = math.radians(d); c, s_ = math.cos(t), math.sin(t)
        xs = [x * c - y * s_ for x, y in xy]; ys = [x * s_ + y * c for x, y in xy]
        w = max(max(xs) - min(xs), max(ys) - min(ys))
        if best is None or w < best[0]: best = (w, t)
    part.rotation_euler = (0, 0, best[1]); bpy.ops.object.transform_apply(rotation=True)
    mn, mx = bb(part); part.location -= mathutils.Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
    bpy.ops.object.transform_apply(location=True)
    print("ROTACAO %s %.0f graus" % (part.name, math.degrees(best[1])))

place(ob, False); place(top, True)
for part in (ob, top):
    stats(part, part.name)
    bpy.ops.object.select_all(action="DESELECT"); part.select_set(True)
    bpy.ops.wm.stl_export(filepath=f"{pref}_{part.name}.stl", export_selected_objects=True)
print("PINOS cilindro Ø%.1f mm x %.0f mm (2 unidades); furos Ø%.1f mm, prof. %.0f mm; junta z=%.1f mm"
      % (PIN_D, PIN_PROF * 2 - 1, PIN_D + 2 * PIN_FOLGA, PIN_PROF, zj))
