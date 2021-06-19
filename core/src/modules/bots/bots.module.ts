import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';
import { PinoLoggerService } from './../logger/pino-logger.service';
import { TelegramModule } from './../telegram/telegram.module';

@Module({
    controllers: [BotsController],
    providers: [BotsService, PinoLoggerService, ConfigService],
    imports: [TelegramModule],
})
export class BotsModule {}
