#!/usr/bin/env python3
"""
generate_brain.py
─────────────────────────────────────────────────────────────────
Generates a stylised anatomical brain GLB model for the Brain Visualizer.

Algorithm:
  1. Build a high-res UV-sphere base mesh
  2. Deform it into a brain shape (ellipsoid + lobes + fissure)
  3. Add multi-scale gyri/sulci noise for cortical folding detail
  4. Build a separate cerebellum with horizontal striations
  5. Merge meshes and export as binary GLB via pygltflib

Requirements: numpy, scipy, pygltflib  (all already installed)
"""

import os
import numpy as np
import pygltflib

# ── Config ──────────────────────────────────────────────────────
BRAIN_SECTORS = 120
BRAIN_RINGS   = 90
CEREB_SECTORS = 60
CEREB_RINGS   = 46
RANDOM_SEED   = 42
OUTPUT_PATH   = "frontend/public/models/brain.glb"


# ── Mesh primitives ─────────────────────────────────────────────
def uv_sphere(sectors: int, rings: int):
    """UV-sphere with outward-facing CCW triangles."""
    rows = rings + 2          # includes both pole rows
    verts = []
    for r in range(rows):
        phi = np.pi * r / (rows - 1)   # 0 → π
        for s in range(sectors):
            theta = 2.0 * np.pi * s / sectors
            verts.append([
                np.sin(phi) * np.cos(theta),
                np.cos(phi),
                np.sin(phi) * np.sin(theta),
            ])
    verts = np.array(verts, dtype=np.float32)

    faces = []
    for r in range(rows - 1):
        for s in range(sectors):
            a = r       * sectors + s
            b = r       * sectors + (s + 1) % sectors
            c = (r + 1) * sectors + s
            d = (r + 1) * sectors + (s + 1) % sectors
            faces.append([a, b, c])   # CCW outward
            faces.append([b, d, c])
    return verts, np.array(faces, dtype=np.uint32)


def compute_normals(verts, faces):
    """Area-weighted per-vertex normals."""
    fn = np.cross(verts[faces[:, 1]] - verts[faces[:, 0]],
                  verts[faces[:, 2]] - verts[faces[:, 0]])
    vn = np.zeros_like(verts)
    for i in range(3):
        np.add.at(vn, faces[:, i], fn)
    length = np.linalg.norm(vn, axis=1, keepdims=True).clip(1e-8)
    return (vn / length).astype(np.float32)


def ensure_outward(verts, faces):
    """Flip face winding if normals point inward on average."""
    nrm = compute_normals(verts, faces)
    centroid = verts.mean(axis=0)
    avg_dot = np.mean(np.sum(nrm * (verts - centroid), axis=1))
    if avg_dot < 0:
        faces = faces[:, [0, 2, 1]]
    return faces


# ── Brain deformation ────────────────────────────────────────────
def shape_brain(verts, rng):
    v = verts.copy()

    # 1. Stretch to anatomical proportions (width > depth > height)
    v[:, 0] *= 1.30   # X: left-right
    v[:, 1] *= 1.05   # Y: up-down
    v[:, 2] *= 1.18   # Z: front-back

    r   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm = v / r
    nx, ny, nz = nrm[:, 0], nrm[:, 1], nrm[:, 2]

    # 2. Anatomical lobe bumps (displace along surface normal)
    frontal  = 0.14 * np.exp(-1.5 * (nz - 0.75)**2) * np.exp(-2.0 * ny**2)
    occip    = 0.09 * np.exp(-2.5 * (nz + 0.70)**2)
    temporal = 0.10 * np.exp(-3.5 * (np.abs(nx) - 0.72)**2) * np.exp(-2.0 * (ny + 0.30)**2)
    parietal = 0.07 * np.exp(-3.0 * (nz + 0.10)**2) * np.exp(-2.0 * (ny - 0.55)**2)

    # 3. Interhemispheric fissure – groove along midline (x≈0) at top
    fissure  = -0.24 * np.exp(-14.0 * nx**2) * np.maximum(ny, 0.0)**1.3

    disp = frontal + occip + temporal + parietal + fissure
    v   += nrm * disp[:, np.newaxis]

    # 4. Multi-scale gyri/sulci noise (layered sinusoids → cortical folds)
    r2   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm2 = v / r2
    nx2, ny2, nz2 = nrm2[:, 0], nrm2[:, 1], nrm2[:, 2]

    noise = np.zeros(len(v))
    for freq, amp, ndirs in [(4.5, 0.115, 6), (8.0, 0.065, 8),
                              (13.0, 0.038, 10), (21.0, 0.018, 12)]:
        dirs = rng.randn(ndirs, 3)
        dirs /= np.linalg.norm(dirs, axis=1, keepdims=True)
        for d in dirs:
            phase = rng.uniform(0, 2 * np.pi)
            proj  = nx2 * d[0] + ny2 * d[1] + nz2 * d[2]
            noise += (amp / ndirs) * np.sin(freq * np.pi * proj + phase)

    v += nrm2 * noise[:, np.newaxis]
    v *= 1.85   # final scale ≈ 2-unit radius
    return v.astype(np.float32)


