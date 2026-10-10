// EN_DYNAMIC sozlugunun kapsamini denetler.
//
// Kullanim: node tools/check-i18n.mjs
//
// setText/setStatus cagrilarina dogrudan gecilen Turkce metinleri
// toplar ve EN_DYNAMIC'te karsiliklari olup olmadigini kontrol eder.
// Eksik olanlar, EN diline gecildiginde sessizce Turkce kalan metinlerdir.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, "..", "main.js"), "utf8");

function readObjectLiteral(name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start < 0) throw new Error(`${name} bulunamadi`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let i = bodyStart; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(bodyStart + 1, i);
    }
  }
  throw new Error(`${name} kapanmadi`);
}

const dynamicBody = readObjectLiteral("EN_DYNAMIC");
const known = new Set(
  [...dynamicBody.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)].map((m) => m[1]),
);

// setText("id", "metin") / setStatus("id", "metin", "class") cagrilari.
const CALL = /\bset(?:Text|Status)\(\s*"[^"]*"\s*,\s*"((?:[^"\\]|\\.)*)"/g;

const turkish = /[ÇĞİIÖŞÜçğıöşü]|\b(?:ve|ile|için|olarak|çın|aç|kapat|bulunamadı|okunamadı|yok|var|seç|oynat|duraklat|devam|başlat|dur)\b/i;

const missing = new Map();
let total = 0;

for (const m of source.matchAll(CALL)) {
  const literal = m[1];
  if (!turkish.test(literal)) continue;
  total += 1;
  if (!known.has(literal)) {
    const line = source.slice(0, m.index).split("\n").length;
    missing.set(literal, line);
  }
}

console.log(`setText/setStatus icinde Turkce literal: ${total}`);
console.log(`EN_DYNAMIC anahtari: ${known.size}`);
console.log(`Eksik ceviri: ${missing.size}`);

if (missing.size) {
  console.log("\nEksik olanlar (EN dilinde Turkce kalir):");
  for (const [literal, line] of [...missing].sort((a, b) => a[1] - b[1])) {
    console.log(`  main.js:${line}  ${literal}`);
  }
  process.exitCode = 1;
}