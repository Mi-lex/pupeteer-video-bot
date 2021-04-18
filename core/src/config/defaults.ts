import { join } from 'path';
import {
    THREE_MINUTES_IN_MS,
    THREE_SECONDS_MS,
} from '../common/constants/time.const';
import { STATIC_DIR } from '../common/constants/path.const';

const DEFAULT_VIEWPORT_WIDTH = 1280;
const DEFAULT_VIEWPORT_HEIGHT = 720;
const DEFAULT_MAX_SIMULTANEOUS = 4;

export const PUPPETEER_DEFAULTS = {
    viewport: {
        width: Number(process.env.VIEWPORT_WIDTH) || DEFAULT_VIEWPORT_WIDTH,
        height: Number(process.env.VIEWPORT_HEIGHT) || DEFAULT_VIEWPORT_HEIGHT,
    },
    session: {
        url: process.env.DEFAULT_URL,
        Id: 'autotest',
        role: process.env.DEFAULT_ROLE || 'presenter',
    },
    host: {
        concurrency: process.env.MAX_SIMULTANEOUS || DEFAULT_MAX_SIMULTANEOUS,
    },
    chromiumArgs: process.env.CHROMEARGS || [
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
    USER_DATA_DIR: `/tmp/mindbot/${Date.now()}`,
    BOT_TIMEOUT: THREE_MINUTES_IN_MS,
};
