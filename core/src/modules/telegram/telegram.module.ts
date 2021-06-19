import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { RedisCacheModule } from './../redis-cache/redis-cache.module';

@Module({
    controllers: [TelegramController],
    providers: [TelegramService],
    exports: [TelegramService],
    imports: [RedisCacheModule],
})
export class TelegramModule {}
