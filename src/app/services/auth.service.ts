import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { SessionManagerService } from './session-manager.service'; // Injecció de SessionManagerService

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
  };
  user_id: string;
  expires_at: string;
  created_at: string;
  expiracy: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth/login`;
  private loginUrl = `${this.apiUrl}/login`;
  private logoutUrl = `${this.apiUrl}/logout`;
  private refreshUrl = `${this.apiUrl}/refresh-token`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionManagerService: SessionManagerService
  ) {
    this.sessionManagerService.sessionExpired.subscribe(() => {
      this.cleanSession();
      this.router.navigate(['/login']);
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.loginUrl, { username, password }, { withCredentials: true })
      .pipe(
        tap((response: LoginResponse) => {
          if (response && response.access_token) {
            this.saveToken(response.access_token);
            this.sessionManagerService.startInactivityCheck();
            this.router.navigate(['/private']);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post(this.logoutUrl, {}).pipe(
      tap(() => {
        this.cleanSession();
        this.sessionManagerService.stopInactivityCheck(); // Aturem la monitorització quan es fa logout
        this.router.navigate(['/login']);
      }),
      map(() => undefined),
      catchError((error) => {
        console.error('Error al tancar sessió:', error);
        this.cleanSession();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  refreshToken(access_token: string): Observable<string> {
    return this.http
      .post<{ access_token: string }>(this.refreshUrl, { access_token }, { withCredentials: true })
      .pipe(
        map((response) => {
          const newToken = response.access_token;
          if (newToken) {
            this.saveToken(newToken);
          }
          return newToken;
        }),
        catchError((err) => {
          console.error('Error refreshing token:', err);
          this.cleanSession();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  cleanSession(): void {
    localStorage.removeItem('accessToken');
  }

  getRefreshUrl(): string {
    return this.refreshUrl;
  }
}
