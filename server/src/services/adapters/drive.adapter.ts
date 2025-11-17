import { BaseAdapter } from './base.adapter';

export class DriveAdapter extends BaseAdapter {
  serviceName = 'Google Drive';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement Drive action checking
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // TODO: Implement Drive reaction execution
  }
}
