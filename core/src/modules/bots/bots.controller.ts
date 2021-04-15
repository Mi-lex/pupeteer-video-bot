import { Controller, Post } from '@nestjs/common';
import { BotsService } from './bots.service';

@Controller('bots')
export class BotsController {
    constructor(private readonly botsService: BotsService) {}

    @Post('/start')
    async start() {
        const startResponse = await this.botsService.start();
        return startResponse;
    }

    @Post('/stop')
    async stop() {
        const stopResponse = await this.botsService.stop();
        return stopResponse;
    }
}
