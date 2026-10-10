"use strict";

const APP_VERSION = "1.12.6";
const LOW_POWER_MODE = true;

const PERFORMANCE = {
  clockIntervalMs: 60 * 1000,
  systemIntervalMs: 30 * 1000,
  sourceIntervalMs: 2 * 60 * 1000,
  storageIntervalMs: 5 * 60 * 1000,
  slowIntervalMs: 10 * 60 * 1000,
  // Periodically nudges the surface to avoid OLED burn-in.
  pixelShiftIntervalMs: 4 * 60 * 1000
};

const BACKGROUND_RECOVERY_DELAYS_MS = [2000, 5000, 15000, 30000];

const I18N = {
  tr: {
    warning: "Uyarı",
    modelInfo: "TV Model Bilgisi",
    system: "Sistem",
    resources: "Sistem Kaynakları",
    cpuUsage: "CPU kullanımı",
    internalStorage: "Dahili depolama",
    panel: "Panel",
    networkInternet: "Ağ / İnternet",
    manualInternetTest: "Manuel internet testi",
    tvIp: "TV IP",
    source: "TV / HDMI Kaynağı",
    sound: "Ses",
    music: "Müzik",
    location: "Konum",
    locationDescription: "Otomatik hava durumu konumu",
    settings: "Ayarlar",
    footerHelp: "Yön tuşları: gezin • OK: seç • Geri: çıkış",
    dashboardSettings: "Dashboard Ayarları",
    city: "Şehir",
    musicLevel: "Müzik seviyesi",
    weatherRefresh: "Hava yenileme",
    backgroundMode: "Arka plan modu",
    backgroundPhoto: "Foto seçimi",
    backgroundVideo: "Video seçimi",
    settingsHint: "↑↓ alan seç • ←→ değiştir • OK kaydet",
    language: "Dil"
  },
  en: {
    warning: "Warning",
    modelInfo: "TV Model Info",
    system: "System",
    resources: "System Resources",
    cpuUsage: "CPU usage",
    internalStorage: "Internal storage",
    panel: "Panel",
    networkInternet: "Network / Internet",
    manualInternetTest: "Manual internet test",
    tvIp: "TV IP",
    source: "TV / HDMI Source",
    sound: "Sound",
    music: "Music",
    location: "Location",
    locationDescription: "Automatic weather location",
    settings: "Settings",
    footerHelp: "Arrow keys: navigate • OK: select • Back: exit",
    dashboardSettings: "Dashboard Settings",
    city: "City",
    musicLevel: "Music level",
    weatherRefresh: "Weather refresh",
    backgroundMode: "Background mode",
    backgroundPhoto: "Photo selection",
    backgroundVideo: "Video selection",
    settingsHint: "↑↓ select field • ←→ change • OK save",
    language: "Language"
  }
};

const EN_DYNAMIC = {
  "TV'de ölçülür": "Measured on TV",
  "Canlı sağlık verileri bekleniyor": "Waiting for live health data",
  "Kritik": "Critical",
  "Yoğun": "High load",
  "İyi": "Good",
  "Sistem kaynakları kritik seviyede": "System resources are at a critical level",
  "Sistem kaynakları yoğun kullanılıyor": "System resources are under high load",
  "Model kodu bulunamadı": "Model code not found",
  "Samsung TV API yok": "Samsung TV API unavailable",
  "Gerçek TV veya emülatörde görüntülenir": "Visible on a real TV or emulator",
  "Tarayıcı modu": "Browser mode",
  "Sistem bilgisi TV'de görünür": "System info is visible on TV",
  "Build okunamadı": "Build could not be read",
  "Build desteklenmiyor": "Build is not supported",
  "Bilinmiyor": "Unknown",
  "Parlaklık TV'de görünür": "Brightness is visible on TV",
  "Parlaklık desteklenmiyor": "Brightness is not supported",
  "Parlaklık okunamadı": "Brightness could not be read",
  "Çevrimdışı": "Offline",
  "Çevrimiçi": "Online",
  "Ağ geçidine bağlantı kurulamadı": "Could not reach the network gateway",
  "İnternet erişimi doğrulandı": "Internet access verified",
  "IP okunamadı": "IP could not be read",
  "TV API yok": "TV API unavailable",
  "Bağlantı türü: Ethernet": "Connection type: Ethernet",
  "Wi‑Fi sinyali gerçek TV'de görünür": "Wi‑Fi signal is visible on a real TV",
  "Wi‑Fi bilgisi kullanılamıyor": "Wi‑Fi information unavailable",
  "Wi‑Fi bilgisi desteklenmiyor": "Wi‑Fi information is not supported",
  "OK: başlat": "OK: start",
  "Bağlantı yok": "No connection",
  "Gecikme ölçülüyor...": "Measuring latency...",
  "İndirme ölçülüyor...": "Measuring download...",
  "İnternet testi çalışıyor": "Internet test is running",
  "İnternet testi tamamlandı": "Internet test completed",
  "Test başarısız": "Test failed",
  "İnternet testi tamamlanamadı": "Internet test could not be completed",
  "TV'de görünür": "Visible on TV",
  "USB bilgisi gerçek TV'de görünür": "USB information is visible on a real TV",
  "Okunamadı": "Could not be read",
  "Desteklenmiyor": "Not supported",
  "Dahili alan okunamadı": "Internal storage could not be read",
  "USB depolama bağlı değil": "USB storage is not connected",
  "Depolama okunamadı": "Storage could not be read",
  "USB bilgisi alınamadı": "USB information unavailable",
  "USB desteklenmiyor": "USB is not supported",
  "Giriş bağlı, sinyal yok": "Input connected, no signal",
  "Giriş sinyali aktif": "Input signal active",
  "Geçerli TV kaynağı": "Current TV source",
  "Kaynak bilgisi bu modelde yok": "Source information is unavailable on this model",
  "Gerçek TV'de HDMI / TV kaynağı görünür": "HDMI / TV source is visible on a real TV",
  "HDR / enerji bilgisi gerçek TV'de görünür": "HDR / energy information is visible on a real TV",
  "Ses bilgisi gerçek TV'de görünür": "Sound information is visible on a real TV",
  "Ses bilgisi alınamadı": "Sound information unavailable",
  "Sessiz mod açık": "Muted",
  "Sessiz mod kapalı": "Sound on",
  "Açık": "Clear",
  "Çoğunlukla açık": "Mostly clear",
  "Parçalı bulutlu": "Partly cloudy",
  "Sisli": "Foggy",
  "Çisenti": "Drizzle",
  "Yağmurlu": "Rainy",
  "Karlı": "Snowy",
  "Sağanak": "Showers",
  "Gök gürültülü": "Thunderstorm",
  "Hava durumu": "Weather",
  "Fırtına ve gök gürültüsü uyarısı": "Storm and thunder warning",
  "Şiddetli yağmur uyarısı": "Heavy rain warning",
  "Yağmur bekleniyor / devam ediyor": "Rain expected / ongoing",
  "Kar yağışı uyarısı": "Snowfall warning",
  "Tahmin yok": "No forecast",
  "Gün doğumu / batımı kullanılamıyor": "Sunrise / sunset unavailable",
  "Hava verisi kullanılamıyor": "Weather data unavailable",
  "Konum bulunuyor...": "Finding location...",
  "Otomatik konum alınamadı": "Automatic location unavailable",
  "Müzik hatası": "Music error",
  "Ses dosyası açılamadı": "Audio file could not be opened",
  "Hazır": "Ready",
  "OK: oynat": "OK: play",
  "Duraklatıldı": "Paused",
  "OK: devam et": "OK: resume",
  "Çalıyor": "Playing",
  "Başlatılamadı": "Could not start",
  "Müzik başlatılamadı": "Music could not start",
  "Tarayıcı sesi engelledi • ekrana tıklayıp Enter'a bas": "Browser blocked audio • click the screen and press Enter",
  "TV ses oynatıcısı başlatılamadı": "TV audio player could not start",
  "Müzik çalıyor": "Music is playing",
  "Müzik duraklatıldı": "Music paused",
  "Müzik seçilmedi": "No music selected",
  "Ayarlar açık": "Settings open",
  "Ayarlar kaydedildi": "Settings saved",
  "Ayar değişiklikleri iptal edildi": "Settings changes cancelled",
  "TV Dashboard hazır": "TV Dashboard ready",
  "Henüz yenilenmedi": "Not updated yet",
  "Otomatik konum": "Automatic location",
  "IP konumu": "IP location",
  "IP üzerinden yaklaşık konum": "Approximate location via IP",
  "IP konumu algılanıyor...": "Detecting IP location...",
  "IP konumu alınamadı": "IP location unavailable",
  "Konum bekleniyor...": "Waiting for location...",
  "OK: sesi kapat": "OK: mute TV",
  "OK: sesi aç": "OK: unmute TV",
  "TV sesi kapatıldı": "TV muted",
  "TV sesi açıldı": "TV unmuted",
  "TV sesi artırıldı": "TV volume up",
  "TV sesi azaltıldı": "TV volume down",
  "Ses kontrol edilemedi": "Sound could not be controlled",
  // Verified by tools/check-i18n.mjs.
  "Son yenileme ": "Last update: ",
  "Tizen ": "Tizen ",
  "Uygulama alanı: ": "App area: ",
  "Parlaklık: %": "Brightness: %",
  "Wi‑Fi sinyali: ": "Wi-Fi signal: ",
  "Boş ": "Free ",
  "Bağlı: ": "Connected: ",
  "Gün doğumu ": "Sunrise ",
  "Music %": "Music %",
  "Müzik %": "Music %",
  // First-paint strings from index.html, visible before any JS data arrives.
  "Yükleniyor...": "Loading...",
  "Hava durumu alınıyor...": "Loading weather...",
  "Gün doğumu / batımı alınıyor...": "Loading sunrise / sunset...",
  "Algılanıyor...": "Detecting...",
  "Sistem sağlığı hesaplanıyor...": "Calculating system health...",
  "USB depolama aranıyor...": "Looking for USB storage...",
  "Çözünürlük okunuyor...": "Reading resolution...",
  "Parlaklık okunuyor...": "Reading brightness...",
  "Sıcaklık: --°C": "Temperature: --°C",
  "Bağlantı türü okunuyor...": "Reading connection type...",
  "Bağlı girişler okunuyor...": "Reading connected inputs...",
  "Alınıyor...": "Loading...",
  "Müzik %35 • OK: ayarları aç": "Music %35 • OK: open settings",
  "Türkçe": "Turkish",
  "Dil seçin / Choose language": "Dil seçin / Choose language",
  "Devam etmek için bir dil seçin": "Devam etmek için bir dil seçin",
  // Interpolated values, e.g. "Mimari: " + architecture.
  "Tarayıcı ağ durumu": "Browser network state",
  "Mimari bilinmiyor": "Architecture unknown",
  "Mimari: ": "Architecture: ",
  "Tahmin yok": "No forecast"
};

const WEATHER_REFRESH_OPTIONS = [5, 10, 15, 30];

const LANGUAGE_STORAGE_KEY = "tvDashboardLanguage";

const SPEED_TEST = {
  downloadUrl: "https://speed.cloudflare.com/__down",
  downloadBytes: 3000000,
  timeoutMs: 20000
};

const WEATHER = {
  city: "IP konumu algılanıyor...",
  latitude: null,
  longitude: null,
  timeoutMs: 12000
};

const IP_LOCATION = {
  timeoutMs: 8000,
  providers: [
    "https://get.geojs.io/v1/ip/geo.json",
    "https://ipwho.is/"
  ]
};

