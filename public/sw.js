// ==========================================
// SERVICE WORKER - FIBIDY PWA
// V4 — Production ready
// ==========================================

const STATIC_CACHE = 'fibidy-static-v4';
const DYNAMIC_CACHE = 'fibidy-dynamic-v4';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
];

// ==========================================
// HELPER: Should Skip Caching
// ==========================================
function shouldSkipCache(url) {
  const pathname = url.pathname;

  if (pathname.includes('/opengraph-image') || pathname.includes('/twitter-image')) {
    return true;
  }
  if (pathname.startsWith('/api/')) {
    return true;
  }
  if (pathname.startsWith('/_next/')) {
    return true;
  }
  if (url.searchParams.has('_rsc')) {
    return true;
  }
  // Skip dashboard & admin (private routes)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return true;
  }

  return false;
}

// ==========================================
// INSTALL
// ==========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ==========================================
// ACTIVATE
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ==========================================
// FETCH — Network First
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  if (shouldSkipCache(url)) {
    console.log('[SW] Skipping cache for:', url.pathname);
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', url.pathname);
            return cachedResponse;
          }
          if (request.mode === 'navigate') {
            return caches.match('/').then((homePage) => {
              return homePage || new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' },
              });
            });
          }
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

// ==========================================
// PUSH NOTIFICATION
// ==========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || 'Kamu punya notifikasi baru.',
    icon: '/icons/apple-touch-icon-192x192.png',
    badge: '/icons/apple-touch-icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Fibidy', options)
  );
});

// ==========================================
// NOTIFICATION CLICK
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('[SW] Service Worker v4 loaded - Fibidy Production Ready 🚀');