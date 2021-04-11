import { config as configDotEnv } from 'dotenv';
import * as envalid from 'envalid';

configDotEnv();

const { port, str } = envalid;
const env = envalid.cleanEnv(process.env, {
    PROJECT_NAME: str({ default: 'Load bot', desc: 'Project name' }),
    PORT: port({ default: 3001, desc: 'Application port' }),
    API_DOC_PATH: str({ default: 'api/docs', desc: 'Swagger docs path' }),
});

export default env;

export const Env = typeof env;