const MEDIA = {
  backgroundVideoFile: "bg.mp4",
  backgroundImageFile: "bg.jpg",
  musicVolume: 0.35,
  musicTitle: "Windows XP Installation Music"
};

const PACKAGED_BACKGROUND_MEDIA = {
  images: [
    { file: "bg.jpg", label: "bg.jpg" },
    { file: "bg2.png", label: "bg2.png" },
    { file: "bg3.jpg", label: "bg3.jpg" }
  ],
  videos: [
    { file: "bg.mp4", label: "bg.mp4" },
    { file: "bg2.mp4", label: "bg2.mp4" },
    { file: "bg3.mp4", label: "bg3.mp4" },
    { file: "bg4.mp4", label: "bg4.mp4" },
    { file: "bg5.mp4", label: "bg5.mp4" }
  ]
};

let lastWeatherSuccess = 0;
let lastWeatherCode = null;
let weatherIntervalId = null;
let settingsOpen = false;
let activeSettingIndex = 0;
let settingsDraft = null;
let lastScreenSaverEnabled = null;
let pixelShiftIndex = 0;
let speedTestRunning = false;
let weatherUpdating = false;
let ipLocation = null;
let currentLanguage = "tr";
let languageOpen = true;
let activeLanguageIndex = 0;

let lastStorageRefresh = 0;
let lastSourceRefresh = 0;
let lastThemeKey = "";
let lastMusicProgressSecond = -1;
let lastMusicProgressPercent = -1;
let backgroundScanPromise = null;
let backgroundScanComplete = false;
let backgroundRenderToken = 0;
let avplayBackgroundFile = "";
let lastAppliedBackgroundSignature = "";
let backgroundRecoveryTimer = null;
let backgroundRecoveryAttempt = 0;
let backgroundStartAttemptAt = 0;
const runtimeIntervals = {
  clock: null,
  system: null,
  slow: null,
  pixelShift: null
};
const elementCache = {};
const backgroundLibrary = {
  images: [{ file: MEDIA.backgroundImageFile, label: MEDIA.backgroundImageFile }],
  videos: [{ file: MEDIA.backgroundVideoFile, label: MEDIA.backgroundVideoFile }]
};
let settings = {
  musicVolume: 35,
  refreshIndex: 1,
  backgroundMode: "video",
  backgroundImageIndex: 0,
  backgroundVideoIndex: 0
};
const cpuHistory = [];
const ramHistory = [];
const systemSnapshot = {
  cpu: null,
  ram: null,
  storage: null,
  temperature: null
};
const appAlerts = {
  system: null,
  weather: null
};

function getEl(id) {
  if (!elementCache[id]) elementCache[id] = document.getElementById(id);
  return elementCache[id];
}

function translateUiText(value) {
  const text = String(value === undefined || value === null ? "" : value);
  if (currentLanguage !== "en") return text;
  if (EN_DYNAMIC[text]) return EN_DYNAMIC[text];

  return text
    .replace(/^Son yenileme /, "Last update ")
    .replace(/^Model kodu: /, "Model code: ")
    .replace(/Mimari bilinmiyor/g, "Architecture unknown")
    .replace(/Mimari: /g, "Architecture: ")
    .replace(/Build okunamadı/g, "Build could not be read")
    .replace(/Build desteklenmiyor/g, "Build is not supported")
    .replace(/Build TV'de görünür/g, "Build visible on TV")
    .replace(/^Uygulama alanı: /, "App area: ")
    .replace(/^Panel: /, "Panel: ")
    .replace(/^Parlaklık: /, "Brightness: ")
    .replace(/^Bağlantı türü: /, "Connection type: ")
    .replace(/^Wi‑Fi sinyali: /, "Wi‑Fi signal: ")
    .replace(/^Boş /, "Free ")
    .replace(/ boş \/ /, " free / ")
    .replace(/^Bağlı: /, "Connected: ")
    .replace(/Rüzgar /g, "Wind ")
    .replace(/^Gün doğumu /, "Sunrise ")
    .replace(/ • Gün batımı /, " • Sunset ")
    .replace(/^Otomatik: /, "Automatic: ")
    .replace(/Kapal(?:ı|i)/g, "Off")
    .replace(/ • OK: ayarları aç$/, " • OK: open settings")
    .replace(/ aktif$/, " active")
    .replace(/ dakika$/, " minutes")
    .replace(/ • OK: duraklat$/, " • OK: pause")
    .replace(/^OK: oynat \/ duraklat$/, "OK: play / pause")
    .replace(/^Kumanda: /, "Remote: ")
    .replace(/^Sıcaklık: /, "Temperature: ")
    .replace(/^Depo %/, "Storage %");
}

function setText(id, text) {
  const el = getEl(id);
  if (!el) return;
  const translated = translateUiText(text);
  if (el.textContent !== translated) el.textContent = translated;
}

function setStatus(id, text, className) {
  const el = getEl(id);
  if (!el) return;

  const translated = translateUiText(text);
  if (el.textContent !== translated) el.textContent = translated;
  ["ok", "warn", "bad"].forEach(function (name) {
    el.classList.toggle(name, name === className);
  });
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLanguage;
  const dictionary = I18N[currentLanguage] || I18N.tr;
  const elements = document.querySelectorAll("[data-i18n]");
  Array.prototype.forEach.call(elements, function (element) {
    const key = element.getAttribute("data-i18n");
    if (dictionary[key]) element.textContent = dictionary[key];
  });

  // Plain text nodes with no data-i18n attribute. index.html authors them in
  // Turkish and they show before any JS data arrives, so EN mode has to
  // translate them from the dictionary.
  //
  // Matching is dictionary membership, not a Turkish-character test: short
  // strings like "Ara"/"Kapat" contain no Turkish characters but are listed,
  // and a character test would skip them. Text JS already wrote via
  // setText/setStatus is translated and so absent from the dictionary, which
  // is what leaves it alone.
  //
  // On the way back to TR, data-i18n elements take their text from I18N, so
  // the reverse pass must skip them - otherwise keys such as "settings"
  // would end up on screen.
  const i18nElements = document.querySelectorAll("[data-i18n]");
  const enDictionary = I18N.en || {};
  const trDictionary = I18N.tr || {};

  const plain = document.querySelectorAll(".card *, .topbar *, .footer *, .settingsPanel *, .languagePanel *");
  Array.prototype.forEach.call(plain, function (element) {
    if (element.children.length) return;
    if (element.hasAttribute("data-i18n")) return; // handled above
    const text = element.textContent;
    if (!text) return;

    if (currentLanguage === "en") {
      if (Object.prototype.hasOwnProperty.call(EN_DYNAMIC, text)) {
        element.textContent = EN_DYNAMIC[text];
      }
      return;
    }

    for (const source in EN_DYNAMIC) {
      if (EN_DYNAMIC[source] === text) {
        element.textContent = source;
        return;
      }
    }
  });

  if (currentLanguage !== "en") {
    Array.prototype.forEach.call(i18nElements, function (element) {
      const key = element.getAttribute("data-i18n");
      const current = element.textContent.trim();
      for (const i18nKey in enDictionary) {
        if (enDictionary[i18nKey] === current && trDictionary[i18nKey]) {
          element.textContent = trDictionary[i18nKey];
          return;
        }
      }
    });
  }
}

function renderLanguageSelection() {
  const ids = ["languageTr", "languageEn"];
  ids.forEach(function (id, index) {
    const button = getEl(id);
    if (!button) return;
    const active = index === activeLanguageIndex;
    button.classList.toggle("activeLanguage", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
    if (active) button.focus();
  });
}

function refreshLanguageSensitiveUi() {
  applyStaticLanguage();
  applyDashboardSettings(settings);
  renderIpLocation();
  updateClock();
  updateSlowSystemInfo();
  refreshSystemCards();
  updateMusicStatus();
  if (!speedTestRunning) setText("speedTestStatus", "OK: başlat");
  renderAppAlert();
  updateWeather();
}

function confirmLanguage(language) {
  currentLanguage = language === "en" ? "en" : "tr";
  // Keep the free-standing key and the settings object in sync.
  settings.language = currentLanguage;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch (e) {}
  languageOpen = false;
  const overlay = getEl("languageOverlay");
  if (overlay) overlay.hidden = true;
  refreshLanguageSensitiveUi();
  focusFirstCard();
  playMusic();
}

function handleLanguageKey(key) {
  if (key === 37 || key === 38 || key === 39 || key === 40) {
    activeLanguageIndex = activeLanguageIndex === 0 ? 1 : 0;
    renderLanguageSelection();
    return true;
  }

  if (key === 13) {
    confirmLanguage(activeLanguageIndex === 1 ? "en" : "tr");
    return true;
  }

  return key === 10009;
}

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" || stored === "tr" ? stored : "";
  } catch (e) {
    return "";
  }
}

// Called from both the language screen and the settings panel.
function applyLanguage(language) {
  const next = language === "en" ? "en" : "tr";
  if (next === currentLanguage) return;
  currentLanguage = next;
  settings.language = next;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch (e) {}
  refreshLanguageSensitiveUi();
}

function initLanguageSelector() {
  const overlay = getEl("languageOverlay");
  const stored = getStoredLanguage();

  if (stored) {
    // A stored preference means the selection screen is skipped entirely.
    currentLanguage = stored;
    settings.language = stored;
    languageOpen = false;
    if (overlay) overlay.hidden = true;
    applyStaticLanguage();
    return;
  }

  if (overlay) overlay.hidden = false;
  languageOpen = true;
  activeLanguageIndex = settings.language === "en" ? 1 : 0;

  ["languageTr", "languageEn"].forEach(function (id, index) {
    const button = getEl(id);
    if (!button) return;
    button.addEventListener("click", function () {
      activeLanguageIndex = index;
      confirmLanguage(index === 1 ? "en" : "tr");
    });
  });

  renderLanguageSelection();
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value || 0)));
}

function setMetricBar(id, percent) {
  const el = getEl(id);
  if (!el) return;

  const safePercent = clampPercent(percent);
  if (el.getAttribute("data-percent") === String(safePercent)) return;
  el.setAttribute("data-percent", String(safePercent));
  el.style.width = safePercent + "%";
  el.classList.remove("warnFill", "badFill");
  if (safePercent >= 90) el.classList.add("badFill");
  else if (safePercent >= 75) el.classList.add("warnFill");
}

function pushHistory(history, value) {
  if (typeof value !== "number" || !isFinite(value)) return;
  history.push(clampPercent(value));
  while (history.length > 12) history.shift();
}

