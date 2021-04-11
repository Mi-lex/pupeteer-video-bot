import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import env from './config/env';
import { AppModule } from './app.module';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle(`${env.PROJECT_NAME}`)
        .setDescription(`The ${env.PROJECT_NAME} API description`)
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(env.API_DOC_PATH, app, document, {
        customSiteTitle: `${env.PROJECT_NAME} api doc`,
    });

    await app.listen(env.PORT);
};
bootstrap();
