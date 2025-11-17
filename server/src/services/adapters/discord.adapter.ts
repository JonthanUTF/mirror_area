import { BaseAdapter } from './base.adapter';

export class DiscordAdapter extends BaseAdapter {
  serviceName = 'Discord';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement Discord action checking
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // TODO: Implement Discord reaction execution
  }
}
