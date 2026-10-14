# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
# Pino de alinhamento Ø6 x 19 mm com chanfro 0,6 mm nas pontas (2 unidades, lado a lado). Uso: -- <out.stl>
import bpy, bmesh, sys
out = sys.argv[sys.argv.index("--") + 1]
bpy.ops.wm.read_factory_settings(use_empty=True)
for i, x in enumerate((-6, 6)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=3.0, depth=19, location=(x, 0, 9.5))
    o = bpy.context.active_object
    bv = o.modifiers.new("ch", "BEVEL"); bv.width = 0.6; bv.segments = 1; bv.limit_method = "ANGLE"
    bpy.ops.object.modifier_apply(modifier=bv.name)
bpy.ops.object.select_all(action="SELECT"); bpy.ops.wm.stl_export(filepath=out, export_selected_objects=True)
print("PIN ok")
