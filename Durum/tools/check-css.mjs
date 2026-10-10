// index.html'da kullanilan her sinifin style.css'te tanimi var mi?
// YouTube ozelligi kaldirildiktan sonra olu CSS kalmasin diye denetler.
//
// Kullanim: node tools/check-css.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const css = readFileSync(join(here, "..", "style.css"), "utf8");

const used = new Set();
for (const m of html.matchAll(/class="([^"]+)"/g)) {
  for (const cls of m[1].split(/\s+/)) {
    if (cls) used.add(cls);
  }
}

// Bazi siniflar yalnizca index.html'de degil, JS tarafindan da eklenir
// (orn. "ok"/"warn"/"bad" durum siniflari, "weather-rain" tema siniflari).
const JS_ADDED = new Set([
  "infoColumnLeft", "networkCard", "sourceInfo", "soundCard", "locationInfo",
  "settingsCard", "time-night", "weather-rain", "weather-snow", "weather-clear",
  "criticalAlert", "warnFill", "badFill", "warn", "bad", "ok", "activeSetting",
  "activeLanguage",
]);

const missing = [...used].filter(
  (cls) =>
    !JS_ADDED.has(cls) &&
    !new RegExp(`\\.${cls.replace(/[-_]/g, "\\$&")}\\b`).test(css),
);

console.log(`index.html'daki sinif sayisi: ${used.size}`);
console.log(`CSS'te tanimsiz: ${missing.length}`);
if (missing.length) {
  for (const cls of missing) console.log(`  .${cls}`);
  process.exitCode = 1;
}

// Ters yon: CSS'te kalan ama HTML'de kullanilmayan siniflar (olu CSS).
const unused = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)]
  .map((m) => m[1])
  .filter((cls) => !used.has(cls) && !JS_ADDED.has(cls));
const uniqueUnused = [...new Set(unused)];
console.log(`\nHTML'de kullanilmayan CSS siniflari: ${uniqueUnused.length}`);
if (uniqueUnused.length) {
  console.log(uniqueUnused.map((c) => `  .${c}`).join("\n"));
}