import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// index.html'deki Turkce metinleri cikarir ve bunlarin EN_DYNAMIC
// sozlugunde karsiligi olup olmadigini raporlar.
// data-i18n tasimali ogeler haric birakilir (zaten I18N ile cevrilir).

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const js = readFileSync(join(root, "main.js"), "utf8");

function dictKeys(name) {
  const start = js.indexOf(`const ${name} = {`);
  const open = js.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < js.length; i += 1) {
    if (js[i] === "{") depth += 1;
    else if (js[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        return new Set([...js.slice(open + 1, i).matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)].map((m) => m[1]));
      }
    }
  }
  return new Set();
}

const dynamic = dictKeys("EN_DYNAMIC");
const i18n = dictKeys("I18N");
const i18nValues = new Set();
{
  // I18N degerleri de anahtar olabilir (statik metinler).
  const start = js.indexOf("const I18N = {");
  const end = js.indexOf("\n};", start);
  for (const m of js.slice(start, end).matchAll(/:\s*"((?:[^"\\]|\\.)*)"/g)) {
    i18nValues.add(m[1]);
  }
}

// data-i18n tasiyan ogeler haric: metin zaten I18N ile cevrilir.
const withoutI18n = html.replace(/<[^>]*data-i18n[^>]*>[\s\S]*?<\/[^>]+>/g, "");

// Kasitli olarak cift dilli yazilmis metinler (her iki dilde de anlasilir),
// ceviri beklenmez.
const BILINGUAL = [
  "Dil seçin / Choose language",
  "← → seç / choose",
  // Sarki adi ozgun ad olarak Turkce karakter icermiyor; ceviri gerekmez.
  "Windows XP Installation Music",
];

const findings = [];
for (const m of withoutI18n.matchAll(/>([^<>]{2,})</g)) {
  const text = m[1].trim();
  if (!text) continue;
  if (!/[ÇĞİIÖŞÜçğıöşü]/.test(text)) continue; // sadece Turkce icerenler
  if (dynamic.has(text) || i18nValues.has(text)) continue;
  if (BILINGUAL.some((b) => text.startsWith(b))) continue;
  const line = withoutI18n.slice(0, m.index).split("\n").length;
  findings.push({ text, line });
}

console.log(`index.html'de ceviri kapsami disi Turkce metin: ${findings.length}`);
for (const f of findings) {
  console.log(`  index.html:${f.line}  ${f.text}`);
}