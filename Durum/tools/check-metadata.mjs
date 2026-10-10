import { readFileSync } from "node:fs";

// Medya dosyalarindaki gomulu metadata'yi tarar. Kisisel bilgi
// (dosya yolu, yazilim adi, kamera/cihaz bilgisi) sizmis olabilir.

const patterns = [
  "tuana", "akcay", "gmail", "OneDrive", "C:\\Users", "windy",
  "QE55", "Q70", "Samsung", "creator", "author", "Adobe", "GIMP",
  "Photoshop", "Microsoft Photo", "Windows Photo",
];

for (const file of process.argv.slice(2)) {
  const buf = readFileSync(file);
  const text = buf.toString("latin1");
  const hits = [];
  for (const p of patterns) {
    let i = 0;
    while ((i = text.indexOf(p, i)) >= 0) {
      const start = Math.max(0, i - 20);
      const ctx = text.slice(start, i + p.length + 30).replace(/[^\x20-\x7e]/g, ".");
      hits.push(`"${ctx}"`);
      i += p.length;
      if (hits.length > 12) break;
    }
    if (hits.length > 12) break;
  }
  console.log(`${file}: ${hits.length ? hits.length + " eslesme" : "temiz"}`);
  for (const h of hits) console.log("   " + h);
}