#!/usr/bin/env python3
"""
generate_brain.py  (v4 — Marching Cubes / Implicit Surface)
─────────────────────────────────────────────────────────────────
Creates ONE unified brain mesh using a volumetric density field
+ scikit-image Marching Cubes.  This is the correct way to get a
single, solid, smooth brain shape:

  • Two hemisphere ellipsoids whose smooth UNION creates a single
    connected brain (natural groove at midline, not a gap).
  • Fissure carved as a deep notch into the isosurface.
  • Temporal lobes bulge outward and downward.
  • Gyri/sulci are directional sinusoids along Z (front-back),
    so ridges run left-right like real cortical folds.
  • Cerebellum extracted from its own density field.

Requirements: numpy, scipy, scikit-image, pygltflib
"""

import os
import numpy as np
from scipy import ndimage
from skimage import measure
import pygltflib

# ── Config ──────────────────────────────────────────────────────
GRID   = 120          # voxels per axis (120³ ≈ 1.7M voxels, ~fast)
RANGE  = 2.2          # world-unit half-extent of the grid
OUTPUT_PATH = "frontend/public/models/brain.glb"


# ── Density field builders ───────────────────────────────────────
def make_grid(N, R):
    """Return (X, Y, Z) meshgrid arrays in world coords [-R, R]."""
    t = np.linspace(-R, R, N, dtype=np.float32)
    return np.meshgrid(t, t, t, indexing='ij')   # shapes (N,N,N)


def build_brain_field(N, R):
    """
    Volumetric density field for the cerebral cortex.
    Positive  = inside brain, negative = outside.
    The isosurface at level=0 is the brain surface.
    """
    X, Y, Z = make_grid(N, R)

    # ── 1. Two hemisphere ellipsoids ──────────────────────────────
    # Centers offset ±0.42 along X. Their max-union creates ONE
    # connected mesh with a natural saddle/groove at X≈0 (the fissure).
    def hemi(cx, rx=1.15, ry=0.95, rz=1.20):
        return 1.0 - ((X - cx) / rx)**2 - (Y / ry)**2 - (Z / rz)**2

    field = np.maximum(hemi(+0.42), hemi(-0.42))

    # ── 2. Temporal lobe: bulge outward + downward ────────────────
    temporal = (
        0.40 * np.exp(-2.0 * (np.abs(X) - 1.05)**2)
             * np.exp(-2.2 * (Y + 0.52)**2)
             * np.exp(-1.2 * Z**2)
    )
    field += temporal

    # ── 3. Frontal pole: push forward ────────────────────────────
    frontal = (
        0.18 * np.exp(-1.5 * (Z - 1.35)**2)
             * np.exp(-0.8 * Y**2)
    )
    field += frontal

    # ── 4. Occipital pole: slight posterior rounding ──────────────
    occipital = 0.12 * np.exp(-2.0 * (Z + 1.30)**2)
    field += occipital

    # ── 5. Flatten the inferior surface ──────────────────────────
    # The brain doesn't extend much below its widest point.
    flat_base = -2.0 * np.clip(-Y - 0.80, 0.0, 1.0) ** 2
    field += flat_base

    # ── 6. Interhemispheric fissure ───────────────────────────────
    # A DEEP groove at X=0 running from crown to equator.
    # Implemented as a subtraction — creates a groove IN the surface,
    # NOT a gap. Both hemispheres remain connected below.
    fissure = (
        0.90 * np.exp(-25.0 * X**2)            # narrow at midline
             * np.clip(Y * 1.6, 0.0, 1.0)**0.5 # only top half
             * np.clip(1.0 - np.abs(Z) * 0.5, 0.3, 1.0)  # taper front/back
    )
    field -= fissure

    # ── 7. Directional gyri / sulci ───────────────────────────────
    # Ridges run LEFT-RIGHT (perpendicular to Z = anterior-posterior axis).
    # This matches real cortical anatomy viewed from the side or top.
    gyri = (
        0.10 * np.sin(4.5 * np.pi * Z)          # ~4 primary gyri
      + 0.07 * np.sin(9.0 * np.pi * Z + 0.9)   # secondary sulci
      + 0.04 * np.sin(16.0 * np.pi * Z + 2.0)  # fine folds
      + 0.02 * np.sin(7.0  * np.pi * X + 0.4)  # mild lateral variation
             * np.cos(11.0 * np.pi * Z + 1.2)
    )
    # Clamp gyri to the near-surface region only (avoid corrupting interior)
    surface_weight = np.clip(field * 4.0 + 0.5, 0.0, 1.0)
    field += gyri * surface_weight

    return field


