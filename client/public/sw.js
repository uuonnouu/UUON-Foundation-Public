// Service Worker for Offline NFT Creation
const CACHE_NAME = 'dmension-4d-nft-v3';
const urlsToCache = [];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'CREATE_NFT_OFFLINE') {
    console.log('Creating NFT offline:', event.data.nftData);
    storeNFTOffline(event.data.nftData);
  }
});

function storeNFTOffline(nftData) {
  const request = indexedDB.open('DMension4DNFT', 1);
  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('nfts', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
  };
  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['nfts'], 'readwrite');
    const objectStore = transaction.objectStore('nfts');
    objectStore.add(nftData);
  };
}
