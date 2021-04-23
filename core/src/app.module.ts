import { ConfigModule } from '@nestjs/config';
import { HttpModule, Module } from '@nestjs/common';
import { PinoLoggerService } from './modules/logger/pino-logger.service';
import { AppController } from './app.controller';
import { BotsModule } from './modules/bots/bots.module';
import { TelegramService } from './modules/telegram/telegram.service';
import { app, telegram, pupeteer } from './config';
import validationSchema from './config/validationSchema';

@Module({
    imports: [
        HttpModule,
        BotsModule,
        ConfigModule.forRoot({
            validationSchema: validationSchema,
            load: [app, telegram, pupeteer],
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [PinoLoggerService, TelegramService],
})
export class AppModule {}
