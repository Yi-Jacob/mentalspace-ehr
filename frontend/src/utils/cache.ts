interface CacheItem<T> {
  data: T;
  expiry: number;
  created: number;
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes default

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data,
      expiry,
      created: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired items
  cleanup(): number {
    let removed = 0;
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let total = 0;
    
    for (const [, item] of this.cache.entries()) {
      total++;
      if (now > item.expiry) {
        expired++;
      }
    }
    
    return {
      total,
      expired,
      active: total - expired,
      memoryUsage: this.cache.size
    };
  }
}

export const cacheService = new CacheService();

// Auto-cleanup every 5 minutes
setInterval(() => {
  const removed = cacheService.cleanup();
  if (removed > 0) {
    console.debug(`Cache cleanup: removed ${removed} expired items`);
  }
}, 5 * 60 * 1000); 