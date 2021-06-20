import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { Telegraf, Scenes, session, Context, Composer } from 'telegraf';
import telegramConfig from '../../config/telegram.config';

interface MyContext extends Context {
    // declare scene type
    scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>;
    // declare wizard type
    wizard: Scenes.WizardContextWizard<MyContext>;
}

const stepHandler = new Composer<MyContext>();
stepHandler.action('next', async (ctx) => {
    await ctx.reply('Step 2. Via inline button');
    return ctx.wizard.next();
});
stepHandler.command('next', async (ctx) => {
    await ctx.reply('Step 2. Via command');
    return ctx.wizard.next();
});
stepHandler.use((ctx) =>
    ctx.replyWithMarkdown('Press `Next` button or type /next'),
);

const contactDataWizard = new Scenes.WizardScene<MyContext>(
    'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        // validation exampl
        // ctx.mes
        ctx.reply('Please enter name for real');
        // ctx.scene.leave();
        // if (ctx.message) {()
        //     ctx.scene.leave('CONTACT_DATA_WIZARD_SCENE_ID');()
        //     return;()
        // }
        // ctx.wizard.state.contactData.fio = ctx.message.text;
        // ctx.reply('Enter your e-mail');
        // return ctx.wizard.next();
        ctx.wizard.next();
    },
    // stepHandler,
    (ctx) => {
        ctx.reply('second one');
        ctx.wizard.next();
    },
);

contactDataWizard.enter((ctx) => ctx.reply('step 1'));

const stage = new Scenes.Stage([contactDataWizard]);

@Injectable()
export class TelegramService {
    private readonly chatId: string;
    public readonly bot: Telegraf;

    constructor(
        @Inject(telegramConfig.KEY)
        private readonly config: ConfigType<typeof telegramConfig>,
    ) {
        this.chatId = this.config.chatId || '';
        this.bot = new Telegraf(this.config.botToken!);
        this.bot.use(session());
        // @ts-ignore
        this.bot.use(stage.middleware());
        // @ts-ignore
        // this.bot.command('oldschool', (ctx) => ctx.reply('Hello'));
        this.bot.command('test', (ctx) => {
            // ctx.reply('test started');
            // Scenes.Stage.enter('CONTACT_DATA_WIZARD_SCENE_ID');
            // @ts-ignore
            ctx.scene.enter('CONTACT_DATA_WIZARD_SCENE_ID');
        });
        this.bot.command('lv', (ctx) => {
            // @ts-ignore
            ctx.scene.leave('CONTACT_DATA_WIZARD_SCENE_ID');
        });
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
}

interface SourceBuffer {
    source: Buffer;
}
