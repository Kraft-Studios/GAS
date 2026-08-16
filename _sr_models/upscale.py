import cv2, numpy as np, time, sys
from cv2 import dnn_superres
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

MODEL = '_sr_models/EDSR_x4.pb'
sr = dnn_superres.DnnSuperResImpl_create()
sr.readModel(MODEL)
sr.setModel('edsr', 4)

def sr_tiled(bgr, tile=180, overlap=16, scale=4):
    """Tile the image so EDSR runs on manageable chunks, blending seams."""
    h, w = bgr.shape[:2]
    out = np.zeros((h*scale, w*scale, 3), dtype=np.float32)
    acc = np.zeros((h*scale, w*scale, 1), dtype=np.float32)
    step = tile - overlap
    for y in range(0, h, step):
        for x in range(0, w, step):
            y1, x1 = min(y+tile, h), min(x+tile, w)
            y0, x0 = max(0, y1-tile), max(0, x1-tile)
            patch = bgr[y0:y1, x0:x1]
            up = sr.upsample(patch).astype(np.float32)
            ph, pw = up.shape[:2]
            # feathered weight so tile seams blend instead of banding
            wy = np.ones(ph, np.float32); wx = np.ones(pw, np.float32)
            f = overlap*scale
            if f > 0:
                ramp = np.linspace(0, 1, f, dtype=np.float32)
                if y0 > 0: wy[:f] = ramp
                if y1 < h: wy[-f:] = ramp[::-1]
                if x0 > 0: wx[:f] = ramp
                if x1 < w: wx[-f:] = ramp[::-1]
            wgt = (wy[:, None] * wx[None, :])[..., None]
            oy, ox = y0*scale, x0*scale
            out[oy:oy+ph, ox:ox+pw] += up * wgt
            acc[oy:oy+ph, ox:ox+pw] += wgt
    return np.clip(out/np.maximum(acc, 1e-6), 0, 255).astype(np.uint8)

def super_res(pil_img):
    bgr = cv2.cvtColor(np.array(pil_img.convert('RGB')), cv2.COLOR_RGB2BGR)
    up = sr_tiled(bgr)
    return Image.fromarray(cv2.cvtColor(up, cv2.COLOR_BGR2RGB))

def down_to(im, target):
    w, h = im.size
    le = max(w, h)
    if le <= target: return im
    s = target/le
    return im.resize((round(w*s), round(h*s)), Image.LANCZOS)

def clean(im, cutoff, pct, contrast, color):
    im = ImageOps.autocontrast(im, cutoff=cutoff)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Color(im).enhance(color)
    return im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=pct, threshold=2))

def patch_arrow(im3):
    arr = np.array(im3).astype(np.float64)
    cx, cy, r, pad = 641, 283, 34, 8
    x0, x1 = cx-r-pad, cx+r+pad
    y0, y1 = cy-r-pad, cy+r+pad
    bw = x1-x0; shift = bw+6
    dx0, dx1 = x0-shift, x1-shift
    orig = arr.copy()
    donor = arr[y0:y1, dx0:dx1].copy()
    arr[y0:y1, x0:x1] = donor
    fe = 5
    for i in range(fe):
        t = i/fe
        arr[y0:y1, x0+i]   = donor[:, i]*t      + orig[y0:y1, x0+i]*(1-t)
        arr[y0:y1, x1-1-i] = donor[:, bw-1-i]*t + orig[y0:y1, x1-1-i]*(1-t)
        arr[y0+i, x0:x1]   = arr[y0+i, x0:x1]*t   + orig[y0+i, x0:x1]*(1-t)
        arr[y1-1-i, x0:x1] = arr[y1-1-i, x0:x1]*t + orig[y1-1-i, x0:x1]*(1-t)
    return Image.fromarray(arr.clip(0,255).astype('uint8'))

TARGET = 2000
jobs = [
    ('M2comp.PNG', (0,150,729,825), 'gas-013.webp', dict(cutoff=0.3, pct=48, contrast=1.05, color=1.04), False),
    ('M3Comp.PNG', None,            'gas-014.webp', dict(cutoff=0.25, pct=40, contrast=1.02, color=1.02), True),
    ('M4comp.PNG', (0,240,673,790), 'gas-015.webp', dict(cutoff=0.3, pct=48, contrast=1.06, color=1.05), False),
]

for src, box, dest, cfg, needs_patch in jobs:
    t0 = time.time()
    im = Image.open(src).convert('RGB')
    if needs_patch: im = patch_arrow(im)
    if box: im = im.crop(box)
    before = im.size
    im = super_res(im)
    mid = im.size
    im = down_to(im, TARGET)
    im = clean(im, **cfg)
    im.save(f'src/gallery/{dest}', quality=94, method=6)
    print(f'{dest}: {before} -> SR {mid} -> {im.size}  ({round(time.time()-t0,1)}s)', flush=True)
print('ALL DONE', flush=True)