function drawMetricGraph(id, history, color) {
  if (LOW_POWER_MODE) return;
  const canvas = getEl(id);
  if (!canvas || !canvas.getContext) return;

  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);

  context.strokeStyle = "rgba(255,255,255,0.10)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, height - 1);
  context.lineTo(width, height - 1);
  context.stroke();

  if (history.length < 2) return;

  context.strokeStyle = color;
  context.lineWidth = 2;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.beginPath();
  history.forEach(function (value, index) {
    const x = index * (width / (history.length - 1));
    const y = height - 2 - (value / 100) * (height - 4);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

function updateHealthStatus() {
  const cpu = systemSnapshot.cpu;
  const ram = systemSnapshot.ram;
  const storage = systemSnapshot.storage;
  const temperature = systemSnapshot.temperature;
  const values = [cpu, ram, storage].filter(function (value) {
    return typeof value === "number";
  });

  if (!values.length && typeof temperature !== "number") {
    setStatus("healthStatus", "TV'de ölçülür", "warn");
    setText("healthDetail", "Canlı sağlık verileri bekleniyor");
    setAppAlert("system", null);
    return;
  }

  const critical = cpu >= 90 || ram >= 90 || storage >= 95 || temperature >= 80;
  const warning = cpu >= 75 || ram >= 75 || storage >= 85 || temperature >= 65;

  if (critical) {
    setStatus("healthStatus", "Kritik", "bad");
    setAppAlert("system", "Sistem kaynakları kritik seviyede", true);
  } else if (warning) {
    setStatus("healthStatus", "Yoğun", "warn");
    setAppAlert("system", "Sistem kaynakları yoğun kullanılıyor", false);
  } else {
    setStatus("healthStatus", "İyi", "ok");
    setAppAlert("system", null);
  }

  const details = [];
  if (typeof cpu === "number") details.push("CPU %" + Math.round(cpu));
  if (typeof ram === "number") details.push("RAM %" + Math.round(ram));
  if (typeof storage === "number") details.push("Depo %" + Math.round(storage));
  if (typeof temperature === "number") details.push(Math.round(temperature) + "°C");
  setText("healthDetail", details.join(" • "));
}

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!isFinite(value) || value < 0) return "--";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  const digits = size >= 100 || unitIndex === 0 ? 0 : size >= 10 ? 1 : 2;
  return size.toFixed(digits) + " " + units[unitIndex];
}

function getSystemCapability(key) {
  try {
    if (window.tizen && tizen.systeminfo) {
      return tizen.systeminfo.getCapability(key);
    }
  } catch (e) {}

  return null;
}

function updateFooter(text) {
  setText("footerText", text);
}

function markUpdated() {
  const now = new Date();
  const locale = currentLanguage === "en" ? "en-US" : "tr-TR";
  setText("lastUpdated", "Son yenileme " + now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }));
}

function setAppAlert(type, text, critical) {
  appAlerts[type] = text ? { text: text, critical: critical === true } : null;
  renderAppAlert();
}

function renderAppAlert() {
  const banner = getEl("alertBanner");
  if (!banner) return;

  const alerts = [appAlerts.system, appAlerts.weather].filter(function (alert) {
    return !!alert;
  });

  if (!alerts.length) {
    banner.hidden = true;
    banner.classList.remove("criticalAlert");
    return;
  }

  alerts.sort(function (a, b) {
    return Number(b.critical) - Number(a.critical);
  });
  banner.hidden = false;
  banner.classList.toggle("criticalAlert", alerts[0].critical);
  setText("alertText", alerts.map(function (alert) { return alert.text; }).join(" • "));
}

function applyPixelShift() {
  const screen = document.querySelector(".screen");
  if (!screen) return;

  const positions = [
    [0, 0], [2, 0], [0, 2], [-2, 0], [0, -2],
    [2, 2], [-2, 2], [-2, -2], [2, -2]
  ];
  const position = positions[pixelShiftIndex % positions.length];
  pixelShiftIndex++;
  screen.style.transform = "translate(" + position[0] + "px," + position[1] + "px)";
}

function formatMediaTime(seconds) {
  const safeSeconds = isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return minutes + ":" + (remainder < 10 ? "0" : "") + remainder;
}

function updateMusicProgress() {
  const audio = getEl("bgMusic");
  const bar = getEl("musicProgressBar");
  if (!audio || !bar) return;

  const duration = isFinite(audio.duration) ? audio.duration : 0;
  const progress = duration > 0 ? (audio.currentTime / duration) * 100 : 0;
  const currentSecond = Math.floor(audio.currentTime || 0);
  const safeProgress = clampPercent(progress);
  if (
    lastMusicProgressSecond >= 0 &&
    currentSecond >= lastMusicProgressSecond &&
    currentSecond - lastMusicProgressSecond < 2
  ) return;

  lastMusicProgressSecond = currentSecond;
  lastMusicProgressPercent = safeProgress;
  bar.style.width = safeProgress + "%";
  setText("musicTime", formatMediaTime(currentSecond) + " / " + formatMediaTime(duration));
}

function setScreenSaverEnabled(enabled) {
  if (lastScreenSaverEnabled === enabled) return;
  if (!(window.webapis && webapis.appcommon && typeof webapis.appcommon.setScreenSaver === "function")) {
    return;
  }

  try {
    const states = webapis.appcommon.AppCommonScreenSaverState;
    const state = enabled ? states.SCREEN_SAVER_ON : states.SCREEN_SAVER_OFF;
    lastScreenSaverEnabled = enabled;
    webapis.appcommon.setScreenSaver(state, function () {}, function () {
      lastScreenSaverEnabled = null;
    });
  } catch (e) {
    lastScreenSaverEnabled = null;
  }
}

function getBackgroundEntries(kind) {
  return kind === "video" ? backgroundLibrary.videos : backgroundLibrary.images;
}

function clampBackgroundIndex(kind, value) {
  const entries = getBackgroundEntries(kind);
  const numeric = Number(value);
  if (!isFinite(numeric)) return 0;
  if (!backgroundScanComplete) return Math.max(0, Math.round(numeric));
  if (!entries.length) return 0;
  return Math.max(0, Math.min(entries.length - 1, Math.round(numeric)));
}

function getBackgroundModeLabel(mode) {
  if (currentLanguage === "en") return mode === "video" ? "Video" : "Photo";
  return mode === "video" ? "Video" : "Foto";
}

function getBackgroundEmptyLabel() {
  return currentLanguage === "en" ? "None" : "Yok";
}

function getBackgroundEntry(kind, index) {
  const entries = getBackgroundEntries(kind);
  if (!entries.length) return null;
  return entries[clampBackgroundIndex(kind, index)] || null;
}

function getBackgroundOptionValue(kind, index) {
  const entries = getBackgroundEntries(kind);
  const entry = getBackgroundEntry(kind, index);
  if (!entry) return getBackgroundEmptyLabel();
  if (entries.length <= 1) return entry.label;
  return entry.label + " (" + (clampBackgroundIndex(kind, index) + 1) + "/" + entries.length + ")";
}

function getSelectedBackgroundFile(kind, source) {
  const values = source || settings;
  const entry = getBackgroundEntry(
    kind,
    kind === "video" ? values.backgroundVideoIndex : values.backgroundImageIndex
  );
  return entry ? (entry.uri || entry.file) : kind === "video" ? null : MEDIA.backgroundImageFile;
}

function getBackgroundFileOrder(fileName) {
  const match = String(fileName || "").match(/^bg(\d*)\./i);
  if (!match) return 999;
  return match[1] ? Math.max(2, Number(match[1]) || 2) : 1;
}

function sortBackgroundEntries(entries) {
  return entries.sort(function (left, right) {
    return getBackgroundFileOrder(left.file) - getBackgroundFileOrder(right.file);
  });
}

function clonePackagedBackgroundMedia() {
  return {
    images: PACKAGED_BACKGROUND_MEDIA.images.map(function (entry) {
      return { file: entry.file, label: entry.label };
    }),
    videos: PACKAGED_BACKGROUND_MEDIA.videos.map(function (entry) {
      return { file: entry.file, label: entry.label };
    })
  };
}

function scanPackagedBackgroundMedia() {
  return new Promise(function (resolve) {
    if (!window.tizen || !tizen.filesystem || typeof tizen.filesystem.resolve !== "function") {
      resolve(null);
      return;
    }

    let completed = false;
    const timeout = setTimeout(function () { finish(null); }, 3500);

    function finish(result) {
      if (completed) return;
      completed = true;
      clearTimeout(timeout);
      resolve(result);
    }

    try {
      tizen.filesystem.resolve("wgt-package", function (directory) {
        directory.listFiles(function (files) {
          const images = [];
          const videos = [];

          files.forEach(function (file) {
            if (!file || file.isDirectory) return;
            const name = String(file.name || "");
            if (!/^bg\d*\./i.test(name)) return;

            let uri = name;
            try {
              if (typeof file.toURI === "function") uri = file.toURI();
            } catch (e) {}

            const entry = { file: name, label: name, uri: uri };
            if (/\.(?:jpg|jpeg|png|webp)$/i.test(name)) images.push(entry);
            if (/\.mp4$/i.test(name)) videos.push(entry);
          });

          finish({
            images: sortBackgroundEntries(images),
            videos: sortBackgroundEntries(videos)
          });
        }, function () { finish(null); });
      }, function () { finish(null); }, "r");
    } catch (e) {
      finish(null);
    }
  });
}

function canUseAvplayBackground() {
  return !!(
    window.tizen &&
    window.webapis &&
    webapis.avplay &&
    typeof webapis.avplay.open === "function"
  );
}

function getAppMediaUri(file) {
  if (!file) return "";
  if (/^[a-z]+:/i.test(file)) return file;

  const href = String(window.location.href || "");
  const cleanHref = href.split("#")[0].split("?")[0];
  const slashIndex = cleanHref.lastIndexOf("/");
  if (slashIndex < 0) return file;
  return cleanHref.slice(0, slashIndex + 1) + encodeURI(file);
}

function getAvplayDisplayRect() {
  const width = Math.max(window.innerWidth || 1280, 1);
  const height = Math.max(window.innerHeight || 720, 1);
  const widthRatio = 1920 / width;
  const heightRatio = 1080 / height;

  return {
    x: 0,
    y: 0,
    width: Math.round(width * widthRatio),
    height: Math.round(height * heightRatio)
  };
}

function setAvplayObjectVisible(visible) {
  const objectEl = getEl("bgAvplay");
  if (!objectEl) return;
  objectEl.hidden = !visible;
  objectEl.style.visibility = visible ? "visible" : "hidden";
}

function stopAvplayBackground() {
  if (!canUseAvplayBackground()) return;

  try {
    const state = webapis.avplay.getState();
    if (state === "PLAYING" || state === "PAUSED" || state === "READY") {
      webapis.avplay.stop();
    }
  } catch (e) {}

  try {
    webapis.avplay.close();
  } catch (e) {}

  avplayBackgroundFile = "";
  setAvplayObjectVisible(false);
}

function stopBackgroundVideo() {
  const video = getEl("bgVideo");
  if (!video) return;
  try {
    video.pause();
  } catch (e) {}
  video.onplaying = null;
  video.onerror = null;
  video.onended = null;
  video.hidden = true;
  video.removeAttribute("src");
  try {
    video.load();
  } catch (e) {}
}

function clearBackgroundRecovery(resetAttempts) {
  if (backgroundRecoveryTimer) clearTimeout(backgroundRecoveryTimer);
  backgroundRecoveryTimer = null;
  if (resetAttempts) backgroundRecoveryAttempt = 0;
}

function scheduleBackgroundRecovery(renderToken) {
  if (
    renderToken !== backgroundRenderToken ||
    document.hidden ||
    backgroundRecoveryTimer
  ) {
    return;
  }

  const delayIndex = Math.min(
    backgroundRecoveryAttempt,
    BACKGROUND_RECOVERY_DELAYS_MS.length - 1
  );
  const delay = BACKGROUND_RECOVERY_DELAYS_MS[delayIndex];
  backgroundRecoveryAttempt = Math.min(
    backgroundRecoveryAttempt + 1,
    BACKGROUND_RECOVERY_DELAYS_MS.length
  );

  backgroundRecoveryTimer = setTimeout(function () {
    backgroundRecoveryTimer = null;
    if (renderToken !== backgroundRenderToken || document.hidden) return;
    applyBackgroundSelection(settingsOpen && settingsDraft ? settingsDraft : settings, true);
  }, delay);
}

