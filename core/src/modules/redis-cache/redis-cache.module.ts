// @ts-ignore
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { Module, CacheModule } from '@nestjs/common';
import { redis } from '../../config';
import { RedisCacheService } from './redis-cache.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const redisConfig = configService.get<ConfigType<typeof redis>>(
                    redis.KEY,
                );

                return {
                    store: redisStore,
                    host: redisConfig?.host,
                    port: redisConfig?.port,
                };
            },
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}
