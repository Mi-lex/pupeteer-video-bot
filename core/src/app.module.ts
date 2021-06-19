import { ConfigModule } from '@nestjs/config';
import { HttpModule, Module } from '@nestjs/common';
import { PinoLoggerService } from './modules/logger/pino-logger.service';
import { AppController } from './app.controller';
import { BotsModule } from './modules/bots/bots.module';
import { app, telegram, pupeteer, redis } from './config';
import { TelegramModule } from './modules/telegram/telegram.module';
import { RedisCacheModule } from './modules/redis-cache/redis-cache.module';
import validationSchema from './config/validationSchema';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            validationSchema: validationSchema,
            load: [app, telegram, pupeteer, redis],
            isGlobal: true,
        }),
        TelegramModule,
        BotsModule,
        RedisCacheModule,
    ],
    controllers: [AppController],
    providers: [PinoLoggerService],
})
export class AppModule {}