function markBackgroundVideoPlaying(renderToken) {
  if (renderToken !== backgroundRenderToken) return;
  clearBackgroundRecovery(true);
}

function isBackgroundVideoPlaying() {
  if (avplayBackgroundFile && canUseAvplayBackground()) {
    try {
      return webapis.avplay.getState() === "PLAYING";
    } catch (e) {}
  }

  const video = getEl("bgVideo");
  return !!(
    video &&
    !video.hidden &&
    !video.paused &&
    !video.ended &&
    video.readyState >= 2
  );
}

function ensureBackgroundPlayback() {
  if (document.hidden) return;

  const values = normalizeSettings(settingsOpen && settingsDraft ? settingsDraft : settings);
  if (values.backgroundMode !== "video" || !getSelectedBackgroundFile("video", values)) return;
  if (isBackgroundVideoPlaying()) {
    clearBackgroundRecovery(true);
    return;
  }
  if (Date.now() - backgroundStartAttemptAt < 15000) return;

  scheduleBackgroundRecovery(backgroundRenderToken);
}

function playAvplayBackground(videoFile, imageFile, renderToken, onFailure) {
  const image = getEl("bgImage");
  if (!canUseAvplayBackground() || !videoFile || !image) return false;

  const mediaUri = getAppMediaUri(videoFile);
  if (!mediaUri) return false;

  function showImage() {
    if (renderToken !== backgroundRenderToken) return;
    image.hidden = false;
    stopAvplayBackground();
    if (typeof onFailure === "function") onFailure();
  }

  function showVideo() {
    if (renderToken !== backgroundRenderToken) return;
    image.hidden = true;
    setAvplayObjectVisible(true);
    markBackgroundVideoPlaying(renderToken);
  }

  if (imageFile) image.src = imageFile;
  image.hidden = false;
  stopBackgroundVideo();
  stopAvplayBackground();

  try {
    webapis.avplay.open(mediaUri);

    webapis.avplay.setListener({
      onbufferingcomplete: function () {},
      onerror: function () {
        showImage();
      },
      onstreamcompleted: function () {
        try {
          webapis.avplay.seekTo(0, function () {
            try {
              webapis.avplay.play();
            } catch (e) {
              showImage();
            }
          }, function () {
            showImage();
          });
        } catch (e) {
          showImage();
        }
      }
    });

    try {
      webapis.avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_FULL_SCREEN");
    } catch (e) {}

    const rect = getAvplayDisplayRect();
    webapis.avplay.setDisplayRect(rect.x, rect.y, rect.width, rect.height);
    avplayBackgroundFile = mediaUri;

    webapis.avplay.prepareAsync(function () {
      try {
        webapis.avplay.play();
        showVideo();
      } catch (e) {
        showImage();
      }
    }, function () {
      showImage();
    });

    return true;
  } catch (e) {
    showImage();
    return true;
  }
}

function applyBackgroundSelection(source, force) {
  const image = getEl("bgImage");
  const video = getEl("bgVideo");
  if (!image || !video) return;

  const values = normalizeSettings(source || settings);
  const imageFile = getSelectedBackgroundFile("image", values) || MEDIA.backgroundImageFile;
  const videoFile = getSelectedBackgroundFile("video", values);
  const signature = values.backgroundMode + "|" + imageFile + "|" + (videoFile || "");
  const selectionChanged = signature !== lastAppliedBackgroundSignature;

  if (!force && signature === lastAppliedBackgroundSignature) return;
  if (selectionChanged) clearBackgroundRecovery(true);
  lastAppliedBackgroundSignature = signature;

  const renderToken = ++backgroundRenderToken;
  backgroundStartAttemptAt = Date.now();

  image.src = imageFile;
  image.hidden = false;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  if (values.backgroundMode !== "video" || !videoFile) {
    clearBackgroundRecovery(true);
    stopAvplayBackground();
    stopBackgroundVideo();
    return;
  }

  function showVideo() {
    if (renderToken !== backgroundRenderToken) return;
    video.hidden = false;
    image.hidden = true;
    markBackgroundVideoPlaying(renderToken);
  }

  function showImage() {
    if (renderToken !== backgroundRenderToken) return;
    video.hidden = true;
    image.hidden = false;
    scheduleBackgroundRecovery(renderToken);
  }

  function playHtmlVideoFallback() {
    if (renderToken !== backgroundRenderToken) return;
    video.hidden = true;
    video.onplaying = showVideo;
    video.onerror = showImage;
    video.onended = function () {
      if (renderToken !== backgroundRenderToken) return;
      try {
        video.currentTime = 0;
        const replayAttempt = video.play();
        if (replayAttempt && typeof replayAttempt.catch === "function") {
          replayAttempt.catch(showImage);
        }
      } catch (e) {
        showImage();
      }
    };
    video.src = videoFile;
    video.load();

    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(showImage);
    }
  }

  if (playAvplayBackground(videoFile, imageFile, renderToken, playHtmlVideoFallback)) return;
  playHtmlVideoFallback();
}

async function scanBackgroundMedia() {
  if (backgroundScanComplete) return Promise.resolve();
  if (backgroundScanPromise) return backgroundScanPromise;

  backgroundScanPromise = (async function () {
    const packagedMedia = await scanPackagedBackgroundMedia() || clonePackagedBackgroundMedia();
    const images = packagedMedia.images;
    const videos = packagedMedia.videos;

    backgroundLibrary.images = images.length
      ? images
      : [{ file: MEDIA.backgroundImageFile, label: MEDIA.backgroundImageFile }];
    backgroundLibrary.videos = videos;
    backgroundScanComplete = true;

    settings = normalizeSettings(settings);
    if (settingsDraft) settingsDraft = normalizeSettings(settingsDraft);

    applyDashboardSettings(settingsDraft || settings);
    applyBackgroundSelection(settingsDraft || settings);
    if (settingsOpen) renderSettingsPanel();
  })().finally(function () {
    backgroundScanPromise = null;
  });

  return backgroundScanPromise;
}

function initBackground() {
  const image = getEl("bgImage");
  const video = getEl("bgVideo");
  if (!image || !video) return;

  setAvplayObjectVisible(false);
  applyBackgroundSelection(settings);
  scanBackgroundMedia();
}

function updateClock() {
  const now = new Date();
  const locale = currentLanguage === "en" ? "en-US" : "tr-TR";

  setText("clock", now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit"
  }));

  setText("date", now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }));

  applyAutoTheme(lastWeatherCode);
}

function applyAutoTheme(weatherCode) {
  const hour = new Date().getHours();
  const body = document.body;
  const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
  const snowCodes = [71, 73, 75];
  const night = hour < 7 || hour >= 20;
  let weatherClass = "";

  if (weatherCode === 0 || weatherCode === 1) weatherClass = "weather-clear";
  else if (rainCodes.indexOf(Number(weatherCode)) >= 0) weatherClass = "weather-rain";
  else if (snowCodes.indexOf(Number(weatherCode)) >= 0) weatherClass = "weather-snow";
  else if (weatherCode !== null) weatherClass = "weather-cloudy";

  const themeKey = String(night) + ":" + weatherClass;
  if (themeKey === lastThemeKey) return;
  lastThemeKey = themeKey;

  body.classList.toggle("time-night", night);
  body.classList.remove("weather-clear", "weather-rain", "weather-snow", "weather-cloudy");
  if (weatherClass) body.classList.add(weatherClass);
}

function callProductInfo(methodName) {
  try {
    if (
      window.webapis &&
      webapis.productinfo &&
      typeof webapis.productinfo[methodName] === "function"
    ) {
      return webapis.productinfo[methodName]();
    }
  } catch (e) {}

  return null;
}

function getTizenVersion() {
  return getSystemCapability("http://tizen.org/feature/platform.version");
}

function updateTvInfo() {
  const model = callProductInfo("getModel");
  const modelCode = callProductInfo("getModelCode");
  const firmware = callProductInfo("getFirmware");
  const productApiVersion = callProductInfo("getVersion");
  const tizenVersion = getTizenVersion();

  if (model) {
    setStatus("model", model, "ok");
    setText("modelCode", modelCode ? "Model kodu: " + modelCode : "Model kodu bulunamadı");
  } else {
    setStatus("model", "Samsung TV API yok", "warn");
    setText("modelCode", "Gerçek TV veya emülatörde görüntülenir");
  }

  if (tizenVersion) {
    setStatus("platform", "Tizen " + tizenVersion, "ok");
  } else {
    setStatus("platform", "Tarayıcı modu", "warn");
  }

  const details = [];
  if (firmware) details.push("Firmware: " + firmware);
  if (productApiVersion) details.push("Product API: " + productApiVersion);
  setText("firmware", details.length ? details.join(" • ") : "Sistem bilgisi TV'de görünür");

  updateSystemDetails();
  updatePanelInfo();
}

function updateSystemDetails() {
  const architecture = getSystemCapability("http://tizen.org/feature/platform.core.cpu.arch");
  const architectureText = architecture ? "Mimari: " + architecture : "Mimari bilinmiyor";

  if (!(window.tizen && tizen.systeminfo)) {
    setText("systemExtra", architectureText + " • Build TV'de görünür");
    return;
  }

  try {
    tizen.systeminfo.getPropertyValue("BUILD", function (build) {
      const buildVersion = build && build.buildVersion ? build.buildVersion : "Bilinmiyor";
      setText("systemExtra", architectureText + " • Build: " + buildVersion);
    }, function () {
      setText("systemExtra", architectureText + " • Build okunamadı");
    });
  } catch (e) {
    setText("systemExtra", architectureText + " • Build desteklenmiyor");
  }
}

function updatePanelInfo() {
  const is8K = callProductInfo("is8KPanelSupported");
  const isUhd = callProductInfo("isUdPanelSupported");
  const isOled = callProductInfo("isOledPanelSupported");

  if (is8K === true) {
    setStatus("panel", isOled === true ? "8K OLED" : "8K UHD", "ok");
  } else if (isUhd === true) {
    setStatus("panel", isOled === true ? "4K OLED" : "4K UHD", "ok");
  } else if (window.webapis && webapis.productinfo) {
    setStatus("panel", isOled === true ? "OLED" : "FHD / HD", "ok");
  } else {
    setStatus("panel", "Bilinmiyor", "warn");
  }

  updateDisplayResolution();
}

function updateDisplayResolution() {
  const fallbackWidth = window.innerWidth || (window.screen && window.screen.width) || 1920;
  const fallbackHeight = window.innerHeight || (window.screen && window.screen.height) || 1080;
  let panelResolved = false;

  setText("resolution", "Uygulama alanı: " + fallbackWidth + " × " + fallbackHeight);
  setText("brightness", "Parlaklık TV'de görünür");

  try {
    if (window.tizen && tizen.systeminfo) {
      tizen.systeminfo.getPropertyValue("DISPLAY", function (display) {
        if (!panelResolved) {
          setText(
            "resolution",
            "Ekran: " + display.resolutionWidth + " × " + display.resolutionHeight
          );
        }

        if (typeof display.brightness === "number") {
          setText("brightness", "Parlaklık: %" + clampPercent(display.brightness * 100));
        } else {
          setText("brightness", "Parlaklık desteklenmiyor");
        }
      }, function () {
        setText("brightness", "Parlaklık okunamadı");
      });
    }
  } catch (e) {
    setText("brightness", "Parlaklık desteklenmiyor");
  }

  try {
    if (window.tizen && tizen.systeminfo) {
      tizen.systeminfo.getPropertyValue("PANEL", function (panel) {
        panelResolved = true;
        setText("resolution", "Panel: " + panel.panelWidth + " × " + panel.panelHeight);
      }, function () {});
      return;
    }
  } catch (e) {}
}

