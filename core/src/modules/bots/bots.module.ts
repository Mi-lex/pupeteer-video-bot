import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramModule } from '../telegram/telegram.module';
import { PinoLoggerService } from './../logger/pino-logger.service';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';

@Module({
    imports: [TelegramModule],
    controllers: [BotsController],
    providers: [BotsService, PinoLoggerService, ConfigService],
})
export class BotsModule {}
