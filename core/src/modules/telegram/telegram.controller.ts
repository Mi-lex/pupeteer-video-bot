import { Controller } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { TelegramService } from './telegram.service';

const contactDataWizard = new Scenes.WizardScene(
    'CONTACT_DATA_WIZARD_SCENE_ID', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
        // validation exampl
        // ctx.mes
        ctx.reply('Please enter name for real');
        if (ctx.message) {
            ctx.reply('Please enter name for real');
            return;
        }
        // ctx.wizard.state.contactData.fio = ctx.message.text;
        // ctx.reply('Enter your e-mail');
        // return ctx.wizard.next();
        ctx.wizard.next();
    },
    (ctx) => {
        ctx.reply('second one');
        ctx.wizard.next();
    },
);

// @ts-ignore
const stage = new Scenes.Stage([contactDataWizard], {
    default: 'CONTACT_DATA_WIZARD_SCENE_ID',
});

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {
        // @ts-ignore
        this.telegramService.bot.use(stage.middleware());
    }
}
