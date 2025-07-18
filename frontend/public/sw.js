// Service Worker for Enhanced Performance and Offline Support

const CACHE_NAME = 'mentalspace-v1';
const STATIC_CACHE_NAME = 'mentalspace-static-v1';
const DYNAMIC_CACHE_NAME = 'mentalspace-dynamic-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html', // Create this as a fallback page
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/rest/v1/clients',
  '/rest/v1/clinical_notes',
  '/rest/v1/appointments',
  '/rest/v1/users',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Dynamic cache ready');
        return cache;
      })
    ])
  );
  
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE_NAME));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
  } else {
    event.respondWith(networkFirstWithFallback(request));
  }
});

// Caching Strategies

// Cache First - good for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Optionally update cache in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
    
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Service Unavailable', { status: 503 });
  }
}

// Network First with Cache - good for API requests
async function networkFirstWithCache(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Cache successful responses
        if (shouldCacheApiResponse(request)) {
          cache.put(request, networkResponse.clone());
        }
      }
      
      return networkResponse;
      
    } catch (networkError) {
      console.log('Network failed, trying cache:', networkError);
      
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        // Add header to indicate cached response
        const headers = new Headers(cachedResponse.headers);
        headers.set('X-Served-From', 'cache');
        
        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers
        });
      }
      
      throw networkError;
    }
    
  } catch (error) {
    console.error('Network first strategy failed:', error);
    return new Response(JSON.stringify({ 
      error: 'Service temporarily unavailable',
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network First with Fallback - good for navigation
async function networkFirstWithFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Background cache update
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silently fail - this is a background operation
    console.log('Background cache update failed:', error);
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/rest/v1/') || 
         url.pathname.startsWith('/functions/v1/');
}

function isImageRequest(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);
}

function shouldCacheApiResponse(request) {
  const url = new URL(request.url);
  
  // Cache GET requests to specific endpoints
  return CACHEABLE_APIS.some(api => url.pathname.startsWith(api)) &&
         request.method === 'GET';
}

// Background sync for offline mutations
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncOfflineActions() {
  try {
    // Get queued actions from IndexedDB or localStorage
    const queuedActions = getQueuedActions();
    
    for (const action of queuedActions) {
      try {
        await fetch(action.url, action.options);
        removeQueuedAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

function getQueuedActions() {
  // Implementation would read from IndexedDB or localStorage
  // For now, return empty array
  return [];
}

function removeQueuedAction(actionId) {
  // Implementation would remove from IndexedDB or localStorage
  console.log('Removing queued action:', actionId);
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_LOG') {
    console.log('Performance metric:', event.data.metric);
    // Could send to analytics service
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data,
      actions: data.actions || []
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});