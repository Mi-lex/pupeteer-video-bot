// import { stageHandlerDecorator } from '../helpers/telegram-request.helper';
import { HelloRequestEntity } from '../entities/sayHelloRequest.entity';
import { TelegramRequestResolver, IStage } from './request.resolver';

export enum SayHelloStagesNames {
    TypeHello = 'typeHello',
}

interface ITypeHelloStageOptions {
    typedHello: string;
}

class TypeHelloStage implements IStage<ITypeHelloStageOptions> {
    name = SayHelloStagesNames.TypeHello;

    // @stageHandlerDecorator(SayHelloStagesNames.TypeHello)
    handler(
        options: ITypeHelloStageOptions,
        request: HelloRequestEntity,
        // dbService
        // telegramService
    ) {
        const { typedHello } = options;
        request.payload = {
            ...request.payload,
            hello: typedHello,
        };
    }
}

export const sayHelloResolver: TelegramRequestResolver = {
    stages: [new TypeHelloStage()],
};
