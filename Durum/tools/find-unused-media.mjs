// Medya dosyalarinin kod tarafindan referans alinip alinmadigini kontrol
// eder. Kullanilmayan medya, depoda yer israfidir.
//
// Kullanim: node tools/find-unused-media.mjs

import { readFileSync, readdirSync, statSync } from "node:fs";

const CODE = [
  "index.html",
  "main.js",
  "style.css",
  "config.xml",
  ".project",
  "README.md",
  "INSTALLING.md",
];

const source = CODE.map((f) => readFileSync(f, "utf8")).join("\n");
const media = readdirSync(".")
  .filter((f) => /\.(mp4|jpg|jpeg|png|mp3|wav|webm)$/i.test(f))
  .sort();

let total = 0;
let unused = 0;
let unusedBytes = 0;

console.log("== medya kullanimi ==\n");
for (const file of media) {
  const size = statSync(file).size;
  total += size;
  const hits = source.split(file).length - 1;
  if (hits === 0) {
    unused += 1;
    unusedBytes += size;
    console.log(`  KULLANILMIYOR  ${(size / 1024 / 1024).toFixed(2).padStart(7)} MB  ${file}`);
  } else {
    console.log(`  kullaniliyor   ${(size / 1024 / 1024).toFixed(2).padStart(7)} MB  ${file}  (${hits} referans)`);
  }
}

console.log(`\n  toplam   ${(total / 1024 / 1024).toFixed(2)} MB`);
console.log(`  kullanilmayan  ${(unusedBytes / 1024 / 1024).toFixed(2)} MB  (${unused} dosya)`);

if (unused) process.exitCode = 1;