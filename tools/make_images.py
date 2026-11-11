#!/usr/bin/env python3
"""Convert photos for the invitation.

Usage:  python3 tools/make_images.py PHOTO_FOLDER [OUTPUT_FOLDER=assets/img]

* Makes WebP copies at 640, 1280 and 2000 px wide (never enlarged).
* Strips all metadata (EXIF, GPS) by re-encoding the pixels only.
* A photo named  cover.*  becomes the cover/envelope background,
  one named  words.*  goes in the arch; every other photo goes in the gallery.
* Writes js/gallery.js with the list. Needs Pillow:  pip install pillow
"""
import json, os, sys
from PIL import Image, ImageOps

WIDTHS = (640, 1280, 2000)
EXTS = ('.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff')

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(root, 'assets', 'img')
    os.makedirs(out, exist_ok=True)

    gallery, special = [], {}
    names = sorted(f for f in os.listdir(src) if f.lower().endswith(EXTS))
    if not names:
        sys.exit('No photos found in ' + src)

    for fn in names:
        base = os.path.splitext(fn)[0].lower().replace(' ', '-')
        try:
            im = Image.open(os.path.join(src, fn))
            im = ImageOps.exif_transpose(im).convert('RGB')   # fix rotation, then drop metadata
        except Exception as e:
            print('skip', fn, '-', e); continue
        w0, h0 = im.size
        made = {}
        for w in WIDTHS:
            if w > w0 and made:        # do not upscale; keep the largest we have
                break
            tw = min(w, w0)
            th = round(h0 * tw / w0)
            im.resize((tw, th), Image.LANCZOS).save(
                os.path.join(out, '%s-%d.webp' % (base, w)), 'WEBP', quality=82, method=6)
            made[w] = (tw, th)
        ws = sorted(made)
        small, mid, big = ws[0], ws[min(1, len(ws) - 1)], ws[-1]
        rel = lambda w: 'assets/img/%s-%d.webp' % (base, w)
        if base in ('cover', 'words'):
            special[base] = rel(mid)
        else:
            tw, th = made[small]
            gallery.append({'thumb': rel(small), 'src': rel(mid), 'full': rel(big), 'w': tw, 'h': th, 'alt': ''})
        print('ok  ', fn, sorted(made))

    with open(os.path.join(root, 'js', 'gallery.js'), 'w', encoding='utf-8') as f:
        f.write('/* Written by tools/make_images.py. */\nwindow.GALLERY = %s;\nwindow.PHOTOS = %s;\n'
                % (json.dumps(gallery, indent=1), json.dumps(special, indent=1)))
    print('gallery: %d photo(s); cover: %s; words: %s' % (len(gallery), 'cover' in special, 'words' in special))

if __name__ == '__main__':
    main()
