import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { PinoLoggerService } from './modules/logger/pino-logger.service';
import AppConfig from './config/app.config';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    const { httpAdapter } = app.get(HttpAdapterHost);
    const pinoLoggerService = app.get(PinoLoggerService);
    const appConfig = app.get<ConfigType<typeof AppConfig>>(AppConfig.KEY);

    app.useLogger(pinoLoggerService);
    app.useGlobalFilters(
        new HttpExceptionFilter(httpAdapter, pinoLoggerService),
    );
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            validationError: {
                target: false,
                value: false,
            },
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const config = new DocumentBuilder()
        .setTitle(`${appConfig.projectName}`)
        .setDescription(`The ${appConfig.projectName} API description`)
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${appConfig.apiDocPath}`, app, document, {
        customSiteTitle: `${appConfig.projectName} api doc`,
    });

    await app.listen(appConfig.port);
};
bootstrap();
