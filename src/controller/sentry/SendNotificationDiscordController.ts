import { Request, Response } from 'express';

import { MessageEmbed, WebhookClient } from 'discord.js';

import * as parser from '../../utils/sentry/parser';

type TRequest = Request & {
  params: {
    id: string;
    token: string;
  };
};

interface SendNotificationDiscord {
  handleSendNotification: (
    request: TRequest,
    response: Response,
  ) => Promise<Response>;
  _cap(str: string, length: number): string;
  _getColor(level: string): number;
}

export class SendNotificationDiscordController
  implements SendNotificationDiscord
{
  constructor() {}

  _cap(str: string, length: number): string {
    if (str == null || str?.length <= length) {
      return str;
    }

    return str.substr(0, length - 1) + '\u2026';
  }

  _getColor(level: string): number {
    switch (level) {
      case 'debug':
        return parseInt('fbe14f', 16);
      case 'info':
        return parseInt('2788ce', 16);
      case 'warning':
        return parseInt('f18500', 16);
      case 'fatal':
        return parseInt('d20f2a', 16);
      case 'error':
      default:
        return parseInt('e03e2f', 16);
    }
  }

  async handleSendNotification(
    request: TRequest,
    response: Response,
  ): Promise<Response> {
    try {
      const { body } = request;

      if (!request?.params) throw new Error('Request Invalid');

      const { id, token } = request.params;

      const embed = new MessageEmbed();

      embed.setAuthor('Sentry → Discord', '', 'https://sentry.io/');

      embed.setTitle(this._cap(parser.getTitle(body), 250));
      embed.setURL(parser.getLink(body));
      embed.setTimestamp(parser.getTime(body));
      embed.setColor(this._getColor(parser.getLevel(body)));

      const fileLocation = parser.getFileLocation(body);
      embed.setDescription(
        `${fileLocation ? `\`📄 ${fileLocation}\`\n` : ''}\`\`\`${
          parser.getLanguage(body) ?? parser.getPlatform(body)
        }\n${this._cap(parser.getErrorCodeSnippet(body), 3900)}
    \`\`\``,
      );

      const location = parser.getErrorLocation(body, 7);
      embed.addField(
        'Stack',
        `\`\`\`${this._cap(location?.join('\n'), 1000)}\n\`\`\``,
      );

      const user = parser.getUser(body);
      if (user?.username) {
        embed.addField(
          'User',
          this._cap(`${user.username} ${user.id ? `(${user.id})` : ''}`, 1024),
          true,
        );
      }

      const tags = parser.getTags(body);
      if (Object.keys(tags).length > 0) {
        embed.addField(
          'Tags',
          this._cap(
            tags.map(([key, value]) => `${key}: ${value}`)?.join('\n'),
            1024,
          ),
          true,
        );
      }

      const extras = parser.getExtras(body);
      if (extras.length > 0) {
        embed.addField('Extras', this._cap(extras?.join('\n'), 1024), true);
      }

      const contexts = parser.getContexts(body);
      if (contexts.length > 0) {
        embed.addField('Contexts', this._cap(contexts?.join('\n'), 1024), true);
      }

      const release = parser.getRelease(body);
      if (release) {
        embed.addField('Release', this._cap(release, 1024), true);
      }

      const webhookClient = new WebhookClient({ id, token });
      const baseUrl = request.protocol + '://' + request.headers.host;

      webhookClient.send({
        username: 'Sentry',
        avatarURL: `${baseUrl}/static/assets/img/sentry/sentry-icon.png`,
        embeds: [embed],
      });

      return response.status(200).send();
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.',
      });
    }
  }
}
