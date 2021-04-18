import { Body, Controller, Post } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { BotsService } from './bots.service';

@Controller('bots')
export class BotsController {
    constructor(private readonly botsService: BotsService) {}

    @Post('/start')
    async start(@Body() createBotDto: CreateBotDto) {
        await this.botsService.create(createBotDto);

        return { started: true };
    }

    @Post('/stop')
    async stop() {
        this.botsService.closeCluster();

        return { stopped: true };
    }
}
