import { Injectable, LoggerService } from '@nestjs/common';
import * as pinoLogger from 'pino';
import { TelegramService } from '../telegram/telegram.service';
import vars from '../../config/vars';

const pino = pinoLogger({
    prettyPrint: true,
});

@Injectable()
export class PinoLoggerService implements LoggerService {
    constructor(private readonly telegramService: TelegramService) {}

    static getMessage(message: any, context?: string) {
        return context ? `[ ${context} ] ${message}` : message;
    }

    logWithTelegram(
        logFn: (logMsg: any) => void,
        message: any,
        context?: string,
    ): void {
        const formattedMessage = PinoLoggerService.getMessage(message, context);
        logFn(formattedMessage);
        if (!vars.isDev) {
            this.telegramService.sendMessage(formattedMessage);
        }
    }

    error(message: any, context?: string): void {
        this.logWithTelegram(pino.error.bind(pino), message, context);
    }

    log(message: any, context?: string): void {
        this.logWithTelegram(pino.info.bind(pino), message, context);
    }

    warn(message: any, context?: string): void {
        this.logWithTelegram(pino.warn.bind(pino), message, context);
    }
}
