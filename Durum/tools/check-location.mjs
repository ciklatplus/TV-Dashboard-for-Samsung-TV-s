// Konum akisini dogrular: IP sorgusu, gosterim ve basarisiz durum.
// Sehir secme ozelligi kaldirildiktan sonra IP yolunun bozulmadigini
// dogrulamak icin.
//
// Kullanim: node tools/check-location.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "..", "index.html"), "utf8");
const js = readFileSync(join(here, "..", "main.js"), "utf8");

const problems = [];
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => {
  problems.push(m);
  console.log(`  HATA ${m}`);
};

// --- DOM taklidi -----------------------------------------------------------
const texts = new Map();
const store = new Map();

function makeEl(id) {
  return {
    id,
    textContent: "",
    className: "",
    classList: { toggle() {}, add() {}, remove() {}, contains: () => false },
    children: [],
    hasAttribute: () => false,
    getAttribute: () => null,
    setAttribute() {},
    addEventListener() {},
    appendChild() {},
    focus() {},
    style: {},
  };
}

const nodes = new Map();
for (const id of ["city", "locationSource", "locationHint"]) nodes.set(id, makeEl(id));

globalThis.window = globalThis;
globalThis.addEventListener = () => {};
globalThis.document = {
  hidden: false,
  documentElement: { lang: "tr" },
  body: { classList: { toggle() {}, add() {}, remove() {} } },
  activeElement: null,
  querySelectorAll: () => [],
  querySelector: () => null,
  getElementById: (id) => nodes.get(id) || null,
  createElement: () => makeEl("x"),
  head: { appendChild() {} },
  addEventListener() {},
};
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  // Gercek API ile ayni: index -> anahtar.
  key: (i) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};
globalThis.setTimeout = () => 0;
globalThis.clearTimeout = () => {};
globalThis.fetch = () => Promise.reject(new Error("offline"));

// --- Ozellik kaldirildi mi --------------------------------------------------
console.log("== ozellik kaldirildi mi ==");

const removed = [
  "cityOverlay",
  "citySearchInput",
  "cityResults",
  "cityAutoButton",
  "locationHint",
];
for (const id of removed) {
  html.includes(`id="${id}"`)
    ? bad(`index.html hala #${id} iceriyor`)
    : ok(`#${id} kaldirildi`);
}

const removedFns = [
  "initCitySearch",
  "openCitySearch",
  "closeCitySearch",
  "handleCityKey",
  "runCitySearch",
  "confirmCitySelection",
  "loadManualLocation",
  "renderManualLocation",
];
for (const fn of removedFns) {
  js.includes(fn) ? bad(`main.js hala ${fn} iceriyor`) : ok(`${fn} kaldirildi`);
}

js.includes("geocoding-api") ? bad("geocoding ucu hala kodda") : ok("geocoding ucu kaldirildi");
js.includes("tvDashboardCity")
  ? bad("sehir onbellegi hala tutuluyor")
  : ok("sehir onbellegi kaldirildi");

// --- Konum kartinin OK tusu davranisi -------------------------------------
console.log("\n== konum karti salt okunur mu ==");

const keyHandler = js.slice(js.indexOf("function setupRemoteKeys"));
keyHandler.includes("locationInfo") && keyHandler.includes("openCitySearch")
  ? bad("konum karti yine sehir aramasi aciyor")
  : ok("konum karti OK tusuna bagli degil");

// --- IP akisi ---------------------------------------------------------------
console.log("\n== IP konum akisi ==");

const api = new Function(
  js + "\n;return { resolveIpLocation, renderIpLocation, isValidIpLocation, clearStoredLocationData, WEATHER, getEl };",
)();

nodes.get("city").textContent = "";
api.clearStoredLocationData();

// 1) Basarili IP yaniti
globalThis.fetch = (url) =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ success: true, city: "Izmir", latitude: 38.4, longitude: 27.1 }),
  });

const okResult = await api.resolveIpLocation();
okResult ? ok("IP sorgusu basarili dondu") : bad("IP sorgusu basarisiz dondu");
api.WEATHER.city === "Izmir"
  ? ok("WEATHER.city = Izmir")
  : bad(`WEATHER.city yanlis: ${api.WEATHER.city}`);
nodes.get("city").textContent === "Izmir"
  ? ok("ekrana Izmir yazildi")
  : bad(`ekranda: ${nodes.get("city").textContent}`);
Math.abs(api.WEATHER.latitude - 38.4) < 0.01
  ? ok("enlem aktarildi")
  : bad(`enlem: ${api.WEATHER.latitude}`);

// 2) Butun saglayicilar basarisiz
globalThis.fetch = () => Promise.reject(new Error("offline"));
const failResult = await api.resolveIpLocation();
failResult === false ? ok("basarisizlik dogru islendi") : bad("basarisizlik yanlis islendi");
nodes.get("city").textContent === "IP konumu alınamadı"
  ? ok("ekrana hata yazildi")
  : bad(`ekranda: ${nodes.get("city").textContent}`);
nodes.get("locationSource").textContent === "IP konumu alınamadı"
  ? ok("kaynak satiri hata durumunu gosteriyor")
  : bad(`kaynak: ${nodes.get("locationSource").textContent}`);

// 3) Bozuk veri reddediliyor mu
const bad1 = api.isValidIpLocation({ name: "X", latitude: 999, longitude: 0 });
const bad2 = api.isValidIpLocation({ name: "", latitude: 1, longitude: 1 });
const bad3 = api.isValidIpLocation(null);
!bad1 && !bad2 && !bad3 ? ok("bozuk konum verisi reddediliyor") : bad("bozuk veri kabul edildi");

const good = api.isValidIpLocation({ name: "Izmir", latitude: 38.4, longitude: 27.1 });
good ? ok("gecerli konum kabul ediliyor") : bad("gecerli konum reddedildi");

// 4) Eski sehir onbellegi temizleniyor mu
store.set("tvDashboardCity", JSON.stringify({ name: "Ankara", latitude: 39.9, longitude: 32.8 }));
api.clearStoredLocationData();
store.has("tvDashboardCity")
  ? bad("eski sehir onbellegi silinmedi")
  : ok("eski sehir onbellegi temizlendi");

// --- Sonuc ------------------------------------------------------------------
console.log("");
if (problems.length) {
  console.log(`SONUC: ${problems.length} sorun`);
  process.exitCode = 1;
} else {
  console.log("SONUC: konum akisi saglam");
}