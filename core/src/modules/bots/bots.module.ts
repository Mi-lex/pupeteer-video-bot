import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../telegram/telegram.service';
import { PinoLoggerService } from './../logger/pino-logger.service';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';

@Module({
    controllers: [BotsController],
    providers: [BotsService, TelegramService, PinoLoggerService, ConfigService],
})
export class BotsModule {}