def build_cerebellum_field(N, R):
    """
    Separate density field for the cerebellum.
    Positioned posterior-inferior (negative Y, negative Z).
    """
    X, Y, Z = make_grid(N, R)

    # Compact ellipsoid at the rear-bottom
    field = 1.0 - (X / 0.90)**2 - ((Y + 0.85) / 0.52)**2 - ((Z + 1.10) / 0.65)**2

    # Tight horizontal striations (characteristic of cerebellum folia)
    striations = 0.07 * np.sin(20.0 * np.pi * Z)
    surface_w  = np.clip(field * 4.0 + 0.3, 0.0, 1.0)
    field += striations * surface_w

    return field

    verts = []
    for r in range(rows):
        phi = np.pi * r / (rows - 1)          # 0 (top pole) → π (bottom pole)
        for s in range(nc):
            if not left:
                theta = -np.pi / 2 + np.pi * s / half   # -π/2 → π/2  (x ≥ 0)
            else:
                theta =  np.pi / 2 + np.pi * s / half   #  π/2 → 3π/2 (x ≤ 0)
            verts.append([
                np.sin(phi) * np.cos(theta),
                np.cos(phi),
                np.sin(phi) * np.sin(theta),
            ])
    verts = np.array(verts, dtype=np.float32)

    faces = []
    for r in range(rows - 1):
        for s in range(half):
            a = r * nc + s
            b = r * nc + s + 1
            c = (r + 1) * nc + s
            d = (r + 1) * nc + s + 1
            if left:
                # Flip winding so normals still point outward on mirrored side
                faces.append([a, c, b])
                faces.append([b, c, d])
            else:
                faces.append([a, b, c])
                faces.append([b, d, c])
    return verts, np.array(faces, dtype=np.uint32)


def uv_sphere(sectors: int, rings: int):
    """Full UV-sphere (used for cerebellum)."""
    rows = rings + 2
    verts = []
    for r in range(rows):
        phi = np.pi * r / (rows - 1)
        for s in range(sectors):
            theta = 2.0 * np.pi * s / sectors
            verts.append([np.sin(phi) * np.cos(theta),
                          np.cos(phi),
                          np.sin(phi) * np.sin(theta)])
    verts = np.array(verts, dtype=np.float32)
    faces = []
    for r in range(rows - 1):
        for s in range(sectors):
            a = r * sectors + s
            b = r * sectors + (s + 1) % sectors
            c = (r + 1) * sectors + s
            d = (r + 1) * sectors + (s + 1) % sectors
            faces.append([a, b, c])
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


