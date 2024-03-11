import { LRUCache } from 'lru-cache'
const cache = new LRUCache({
  max: 1000,
  ttl: 10 * 60 * 1000, // 10 minutos
});

function addToCache(key: any, value: any) {
  cache.set(key, value);
}

function getFromCache(key: any) {
  return cache.get(key);
}

export { addToCache, getFromCache };
