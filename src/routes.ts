import { Router } from 'express';
import { sendNotificationDiscord } from './Controller/Sentry';

const router = Router();

router.post(
  '/api/v1/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return sendNotificationDiscord.handleSendNotification(request, response);
  },
);

router.get('/', (_, response) => {
  return response.json({ message: 'Integration Webhook Global' });
});

export { router };
