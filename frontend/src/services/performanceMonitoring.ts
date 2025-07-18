interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  timestamp: number;
  category: 'page-load' | 'api-call' | 'component-render' | 'user-interaction';
  metadata?: Record<string, any>;
}

interface PerformanceThresholds {
  pageLoad: number;
  apiCall: number;
  componentRender: number;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000;
  private thresholds: PerformanceThresholds = {
    pageLoad: 3000, // 3 seconds
    apiCall: 5000, // 5 seconds
    componentRender: 100, // 100ms
  };

  // Track page load performance
  trackPageLoad(route: string) {
    const startTime = performance.now();
    
    // Wait for page to be fully loaded
    window.addEventListener('load', () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.addMetric({
        name: 'page-load',
        value: loadTime,
        category: 'page-load',
        metadata: { route, isSlowLoad: loadTime > this.thresholds.pageLoad }
      });
    }, { once: true });
  }

  // Track API call performance
  trackAPICall(endpoint: string, method: string, duration: number, success: boolean) {
    this.addMetric({
      name: 'api-call',
      value: duration,
      category: 'api-call',
      metadata: {
        endpoint,
        method,
        success,
        isSlowAPI: duration > this.thresholds.apiCall
      }
    });
  }

  // Track component render performance
  trackComponentRender(componentName: string, renderTime: number) {
    this.addMetric({
      name: 'component-render',
      value: renderTime,
      category: 'component-render',
      metadata: {
        componentName,
        isSlowRender: renderTime > this.thresholds.componentRender
      }
    });
  }

  // Track user interactions
  trackUserInteraction(action: string, element: string, duration?: number) {
    this.addMetric({
      name: 'user-interaction',
      value: duration || 0,
      category: 'user-interaction',
      metadata: { action, element }
    });
  }

  // Add metric to collection
  private addMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>) {
    const fullMetric: PerformanceMetric = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...metric
    };

    this.metrics.unshift(fullMetric);
    
    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(0, this.maxMetrics);
    }

    // Log slow performance
    if (this.isSlowPerformance(fullMetric)) {
      console.warn('Slow performance detected:', fullMetric);
    }

    console.log('Performance metric:', fullMetric);
  }

  // Check if performance is below threshold
  private isSlowPerformance(metric: PerformanceMetric): boolean {
    switch (metric.category) {
      case 'page-load':
        return metric.value > this.thresholds.pageLoad;
      case 'api-call':
        return metric.value > this.thresholds.apiCall;
      case 'component-render':
        return metric.value > this.thresholds.componentRender;
      default:
        return false;
    }
  }

  // Get performance summary
  getPerformanceSummary() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp > oneHourAgo);

    const summary = {
      totalMetrics: recentMetrics.length,
      averagePageLoad: this.getAverageByCategory(recentMetrics, 'page-load'),
      averageAPICall: this.getAverageByCategory(recentMetrics, 'api-call'),
      averageComponentRender: this.getAverageByCategory(recentMetrics, 'component-render'),
      slowOperations: recentMetrics.filter(m => this.isSlowPerformance(m)).length,
    };

    return summary;
  }

  private getAverageByCategory(metrics: PerformanceMetric[], category: PerformanceMetric['category']): number {
    const categoryMetrics = metrics.filter(m => m.category === category);
    if (categoryMetrics.length === 0) return 0;
    
    const sum = categoryMetrics.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / categoryMetrics.length);
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitoringService();
