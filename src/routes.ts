import { Router } from 'express';
import { sendNotificationDiscord } from './Controller/Sentry';

const router = Router();

router.post(
  '/api/webhooks/sentry/send-discord/:id/:token',
  (request, response) => {
    return sendNotificationDiscord.handleSendNotification(request, response);
  },
);

router.get('/', (request, response) => {
  return response.json({ message: 'Hello Word!!' });
});

export { router };
