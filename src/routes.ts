import { Router } from 'express';
import {
  sendNotificationDiscord,
  sendNotificationDiscordV2,
} from './Controller/Sentry';

const router = Router();

router.post(
  '/api/v1/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return sendNotificationDiscord.handleSendNotification(request, response);
  },
);

router.post(
  '/api/v2/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return sendNotificationDiscordV2.handleSendNotification(request, response);
  },
);

router.get('/', (request, response) => {
  return response.json({ message: 'Hello Word!!' });
});

export { router };
