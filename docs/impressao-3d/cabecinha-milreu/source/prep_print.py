# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Prepara a malha gerada por IA para impressão FDM.
# Uso: Blender -b -P prep_print.py -- <in.glb> <out.stl> <altura_mm> [corte_base_frac]
import bpy, bmesh, sys, mathutils
a = sys.argv[sys.argv.index("--") + 1:]
src, out, H = a[0], a[1], float(a[2])
cut = float(a[3]) if len(a) > 3 else 0.02   # fração da altura cortada na base para a tornar plana

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
bpy.ops.object.select_all(action="DESELECT")
for o in meshes: o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def bbox(o):
    v = [o.matrix_world @ x.co for x in o.data.vertices]
    return (mathutils.Vector([min(p[i] for p in v) for i in range(3)]),
            mathutils.Vector([max(p[i] for p in v) for i in range(3)]))

# 1) escala: altura (Z) = H mm (unidades do STL = mm)
mn, mx = bbox(ob); s = H / (mx.z - mn.z)
ob.scale = (s, s, s); bpy.ops.object.transform_apply(scale=True)
mn, mx = bbox(ob)
ob.location -= mathutils.Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
bpy.ops.object.transform_apply(location=True)

# 1b) juntar vértices separados nas costuras de textura e fechar buracos
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.remove_doubles(threshold=0.01); bpy.ops.mesh.fill_holes(sides=0)
bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode="OBJECT")

# 2) malha estanque: remesh por voxel (0,15 mm ≈ abaixo da resolução de uma camada FDM)
rm = ob.modifiers.new("vox", "REMESH"); rm.mode = "VOXEL"; rm.voxel_size = 0.15
bpy.ops.object.modifier_apply(modifier=rm.name)

# 3) base plana: cortar e fechar
bm = bmesh.new(); bm.from_mesh(ob.data)
zc = H * cut
res = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:],
                             plane_co=(0, 0, zc), plane_no=(0, 0, 1), clear_inner=True)
edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
bmesh.ops.holes_fill(bm, edges=edges, sides=0)
bmesh.ops.translate(bm, verts=bm.verts, vec=(0, 0, -zc))
bm.to_mesh(ob.data); bm.free()

# 4) reduzir para ~400 mil triângulos (suficiente para 0,1–0,2 mm de camada)
n0 = len(ob.data.polygons)
if n0 > 400000:
    dm = ob.modifiers.new("dec", "DECIMATE"); dm.ratio = 400000 / n0
    bpy.ops.object.modifier_apply(modifier=dm.name)

# 5) verificação
bm = bmesh.new(); bm.from_mesh(ob.data)
nm = sum(1 for e in bm.edges if not e.is_manifold)
vol = bm.calc_volume(signed=False); bm.free()
mn, mx = bbox(ob)
print("STATS faces=%d nao_manifold=%d volume_cm3=%.1f dim_mm=%.1fx%.1fx%.1f"
      % (len(ob.data.polygons), nm, vol / 1000, *(mx - mn)))
bpy.ops.wm.stl_export(filepath=out, export_selected_objects=False, ascii_format=False)
