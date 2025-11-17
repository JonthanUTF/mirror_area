import { Injectable } from '@nestjs/common';

@Injectable()
export class AboutService {
  getAboutInfo() {
    return {
      client: {
        host: process.env.CLIENT_HOST || 'localhost',
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services: [
          {
            name: 'GitHub',
            actions: [
              {
                name: 'new_push',
                description: 'Triggered when a new push is made to a repository',
              },
              {
                name: 'new_issue',
                description: 'Triggered when a new issue is created',
              },
            ],
            reactions: [
              {
                name: 'create_issue',
                description: 'Creates a new issue in a repository',
              },
            ],
          },
          {
            name: 'Gmail',
            actions: [
              {
                name: 'new_email',
                description: 'Triggered when a new email is received',
              },
            ],
            reactions: [
              {
                name: 'send_email',
                description: 'Sends an email',
              },
            ],
          },
          {
            name: 'Discord',
            actions: [
              {
                name: 'new_message',
                description: 'Triggered when a new message is sent in a channel',
              },
            ],
            reactions: [
              {
                name: 'send_message',
                description: 'Sends a message to a channel',
              },
            ],
          },
        ],
      },
    };
  }
}
