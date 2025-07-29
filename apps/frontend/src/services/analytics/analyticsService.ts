
import { AnalyticsEvent } from './types';
import { AnalyticsCore } from './core';
import { AnalyticsUtils } from './utils';

export class AnalyticsService {
  private core: AnalyticsCore;

  constructor() {
    this.core = new AnalyticsCore();
  }

  // Page tracking methods
  trackPageView(path: string, title?: string): void {
    this.core.getSessionManager().incrementPageViews();
    
    this.core.trackEvent('page_view', 'page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  }

  // User interaction methods
  trackClick(element: string, location?: string): void {
    this.core.getSessionManager().incrementInteractions();
    
    this.core.trackEvent('click', 'user_action', {
      element,
      location,
      timestamp: Date.now(),
    });
  }

  trackFormSubmission(formName: string, success: boolean, errors?: string[]): void {
    this.core.trackEvent('form_submit', 'user_action', {
      formName,
      success,
      errors,
      timestamp: Date.now(),
    });
  }

  trackSearch(query: string, results: number, category?: string): void {
    this.core.trackEvent('search', 'user_action', {
      query,
      results,
      category,
      timestamp: Date.now(),
    });
  }

  // Feature tracking methods
  trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>): void {
    this.core.trackEvent(`${feature}_${action}`, 'feature_usage', {
      feature,
      action,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  // Error tracking methods
  trackError(errorType: string, message: string, stack?: string): void {
    this.core.trackEvent('error_occurred', 'error', {
      errorType,
      message,
      stack,
      timestamp: Date.now(),
    });
  }

  // Performance tracking methods
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.core.trackEvent('performance_metric', 'performance', {
      metric,
      value,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  // Generic event tracking
  trackEvent(name: string, category: AnalyticsEvent['category'], properties?: Record<string, any>): void {
    this.core.trackEvent(name, category, properties);
  }

  // User management
  setUserId(userId: string): void {
    this.core.getSessionManager().setUserId(userId);
    
    this.core.trackEvent('user_identified', 'user_action', {
      userId,
      timestamp: Date.now(),
    });
  }

  // Data retrieval methods
  getAnalyticsSummary() {
    return this.core.getAnalyticsSummary();
  }

  getEventCount(category: AnalyticsEvent['category']): number {
    return AnalyticsUtils.getEventCount(this.core.getEvents(), category);
  }

  getFeatureUsageStats(): Record<string, number> {
    return AnalyticsUtils.getFeatureUsageStats(this.core.getEvents());
  }

  getUserActionStats(): Record<string, number> {
    return AnalyticsUtils.getUserActionStats(this.core.getEvents());
  }

  getEventsByCategory(category: AnalyticsEvent['category']): AnalyticsEvent[] {
    return AnalyticsUtils.getEventsByCategory(this.core.getEvents(), category);
  }

  // Export and management methods
  exportEvents(): string {
    return this.core.exportEvents();
  }

  clearEvents(): void {
    this.core.clearEvents();
  }

  destroy(): void {
    this.core.destroy();
  }
}
