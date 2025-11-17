import { Injectable } from '@nestjs/common';
import { BaseServiceAdapter } from './base.adapter';

@Injectable()
export class GitHubAdapter extends BaseServiceAdapter {
  serviceName = 'GitHub';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement GitHub action checking with @octokit/rest
    // For now, return false to allow compilation
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // TODO: Implement GitHub reaction execution with @octokit/rest
  }
}
