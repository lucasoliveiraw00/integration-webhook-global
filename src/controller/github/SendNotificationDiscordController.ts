import { Request, Response } from 'express';

import { MessageEmbed, WebhookClient } from 'discord.js';

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
      case 'QUEUED':
        return parseInt('2788ce', 16);
      case 'STARTED':
        return parseInt('b39191', 16);
      case 'COMPLETED':
        return parseInt('24942c', 16);
      case 'FINALIZED':
        return parseInt('33d33e', 16);
      case 'FAILURE':
        return parseInt('D33833', 16);
      default:
        return parseInt('FF715B', 16);
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

      embed.setAuthor('Github → Discord', '', 'https://www.jenkins.io/');

      embed.setTitle(this._cap('Github', 250));

      console.log(JSON.stringify(body));
      // embed.addField('Extras', JSON.stringify(body), true);

      const webhookClient = new WebhookClient({ id, token });
      const baseUrl = request.protocol + '://' + request.headers.host;

      webhookClient.send({
        username: 'GitHub',
        content: `Deploy Project ${this._cap('GitHub', 250)} #${'build.number'}
        `,
        avatarURL: `${baseUrl}/static/assets/img/jenkins/jenkins-icon.png`,
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
