import { readFileSync } from "node:fs";

// Markdown basligindan GitHub anchor slug'i uretir ve ic baglantilari
// dogrular. Basligi degistirmek baglantiyi kirar; bu araç onu yakalar.

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

let problems = 0;
const files = process.argv.slice(2);

for (const file of files) {
  const doc = readFileSync(file, "utf8");

  const headings = new Set();
  const seen = new Map();
  for (const m of doc.matchAll(/^#{1,6} (.+)$/gm)) {
    let slug = slugify(m[1]);
    // GitHub ayni basliga birden fazla kez gelirse -1, -2 ekler.
    const n = seen.get(slug) ?? 0;
    seen.set(slug, n + 1);
    if (n > 0) slug = `${slug}-${n}`;
    headings.add(slug);
  }

  const links = [...doc.matchAll(/\]\(#([^)]+)\)/g)].map((m) => m[1]);
  const broken = links.filter((l) => !headings.has(l));

  console.log(`${file}: ${links.length} ic baglanti, ${headings.size} baslik`);
  if (broken.length) {
    for (const b of broken) console.log(`  KIRIK  #${b}`);
    problems += broken.length;
  }
}

console.log(problems ? `\n${problems} kirk baglanti` : "\nTum ic baglantilar gecerli");
process.exitCode = problems ? 1 : 0;