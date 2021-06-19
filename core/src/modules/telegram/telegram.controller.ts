import { Resolvers } from './config/resolvers.config';
import { Controller } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
// import { Message } from 'node-telegram-bot-api';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {
        this.telegramService.onText(/w/, this.onMessage.bind(this));
        this.telegramService.bot.on('callback_query', (query) => {
            this.telegramService.bot.answerCallbackQuery(query.id, {
                text: 'test',
            });
            query.data + '_whoa';
        });
        // this.telegramService.bot.on('inline_query')
        this.telegramService.bot.setMyCommands([
            {
                command: '/say_hello',
                description: 'Say hello',
            },
        ]);
        // this.telegramService.bot.on('message', () => {
        //     console.log('here');
        // });
        // (/options/, this.onMessage.bind(this));
    }

    async onCallbackQuery(query: TelegramBot.CallbackQuery) {
        console.log(query);
    }

    async onMessage(msg: TelegramBot.Message) {
        const currentUserRequest = await this.telegramService.getUserCurrentRequest(
            msg.chat.id,
        );

        if (currentUserRequest) {
            const requestResolver = Resolvers[currentUserRequest.name];

            if (requestResolver) {
                const stageResolverIndex = requestResolver.stages.findIndex(
                    (stage) =>
                        stage.name === currentUserRequest.currentStageName,
                );

                try {
                    await requestResolver.stages[stageResolverIndex]?.handler(
                        { message: msg },
                        currentUserRequest,
                    );
                    const nextStage =
                        requestResolver.stages[stageResolverIndex + 1];

                    if (nextStage.sendPrecondition) {
                        await nextStage.sendPrecondition();
                    }
                } catch {}
            }
        }

        const opts: TelegramBot.SendAnimationOptions = {
            reply_markup: {
                // inline_keyboard: [
                keyboard: [
                    [{ text: 'One' }],
                    [{ text: 'Two' }],
                    // [{ text: 'One', callback_data: 'hello' }],
                    // [{ text: 'Two', callback_data: 'bro' }],
                ],
            },
        };

        if (msg.from?.id && msg.chat.id) {
            await this.telegramService.replyToChannelMember(
                'Original Text',
                msg.chat.id,
                msg.from.id,
                opts,
            );
        }
    }
}
