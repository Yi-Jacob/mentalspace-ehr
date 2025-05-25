
export * from './types';
export * from './analyticsService';
export * from './sessionManager';
export * from './utils';
export * from './core';

import { AnalyticsService } from './analyticsService';

export const analytics = new AnalyticsService();
