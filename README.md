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

Videos are 1920x1080 at 30 fps, H.264, audio stripped. See the commit
history for the re-encode that reduced media size from 193 MB to 48 MB.

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

## Security

`.gitignore` excludes the Samsung Tizen signing certificate and keys
(`*.p12`, `*.pfx`, `*.pem`, `*.key`, `device-profile.xml`,
`author-signature.xml`). `dist/` and `.buildResult/` are ignored too —
`dist/device-profile.xml` contains the developer email and an X.509
certificate.

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