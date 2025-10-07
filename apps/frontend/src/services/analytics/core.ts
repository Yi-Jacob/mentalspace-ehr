import { AnalyticsEvent, AnalyticsSummary } from './types';
import { SessionManager } from './sessionManager';
import { AnalyticsUtils } from './utils';

export class AnalyticsCore {
  private events: AnalyticsEvent[] = [];
  private sessionManager: SessionManager;
  private maxEvents = 2000;
  private batchSize = 20;
  private flushInterval = 60000; // 1 minute
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionManager = new SessionManager();
    this.startFlushTimer();
    this.setupEventListeners();
    this.trackSessionStart();
  }

  private setupEventListeners(): void {
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

  trackEvent(name: string, category: AnalyticsEvent['category'], properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      name,
      category,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionManager.getCurrentSession().id,
      userId: this.sessionManager.getCurrentSession().userId,
    };

    this.events.unshift(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
  }

  private trackSessionStart(): void {
    const session = this.sessionManager.getCurrentSession();
    this.trackEvent('session_start', 'user_action', {
      sessionId: session.id,
      timestamp: session.startTime,
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

  endSession(): void {
    this.sessionManager.endSession();
    const session = this.sessionManager.getCurrentSession();
    
    this.trackEvent('session_end', 'user_action', {
      sessionId: session.id,
      duration: this.sessionManager.getSessionDuration(),
      pageViews: session.pageViews,
      interactions: session.interactions,
      timestamp: session.endTime,
    });

    this.flushEvents();
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = this.events.splice(0, this.batchSize);
    
    try {
      // In a real implementation, you would send to analytics service
      console.log('Would send analytics events:', eventsToSend);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Put events back to retry later
      this.events.unshift(...eventsToSend);
    }
  }

  getAnalyticsSummary(): AnalyticsSummary {
    const recentEvents = AnalyticsUtils.filterRecentEvents(this.events);
    const session = this.sessionManager.getCurrentSession();

    const eventsByCategory = recentEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: recentEvents.length,
      eventsByCategory,
      currentSession: {
        duration: this.sessionManager.getSessionDuration(),
        pageViews: session.pageViews,
        interactions: session.interactions,
      },
    };
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getSessionManager(): SessionManager {
    return this.sessionManager;
  }

  clearEvents(): void {
    this.events = [];
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.endSession();
  }
}
