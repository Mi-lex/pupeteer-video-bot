import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import telegramConfig from '../../config/telegram.config';

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    public readonly bot: Telegraf;

    constructor(
        @Inject(telegramConfig.KEY)
        private readonly config: ConfigType<typeof telegramConfig>,
    ) {
        this.chatId = this.config.chatId || '';
        this.bot = new Telegraf(this.config.botToken!);
    }

    sendMessage(chatId: string | number, message: string) {
        return this.bot.telegram.sendMessage(chatId, message);
    }

    sendMessageToChannel(message: string) {
        if (this.bot) {
            return this.sendMessage(this.chatId, message);
        }
        return false;
    }

    async replyToChannelMember(
        message: string,
        chatId: string,
        userId: number,
    ) {
        const isUserChatMember = await this.getChatMember(userId);

        if (isUserChatMember) {
            return this.sendMessage(chatId, message);
        }

        return false;
    }

    sendPhotoToChannel(photo: string | SourceBuffer) {
        if (this.bot) return this.bot.telegram.sendPhoto(this.chatId, photo);
        return false;
    }

    getChatMember(userId: number) {
        return this.bot.telegram.getChatMember(this.chatId, userId);
    }
}

interface SourceBuffer {
    source: Buffer;
}
