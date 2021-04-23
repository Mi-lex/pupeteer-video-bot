import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import telegramConfig from '../../config/telegram.config';

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    private readonly bot: TelegramBot;

    constructor(
        @Inject(telegramConfig.KEY)
        private readonly config: ConfigType<typeof telegramConfig>,
    ) {
        this.chatId = this.config.chatId || '';
        this.bot = new TelegramBot(`${this.config.botToken}`);
    }

    sendMessage(message: string) {
        if (this.bot) return this.bot.sendMessage(this.chatId, message);
        return false;
    }

    sendPhoto(photo: string | Buffer) {
        if (this.bot) return this.bot.sendPhoto(this.chatId, photo);
        return false;
    }
}
