import { config as configDotEnv } from 'dotenv';
import * as envalid from 'envalid';

configDotEnv();

const { port, str, num } = envalid;
const env = envalid.cleanEnv(process.env, {
    PROJECT_NAME: str({ default: 'Load bot', desc: 'Project name' }),
    PORT: port({ default: 3001, desc: 'Application port' }),
    API_DOC_PATH: str({ default: 'api/docs', desc: 'Swagger docs path' }),
    TELEGRAM_CHAT_ID: str({ default: '', desc: 'Telegram chat id' }),
    TELEGRAM_BOT_TOKEN: str({ default: '', desc: 'Telegram bot token' }),
    TELEGRAM_MAX_MESSAGE_LENGTH: num({ default: 4096 }),
});

export default env;

export const Env = typeof env;
