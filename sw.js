// Offline support. Stores the whole app on the device so every page works without a connection.
// When online, pages and scripts are refreshed in the background, so updates still arrive.
const VERSION = "__VERSION__"; // replaced with the commit when the site is published
const CACHE = "vesc-saver-" + VERSION;
const FIRMWARE = ["3.55", "3.56", "3.57", "3.58", "3.59", "3.60", "3.61", "3.62", "3.63", "3.64", "3.65", "3.66", "4.00", "4.01", "4.02", "5.00", "5.01", "5.02", "5.03", "6.00", "6.02", "6.05", "6.06", "7.00", "7.01"];
const APP = ["./", "index.html", "viewer.html", "logger.html", "compare.html", "core.js", "ble.js", "cfg.js", "fa.js", "guide.js",
  "favicon.svg", "icon-192.png", "icon-512.png", "manifest.webmanifest", ...FIRMWARE.map(v => `desc/${v}.json`)];
const EXTERNAL = [
  "https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.iife.min.js",
  "https://cdn.jsdelivr.net/npm/uplot@1.6.30/dist/uPlot.min.css",
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(APP);
    // Chart library and fonts: best effort, the app still works without them.
    await Promise.all(EXTERNAL.map(u => c.add(new Request(u, { mode: "cors" })).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("vesc-saver-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameSite = url.origin === location.origin;
  const isPage = req.mode === "navigate";
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameSite && !isFont && !url.hostname.endsWith("jsdelivr.net")) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    // Pages: try the network first so you get the latest version, fall back to the stored copy.
    if (isPage) {
      try {
        // Give up on a slow connection after 4 seconds and use the stored copy instead.
        const res = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error("slow")), 4000))]);
        if (res.ok) c.put(url.pathname === "/" ? "./" : req, res.clone());
        return res;
      } catch (err) {
        return (await c.match(req, { ignoreSearch: true })) || (await c.match("./")) || Response.error();
      }
    }
    // Everything else: answer from the stored copy straight away and refresh it in the background.
    const cached = await c.match(req, { ignoreSearch: sameSite });
    const refresh = fetch(req).then(res => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => null);
    if (cached) { e.waitUntil(refresh); return cached; }
    return (await refresh) || Response.error();
  })());
});
