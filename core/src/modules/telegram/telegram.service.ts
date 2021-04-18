import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import vars from '../../config/vars';

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    private readonly bot: TelegramBot;

    constructor() {
        this.chatId = vars.TELEGRAM_CHAT_ID;
        this.bot = new TelegramBot(vars.TELEGRAM_BOT_TOKEN);
    }

    sendMessage(message: string) {
        return this.bot.sendMessage(this.chatId, message);
    }

    sendPhoto(photo: string | Buffer) {
        return this.bot.sendPhoto(this.chatId, photo);
    }
}
