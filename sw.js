// Guarda una copia de la app para que abra aunque no haya señal (por ejemplo, en una feria).
// Siempre intenta la red primero, así nunca queda una versión vieja cuando hay internet.
// Las ventas sin señal las guarda Firestore en el celu y las sube solas después.
const CACHE = "caja-arboles-v1";
const PROPIOS = ["./", "index.html", "firebase-config.js", "logo.png", "manifest.webmanifest", "icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PROPIOS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const propio = url.origin === self.location.origin;
  const sdk = url.host === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/");
  const fuentes = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";
  if (!propio && !sdk && !fuentes) return; // la base de datos y el login van directo, sin pasar por acá
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
  );
});
