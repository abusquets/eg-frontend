import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SessionExpirationDialogComponent } from '../session/session-expiration-dialog/session-expiration-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SessionManagerService {
  private lastActivityTimestamp: number = Date.now();
  private inactivityTimeout: number = environment.inactivityTimeout;
  private warningTimeout: number = environment.inactivityTimeoutAlert;
  private inactivityCheckInterval: any;
  private warningTimeoutId: any;

  public sessionExpired: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {
    this.monitorUserActivity();
  }

  private monitorUserActivity(): void {
    document.addEventListener('mousemove', () => this.updateActivity());
    document.addEventListener('keydown', () => this.updateActivity());
  }

  private updateActivity(): void {
    if (!this.isLoggedIn()) {
      return;
    }

    this.lastActivityTimestamp = Date.now();
    console.log('Activity detected. We reset the counter.');

    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
      console.log('Warning timer cleared.');
    }
  }

  startInactivityCheck(): void {
    console.log('Starting inactivity control.');

    this.inactivityCheckInterval = setInterval(() => {
      if (!this.isLoggedIn()) {
        console.log('User not logged in. Inactivity is not checked.');
        return; // If you are not logged in, we do nothing
      }

      const now = Date.now();

      if (now - this.lastActivityTimestamp > this.inactivityTimeout) {
        console.log('Inactivity time exceeded. Login management.');
        this.handleInactivity();
      } else if (now - this.lastActivityTimestamp > this.warningTimeout && !this.warningTimeoutId) {
        console.log('The warning for the session is activated.');
        this.showSessionExpirationWarning();
      }
    }, 1000);
  }

  private isLoggedIn(): boolean {
    // Check if there is an access token in the localStorage
    return !!localStorage.getItem('accessToken');
  }

  private showSessionExpirationWarning(): void {
    if (this.warningTimeoutId) {
      console.log('Warning already shown. The dialog does not reopen.');
      return;
    }

    const dialogRef = this.dialog.open(SessionExpirationDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'extend') {
        console.log('Session extended by the user.');
        this.updateActivity();
      } else {
        console.log('The user has not extended the session.');
        this.handleInactivity();
      }
    });

    this.warningTimeoutId = setTimeout(() => {
      console.log('The time to extend the session has expired.');
      this.handleInactivity();
      dialogRef.close();
    }, 30000);
  }

  private handleInactivity(): void {
    console.log('Logging out due to inactivity...');
    clearInterval(this.inactivityCheckInterval);

    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }

    this.dialog.closeAll();
    this.sessionExpired.next();
    this.router.navigate(['/login']);
  }

  stopInactivityCheck(): void {
    console.log('Stopping the inactivity control.');
    clearInterval(this.inactivityCheckInterval);
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  extendSession(): void {
    console.log('Resetting the inactivity counter.');
    this.lastActivityTimestamp = Date.now();
  }

  forceLogout(): void {
    console.log('Force logout.');
    this.handleInactivity();
  }
}
