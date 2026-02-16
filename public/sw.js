// ==========================================
// SERVICE WORKER - FIBIDY PWA
// Basic caching strategy for offline support
// ✅ FIX: Exclude OG images from cache + version bump
// ==========================================

// ✅ VERSION BUMP - Force clear old cache
const STATIC_CACHE = 'fibidy-static-v2';
const DYNAMIC_CACHE = 'fibidy-dynamic-v2';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
];

// ==========================================
// HELPER: Should Skip Caching
// ==========================================
function shouldSkipCache(url) {
  const pathname = url.pathname;

  // ✅ Skip OG images (CRITICAL FIX!)
  if (pathname.includes('/opengraph-image') || pathname.includes('/twitter-image')) {
    return true;
  }

  // ✅ Skip API requests
  if (pathname.startsWith('/api/')) {
    return true;
  }

  // ✅ Skip Next.js internal routes
  if (pathname.startsWith('/_next/')) {
    return true;
  }

  // ✅ Skip RSC (React Server Components) requests
  if (url.searchParams.has('_rsc')) {
    return true;
  }

  return false;
}

// ==========================================
// INSTALL EVENT
// ==========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Activate immediately
  self.skipWaiting();
});

// ==========================================
// ACTIVATE EVENT
// ==========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');

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

  // Claim all clients immediately
  self.clients.claim();
});

// ==========================================
// FETCH EVENT
// ==========================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // ✅ CRITICAL: Skip caching for OG images and other dynamic content
  if (shouldSkipCache(url)) {
    console.log('[SW] Skipping cache for:', url.pathname);
    event.respondWith(fetch(request));
    return;
  }

  // ==========================================
  // CACHING STRATEGY: Network First
  // ==========================================
  event.respondWith(
    fetch(request)
      .then((response) => {
        // ✅ Only cache successful responses (200-299)
        if (response.ok) {
          const responseClone = response.clone();

          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Fallback to cache on network error
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', url.pathname);
            return cachedResponse;
          }

          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/').then((homePage) => {
              return homePage || new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/plain' },
              });
            });
          }

          // For other requests, return error response
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
// PUSH NOTIFICATION (Future feature)
// ==========================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body || 'Anda memiliki notifikasi baru',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
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
// NOTIFICATION CLICK HANDLER
// ==========================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('[SW] Service Worker v2 loaded - OG images excluded from cache');