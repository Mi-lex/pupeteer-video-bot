import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { LaunchOptions, Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import {
    ONE_MINUTE_MS,
    ONE_SECOND_MS,
} from '../../common/constants/time.const';
import { wait } from '../../common/helpers/time.helper';
import pupeteerConfig from '../../config/pupeteer.config';
import { PinoLoggerService } from './../logger/pino-logger.service';

import { CreateBotDto } from './dto/create-bot.dto';
import { TelegramService } from './../telegram/telegram.service';

const BOT_TIMEOUT_MS = 3_500_500;

interface ExecuteTaskArgs<JobData> {
    page: Page;
    data: JobData;
    worker: {
        id: number;
    };
}

type XPath = {
    type: string;
    match: string;
    attr?: string;
    clickable: boolean;
    waitTimeOut?: number;
    captureBeforeTimeout?: boolean;
};

type BotAction = (page: Page) => Promise<void>;
@Injectable()
export class BotsService {
    private _cluster: Cluster | null = null;
    private _xpaths: XPath[] = [
        {
            type: 'button',
            match: 'Continue',
            clickable: true,
            captureBeforeTimeout: true,
        },
        {
            type: 'button',
            match: 'Continue',
            clickable: true,
            captureBeforeTimeout: true,
        },
        {
            type: 'button',
            match: 'Join',
            clickable: true,
            captureBeforeTimeout: true,
        },
        {
            type: 'div',
            match: 'video-chat',
            attr: 'class',
            clickable: false,
            waitTimeOut: ONE_MINUTE_MS,
            captureBeforeTimeout: true,
        },
    ];

    constructor(
        @Inject(pupeteerConfig.KEY)
        private readonly config: ConfigType<typeof pupeteerConfig>,

        private readonly telegramService: TelegramService,
        private readonly pinoLoggerService: PinoLoggerService,
    ) {}

    async sendPageScreenShot(page: Page) {
        const b64string = await page.screenshot({ encoding: 'base64' });

        if (b64string) {
            const screenBuffer = Buffer.from(b64string as string, 'base64');

            await this.telegramService.sendPhoto(screenBuffer);
        }
    }

    getXpathLabel = ({ type, match, attr }: XPath) =>
        `//${type}[contains(${attr || '.'}, "${match}")]`;

    async createCluster() {
        await this.closeCluster();
        this._cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_BROWSER,
            maxConcurrency: 10,
            timeout: this.config.botTimeout,
            monitor: false,
            puppeteerOptions: {
                userDataDir: this.config.userDataDir,
                args: this.config.chromiumArgs,
                /**
                 * error in pupeteer-cluster, it's supposed to take
                 * LaunchOptions & BrowserLaunchArgumentOptions & BrowserConnectOptions
                 * instead of just LaunchOptions
                 */
            } as LaunchOptions,
        });

        this._cluster.on('taskerror', (err, data) => {
            this.pinoLoggerService.error(
                `Error crawling ${data}: ${err.message}`,
            );
        });

        return this._cluster;
    }

    async subscribeBotToActionArray(
        page: Page,
        actionList: BotAction[],
        subscribeTimeOut: number,
    ): Promise<void> {
        const ITERATIONS_AMOUNT = Math.max(
            Math.round(subscribeTimeOut / ONE_SECOND_MS),
            1,
        );

        for (let i = 0; i < ITERATIONS_AMOUNT; i++) {
            if (actionList.length) {
                await Promise.all(actionList.map((action) => action(page)));
                actionList.splice(0, actionList.length);
                await ONE_SECOND_MS;
            }
        }
    }

    async followPath(page: Page, xpaths: XPath[]) {
        for await (const xpath of xpaths) {
            const { waitTimeOut, clickable, captureBeforeTimeout } = xpath;
            const waitElementTimeout =
                waitTimeOut || this.config.waitForElementTimeoutMs;

            const xPathLabel = this.getXpathLabel(xpath);

            // Capture screenshot second before element timeout
            if (captureBeforeTimeout) {
                const beforeTimeOut = Math.max(
                    waitElementTimeout - ONE_SECOND_MS,
                    ONE_SECOND_MS,
                );

                setTimeout(
                    this.sendPageScreenShot.bind(this, page),
                    beforeTimeOut,
                );
            }

            const element = await page.waitForXPath(xPathLabel, {
                timeout: waitElementTimeout,
            });

            if (element && clickable) {
                await element.click();
            }
        }
    }

    getExecuteTaskFunc = () => async ({
        page,
        data,
    }: ExecuteTaskArgs<string>) => {
        await page.setViewport(this.config.viewport);
        await page.goto(data);

        await this.followPath(page, this._xpaths);
        await wait(BOT_TIMEOUT_MS);
    };

    async create(createBotDto: CreateBotDto) {
        const { url, amount = 1 } = createBotDto;

        const botCluster = await this.createCluster();
        await Promise.all(
            Array(amount)
                .fill('')
                .map(async () =>
                    botCluster.execute(url, this.getExecuteTaskFunc()),
                ),
        );
    }

    async closeCluster() {
        if (this._cluster) {
            await this._cluster.close();
        }
    }
}
