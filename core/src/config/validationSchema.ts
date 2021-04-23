import * as Joi from 'joi';

/* eslint-disable no-magic-numbers */
export default Joi.object({
    // common
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
    PROJECT_NAME: Joi.string().default('Load bot'),
    PORT: Joi.number().default(80),
    API_DOC_PATH: Joi.string().default('api/docs'),
    // telegram
    TELEGRAM_CHAT_ID: Joi.string(),
    TELEGRAM_BOT_TOKEN: Joi.string(),
    TELEGRAM_MAX_MESSAGE_LENGTH: Joi.number().default(4096),
});