# ── Cerebellum deformation ───────────────────────────────────────
def shape_cerebellum(verts, rng):
    v = verts.copy()
    v[:, 0] *= 1.00   # width
    v[:, 1] *= 0.60   # height (flat)
    v[:, 2] *= 0.80   # depth

    r   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm = v / r
    ny  = nrm[:, 1]

    # Horizontal striations characteristic of the cerebellum
    stria = 0.06 * np.sin(16.0 * np.pi * ny) + 0.03 * np.sin(32.0 * np.pi * ny)
    v    += nrm * stria[:, np.newaxis]

    v *= 0.75           # scale down relative to brain
    v[:, 1] -= 1.10    # shift down
    v[:, 2] -= 1.25    # shift back (posterior)
    return v.astype(np.float32)


# ── Mesh merge ───────────────────────────────────────────────────
def merge_meshes(*parts):
    all_v, all_f, offset = [], [], 0
    for v, f in parts:
        all_v.append(v)
        all_f.append(f + offset)
        offset += len(v)
    return (np.vstack(all_v).astype(np.float32),
            np.vstack(all_f).astype(np.uint32))


# ── GLB export ───────────────────────────────────────────────────
def export_glb(verts, normals, faces, path):
    v_b = verts.tobytes()
    n_b = normals.tobytes()
    f_b = faces.tobytes()

    def align4(n): return n + (-n % 4)

    f_off = 0
    v_off = align4(f_off + len(f_b))
    n_off = align4(v_off + len(v_b))
    total = align4(n_off + len(n_b))

    buf = bytearray(total)
    buf[f_off:f_off+len(f_b)] = f_b
    buf[v_off:v_off+len(v_b)] = v_b
    buf[n_off:n_off+len(n_b)] = n_b

    pmin = [float(x) for x in verts.min(axis=0)]
    pmax = [float(x) for x in verts.max(axis=0)]

    gltf = pygltflib.GLTF2(
        scene=0,
        scenes=[pygltflib.Scene(nodes=[0])],
        nodes=[pygltflib.Node(mesh=0, name="Brain")],
        meshes=[pygltflib.Mesh(name="Brain", primitives=[
            pygltflib.Primitive(
                attributes=pygltflib.Attributes(POSITION=1, NORMAL=2),
                indices=0,
            )
        ])],
        accessors=[
            pygltflib.Accessor(bufferView=0,
                componentType=pygltflib.UNSIGNED_INT,
                count=int(faces.size), type=pygltflib.SCALAR,
                min=[int(faces.min())], max=[int(faces.max())]),
            pygltflib.Accessor(bufferView=1,
                componentType=pygltflib.FLOAT,
                count=int(len(verts)), type=pygltflib.VEC3,
                min=pmin, max=pmax),
            pygltflib.Accessor(bufferView=2,
                componentType=pygltflib.FLOAT,
                count=int(len(normals)), type=pygltflib.VEC3),
        ],
        bufferViews=[
            pygltflib.BufferView(buffer=0, byteOffset=f_off, byteLength=len(f_b),
                target=pygltflib.ELEMENT_ARRAY_BUFFER),
            pygltflib.BufferView(buffer=0, byteOffset=v_off, byteLength=len(v_b),
                target=pygltflib.ARRAY_BUFFER),
            pygltflib.BufferView(buffer=0, byteOffset=n_off, byteLength=len(n_b),
                target=pygltflib.ARRAY_BUFFER),
        ],
        buffers=[pygltflib.Buffer(byteLength=total)],
    )
    gltf.set_binary_blob(bytes(buf))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    gltf.save_binary(path)
    kb = os.path.getsize(path) / 1024
    print(f"  ✓  {path}  |  {len(verts):,} verts  |  {len(faces):,} tris  |  {kb:.0f} KB")


# ── Main ─────────────────────────────────────────────────────────
def main():
    rng = np.random.RandomState(RANDOM_SEED)

    print("Generating brain mesh …")
    bv, bf = uv_sphere(BRAIN_SECTORS, BRAIN_RINGS)
    bv = shape_brain(bv, rng)
    bf = ensure_outward(bv, bf)

    print("Generating cerebellum mesh …")
    cv, cf = uv_sphere(CEREB_SECTORS, CEREB_RINGS)
    cv = shape_cerebellum(cv, rng)
    cf = ensure_outward(cv, cf)

    print("Merging & computing normals …")
    verts, faces = merge_meshes((bv, bf), (cv, cf))
    normals = compute_normals(verts, faces)

    print("Exporting GLB …")
    export_glb(verts, normals, faces, OUTPUT_PATH)


if __name__ == "__main__":
    main()


