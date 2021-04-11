import { HttpService } from '@nestjs/common';
import env from 'src/config/env';

export const sendTelegramMessage = async (
    message: string,
    httpService: HttpService,
    chatId: string = env.TELEGRAM_CHAT_ID,
    botToken: string = env.TELEGRAM_BOT_TOKEN,
) => {
    return httpService
        .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: message.substring(0, env.TELEGRAM_MAX_MESSAGE_LENGTH),
        })
        .toPromise();
};