# ── Hemisphere deformation ───────────────────────────────────────
def shape_hemisphere(verts):
    """
    Deform one hemisphere into an anatomically plausible shape.
    All deformations are in world space on the unit half-sphere.
    left=True mirrors x so the same code works for both sides.
    """
    v = verts.copy()

    # ── 1. Ellipsoid: brain proportions ──────────────────────────
    # x (lateral), y (superior-inferior), z (anterior-posterior)
    v[:, 0] *= 1.22   # lateral width per hemisphere
    v[:, 1] *= 0.95   # slightly compressed vertically
    v[:, 2] *= 1.25   # front-back elongation

    # ── 2. Lobe shaping (normal-based displacements) ─────────────
    r   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm = v / r
    nx, ny, nz = nrm[:, 0], nrm[:, 1], nrm[:, 2]

    # Frontal lobe: rounded anterior bulge
    frontal   = 0.14 * np.exp(-1.8 * (nz - 0.85)**2) * np.exp(-1.2 * ny**2)
    # Temporal lobe: distinctive downward bulge on lateral face
    temporal  = 0.22 * np.exp(-3.5 * (nx - 0.70)**2) \
                     * np.exp(-2.0 * (ny + 0.38)**2)
    # Occipital pole: slightly narrow posterior
    occipital = 0.08 * np.exp(-2.5 * (nz + 0.90)**2)
    # Flat base (brain sits on skull base)
    flat_base = -0.18 * np.clip(-ny - 0.40, 0, 1) ** 1.2
    # Medial face is slightly concave (faces the fissure)
    medial_concave = -0.06 * np.exp(-6.0 * nx**2) * np.clip(ny, 0, 1)

    disp = frontal + temporal + occipital + flat_base + medial_concave
    v += nrm * disp[:, np.newaxis]

    # ── 3. Directional sulci / gyri ──────────────────────────────
    # Primary sulci run LEFT-RIGHT (perpendicular to z = anterior-posterior).
    # Using the NORMALIZED z-component so folds are evenly spaced across surface.
    r2   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm2 = v / r2
    nz2  = nrm2[:, 1]   # use y-component to avoid symmetry issues
    nz_s = nrm2[:, 2]   # anterior-posterior
    ny_s = nrm2[:, 1]   # superior-inferior

    # Superior cortex: parallel ridges running anterior-posterior
    primary = (
        0.110 * np.sin(4.0 * np.pi * nz_s)
      + 0.065 * np.sin(8.5 * np.pi * nz_s + 0.9)
      + 0.035 * np.sin(15.0 * np.pi * nz_s + 1.8)
    )
    # Lateral (temporal) sulci running superior-inferior
    lateral = (
        0.070 * np.sin(6.0 * np.pi * ny_s + 0.5)
        * np.exp(-2.0 * (nrm2[:, 0] - 0.75)**2)   # only on outer face
    )

    v += nrm2 * (primary + lateral)[:, np.newaxis]

    # ── 4. Offset laterally to create the fissure gap ────────────
    #    The right hemisphere shifts +x, left shifts -x.
    #    (left hemisphere x was already mirrored in uv_hemisphere)
    v[:, 0] += FISSURE_GAP

    v *= 1.70   # final scale: hemispheres ≈ 1.7–2.0 world-unit radius
    return v.astype(np.float32)


# ── Cerebellum deformation ───────────────────────────────────────
def shape_cerebellum(verts):
    v = verts.copy()
    v[:, 0] *= 1.05   # width
    v[:, 1] *= 0.55   # height (flat — characteristic cauliflower shape)
    v[:, 2] *= 0.78   # depth

    r   = np.linalg.norm(v, axis=1, keepdims=True).clip(1e-8)
    nrm = v / r
    # Horizontal striations: use y-component (superior-inferior)
    ny  = nrm[:, 1]
    stria = 0.07 * np.sin(18.0 * np.pi * ny) + 0.04 * np.sin(36.0 * np.pi * ny)
    v    += nrm * stria[:, np.newaxis]

    v *= 0.78            # scale relative to hemispheres
    v[:, 1] -= 1.05     # shift inferior
    v[:, 2] -= 1.30     # shift posterior
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
    # ── Right hemisphere ─────────────────────────────────────────
    print("Generating right hemisphere …")
    rv, rf = uv_hemisphere(HEMI_SECTORS, HEMI_RINGS, left=False)
    rv = shape_hemisphere(rv)
    rf = ensure_outward(rv, rf)

    # ── Left hemisphere — same mesh, mirror x, flip winding ───────
    # Start from the same right-hemisphere mesh so shaping is identical.
    # Negating x mirrors it; we must also flip face winding so normals
    # stay outward-pointing on the mirrored geometry.
    print("Generating left hemisphere …")
    lv, lf = uv_hemisphere(HEMI_SECTORS, HEMI_RINGS, left=False)
    lv = shape_hemisphere(lv)      # shape as right hemisphere
    lv[:, 0] *= -1                 # mirror to the left
    lf = lf[:, [0, 2, 1]]         # flip winding (mirrors reverse normals)
    lf = ensure_outward(lv, lf)   # double-check orientation

    # ── Cerebellum ───────────────────────────────────────────────
    print("Generating cerebellum …")
    cv, cf = uv_sphere(CEREB_SECTORS, CEREB_RINGS)
    cv = shape_cerebellum(cv)
    cf = ensure_outward(cv, cf)

    # ── Merge + normals + export ──────────────────────────────────
    print("Merging & computing normals …")
    verts, faces = merge_meshes((rv, rf), (lv, lf), (cv, cf))
    normals = compute_normals(verts, faces)

    print("Exporting GLB …")
    export_glb(verts, normals, faces, OUTPUT_PATH)


if __name__ == "__main__":
    main()




