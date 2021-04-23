import { join } from 'path';
import { registerAs } from '@nestjs/config';
import {
    THREE_SECONDS_MS,
    THREE_MINUTES_IN_MS,
} from './../common/constants/time.const';
import { STATIC_DIR } from './../common/constants/path.const';

/* eslint-disable no-magic-numbers */
export default registerAs('pupeteer', () => ({
    viewport: {
        width: Number(process.env.VIEWPORT_WIDTH) || 1280,
        height: Number(process.env.VIEWPORT_HEIGHT) || 720,
    },
    host: {
        concurrency: process.env.MAX_SIMULTANEOUS || 4,
    },
    chromiumArgs: [
        '--disable-infobars',
        '--ignore-certificate-errors',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        `--use-file-for-fake-video-capture=${join(STATIC_DIR, 'bow.y4m')}`,
        '--incognito',
        '--no-sandbox',
    ],
    waitForElementTimeoutMs:
        Number(process.env.TIMEOUT_DELAY) || THREE_SECONDS_MS,
    userDataDir: `/tmp/mindbot/${Date.now()}`,
    botTimeout: THREE_MINUTES_IN_MS,
}));
