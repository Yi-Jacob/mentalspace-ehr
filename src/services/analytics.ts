
interface AnalyticsEvent {
  id: string;
  name: string;
  category: 'page_view' | 'user_action' | 'feature_usage' | 'error' | 'performance';
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  interactions: number;
  userId?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private session: UserSession;
  private maxEvents = 2000;
  private batchSize = 20;
  private flushInterval = 60000; // 1 minute
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.session = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
    };

    this.startFlushTimer();
    this.trackSessionStart();

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('session_pause', 'user_action');
      } else {
        this.trackEvent('session_resume', 'user_action');
      }
    });

    // Track session end on beforeunload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    this.session.pageViews++;
    
    this.trackEvent('page_view', 'page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  }

  // Track user interactions
  trackClick(element: string, location?: string) {
    this.session.interactions++;
    
    this.trackEvent('click', 'user_action', {
      element,
      location,
      timestamp: Date.now(),
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errors?: string[]) {
    this.trackEvent('form_submit', 'user_action', {
      formName,
      success,
      errors,
      timestamp: Date.now(),
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>) {
    this.trackEvent(`${feature}_${action}`, 'feature_usage', {
      feature,
      action,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  // Track search queries
  trackSearch(query: string, results: number, category?: string) {
    this.trackEvent('search', 'user_action', {
      query,
      results,
      category,
      timestamp: Date.now(),
    });
  }

  // Track errors for analytics
  trackError(errorType: string, message: string, stack?: string) {
    this.trackEvent('error_occurred', 'error', {
      errorType,
      message,
      stack,
      timestamp: Date.now(),
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>) {
    this.trackEvent('performance_metric', 'performance', {
      metric,
      value,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  // Generic event tracking
  trackEvent(name: string, category: AnalyticsEvent['category'], properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      name,
      category,
      properties,
      timestamp: Date.now(),
      sessionId: this.session.id,
      userId: this.session.userId,
    };

    this.events.unshift(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    console.log('Analytics event:', event);
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.session.userId = userId;
    
    this.trackEvent('user_identified', 'user_action', {
      userId,
      timestamp: Date.now(),
    });
  }

  // Track session start
  private trackSessionStart() {
    this.trackEvent('session_start', 'user_action', {
      sessionId: this.session.id,
      timestamp: this.session.startTime,
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  // End current session
  private endSession() {
    this.session.endTime = Date.now();
    
    this.trackEvent('session_end', 'user_action', {
      sessionId: this.session.id,
      duration: this.session.endTime - this.session.startTime,
      pageViews: this.session.pageViews,
      interactions: this.session.interactions,
      timestamp: this.session.endTime,
    });

    this.flushEvents();
  }

  // Start automatic flushing timer
  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  // Flush events to external service
  private async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = this.events.splice(0, this.batchSize);
    
    try {
      // In a real implementation, you would send to analytics service
      // Example: await this.sendToAnalyticsService(eventsToSend);
      console.log('Would send analytics events:', eventsToSend);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Put events back to retry later
      this.events.unshift(...eventsToSend);
    }
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp > oneDayAgo);

    const eventsByCategory = recentEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: recentEvents.length,
      eventsByCategory,
      currentSession: {
        duration: now - this.session.startTime,
        pageViews: this.session.pageViews,
        interactions: this.session.interactions,
      },
    };
  }

  // Get event count by category
  getEventCount(category: AnalyticsEvent['category']): number {
    return this.events.filter(e => e.category === category).length;
  }

  // Get feature usage statistics
  getFeatureUsageStats(): Record<string, number> {
    const featureEvents = this.events.filter(e => e.category === 'feature_usage');
    const stats: Record<string, number> = {};
    
    featureEvents.forEach(event => {
      const feature = event.properties?.feature || event.name;
      stats[feature] = (stats[feature] || 0) + 1;
    });
    
    return stats;
  }

  // Get user action statistics
  getUserActionStats(): Record<string, number> {
    const actionEvents = this.events.filter(e => e.category === 'user_action');
    const stats: Record<string, number> = {};
    
    actionEvents.forEach(event => {
      const action = event.properties?.action || event.name;
      stats[action] = (stats[action] || 0) + 1;
    });
    
    return stats;
  }

  // Get events by category
  getEventsByCategory(category: AnalyticsEvent['category']): AnalyticsEvent[] {
    return this.events.filter(e => e.category === category);
  }

  // Export all events
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Clear all events
  clearEvents() {
    this.events = [];
  }

  // Destroy service
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.endSession();
  }
}

export const analytics = new AnalyticsService();
