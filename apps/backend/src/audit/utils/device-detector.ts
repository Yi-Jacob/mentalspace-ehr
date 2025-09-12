import { Request } from 'express';

export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  os: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Parse User-Agent string to extract device, browser, and OS information
 */
export class DeviceDetector {
  /**
   * Extract device information from request
   */
  static extractDeviceInfo(req: Request): DeviceInfo {
    const userAgent = req.get('User-Agent') || 'unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    return {
      deviceType: this.detectDeviceType(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      ipAddress,
      userAgent,
    };
  }

  /**
   * Detect device type from User-Agent
   */
  private static detectDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' | 'unknown' {
    const ua = userAgent.toLowerCase();

    // Check for mobile devices
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'mobile';
    }

    // Check for tablets
    if (ua.includes('tablet') || ua.includes('ipad') || 
        (ua.includes('android') && !ua.includes('mobile'))) {
      return 'tablet';
    }

    // Check for desktop indicators
    if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux') ||
        ua.includes('chrome') || ua.includes('firefox') || ua.includes('safari') ||
        ua.includes('edge') || ua.includes('opera')) {
      return 'desktop';
    }

    return 'unknown';
  }

  /**
   * Detect browser from User-Agent
   */
  private static detectBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes('chrome') && !ua.includes('edge')) {
      return 'Chrome';
    }
    if (ua.includes('firefox')) {
      return 'Firefox';
    }
    if (ua.includes('safari') && !ua.includes('chrome')) {
      return 'Safari';
    }
    if (ua.includes('edge')) {
      return 'Edge';
    }
    if (ua.includes('opera')) {
      return 'Opera';
    }
    if (ua.includes('internet explorer') || ua.includes('msie')) {
      return 'Internet Explorer';
    }
    if (ua.includes('brave')) {
      return 'Brave';
    }

    return 'Unknown';
  }

  /**
   * Detect operating system from User-Agent
   */
  private static detectOS(userAgent: string): string {
    const ua = userAgent.toLowerCase();

    if (ua.includes('windows nt 10')) {
      return 'Windows 10';
    }
    if (ua.includes('windows nt 6.3')) {
      return 'Windows 8.1';
    }
    if (ua.includes('windows nt 6.2')) {
      return 'Windows 8';
    }
    if (ua.includes('windows nt 6.1')) {
      return 'Windows 7';
    }
    if (ua.includes('windows nt 6.0')) {
      return 'Windows Vista';
    }
    if (ua.includes('windows nt 5.1')) {
      return 'Windows XP';
    }
    if (ua.includes('windows')) {
      return 'Windows';
    }
    if (ua.includes('macintosh') || ua.includes('mac os x')) {
      return 'macOS';
    }
    if (ua.includes('linux')) {
      return 'Linux';
    }
    if (ua.includes('android')) {
      return 'Android';
    }
    if (ua.includes('iphone') || ua.includes('ipad')) {
      return 'iOS';
    }

    return 'Unknown';
  }

  /**
   * Get location information from IP address (optional enhancement)
   * This would require a service like ipapi.co or similar
   */
  static async getLocationFromIP(ipAddress: string): Promise<{
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  }> {
    // For now, return empty object
    // In production, you could integrate with IP geolocation services
    return {};
  }
}
