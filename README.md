# Housewarming & longevity blessing e-invitation (navy + silver)

Open `index.html` in a browser **with internet** (GSAP and Google Fonts load from CDNs).
To serve locally: `python3 -m http.server` (or `npx serve .`).

## Where things are
- `js/data.js`: ALL details and ALL text (Khmer + English). Anything in `[ ]` is a placeholder.
- `css/style.css`, `css/sections.css`: styling.
- `js/main.js`: envelope, opening, cover, language, music.  `js/sections.js`: everything below the cover.
- `assets/svg`: decorative elements (recoloured to silver). `assets/tex`: paper textures.

## Still to fill in (in `js/data.js`)
- `venue.name`, `venue.address`, and `venue.lat` / `venue.lng` (turns on the map and the Open Google Maps button;
  or paste a full link into `venue.mapsUrl`).
- `endISO` if you know the end time (otherwise the calendar file has no end time).
- Read the drafted wording in `words` and the English lines in `program`, and edit as you like.

## Photos
1. Put your photos in a folder. Name one `cover.jpg` (envelope + cover background) and optionally one `words.jpg` (arch).
   Every other photo goes into the gallery. The gallery section stays hidden until there is at least one.
2. Run: `python3 tools/make_images.py /path/to/photos`  (needs `pip install pillow`).
   It makes WebP at 640/1280/2000 px, removes GPS/EXIF, and writes `js/gallery.js`.

## Music (optional)
Set `music: 'assets/music.mp3'` in `js/data.js` (a file you have the rights to). A music button appears and the music
starts when the guest taps the seal.

## Personal links
`index.html?to=Guest%20Name` shows that name on the cover. Share buttons always share the plain link (no name).

## Before sharing the link
Add `<meta property="og:image" content="https://YOUR-DOMAIN/og.jpg">` (1200x630 image) in `index.html` so Telegram and
Messenger show a preview picture.

## Preview helper
`index.html?still=1` freezes the envelope screen (layout checks only).
