import bpy, math, os, random

OUT = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'media')
os.makedirs(OUT, exist_ok=True)

def clean():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def setup_render(name, res_x=1280, res_y=800, samples=32, fps=24, frame_end=96):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x = res_x
    scene.render.resolution_y = res_y
    scene.render.resolution_percentage = 100
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = frame_end
    # Blender 5.x in this build: render PNG sequence, then encode via ffmpeg
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    frames_dir = os.path.join(OUT, '_frames_' + os.path.splitext(name)[0])
    os.makedirs(frames_dir, exist_ok=True)
    scene.render.filepath = os.path.join(frames_dir, 'frame_')
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'High Contrast'
    world = bpy.data.worlds.new('W')
    scene.world = world
    bg = world.node_tree.nodes['Background']
    bg.inputs[0].default_value = (0.02, 0.02, 0.022, 1)
    bg.inputs[1].default_value = 0.7
    return scene, name, frames_dir

def add_camera(loc, rot, lens=50):
    cam_data = bpy.data.cameras.new('Cam')
    cam_data.lens = lens
    cam = bpy.data.objects.new('Cam', cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    cam.rotation_euler = rot
    bpy.context.scene.camera = cam
    return cam

def area_light(loc, energy=800, size=2, color=(1,0.95,0.9)):
    d = bpy.data.lights.new(name='A', type='AREA')
    d.energy = energy
    d.size = size
    d.color = color
    o = bpy.data.objects.new('A', d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (math.radians(55), 0, math.radians(35))
    return o

def point_light(loc, energy=300, color=(1,1,1)):
    d = bpy.data.lights.new(name='P', type='POINT')
    d.energy = energy
    d.color = color
    o = bpy.data.objects.new('P', d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    return o

def mat_metal(name, color=(0.08,0.08,0.09,1), rough=0.18, metal=0.95):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    return m

def mat_emissive(name, color=(1,0.3,0.15,1), strength=8):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial')
    em = nodes.new('ShaderNodeEmission')
    em.inputs[0].default_value = color
    em.inputs[1].default_value = strength
    links.new(em.outputs[0], out.inputs[0])
    return m

def mat_glass(name, color=(0.9,0.95,1,1), rough=0.05, ior=1.45):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Transmission Weight'].default_value = 0.95
    bsdf.inputs['IOR'].default_value = ior
    return m

def render_still(name):
    scene = bpy.context.scene
    old_fmt = scene.render.image_settings.file_format
    old_path = scene.render.filepath
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.filepath = os.path.join(OUT, name)
    scene.frame_set(scene.frame_end // 2)
    bpy.ops.render.render(write_still=True)
    scene.render.image_settings.file_format = old_fmt
    scene.render.filepath = old_path

def encode_frames(scene, name, frames_dir):
    pattern = os.path.join(frames_dir, 'frame_%04d.png')
    out = os.path.join(OUT, name)
    import subprocess
    cmd = ['ffmpeg', '-y', '-framerate', str(scene.render.fps), '-i', pattern, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print('ENCODED', out)
    except Exception as e:
        print('ENCODE FAIL', e)

# 1) GLASS - glass panels / architecture
clean()
scene, gs_name, gs_frames = setup_render('glass.mp4', 1600, 1000, 48, 30, 150)
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.03,0.035,0.04,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.5
add_camera((4.5, -5.5, 3.2), (math.radians(72), 0, math.radians(38)), 45)
area_light((3, -2, 5), 1200, 4, (1,0.97,0.92))
point_light((-3, 2, 2), 400, (0.4,0.7,1.0))
point_light((2, 3, 1), 250, (1,0.4,0.2))

# floor
bpy.ops.mesh.primitive_plane_add(size=30, location=(0,0,-1))
floor = bpy.context.active_object
floor_mat = mat_metal('Floor', (0.03,0.03,0.035,1), 0.12, 0.4)
floor.data.materials.append(floor_mat)

# glass panels
for i in range(7):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(i*0.55-1.6, i*0.1-0.3, 0.3 + i*0.05))
    p = bpy.context.active_object
    p.scale = (0.8, 0.03, 1.2 - i*0.06)
    bpy.ops.object.transform_apply(scale=True)
    p.rotation_euler = (0, 0, math.radians(15 + i*4))
    p.data.materials.append(mat_glass(f'G{i}', (0.85,0.92,1,1), 0.03, 1.45))
    p.keyframe_insert(data_path='rotation_euler', frame=1)
    p.rotation_euler.z += math.radians(8)
    p.keyframe_insert(data_path='rotation_euler', frame=150)

# accent emissive ring
bpy.ops.mesh.primitive_torus_add(major_radius=1.2, minor_radius=0.015, location=(0,0,0.2))
ring = bpy.context.active_object
ring.data.materials.append(mat_emissive('Ring', (1,0.35,0.2,1), 15))
ring.rotation_euler.x = math.radians(90)
ring.keyframe_insert(data_path='rotation_euler', frame=1)
ring.rotation_euler.z = math.radians(360)
ring.keyframe_insert(data_path='rotation_euler', frame=150)
try:
        act = ring.animation_data.action
    try:
        for fc in act.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
    except Exception:
        pass
    except Exception:
        pass

# small metal spheres
for i in range(5):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.08, location=(-1+i*0.5, 0.8-i*0.3, -0.2+i*0.15))
    s = bpy.context.active_object
    s.data.materials.append(mat_metal(f'M{i}', (0.1,0.1,0.12,1), 0.15, 1))

render_still('glass-poster.jpg')
bpy.ops.render.render(animation=True)
encode_frames(scene, gs_name, gs_frames)

# 2) SIGNAL - abstract icosahedron
clean()
scene, gs_name, gs_frames = setup_render('signal.mp4', 1600, 1000, 48, 30, 150)
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.015,0.015,0.018,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.4
add_camera((0, -5.2, 0.8), (math.radians(82), 0, 0), 55)
area_light((3, -3, 4), 900, 3, (1,0.95,0.9))
point_light((-3, -2, 2), 500, (1,0.3,0.15))
point_light((0, 3, 3), 300, (0.5,0.7,1))

bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=5, radius=1.4, location=(0,0,0))
ico = bpy.context.active_object
ico.data.materials.append(mat_metal('Ico', (0.85,0.85,0.88,1), 0.25, 0.7))
# displace modifier for organic look
tex = bpy.data.textures.new('DispTex', type='MUSGRAVE')
tex.noise_scale = 1.2
disp = ico.modifiers.new('Disp', 'DISPLACE')
disp.texture = tex
disp.strength = 0.18
bpy.ops.object.shade_smooth()
ico.keyframe_insert(data_path='rotation_euler', frame=1)
ico.rotation_euler = (math.radians(40), math.radians(360), math.radians(20))
ico.keyframe_insert(data_path='rotation_euler', frame=150)
try:
        act = ring.animation_data.action
    try:
        for fc in act.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
    except Exception:
        pass
    except Exception:
        pass

# wireframe copy
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.55, location=(0,0,0))
w = bpy.context.active_object
w.data.materials.append(mat_emissive('Wire', (1,0.35,0.2,1), 6))
bpy.ops.object.modifier_add(type='WIREFRAME')
w.modifiers['Wireframe'].thickness = 0.01
w.keyframe_insert(data_path='rotation_euler', frame=1)
w.rotation_euler = (math.radians(-20), math.radians(-360), 0)
w.keyframe_insert(data_path='rotation_euler', frame=150)
try:
        act = ring.animation_data.action
    try:
        for fc in act.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = 'LINEAR'
    except Exception:
        pass
    except Exception:
        pass

render_still('signal-poster.jpg')
bpy.ops.render.render(animation=True)
encode_frames(scene, gs_name, gs_frames)

# 3) POSTER - abstract type/shape composition
clean()
scene, gs_name, gs_frames = setup_render('poster.mp4', 1600, 1000, 32, 30, 120)
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.04,0.04,0.042,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.8
add_camera((0, -6, 0), (math.radians(90), 0, 0), 50)
area_light((2, -3, 4), 1000, 5, (1,0.98,0.95))

# big red plane
bpy.ops.mesh.primitive_plane_add(size=2, location=(-0.8, 0.5, 0.2))
r = bpy.context.active_object
r.scale = (1.4, 1, 1); bpy.ops.object.transform_apply(scale=True)
r.data.materials.append(mat_metal('Red', (0.9,0.25,0.12,1), 0.4, 0.1))
r.keyframe_insert(data_path='location', frame=1)
r.location.x += 0.15
r.keyframe_insert(data_path='location', frame=120)

# white slabs
for i, (loc, sc, rot) in enumerate([((0.8,-0.2,0.3),(1.8,0.7,1), 0.05), ((-0.2,-0.8,0.35),(1.2,0.15,1), -0.02), ((1.1,0.8,0.25),(0.5,1.2,1), 0.1)]):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    p = bpy.context.active_object
    p.scale = sc; bpy.ops.object.transform_apply(scale=True)
    p.rotation_euler.z = rot
    p.data.materials.append(mat_metal(f'W{i}', (0.95,0.93,0.9,1), 0.6, 0))
    p.keyframe_insert(data_path='rotation_euler', frame=1)
    p.rotation_euler.z += 0.08
    p.keyframe_insert(data_path='rotation_euler', frame=120)

# black frame
bpy.ops.mesh.primitive_cube_add(size=1, location=(0,0.2,0.15))
fr = bpy.context.active_object
fr.scale = (2.2, 1.4, 0.02); bpy.ops.object.transform_apply(scale=True)
fr.data.materials.append(mat_metal('Blk', (0.06,0.06,0.06,1), 0.8, 0))

render_still('poster-poster.jpg')
bpy.ops.render.render(animation=True)
encode_frames(scene, gs_name, gs_frames)

# 4) TYPE - kinetic letter blocks
clean()
scene, gs_name, gs_frames = setup_render('type.mp4', 1600, 1000, 32, 30, 140)
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.05,0.048,0.045,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.6
add_camera((0, -7, 1.5), (math.radians(78), 0, 0), 45)
area_light((2, -4, 5), 1100, 4, (1,0.96,0.92))
point_light((-3, -2, 2), 300, (1,0.35,0.2))

# floor
bpy.ops.mesh.primitive_plane_add(size=20, location=(0,0,-0.5))
fl = bpy.context.active_object
fl.data.materials.append(mat_metal('Fl', (0.04,0.04,0.045,1), 0.3, 0.2))

letters = ['T','Y','P','E']
for i, ch in enumerate(letters):
    bpy.ops.object.text_add(location=(i*1.1-1.65, 0, 0))
    t = bpy.context.active_object
    t.data.body = ch
    t.data.extrude = 0.25
    t.data.bevel_depth = 0.02
    t.data.size = 1.2
    t.data.align_x = 'CENTER'
    t.rotation_euler.x = math.radians(90)
    t.data.materials.append(mat_metal(f'L{i}', (0.92,0.9,0.86,1) if i!=1 else (1,0.35,0.2,1), 0.35, 0.1))
    bpy.ops.object.convert(target='MESH')
    obj = bpy.context.active_object
    obj.keyframe_insert(data_path='location', frame=1)
    obj.location.z += 0.3 + i*0.1
    obj.rotation_euler.y = math.radians(15 - i*10)
    obj.keyframe_insert(data_path='location', frame=70)
    obj.keyframe_insert(data_path='rotation_euler', frame=70)
    obj.location.z -= 0.3 + i*0.1
    obj.rotation_euler.y = 0
    obj.keyframe_insert(data_path='location', frame=140)
    obj.keyframe_insert(data_path='rotation_euler', frame=140)
    for fc in obj.animation_data.action.fcurves:
        for kp in fc.keyframe_points: kp.interpolation = 'BEZIER'

render_still('type-poster.jpg')
bpy.ops.render.render(animation=True)
encode_frames(scene, gs_name, gs_frames)

print('DONE')


