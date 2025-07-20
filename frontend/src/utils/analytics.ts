// Analytics utilities for tracking user behavior and application performance

export interface AnalyticsEvent {
  name: string;
  category: 'page_view' | 'user_action' | 'feature_usage' | 'error' | 'performance';
  properties?: Record<string, any>;
  timestamp: number;
}

export interface AnalyticsSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  pageViews: number;
  interactions: number;
  lastActivity: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private session: AnalyticsSession;
  private isEnabled: boolean = true;

  constructor() {
    this.session = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      lastActivity: Date.now()
    };
  }

  // Track page view
  trackPageView(path: string, title?: string): void {
    if (!this.isEnabled) return;

    this.session.pageViews++;
    this.session.lastActivity = Date.now();

    this.trackEvent('page_view', 'page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer
    });
  }

  // Track user interaction
  trackClick(element: string, location?: string): void {
    if (!this.isEnabled) return;

    this.session.interactions++;
    this.session.lastActivity = Date.now();

    this.trackEvent('click', 'user_action', {
      element,
      location
    });
  }

  // Track form submission
  trackFormSubmission(formName: string, success: boolean, errors?: string[]): void {
    if (!this.isEnabled) return;

    this.trackEvent('form_submit', 'user_action', {
      formName,
      success,
      errors
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.trackEvent(`${feature}_${action}`, 'feature_usage', {
      feature,
      action,
      ...metadata
    });
  }

  // Track error
  trackError(errorType: string, message: string, stack?: string): void {
    if (!this.isEnabled) return;

    this.trackEvent('error_occurred', 'error', {
      errorType,
      message,
      stack
    });
  }

  // Track performance metric
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    if (!this.isEnabled) return;

    this.trackEvent('performance_metric', 'performance', {
      metric,
      value,
      ...metadata
    });
  }

  // Generic event tracking
  trackEvent(name: string, category: AnalyticsEvent['category'], properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties,
      timestamp: Date.now()
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Set user ID
  setUserId(userId: string): void {
    this.session.userId = userId;
  }

  // Get analytics summary
  getAnalyticsSummary() {
    return {
      session: this.session,
      totalEvents: this.events.length,
      eventsByCategory: this.getEventsByCategory(),
      featureUsage: this.getFeatureUsageStats(),
      userActions: this.getUserActionStats()
    };
  }

  // Get events by category
  getEventsByCategory(category?: AnalyticsEvent['category']): AnalyticsEvent[] {
    if (category) {
      return this.events.filter(event => event.category === category);
    }
    return this.events;
  }

  // Get feature usage statistics
  getFeatureUsageStats(): Record<string, number> {
    const featureEvents = this.events.filter(event => event.category === 'feature_usage');
    const stats: Record<string, number> = {};

    featureEvents.forEach(event => {
      const feature = event.properties?.feature;
      if (feature) {
        stats[feature] = (stats[feature] || 0) + 1;
      }
    });

    return stats;
  }

  // Get user action statistics
  getUserActionStats(): Record<string, number> {
    const actionEvents = this.events.filter(event => event.category === 'user_action');
    const stats: Record<string, number> = {};

    actionEvents.forEach(event => {
      stats[event.name] = (stats[event.name] || 0) + 1;
    });

    return stats;
  }

  // Export events
  exportEvents(): string {
    return JSON.stringify({
      session: this.session,
      events: this.events
    }, null, 2);
  }

  // Clear events
  clearEvents(): void {
    this.events = [];
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send event to analytics service
  private sendEvent(event: AnalyticsEvent): void {
    // In a real implementation, this would send to an analytics service
    // For now, we'll just log to console
    console.log('Analytics Event:', event);
  }

  // Destroy analytics service
  destroy(): void {
    this.events = [];
    this.session = {
      sessionId: '',
      startTime: 0,
      pageViews: 0,
      interactions: 0,
      lastActivity: 0
    };
  }
}

export const analyticsService = new AnalyticsService(); 