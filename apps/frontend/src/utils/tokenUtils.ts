/**
 * Token utility functions for JWT validation and management
 */

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  type?: string;
}

/**
 * Check if a JWT token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  try {
    const payload = parseTokenPayload(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

/**
 * Parse JWT token payload without verification
 */
export function parseTokenPayload(token: string): TokenPayload {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    throw new Error('Invalid token format');
  }
}

/**
 * Get time until token expires in seconds
 */
export function getTimeUntilExpiry(token: string): number {
  try {
    const payload = parseTokenPayload(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - currentTime);
  } catch (error) {
    return 0;
  }
}

/**
 * Check if token will expire within the specified minutes
 */
export function isTokenExpiringSoon(token: string, minutes: number = 5): boolean {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  return timeUntilExpiry <= (minutes * 60);
}

/**
 * Get a human-readable time until expiry
 */
export function getTimeUntilExpiryString(token: string): string {
  const seconds = getTimeUntilExpiry(token);
  
  if (seconds <= 0) {
    return 'expired';
  }
  
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
}
