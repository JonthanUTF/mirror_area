import { BaseAdapter } from './base.adapter';

export class WeatherAdapter extends BaseAdapter {
  serviceName = 'Weather';

  async checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }> {
    // TODO: Implement Weather action checking
    return { triggered: false };
  }

  async executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void> {
    // Weather doesn't have reactions
    throw new Error('Weather service does not support reactions');
  }
}
