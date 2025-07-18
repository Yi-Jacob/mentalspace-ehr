
export interface AnalyticsEvent {
  id: string;
  name: string;
  category: 'page_view' | 'user_action' | 'feature_usage' | 'error' | 'performance';
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  interactions: number;
  userId?: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  currentSession: {
    duration: number;
    pageViews: number;
    interactions: number;
  };
}
