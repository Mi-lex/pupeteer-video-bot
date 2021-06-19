import { SAY_HELLO } from './../entities/sayHelloRequest.entity';
import { sayHelloResolver } from './../resolvers/sayHello.resolver';

export const Resolvers = {
    [SAY_HELLO]: sayHelloResolver,
};
