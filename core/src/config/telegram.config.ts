import { registerAs } from '@nestjs/config';

/* eslint-disable no-magic-numbers */
export default registerAs('telegram', () => ({
    chatId: process.env.TELEGRAM_CHAT_ID,
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    maxMessageLength: process.env.TELEGRAM_MAX_MESSAGE_LENGTH,
}));
