import { SayHelloStagesNames } from '../resolvers/sayHello.resolver';
import { RequestEntity } from './request.entity';

export const SAY_HELLO = 'SAY_HELLO';

export interface ISayHelloRequestPayload {
    hello?: string;
}

export class HelloRequestEntity
    implements RequestEntity<ISayHelloRequestPayload> {
    name = SAY_HELLO;
    payload: ISayHelloRequestPayload;
    currentStageName: string = SayHelloStagesNames.TypeHello;
}
