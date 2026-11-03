// Бүрхүүлийн файлуудыг кэшлэнэ. Бүртгэлийн хуудас (script.google.com) кэшлэгдэхгүй —
// интернэтгүй үеийн бүртгэлийг тэр хуудас өөрөө хадгалж, дараа нь илгээдэг.
const CACHE = 'tsag-shell-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Сүлжээ эхэлж, болохгүй бол кэш — шинэчлэлт шууд орно
  e.respondWith(fetch(req)
    .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
