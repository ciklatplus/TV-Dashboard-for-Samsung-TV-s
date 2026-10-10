# TV Dashboard

A system information panel for Samsung Tizen TVs. Shows the clock, weather,
network details, source and panel information, and a background media player.
Fully navigable with the TV remote.

## Interface layout

```
┌──────────────────────────────────────────────────────────────┐
│  21:47          18°  Partly cloudy        (background video) │
│  9 October 2026  ☀ 06:12 ↓ 17:34                            │
├────────────────────┬────────────────────┬────────────────────┤
│ Left column        │                    │ Right column       │
│ • TV model info    │                    │ • Network/Internet │
│ • System           │                    │ • TV / HDMI source │
│ • System resources │                    │ • Sound            │
│ • Panel            │                    │ • Music            │
│                    │                    │ • Location         │
│                    │                    │ • Settings         │
└────────────────────┴────────────────────┴────────────────────┘
```

## Installation

**Requirements:** Visual Studio Code with the **Tizen Extension**
(`vscode-tizen-csharp`, version 10.x). It manages its own SDK, so nothing
else needs to be installed. Tizen Studio itself is retired and no longer
distributed.

The TV must have "Allow unsigned installation" enabled.

Open this folder in VS Code and use the Tizen Extension sidebar:

1. **Actions → Build Project** — compiles the `.wgt`
2. **Actions → Run Project** — installs it on the TV and launches it

**See [INSTALLING.md](INSTALLING.md)** for the full tutorial: opening the
project in VS Code, setting up the signing certificate, running the TV web
simulator, debugging on a real TV, and troubleshooting.

## Remote control

| Key | Action |
|---|---|
| Arrow keys | Move between cards (nearest card in that direction wins) |
| OK | Open the focused card / play-pause |
| Back | Exit the app |
| Play / Pause | Start or pause the music |
| Volume up/down/mute | Adjust TV volume and mute |

On the Sound card, OK toggles mute. The Location card is display-only.

## Architecture

No framework, no build system. `index.html` + `style.css` + `main.js`
(one file, ~2800 lines) plus the `config.xml` manifest.

Three separate data sources are used:

1. **Samsung Product API** (`$WEBAPIS/webapis/webapis.js`) — model, firmware,
   panel/resolution, connection type, TV IP, board temperature, remote battery,
   sound, HDR/energy, HDMI sources.
2. **Tizen core API** (`tizen.systeminfo`) — CPU load, RAM, internal/USB
   storage. Also `tizen.application`, `tizen.tvinputdevice`,
   `webapis.avplay`, `webapis.appcommon`.
3. **Public web APIs** — Open-Meteo (weather),
   geojs / ipwho.is (IP location), speed.cloudflare.com (speed test).

### Background playback

Three layers with fallback:

```
avplay  →  <video>  →  <img>
```

If playback fails, it retries after 2/5/15/30 seconds. The screen saver is
disabled automatically while media is playing.

Backgrounds
The filename must begin with bg — the filter is /^bg\d*\./i. Everything else about the name is free: bg.mp4, bg2.mp4, bg10.mp4 and bg-party.mp4 are all picked up.

Accepted	Notes
Images	jpg, jpeg, png, webp	Still-image background
Videos	mp4	Played with avplay, then <video>
How to add one

Put the file in the project root, next to index.html — for example bg6.mp4.
Build Project and Run Project as usual.
Open Settings on the TV: Photo selection or Video selection lists the new file, and ← / → cycles through it. OK saves.
Numbering does not have to be contiguous. The list is ordered by the number in the name — plain bg sorts first, then bg2, bg3 and so on — not alphabetically, so bg10.mp4 correctly comes after bg5.mp4. A name with no number, such as bg-party.mp4, is treated as bg2 and therefore sits alongside it.

Naming is the whole rule. A file called holiday.mp4 is ignored silently: no error, it just does not appear in the list. If a file you added is missing, check that it starts with bg.

Size matters. Backgrounds are packaged into the .wgt and pushed over the network on every install. The shipped backgrounds total about 15 MB (20 MB including the music); adding a large 1080p clip adds its full size to the package and to install time.