function getSamsungTvIp() {
  try {
    if (window.webapis && webapis.network && webapis.network.getIp) {
      return webapis.network.getIp();
    }
  } catch (e) {}

  return null;
}

function getSamsungNetworkState() {
  try {
    if (!window.webapis || !webapis.network) return null;

    const type = webapis.network.getActiveConnectionType();
    const names = {
      0: "Bağlantı yok",
      1: "Wi‑Fi",
      2: "Hücresel",
      3: "Ethernet"
    };
    let gateway = type !== 0;

    if (typeof webapis.network.isConnectedToGateway === "function") {
      gateway = webapis.network.isConnectedToGateway();
    }

    return {
      connected: type !== 0 && gateway,
      typeName: names[type] || "Ağ"
    };
  } catch (e) {
    return null;
  }
}

function updateNetworkInfo() {
  const samsungState = getSamsungNetworkState();
  const browserOnline = navigator.onLine;
  const connected = samsungState ? samsungState.connected : browserOnline;
  const typeName = samsungState ? samsungState.typeName : "Çevrimiçi";
  const ip = getSamsungTvIp();

  setStatus(
    "network",
    connected ? typeName : "Bağlantı yok",
    connected ? "ok" : "bad"
  );

  if (!connected) {
    setText("networkDetail", "Ağ geçidine bağlantı kurulamadı");
  } else if (Date.now() - lastWeatherSuccess < 15 * 60 * 1000) {
    setText("networkDetail", "İnternet erişimi doğrulandı");
  } else {
    setText(
      "networkDetail",
      samsungState ? "Ağ geçidine bağlı" : "Tarayıcı ağ durumu"
    );
  }

  if (ip) {
    setStatus("ip", ip, "ok");
  } else if (window.webapis) {
    setStatus("ip", "IP okunamadı", "warn");
  } else {
    setStatus("ip", "TV API yok", "warn");
  }

  updateWifiInfo(samsungState);
}

function updateWifiInfo(networkState) {
  if (networkState && networkState.typeName === "Ethernet") {
    setText("wifiSignal", "Bağlantı türü: Ethernet");
    return;
  }

  if (!(window.tizen && tizen.systeminfo)) {
    setText("wifiSignal", "Wi‑Fi sinyali gerçek TV'de görünür");
    return;
  }

  try {
    tizen.systeminfo.getPropertyValue("WIFI_NETWORK", function (wifi) {
      const signal = typeof wifi.signalStrength === "number"
        ? "%" + clampPercent(wifi.signalStrength * 100)
        : "Bilinmiyor";
      const security = wifi.securityMode && wifi.securityMode !== "NONE"
        ? " • " + String(wifi.securityMode).replace(/_/g, " ")
        : "";
      setText("wifiSignal", "Wi‑Fi sinyali: " + signal + security);
    }, function () {
      setText("wifiSignal", "Wi‑Fi bilgisi kullanılamıyor");
    });
  } catch (e) {
    setText("wifiSignal", "Wi‑Fi bilgisi desteklenmiyor");
  }
}

function setSpeedTestProgress(percent) {
  const bar = getEl("speedTestBar");
  if (bar) bar.style.width = clampPercent(percent) + "%";
}

async function runInternetTest() {
  if (speedTestRunning) return;

  if (!navigator.onLine) {
    setStatus("speedTestStatus", "Bağlantı yok", "bad");
    setSpeedTestProgress(0);
    return;
  }

  speedTestRunning = true;
  setStatus("speedTestStatus", "Gecikme ölçülüyor...", "warn");
  setSpeedTestProgress(15);
  updateFooter("İnternet testi çalışıyor");

  try {
    const latencyValues = [];
    for (let index = 0; index < 3; index++) {
      const latencyStart = Date.now();
      const latencyResponse = await fetchWithTimeout(
        SPEED_TEST.downloadUrl + "?bytes=0&_=" + Date.now() + index,
        SPEED_TEST.timeoutMs
      );
      if (!latencyResponse.ok) throw new Error("Latency HTTP " + latencyResponse.status);
      await latencyResponse.arrayBuffer();
      latencyValues.push(Date.now() - latencyStart);
      setSpeedTestProgress(20 + index * 10);
    }

    latencyValues.sort(function (a, b) { return a - b; });
    const latency = latencyValues[1];
    setStatus("speedTestStatus", "İndirme ölçülüyor...", "warn");
    setSpeedTestProgress(55);

    const downloadStart = Date.now();
    const downloadResponse = await fetchWithTimeout(
      SPEED_TEST.downloadUrl + "?bytes=" + SPEED_TEST.downloadBytes + "&_=" + Date.now(),
      SPEED_TEST.timeoutMs
    );
    if (!downloadResponse.ok) throw new Error("Download HTTP " + downloadResponse.status);
    const buffer = await downloadResponse.arrayBuffer();
    const elapsedSeconds = Math.max(0.001, (Date.now() - downloadStart) / 1000);
    const megabitsPerSecond = (buffer.byteLength * 8) / elapsedSeconds / 1000000;
    const speedText = megabitsPerSecond.toFixed(1) + " Mbps • " + latency + " ms";
    const statusClass = megabitsPerSecond >= 25 ? "ok" : megabitsPerSecond >= 5 ? "warn" : "bad";

    setStatus("speedTestStatus", speedText, statusClass);
    setSpeedTestProgress(100);
    updateFooter("İnternet testi tamamlandı");
  } catch (e) {
    setStatus("speedTestStatus", "Test başarısız", "bad");
    setSpeedTestProgress(0);
    updateFooter("İnternet testi tamamlanamadı");
  } finally {
    speedTestRunning = false;
  }
}

function initNetworkTest() {
  const card = document.querySelector(".networkCard");
  if (card) card.addEventListener("click", runInternetTest);
}

function updateResourceInfo() {
  if (!(window.tizen && tizen.systeminfo)) {
    setStatus("cpuValue", "--%", "warn");
    setText("ramValue", "TV'de görünür");
    setText("storageValue", "TV'de görünür");
    setText("usbStorage", "USB bilgisi gerçek TV'de görünür");
    setMetricBar("cpuBar", 0);
    setMetricBar("ramBar", 0);
    setMetricBar("storageBar", 0);
    updateHealthStatus();
    return;
  }

  try {
    tizen.systeminfo.getPropertyValue("CPU", function (cpu) {
      const load = clampPercent(cpu.load * 100);
      systemSnapshot.cpu = load;
      pushHistory(cpuHistory, load);
      drawMetricGraph("cpuGraph", cpuHistory, "#8ed9ff");
      setStatus("cpuValue", load + "%", load >= 90 ? "bad" : load >= 75 ? "warn" : "ok");
      setMetricBar("cpuBar", load);
      updateHealthStatus();
    }, function () {
      setStatus("cpuValue", "Okunamadı", "warn");
    });
  } catch (e) {
    setStatus("cpuValue", "Desteklenmiyor", "warn");
  }

  try {
    const totalMemory = tizen.systeminfo.getTotalMemory();
    const availableMemory = tizen.systeminfo.getAvailableMemory();
    const usedMemoryPercent = totalMemory > 0
      ? ((totalMemory - availableMemory) / totalMemory) * 100
      : 0;
    systemSnapshot.ram = clampPercent(usedMemoryPercent);
    pushHistory(ramHistory, usedMemoryPercent);
    drawMetricGraph("ramGraph", ramHistory, "#b9ffcf");
    setText("ramValue", "Boş " + formatBytes(availableMemory) + " / " + formatBytes(totalMemory));
    setMetricBar("ramBar", usedMemoryPercent);
    updateHealthStatus();
  } catch (e) {
    setText("ramValue", "Desteklenmiyor");
    setMetricBar("ramBar", 0);
  }

  if (Date.now() - lastStorageRefresh < PERFORMANCE.storageIntervalMs) return;
  lastStorageRefresh = Date.now();

  try {
    tizen.systeminfo.getPropertyValue("STORAGE", function (storage) {
      const units = storage && storage.units ? storage.units : [];
      let internalCapacity = 0;
      let internalAvailable = 0;
      let removableCapacity = 0;
      let removableAvailable = 0;

      units.forEach(function (unit) {
        const type = String(unit.type || "").toUpperCase();
        const removable = unit.isRemovable === true ||
          type === "USB_DEVICE" || type === "USB_HOST" || type === "MMC";

        if (removable) {
          removableCapacity += Number(unit.capacity) || 0;
          removableAvailable += Number(unit.availableCapacity) || 0;
        } else {
          internalCapacity += Number(unit.capacity) || 0;
          internalAvailable += Number(unit.availableCapacity) || 0;
        }
      });

      if (internalCapacity > 0) {
        const internalUsed = ((internalCapacity - internalAvailable) / internalCapacity) * 100;
        systemSnapshot.storage = clampPercent(internalUsed);
        setText(
          "storageValue",
          "Boş " + formatBytes(internalAvailable) + " / " + formatBytes(internalCapacity)
        );
        setMetricBar("storageBar", internalUsed);
        updateHealthStatus();
      } else {
        setText("storageValue", "Dahili alan okunamadı");
        setMetricBar("storageBar", 0);
      }

      if (removableCapacity > 0) {
        setText(
          "usbStorage",
          "USB: " + formatBytes(removableAvailable) + " boş / " + formatBytes(removableCapacity)
        );
      } else {
        setText("usbStorage", "USB depolama bağlı değil");
      }
    }, function () {
      setText("storageValue", "Depolama okunamadı");
      setText("usbStorage", "USB bilgisi alınamadı");
    });
  } catch (e) {
    setText("storageValue", "Desteklenmiyor");
    setText("usbStorage", "USB desteklenmiyor");
    setMetricBar("storageBar", 0);
  }
}

function sourceLabel(source) {
  if (!source) return "Bilinmiyor";

  const names = {
    TV: "TV",
    AV: "AV",
    SVIDEO: "S‑Video",
    COMP: "Komponent",
    PC: "PC",
    HDMI: "HDMI",
    SCART: "SCART",
    DVI: "DVI",
    MEDIA: "Medya / Uygulama"
  };
  const type = String(source.type || "").toUpperCase();
  const number = Number(source.number) > 0 ? " " + source.number : "";
  return (names[type] || type || "Kaynak") + number;
}

function renderSourceInfo(source, connectedSources) {
  const connected = connectedSources || [];
  setStatus("activeSource", sourceLabel(source), "ok");

  if (source && source.signal === false) {
    setText("sourceDetail", "Giriş bağlı, sinyal yok");
  } else if (connected.length > 1) {
    setText("sourceDetail", "Bağlı: " + connected.map(sourceLabel).join(", "));
  } else if (source && source.signal === true) {
    setText("sourceDetail", "Giriş sinyali aktif");
  } else {
    setText("sourceDetail", "Geçerli TV kaynağı");
  }
}

function updateConnectedVideoSources() {
  try {
    tizen.systeminfo.getPropertyValue("VIDEOSOURCE", function (videoSources) {
      const connected = videoSources && videoSources.connected
        ? videoSources.connected
        : [];
      renderSourceInfo(connected.length ? connected[0] : { type: "TV", number: 0 }, connected);
    }, function () {
      setStatus("activeSource", "Desteklenmiyor", "warn");
      setText("sourceDetail", "Kaynak bilgisi bu modelde yok");
    });
  } catch (e) {
    setStatus("activeSource", "Desteklenmiyor", "warn");
    setText("sourceDetail", "Kaynak bilgisi bu modelde yok");
  }
}

