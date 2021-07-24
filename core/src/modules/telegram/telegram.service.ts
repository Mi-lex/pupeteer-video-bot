import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import {
    Telegraf,
    Scenes,
    session,
    Context,
    Composer,
    Middleware,
} from 'telegraf';
import telegramConfig from '../../config/telegram.config';

interface SubscribeOptions {
    sceneId: string;
}
interface MyContext extends Context {
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<MyContext>;
}

const stepHandler = new Composer<MyContext>();
stepHandler.action('next', async (ctx) => {
    await ctx.reply('Step 2 through action');

    ctx.state.contactInfo;
    return ctx.wizard.next();
});
stepHandler.command('next', async (ctx) => {
    await ctx.reply('Step 2 through command');
    return ctx.wizard.next();
});
stepHandler.use((ctx) =>
    ctx.replyWithMarkdown('Press `Next` button or type /next'),
);

const contactsSteps: Middleware<MyContext>[] = [
    (ctx) => {
        ctx.reply('Enter your name');
        ctx.wizard.next();
    },
    stepHandler,
    (ctx) => {
        ctx.reply('Third one');
        ctx.wizard.next();
    },
];

const CONTACT_SCENE_ID = 'contact';

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    public readonly bot: Telegraf<MyContext>;

    constructor(
        @Inject(telegramConfig.KEY)
        private readonly config: ConfigType<typeof telegramConfig>,
    ) {
        this.chatId = this.config.chatId || '';
        this.bot = new Telegraf(this.config.botToken!);

        const anotherScene = this.subscribeToWizardScene(contactsSteps, {
            sceneId: CONTACT_SCENE_ID,
        });

        const stage = new Scenes.Stage([anotherScene]);

        this.bot.use(session());
        this.bot.use(stage.middleware());

        this.bot.command(
            'boom',
            Scenes.Stage.enter<MyContext>(CONTACT_SCENE_ID),
        );

        this.bot.launch();
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

    subscribeToWizardScene(
        steps: Middleware<MyContext>[],
        options: SubscribeOptions,
    ) {
        const { sceneId } = options;

        const scene = new Scenes.WizardScene<MyContext>(sceneId, ...steps);

        return scene;
    }
}

interface SourceBuffer {
    source: Buffer;
}
