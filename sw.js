// Service Worker for OKN検査 PWA
const CACHE_NAME = 'okn-test-v2.0.0';
const STATIC_CACHE_NAME = 'okn-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'okn-dynamic-v2.0.0';

// キャッシュするファイル
const STATIC_FILES = [
  '/OKN/',
  '/OKN/index.html',
  '/OKN/manifest.json',
  '/OKN/FNT512.png',
  '/OKN/FNT512-transparent.png'
];

// インストールイベント - 静的ファイルをキャッシュ
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache static files:', error);
      })
  );
  
  // 即座にアクティベート
  self.skipWaiting();
});

// アクティベートイベント - 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('okn-') &&
                   cacheName !== STATIC_CACHE_NAME &&
                   cacheName !== DYNAMIC_CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // すぐに新しいService Workerを使用
  self.clients.claim();
});

// フェッチイベント - キャッシュファースト戦略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 同じオリジンのリクエストのみ処理
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        // キャッシュがあればそれを返す
        if (cacheResponse) {
          console.log('[Service Worker] Found in cache:', request.url);
          return cacheResponse;
        }
        
        // キャッシュがなければネットワークから取得
        console.log('[Service Worker] Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // レスポンスが正常な場合、動的キャッシュに保存
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            
            // オフライン時のフォールバック
            if (request.destination === 'document') {
              return caches.match('/OKN/index.html');
            }
            
            // 画像の場合はプレースホルダーを返す
            if (request.destination === 'image') {
              return caches.match('/OKN/FNT512.png');
            }
            
            return new Response('オフラインです', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// バックグラウンド同期
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // データ同期処理をここに追加
      Promise.resolve()
    );
  }
});

// プッシュ通知（将来的な機能拡張用）
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'OKN検査の準備ができました',
    icon: '/OKN/FNT512.png',
    badge: '/OKN/FNT512.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '開く',
        icon: '/OKN/FNT512.png'
      },
      {
        action: 'close',
        title: '閉じる',
        icon: '/OKN/FNT512.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('OKN検査', options)
  );
});

// 通知クリック
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/OKN/')
    );
  }
});

// メッセージリスナー（キャッシュ更新用）
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach(client => {
          client.postMessage({
            action: 'cacheCleared'
          });
        });
      })
    );
  }
});
