# © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.
import bpy, bmesh, sys
a=sys.argv[sys.argv.index("--")+1:]; bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.stl_import(filepath=a[0]); ob=bpy.context.selected_objects[0]; bpy.context.view_layer.objects.active=ob
m=ob.modifiers.new("d","DECIMATE"); m.ratio=int(a[2])/len(ob.data.polygons); bpy.ops.object.modifier_apply(modifier="d")
bm=bmesh.new(); bm.from_mesh(ob.data); print("STATS faces=%d nao_manifold=%d"%(len(ob.data.polygons),sum(1 for e in bm.edges if not e.is_manifold)))
bpy.ops.wm.stl_export(filepath=a[1])
