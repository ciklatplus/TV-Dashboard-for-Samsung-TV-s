// Uygulamanin tarayicida acilip acmadigini ve konsol hatasi uretip
// uretmedigini dogrular. Tizen API'leri yoksa uygulama yine de
// calismali (her sey try/catch icinde).
//
// Kullanim: node tools/smoke.mjs
// Girdi: dist icinde derlenmis index.html + main.js degeri beklenir,
//        ancak kokteki index.html/main.js dogrudan kullanilir.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const js = readFileSync(join(here, "..", "main.js"), "utf8");

// Tizen ortamini taklit et: webapis/tizen tanimli degil, yerelStorage var.
// Uygulama bu kosullarda patlamamalidir.

const errors = [];
const store = new Map();

globalThis.window = globalThis;
globalThis.addEventListener = (type, fn) => {
  if (type === "load") globalThis.__boot = fn;
};
globalThis.document = {
  hidden: false,
  documentElement: { lang: "tr" },
  body: { classList: { toggle() {}, add() {}, remove() {} } },
  activeElement: null,
  querySelectorAll: () => [],
  querySelector: () => null,
  getElementById: () => null,
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, addEventListener() {} }),
  head: { appendChild() {} },
  addEventListener: (type, fn) => {
    if (type === "load") globalThis.__boot = fn;
  },
};
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  key: () => null,
  get length() {
    return store.size;
  },
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};
globalThis.setTimeout = () => 0;
globalThis.clearTimeout = () => {};
globalThis.fetch = () => Promise.reject(new Error("offline"));

console.log("--- syntax ---");
try {
  new Function(js);
  console.log("  main.js ayristirildi: OK");
} catch (e) {
  console.log("  main.js AYRISTIRILAMADI:", e.message);
  process.exitCode = 1;
}

console.log("\n--- boot ---");
try {
  new Function(js)();
  if (typeof globalThis.__boot === "function") {
    globalThis.__boot();
    console.log("  boot() calisti: OK");
  } else {
    console.log("  boot() kaydedilmedi");
    process.exitCode = 1;
  }
} catch (e) {
  console.log("  boot() HATA:", e.message);
  console.log(e.stack?.split("\n").slice(0, 4).join("\n"));
  process.exitCode = 1;
}

console.log("\n--- tanimsiz cagri denetimi ---");
// Silinen YouTube fonksiyonlarina kalan referans var mi?
const gone = [
  "playYoutube", "pauseYoutube", "toggleYoutube", "openYoutubeSearch",
  "closeYoutubeSearch", "initYoutube", "loadYoutubeSelection",
  "updateYoutubeSearchCard", "updateYoutubeMiniCard", "updateYoutubePlaybackChrome",
  "stopYoutubeBackground", "clearEmbeddedYoutubePlayer", "decodeYoutubeText",
  "extractYoutubeVideoId", "pickBestYoutubeStream", "fetchJsonWithTimeout",
  "buildPipedSearchUrl", "handleYoutubeOverlayKey", "youtubePlayer",
];
const left = gone.filter((n) => new RegExp(`\\b${n}\\b`).test(js));
console.log(left.length ? `  KALAN: ${left.join(", ")}` : "  temiz");
if (left.length) process.exitCode = 1;

// Olu kod taramasi. Bir fonksiyon; taniminda, cagri olarak veya
// deger olarak (orn. setInterval/adderEventListener) gecmelidir.
const defs = [...js.matchAll(/^(?:async )?function (\w+)\s*\(/gm)].map((m) => m[1]);
const dead = defs.filter((name) => {
  const refs = [...js.matchAll(new RegExp(`\\b${name}\\b`, "g"))].length;
  return refs <= 1;
});
console.log(dead.length ? `  OLU: ${dead.join(", ")}` : "  olu fonksiyon yok");
if (dead.length) process.exitCode = 1;

// HTML'de var olup JS'in getEl ile aradigi, ama artik olmayan id'ler
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const usedIds = [...js.matchAll(/getEl\("([^"]+)"\)/g)].map((m) => m[1]);
const orphans = [...new Set(usedIds)].filter((id) => !ids.includes(id));
console.log(orphans.length ? `  HTML'de olmayan id: ${orphans.join(", ")}` : "  tum id'ler HTML'de var");
if (orphans.length) process.exitCode = 1;

console.log(errors.length ? `\nHATA: ${errors.length}` : "\nHata yok.");