# Installing TV Dashboard on a Samsung TV

This guide builds the app and puts it on a Samsung Tizen TV using the
**Tizen Extension for Visual Studio Code**.

> **Tizen Studio is no longer distributed.** It was retired by Samsung; the
> VS Code extension is the current tooling. This guide uses the extension
> version 10.x, which manages its own SDK — you do **not** need Tizen Studio
> installed, and no separate SDK install step is needed.

Three routes are covered:

| Method | Use when | Difficulty |
|---|---|---|
| [A. Open this repo directly](#method-a-open-this-repo-in-vs-code) | You have the repo and want to develop | Easiest |
| [B. Create a fresh project](#method-b-create-a-fresh-project) | The repo will not open cleanly, or you prefer a clean project | Medium |
| [C. Simulator and remote TV](#method-c-simulator-and-remote-tv) | You want to test without a TV, or run on a TV over the network | Medium |

---

## Before you start

### 1. Install VS Code and the Tizen Extension

Install **Visual Studio Code**, then add the extension:

- **Extensions** view (`Ctrl+Shift+X`)  → search **"Tizen Extension"**  →
  install the one published by Samsung (command id `vscode-tizen-csharp`,
  version 10.x), **or**
- download the `.vsix` from the extension's release page and use
  **Extensions  → ⋯  → Install from VSIX**

The extension downloads and manages its own Tizen SDK on first use. Nothing
else needs to be installed.

### 2. Prepare the TV

Two things must be done on the TV itself: **unlock the developer options** and
**write down the TV's IP address**. Neither can be done from the computer, so
keep the remote at hand.

#### 2.1 Unlock the developer options

The developer menu is hidden on a fresh Samsung TV.

1. Open **Settings** — from the Home screen, or press the Home key and pick
   Settings from the source list.
2. Go to **Support → About**. On older firmware this is just **Settings →
   Support**, with the model information on the same screen.
3. Press the cursor on **Product Model**, or on the **Support** entry itself,
   and hold it for roughly 5–10 seconds. A **Player Confirmation** dialog
   appears — select **Yes**.

   > There is no progress indicator, and pressing too few times does nothing
   > at all. Just keep pressing on the same row until the dialog appears. On
   > some models the entry to press is the model name at the top of the About
   > screen, on others it is the word "Support" further down — try both.

4. A second dialog asks you to **agree to the debug agreement**. Accept it.
   Skipping this step leaves developer options hidden even though the first
   dialog was confirmed.
5. **Developer options** now exists. On most 2020-onwards models it is at:

   ```
   Settings → General → Network → Developer Settings
   ```

   On older Tizen 4.0 / 5.0 firmware the same switches live under
   **Settings → General → Developer Options → Debug → Settings** instead. If
   you cannot find it by browsing, use the TV's own search: press the
   microphone or search key and type `developer`.

6. Inside it, set **Allow unsigned installation** → **On**.

   > Some firmware labels this **Allow unsigned app installation**, others put
   > it under **Debug**. Any of these names means the same thing. Only the
   > unsigned switch is required to install a self-signed `.wgt`; the USB
   > debug switch is not.

7. Leave it on while developing, and turn it off when you are done — see
   [C.4 Uninstall](#c4-uninstall).

#### 2.2 Find the TV's IP address

You need this address for every later step. It appears in two places.

| Where | Path | Good for |
|---|---|---|
| This app | The **Network** card shows the TV's own IP | Quickest — but only after the app is installed |
| TV settings | **Settings → Support → About**, then the **IP Address** or **Network** row | Before anything is installed |

Read it as four numbers separated by dots, e.g. `192.168.x.x`.

> **If it starts with `169.254`**, the TV never got an address from your
> router. Give it one — **Settings → Network → Network settings → DHCP** — or
> the install will fail with a connection error even though everything is
> configured correctly.

> **Typing an address on a TV is painful.** The on-screen keyboard's arrow
> keys move the caret instead of moving between fields, so `192.168` is easy
> to mistype as `21.68` or similar. In the Tizen extension's device field you
> can paste the address instead, which sidesteps the problem entirely.

#### 2.3 The two ports

Two different ports on that IP address are used:

| Port | Used by | Where |
|---|---|---|
| **26101** | `sdb` — install and launch | [Methods A and B](#method-a-open-this-repo-in-vs-code) |
| **9955** | Remote debugging | [Method C](#method-c-simulator-and-remote-tv) |

If the network blocks 26101, run the tools from a machine on the same LAN and
check the firewall.

---

## Method A: Open this repo in VS Code

This is the recommended route — the project already has everything it needs.

### A.1 Open the folder

**File  → Open Folder⋯** and select the repository root (the folder holding
`config.xml`).

The extension activates automatically. Its activation trigger is the presence
of `config.xml`, and it identifies the project as a **web** project from that
same file — nothing else is needed.

Look for the **Tizen** icon in the Activity Bar (left edge). If you do not
see it, open the Command Palette (`Ctrl+Shift+P`) and run
**Tizen: Show Actions Panel**.

### A.2 Let the extension install the SDK

The first launch shows a Set Up view that installs the Tizen SDK. Let it
finish; it can take several minutes on the first run.

Once the SDK is ready, the extension writes `.tizen.path.config` in the
project folder. That file is generated — it is listed in `.gitignore`, and
you should not commit it.

If setup is interrupted, run **Tizen: Install Tizen CLI** from the Command
Palette.

### A.3 Create a signing certificate

The app cannot install without one. For your own TV a self-signed author
certificate is enough.

1. Command Palette  → **Tizen: Create Certificate**
2. Fill in the profile name, your name and email, and a password.
3. Make the certificate the default author when prompted.

> **Distribution note**
> A self-signed certificate only installs on TVs with "Allow unsigned
> installation" enabled. Publishing through the Samsung Store requires a
> partner account and a Samsung-issued certificate instead.

### A.4 Confirm the manifest

Double-click `config.xml`. It identifies the app as:

```xml
<widget id="https://example.com/tvdashboard" version="1.12.6">
    <tizen:application id="TVDashApp1.TVDashboard" package="TVDashApp1"
                       required_version="4.0"/>
    <tizen:profile name="tv-samsung"/>
```

Two things matter here:

- **Profile** must stay `tv-samsung`. That is the Samsung TV profile the
  extension offers when creating a project. Changing it breaks the
  Samsung-specific privileges below.
- **Required privileges** must stay as they are. Two of them are
  Samsung-specific and only resolve for the TV profile:

```
http://tizen.org/privilege/internet
http://tizen.org/privilege/filesystem.read
http://tizen.org/privilege/system
http://developer.samsung.com/privilege/network.public
http://developer.samsung.com/privilege/productinfo
http://developer.samsung.com/privilege/tvinfo
http://tizen.org/privilege/tv.audio
http://tizen.org/privilege/tv.inputdevice
```

Check them with **Tizen: Run Privilege Checker** from the Command Palette.

### A.5 Set the build mode

Command Palette  → **Tizen: Set Tizen build mode**  → **debug**.

Debug builds are unsigned-friendly and are what you want for a personal TV.
Use **release** only when signing for distribution.

### A.6 Build

In the **Tizen** sidebar, under **Actions**, click **Build Project**.

Watch the **Output** view to see the exact output directory for your setup —
it is not a fixed path. The package is named `TV Dashboard.wgt`.

### A.7 Run on the TV

1. Command Palette  → **Tizen: Device Manager**
2. Add the TV: Command Palette  → **Tizen: Remote Devices** and enter the
   TV's IP address
3. Select the TV as the working target
4. Tizen sidebar  → **Actions  → Run Project**

The app installs and launches. **Run Project** deploys automatically, so you
normally do not need the push script for day-to-day work.

---

## Method B: Create a fresh project

Use this if the repository will not open as a Tizen project, or if you want a
clean project that matches your SDK version exactly.

### B.1 Create it

1. Command Palette  → **Tizen: Create Tizen Project**
2. Choose:
   - **Application type**  → `web`
   - **Profile**  → `tv-samsung`
   - **Platform version**  → the newest TV version offered
3. Give it a name and location.

> **Note**
> The repository's `.project` file has empty `buildSpec` and `natures`
> sections. Those belong to Tizen Studio's Eclipse format and the VS Code
> extension does not use them, so nothing is missing — but if you ever open
> this app in an Eclipse-based IDE, expect to add them back.

### B.2 Copy this app into it

Copy these from the repository into the new project folder, replacing the
generated ones:

```
config.xml   index.html   style.css   main.js
icon.png     bg*.mp4      bg*.jpg     bg2.png     music-tv.mp3
```

Keep the new project's own `.project` file and generated README.

### B.3 Copy the manifest settings

Open the new `config.xml` and copy these across from the repository version:

- `<tizen:application id=... package=... required_version=...>`
- `<tizen:profile name="tv-samsung"/>`
- all `<tizen:privilege .../>` entries
- all `<access origin="..."/>` entries

The fresh project will not have the access origins — without them every
network request is blocked silently and you get no weather, no location and
no speed test.

### B.4 Build and install

Create a certificate ([A.3](#a3-create-a-signing-certificate)), then
**Build Project** and **Run Project** from the Tizen sidebar. **Run Project**
installs and launches in one step, so there is nothing else to run.

> **Note**
> The package is around 48 MB because it embeds the background videos, and
> installation takes about a minute. Do not assume it has hung.

### Uninstall

On the TV: **Settings  Apps  TV Dashboard  Uninstall**.

---

## Method C: Simulator and remote TV

### C.1 Test without a TV

Command Palette  → **Tizen: Run as TV Web Simulator Application**.

This runs the app in a desktop window laid out like a TV. Useful for CSS and
layout work.

> **What the simulator does not cover**
> The app reads a lot from Samsung APIs. On the simulator these are absent,
> so the following show "browser" or "not supported" placeholders:
>
> - `webapis.productinfo` — model, firmware, panel, resolution
> - `webapis.tvinfo` — board temperature, remote battery
> - `webapis.avplay` — hardware video playback, so the background falls
>   back to `<video>` and then to the still image
> - `tizen.systeminfo` — CPU, RAM, storage
> - `tizen.tvinputdevice` — remote key handling
>
> Weather, IP location and the speed test **do** work, since those are plain
> web APIs.

### C.2 Connect to a TV over the network

Command Palette  → **Tizen: Remote Devices**  → add the TV by IP.

This is the path that needs port **9955** open.

### C.3 Debug on the TV

1. Command Palette  → **Tizen: Debug Project**
2. Set breakpoints in `main.js`
3. Select the TV as the target

**Tizen: Toggle RDS** enables Rapid Development Support: file changes are
pushed straight to the running app on save, without a full reinstall. Useful
for UI iteration; switch it off when you want to test a clean install.

Device logs are under **Tizen: Show Device Log**.

### C.4 Uninstall

On the TV: **Settings  Apps  TV Dashboard  Uninstall**.

To turn the TV back to a clean state, also switch **Allow unsigned
installation** off in the TV's developer settings.

---

## Version numbers

The version string lives in **four places** and must be bumped together:

| File | Where |
|---|---|
| `config.xml` | `<widget version="1.12.6">` |
| `main.js` | `const APP_VERSION = "1.12.6";` |
| `index.html` | `style.css?v=1.12.6` and `main.js?v=1.12.6` |

The `?v=` query strings are cache busters for the Tizen web engine, which
caches aggressively. Without them an updated `main.js` may never load.

Reinstalling the **same** version over an existing install fails with a
version conflict — the TV rejects it as not newer. Bump the version or
uninstall first.

---

## Troubleshooting

**The Tizen icon is not in the Activity Bar**
Open the folder that contains `config.xml` — that file is what triggers the
extension. Then run **Tizen: Show Actions Panel** from the Command Palette.

**The Set Up view never finishes**
Run **Tizen: Install Tizen CLI**, then **Tizen: Reset Engine** if it stays
stuck. Check the extension's Output view for the actual error.

**"Cannot find Developer Settings" on the TV**
The dialog was confirmed but the debug agreement was declined, or the counter
did not actually reach the trigger. Redo [2.1](#21-unlock-the-developer-options)
from step 1 and accept **both** dialogs. Confirm you are looking under
**General → Network**; Tizen 4.0/5.0 firmware puts it elsewhere.

**"Allow unsigned installation" is missing**
Some firmware hides it unless a TV remote (not a phone remote or the app) is
paired, and some hide it entirely on region-locked models. It is always under
the developer options unlocked in step 2.1 — if it is genuinely absent, the
profile is locked by the retailer's service menu and unsigned `.wgt` packages
cannot be installed on that set.

**The TV address starts with `169.254`**
It never received an address from the router. See
[2.2](#22-find-the-tvs-ip-address).

**sdb cannot see the TV**
The `sdb devices` output does not list your address. Check:

- the TV is on the same subnet
- port 26101 is not blocked by the firewall
- **Allow unsigned installation** is on
- the debug agreement was accepted

Verify by hand:

```powershell
sdb connect 192\.168.x.x:26101
sdb devices
```

**"WGT not found"**
Nothing has been built yet. Run **Build Project** from the Tizen sidebar.

**"sdb not found"**
The SDK now ships inside the VS Code extension instead of Tizen Studio, so
`sdb.exe` may not be on your `PATH`. Run **Tizen: Install Tizen CLI** from
the Command Palette, or check the extension's Output view for the SDK path it
reports.

**The build fails on a privilege**
Two privileges are Samsung-specific (`developer.samsung.com/...`). They only
resolve for the `tv-samsung` profile and on a TV platform version. Run
**Tizen: Run Privilege Checker** to see which one is unresolved.

**Where to look when something fails**
The Tizen sidebar's **Output** view carries the build log. For anything that
happens on the device itself, use **Tizen: Show Device Log**. Build and install
errors both surface there.

**Install fails with a version conflict**
The TV already has this version. Bump all four version strings, or uninstall
first.

**The app runs but shows the old code**
The Tizen web engine caches by URL; the `?v=` query strings are what defeat
it. Confirm the two `?v=` values match `config.xml` and that the app was
really reinstalled, not just relaunched.

**Blank screen on the TV**
The app needs `$WEBAPIS/webapis/webapis.js` from the firmware, so it will
not run in a desktop browser. Confirm the TV firmware is Tizen 4.0 or newer.

**No weather, location or speed test**
Every API must be listed in `config.xml` as an `<access origin="..."/>`
entry, otherwise requests are blocked silently. Current origins:

```
https://api.open-meteo.com
https://speed.cloudflare.com
https://get.geojs.io
https://ipwho.is
```

Adding a new API means adding its origin there too.

---

## Turning it back off

To restore the TV to a clean state:

```powershell
sdb -s 192\.168.1.50:26101 uninstall TVDashApp1.TVDashboard
```

Then turn **Allow unsigned installation** back off in the TV's developer
settings.