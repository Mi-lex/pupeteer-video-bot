import { Resolvers } from './../config/resolvers.config';
import { RequestEntity } from './../entities/request.entity';
import { TelegramRequestResolver } from '../resolvers/request.resolver';

export const stageHandlerDecorator = (stageName: string) => (
    // @ts-ignore
    target: any,
    // @ts-ignore
    n: string,
    descriptor: PropertyDescriptor,
) => {
    // original handler
    const original = descriptor.value;
    if (typeof original === 'function') {
        descriptor.value = function (...args: any) {
            original.apply(this, args);

            const request: RequestEntity = args[1];

            if (request) {
                const resolver = Resolvers[request.name];
                const { stages } = request;

                const currentStageIndex = stages.findIndex(
                    ({ name }) => name === stageName,
                );

                const isCurrentIndexExist = Boolean(~currentStageIndex);

                if (!isCurrentIndexExist) {
                    console.error(
                        `${stageName} stage does not exists in request stages`,
                    );
                    return;
                }

                const nextStage = stages[currentStageIndex + 1];

                if (nextStage.sendPrecondition) {
                    try {
                        nextStage.sendPrecondition();
                    } catch (error) {
                        console.error(
                            'Error in StageHandlerDecorator: ',
                            stageName,
                        );
                    }
                }
            }
        };
    }
    return descriptor;
};