function updateSourceInfo() {
  if (!(window.tizen && tizen.systeminfo)) {
    setStatus("activeSource", "TV API yok", "warn");
    setText("sourceDetail", "Gerçek TV'de HDMI / TV kaynağı görünür");
    return;
  }

  try {
    tizen.systeminfo.getPropertyValue("SOURCE_INFO", function (source) {
      renderSourceInfo(source, source ? [source] : []);
    }, updateConnectedVideoSources);
  } catch (e) {
    updateConnectedVideoSources();
  }
}

function updateHardwareInfo() {
  const line = getEl("hardwareInfoLine");
  const temperatureEl = getEl("boardTemperature");
  const batteryEl = getEl("remoteBattery");
  if (!line || !temperatureEl || !batteryEl) return;

  let temperature = null;
  let battery = null;

  try {
    if (window.webapis && webapis.tvinfo && typeof webapis.tvinfo.getTvInfoValue === "function") {
      const temperatureValue = Number(webapis.tvinfo.getTvInfoValue("BOARD_TEMPERATURE"));
      if (isFinite(temperatureValue) && temperatureValue > 0) temperature = temperatureValue;
    }
  } catch (e) {}

  try {
    if (window.webapis && webapis.tvinfo && typeof webapis.tvinfo.getTvInfoValue === "function") {
      const batteryValue = Number(webapis.tvinfo.getTvInfoValue("SMART_RC_BATTERY"));
      if (isFinite(batteryValue) && batteryValue >= 0 && batteryValue <= 100) {
        battery = Math.round(batteryValue);
      }
    }
  } catch (e) {}

  systemSnapshot.temperature = temperature;
  updateHealthStatus();

  if (temperature === null && battery === null) {
    line.hidden = true;
  } else {
    line.hidden = false;
    temperatureEl.hidden = temperature === null;
    batteryEl.hidden = battery === null;
    if (temperature !== null) temperatureEl.textContent = "Sıcaklık: " + Math.round(temperature) + "°C";
    if (battery !== null) batteryEl.textContent = "Kumanda: %" + battery;
  }

  updateAvInfo();
}

function updateAvInfo() {
  if (!(window.webapis && webapis.avinfo)) {
    setText("displayFeatures", "HDR / enerji bilgisi gerçek TV'de görünür");
    return;
  }

  const details = [];

  try {
    if (typeof webapis.avinfo.isHdrTvSupport === "function") {
      details.push(webapis.avinfo.isHdrTvSupport() ? "HDR destekli" : "HDR yok");
    }
  } catch (e) {}

  try {
    if (typeof webapis.avinfo.getEnergySaving === "function") {
      const energyNames = { OFF: "kapalı", LOW: "düşük", MEDIUM: "orta", HIGH: "yüksek" };
      const energy = String(webapis.avinfo.getEnergySaving());
      details.push("Enerji: " + (energyNames[energy] || energy));
    }
  } catch (e) {}

  try {
    if (typeof webapis.avinfo.getEcoSensor === "function") {
      const eco = String(webapis.avinfo.getEcoSensor());
      details.push("Eko sensör: " + (eco === "ON" ? "açık" : eco === "OFF" ? "kapalı" : eco));
    }
  } catch (e) {}

  setText(
    "displayFeatures",
    details.length ? details.join(" • ") : "HDR / enerji bilgisi desteklenmiyor"
  );
}

function updateVolumeInfo() {
  try {
    if (
      window.tizen &&
      tizen.tvaudiocontrol &&
      tizen.tvaudiocontrol.getVolume
    ) {
      const volume = tizen.tvaudiocontrol.getVolume();
      const muted = tizen.tvaudiocontrol.isMute();

      setStatus("volume", volume + "%", "ok");
      setStatus(
        "mute",
        (muted ? "Sessiz mod açık • " : "Sessiz mod kapalı • ") +
          (muted ? "OK: sesi aç" : "OK: sesi kapat"),
        muted ? "warn" : "ok"
      );
      return;
    }

    setStatus("volume", "TV API yok", "warn");
    setStatus("mute", "Ses bilgisi gerçek TV'de görünür", "warn");
  } catch (e) {
    setStatus("volume", "Okunamadı", "bad");
    setStatus("mute", "Ses bilgisi alınamadı", "bad");
  }
}

function canControlTvAudio() {
  return !!(
    window.tizen &&
    tizen.tvaudiocontrol &&
    typeof tizen.tvaudiocontrol.getVolume === "function"
  );
}

function toggleTvMute() {
  try {
    if (
      window.tizen &&
      tizen.tvaudiocontrol &&
      typeof tizen.tvaudiocontrol.isMute === "function" &&
      typeof tizen.tvaudiocontrol.setMute === "function"
    ) {
      const nextMuted = !tizen.tvaudiocontrol.isMute();
      tizen.tvaudiocontrol.setMute(nextMuted);
      updateVolumeInfo();
      updateFooter(nextMuted ? "TV sesi kapatıldı" : "TV sesi açıldı");
      return true;
    }
  } catch (e) {}

  setStatus("mute", "Ses kontrol edilemedi", "bad");
  updateFooter("Ses kontrol edilemedi");
  return false;
}

function adjustTvVolume(direction) {
  try {
    if (!canControlTvAudio()) throw new Error("TV audio API unavailable");

    if (
      typeof tizen.tvaudiocontrol.isMute === "function" &&
      typeof tizen.tvaudiocontrol.setMute === "function" &&
      tizen.tvaudiocontrol.isMute()
    ) {
      tizen.tvaudiocontrol.setMute(false);
    }

    if (direction > 0 && typeof tizen.tvaudiocontrol.setVolumeUp === "function") {
      tizen.tvaudiocontrol.setVolumeUp();
    } else if (direction < 0 && typeof tizen.tvaudiocontrol.setVolumeDown === "function") {
      tizen.tvaudiocontrol.setVolumeDown();
    } else if (typeof tizen.tvaudiocontrol.setVolume === "function") {
      const current = Number(tizen.tvaudiocontrol.getVolume()) || 0;
      tizen.tvaudiocontrol.setVolume(Math.max(0, Math.min(100, current + direction)));
    } else {
      throw new Error("TV volume API unavailable");
    }

    updateVolumeInfo();
    updateFooter(direction > 0 ? "TV sesi artÄ±rÄ±ldÄ±" : "TV sesi azaltÄ±ldÄ±");
    setTimeout(updateVolumeInfo, 300);
    setTimeout(updateVolumeInfo, 900);
    return true;
  } catch (e) {
    setStatus("mute", "Ses kontrol edilemedi", "bad");
    updateFooter("Ses kontrol edilemedi");
    return false;
  }
}

function initSoundControl() {
  const card = document.querySelector(".soundCard");
  if (card) card.addEventListener("click", toggleTvMute);
}

function weatherCodeToText(code) {
  const trMap = {
    0: "Açık",
    1: "Az bulutlu",
    2: "Parçalı bulutlu",
    3: "Kapalı",
    45: "Sisli",
    48: "Kırağılı sis",
    51: "Hafif çiseleme",
    53: "Çiseleme",
    55: "Yoğun çiseleme",
    61: "Hafif yağmur",
    63: "Yağmurlu",
    65: "Şiddetli yağmur",
    71: "Hafif kar",
    73: "Karlı",
    75: "Yoğun kar",
    80: "Hafif sağanak",
    81: "Sağanak",
    82: "Şiddetli sağanak",
    95: "Gök gürültülü",
    96: "Fırtına ve dolu",
    99: "Şiddetli fırtına"
  };

  const enMap = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rainy",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snowy",
    75: "Heavy snow",
    80: "Light showers",
    81: "Showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Storm and hail",
    99: "Severe storm"
  };

  return currentLanguage === "en"
    ? (enMap[code] || "Weather")
    : (trMap[code] || "Hava durumu");
}

function updateWeatherAlert(code) {
  const value = Number(code);
  const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
  const snowCodes = [71, 73, 75];

  if ([95, 96, 99].indexOf(value) >= 0) {
    setAppAlert("weather", "Fırtına ve gök gürültüsü uyarısı", true);
  } else if ([65, 82].indexOf(value) >= 0) {
    setAppAlert("weather", "Şiddetli yağmur uyarısı", false);
  } else if (rainCodes.indexOf(value) >= 0) {
    setAppAlert("weather", "Yağmur bekleniyor / devam ediyor", false);
  } else if (snowCodes.indexOf(value) >= 0) {
    setAppAlert("weather", "Kar yağışı uyarısı", false);
  } else {
    setAppAlert("weather", null);
  }
}

