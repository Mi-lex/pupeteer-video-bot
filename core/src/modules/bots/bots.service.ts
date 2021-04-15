import { Injectable } from '@nestjs/common';

@Injectable()
export class BotsService {
    async start() {
        return 'Bot started';
    }

    async stop() {
        return 'Bot stopped';
    }
}
