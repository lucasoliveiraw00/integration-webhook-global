import { SendNotificationDiscordController } from './SendNotificationDiscordController';
import { SendNotificationDiscordV2Controller } from './SendNotificationDiscordV2Controller';

const sendNotificationDiscord = new SendNotificationDiscordController();
const sendNotificationDiscordV2 = new SendNotificationDiscordV2Controller();

export { sendNotificationDiscord, sendNotificationDiscordV2 };