function fetchWithTimeout(url, timeoutMs) {
  return new Promise(function (resolve, reject) {
    let finished = false;
    const timeoutId = setTimeout(function () {
      if (finished) return;
      finished = true;
      reject(new Error("Request timed out"));
    }, timeoutMs);

    fetch(url).then(function (response) {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutId);
      resolve(response);
    }).catch(function (error) {
      if (finished) return;
      finished = true;
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

// With timeformat=unixtime Open-Meteo returns unix timestamps, so there is no
  // timezone ambiguity. offsetSeconds supplies the location's local time; the
  // TV's own clock may sit in a different zone.
function shortTime(value, offsetSeconds) {
  if (value === undefined || value === null || value === "") return "--:--";

  const number = Number(value);
  if (!isFinite(number)) return "--:--";

  // unix timestamp in seconds
  if (number > 1000000000) {
    const localMs = (number + (Number(offsetSeconds) || 0)) * 1000;
    const date = new Date(localMs);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return hours + ":" + minutes;
  }

  // Fallback for an ISO date string.
  const match = String(value).match(/T(\d{2}:\d{2})/);
  return match ? match[1] : "--:--";
}

function updateForecast(data) {
  const hourly = data && data.hourly;
  const times = hourly && hourly.time ? hourly.time : [];
  const temperatures = hourly && hourly.temperature_2m ? hourly.temperature_2m : [];
  const codes = hourly && hourly.weather_code ? hourly.weather_code : [];
  const offsetSeconds = data && data.utc_offset_seconds ? data.utc_offset_seconds : 0;
  const now = Date.now() / 1000;
  let startIndex = 0;

  // Compare unix timestamps directly, so the result does not depend on the
  // timezone. Lands on the first record whose hour has not passed yet.
  while (
    startIndex < times.length &&
    Number(times[startIndex]) <= now
  ) {
    startIndex++;
  }

  [0, 1, 2].forEach(function (offset) {
    const index = startIndex + offset;
    const id = "forecast" + offset;
    if (times[index] && typeof temperatures[index] === "number") {
      setText(
        id,
        shortTime(times[index], offsetSeconds) + "  " + Math.round(temperatures[index]) + "°  " +
          weatherCodeToText(codes[index])
      );
    } else {
      setText(id, "Tahmin yok");
    }
  });

  const daily = data && data.daily;
  if (daily && daily.sunrise && daily.sunrise[0] && daily.sunset && daily.sunset[0]) {
    setText(
      "sunInfo",
      "Gün doğumu " + shortTime(daily.sunrise[0], offsetSeconds) +
        " • Gün batımı " + shortTime(daily.sunset[0], offsetSeconds)
    );
  } else {
    setText("sunInfo", "Gün doğumu / batımı kullanılamıyor");
  }
}

async function updateWeather() {
  if (weatherUpdating || document.hidden) return;
  if (
    WEATHER.latitude === null || WEATHER.longitude === null ||
    !isFinite(Number(WEATHER.latitude)) || !isFinite(Number(WEATHER.longitude))
  ) {
    setText("weatherTemp", "--°");
    setText("weatherText", "Konum bekleniyor...");
    return;
  }
  weatherUpdating = true;
  setText("city", WEATHER.city);

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + encodeURIComponent(WEATHER.latitude) +
    "&longitude=" + encodeURIComponent(WEATHER.longitude) +
    "&current=temperature_2m,weather_code,wind_speed_10m" +
    "&hourly=temperature_2m,weather_code" +
    "&daily=sunrise,sunset" +
    "&forecast_days=2&timezone=auto&timeformat=unixtime";

  try {
    const response = await fetchWithTimeout(url, WEATHER.timeoutMs);
    if (!response.ok) throw new Error("Weather HTTP error: " + response.status);

    const data = await response.json();
    if (!data || (!data.current && !data.current_weather)) throw new Error("Weather data missing");

    const weather = data.current || data.current_weather;
    const temperature = weather.temperature_2m !== undefined
      ? weather.temperature_2m
      : weather.temperature;
    const weatherCode = weather.weather_code !== undefined
      ? weather.weather_code
      : weather.weathercode;
    const windSpeed = weather.wind_speed_10m !== undefined
      ? weather.wind_speed_10m
      : weather.windspeed;
    lastWeatherSuccess = Date.now();
    lastWeatherCode = Number(weatherCode);
    updateWeatherAlert(lastWeatherCode);

    setText("weatherTemp", Math.round(temperature) + "°");
    setText(
      "weatherText",
      weatherCodeToText(weatherCode) +
        " • Rüzgar " + Math.round(windSpeed) + " km/s"
    );
    updateForecast(data);
    applyAutoTheme(lastWeatherCode);
    markUpdated();
    updateNetworkInfo();
  } catch (e) {
    setText("weatherTemp", "--°");
    setText(
      "weatherText",
      navigator.onLine ? "Hava durumu servisine ulaşılamadı" : "İnternet bağlantısı yok"
    );
    setText("forecast0", "Tahmin yok");
    setText("forecast1", "Tahmin yok");
    setText("forecast2", "Tahmin yok");
    setText("sunInfo", "Hava verisi kullanılamıyor");
    setAppAlert("weather", null);
  } finally {
    weatherUpdating = false;
  }
}

function isValidIpLocation(value) {
  if (!value || typeof value.name !== "string" || !value.name.trim()) return false;
  const latitude = Number(value.latitude);
  const longitude = Number(value.longitude);
  return isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

// Drops location cache entries left over from an earlier version. Location is
// now IP-only, but a manually picked city used the same key pattern, so it
// is removed here too.
function clearStoredLocationData() {
  try {
    for (let index = localStorage.length - 1; index >= 0; index--) {
      const key = localStorage.key(index);
      if (!key) continue;
      if (/location|city/i.test(key)) localStorage.removeItem(key);
    }
  } catch (e) {}
}

function parseIpLocation(data) {
  if (!data || data.success === false || data.error === true) return null;
  const latitude = Number(data.latitude !== undefined ? data.latitude : data.lat);
  const longitude = Number(data.longitude !== undefined ? data.longitude : data.lon);
  const name = data.city || data.locality || data.region || data.region_name ||
    data.country_name || data.country;
  if (!name) return null;

  const location = {
    name: String(name),
    latitude: latitude,
    longitude: longitude
  };
  return isValidIpLocation(location) ? location : null;
}

async function getIpLocation() {
  for (let index = 0; index < IP_LOCATION.providers.length; index++) {
    try {
      const response = await fetchWithTimeout(IP_LOCATION.providers[index], IP_LOCATION.timeoutMs);
      if (!response.ok) continue;
      const location = parseIpLocation(await response.json());
      if (location) return location;
    } catch (e) {}
  }
  throw new Error("IP location failed");
}

function renderIpLocation() {
  if (!isValidIpLocation(ipLocation)) {
    setText("city", WEATHER.city);
    setText("locationSource", WEATHER.city === "IP konumu alınamadı"
      ? "IP konumu alınamadı"
      : "IP konumu algılanıyor...");
    return;
  }

  WEATHER.city = ipLocation.name;
  WEATHER.latitude = Number(ipLocation.latitude);
  WEATHER.longitude = Number(ipLocation.longitude);
  setText("city", ipLocation.name);
  setText("locationSource", "IP üzerinden yaklaşık konum");
}

async function resolveIpLocation() {
  ipLocation = null;
  WEATHER.city = "IP konumu algılanıyor...";
  WEATHER.latitude = null;
  WEATHER.longitude = null;
  renderIpLocation();

  try {
    ipLocation = await getIpLocation();
    renderIpLocation();
    return true;
  } catch (e) {
    WEATHER.city = "IP konumu alınamadı";
    WEATHER.latitude = null;
    WEATHER.longitude = null;
    renderIpLocation();
    return false;
  }
}

function updateMusicStatus() {
  const audio = getEl("bgMusic");
  if (!audio) return;

  if (audio.error) {
    const errorMessages = {
      1: "Oynatma iptal edildi",
      2: "Ses dosyası okunamadı",
      3: "MP3 sesi çözülemedi",
      4: "Ses biçimi desteklenmiyor"
    };
    setStatus("musicStatus", "Müzik hatası", "bad");
    setText("musicDetail", errorMessages[audio.error.code] || "Ses dosyası açılamadı");
  } else if (audio.paused && audio.currentTime === 0) {
    setStatus("musicStatus", "Hazır", "ok");
    setText("musicDetail", "OK: oynat");
  } else if (audio.paused) {
    setStatus("musicStatus", "Duraklatıldı", "warn");
    setText("musicDetail", "OK: devam et");
  } else {
    const source = (audio.currentSrc || "music-tv.mp3").split("/").pop();
    setStatus("musicStatus", "Çalıyor", "ok");
    setText("musicDetail", source + " • OK: duraklat");
  }

  updateMusicProgress();
  updateMediaScreenSaver();
}

function showMusicPlayError(error) {
  const detail = error && error.name === "NotAllowedError"
    ? "Tarayıcı sesi engelledi • ekrana tıklayıp Enter'a bas"
    : "TV ses oynatıcısı başlatılamadı";

  setStatus("musicStatus", "Başlatılamadı", "warn");
  setText("musicDetail", detail);
  updateFooter("Müzik başlatılamadı");
}

function playMusic() {
  const audio = getEl("bgMusic");
  if (!audio) return;

  audio.volume = MEDIA.musicVolume;

  if (audio.readyState === 0) audio.load();

  try {
    const playResult = audio.play();

    if (playResult && typeof playResult.then === "function") {
      playResult.then(function () {
        updateMusicStatus();
        updateFooter("Müzik çalıyor");
      }).catch(showMusicPlayError);
    } else {
      setTimeout(function () {
        if (audio.paused) showMusicPlayError();
        else {
          updateMusicStatus();
          updateFooter("Müzik çalıyor");
        }
      }, 250);
    }
  } catch (e) {
    showMusicPlayError(e);
  }
}

function pauseMusic() {
  const audio = getEl("bgMusic");
  if (!audio) return;

  audio.pause();
  updateMusicStatus();
  updateFooter("Müzik duraklatıldı");
}

function toggleMusic() {
  const audio = getEl("bgMusic");
  if (!audio) return;

  if (audio.paused) playMusic();
  else pauseMusic();
}

function initMusic() {
  const audio = getEl("bgMusic");
  if (!audio) return;
  const musicCard = document.querySelector(".musicCard");

  audio.loop = true;
  audio.volume = MEDIA.musicVolume;
  audio.addEventListener("play", updateMusicStatus);
  audio.addEventListener("playing", updateMusicStatus);
  audio.addEventListener("pause", updateMusicStatus);
  audio.addEventListener("error", updateMusicStatus);
  audio.addEventListener("canplay", updateMusicStatus);
  audio.addEventListener("timeupdate", updateMusicProgress);
  audio.addEventListener("durationchange", updateMusicProgress);
  if (musicCard) musicCard.addEventListener("click", toggleMusic);
  setText("musicTitle", MEDIA.musicTitle);
  updateMusicStatus();
  updateMusicProgress();
  setScreenSaverEnabled(true);
}

function updateMediaScreenSaver() {
  const audio = getEl("bgMusic");
  const localMusicPlaying = !!(audio && !audio.paused);
  setScreenSaverEnabled(!localMusicPlaying);
}

function normalizeSettings(source) {
  const normalized = source || {};
  const hasImages = backgroundLibrary.images.length > 0;
  const hasVideos = backgroundLibrary.videos.length > 0;
  let backgroundMode = normalized.backgroundMode === "video" ? "video" : "image";

  if (normalized.backgroundMode !== "video" && normalized.backgroundMode !== "image") {
    backgroundMode = hasVideos ? "video" : "image";
  }
  if (backgroundMode === "video" && !hasVideos) backgroundMode = hasImages ? "image" : "video";
  if (backgroundMode === "image" && !hasImages && hasVideos) backgroundMode = "video";

  return {
    musicVolume: Math.max(5, Math.min(100, Number(normalized.musicVolume) || 35)),
    language: normalized.language === "en" ? "en" : "tr",
    refreshIndex: Math.max(
      0,
      Math.min(WEATHER_REFRESH_OPTIONS.length - 1, Number(normalized.refreshIndex) || 0)
    ),
    backgroundMode: backgroundMode,
    backgroundImageIndex: clampBackgroundIndex("image", normalized.backgroundImageIndex),
    backgroundVideoIndex: clampBackgroundIndex("video", normalized.backgroundVideoIndex)
  };
}

function loadDashboardSettings() {
  try {
    const saved = localStorage.getItem("tvDashboardSettings");
    if (saved) settings = normalizeSettings(JSON.parse(saved));
  } catch (e) {
    settings = normalizeSettings(settings);
  }

  applyDashboardSettings(settings);
  applyBackgroundSelection(settings);
}

function saveDashboardSettings() {
  try {
    localStorage.setItem("tvDashboardSettings", JSON.stringify(settings));
  } catch (e) {}
}

function applyDashboardSettings(source) {
  const values = normalizeSettings(source);
  MEDIA.musicVolume = values.musicVolume / 100;

  const audio = getEl("bgMusic");
  if (audio) audio.volume = MEDIA.musicVolume;

  const activeBackgroundKind = values.backgroundMode === "video" ? "video" : "image";
  const activeBackgroundLabel = getBackgroundOptionValue(
    activeBackgroundKind,
    activeBackgroundKind === "video" ? values.backgroundVideoIndex : values.backgroundImageIndex
  );
  const backgroundModeLabel = getBackgroundModeLabel(values.backgroundMode);

  if (currentLanguage === "en") {
    setText("settingsSummary", backgroundModeLabel + " • " + activeBackgroundLabel);
    setText(
      "settingsDetail",
      "Music %" + values.musicVolume + " • OK: open settings"
    );
  } else {
    setText("settingsSummary", backgroundModeLabel + " • " + activeBackgroundLabel);
    setText(
      "settingsDetail",
      "Müzik %" + values.musicVolume + " • OK: ayarları aç"
    );
  }

  setText("settingVolumeValue", "%" + values.musicVolume);
  setText(
    "settingRefreshValue",
    WEATHER_REFRESH_OPTIONS[values.refreshIndex] + " dakika"
  );
  setText("settingBackgroundModeValue", backgroundModeLabel);
  setText("settingBackgroundImageValue", getBackgroundOptionValue("image", values.backgroundImageIndex));
  setText("settingBackgroundVideoValue", getBackgroundOptionValue("video", values.backgroundVideoIndex));
  setText(
    "settingLanguageValue",
    values.language === "en" ? "English" : "Türkçe"
  );
}

function scheduleWeatherUpdates() {
  if (weatherIntervalId) clearInterval(weatherIntervalId);
  const minutes = WEATHER_REFRESH_OPTIONS[settings.refreshIndex];
  weatherIntervalId = setInterval(updateWeather, minutes * 60 * 1000);
}

function renderSettingsPanel() {
  const rows = [
    "settingVolume",
    "settingRefresh",
    "settingBackgroundMode",
    "settingBackgroundImage",
    "settingBackgroundVideo",
    "settingLanguage"
  ];
  rows.forEach(function (id, index) {
    const row = getEl(id);
    if (row) row.classList.toggle("activeSetting", index === activeSettingIndex);
  });
  applyDashboardSettings(settingsDraft || settings);
}

function openSettings() {
  const overlay = getEl("settingsOverlay");
  if (!overlay) return;

  settingsDraft = normalizeSettings(settings);
  settingsOpen = true;
  activeSettingIndex = 0;
  overlay.hidden = false;
  renderSettingsPanel();
  scanBackgroundMedia();
  updateFooter("Ayarlar açık");
}

function closeSettings(saveChanges) {
  const overlay = getEl("settingsOverlay");
  if (!overlay) return;

  if (saveChanges && settingsDraft) {
    settings = normalizeSettings(settingsDraft);
    saveDashboardSettings();
    applyLanguage(settings.language);
    applyDashboardSettings(settings);
    applyBackgroundSelection(settings);
    scheduleWeatherUpdates();
    updateWeather();
    updateFooter("Ayarlar kaydedildi");
  } else {
    applyDashboardSettings(settings);
    applyBackgroundSelection(settings);
    updateFooter("Ayar değişiklikleri iptal edildi");
  }

  settingsDraft = null;
  settingsOpen = false;
  overlay.hidden = true;
  const settingsCard = document.querySelector(".settingsCard");
  if (settingsCard) settingsCard.focus();
}

function adjustSetting(direction) {
  if (!settingsDraft) return;
  const backgroundChanged = activeSettingIndex >= 2;

  if (activeSettingIndex === 0) {
    settingsDraft.musicVolume = Math.max(
      5,
      Math.min(100, settingsDraft.musicVolume + direction * 5)
    );
  } else if (activeSettingIndex === 1) {
    settingsDraft.refreshIndex =
      (settingsDraft.refreshIndex + direction + WEATHER_REFRESH_OPTIONS.length) %
      WEATHER_REFRESH_OPTIONS.length;
  } else if (activeSettingIndex === 2) {
    settingsDraft.backgroundMode =
      settingsDraft.backgroundMode === "video" && backgroundLibrary.images.length
        ? "image"
        : backgroundLibrary.videos.length
          ? "video"
          : "image";
  } else if (activeSettingIndex === 3 && backgroundLibrary.images.length) {
    settingsDraft.backgroundImageIndex =
      (settingsDraft.backgroundImageIndex + direction + backgroundLibrary.images.length) %
      backgroundLibrary.images.length;
  } else if (activeSettingIndex === 4 && backgroundLibrary.videos.length) {
    settingsDraft.backgroundVideoIndex =
      (settingsDraft.backgroundVideoIndex + direction + backgroundLibrary.videos.length) %
      backgroundLibrary.videos.length;
  } else if (activeSettingIndex === 5) {
    settingsDraft.language = settingsDraft.language === "en" ? "tr" : "en";
  }

  renderSettingsPanel();
  if (backgroundChanged) applyBackgroundSelection(settingsDraft);
}

function handleSettingsKey(key) {
  if (key === 38 || key === 40) {
    activeSettingIndex += key === 40 ? 1 : -1;
    activeSettingIndex =
      (activeSettingIndex + 6) % 6;
    renderSettingsPanel();
    return true;
  }

  if (key === 37 || key === 39) {
    adjustSetting(key === 39 ? 1 : -1);
    return true;
  }

  if (key === 13) {
    closeSettings(true);
    return true;
  }

  if (key === 10009) {
    closeSettings(false);
    return true;
  }

  return false;
}

function initSettings() {
  const card = document.querySelector(".settingsCard");
  if (card) card.addEventListener("click", openSettings);
}

function registerRemoteKeys() {
  try {
    if (window.tizen && tizen.tvinputdevice) {
      [
        "VolumeUp",
        "VolumeDown",
        "VolumeMute"
      ].forEach(function (keyName) {
        try {
          tizen.tvinputdevice.unregisterKey(keyName);
        } catch (e) {}
      });

      [
        "MediaPlay",
        "MediaPause",
        "MediaPlayPause"
      ].forEach(function (keyName) {
        try {
          tizen.tvinputdevice.registerKey(keyName);
        } catch (e) {}
      });
    }
  } catch (e) {}
}

function moveCardFocus(keyCode) {
  const cards = Array.prototype.slice.call(document.querySelectorAll(".card")).filter(function (card) {
    return card.offsetWidth > 0 && card.offsetHeight > 0;
  });
  const currentIndex = cards.indexOf(document.activeElement);
  if (!cards.length) return;

  if (currentIndex < 0) {
    cards[0].focus();
    return;
  }

  const currentRect = cards[currentIndex].getBoundingClientRect();
  const currentX = currentRect.left + currentRect.width / 2;
  const currentY = currentRect.top + currentRect.height / 2;
  let bestCard = null;
  let bestScore = Infinity;

  cards.forEach(function (card, index) {
    if (index === currentIndex) return;

    const rect = card.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - currentX;
    const dy = rect.top + rect.height / 2 - currentY;
    const horizontal = keyCode === 37 || keyCode === 39;
    const correctDirection =
      (keyCode === 37 && dx < -8) ||
      (keyCode === 39 && dx > 8) ||
      (keyCode === 38 && dy < -8) ||
      (keyCode === 40 && dy > 8);

    if (!correctDirection) return;

    const primaryDistance = horizontal ? Math.abs(dx) : Math.abs(dy);
    const crossDistance = horizontal ? Math.abs(dy) : Math.abs(dx);
    const score = primaryDistance + crossDistance * 2.5;

    if (score < bestScore) {
      bestScore = score;
      bestCard = card;
    }
  });

  if (bestCard) bestCard.focus();
}

function setupRemoteKeys() {
  registerRemoteKeys();

  document.addEventListener("keydown", function (event) {
    const key = event.keyCode;

    if (key === 447 || key === 448 || key === 449) {
      // Volume keys are handled here rather than through registerRemoteKeys,
      // so the browser delivers them as normal events. Taking them over also
      // keeps the Sound card in sync, which the TV's own UI would not update.
      if (key === 447) adjustTvVolume(1);
      else if (key === 448) adjustTvVolume(-1);
      else toggleTvMute();
      event.preventDefault();
      return;
    }

    if (languageOpen) {
      if (handleLanguageKey(key)) event.preventDefault();
      return;
    }

    if (settingsOpen) {
      if (handleSettingsKey(key)) event.preventDefault();
      return;
    }

    if (key >= 37 && key <= 40) {
      event.preventDefault();
      moveCardFocus(key);
      return;
    }

    if (key === 10009) {
      try {
        if (window.tizen && tizen.application) {
          tizen.application.getCurrentApplication().exit();
          return;
        }
      } catch (e) {}

      window.history.back();
      return;
    }

    if (key === 13) {
      event.preventDefault();
      const activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains("settingsCard")) {
        openSettings();
      } else if (activeElement && activeElement.classList.contains("networkCard")) {
        runInternetTest();
      } else if (activeElement && activeElement.classList.contains("soundCard")) {
        toggleTvMute();
      } else {
        toggleMusic();
      }
      return;
    }

    // 415 = Play, 19 = Pause, 10252 = the remote's own Play/Pause key.
    // That last one reports the current state rather than a press, so it maps
    // to toggle instead of a fixed action.
    if (key === 415) {
      event.preventDefault();
      playMusic();
      return;
    }

    if (key === 19) {
      event.preventDefault();
      pauseMusic();
      return;
    }

    if (key === 10252) {
      event.preventDefault();
      toggleMusic();
      return;
    }

  });
}

function registerNetworkListener() {
  try {
    if (
      window.webapis &&
      webapis.network &&
      typeof webapis.network.addNetworkStateChangeListener === "function"
    ) {
      webapis.network.addNetworkStateChangeListener(function () {
        if (document.hidden) return;
        updateNetworkInfo();
        resolveIpLocation().then(updateWeather);
      });
    }
  } catch (e) {}
}

function refreshSystemCards(forceSource) {
  updateNetworkInfo();
  updateVolumeInfo();
  updateResourceInfo();
  updateHardwareInfo();
  ensureBackgroundPlayback();
  if (forceSource || Date.now() - lastSourceRefresh >= PERFORMANCE.sourceIntervalMs) {
    lastSourceRefresh = Date.now();
    updateSourceInfo();
  }
  markUpdated();
}

function updateSlowSystemInfo() {
  updateTvInfo();
  updateHardwareInfo();
}

function focusFirstCard() {
  const cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
  for (let index = 0; index < cards.length; index++) {
    if (cards[index].offsetWidth > 0 && cards[index].offsetHeight > 0) {
      cards[index].focus();
      return;
    }
  }
}

function stopRuntimeTimers() {
  Object.keys(runtimeIntervals).forEach(function (key) {
    if (runtimeIntervals[key]) clearInterval(runtimeIntervals[key]);
    runtimeIntervals[key] = null;
  });
  if (weatherIntervalId) clearInterval(weatherIntervalId);
  weatherIntervalId = null;
}

function startRuntimeTimers() {
  stopRuntimeTimers();
  runtimeIntervals.clock = setInterval(updateClock, PERFORMANCE.clockIntervalMs);
  runtimeIntervals.system = setInterval(refreshSystemCards, PERFORMANCE.systemIntervalMs);
  runtimeIntervals.slow = setInterval(updateSlowSystemInfo, PERFORMANCE.slowIntervalMs);
  runtimeIntervals.pixelShift = setInterval(applyPixelShift, PERFORMANCE.pixelShiftIntervalMs);
  scheduleWeatherUpdates();
}

function boot() {
  initBackground();
  clearStoredLocationData();
  loadDashboardSettings();
  initMusic();
  initLanguageSelector();
  initSettings();
  initNetworkTest();
  initSoundControl();
  updateClock();
  updateSlowSystemInfo();
  refreshSystemCards(true);
  resolveIpLocation().then(updateWeather);
  setupRemoteKeys();
  registerNetworkListener();
  setText("appVersion", "v" + APP_VERSION);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopRuntimeTimers();
      stopAvplayBackground();
      stopBackgroundVideo();
      setScreenSaverEnabled(true);
    } else {
      applyBackgroundSelection(settingsOpen && settingsDraft ? settingsDraft : settings, true);
      updateClock();
      refreshSystemCards(true);
      updateMusicStatus();
      resolveIpLocation().then(updateWeather);
      startRuntimeTimers();
    }
  });

  startRuntimeTimers();

  updateFooter("TV Dashboard hazır");
}

window.addEventListener("load", boot);
