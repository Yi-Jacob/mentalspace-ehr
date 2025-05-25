
import { AnalyticsEvent } from './types';

export class AnalyticsUtils {
  static getEventsByCategory(events: AnalyticsEvent[], category: AnalyticsEvent['category']): AnalyticsEvent[] {
    return events.filter(e => e.category === category);
  }

  static getEventCount(events: AnalyticsEvent[], category: AnalyticsEvent['category']): number {
    return events.filter(e => e.category === category).length;
  }

  static getFeatureUsageStats(events: AnalyticsEvent[]): Record<string, number> {
    const featureEvents = events.filter(e => e.category === 'feature_usage');
    const stats: Record<string, number> = {};
    
    featureEvents.forEach(event => {
      const feature = event.properties?.feature || event.name;
      stats[feature] = (stats[feature] || 0) + 1;
    });
    
    return stats;
  }

  static getUserActionStats(events: AnalyticsEvent[]): Record<string, number> {
    const actionEvents = events.filter(e => e.category === 'user_action');
    const stats: Record<string, number> = {};
    
    actionEvents.forEach(event => {
      const action = event.properties?.action || event.name;
      stats[action] = (stats[action] || 0) + 1;
    });
    
    return stats;
  }

  static filterRecentEvents(events: AnalyticsEvent[], hoursAgo: number = 24): AnalyticsEvent[] {
    const now = Date.now();
    const timeThreshold = now - (hoursAgo * 60 * 60 * 1000);
    return events.filter(e => e.timestamp > timeThreshold);
  }

  static getEventsByTimeRange(events: AnalyticsEvent[], startTime: number, endTime: number): AnalyticsEvent[] {
    return events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
  }
}
