import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private lastActivityTimestamp: number = Date.now();

  constructor() {
    document.addEventListener('mousemove', () => this.updateActivity());
    document.addEventListener('keydown', () => this.updateActivity());
  }

  updateActivity(): void {
    this.lastActivityTimestamp = Date.now();
  }

  getLastActivityTimestamp(): number {
    return this.lastActivityTimestamp;
  }

  hasRecentActivity(thresholdInMs: number): boolean {
    const now = Date.now();
    return now - this.lastActivityTimestamp < thresholdInMs;
  }
}
