import { Router } from 'express';

import { Sentry } from './controller/sentry';
import { Jenkins } from './controller/jenkins';
import { GitHub } from './controller/github';

const router = Router();

router.post(
  '/api/v1/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return Sentry.handleSendNotification(request, response);
  },
);

router.post(
  '/api/v1/webhook/jenkins/send-discord/:id/:token',
  (request, response) => {
    return Jenkins.handleSendNotification(request, response);
  },
);

router.post(
  '/api/v1/webhook/github/send-discord/:id/:token',
  (request, response) => {
    return GitHub.handleSendNotification(request, response);
  },
);

router.get('/', (_, response) => {
  return response.json({ message: 'Integration Webhook Global' });
});

export { router };
