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
      const { build } = body;

      const embed = new MessageEmbed();

      embed.setAuthor('Jenkins → Discord', '', 'https://www.jenkins.io/');

      embed.setTitle(this._cap(body.name, 250));
      embed.setURL(body.build.full_url);
      embed.setTimestamp(
        build?.timestamp ? new Date(build?.timestamp) : new Date(),
      );
      embed.setColor(this._getColor(build.phase));
      embed.addField('Process', `${build.phase}`, true);
      embed.addField('Number Deploy', `#${build.number}`, true);

      if (build?.duration) embed.addField('Duration', `#${build.duration}`);

      if (build.scm?.branch) {
        embed.addField(
          'Git',
          this._cap(
            `
              \n
              Branch: ${build.scm.branch}
              Commit: ${build.scm.commit}
              Link: ${build.scm.url}
            `,
            1024,
          ),
        );
      }

      const webhookClient = new WebhookClient({ id, token });
      const baseUrl = request.protocol + '://' + request.headers.host;

      const phase = build.phase
        .toLowerCase()
        .split(' ')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');

      webhookClient.send({
        username: 'Jenkins',
        content: `${phase}: Job ${this._cap(body.name, 250)} #${build.number}
        `,
        avatarURL: `${baseUrl}/static/assets/img/jenkins/sss-icon.png`,
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
