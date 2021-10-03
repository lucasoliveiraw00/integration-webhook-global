'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.router = void 0;
const express_1 = require('express');
const Sentry_1 = require('./Controller/Sentry');
const router = (0, express_1.Router)();
exports.router = router;
router.post(
  '/api/v1/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return Sentry_1.sendNotificationDiscord.handleSendNotification(
      request,
      response,
    );
  },
);
router.post(
  '/api/v2/webhook/sentry/send-discord/:id/:token',
  (request, response) => {
    return Sentry_1.sendNotificationDiscordV2.handleSendNotification(
      request,
      response,
    );
  },
);
router.get('/', (request, response) => {
  return response.json({ message: 'Hello Word!!' });
});
