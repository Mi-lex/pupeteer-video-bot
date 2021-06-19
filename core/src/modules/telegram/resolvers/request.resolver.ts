import { RequestEntity } from '../entities/request.entity';

export type StageHandler<Options = any> = (
    options: Options,
    request: RequestEntity,
) => Promise<void> | void;

export interface IStage<Options = any> {
    name: string;
    sendPrecondition?: () => Promise<void>;
    handler: StageHandler<Options>;
}

export abstract class TelegramRequestResolver {
    stages: IStage[];
}
