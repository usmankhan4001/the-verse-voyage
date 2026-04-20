import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage offline assets (Audio & PDFs) using CacheStorage API.
 * This allows students to download content while online and access it later.
 */
export function useOffline() {
  const [cachedUrls, setCachedUrls] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const CACHE_NAME = 'vv-assets-v1';

  // Load initial cache state
  useEffect(() => {
    const loadCache = async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        setCachedUrls(new Set(keys.map(request => request.url)));
      } catch (err) {
        console.error('Failed to load cache:', err);
      }
    };
    loadCache();
  }, []);

  const cacheAsset = useCallback(async (url: string) => {
    if (!url || cachedUrls.has(url)) return;
    
    setIsSyncing(true);
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      await cache.put(url, response);
      
      setCachedUrls(prev => {
        const next = new Set(prev);
        next.add(new URL(url, window.location.href).href);
        return next;
      });
    } catch (err) {
      console.error('Failed to cache asset:', url, err);
    } finally {
      setIsSyncing(false);
    }
  }, [cachedUrls]);

  const removeAsset = useCallback(async (url: string) => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(url);
      setCachedUrls(prev => {
        const next = new Set(prev);
        next.delete(new URL(url, window.location.href).href);
        return next;
      });
    } catch (err) {
      console.error('Failed to remove asset:', err);
    }
  }, []);

  const isCached = useCallback((url: string) => {
    if (!url) return false;
    const absoluteUrl = new URL(url, window.location.href).href;
    return cachedUrls.has(absoluteUrl);
  }, [cachedUrls]);

  return {
    cacheAsset,
    removeAsset,
    isCached,
    isSyncing,
    cachedUrls
  };
}
