export abstract class BaseServiceAdapter {
  abstract serviceName: string;

  // Check if an action condition is met
  abstract checkAction(
    actionName: string,
    params: Record<string, any>,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<{ triggered: boolean; data?: any }>;

  // Execute a reaction
  abstract executeReaction(
    reactionName: string,
    params: Record<string, any>,
    actionData: any,
    tokens: { accessToken: string; refreshToken: string },
  ): Promise<void>;

  // Refresh OAuth tokens if needed
  refreshTokens?(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}

// Alias for backward compatibility
export { BaseServiceAdapter as BaseAdapter };