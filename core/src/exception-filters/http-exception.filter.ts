import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpServer,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PinoLoggerService } from 'src/modules/logger/pino-logger.service'

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    constructor(
        applicationRef: HttpServer,
        private readonly loggerService: PinoLoggerService,
    ) {
        super(applicationRef);
    }

    async catch(exception: unknown, host: ArgumentsHost) {
        super.catch(exception, host);

        if (
            exception instanceof HttpException &&
            exception.getStatus() !== HttpStatus.NOT_FOUND
        ) {
            const message =
                `\t*1.Stack*:\n\t${exception.stack}` +
                `\n\t*2.Message*:\n\t${exception.message}\n`;
            this.loggerService.error(message);
        }
    }
}
