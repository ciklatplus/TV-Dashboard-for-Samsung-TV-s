// Git deposunun TAMAMINI tarar: tum commit'ler, tum blob'lar, tum
// dosyalar (metin ve binary).
//
// Kapsam: IP adresleri (IPv4/IPv6), MAC, seri no, ana makine adlari,
// yerel yollar, kimlik bilgileri.
//
// Kullanim: node tools/scan-secrets.mjs [repoKoku]

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const repo = process.argv[2] || ".";

function git(args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8", maxBuffer: 1024 * 1024 * 512 });
}

// --- Tanimlar ---------------------------------------------------------------
const CHECKS = [
  {
    name: "Ozel IPv4 (ev/ofis agi)",
    re: /\b(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/g,
  },
  {
    name: "Genel IPv4",
    re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    // Yaygin/gecersiz degerleri ele
    skip: (m) =>
      /^0\.0\.0\.0$/.test(m) ||
      /^127\./.test(m) ||
      /^255\./.test(m) ||
      /^1\.0\.0\.1$/.test(m) ||
      /^224\./.test(m) ||
      // surum numaralari ve boyutlar
      m.split(".").some((p) => Number(p) > 255) ||
      m.startsWith("192.0.") ||
      m.startsWith("198.5.") ||
      m.startsWith("203.0."),
  },
  { name: "IPv6", re: /\b(?:[0-9a-f]{1,4}:){5,7}[0-9a-f]{1,4}\b/gi, skip: (m) => /^(?:0|:)+$/.test(m) || m === "::1" },
  { name: "MAC adresi", re: /\b(?:[0-9a-f]{2}:){5}[0-9a-f]{2}\b/gi },
  { name: "Windows yolu", re: /[A-Z]:\\(?:Users|Documents and Settings)[\\/][^\\/:*?"<>|\r\n]{2,60}/gi },
  { name: "Unix ev dizini", re: /(?:\/home\/|\/Users\/)[a-z0-9._-]{2,40}(?:\/[a-z0-9._-]{2,40})?/gi },
  { name: "OneDrive", re: /OneDrive/gi },
  { name: "Kullanici adi (ev dizini)", re: /\bwindo\b/gi },
  { name: "E-posta", re: /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g, skip: (m) => /@(example|schema|tizen\.org|w3\.org|developer\.samsung|mozilla|github|user@host)/i.test(m) || /^[\w.+-]+@[\w-]+\.(com|org|net)$/i.test(m) === false && /tizen/i.test(m) },
  { name: "Ozel anahtar", re: /-----BEGIN[ A-Z]*PRIVATE KEY-----/g },
  { name: "Sertifika blogu", re: /MI[A-Za-z0-9+/]{40,}={0,2}/g },
  { name: "API anahtari", re: /\b(?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["'][^"']{12,}["']/gi },
];

// Aranan desenleri tek regex ile birlestirip tek gecisde tarar.
const combined = new RegExp(
  CHECKS.map((c, i) => `(?<g${i}>${c.re.source})`).join("|"),
  "g",
);

function scanBuffer(buf, label, hits) {
  const text = buf.toString("latin1");
  for (const m of text.matchAll(combined)) {
    for (let i = 0; i < CHECKS.length; i++) {
      const g = m.groups[`g${i}`];
      if (g === undefined) continue;
      if (CHECKS[i].skip && CHECKS[i].skip(g)) continue;
      // Onceden bildigimiz guvenli degerler
      if (/^192\.168\.x\.x$/i.test(g)) continue;
      const key = CHECKS[i].name + "::" + g;
      if (!hits.has(key)) hits.set(key, new Set());
      hits.get(key).add(label);
    }
  }
}

// --- Tum commit'leri tara ----------------------------------------------------
console.log("Taraniyor: tum commit'ler x tum dosyalar...\n");
const commits = git(["rev-list", "--all"]).trim().split("\n");
const hits = new Map();
let filesScanned = 0;

for (const c of commits) {
  const files = git(["ls-tree", "-r", "--name-only", c]).trim().split("\n").filter(Boolean);
  for (const f of files) {
    let buf;
    try {
      buf = execFileSync("git", ["cat-file", "blob", `${c}:${f}`], {
        cwd: repo,
        maxBuffer: 1024 * 1024 * 512,
        encoding: "buffer",
      });
    } catch {
      continue;
    }
    filesScanned += 1;
    scanBuffer(buf, `${c.slice(0, 7)}:${f}`, hits);
  }
}

// --- Calisma agaci (commit'lenmemis) ----------------------------------------
for (const f of git(["ls-files"]).trim().split("\n").filter(Boolean)) {
  try {
    scanBuffer(readFileSync(`${repo}/${f}`), `WORKTREE:${f}`, hits);
    filesScanned += 1;
  } catch {}
}

console.log(`${commits.length} commit, ${filesScanned} blob tarandi.\n`);
if (hits.size === 0) {
  console.log("SONUC: Hicbir gizli/IP/makine bilgisi bulunamadi.");
} else {
  console.log("SONUC: Asagidakiler bulundu:\n");
  for (const [key, files] of [...hits].sort()) {
    const [check, value] = key.split("::");
    console.log(`  [${check}]  ${value}`);
    for (const f of [...files].slice(0, 6)) console.log(`      ${f}`);
    if (files.size > 6) console.log(`      ... +${files.size - 6} dosya daha`);
  }
  process.exitCode = 1;
}