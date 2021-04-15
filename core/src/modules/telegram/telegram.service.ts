import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import env from '../../config/env';

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    private readonly bot: TelegramBot;

    constructor() {
        this.chatId = env.TELEGRAM_CHAT_ID;
        this.bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN);
    }

    sendMessage(message: string) {
        return this.bot.sendMessage(this.chatId, message);
    }

    sendPhoto(photo: string | Buffer) {
        return this.bot.sendPhoto(this.chatId, photo);
    }
}
