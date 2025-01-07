import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let modifiedReq = req;

  const isRefreshRequest = req.url === authService.getRefreshUrl();

  // We add the authentication token if it exists and we are not making the refresh request
  if (token && !isRefreshRequest) {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(modifiedReq).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        return event; // Pass the answer if everything is correct
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      console.log('Error response:', error); // Add a log to see the full error
      if (error.status === 401) {
        // We check if the error contains information about an expired token
        const errorDetail = error.error?.detail || '';
        if (
          errorDetail.toLowerCase().includes('expired') ||
          errorDetail.toLowerCase().includes('token')
        ) {
          return authService.refreshToken(token!).pipe(
            switchMap((newToken: string) => {
              authService.saveToken(newToken);
              const newRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              });
              return next(newRequest);
            }),
            catchError((refreshError) => {
              authService.cleanSession();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // If it is not an expired token error, clear the session and redirect to login
          authService.cleanSession();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
