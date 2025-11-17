import { BaseAdapter } from './base.adapter';

export class TimerAdapter extends BaseAdapter {
  serviceName = 'Timer';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement Timer action checking (cron-based)
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // Timer doesn't have reactions
    throw new Error('Timer service does not support reactions');
  }
}
