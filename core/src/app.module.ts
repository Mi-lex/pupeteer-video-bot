import { HttpModule, Module } from '@nestjs/common';
import { PinoLoggerService } from './modules/logger/pino-logger.service';
import { AppController } from './app.controller';
import { BotsModule } from './modules/bots/bots.module';
import { TelegramService } from './modules/telegram/telegram.service';

@Module({
    imports: [HttpModule, BotsModule],
    controllers: [AppController],
    providers: [PinoLoggerService, TelegramService],
})
export class AppModule {}
