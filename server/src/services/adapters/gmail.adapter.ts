import { BaseAdapter } from './base.adapter';

export class GmailAdapter extends BaseAdapter {
  serviceName = 'Gmail';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement Gmail action checking
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // TODO: Implement Gmail reaction execution
  }
}
