import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import telegramConfig from '../../config/telegram.config';

type OnTextListener = (
    msg: TelegramBot.Message,
    match: RegExpExecArray | null,
) => void;

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    public readonly bot: TelegramBot;

    constructor(
        @Inject(telegramConfig.KEY)
        private readonly config: ConfigType<typeof telegramConfig>,
    ) {
        this.chatId = this.config.chatId || '';
        this.bot = new TelegramBot(`${this.config.botToken}`, {
            polling: true,
        });
    }

    sendMessageToChannel(
        message: string,
        options?: TelegramBot.SendMessageOptions,
    ) {
        if (this.bot) {
            return this.bot.sendMessage(this.chatId, message, options);
        }
        return false;
    }

    async replyToChannelMember(
        message: string,
        chatId: number,
        userId: number,
        options?: TelegramBot.SendAnimationOptions,
    ) {
        const isUserChatMember = await this.getChatMember(userId.toString());

        if (isUserChatMember) {
            return this.bot.sendMessage(chatId, message, options);
        }

        return false;
    }

    sendPhoto(photo: string | Buffer) {
        if (this.bot) return this.bot.sendPhoto(this.chatId, photo);
        return false;
    }

    getChatMember(userId: string) {
        return this.bot.getChatMember(this.chatId, userId);
    }

    onText(textRegex: RegExp, listener: OnTextListener) {
        return this.bot.onText(textRegex, listener);
    }
}
