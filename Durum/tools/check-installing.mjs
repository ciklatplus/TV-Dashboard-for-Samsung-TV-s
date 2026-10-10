import { readFileSync } from "node:fs";

// INSTALLING.md icindeki teknik iddialari config.xml ve gercek dosya
// yollariyla karsilastirir. Yanlis iddia kalmamasi icin.

const doc = readFileSync("INSTALLING.md", "utf8");
const cfg = readFileSync("config.xml", "utf8");
const readme = readFileSync("README.md", "utf8");

let problems = 0;
const ok = (m) => console.log("  OK   " + m);
const bad = (m) => { console.log("  FAIL " + m); problems += 1; };

console.log("== access origins ==");
const origins = [...cfg.matchAll(/<access origin="([^"]+)"/g)].map((m) => m[1]);
for (const o of origins) {
  doc.includes(o) ? ok(o) : bad("dokumanda yok: " + o);
}
const listed = [...doc.matchAll(/^https:\/\/[a-z0-9.-]+$/gm)].map((m) => m[0]);
const extra = listed.filter((o) => !origins.includes(o));
extra.length ? bad("config.xml'de olmayan origin listelenmis: " + extra.join(", ")) : ok("fazladan origin yok");

console.log("== privileges ==");
const privs = [...cfg.matchAll(/tizen:privilege name="([^"]+)"/g)].map((m) => m[1]);
for (const p of privs) {
  doc.includes(p) ? ok(p) : bad("dokumanda yok: " + p);
}

console.log("== guncel arac durumu ==");
// Tizen Studio emekli cikarildi; dokuman VS Code eklentisini anmali.
const retired = [...doc.matchAll(/Tizen Studio/gi)];
const asCurrent = retired.filter((m) => {
  const ctx = doc.slice(Math.max(0, m.index - 200), m.index + 200).toLowerCase();
  // Geri kalan durumunu ya da Eclipse formatini aciklayan gecmeler sorun degil.
  return !/no longer|retired|instead|does not|not distributed|eclipse format|do \*\*not\*\* need|still lives|usually lives/.test(ctx);
});
asCurrent.length
  ? bad("Tizen Studio guncel arac gibi sunuluyor: " + asCurrent.length + " kez")
  : ok("Tizen Studio yalnizca geri kalan durum olarak aniliyor");

doc.includes("vscode-tizen-csharp") ? ok("VS Code eklenti kimligi") : bad("VS Code eklenti kimligi eksik");
doc.includes("Build Project") ? ok("Build komutu") : bad("Build komutu eksik");
doc.includes("Tizen: Create Certificate") ? ok("sertifika komutu") : bad("sertifika komutu eksik");
doc.includes("Tizen: Remote Devices") ? ok("Remote Devices komutu") : bad("Remote Devices eksik");
doc.includes("Run as TV Web Simulator") ? ok("TV web simulator") : bad("TV web simulator eksik");

console.log("== kimlikler ==");
const appId = cfg.match(/tizen:application id="([^"]+)"/)[1];
const pkg = cfg.match(/package="([^"]+)"/)[1];
const ver = cfg.match(/widget[^>]*version="([^"]+)"/)[1];
const req = cfg.match(/required_version="([^"]+)"/)[1];
const profile = cfg.match(/tizen:profile name="([^"]+)"/)[1];

doc.includes(appId) ? ok("appId " + appId) : bad("appId eksik: " + appId);
// paket adinin gecmesi zorunlu degil; appId zaten iceriyor.
pkg && doc.includes(pkg) ? ok("paket adi geciyor: " + pkg) : ok("paket adi ayrica gecmiyor (sorun degil)");
ver && doc.includes(ver) ? ok("surum " + ver) : bad("surum eksik: " + ver);
req && doc.includes(req) ? ok("required_version " + req) : bad("required_version eksik: " + req);
profile && doc.includes(profile) ? ok("profil " + profile) : bad("profil eksik: " + profile);

console.log("== dosya yollari ==");
for (const p of [".project", "config.xml"]) {
  doc.includes(p) ? ok(p) : bad("yol eksik: " + p);
}
// VS Code eklentisi cikti dizinini sabitlemez; eski Tizen Studio
// yollari yanlislikla korunmus olabilir.
doc.includes(".buildResult")
  ? bad("eski Tizen Studio cikti yolu (.buildResult) hala geciyor")
  : ok("eski buildResult yolu temizlendi");
doc.includes("Install-TV.ps1") ? bad("kaldirilan script hala aniliyor") : ok("kaldirilan script anilmamiyor");
readme.includes("INSTALLING.md") ? ok("README baglantisi") : bad("README'de baglanti yok");

// TV tarafinda yapilmasi gerekenler: gelistirici seceneklerini acmak ve
// IP adresini ogrenmek. Ikisi de yalnizca dokumanda anlatilabilir.
console.log("== TV hazirligi ==");
for (const [label, needle] of [
  ["gelistirici secenekleri bolumu", "2.1 Unlock the developer options"],
  ["IP adresi bolumu", "2.2 Find the TV's IP address"],
  ["Player Confirmation adimi", "Player Confirmation"],
  ["debug sozlesmesi adimi", "debug agreement"],
  ["Allow unsigned installation anahtari", "Allow unsigned installation"],
  ["169.254 uyarisi", "169.254"],
  ["TV uzerinden IP okuma yolu", "Support → About"],
]) {
  doc.includes(needle) ? ok(label) : bad("eksik: " + label);
}

// Eski Tizen Studio cikti yollari ve script parametreleri temizlenmeli.
doc.includes("-SdbPath") ? bad("kaldirilan script parametresi hala aniliyor") : ok("eski script parametresi temizlendi");
doc.includes("dist/TV Dashboard.wgt") ? bad("eski cikti yolu hala aniliyor") : ok("eski cikti yolu temizlendi");

// Bozuk kontrol karakteri (ok / tire) dosyaya sizmis olabilir; PowerShell
// ile yazma sirasinda olusur ve ekranda gorunmez.
const ctrl = [...doc].filter((ch) => {
  const c = ch.codePointAt(0);
  return (c < 0x20 && c !== 0x0a && c !== 0x09) || c === 0x7f;
});
ctrl.length === 0
  ? ok("bozuk kontrol karakteri yok")
  : bad(`${ctrl.length} bozuk kontrol karakteri var`);

// Kullaniciya ozel bir IP yazmis olabiliriz.
const ips = [...new Set((doc.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || []))];
ips.length === 0 ? ok("belirli IP adresi yok") : bad("belirli IP adresi geciyor: " + ips.join(", "));

console.log("== var olan dosyalar ==");
for (const f of ["config.xml", ".project", "index.html", "style.css", "main.js", "icon.png", "Install-TV.ps1", ".buildResult/TV Dashboard.wgt"]) {
  doc.includes(f) || console.log("  --   " + f + " dokumanda anilmiyor (sorun degil)");
}

console.log(problems ? `\n${problems} sorun` : "\nDogrulama temiz");
process.exitCode = problems ? 1 : 0;