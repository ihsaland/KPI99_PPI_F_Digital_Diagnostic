"""
Simple in-memory cache service for performance optimization
"""
from typing import Any, Optional
from datetime import datetime, timedelta
import json

class CacheService:
    """Simple in-memory cache with TTL support"""
    
    def __init__(self):
        self._cache: dict = {}
        self._ttl: dict = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key not in self._cache:
            return None
        
        # Check if expired
        if key in self._ttl:
            if datetime.now() > self._ttl[key]:
                self.delete(key)
                return None
        
        return self._cache[key]
    
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        """Set value in cache with TTL"""
        self._cache[key] = value
        if ttl_seconds > 0:
            self._ttl[key] = datetime.now() + timedelta(seconds=ttl_seconds)
        else:
            self._ttl.pop(key, None)
    
    def delete(self, key: str):
        """Delete key from cache"""
        self._cache.pop(key, None)
        self._ttl.pop(key, None)
    
    def clear(self):
        """Clear all cache"""
        self._cache.clear()
        self._ttl.clear()
    
    def invalidate_pattern(self, pattern: str):
        """Invalidate all keys matching pattern"""
        keys_to_delete = [key for key in self._cache.keys() if pattern in key]
        for key in keys_to_delete:
            self.delete(key)

# Global cache instance
cache = CacheService()




