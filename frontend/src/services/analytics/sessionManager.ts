
import { UserSession } from './types';

export class SessionManager {
  private session: UserSession;

  constructor() {
    this.session = {
      id: crypto.randomUUID(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
    };
  }

  getCurrentSession(): UserSession {
    return { ...this.session };
  }

  incrementPageViews(): void {
    this.session.pageViews++;
  }

  incrementInteractions(): void {
    this.session.interactions++;
  }

  setUserId(userId: string): void {
    this.session.userId = userId;
  }

  endSession(): void {
    this.session.endTime = Date.now();
  }

  getSessionDuration(): number {
    const endTime = this.session.endTime || Date.now();
    return endTime - this.session.startTime;
  }
}
