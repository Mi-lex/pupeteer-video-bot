import { Resolvers } from '../config/resolvers.config';

export interface RequestEntity<T = Record<string, unknown>> {
    name: keyof typeof Resolvers;
    payload: T;
    currentStageName: string;
}
