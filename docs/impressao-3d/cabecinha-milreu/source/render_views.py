# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Uso: Blender -b -P render_views.py -- <modelo.glb|.stl> <prefixo_saida>
import bpy, sys, math, mathutils
argv = sys.argv[sys.argv.index("--") + 1:]
src, out = argv[0], argv[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
if src.lower().endswith(".stl"):
    bpy.ops.wm.stl_import(filepath=src)
else:
    bpy.ops.import_scene.gltf(filepath=src)
objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
pts = [o.matrix_world @ mathutils.Vector(c) for o in objs for c in o.bound_box]
mn = mathutils.Vector([min(p[i] for p in pts) for i in range(3)])
mx = mathutils.Vector([max(p[i] for p in pts) for i in range(3)])
ctr, size = (mn + mx) / 2, max(mx - mn)
print("BBOX", tuple(round(v, 4) for v in (mx - mn)))
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "SINGLE"
sc.display.shading.single_color = (0.85, 0.82, 0.76)
sc.display.shading.show_cavity = True
sc.render.resolution_x = sc.render.resolution_y = 700
sc.render.film_transparent = False
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = "ORTHO"; cam.data.ortho_scale = size * 1.6
up = "Z" if (src.lower().endswith(".stl") or (mx - mn).z >= (mx - mn).y) else "Y"
for name, ang in [("frente", 0), ("tres_quartos", 45), ("perfil", 90), ("costas", 180)]:
    a = math.radians(ang); d = size * 3
    if up == "Y":   # glTF: Y para cima, frente em +Z
        cam.location = ctr + mathutils.Vector((d * math.sin(a), 0, d * math.cos(a)))
    else:
        cam.location = ctr + mathutils.Vector((d * math.sin(a), -d * math.cos(a), 0))
    upv = mathutils.Vector((0, 1, 0)) if up == "Y" else mathutils.Vector((0, 0, 1))
    cam.rotation_euler = (ctr - cam.location).to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = f"{out}_{name}.png"
    bpy.ops.render.render(write_still=True)