Video backgrounds also need the codec to be H.264 (avc1) with yuv420p pixel format, which is what the Tizen video pipeline expects. Anything else may show the still-image fallback instead.

Music
Any file whose name starts with music is picked up, and the Music selection row in Settings lists the tracks.

Accepted
Audio	mp3, m4a, aac, ogg, wav
How to add one

Put the file in the project root, next to index.html — for example music2.mp3.
Build Project and Run Project.
Open Settings → Music selection and use ← / → to choose the track. OK saves.
Unlike backgrounds there is no numeric naming rule; tracks are ordered by name, with numbers compared numerically so music2 comes before music10. Naming still matters — a file called song.mp3 is ignored silently and never appears in the list.

Switching tracks mid-song keeps playing and resumes at roughly the same position. The chosen track is stored in localStorage and restored on the next launch.

Size matters. Backgrounds and music are packaged into the .wgt and pushed over the network on every install. The shipped media totals about 20 MB, so extra files add their full size to the package and to install time. Audio is already compressed; re-encoding usually saves little.

### Performance

`PERFORMANCE` constants: clock 60 s, system 30 s, sources 2 min, storage
5 min, slow values 10 min. When the app is hidden, all timers stop, media
pauses and the screen saver is enabled.

A pixel-shift timer runs every 4 minutes to reduce burn-in on OLED panels.
It is registered in `runtimeIntervals`, so it stops together with the other
timers.

### Location

IP geolocation is approximate — it reports the city the ISP registered the
address in, not necessarily where the TV is. The card shows that value and
the source it came from, and nothing else; there is no manual override.

Forecast times are requested as Unix timestamps (`timeformat=unixtime`) and
compared against `Date.now()`, so the displayed hours do not depend on the
TV's own timezone. `utc_offset_seconds` from the response is used to render
each time in the location's local time.

### Internationalisation

TR and EN. Static strings live in `I18N`, dynamic ones in `EN_DYNAMIC`.
The choice is persisted in `localStorage` and can be changed later from the
Settings panel.

### Glass theme

Cards, overlays and buttons share one material. The base surface is
`rgba(14, 17, 25, 0.46)` with `backdrop-filter: blur(14px)`; secondary cards
use a thinner variant at 0.30 with 10px blur. Overlay backdrops use a single
scrim (`rgba(0, 0, 0, 0.52)` plus 3px blur) for all three dialogs.

Focus and selected states brighten the surface and brighten the border —
they never change hue.

### Background media files

Packaged media is scanned with `tizen.filesystem.resolve("wgt-package")`
(`scanPackagedMedia`). Files matching the `bg` prefix are collected as
images and videos; when the scan fails, the built-in list is used.

If you are going to change backgrounds just get a another file rename it as the same and it works.
Same goes for the music too.

## Development tools

```bash
node tools/smoke.mjs            # boots the app in a stubbed Tizen environment
node tools/check-i18n.mjs       # EN translations for setText/setStatus strings
node tools/check-html-i18n.mjs  # untranslated Turkish text in index.html
node tools/check-css.mjs        # undefined and unused CSS classes
```

Run all four before committing. `check-i18n.mjs` collects the Turkish
literals passed to `setText`/`setStatus` and reports the ones missing from
`EN_DYNAMIC`; missing entries silently stay Turkish in EN mode.
`smoke.mjs` parses `main.js`, runs `boot()`, and checks for references to
removed functions and for element ids that no longer exist in the HTML.


Without that certificate the app only runs on TVs with unsigned installation
enabled; use your own certificate for Samsung Store distribution.

## Directory layout

```
config.xml          Tizen manifest (permissions, origins, app identity)
index.html          Single page interface
main.js             All application logic
style.css           Interface styles
INSTALLING.md       Installation tutorial
bg*.mp4 / bg*.jpg   Background media files (1080p30, compressed)
music-tv.mp3        Bundled music
tools/              Maintenance and verification scripts
```

## License

Personal use. The Samsung Tizen SDK and the background media shown in the
screenshot belong to their respective owners.

!!I DO NOT OWN ANY ART IN THIS PROJECT IF YOU HAVE ANY OWNERSHIP OVER THESE ARTS AND IS UNCOMFORTABLE CONTACT ME VIA ciklatplus/on discord!!
