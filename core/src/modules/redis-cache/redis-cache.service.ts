import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async get<T>(key: string) {
        return await this.cacheManager.get<T>(key);
    }

    async set<T>(key: string, value: any, ttl = 1000) {
        await this.cacheManager.set<T>(key, value, ttl);
    }

    async reset() {
        await this.cacheManager.reset();
    }

    async del(key: string) {
        await this.cacheManager.del(key);
    }
}
