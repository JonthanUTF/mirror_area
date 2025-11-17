import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AboutController {
  @Get('about.json')
  getAbout(@Req() req: Request) {
    return {
      client: {
        host: req.ip || req.connection.remoteAddress,
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services: [
          {
            name: 'github',
            actions: [
              {
                name: 'new_issue',
                description: 'A new issue is created on the repository',
              },
              {
                name: 'new_pr',
                description: 'A new pull request is opened',
              },
            ],
            reactions: [
              {
                name: 'create_issue',
                description: 'Create a new issue',
              },
              {
                name: 'comment_issue',
                description: 'Comment on an issue',
              },
            ],
          },
          {
            name: 'gmail',
            actions: [
              {
                name: 'new_email_with_attachment',
                description: 'A new email with attachment is received',
              },
            ],
            reactions: [
              {
                name: 'send_email',
                description: 'Send an email',
              },
            ],
          },
        ],
      },
    };
  }
}