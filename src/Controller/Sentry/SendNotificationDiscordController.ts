import { Request, Response } from 'express';
import axios from 'axios';

type TRequest = Request & {
  body: {
    project_name: string;
    message: string;
    url: string;
    level: string;
    event: {
      received: number;
      tags: string[];
      user: {
        username: string;
      };
    };
  };
  params?: {
    id?: string;
    token?: string;
  };
};

interface SendNotificationDiscord {
  handleSendNotification: (
    request: TRequest,
    response: Response,
  ) => Promise<Response>;
}

const COLORS = {
  debug: parseInt('fbe14f', 16),
  info: parseInt('2788ce', 16),
  warning: parseInt('f18500', 16),
  error: parseInt('e03e2f', 16),
  fatal: parseInt('d20f2a', 16),
};

export class SendNotificationDiscordController
  implements SendNotificationDiscord
{
  constructor() {}

  async handleSendNotification(
    request: TRequest,
    response: Response,
  ): Promise<Response> {
    try {
      const { body } = request;

      if (!request?.params) throw new Error('Request Invalid');

      const { id, token } = request.params;

      const payload = {
        username: 'Sentry',
        avatar_url: `https://github.com/lucasoliveiraw00/transfer-notification/blob/main/public/assets/img/sentry/sentry-icon.png`,
        embeds: [
          {
            title: body.project_name,
            type: 'rich',
            description: body.message,
            url: body.url,
            timestamp: new Date(body.event.received * 1000).toISOString(),
            color: COLORS[body.level] || COLORS.error,
            footer: {
              icon_url: 'https://github.com/fluidicon.png',
              text: 'transfer-notification',
            },
            fields: [],
          },
        ],
      };

      if (body.event.user) {
        payload.embeds[0].fields.push({
          name: '**User**',
          value: body.event.user.username,
        });
      }

      if (body.event.tags) {
        body.event.tags.forEach(([key, value]) => {
          payload.embeds[0].fields.push({
            name: key,
            value,
            inline: true,
          });
        });
      }

      axios.post(`https://discord.com/api/webhooks/${id}/${token}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.status(200).send();
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
