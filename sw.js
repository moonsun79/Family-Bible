// 앱 화면을 휴대폰에 저장해 두어 빠르게 열리게 함 (녹음·데이터는 저장하지 않음)
const CACHE = 'family-bible-v3';
const SHELL = ['./', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); });
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin !== location.origin && u.hostname !== 'cdn.jsdelivr.net') return;
  // 항상 최신 버전을 먼저 시도, 인터넷이 없으면 저장된 화면 사용
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
