import { PinoLoggerService } from 'src/modules/logger/pino-logger.service'
import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TelegramService } from './modules/telegram/telegram.service'

@Module({
    imports: [HttpModule],
    controllers: [AppController],
    providers: [PinoLoggerService, TelegramService],
})
export class AppModule {}
